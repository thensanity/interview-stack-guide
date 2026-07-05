# Interview Stack Guide

A production-shaped reference monorepo for technical interview preparation covering **React**, **Next.js**, **NoSQL/GraphQL dual backends**, **CI/CD**, and **AWS/Kubernetes dual cloud deployment**.

> **📱 Mobile guide:** Read [docs/MOBILE-REFERENCE.md](docs/MOBILE-REFERENCE.md) on your phone — all tools, commands, concepts, and interview answers in one place.

## Architecture

```
┌──────────────┐  ┌──────────────┐
│  React SPA   │  │   Next.js    │
│  (CSR/Vite)  │  │ (SSR/ISR)    │
└──────┬───────┘  └──────┬───────┘
       │    REST / GraphQL │
       └─────────┬─────────┘
                 ▼
        ┌──────────────┐   Repository   ┌─────────────┐
        │ Express +    │ ─────────────▶ │ MongoDB OR  │
        │ Apollo GQL   │                │ DynamoDB    │
        └──────────────┘                └─────────────┘
```

## Quick Start

```bash
# 1. Clone and install
cd interview-stack-guide
cp .env.example .env
npm install

# 2. Start MongoDB locally
docker compose up -d mongodb

# 3. Run dev servers (API :4000, Next.js :3000, React :5173)
npm run dev
```

Open http://localhost:3000 (Next.js) or http://localhost:5173 (React SPA)

### React vs Next.js Only

```bash
npm run dev:react   # API + React SPA
npm run dev:next    # API + Next.js
```

### Switch NoSQL Provider

```bash
# MongoDB (default)
DATA_PROVIDER=mongodb

# DynamoDB Local
docker compose up -d dynamodb-local
DATA_PROVIDER=dynamodb
```

## Project Structure

```
interview-stack-guide/
├── apps/
│   ├── web/          # Next.js 15 App Router (SSR/ISR)
│   ├── react-spa/    # Plain React + Vite (CSR) — compare with Next.js
│   └── api/          # Express REST + Apollo GraphQL
├── packages/
│   ├── db/           # MongoDB + DynamoDB adapters (Repository pattern)
│   └── graphql/      # Shared GraphQL schema + resolvers
├── infrastructure/
│   ├── aws/          # Terraform: ECS, ALB, DynamoDB, VPC
│   └── kubernetes/   # Manifests + Helm chart
├── .github/workflows/ # CI/CD pipelines
└── docs/interview-guide/  # Interview Q&A by topic
```

## Interview Guide

| Topic | Document |
|-------|----------|
| **📱 Mobile (read on phone)** | [docs/MOBILE-REFERENCE.md](docs/MOBILE-REFERENCE.md) |
| Full Q&A | [docs/interview-guide/README.md](docs/interview-guide/README.md) |
| Next.js | [docs/interview-guide/nextjs.md](docs/interview-guide/nextjs.md) |
| **React vs Next.js** | [docs/interview-guide/react-vs-nextjs.md](docs/interview-guide/react-vs-nextjs.md) |
| React | [docs/interview-guide/react.md](docs/interview-guide/react.md) |
| NoSQL | [docs/interview-guide/nosql.md](docs/interview-guide/nosql.md) |
| GraphQL | [docs/interview-guide/graphql.md](docs/interview-guide/graphql.md) |
| CI/CD | [docs/interview-guide/cicd.md](docs/interview-guide/cicd.md) |
| AWS | [docs/interview-guide/aws.md](docs/interview-guide/aws.md) |
| Kubernetes | [docs/interview-guide/kubernetes.md](docs/interview-guide/kubernetes.md) |
| **Scenarios (12)** | [docs/interview-guide/scenarios.md](docs/interview-guide/scenarios.md) |
| **Situational Events** | [docs/interview-guide/situational-events.md](docs/interview-guide/situational-events.md) |
| **Testing** | [docs/interview-guide/testing.md](docs/interview-guide/testing.md) |
| **Observability** | [docs/interview-guide/observability.md](docs/interview-guide/observability.md) |
| **Decision Matrix** | [docs/DECISION-MATRIX.md](docs/DECISION-MATRIX.md) |
| **Learning Paths** | [docs/learning-paths/](docs/learning-paths/) |
| Docker demo | [docs/docker-full-demo.md](docs/docker-full-demo.md) |

## Full Docker Demo (No Node Required)

```powershell
npm run docker:full    # MongoDB + API + Web in containers
npm run docker:smoke   # Verify REST, GraphQL, and web
```

See [docs/docker-full-demo.md](docs/docker-full-demo.md) for details.

### Kubernetes (Helm)

```bash
helm upgrade --install interview-stack \
  infrastructure/kubernetes/helm/interview-stack \
  --namespace staging --create-namespace
```

### AWS (Terraform)

```bash
cd infrastructure/aws
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform apply
```

## Key Design Patterns

1. **Repository Pattern** — swap NoSQL providers without changing API code
2. **Adapter Pattern** — MongoDB vs DynamoDB implementations
3. **Dual API** — REST + GraphQL over same data layer
4. **Dual Cloud** — same Docker images deploy to ECS or Kubernetes
5. **JWT Auth** — optional `ENABLE_AUTH=true` for mutation protection
6. **Redis Cache** — optional cache-aside for product reads (`REDIS_URL`)
7. **DataLoader** — GraphQL N+1 batching
8. **Observability** — structured logs + Prometheus `/metrics`
9. **Runnable Scenarios** — 10 failure/ops scenarios including CI/CD and migration

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (K8s liveness) |
| GET | `/ready` | Readiness probe |
| GET | `/api/products` | REST list products (paginated, cached with Redis) |
| POST | `/api/products` | REST create product (Zod validated) |
| POST | `/api/auth/login` | Obtain JWT token |
| GET | `/metrics` | Prometheus metrics |
| GET | `/openapi.yaml` | OpenAPI 3.0 spec |
| WS | `/api/events/ws` | WebSocket event stream |
| POST | `/graphql` | GraphQL endpoint |

## License

MIT — use freely for interview prep and learning.
