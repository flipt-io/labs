package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/exec"

	"dagger.io/dagger"
	"go.flipt.io/labs/cup/argo/internal/build"
	"go.flipt.io/labs/cup/argo/internal/publish"
	"sigs.k8s.io/kind/pkg/cluster"
)

const (
	clusterName     = "cup-argo"
	contextName     = "kind-" + clusterName
	argoInstallYaml = "https://raw.githubusercontent.com/argoproj/argo-cd/master/manifests/install.yaml"
)

func main() {
	ctx := context.Background()
	slog.Info("Checking for cluster...")

	provider := cluster.NewProvider(cluster.ProviderWithDocker())
	nodes, err := provider.ListNodes(clusterName)
	exitOnError(err)
	if len(nodes) < 1 {
		slog.Info("Creating cluster...")

		err := provider.Create(clusterName, cluster.CreateWithConfigFile("kind-config.yml"))
		exitOnError(err)
	}

	slog.Info("Cluster created")

	context, err := sh("kubectl", args("config", "current-context"))
	exitOnError(err)

	if context != contextName {
		_, err := sh("kubectl", args("config", "set-context", contextName))
		exitOnError(err)
	}

	{
		slog.Info("Installing Gitea...")
		// install gitea
		_, _ = kube("default", args("create", "namespace", "gitea"))

		// configure gitea
		_, err = kube("gitea", args("apply", "-f", "manifests/gitea.yml"))
		exitOnError(err)

		// wait for gitea provision job to complete
		_, err = kube("gitea", args("wait", "jobs", "provision-gitea", "--for", "condition=complete", "--timeout", "60s"))
		exitOnError(err)

		slog.Info("Gitea ready", "address", "http://localhost:3000", "username", "cup", "password", "password")
	}

	{
		exitOnError(buildAndPublishService(ctx))
	}

	{
		slog.Info("Installing Argo...")
		// create if not exist
		_, _ = kube("default", args("create", "namespace", "argocd"))

		// get argo install yaml
		resp, err := http.Get(argoInstallYaml)
		exitOnError(err)

		if resp.StatusCode != http.StatusOK {
			exitOnError(fmt.Errorf("unexpected status code %d", resp.StatusCode))
		}

		// install argocd
		_, err = kube("argocd", args("apply", "-f", "-"), stdin(resp.Body))

		// wait for argo to be ready
		_, err = kube("argocd", args("wait", "deployment", "argocd-server", "--for", "condition=Available=true", "--timeout", "120s"))
		exitOnError(err)

		// configure default app via Argo
		_, err = kube("argocd", args("apply", "-f", "manifests/argo.yml"))
		exitOnError(err)

		password, err := kube("argocd", args("get", "-n", "argocd", "secrets", "argocd-initial-admin-secret", "-o=go-template='{{.data.password|base64decode}}'"))
		exitOnError(err)
		slog.Info("Argo ready", "address", "http://localhost:8080", "username", "admin", "password", password)
	}

	{
		slog.Info("Installing Cup...")
		// install cup
		_, _ = kube("default", args("create", "namespace", "cup"))

		_, err = kube("cup", args("apply", "-f", "manifests/cup.yml"))
		exitOnError(err)

		// wait for gitea provision job to complete
		_, err = kube("cup", args("wait", "deployment", "cup", "--for", "condition=Available=true", "--timeout", "60s"))
		exitOnError(err)

		slog.Info("Cup ready", "address", "http://localhost:8181")
	}

	// wait for default app to provision
	_, err = kube("default", args("wait", "deployment", "my-app", "--for", "condition=Available=true", "--timeout", "120s"))
	exitOnError(err)

	slog.Info("App is ready")

}

func exitOnError(err error) {
	if err != nil {
		slog.Error("Exiting...", "error", err)
		os.Exit(1)
	}
}

func kube(ns string, opts ...option) (string, error) {
	return sh("kubectl", append([]option{args("-n", ns)}, opts...)...)
}

type cmdOptions struct {
	args   []string
	stdin  io.Reader
	stderr io.Writer
}

type option func(*cmdOptions)

func args(args ...string) option {
	return func(co *cmdOptions) {
		co.args = append(co.args, args...)
	}
}

func stdin(r io.Reader) option {
	return func(co *cmdOptions) {
		co.stdin = r
	}
}

func stderr(w io.Writer) option {
	return func(co *cmdOptions) {
		co.stderr = w
	}
}

func sh(cmd string, opts ...option) (string, error) {
	co := cmdOptions{
		stderr: os.Stderr,
	}
	for _, opt := range opts {
		opt(&co)
	}

	buf := &bytes.Buffer{}
	command := exec.Command(cmd, co.args...)
	command.Stdin = co.stdin
	command.Stderr = co.stderr
	command.Stdout = buf
	if err := command.Run(); err != nil {
		return "", err
	}

	return buf.String(), nil
}

func buildAndPublishService(ctx context.Context) error {
	client, err := dagger.Connect(ctx, dagger.WithLogOutput(os.Stderr))
	if err != nil {
		return err
	}
	defer client.Close()

	platform, err := client.DefaultPlatform(ctx)
	if err != nil {
		return err
	}

	slog.Info("Building service...")

	service, err := build.Build(ctx, client)
	if err != nil {
		return err
	}

	slog.Info("Loading service into kind...")

	ref, err := publish.Publish(ctx, publish.PublishSpec{
		TargetType:  publish.KindTargetType,
		KindCluster: clusterName,
		Target:      "cup.flipt.io/argo/service:latest",
	}, client, publish.Variants{
		platform: service,
	})
	if err != nil {
		return err
	}

	slog.Info("Image loaded", "ref", ref)

	return nil
}
