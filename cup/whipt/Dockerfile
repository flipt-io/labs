FROM golang:1.20-alpine3.18

WORKDIR /src

ADD . /src

RUN go mod download

RUN go install ./...

CMD ["sh", "-c", "go run main.go --addr $FLIPT_ADDR"]
