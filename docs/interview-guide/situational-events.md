# Situational Events — Implementation Guide

The documented interview scenarios are now **runnable** in code — not just talking points.

## Try It

```bash
npm run dev
# Open http://localhost:3000/scenarios  (Next.js)
# Open http://localhost:5173/scenarios  (React SPA)
```

Trigger a scenario → watch the **Live Event Feed** update via SSE on both frontends.

---

## Architecture

```
Product CRUD ──▶ EventBus ──▶ SSE /api/events/stream ──▶ React + Next.js EventFeed
                    │
Scenario POST ──▶ ScenarioSimulator ──▶ Middleware (429, 401, latency, 503)
```

---

## Implemented Scenarios

| Scenario ID | Interview Doc | Backend Behavior | FE Behavior |
|-------------|---------------|------------------|-------------|
| `traffic_spike` | Scenario 5 | +500–1000ms latency | Slow loading, retry |
| `rate_limit` | Scenario 5 | HTTP 429 on /api/* | Error message |
| `db_slow` | Scenario 8 | +2s DB delay | Loading states |
| `db_error` | Scenario 10 | Next DB call → 503 | Error boundary / retry |
| `api_degraded` | Scenario 7 | /health → 503 degraded | Status bar shows degraded |
| `deploy_rolling` | Scenario 7 | DEPLOY_STARTED/COMPLETED events | Event feed |
| `auth_required` | Scenario 9 | 401 on mutations | Form error |
| `recover` | Rollback | Clears all scenarios | System normal |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | Event history (last 50) |
| GET | `/api/events/stream` | SSE real-time stream |
| GET | `/api/scenarios` | List scenarios + active state |
| POST | `/api/scenarios/:id/trigger` | Activate scenario |

GraphQL: `events`, `activeScenarios`, `triggerScenario(id)` mutations.

---

## Frontend Patterns (Both Apps)

| Pattern | Next.js | React SPA |
|---------|---------|-----------|
| Live events | `useEventStream` + SSE | Same hook |
| Scenario UI | `/scenarios` page | `/scenarios` page |
| Offline | `OfflineBanner` in layout | Same component |
| Retry | `fetchWithRetry` in events lib | Same |
| Error UI | `error.tsx` on /products | Inline error state |
| Loading UI | `loading.tsx` on /products | useState loading |

---

## Interview Demo Script

1. Open both `/scenarios` pages side-by-side
2. Trigger **Traffic Spike** — show slow responses on both
3. Trigger **Rate Limit** — POST product fails with 429
4. Trigger **DB Error** — next request returns 503
5. Create a product — watch **PRODUCT_CREATED** in event feed
6. Click **Recover All** — system returns to normal
7. Say: "Same backend events, both frontends handle them with retries, error boundaries, and SSE"

---

## Code References

- Event types: `packages/events/src/types.ts`
- Event bus: `packages/events/src/event-bus.ts`
- Scenario engine: `apps/api/src/events/scenario-simulator.ts`
- Middleware: `apps/api/src/middleware/situational.ts`
- Next.js UI: `apps/web/src/app/scenarios/`
- React UI: `apps/react-spa/src/pages/ScenariosPage.tsx`
