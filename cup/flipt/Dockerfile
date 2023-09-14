FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git

# install more recent nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# install docker from get.docker.com
RUN curl -fsSL https://get.docker.com | bash -

ADD . /app

WORKDIR /app

EXPOSE 3000