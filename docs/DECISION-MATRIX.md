# Decision Matrix — When to Use What

Quick reference for technical interview "pick one" questions. Each row maps to runnable code in this repo.

---

## Frontend

| Use Case | React SPA | Next.js | Why |
|----------|-----------|---------|-----|
| Public marketing / SEO pages | ❌ | ✅ SSG/ISR | Crawlers need HTML without JS |
| Authenticated dashboard | ✅ | ✅ | SEO irrelevant behind login |
| Real-time event feed | ✅ SSE/WS | ✅ SSE/WS | Both use same hooks |
| Embedded widget in legacy app | ✅ | ❌ | No framework lock-in |
| File-based routing | ❌ React Router | ✅ App Router | Convention over configuration |

**Demo:** Compare `apps/react-spa` vs `apps/web` on `/products` — view page source.

---

## API Style

| Use Case | REST | GraphQL | Why |
|----------|------|---------|-----|
| Simple CRUD + HTTP caching | ✅ | ❌ | CDN/proxy cache GET by URL |
| Mobile bandwidth optimization | ❌ | ✅ | Client picks fields |
| Multiple clients, different shapes | ❌ | ✅ | One schema, many queries |
| Webhooks / third-party integrations | ✅ | ❌ | Standard HTTP verbs |
| Admin bulk operations | ✅ | Either | REST is simpler for scripts |

**Demo:** `/products` (REST SSR) vs `/graphql-demo` (GraphQL with DataLoader).

---

## Database

| Use Case | MongoDB | DynamoDB | Why |
|----------|---------|----------|-----|
| Rich queries / aggregations | ✅ | ❌ | MQL, `$lookup`, text search |
| AWS-native auto-scaling KV | ❌ | ✅ | On-demand capacity |
| Multi-cloud portability | ✅ | ❌ | Self-hosted or Atlas |
| Flexible nested documents | ✅ | ⚠️ Denormalize | Product variants, tags |
| Single-digit ms at massive scale | ⚠️ | ✅ | Partition key design |

**Demo:** `DATA_PROVIDER=mongodb` vs `dynamodb` — same API, different adapter.

**Migration:** Trigger `dual_write_migration` scenario — dual-write wrapper in `packages/db/src/dual-write-adapter.ts`.

---

## Deployment

| Use Case | AWS ECS | Kubernetes | Why |
|----------|---------|------------|-----|
| AWS-native team | ✅ | ⚠️ EKS | Lower ops overhead with Fargate |
| Multi-cloud / on-prem | ❌ | ✅ | Portable orchestration |
| Helm / operator ecosystem | ❌ | ✅ | Rich K8s tooling |
| Tight AWS service integration | ✅ | ⚠️ | ALB, Cognito, DynamoDB native |
| Platform team owns control plane | ❌ | ✅ | Custom scheduling, mesh |

**Demo:** Same Docker images in `apps/api/Dockerfile` and `apps/web/Dockerfile` — deploy via Terraform (ECS) or Helm (K8s).

---

## Messaging

| Use Case | SSE | WebSocket | Polling |
|----------|-----|-----------|---------|
| Server → client events | ✅ | ✅ | ✅ (wasteful) |
| Client → server real-time | ❌ | ✅ | POST per action |
| Simplicity / HTTP compat | ✅ | ⚠️ Upgrade | ✅ |
| Bidirectional chat | ❌ | ✅ | ❌ |

**Demo:** `/api/events/stream` (SSE) vs `ws://localhost:4000/api/events/ws` (WebSocket ping/pong).

---

## Caching & Resilience

| Use Case | Redis Cache | Rate Limit | Circuit Breaker |
|----------|-------------|------------|-----------------|
| Hot read paths | ✅ cache-aside | — | — |
| Abuse protection | — | ✅ middleware | — |
| Dependency failure | — | — | ✅ scenarios (db_error) |

**Demo:** `REDIS_URL=redis://localhost:6379` — check `X-Cache: HIT` header. Trigger `rate_limit` scenario vs real `express-rate-limit`.

---

## Auth

| Layer | Approach | File |
|-------|----------|------|
| API | JWT Bearer token | `apps/api/src/middleware/auth.ts` |
| Next.js | Middleware redirect (extension) | `apps/web/src/middleware.ts` |
| AWS | Cognito + ALB authenticate | `docs/interview-guide/aws.md` |
| K8s | OAuth2 proxy at Ingress | `docs/interview-guide/kubernetes.md` |

**Demo:** `POST /api/auth/login` with `admin@interview.local` / `interview123`. Set `ENABLE_AUTH=true` to enforce on mutations.

---

See [learning-paths/](./learning-paths/) for role-based study plans.
