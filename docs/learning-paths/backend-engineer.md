# Backend Engineer Learning Path

## Week 1: API Design
1. Read `apps/api/openapi.yaml` — REST contract
2. Trace `apps/api/src/routes/rest.ts`
3. Study Zod validation in `packages/validation/`
4. Practice pagination and filtering query params

## Week 2: Dual API (REST + GraphQL)
1. Read `docs/interview-guide/graphql.md`
2. Study `packages/graphql/src/schema.ts` and resolvers
3. Understand DataLoader in `packages/graphql/src/dataloaders.ts`
4. Explain N+1 problem and batching solution

## Week 3: Data Layer
1. Read `docs/interview-guide/nosql.md`
2. Study Repository pattern: `packages/db/src/index.ts`
3. Compare MongoDB vs DynamoDB adapters
4. Run dual-write migration scenario

## Week 4: Auth, Cache, Resilience
1. `POST /api/auth/login` — JWT flow
2. Start Redis: `docker compose up -d redis`
3. Check `X-Cache` headers on product list
4. Trigger all scenarios at `/scenarios`
5. Inspect `/metrics` and structured logs

## Week 5: Events & Messaging
1. SSE: `GET /api/events/stream`
2. WebSocket: `ws://localhost:4000/api/events/ws`
3. Read `docs/interview-guide/situational-events.md`
4. Compare in-process EventBus vs Redis/Kafka (comments in code)

## Interview Demo Script
1. Show Repository pattern — swap DATA_PROVIDER
2. Create product via REST — event appears in feed
3. Trigger db_error — show 503 handling
4. Show OpenAPI spec and metrics endpoint
