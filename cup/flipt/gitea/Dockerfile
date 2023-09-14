FROM golang:1.20-alpine3.18 as build

RUN mkdir /src

ADD go.mod /src/go.mod
ADD go.sum /src/go.sum

WORKDIR /src

RUN go mod download

ADD . /src

RUN mkdir -p bin

RUN go build -o bin/provision ./...

FROM gitea/gitea:latest

COPY --from=build /src/bin/provision /usr/bin/provision
COPY --from=build /src/entrypoint.sh /usr/bin/provision-entrypoint.sh

ENTRYPOINT ["/usr/bin/provision-entrypoint.sh"]
