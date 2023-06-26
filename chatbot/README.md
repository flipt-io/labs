# chatbot

This repository serves as set of tutorials on how Flipt works and how to integrate it into an existing application.

![Flipt Chatbot](../images/chatbot.png)

Here we have a chatbot appliction that leverages Flipt in the following ways:

- Use a simple feature flag to control the availability of the chatbot
- Use segmentation to determine which sentiment or persona our chatbot should use based on the user's username.
- Using Git as a source of truth and leveraging GitOps for our feature flag data showing how to use Flipt without a UI.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- `OPENAI_API_KEY` environment variable set to your OpenAI API key. You can get one [here](https://beta.openai.com/). (optional)

## Usage

1. Clone this repository
1. `cd` into this directory (e.g. `cd chatbot`)
1. Run `./scripts/start`
1. Open <http://localhost:3000> in your browser if it doesn't open automatically
1. Start with the 'Basic' tutorial, then move on to the 'Advanced' tutorial, etc
