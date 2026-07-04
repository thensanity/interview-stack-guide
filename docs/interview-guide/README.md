# Interview Stack Guide — Complete Q&A Reference

Use this document to prepare for technical interviews covering the full stack demonstrated in this repository.

---

## Table of Contents

1. [Next.js](#nextjs)
2. [NoSQL Databases](#nosql-databases)
3. [GraphQL](#graphql)
4. [REST vs GraphQL Duality](#rest-vs-graphql-duality)
5. [CI/CD](#cicd)
6. [AWS](#aws)
7. [Kubernetes](#kubernetes)
8. [System Design Scenarios](#system-design-scenarios)
9. [Behavioral + Architecture Talking Points](#behavioral--architecture-talking-points)

---

## Next.js

### Q: React vs Next.js — when to use which?
**A:** React (SPA) for auth-gated dashboards where SEO doesn't matter. Next.js for public sites needing SSR/ISR and SEO. See `apps/react-spa` vs `apps/web` and [react-vs-nextjs.md](./react-vs-nextjs.md).

### Q: Explain the App Router vs Pages Router.
**A:** App Router (Next.js 13+) uses `app/` directory with React Server Components by default. Layouts nest automatically, loading/error boundaries are file-based, and data fetching happens in Server Components. Pages Router uses `pages/` with `getServerSideProps`, `getStaticProps`, and client-side routing. This project uses App Router.

### Q: What is the difference between SSR, SSG, and ISR?
**A:**
- **SSR** (`dynamic = "force-dynamic"`): Render on every request. Used in `/products`.
- **SSG**: Pre-render at build time. Default for static pages.
- **ISR** (`revalidate: 60`): Static with periodic revalidation. Used on home page.

### Q: Server Components vs Client Components?
**A:** Server Components run on the server, can fetch data directly, and don't ship JS to the client. Client Components (`"use client"`) handle interactivity — forms, state, event handlers. `ProductForm.tsx` is a Client Component; product listing is Server-rendered.

### Q: Why `output: "standalone"` in next.config.js?
**A:** Produces a minimal self-contained Node.js server for Docker. Copies only required files into the container — critical for production deployments on ECS/K8s.

---

## NoSQL Databases

### Q: When would you choose MongoDB over DynamoDB?
**A:** MongoDB for rich queries, aggregations, and multi-cloud. DynamoDB for AWS-native, auto-scaling key-value access at massive scale.

### Q: Explain the Repository Pattern.
**A:** Abstracts data access behind `ProductRepository`. Swap MongoDB/DynamoDB via factory + env var.

See `packages/db/` for implementations.

---

## GraphQL

### Q: GraphQL vs REST?
**A:** REST for simple CRUD and HTTP caching. GraphQL when clients need flexible field selection. This project exposes both over the same repository.

### Q: Apollo Server v5 changes?
**A:** Express integration moved to `@as-integrations/express4` (or `express5` for Express 5). Import `expressMiddleware` from that package instead of `@apollo/server/express4`. See `apps/api/src/index.ts`.

---

## CI/CD

### Q: Walk through this project's pipeline.
**A:** CI lints/tests/builds Docker images. CD-AWS pushes to ECR and deploys ECS. CD-K8s pushes to GHCR and runs Helm upgrade.

---

## AWS

### Q: Explain the AWS architecture.
**A:** Internet → ALB → ECS Fargate → DynamoDB. Terraform manages VPC, IAM, ECR, CloudWatch.

---

## Kubernetes

### Q: Core objects used?
**A:** Deployment, StatefulSet (MongoDB), Service, Ingress, ConfigMap, HPA, Namespace.

---

## Quick Command Reference

```bash
cp .env.example .env
docker compose up -d mongodb
npm install
npm run dev
```

For detailed topic guides see the other files in this directory.

## Extended Scenarios

See [scenarios.md](./scenarios.md) for 12 system design and behavioral interview walkthroughs.
