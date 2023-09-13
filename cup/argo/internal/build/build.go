package build

import (
	"context"
	"crypto/sha256"
	"fmt"

	"dagger.io/dagger"
)

const (
	goBuildCachePath = "/root/.cache/go-build"
	goModCachePath   = "/go/pkg/mod"
)

func Build(ctx context.Context, client *dagger.Client) (*dagger.Container, error) {
	base := client.Container().
		From("golang:1.21-alpine3.18").
		WithEnvVariable("GOCACHE", goBuildCachePath).
		WithEnvVariable("GOMODCACHE", goModCachePath).
		WithExec([]string{"apk", "add", "gcc", "build-base"}).
		WithDirectory("/src", client.Host().Directory(".")).
		WithWorkdir("/src")

	sumContents, err := base.File("go.sum").Contents(ctx)
	if err != nil {
		return nil, err
	}

	sum := fmt.Sprintf("%x", sha256.Sum256([]byte(sumContents)))
	var (
		cacheGoBuild = client.CacheVolume(fmt.Sprintf("go-build-%s", sum))
		cacheGoMod   = client.CacheVolume(fmt.Sprintf("go-mod-%s", sum))
	)

	base = base.
		WithMountedCache(goBuildCachePath, cacheGoBuild).
		WithMountedCache(goModCachePath, cacheGoMod)

	return base.
		WithExec([]string{"sh", "-c", "go build -o bin/service ./cmd/service/*.go"}).
		WithDefaultArgs(dagger.ContainerWithDefaultArgsOpts{
			Args: []string{"/src/bin/service"},
		}).
		Sync(ctx)
}
