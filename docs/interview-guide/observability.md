# Observability Guide

Minimal observability stack implemented in this repo.

## Structured Logging

Every HTTP request emits JSON to stdout:

```json
{
  "level": "info",
  "requestId": "uuid",
  "method": "GET",
  "path": "/api/products",
  "status": 200,
  "durationMs": 12,
  "user": "admin@interview.local",
  "timestamp": "2026-07-05T14:00:00.000Z"
}
```

**File:** `apps/api/src/middleware/logging.ts`

**Interview point:** Correlate logs with `X-Request-Id` header. Ship to CloudWatch (AWS) or Loki (K8s).

## Prometheus Metrics

`GET /metrics` exposes:
- `http_requests_total` — counter by method, path, status
- `http_request_duration_seconds` — histogram
- Default Node.js metrics (memory, CPU)

**File:** `apps/api/src/middleware/metrics.ts`

**Interview point:** RED method — Rate, Errors, Duration. Grafana dashboards scrape this endpoint.

## Health vs Readiness

| Endpoint | Purpose | K8s Probe |
|----------|---------|-----------|
| `/health` | Liveness — process alive | livenessProbe |
| `/ready` | Readiness — DB reachable | readinessProbe |

Trigger `api_degraded` scenario — `/health` returns 503.

## Debug Dashboard

Next.js page at `/debug` shows health, scenarios, and recent events — Scenario 8 talking point.

## Extension Ideas
- OpenTelemetry traces (Next.js → API → DB)
- Grafana dashboard JSON
- Alertmanager rules on error rate spike
- X-Ray on AWS ECS
