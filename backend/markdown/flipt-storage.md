---
title: Storage
description: This document describes how to configure Flipt's storage backend mechanisms.
---

## Databases

Flipt supports [SQLite](https://www.sqlite.org/index.html), [PostgreSQL](https://www.postgresql.org/), [CockroachDB](https://www.cockroachlabs.com/) and
[MySQL](https://dev.mysql.com/) databases.

SQLite is enabled by default for simplicity, however you should use PostgreSQL, MySQL, or CockroachDB if you intend to run multiple copies of Flipt in a high
availability configuration.

The database connection can be configured as follows:

### SQLite

```yaml
db:
  # file: informs flipt to use SQLite
  url: file:/var/opt/flipt/flipt.db
```

### PostgreSQL

```yaml
db:
  url: postgres://postgres@localhost:5432/flipt?sslmode=disable
```

<Note>
  The PostgreSQL database must exist and be up and running before Flipt will be
  able to connect to it.
</Note>

### CockroachDB

```yaml
db:
  url: cockroach://root@localhost:26257/flipt?sslmode=disable
```

<Note>
  The CockroachDB database must exist and be up and running before Flipt will be
  able to connect to it.
</Note>

### MySQL

```yaml
db:
  url: mysql://mysql@localhost:3306/flipt
```

<Note>
  The MySQL database must exist and be up and running before Flipt will be able
  to connect to it.
</Note>

### Migrations

From time to time the Flipt database must be updated with new schema. To
accomplish this, Flipt includes a `migrate` command that will run any pending
database migrations for you.

If Flipt is started and there are pending migrations, you will see the following
error in the console:

```yaml
migrations pending, please backup your database and run `flipt migrate`
```

If it is your first run of Flipt, all migrations will automatically be run
before starting the Flipt server.

<Warning>
  You should backup your database before running `flipt migrate` to ensure that
  no data is lost if an error occurs during migration.
</Warning>

If running Flipt via Docker, you can run the migrations in a separate container
before starting Flipt by running:

```yaml
docker run -it -v $HOME/flipt:/var/opt/flipt flipt/flipt:latest /bin/sh -c './flipt migrate'
```

<Note>
  `$HOME/flipt` is just used as an example, you can use any directory you would
  like on the host.
</Note>

If you don't use mounted volumes to persist your data, your data will be lost
when the migration container exits, having no effect on your Flipt instance!

## Import/Export

Flipt supports importing and exporting your feature flag data since
[v0.13.0](https://github.com/flipt-io/flipt/releases/tag/v0.13.0).

Prior to Flipt [v1.20.0](https://github.com/flipt-io/flipt/releases/tag/v1.20.0) `import` and `export` ran directly against the backing database.
Since `v1.20.0` you can now alternatively perform these operations through Flipt's API.
Both `flipt import` and `flipt export` support the `--address` and `--token` flags to enable this behaviour.

```
flipt import --address http://flipt.my.org --token static-api-token

flipt export --address grpc://flipt.my.org:9000
```

Both `HTTP` and `gRPC` are supported by the `--address` flag.

### Import

To import previously exported Flipt data, use the `flipt import` command. You
can import either from a file or from STDIN.

To import from STDIN, Flipt requires the `--stdin` flag:

```yaml
cat flipt.yaml | flipt import --stdin
```

If not importing using `--stdin`, Flipt requires the file to be imported as an
argument:

```yaml
flipt import flipt.yaml
```

By default, Flipt will import into the `default` namespace.
Use the flag `--namespace` to import into a different namespace.

```yaml
flipt import --namespace production flipt.yaml
```

A namespace must exist before your import into it.
For convenience, you can supply `--create-namespace` in order for Flipt to automatically create the namespace if it does not already exist.

```yaml
flipt import --namespace production --create-namespace flipt.yaml
```

This command supports the `--drop` flag that will drop all of the data in your
Flipt database tables before importing. This is to ensure that no data
collisions occur during the import.

<Warning>
  Be careful when using the `--drop` flag as it will immediately drop all of
  your data and there is no undo. It is recommended to first backup your
  database before running this command just to be safe.
</Warning>

### Export

To export Flipt data, use the `flipt export` command.

By default, `export` will output to STDOUT:

```yaml
$ flipt export

flags:
- key: new-contact-page
  name: New Contact Page
  description: Show users our Beta contact page
  enabled: true
  variants:
  - key: blue
    name: Blue
  - key: green
    name: Green

```

You can also export to a file using the `-o filename` or `--output filename`
flags:

```yaml
flipt export -o flipt.yaml
```

By default, Flipt will export from the `default` namespace.
Use the flag `--namespace` to export from a different namespace.

```yaml
flipt export --namespace production
```

## Caching

Flipt supports both in-memory cache as well as Redis to enable faster reads and
evaluations. Enabling caching has been shown to speed up read performance by
several orders of magnitude.

<Warning>
  Enabling in-memory caching when running more than one instance of Flipt is not
  advised as it may lead to unpredictable results. It is recommended to use
  Redis instead if you are running more than one instance of Flipt.
</Warning>

Caching works as follows:

- All flag reads and evaluation requests go through the cache
- Flag cache entries are purged whenever a write to a flag or its variants
  occur or the TTL expires
- Evaluation cache entries are purged after the TTL expires only
- A cache miss will fetch the item from the database and add the item to the
  cache for the next read
- A cache hit will simply return the item from the cache, not interacting with
  the database

See the [Cache](/configuration/overview#cache) section for how to configure caching.

### Expiration/Eviction

You can also configure an optional duration at which items in the cache are
marked as expired.

For example, if you set the cache TTL to `5m`, items that have been in the cache
for longer than 5 minutes will be marked as expired, meaning the next read for
that item will hit the database.

Setting an eviction interval (in-memory cache only) will automatically remove
expired items from your cache at a defined period.

<Note>
  The combination of cache expiration and eviction can help lessen the amount of
  memory your cache uses, as infrequently accessed items will be removed over
  time.
</Note>

To tune the expiration and eviction interval of the cache set the following in
your config:

```yaml
cache:
  enabled: true
  backend: memory
  ttl: 5m # items older than 5 minutes will be marked as expired
  memory:
    eviction_interval: 2m # expired items will be evicted from the cache every 2 minutes
```
