# ADR 003: SSE Primary, WebSocket Optional

## Status
Accepted

## Context
Real-time situational events power the scenario demo. Interviewers compare SSE, WebSocket, and polling.

## Decision
- **Primary transport:** SSE at `/api/events/stream` (used by both frontends)
- **Secondary:** WebSocket at `/api/events/ws` for bidirectional ping/pong demo
- **In-process bus:** `EventBus` in API memory (not Redis/Kafka)

## Consequences
- **Positive:** SSE is simpler for server→client events; WS demonstrates bidirectional tradeoffs
- **Negative:** In-process bus doesn't scale across multiple API instances
- **Mitigation:** Code comments compare with Redis pub/sub, SNS/SQS; Playground shows both transports

## Alternatives Considered
- **WebSocket only:** rejected — SSE is easier for interview demos and HTTP infra
- **GraphQL subscriptions:** deferred — adds complexity; SSE covers the teaching goal
