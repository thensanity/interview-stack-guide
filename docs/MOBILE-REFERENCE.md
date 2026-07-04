# 📱 Mobile Reference Guide

**Read this on your phone via GitHub — no PC needed.**

One-page index for every tool, concept, command, and interview answer in this repo.

---

## 🗂️ Quick Links (tap in GitHub app)

| Section | Jump to |
|---------|---------|
| Commands | [Daily Commands](#daily-commands) |
| Architecture | [Architecture](#architecture) |
| React | [React](#react) |
| Next.js | [Nextjs] |
| Backend | [Backend](#backend) |
| NoSQL | [Nosql] |
| GraphQL | [Graphql] |
| Events | [Events] |
| CI/CD | [Cicd] |
| AWS | [Aws] |
| Kubernetes | [K8s] |
| Patterns | [Patterns] |
| Interview Q&A | [Qa] |
| Ports & URLs | [Ports] |

---

## Daily Commands

```bash
# Setup (once)
cp .env.example .env
npm install
docker compose up -d mongodb

# Run all (API + Next.js + React)
npm run dev

# Run separately
npm run dev:next    # API :4000 + Next :3000
npm run dev:react   # API :4000 + React :5173

# Docker full stack
npm run docker:full
npm run docker:smoke

# Build & test
npm run build
npm run test
```

---

## Architecture

```
React SPA (5173) ──┐
                   ├── REST + GraphQL ──▶ Express API (4000)
Next.js (3000)  ───┘                           │
                                               ▼
                                    MongoDB  OR  DynamoDB
                                               │
                                    EventBus + Scenarios (SSE)
                                               │
                                    Docker ──▶ AWS ECS  OR  K8s
```

**Monorepo layout:**
- `apps/web` → Next.js
- `apps/react-spa` → Plain React
- `apps/api` → Backend
- `packages/db` → Database adapters
- `packages/graphql` → GraphQL schema
- `packages/events` → Event system
- `infrastructure/` → AWS + K8s
- `.github/workflows/` → CI/CD

---

## React

**What:** UI library. You add routing, fetching, bundling yourself.

**This repo:** `apps/react-spa` — Vite + React Router

| Concept | Meaning |
|---------|---------|
| **CSR** | Client-Side Rendering — browser builds page after JS loads |
| **useState** | Local component state |
| **useEffect** | Run code after render (API calls) |
| **React Router** | Client-side URL routing |
| **Vite** | Fast dev server & bundler (replaces Create React App) |

**When to use:** Dashboards, admin panels, apps behind login, SEO not needed.

**Key file:** `apps/react-spa/src/pages/ProductsPage.tsx` — fetches in useEffect

**Port:** http://localhost:5173

---

## Nextjs

**What:** React **framework** — adds SSR, routing, SEO, server components.

**This repo:** `apps/web` — App Router

| Concept | Meaning |
|---------|---------|
| **SSR** | Server-Side Rendering — HTML built on each request |
| **SSG** | Static Site Generation — HTML at build time |
| **ISR** | Incremental Static Regeneration — static + periodic refresh |
| **Server Component** | Runs on server, no JS sent to client |
| **Client Component** | `"use client"` — interactivity in browser |
| **App Router** | File-based routing in `app/` folder |
| **standalone** | Docker-optimized build output |

**Rendering cheat sheet:**
| Need | Use |
|------|-----|
| SEO, fast first paint | SSR or ISR |
| Static marketing page | SSG |
| Forms, clicks | Client Component |
| Real-time data | SSR (`force-dynamic`) |

**When to use:** Public sites, e-commerce, blogs, SEO matters.

**Key files:**
- `apps/web/src/app/products/page.tsx` — SSR
- `apps/web/src/components/ProductForm.tsx` — Client Component
- `apps/web/src/app/products/error.tsx` — Error boundary

**Port:** http://localhost:3000

---

## React vs Next.js (one-liner)

> **React** = library, CSR, you choose everything.  
> **Next.js** = framework on React, SSR/ISR/SEO built-in.

**Live demo:** View Page Source on `/products` — Next.js has HTML content, React shows empty `<div id="root">`.

Full guide: `docs/interview-guide/react-vs-nextjs.md`

---

## Backend

**Stack:** Express + Apollo Server v5 + TypeScript

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Liveness probe (K8s/ECS) |
| `GET /ready` | Readiness probe (DB connected) |
| `GET /api/products` | REST list |
| `POST /api/products` | REST create |
| `POST /graphql` | GraphQL queries/mutations |
| `GET /api/events` | Event history |
| `GET /api/events/stream` | SSE live events |
| `GET /api/scenarios` | List scenarios |
| `POST /api/scenarios/:id/trigger` | Trigger scenario |

**Env vars:**
| Var | Values | Purpose |
|-----|--------|---------|
| `DATA_PROVIDER` | mongodb / dynamodb | Switch database |
| `MONGODB_URI` | connection string | MongoDB |
| `SEED_DATA` | true | Seed sample products |
| `DEPLOY_TARGET` | aws / kubernetes | Shown in health |

**Port:** http://localhost:4000

---

## Nosql

**Two adapters — swap with env var, same API code.**

| | MongoDB | DynamoDB |
|---|---------|----------|
| **Type** | Document DB | Key-value / document (AWS) |
| **Best for** | Rich queries, aggregations | AWS-native, auto-scale |
| **Local** | docker compose mongodb | docker compose dynamodb-local |
| **Consistency** | Strong on primary | Eventual (default) |
| **This repo file** | `packages/db/src/mongodb-adapter.ts` | `packages/db/src/dynamodb-adapter.ts` |

**Switch provider:**
```bash
DATA_PROVIDER=mongodb   # default
DATA_PROVIDER=dynamodb    # + docker compose up dynamodb-local
```

**Pattern:** Repository — `ProductRepository` interface, two implementations, factory picks one.

---

## Graphql

**What:** Query language — client asks for exact fields needed.

| | REST | GraphQL |
|---|------|---------|
| Endpoints | Many URLs | One `/graphql` |
| Data shape | Fixed | Client chooses fields |
| Caching | Easy (HTTP) | Harder |
| Best for | Simple CRUD, public APIs | Mobile, complex nested data |

**Sample query:**
```graphql
query {
  products { id name price }
  events { type message }
  activeScenarios
}
```

**Apollo v5 change:** Express middleware moved to `@as-integrations/express4` package.

**Files:** `packages/graphql/src/schema.ts`, `resolvers.ts`

---

## Events

**Situational event system — trigger real failure scenarios.**

| Scenario ID | What happens |
|-------------|--------------|
| `traffic_spike` | Slow responses (+500–1000ms) |
| `rate_limit` | HTTP 429 Too Many Requests |
| `db_slow` | 2 second delay on DB |
| `db_error` | Next DB call returns 503 |
| `api_degraded` | /health returns degraded |
| `deploy_rolling` | Deploy start/complete events |
| `auth_required` | 401 on mutations |
| `recover` | Clear all scenarios |

**Try it:** http://localhost:3000/scenarios (or :5173/scenarios)

**Domain events:** PRODUCT_CREATED, PRODUCT_UPDATED, PRODUCT_DELETED — emitted on CRUD.

**Tech:** EventBus (pub/sub) + SSE stream to both frontends.

Full guide: `docs/interview-guide/situational-events.md`

---

## Cicd

**Tool:** GitHub Actions (`.github/workflows/`)

| Workflow | Trigger | Does |
|----------|---------|------|
| `ci.yml` | PR / push | Lint, test, Docker build |
| `cd-aws.yml` | main branch | Push to ECR → deploy ECS |
| `cd-kubernetes.yml` | main branch | Push to GHCR → Helm deploy |

**Pipeline flow:**
```
Code push → Lint & Test → Docker Build → Push Registry → Deploy → Smoke Test
```

**Deployment strategies:**
| Strategy | How |
|----------|-----|
| Rolling update | Replace pods one-by-one (K8s default) |
| Blue/green | Two envs, switch traffic |
| Canary | Small % traffic to new version |

**Secrets needed:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `KUBE_CONFIG`

---

## Aws

**Tool:** Terraform (`infrastructure/aws/`)

**Services used:**
| Service | Role |
|---------|------|
| **ECS Fargate** | Run containers (no EC2 management) |
| **ECR** | Docker image registry |
| **ALB** | Load balancer + HTTPS |
| **DynamoDB** | NoSQL database |
| **VPC** | Network isolation |
| **IAM** | Permissions (task role vs execution role) |
| **CloudWatch** | Logs |

**Flow:** Internet → ALB → ECS tasks → DynamoDB

**Deploy:**
```bash
cd infrastructure/aws
terraform init && terraform apply
```

**ECS vs EKS:** ECS = simpler, AWS-locked. EKS = full Kubernetes on AWS.

---

## K8s

**Tools:** Raw YAML manifests + Helm chart

**Key objects:**
| Object | Purpose |
|--------|---------|
| **Deployment** | Stateless app (API, Web) |
| **StatefulSet** | MongoDB with persistent storage |
| **Service** | Internal networking (ClusterIP) |
| **Ingress** | External HTTP routing + TLS |
| **ConfigMap** | Non-secret config |
| **Secret** | Credentials |
| **HPA** | Auto-scale on CPU |
| **Namespace** | Environment isolation |

**Probes:**
| Probe | Path | Meaning |
|-------|------|---------|
| Liveness | /health | Pod alive? Restart if fail |
| Readiness | /ready | Can serve traffic? Remove from rotation if fail |

**Deploy:**
```bash
helm upgrade --install interview-stack \
  infrastructure/kubernetes/helm/interview-stack \
  --namespace staging --create-namespace
```

**kubectl cheatsheet:**
```bash
kubectl get pods -n interview-stack
kubectl logs -f deployment/interview-api
kubectl rollout undo deployment/interview-api
```

---

## Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Repository** | `packages/db` | Swap DB without changing API |
| **Adapter** | MongoDB/DynamoDB classes | Different APIs, same interface |
| **Factory** | `createProductRepository()` | Env-driven provider selection |
| **Dual API** | REST + GraphQL | Different clients, same data |
| **Event Bus** | `packages/events` | Pub/sub for domain + ops events |
| **Middleware** | `apps/api/src/middleware` | Cross-cutting concerns (auth, rate limit) |
| **Monorepo** | npm workspaces | Shared packages, one CI pipeline |

---

## Qa

### Top 10 interview one-liners

1. **React vs Next.js?** React = CSR library. Next.js = SSR/SEO framework on React.

2. **REST vs GraphQL?** REST for caching/simplicity. GraphQL for flexible mobile queries.

3. **MongoDB vs DynamoDB?** Mongo = rich queries. Dynamo = AWS auto-scale key-value.

4. **ECS vs Kubernetes?** ECS = simpler AWS-native. K8s = portable, more ops.

5. **SSR vs CSR?** SSR = HTML ready on first load (SEO). CSR = blank until JS runs.

6. **Liveness vs Readiness?** Liveness = restart pod. Readiness = stop sending traffic.

7. **Repository pattern?** Abstract DB behind interface — swap implementations freely.

8. **Zero-downtime deploy?** Rolling update, maxUnavailable: 0, readiness probes.

9. **CAP theorem?** Mongo = CP-leaning. DynamoDB = AP (eventual consistency).

10. **How handle 10x traffic?** HPA scale pods, DynamoDB on-demand, CDN, rate limiting.

### System design template (product catalog)

1. Next.js ISR for SEO product pages
2. GraphQL for mobile, REST for admin
3. NoSQL for flexible product schema
4. Redis cache (mention) + CDN for static
5. K8s HPA or ECS auto-scaling

Full scenarios: `docs/interview-guide/scenarios.md`

---

## Ports

| Service | URL |
|---------|-----|
| Next.js | http://localhost:3000 |
| React SPA | http://localhost:5173 |
| API | http://localhost:4000 |
| GraphQL | http://localhost:4000/graphql |
| MongoDB | localhost:27017 |
| DynamoDB Local | localhost:8000 |
| Scenarios (Next) | http://localhost:3000/scenarios |
| Scenarios (React) | http://localhost:5173/scenarios |
| Compare page | http://localhost:5173/compare |

---

## Docker

```bash
docker compose up -d mongodb          # DB only
npm run docker:full                   # Full stack in containers
npm run docker:smoke                    # Verify all services
npm run docker:down                   # Stop
```

**Profiles:** `full` = API + Web + MongoDB in containers

---

## All Doc Files

| File | Topic |
|------|-------|
| `docs/MOBILE-REFERENCE.md` | **This file** — read on phone |
| `docs/interview-guide/README.md` | Master Q&A index |
| `docs/interview-guide/react.md` | React concepts |
| `docs/interview-guide/nextjs.md` | Next.js concepts |
| `docs/interview-guide/react-vs-nextjs.md` | Side-by-side comparison |
| `docs/interview-guide/nosql.md` | MongoDB vs DynamoDB |
| `docs/interview-guide/graphql.md` | GraphQL + Apollo v5 |
| `docs/interview-guide/cicd.md` | CI/CD pipelines |
| `docs/interview-guide/aws.md` | AWS services |
| `docs/interview-guide/kubernetes.md` | K8s objects |
| `docs/interview-guide/scenarios.md` | 12 interview scenarios |
| `docs/interview-guide/situational-events.md` | Runnable event demos |
| `docs/docker-full-demo.md` | Docker end-to-end |

---

## Glossary

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface — how apps talk |
| **CSR** | Client-Side Rendering |
| **SSR** | Server-Side Rendering |
| **ISR** | Incremental Static Regeneration |
| **SSE** | Server-Sent Events — one-way real-time stream |
| **SSE vs WebSocket** | SSE = server→client only, simpler. WS = bidirectional |
| **ORM** | Object-Relational Mapping (we use Repository instead for NoSQL) |
| **IaC** | Infrastructure as Code (Terraform) |
| **HPA** | Horizontal Pod Autoscaler |
| **ALB** | Application Load Balancer (AWS) |
| **ECR** | Elastic Container Registry (AWS Docker registry) |
| **GHCR** | GitHub Container Registry |
| **Helm** | Kubernetes package manager (templated YAML) |
| **Probe** | K8s health check on a pod |
| **Monorepo** | Multiple packages in one git repo |
| **Workspace** | npm monorepo child package |
| **Middleware** | Code that runs before route handlers |
| **Hydration** | React attaching to server-rendered HTML |

---

*Bookmark this file on GitHub mobile for instant interview prep anywhere.*
