package main

import (
	"embed"
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"time"

	"code.gitea.io/sdk/gitea"
	"github.com/go-git/go-billy/v5/memfs"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/config"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	githttp "github.com/go-git/go-git/v5/plumbing/transport/http"
	"github.com/go-git/go-git/v5/storage/memory"
)

var (
	giteaURL      = flag.String("gitea-url", "http://localhost:3000", "Address for target gitea service")
	adminUser     = flag.String("admin-user", "flipt", "Admin user for Gitea")
	adminPassword = flag.String("admin-password", "password", "Admin password for Gitea")
	repository    = flag.String("repo", "features", "Repository name to provision")

	//go:embed main/*
	mainFS embed.FS
	//go:embed pr_one/*
	prOneFS embed.FS
	//go:embed pr_two/*
	prTwo embed.FS
)

func main() {
	flag.Parse()

	fatalOnError := func(err error) {
		if err != nil {
			log.Fatal(err)
		}
	}

	if *giteaURL == "" {
		log.Fatal("Must supply non-empty --gitea-url flag value.")
	}

	fmt.Fprintln(os.Stderr, "Configuring gitea at", *giteaURL)

	// provision empty target gitea instance
	fatalOnError(setupGitea())

	// ensure we can connect to gitea
	cli, err := giteaClient()
	fatalOnError(err)

	// create configured repository
	_, err = createRepo(cli)
	fatalOnError(err)

	workdir := memfs.New()

	repo, err := git.InitWithOptions(memory.NewStorage(), workdir, git.InitOptions{
		DefaultBranch: "main",
	})
	fatalOnError(err)

	repo.CreateRemote(&config.RemoteConfig{
		Name: "origin",
		URLs: []string{fmt.Sprintf("%s/flipt/%s.git", *giteaURL, *repository)},
	})

	commit, err := copyAndPush(repo, plumbing.ZeroHash, "main", "feat: define `chat-enabled` feature flag", mainFS)
	fatalOnError(err)

	message := "feat: enable `chat-enabled` feature flag"
	commit, err = copyAndPush(repo, commit, "pr_one", message, prOneFS)

	fatalOnError(err)
	_, _, err = cli.CreatePullRequest(*adminUser, *repository, gitea.CreatePullRequestOption{
		Head:  "pr_one",
		Base:  "main",
		Title: message,
		Body:  "Enable the `chat-enabled` feature flag.",
	})
	fatalOnError(err)

	message = "feat: define `chat-admin` feature flag"
	commit, err = copyAndPush(repo, commit, "pr_two", message, prTwo)
	fatalOnError(err)

	_, _, err = cli.CreatePullRequest(*adminUser, *repository, gitea.CreatePullRequestOption{
		Head:  "pr_two",
		Base:  "main",
		Title: message,
		Body:  "Define the `chat-admin` feature flag.\nTarget intenal user segment.",
	})
	fatalOnError(err)
}

func setupGitea() error {
	val, err := url.ParseQuery(giteaSetupForm)
	if err != nil {
		return err
	}

	val.Set("admin_name", *adminUser)
	val.Set("admin_passwd", *adminPassword)
	val.Set("admin_confirm_passwd", *adminPassword)

	resp, err := http.PostForm(*giteaURL, val)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status: %s", resp.Status)
	}

	return nil
}

func giteaClient() (cli *gitea.Client, err error) {
	for i := 0; i < 20; i++ {
		cli, err = gitea.NewClient(*giteaURL, gitea.SetBasicAuth(*adminUser, *adminPassword))
		if err != nil {
			time.Sleep(time.Second)
			continue
		}
	}

	if cli == nil {
		return nil, errors.New("couldn't connect to gitea")
	}

	return cli, nil
}

func createRepo(cli *gitea.Client) (*gitea.Repository, error) {
	origin, _, err := cli.CreateRepo(gitea.CreateRepoOption{
		Name:          *repository,
		DefaultBranch: "main",
	})

	return origin, err
}

func copyAndPush(repo *git.Repository, hash plumbing.Hash, branch, message string, src fs.FS) (plumbing.Hash, error) {
	tree, err := repo.Worktree()
	if err != nil {
		return plumbing.ZeroHash, err
	}

	// checkout branch if not main from provided hash
	if hash != plumbing.ZeroHash && branch != "main" {
		if err := repo.CreateBranch(&config.Branch{
			Name: branch,
		}); err != nil {
			return plumbing.ZeroHash, err
		}

		if err := tree.Checkout(&git.CheckoutOptions{
			Branch: plumbing.NewBranchReferenceName(branch),
			Hash:   hash,
			Create: true,
			Force:  true,
		}); err != nil {
			return plumbing.ZeroHash, err
		}
	}

	err = fs.WalkDir(src, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() {
			return tree.Filesystem.MkdirAll(path, 0755)
		}

		contents, err := fs.ReadFile(src, path)
		if err != nil {
			return err
		}

		target, err := filepath.Rel(branch, path)
		if err != nil {
			return err
		}

		fi, err := tree.Filesystem.Create(target)
		if err != nil {
			return err
		}

		_, err = fi.Write(contents)
		if err != nil {
			return err
		}

		return fi.Close()
	})
	if err != nil {
		return plumbing.ZeroHash, err
	}

	err = tree.AddWithOptions(&git.AddOptions{All: true})
	if err != nil {
		return plumbing.ZeroHash, err
	}

	commit, err := tree.Commit(message, &git.CommitOptions{
		Author: &object.Signature{Email: "dev@flipt.io", Name: "dev"},
	})
	if err != nil {
		return plumbing.ZeroHash, err
	}

	fmt.Fprintln(os.Stderr, "Pushing", commit)
	if err := repo.Push(&git.PushOptions{
		Auth:       &githttp.BasicAuth{Username: *adminUser, Password: *adminPassword},
		RemoteName: "origin",
		RefSpecs: []config.RefSpec{
			config.RefSpec(fmt.Sprintf("%s:refs/heads/%s", branch, branch)),
			config.RefSpec(fmt.Sprintf("refs/heads/%s:refs/heads/%s", branch, branch)),
		},
	}); err != nil {
		return plumbing.ZeroHash, err
	}

	return commit, nil
}

const giteaSetupForm = "db_type=sqlite3&db_host=localhost%3A3306&db_user=root&db_passwd=&db_name=gitea&ssl_mode=disable&db_schema=&charset=utf8&db_path=%2Fdata%2Fgitea%2Fgitea.db&app_name=Gitea%3A+Git+with+a+cup+of+tea&repo_root_path=%2Fdata%2Fgit%2Frepositories&lfs_root_path=%2Fdata%2Fgit%2Flfs&run_user=git&domain=localhost&ssh_port=22&http_port=3000&app_url=http%3A%2F%2Flocalhost%3A3000%2F&log_root_path=%2Fdata%2Fgitea%2Flog&smtp_addr=&smtp_port=&smtp_from=&smtp_user=&smtp_passwd=&enable_federated_avatar=on&enable_open_id_sign_in=on&enable_open_id_sign_up=on&default_allow_create_organization=on&default_enable_timetracking=on&no_reply_address=noreply.localhost&password_algorithm=pbkdf2&admin_email=dev%40flipt.io"
