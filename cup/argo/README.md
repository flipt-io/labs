Cup + ArgoCD
------------

This labs section explores configuring an end-to-end CD pipeline with Argo and Cup.

![Cup with ArgoCD Diagram](./diagram.svg)

https://github.com/flipt-io/labs/assets/1253326/4dfb87ec-446c-40dc-84d1-2764bd600fd1

The project deploys a simple application via Argo, which responds with a JSON payload containing its environment variables.
It also configures an instance of Cup and a source Git repository hosted via Gitea.

Once deployed to a local `kind` cluster, you can experiment with reading and reconfiguring the deployment configuration via the `cup` CLI.

### Requirements

- Go
- Kubectl
- Docker
- [Cup CLI](https://github.com/flipt-io/cup#cli)
- Dagger (Optional)

### Running

```console
# clone the labs repository
git clone https://github.com/flipt-io/labs.git

# change into this cup with argo directory
cd labs/cup/argo

# run the start script
./scripts/start
```

### Experiment!

This process can take a while for the first time.

It will:

- Create a `kind` cluster
- Build and load a simple Go service into your cluster
- Install Gitea (Git SCM provider) into the cluster
- Install ArgoCD into the cluster
- Install `cupd` into the cluster
- Port-forward the various services
  - [ArgoCD](http://localhost:8080) (Skip the TLS warning check output from previous step for username and password)
  - [Gitea](http://localhost:3000) (Username: `cup` Password: `password`)
  - Cupd API is forwarded to http://localhost:8181
  - Demo app API is forwarded to http://localhost:8282

The end result is an entire CD pipeline in your local Docker instance.
From here you can leverage the `cup` CLI to interface with `cupd`.
The default `cup` CLI configuration should work, given the `cupd` instance is running on `localhost:8181`.

Try out some of the following commands:

```console
# see what resource definitions cup exposes
cup defs

# list available deployments
cup get deployments

# edit the JSON configuration of the app my-app
# note: it will open your default editor (mine is vim)
# when you save and exit, the payload will be validated as a Kubernetes Deployment resource
# if the resource is valid then you should see a pull-request is returned
# open Gitea and merge the pull-request to see the change get applied
cup edit deployments my-app
```
