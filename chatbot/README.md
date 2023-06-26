# chatbot

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/flipt-io/labs?quickstart=1)

This repository serves as set of tutorials on how Flipt works and how to integrate it into an existing application.

Here we have a chatbot appliction that leverages Flipt in the following ways:

- Use a simple feature flag to control the availability of the chatbot
- Use segmentation to determine which sentiment or persona our chatbot should use based on the user's username.
- Using Git as a source of truth and leveraging GitOps for our feature flag data showing how to use Flipt without a UI.

## Architecture

TODO - Add architecture diagram

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Usage

1. Clone this repository
1. `cd` into the repository directory (e.g. `cd chatbot`)
1. Run `./scripts/start`
