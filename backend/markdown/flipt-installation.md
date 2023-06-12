---
title: "Installation"
---

## Docker

The simplest way to run Flipt is via Docker. This streamlines the installation
and configuration by using a reliable runtime.

### Prerequisites

Docker installation is required on the host, see the [official installation docs](https://docs.docker.com/install/).

<Note>
  Flipt requires Docker Engine version
  [20.10](https://docs.docker.com/engine/release-notes/20.10/) or higher.
</Note>

### Run the image

```console
docker run -d \
    -p 8080:8080 \
    -p 9000:9000 \
    -v $HOME/flipt:/var/opt/flipt \
    flipt/flipt:latest
```

This will download the image and start a Flipt container and publish ports
needed to access the UI and backend server. All persistent Flipt data will be
stored in `$HOME/flipt`.

<Info>
  `$HOME/flipt` is just used as an example, you can use any directory you would
  like on the host.
</Info>

The Flipt container uses host-mounted volumes to persist data:

| Host location | Container location | Purpose                      |
| ------------- | ------------------ | ---------------------------- |
| $HOME/flipt   | /var/opt/flipt     | For storing application data |

This allows data to persist between Docker container restarts.

<Warning>
  If you don't use mounted volumes to persist your data, your data will be lost
  when the container exits!
</Warning>

After starting the container you can visit http://0.0.0.0:8080 to view the
application.

<Note>
  Flipt runs without the root user in the Docker container as of
  [v1.6.1](https://github.com/flipt-io/flipt/releases/tag/v1.6.1).
</Note>

#### Configuration

There is a default configuration file within the image. In order to supply a custom configuration, update the `docker run` command to mount your local config into the container

```console
docker run -d \
    -p 8080:8080 \
    -p 9000:9000 \
    -v $HOME/flipt:/var/opt/flipt \
    -v $HOME/flipt/config.yaml:/etc/flipt/config.yaml \
    flipt/flipt:latest
```

## Kubernetes/Helm

You can run Flipt in Kubernetes using the Flipt [Helm](https://helm.sh) chart.

Any issues or suggestions on how to improve the Flipt Helm chart are welcome in the [chart repository](https://github.com/flipt-io/helm-charts).

### Prerequisites

[Helm](https://helm.sh) must be installed to use the chart. Please refer to
Helm's [documentation](https://helm.sh/docs/) to get started.

Once Helm is set up properly, add the Flipt Helm repo as follows:

```console
helm repo add flipt https://helm.flipt.io
```

### Installing

You can install the Flipt Helm chart with the following command:

```console
helm install flipt flipt/flipt
```

## Binary

You can always download the latest release archive of Flipt from the
[Releases](https://github.com/flipt-io/flipt/releases) section on GitHub.

Download to an accessible location on your host and un-zip with the following
commands (requires [jq](https://stedolan.github.io/jq/)):

```console
$ export FLIPT_VERSION=$(curl --silent "https://api.github.com/repos/flipt-io/flipt/releases/latest" | jq '.tag_name?' | tr -d '"' | tr -d 'v')
$ curl -L "https://github.com/flipt-io/flipt/releases/download/v${FLIPT_VERSION}/flipt_${FLIPT_VERSION}_linux_x86_64.tar.gz" -o flipt.tar.gz && \
    tar -xvf flipt.tar.gz && \
    chmod +x ./flipt
```

This archive contains the Flipt binary, configuration, database migrations,
README, LICENSE, and CHANGELOG files.

<Note>
  You will need to update the config file: `default.yml` if your migrations and
  database locations differ from the standard locations.
</Note>

Run the Flipt binary with:

```console
./flipt [--config OPTIONAL_PATH_TO_YOUR_CONFIG]
```

As of version [v1.23](https://github.com/flipt-io/flipt/releases/tag/v1.23.0), the Flipt binary will check in a few different locations for server configuration (in order):

1. `--config` flag as an override
2. `{{ USER_CONFIG_DIR }}/flipt/config.yml` (the `USER_CONFIG_DIR` value is based on your architecture and specified [here](https://pkg.go.dev/os#UserConfigDir))
3. `/etc/flipt/config/default.yml`

See the [Configuration](/configuration) section for more details.

## Supported Architectures

Flipt is built for the following architectures/os:

- **amd64** / **linux**
- **arm64** / **linux**

You can find the binaries for each architecture in the [Latest Release](https://github.com/flipt-io/flipt/releases/latest) assets section on GitHub.

The [Docker image](https://hub.docker.com/r/flipt/flipt/tags) for Flipt is also multi-arch and supports both **amd64** and **arm64** architectures on **Linux**.

If you need a different architecture, please open an issue on the [GitHub repository](https://github.com/flipt-io/flipt/issues) and we will try to accommodate your request.
