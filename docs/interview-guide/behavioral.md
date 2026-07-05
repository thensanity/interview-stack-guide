# Behavioral Interview Guide

STAR-format answers tied to **this repository** — adapt with your real experience.

## STAR Framework

- **S**ituation — context and stakes
- **T**ask — your responsibility
- **A**ction — what you did (point at code in this repo)
- **R**esult — measurable outcome

---

## Story 1: Handling a Production Incident

**Prompt:** "Tell me about a time you debugged a production issue."

**Answer:**
> **S:** During a Kubernetes deploy, our API pods were flapping — traffic dropped 40%.
> **T:** I owned the API service and needed to restore readiness without a full rollback.
> **A:** I checked `kubectl describe pod` and saw readiness probe failures on `/ready` before MongoDB was reachable — a startup race. I reproduced locally with docker-compose health conditions, increased `initialDelaySeconds` in the deployment manifest, and added a dependency health gate. I also used structured logs with request IDs (see `apps/api/src/middleware/logging.ts`) to confirm no application errors — only probe timing.
> **R:** Pods stabilized in one rollout cycle. We added the race condition to our interview scenarios as `db_slow` for future drills.

**Demo:** Trigger `db_error` and `recover` at `/playground` → Scenarios tab.

---

## Story 2: Database Migration

**Prompt:** "Describe a challenging migration."

**Answer:**
> **S:** We needed to move a product catalog from MongoDB to DynamoDB for AWS cost and scale goals.
> **T:** Migrate without downtime or dual-write inconsistencies.
> **A:** I implemented the Repository pattern with a DynamoDB adapter (`packages/db/src/dynamodb-adapter.ts`), then a dual-write wrapper for phase 2 (`dual-write-adapter.ts`). We shadow-wrote to DynamoDB while serving reads from MongoDB, compared counts, then flipped `DATA_PROVIDER` per environment.
> **R:** Zero API code changes in GraphQL resolvers. Migration completed in staging over two weeks with no customer-facing errors.

**Demo:** Trigger `dual_write_migration` in Playground.

---

## Story 3: CI/CD Pipeline Design

**Prompt:** "How do you ensure quality in deployments?"

**Answer:**
> **S:** Our team shipped multiple times daily and had two rollback incidents from untested image changes.
> **T:** Design a pipeline with gates before production traffic.
> **A:** I structured CI as lint → unit/integration tests → Docker build → security scan placeholder. CD deploys to staging automatically; production requires manual approval. Post-deploy smoke tests hit `/health`, REST, and GraphQL. Kubernetes uses `kubectl rollout status` before marking deploy green.
> **R:** Rollbacks dropped to zero over the next quarter. Failed builds are caught at PR time, not in production.

**Demo:** Walk through `.github/workflows/ci.yml` + trigger `cicd_pipeline` scenario.

---

## Story 4: REST vs GraphQL Decision

**Prompt:** "Why would you expose both?"

**Answer:**
> **S:** We had a public web app, a mobile app, and partner webhooks for the same product catalog.
> **T:** Choose API styles per client without duplicating business logic.
> **A:** REST for webhooks and cacheable public endpoints. GraphQL for mobile bandwidth optimization with field selection. Both use the same `ProductRepository` — see `apps/api/src/app.ts`.
> **R:** Mobile payload size dropped ~60%. Partners integrated faster with familiar REST.

**Demo:** Playground REST tab vs GraphQL tab side-by-side.

---

## Story 5: Conflict / Disagreement

**Prompt:** "Tell me about disagreeing with a technical decision."

**Answer:**
> **S:** A teammate wanted to split into microservices immediately for a 3-person team.
> **T:** I needed to advocate for pragmatic architecture without blocking velocity.
> **A:** I proposed keeping the modular monorepo (this structure) with clear package boundaries (`@interview/db`, `@interview/graphql`) and documented ADRs. We set triggers for splitting: team > 8 engineers or independent deploy cadence needed.
> **R:** Team agreed. We shipped faster and still have clean extraction points if needed.

**Demo:** Point at monorepo layout + `docs/ADR/001-monorepo.md`.

---

## Quick Prep Checklist

- [ ] Run Playground demo script once out loud
- [ ] Know 3 files to open during live coding
- [ ] Have one real project detail to swap into each story
- [ ] Practice 2-minute and 5-minute versions of each answer
