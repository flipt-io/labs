---
title: Telemetry
description: This document describes how to configure Flipt's telemetry outputs as well as what data is captured.
---

## Telemetry

Flipt developers rely on anonymous usage data to help prioritize new features
and improve the product. The information collected is completely anonymous,
never shared with external entities, and you can opt-out at any time.

### What Kind of Data is Collected?

- Flipt version (ie: v1.21.0)
- Database backend (ie: Postgres)
- Cache backend (ie: Redis)
- Authentication methods (ie: OIDC)

We use [Segment](https://segment.com) to collect the data. Only the creator of
Flipt has access to the raw data.

Here is an example of the telemetry data sent to Segment:

```json
{
  "version": "1.1",
  "uuid": "1545d8a8-7a66-4d8d-a158-0a1c576c68a6",
  "lastTimestamp": "2023-04-25T01:01:51Z",
  "flipt": {
    "version": "v1.21.1",
    "storage": {
      "database": "postgres",
      "cache": "redis"
    },
    "authentication": {
      "methods": "oidc"
    }
  }
}
```

You can always view the full schema of the telemetry data and see how it is collected on
[GitHub](https://github.com/flipt-io/flipt/blob/main/internal/telemetry/telemetry.go).

### How to Disable Telemetry

There are multiple ways in which you can disable telemetry collection:

#### Configuration File

```yaml
meta:
  telemetry_enabled: false
```

#### Environment Variables

```shell
export FLIPT_TELEMETRY_ENABLED=false
```

As of [v1.21.0](https://github.com/flipt-io/flipt/releases/tag/v1.21.0), telemetry can also be disabled by setting the [DO_NOT_TRACK](https://consoledonottrack.com/) environment variable to `true` or `1`:

```shell
export DO_NOT_TRACK=true
```
