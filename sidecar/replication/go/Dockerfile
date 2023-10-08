FROM golang:1.21-alpine

WORKDIR /app

COPY go.* .
COPY index.html.tmpl .
COPY main.go .

RUN go build -o /evaluation-client

EXPOSE 8000

CMD ["/evaluation-client"]