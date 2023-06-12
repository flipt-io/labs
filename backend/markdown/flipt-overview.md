---
title: Overview
description: This document describes how to configure the Flipt server.
---

## Configuration File

The default way that Flipt is configured is with the use of a configuration file
[default.yml](https://github.com/flipt-io/flipt/blob/main/config/default.yml).

This file is read when Flipt starts up and configures several important
properties for the server.

<Tip>
  We have both a [JSON
  schema](https://raw.githubusercontent.com/flipt-io/flipt/main/config/flipt.schema.json)
  and a [Cue
  schema](https://raw.githubusercontent.com/flipt-io/flipt/main/config/flipt.schema.cue)
  that you can use to validate your configuration file and it's properties.
</Tip>

You can edit any of these properties to your liking, and on restart Flipt will
pick up the new changes.

<Note>
  These defaults are commented out in
  [default.yml](https://github.com/flipt-io/flipt/blob/main/config/default.yml)
  to give you an idea of what they are. To change them you'll first need to
  uncomment them.
</Note>

These properties are as follows:

### General

| Property               | Description                                                   | Default             | Since   |
| ---------------------- | ------------------------------------------------------------- | ------------------- | ------- |
| ui.enabled             | Enable UI and API docs                                        | true                |         |
| cors.enabled           | Enable CORS support                                           | false               | v0.7.0  |
| cors.allowed_origins   | Sets Access-Control-Allow-Origin header on server             | "\*" (all domains)  | v0.7.0  |
| meta.check_for_updates | Enable check for newer versions of Flipt on startup           | true                | v0.17.0 |
| meta.telemetry_enabled | Enable anonymous telemetry data (see [Telemetry](#telemetry)) | true                | v1.8.0  |
| meta.state_directory   | Directory on the host to store local state                    | $HOME/.config/flipt | v1.8.0  |

### Logging

| Property         | Description                                                                             | Default | Since   |
| ---------------- | --------------------------------------------------------------------------------------- | ------- | ------- |
| log.level        | Level at which messages are logged (trace, debug, info, warn, error, fatal, panic)      | info    |         |
| log.grpc_level   | Level at which gRPC messages are logged (trace, debug, info, warn, error, fatal, panic) | error   | v1.12.0 |
| log.file         | File to log to instead of STDOUT                                                        |         | v0.10.0 |
| log.encoding     | Encoding to use for logging (json, console)                                             | console | v1.12.0 |
| log.keys.time    | Structured logging key used when outputting log timestamp                               | T       | v1.18.1 |
| log.keys.level   | Structured logging key used when outputting log level                                   | L       | v1.18.1 |
| log.keys.message | Structured logging key used when outputting log message                                 | M       | v1.18.1 |

### Server

| Property          | Description                                                    | Default | Since  |
| ----------------- | -------------------------------------------------------------- | ------- | ------ |
| server.protocol   | http or https                                                  | http    | v0.8.0 |
| server.host       | The host address on which to serve the Flipt application       | 0.0.0.0 |        |
| server.http_port  | The HTTP port on which to serve the Flipt REST API and UI      | 8080    |        |
| server.https_port | The HTTPS port on which to serve the Flipt REST API and UI     | 443     | v0.8.0 |
| server.grpc_port  | The port on which to serve the Flipt GRPC server               | 9000    |        |
| server.cert_file  | Path to the certificate file (if protocol is set to https)     |         | v0.8.0 |
| server.cert_key   | Path to the certificate key file (if protocol is set to https) |         | v0.8.0 |

### Audit Events

| Property                 | Description                                     | Default | Since   |
| ------------------------ | ----------------------------------------------- | ------- | ------- |
| audit.buffer.capacity    | Max capacity of buffer to send events to sinks  | 2       | v1.21.0 |
| audit.buffer.flushPeriod | Duration to wait before sending events to sinks | 2m      | v1.21.0 |

#### Audit Events: Log File

| Property                | Description                                                              | Default | Since   |
| ----------------------- | ------------------------------------------------------------------------ | ------- | ------- |
| audit.sinks.log.enabled | Enable log file sink                                                     | false   | v1.21.0 |
| audit.sinks.log.file    | File path to write audit events to. Required if log file sink is enabled |         | v1.21.0 |

### Tracing

| Property         | Description                                | Default | Since   |
| ---------------- | ------------------------------------------ | ------- | ------- |
| tracing.enabled  | Enable tracing support                     | false   | v1.18.2 |
| tracing.exporter | The exporter to use (jaeger, zipkin, otlp) | jaeger  | v1.18.2 |

#### Tracing: Jaeger

| Property            | Description                              | Default   | Since   |
| ------------------- | ---------------------------------------- | --------- | ------- |
| tracing.jaeger.host | The UDP host destination to report spans | localhost | v0.17.0 |
| tracing.jaeger.port | The UDP port destination to report spans | 6831      | v0.17.0 |

#### Tracing: Zipkin

| Property                | Description                             | Default                            | Since   |
| ----------------------- | --------------------------------------- | ---------------------------------- | ------- |
| tracing.zipkin.endpoint | The Zipkin API endpoint to report spans | http://localhost:9411/api/v2/spans | v1.18.2 |

#### Tracing: OTLP

| Property              | Description                    | Default        | Since   |
| --------------------- | ------------------------------ | -------------- | ------- |
| tracing.otlp.endpoint | The OTLP GRPC reciever address | localhost:4317 | v1.18.2 |

### Database

| Property             | Description                                                                                 | Default                      | Since   |
| -------------------- | ------------------------------------------------------------------------------------------- | ---------------------------- | ------- |
| db.url               | URL to access Flipt database                                                                | file:/var/opt/flipt/flipt.db |         |
| db.protocol          | Protocol (Sqlite, MySQL, PostgreSQL, CockroachDB) for Flipt database (URL takes precedence) |                              | v0.18.0 |
| db.host              | Host to access Flipt database (URL takes precedence)                                        |                              | v0.18.0 |
| db.port              | Port to access Flipt database (URL takes precedence)                                        |                              | v0.18.0 |
| db.name              | Name of Flipt database (URL takes precedence)                                               |                              | v0.18.0 |
| db.user              | User to access Flipt database (URL takes precedence)                                        |                              | v0.18.0 |
| db.password          | Password to access Flipt database (URL takes precedence)                                    |                              | v0.18.0 |
| db.max_idle_conn     | The maximum number of connections in the idle connection pool                               | 2                            | v0.17.0 |
| db.max_open_conn     | The maximum number of open connections to the database                                      | unlimited                    | v0.17.0 |
| db.conn_max_lifetime | Sets the maximum amount of time in which a connection can be reused                         | unlimited                    | v0.17.0 |

### Authentication

| Property                              | Description                                                   | Default | Since   |
| ------------------------------------- | ------------------------------------------------------------- | ------- | ------- |
| authentication.required               | Enable or disable authentication validation on requests       | false   | v1.15.0 |
| authentication.session.domain         | Public domain on which Flipt instance is hosted               |         | v1.17.0 |
| authentication.session.secure         | Configures the `Secure` property on created session cookies   | false   | v1.17.0 |
| authentication.session.token_lifetime | Configures the lifetime of the session token (login duration) | 24h     | v1.17.0 |
| authentication.session.state_lifetime | Configures the lifetime of state parameters during OAuth flow | 10m     | v1.17.0 |
| authentication.session.csrf.key       | Secret credential used to sign CSRF prevention tokens         |         | v1.17.0 |

#### Authentication Methods: Token

| Property                                          | Description                                                      | Default | Since   |
| ------------------------------------------------- | ---------------------------------------------------------------- | ------- | ------- |
| authentication.methods.token.enabled              | Enable static token creation                                     | false   | v1.15.0 |
| authentication.methods.token.cleanup.interval     | Interval between deletion of expired tokens                      | 1h      | v1.16.0 |
| authentication.methods.token.cleanup.grace_period | How long an expired token can exist until considered deletable   | 30m     | v1.16.0 |
| authentication.methods.token.bootstrap.token      | The static token to use for bootstrapping                        |         | v1.19.0 |
| authentication.methods.token.bootstrap.expiration | How long after creation until the static bootstrap token expires |         | v1.19.0 |

#### Authentication Methods: OIDC

| Property                                                          | Description                                                    | Default | Since   |
| ----------------------------------------------------------------- | -------------------------------------------------------------- | ------- | ------- |
| authentication.methods.oidc.enabled                               | Enable OIDC authentication                                     | false   | v1.17.0 |
| authentication.methods.oidc.cleanup.interval                      | Interval between deletion of expired tokens                    | 1h      | v1.17.0 |
| authentication.methods.oidc.cleanup.grace_period                  | How long an expired token can exist until considered deletable | 30m     | v1.17.0 |
| authentication.methods.oidc.providers.[provider].issuer_url       | Provider specific OIDC issuer URL (see your providers docs)    |         | v1.17.0 |
| authentication.methods.oidc.providers.[provider].client_id        | Provider specific OIDC client ID (see your providers docs)     |         | v1.17.0 |
| authentication.methods.oidc.providers.[provider].client_secret    | Provider specific OIDC client secret (see your providers docs) |         | v1.17.0 |
| authentication.methods.oidc.providers.[provider].redirect_address | Public URL on which this Flipt instance is reachable           |         | v1.17.0 |
| authentication.methods.oidc.providers.[provider].scopes           | Scopes to request from the provider                            |         | v1.17.0 |

#### Authentication Methods: Kubernetes

| Property                                                     | Description                                                    | Default                                              | Since   |
| ------------------------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------- | ------- |
| authentication.methods.kubernetes.enabled                    | Enable Kubernetes service account token authentication         | false                                                | v1.19.0 |
| authentication.methods.kubernetes.cleanup.interval           | Interval between deletion of expired tokens                    | 1h                                                   | v1.19.0 |
| authentication.methods.kubernetes.cleanup.grace_period       | How long an expired token can exist until considered deletable | 30m                                                  | v1.19.0 |
| authentication.methods.kubernetes.discovery_url              | Kubernetes API server URL for OIDC configuration discovery     | https://kubernetes.default.svc.cluster.local         | v1.19.0 |
| authentication.methods.kubernetes.ca_path                    | Kubernetes API CA certification path                           | /var/run/secrets/kubernetes.io/serviceaccount/ca.crt | v1.19.0 |
| authentication.methods.kubernetes.service_account_token_path | Path to Flipts service account token                           | /var/run/secrets/kubernetes.io/serviceaccount/token  | v1.19.0 |

### Cache

| Property      | Description                                             | Default | Since   |
| ------------- | ------------------------------------------------------- | ------- | ------- |
| cache.enabled | Enable caching of data                                  | false   | v1.10.0 |
| cache.ttl     | Time to live for cached data                            | 60s     | v1.10.0 |
| cache.backend | The backend to use for caching (options: memory, redis) | memory  | v1.10.0 |

#### Cache: Memory

| Property                       | Description                                                          | Default | Since   |
| ------------------------------ | -------------------------------------------------------------------- | ------- | ------- |
| cache.memory.eviction_interval | Interval at which expired items are evicted from the in-memory cache | 5m      | v0.12.0 |

#### Cache: Redis

| Property             | Description                           | Default   | Since   |
| -------------------- | ------------------------------------- | --------- | ------- |
| cache.redis.host     | Host to access the Redis database     | localhost | v1.10.0 |
| cache.redis.port     | Port to access the Redis database     | 6379      | v1.10.0 |
| cache.redis.db       | Redis database to use                 | 0         | v1.10.0 |
| cache.redis.password | Password to access the Redis database |           | v1.10.0 |

## Deprecations

From time to time configuration options will need to be deprecated and
eventually removed. Deprecated configuration options will be removed after \~6
months from the time they were deprecated.

All deprecated configuration options will be removed from the documentation,
however, they will still work as expected until they are removed. A warning will
be logged in the Flipt logs when a deprecated configuration option is used.

All deprecated options are listed in the [DEPRECATIONS](https://github.com/flipt-io/flipt/blob/main/DEPRECATIONS.md) file
in the Flipt repository as well as the [CHANGELOG](https://github.com/flipt-io/flipt/blob/main/CHANGELOG.md).

## Environment Variables

All options in the configuration file can be overridden using environment
variables using the syntax:

```yaml
FLIPT_<SectionName>_<KeyName>
```

<Note>
  Using environment variables to override defaults is especially helpful when
  running with Docker as described in the [Installation](/installation)
  documentation.
</Note>

Keys should be uppercase and `.` should be replaced by `_`. For example,
given these configuration settings:

```yaml
server:
  grpc_port: 9000

db:
  url: file:/var/opt/flipt/flipt.db
```

You can override them using:

```console
export FLIPT_SERVER_GRPC_PORT=9001
export FLIPT_DB_URL="postgres://postgres@localhost:5432/flipt?sslmode=disable"
```

### Multiple Values

Some configuration options can have a list of values. For example, the `cors.allowed_origins` option can have multiple origins.

In this case, you can use a space separated list of values for the environment variable override:

```console
export FLIPT_CORS_ALLOWED_ORIGINS="http://localhost:3000 http://localhost:3001"
```
