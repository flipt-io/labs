package main

import (
	"bytes"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/exec"

	"sigs.k8s.io/kind/pkg/cluster"
)

const (
	clusterName     = "cup-argo"
	contextName     = "kind-" + clusterName
	argoInstallYaml = "https://raw.githubusercontent.com/argoproj/argo-cd/master/manifests/install.yaml"
)

func main() {
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

	context, err := kube(nil, "config", "current-context")
	exitOnError(err)

	if context != contextName {
		_, err := kube(nil, "config", "set-context", contextName)
		exitOnError(err)
	}
	slog.Info("Context set")

	// create if not exist
	_, _ = kube(nil, "create", "namespace", "argocd")

	// set namespace on context
	_, err = kube(nil, "config", "set", "contexts.kind-cup-argo.namespace", "argocd")
	exitOnError(err)
	slog.Info("Namespace created")

	slog.Info("Installing Argo...")
	// get argo install yaml
	resp, err := http.Get(argoInstallYaml)
	exitOnError(err)

	if resp.StatusCode != http.StatusOK {
		exitOnError(fmt.Errorf("unexpected status code %d", resp.StatusCode))
	}

	// install argocd
	_, err = kube(resp.Body, "apply", "-f", "-")

	// wait for argo to be ready
	_, err = kube(nil, "wait", "deployment", "argocd-server", "--for", "condition=Available=true", "--timeout", "120s")
	exitOnError(err)

	slog.Info("Argo ready")

	// install gitea
	_, _ = kube(nil, "create", "namespace", "gitea")

	_, err = kube(nil, "apply", "-n", "gitea", "-f", "manifests/gitea.yml")
	exitOnError(err)

	// wait for gitea provision job to complete
	_, err = kube(nil, "wait", "-n", "gitea", "jobs", "provision-gitea", "--for", "condition=complete", "--timeout", "60s")
	exitOnError(err)

	slog.Info("Gitea ready")

	// install cup
	_, _ = kube(nil, "create", "namespace", "cup")

	_, err = kube(nil, "apply", "-n", "cup", "-f", "manifests/cup.yml")
	exitOnError(err)

	// wait for gitea provision job to complete
	_, err = kube(nil, "wait", "-n", "cup", "deployment", "cup", "--for", "condition=Available=true", "--timeout", "60s")
	exitOnError(err)

	// configure default app via Argo
	_, err = kube(nil, "apply", "-n", "argocd", "-f", "manifests/argo.yml")
	exitOnError(err)

	// wait for default app to provision
	_, err = kube(nil, "wait", "-n", "default", "deployment", "my-app", "--for", "condition=Available=true", "--timeout", "120s")
	exitOnError(err)

	slog.Info("App is ready")
}

func exitOnError(err error) {
	if err != nil {
		slog.Error("Exiting...", "error", err)
		os.Exit(1)
	}
}

func kube(stdin io.Reader, args ...string) (string, error) {
	return sh(stdin, "kubectl", args...)
}

func sh(stdin io.Reader, cmd string, args ...string) (string, error) {
	buf := &bytes.Buffer{}
	command := exec.Command(cmd, args...)
	command.Stdin = stdin
	command.Stdout = buf
	command.Stderr = os.Stderr
	if err := command.Run(); err != nil {
		return "", err
	}

	return buf.String(), nil
}
