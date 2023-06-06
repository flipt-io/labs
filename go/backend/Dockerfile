FROM golang:1.20-alpine3.18 AS build

WORKDIR /app

RUN apk update && apk add --no-cache gcc build-base

COPY go.sum .
COPY go.mod .
COPY main.go .

RUN go mod download

ENV CGO_ENABLED=1 GOOS=linux

RUN go build -o ./bin/backend .

FROM alpine:3.18

RUN apk update && apk add --no-cache git bash

RUN git clone https://github.com/vishnubob/wait-for-it.git /tmp && \
    chmod +x /tmp/wait-for-it.sh

COPY --from=build /app/bin/backend /

CMD ["./backend"]