Cup + ArgoCD
------------

This labs section explore configuring an end to end CD pipeline with Argo and Cup.

![Cup with ArgoCD Diagram](./diagram.svg)

The project deploys a simple application, via Argo, which responds with a message from an environment variable.
It also configure an instance of Cup and a source Git repository hosted via Gitea.

Once deployed to a local `kind` cluster, you can experiment with reading and reconfiguring the deployment configuration via the `cup` CLI.

### Requirements

- Go
- Kubectl
- Docker
- Cup CLI
