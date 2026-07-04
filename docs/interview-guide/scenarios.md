# System Design & Behavioral Interview Scenarios

Hands-on answers tied to this repository. Practice walking through each out loud.

---

## Scenario 1: "Design a product catalog for an e-commerce site"

**Requirements:** 10M products, search by category, mobile + web clients, global users.

**Answer structure (STAR + architecture):**

1. **Frontend** — Next.js with ISR for product listing pages (SEO), SSR for personalized views
2. **API** — GraphQL for mobile (bandwidth), REST for admin/webhooks
3. **Data** — NoSQL (MongoDB) for flexible product schema (variants, tags, nested attributes)
4. **Caching** — CDN for static assets, Redis for hot product pages (mention; not in repo)
5. **Scale** — Read replicas, sharding by category, Elasticsearch for full-text search (extension)

**Code to point at:** `packages/db/`, `apps/web/src/app/products/page.tsx`

---

## Scenario 2: "How would you migrate from MongoDB to DynamoDB?"

**Phases:**

| Phase | Action |
|-------|--------|
| 1 | Implement DynamoDB adapter (done: `dynamodb-adapter.ts`) |
| 2 | Dual-write to both DBs behind feature flag |
| 3 | Backfill historical data with batch jobs |
| 4 | Shadow-read: compare responses, fix discrepancies |
| 5 | Flip `DATA_PROVIDER=dynamodb` per environment |
| 6 | Decommission MongoDB after validation window |

**Interview line:** "Repository pattern means the API and GraphQL resolvers never change — only the factory config."

---

## Scenario 3: "Explain your CI/CD pipeline"

**Walk through:**

```
PR opened → CI (lint, test, docker build) → merge to main
  → CD triggers → build image → push registry → deploy
  → smoke test → notify
```

**Files:** `.github/workflows/ci.yml`, `cd-aws.yml`, `cd-kubernetes.yml`

**Follow-ups:**
- **Rollback:** ECS circuit breaker / `kubectl rollout undo`
- **Secrets:** GitHub Environments, AWS Secrets Manager, K8s Secrets
- **Promotion:** staging auto-deploy, production manual approval

---

## Scenario 4: "AWS vs Kubernetes — when would you pick each?"

| Factor | AWS ECS | Kubernetes |
|--------|---------|--------------|
| Team expertise | AWS-native team | Platform/K8s team |
| Portability | AWS-locked | Multi-cloud |
| Ops overhead | Lower | Higher (control plane, upgrades) |
| Ecosystem | AWS services integrate easily | Helm, operators, service mesh |

**This project:** Same Docker images, different orchestrator — demonstrate cloud-agnostic containers.

---

## Scenario 5: "How do you handle a traffic spike (10x)?"

1. **HPA** scales API/Web pods on CPU (`manifests/hpa.yaml`)
2. **DynamoDB on-demand** auto-scales read/write capacity
3. **ALB** distributes load across ECS tasks
4. **CDN** serves Next.js static assets
5. **Rate limiting** at Ingress/ALB (mention)
6. **Queue** for write-heavy bursts (SQS + worker — extension)

---

## Scenario 6: "REST vs GraphQL — justify both"

**When interviewer pushes "pick one":**

> "For a public product catalog I'd expose REST for caching and simplicity. For our mobile app and internal dashboards I'd add GraphQL so each client fetches only the fields it needs. Both sit on the same repository — no duplicated business logic."

**Demo:** Compare `/products` (REST SSR) vs `/graphql-demo` (GraphQL) in the web app.

---

## Scenario 7: "How do you ensure zero-downtime deploys?"

**Kubernetes:**
```yaml
rollingUpdate:
  maxSurge: 1
  maxUnavailable: 0
readinessProbe: /ready  # don't route traffic until DB connected
```

**ECS:** Deployment circuit breaker with automatic rollback (`ecs.tf`)

**CI/CD:** Wait for `kubectl rollout status` before marking deploy success

---

## Scenario 8: "Tell me about a challenging bug you debugged"

**Template (adapt to this project):**

> "During a K8s deploy, pods were crash-looping. Readiness probe hit `/ready` before MongoDB was reachable. I added `depends_on` with health conditions in docker-compose for local repro, increased `initialDelaySeconds`, and verified with `kubectl describe pod`. Root cause: startup race, not application logic."

---

## Scenario 9: "How would you add authentication?"

1. **API:** JWT middleware on Express, attach user to GraphQL context
2. **Next.js:** Middleware checks cookie/session, redirect unauthenticated users
3. **K8s:** OAuth2 proxy in front of Ingress, or pass tokens through
4. **AWS:** Cognito + ALB authenticate action

**Code extension point:** `apps/api/src/index.ts` — add auth middleware before routes

---

## Scenario 10: "Explain CAP theorem with your database choice"

**MongoDB (replica set):** Strong consistency on primary reads; CP-leaning within a partition.

**DynamoDB:** AP — highly available, partition tolerant; eventual consistency by default (strongly consistent reads optional).

**Interview tip:** Don't dogmatically label — explain tradeoffs for *your* use case (product catalog reads tolerate eventual consistency; inventory decrements need strong consistency).

---

## Scenario 11: "Monorepo vs polyrepo?"

**This project uses monorepo (npm workspaces):**

| Pros | Cons |
|------|------|
| Shared types across packages | Larger CI surface |
| Atomic cross-package changes | Requires discipline on boundaries |
| Single CI pipeline | Tooling complexity at scale |

**Packages:** `@interview/db`, `@interview/graphql` shared by API; web consumes via HTTP

---

## Scenario 12: "Walk me through a Docker deployment"

```bash
npm run docker:full          # builds & starts mongodb + api + web
npm run docker:smoke         # verifies REST, GraphQL, web
```

**Talking points:**
- Multi-stage Dockerfile (builder → slim runner)
- Health checks gate dependent services
- `NEXT_PUBLIC_*` baked at build time for browser URLs
- `SEED_DATA=true` populates demo products on first boot

---

## Runnable Scenarios (Implemented)

Scenarios 5, 7, 8, 9 are now **triggerable in the app** at `/scenarios`:

| Doc Scenario | Trigger ID | Demo |
|--------------|------------|------|
| 5 Traffic spike | `traffic_spike` | Slow API responses |
| 5 Rate limiting | `rate_limit` | HTTP 429 |
| 7 Zero-downtime deploy | `deploy_rolling` | Deploy events in feed |
| 8 Debugging races | `db_slow` | 2s latency |
| 9 Authentication | `auth_required` | 401 on mutations |
| 10 CAP / availability | `db_error` | 503 on next DB call |

See [situational-events.md](./situational-events.md) for full implementation guide.

## Quick Reference: Files to Open During Live Coding

| Topic | File |
|-------|------|
| Repository pattern | `packages/db/src/index.ts` |
| GraphQL schema | `packages/graphql/src/schema.ts` |
| Apollo Server v5 | `apps/api/src/index.ts` |
| Next.js SSR | `apps/web/src/app/products/page.tsx` |
| Terraform ECS | `infrastructure/aws/ecs.tf` |
| K8s HPA | `infrastructure/kubernetes/manifests/hpa.yaml` |
| CI pipeline | `.github/workflows/ci.yml` |
