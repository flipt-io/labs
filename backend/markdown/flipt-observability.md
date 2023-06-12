---
title: Observability
description: This document describes how to configure Flipt's observability mechanisms including metrics, tracing, and auditing.
---

## Metrics

Flipt exposes [Prometheus](https://prometheus.io/) metrics at the `/metrics`
HTTP endpoint. To see which metrics are currently supported, point your browser
to `FLIPT_HOST/metrics` (ex: `localhost:8080/metrics`).

You should see a bunch of metrics being recorded such as:

```yaml
flipt_cache_hit_total{cache="memory",type="flag"} 1
flipt_cache_miss_total{cache="memory",type="flag"} 1
---
go_gc_duration_seconds{quantile="0"} 8.641e-06
go_gc_duration_seconds{quantile="0.25"} 2.499e-05
go_gc_duration_seconds{quantile="0.5"} 3.5359e-05
go_gc_duration_seconds{quantile="0.75"} 6.6594e-05
go_gc_duration_seconds{quantile="1"} 0.00026651 go_gc_duration_seconds_sum
0.000402094 go_gc_duration_seconds_count 5
```

There is an
[example](https://github.com/flipt-io/flipt/tree/main/examples/prometheus)
provided in the GitHub repository showing how to set up Flipt with Prometheus.

### Dashboards

![Grafana Dashboard](/images/configuration/grafana_flag_dashboard.png)

We have created a set of [Grafana](https://grafana.com/) dashboards that you can use to visualize the metrics collected by Flipt, including both server health and flag evaluation metrics.

You can find the dashboards in our [grafana-dashboards](https://github.com/flipt-io/grafana-dashboards) repository.

## Tracing

Flipt supports distributed tracing via the [OpenTelemetry](https://opentelemetry.io/) project.

Currently, we support the following tracing backends:

- [Jaeger](https://www.jaegertracing.io/)
- [Zipkin](https://zipkin.io/)
- [OTLP](https://opentelemetry.io/docs/reference/specification/protocol/).

Enable tracing via the values described in the [Tracing configuration](/configuration/overview#tracing) and point Flipt to your configured collector to record spans.

There are [examples](https://github.com/flipt-io/flipt/tree/main/examples/tracing) provided in the main GitHub repository showing how to set up Flipt with each of the supported tracing backends.

## Audit Events

Starting from `v1.21.0`, Flipt supports sending audit events to configured sinks. Audit events have the following structure:

```json
{
  "version": "0.1",
  "type": "flag",
  "action": "created",
  "metadata": {
    "actor": {
      "authentication": "none",
      "ip": "172.17.0.1"
    }
  },
  "payload": {
    "description": "flipt flag",
    "enabled": true,
    "key": "flipt",
    "name": "flipt",
    "namespace_key": "default"
  },
  "timestamp": "1970-01-01T00:00:00Z"
}
```

- `version` : the version of the audit event structure. We do not expect too many changes to the structure of the audit event
- `type` : the type of the entity being acted upon (flag, variant, constraint, etc.)
- `action` : the action taken upon the entity (created, deleted, updated, etc.)
- `metadata` : extra information related to the audit event as a whole. The `actor` field will always be present containing some identity information of the source which initiated the audit event
- `payload` : the actual payload used to interact with the `Flipt` server for certain auditable events
- `timestamp`: the time the event was created

Currently, we support the following sinks for audit events:

- Log File: the audit events are JSON encoded and new-line delimited. Configuration found [here](/configuration/overview#audit-events-log-file)

You can find [examples](https://github.com/flipt-io/flipt/tree/main/examples/audit) in the main GitHub repository on how to enable audit events, and how to tune configuration for it.
