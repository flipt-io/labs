---
title: Integration
description: This document describes how to integrate Flipt in your existing applications.
---

To learn how to install and run Flipt, see the [Installation](/installation)
documentation.

Once you have the Flipt server up and running within your infrastructure, the
next step is to integrate the Flipt client(s) with your applications that you
would like to be able to use with Flipt.

There are two ways to communicate with the Flipt server:

1. REST API
1. GRPC API

We have also developed several clients in various languages for easier integration.

## REST API

Flipt also comes equipped with a fully functional REST API. The Flipt UI is completely backed by this same API. This means that anything that can be done in the Flipt UI can also be done via the REST API.

The Flipt REST API can also be used with any language that can make HTTP requests. This means that you don't need to use one of the above GRPC clients to integrate your application with Flipt.

The latest version of the REST API is fully documented using the [OpenAPI v3 specification](https://github.com/flipt-io/flipt-openapi) as well as the above [API Reference](/reference/overview).

## REST Clients

### Official Clients

Official Flipt REST clients are currently available in the following languages:

- [Go](https://pkg.go.dev/go.flipt.io/flipt/sdk/go)
- [Node.js/TypeScript](https://github.com/flipt-io/flipt-node)
- [Java](https://github.com/flipt-io/flipt-java)
- [Rust](https://github.com/flipt-io/flipt-rust)
- [Python](https://github.com/flipt-io/flipt-python)

### Generate

You can use [openapi-generator](https://openapi-generator.tech/) to generate client code in your preferred language from the [Flipt OpenAPI v3 specification](https://github.com/flipt-io/flipt-openapi).

While generating clients is outside of the scope of this documentation, an example of generating a Java client with the `openapi-generator` is below.

#### Java Example

1. Install [`openapi-generator`](https://openapi-generator.tech/docs/installation)
2. Generate using `openapi-generator-cli` to desired location:

```
openapi-generator generate -i openapi.yml -g java -o /tmp/flipt/java
```

## GRPC Clients

Since Flipt is a [GRPC](https://grpc.io/) enabled application, you can use a
generated GRPC client for your language of choice.

This means that your application can use the Flipt GRPC client if it is written
in one of the many languages that GRPC supports, including:

- C++
- Java
- Python
- Go
- Ruby
- C#
- Node.js
- Android Java
- Objective-C
- PHP

An example Go application exists [here](https://github.com/flipt-io/flipt/tree/main/examples/basic), showing how you would
integrate with Flipt using the Go GRPC client.

### Official Clients

Official Flipt GRPC clients are currently available for the following languages:

- [Go](https://github.com/flipt-io/flipt-grpc-go) - deprecated: use [Go SDK](https://pkg.go.dev/go.flipt.io/flipt/sdk/go) instead
- [Ruby](https://github.com/flipt-io/flipt-grpc-ruby)

If your language is not listed, please see the section below on how to generate
a native GRPC client manually. If you choose to open-source this client, please
submit a pull request so I can add it to the docs.

### Generate

If a GRPC client in your language is not available for download, you can easily
generate it yourself using the existing
[protobuf definition](https://github.com/flipt-io/flipt/blob/main/rpc/flipt/flipt.proto).
The [GRPC documentation](https://grpc.io/docs/) has extensive examples of how to
generate GRPC clients in each supported language.

<Note>
  GRPC generates both client implementation and server interfaces. To use Flipt
  you only need the GRPC client implementation and can ignore the server code as
  this is implemented by Flipt itself.
</Note>

Below are two examples of how to generate Flipt clients in both Go and Ruby.

#### Go Example

1. Follow setup [here](https://grpc.io/docs/quickstart/go/)
2. Generate using protoc to desired location:

```console
protoc -I ./rpc --go_out=plugins=grpc:/tmp/flipt/go ./rpc/flipt.proto
cd /tmp/flipt/go/flipt
ls
flipt.pb.go          flipt_pb.rb          flipt_services_pb.
```

#### Ruby Example

1. Follow setup [here](https://grpc.io/docs/quickstart/ruby/)
2. Generate using protoc to the desired location:

```console
grpc_tools_ruby_protoc -I ./rpc --ruby_out=/tmp/flipt/ruby --grpc_out=/tmp/flipt/ruby ./rpc/flipt.proto
cd /tmp/flipt/ruby
ls
flipt_pb.rb          flipt_services_pb.rb
```

## Third-Party Client Libraries

Client libraries built by awesome people from the Open Source community:

<Warning>
  These libraries are not maintained by the Flipt team and may not be up to date
  with the latest version of Flipt. Please open an issue or pull request on the
  library's repository if you find any issues.
</Warning>

| Library                                                             | Language   | Author                                                   | Desc                                                                                            |
| ------------------------------------------------------------------- | ---------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [flipt-grpc-python](https://github.com/getsentry/flipt-grpc-python) | Python     | [@getsentry](https://github.com/getsentry)               | Python GRPC bindings for Flipt                                                                  |
| [rflipt](https://github.com/christopherdiehl/rflipt)                | React      | [@christopherdiehl](https://github.com/christopherdiehl) | Components/example project to control React features backed by Flipt                            |
| [flipt-php](https://github.com/fetzi/flipt-php)                     | PHP        | [@fetzi](https://github.com/fetzi)                       | Package for evaluating feature flags via the Flipt REST API using [HTTPlug](http://httplug.io/) |
| [flipt-js](https://github.com/betrybe/flipt-js)                     | Javascript | [@betrybe](https://github.com/betrybe)                   | Flipt library for JS that allows rendering components based on Feature Flags 🎉                 |
