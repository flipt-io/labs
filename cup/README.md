# Cup and Flipt

![Cup for Flipt](../images/cup.svg)

## Overview

This application is designed to demonstrate [cup](https://github.com/flipt-io/cup), configured to manage Flipt flag state.

In particular, this application demonstrates how Cup and Flipt can be used together with the Git backend for Flipt.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Cup CLI](https://github.com/flipt-io/cup) cloned and built from source

## Usage

1. `cd` into this directory (e.g. `cd cup`)
1. Run `docker compose up --build`
1. Run `cup defs` to connect to `cupd` and see available resources
1. Run `cup get flags` to see currently served flags

## Troubleshooting

If you run into any issues, please [open an issue](https://github.com/flipt-io/labs/issues/new&labels=cup) and we'll get back to you as soon as we can.
