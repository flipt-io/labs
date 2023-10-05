Flipt as a Sidecar
------------

The intent of this lab is to explore the ways that clients can achieve fast evaluations from Flipt for their feature flags. The use case here is that users would like data locality for their feature flag state, so they do not have to worry about network latency to evaluate a feature, especially for their most critical application paths.

## Replication

This project is housed under the `replication` directory. The purpose is for a user to run their application which depends on feature flags with a sidecar Flipt process that pulls data from either an Object Store (S3 bucket) or a Local Filesystem to the container. The evaluation data can then be accessed over `localhost` by talking to the Flipt sidecar.

Lets get started!

Prerequisites:
- [Docker](https://www.docker.com/)
- [Kubectl](https://kubernetes.io/docs/reference/kubectl/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)

### Object Store

Run the deploy script `scripts/start-object-store` to provision the cluster and start all the necessary deployments and services.

<img src="./replication/diagrams/diagram-object-store.svg" alt="Object Store Replication" width="500px" />

This above script deploys the following to Kubernetes:
- `minio`: Object store that has an S3 compatible API
- `flipt-master`: Serves as the main Flipt application, this is where users will be accessing the UI to make relevant changes
- `sample-app`: Serves as the pod with Flipt running as a sidecar, `flipt-sidecar`. There is also a container called `evaluation-client` that will make evaluation calls to the sidecar
- `flipt-exporter`: CronJob that runs on a 1-minute interval that exports data out of the Flipt master, and puts those changes into the object store

### Local FS

Run the deploy script `scripts/start-local` to provision the cluster and start all the necessary deployments and services.

<img src="./replication/diagrams/diagram-local.svg" alt="Local Replication" width="500px" />

The above script deploys all of the components that the Object Store script does, except for `minio`. Instead it uses [Kubernetes PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) for the `flipt-exporter` to supply data to.

---

### GUI

Data is seeded into the `flipt-master` instance already via a Kubernetes job called `flipt-seed`. Now you can access the `sample-app` and start playing around with the evaluations. Here are the steps to do so:

1. Access the frontend for the `sample-app` via Kubernetes port-forward

```bash
$ kubectl port-forward svc/sample-app --namespace default 8000:8000
```

2. Switch between `Sidecar` and `Master` and enter a flag `flag_001 - flag_050` and evaluate the time difference


You can also access the `flipt-master` via Kubernetes port-forward and make changes to the state via the UI:

```bash
$ kubectl port-forward svc/flipt-master --namespace default 8080:8080
```