# Playground Guide

The **Interview Playground** is a unified demo lab at `/playground` — test every feature without curl or Postman.

## Access

```bash
npm run dev
# Open http://localhost:3000/playground
```

**Presenter mode:** http://localhost:3000/playground/demo — auto-runs interview demo script.

## Tabs

| Tab | What you can demo |
|-----|-------------------|
| **Patterns** | Jump to pre-configured demos |
| **REST** | Send any HTTP request, see `X-Cache`, `X-Request-Id` |
| **GraphQL** | GraphiQL explorer with preset queries + DataLoader |
| **Auth** | Login, store JWT, test `/api/auth/me` |
| **Scenarios** | Trigger all 10 scenarios + one-click demo script |
| **SSE / WS** | Side-by-side event transports + WebSocket ping |
| **OpenAPI** | Swagger UI from `/openapi.yaml` |

## System Status Strip

Shows live: API health, DB provider, deploy target, Redis cache, auth enforcement, active scenarios, request count.

## Interview Demo Script (28s)

1. Traffic spike — latency increases
2. DB slow — 2s delay
3. DB error — next call fails
4. Recover — system normal

Click **▶ Run Interview Demo** on Scenarios tab or use Presenter Mode.

## Auth + Middleware Demo

1. Login on Auth tab
2. Visit `/products?auth=required` — middleware redirects to playground if no cookie
3. Set `ENABLE_AUTH=true` on API to enforce JWT on mutations

## Tips

- Run `docker compose up -d redis` to demo cache HIT/MISS in REST tab
- Open REST + Transports tabs side-by-side during live interviews
- Use Pattern Launcher for "Dual-Write Migration" and "CI/CD Pipeline"
