# Docker Full-Stack Demo

Run the entire stack in containers — no local Node.js required.

## Start

```powershell
cd interview-stack-guide
npm run docker:full
```

This will:
1. Start MongoDB
2. Build and start the API (port 4000) with sample product seed data
3. Build and start Next.js (port 3000)

## Verify

```powershell
npm run docker:smoke
```

Or manually:
- http://localhost:3000 — home page with live API status
- http://localhost:3000/products — SSR product list (3 seeded items)
- http://localhost:4000/health — API health
- http://localhost:4000/graphql — GraphQL playground (POST queries)

## Stop

```powershell
npm run docker:down
```

## Interview Talking Points

1. **Health-gated startup** — web waits for API `/health`, API waits for MongoDB
2. **Build-time vs runtime env** — `NEXT_PUBLIC_*` set at Docker build via `args`
3. **Seed on boot** — `SEED_DATA=true` demonstrates idempotent data initialization
4. **Same images as production** — identical Dockerfiles used in CI/CD to ECR/GHCR

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 3000/4000 in use | Stop other dev servers or change ports in `docker-compose.yml` |
| Web shows API unavailable | Ensure API healthcheck passed: `docker compose logs api` |
| Empty products | Delete mongo volume: `docker compose down -v` then restart |
