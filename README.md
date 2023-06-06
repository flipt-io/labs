# chatbot-example

This repository serves as an example for helping people getting started with `flipt`.

It has a `docker-compose` file with multiple components to serve an answer from a prompt that comes in through the API.

## Architecture

TODO - Add architecture diagram

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Usage

1. Clone this repository
2. Run `docker-compose up --build`
3. Send a request to the API

    ```bash
    curl -X POST \
        -H "Content-Type: application/json" \
        -d '{"prompt": "What is home owners insurance?"}' \
        http://localhost:8080/chat
    ```
