# Cup and Flipt

<div align="center">
  <img src="../images/cup.svg" alt="CUP" width="240" />
</div>

## Overview

This application is designed to demonstrate [cup](https://github.com/flipt-io/cup), configured to manage Flipt flag state.

Cup is a tool for creating custom declarative APIs over Git repositories and SCMs.
In this labs section we leverage the Flipt Cup controller to manage Flipt flag state in a target Git repository and Gitea SCM.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Cup CLI](https://github.com/flipt-io/cup#installation)

## Usage

1. `cd` into this directory (e.g. `cd cup`)
1. Run `docker compose up --build`
1. In another terminal window, run `cup defs` to connect to `cupd` and see available resources
1. Next, run `cup get flags` to see currently served flags

## Troubleshooting

If you run into any issues, please [open an issue](https://github.com/flipt-io/labs/issues/new&labels=cup) and we'll get back to you as soon as we can.
