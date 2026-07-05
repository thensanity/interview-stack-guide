# SQL vs NoSQL Interview Guide

When to choose **relational (SQL)** vs **NoSQL** — complement to [nosql.md](./nosql.md).

## Quick Comparison

| Factor | SQL (PostgreSQL, MySQL) | NoSQL (MongoDB, DynamoDB) |
|--------|-------------------------|---------------------------|
| Schema | Fixed, migrations | Flexible, evolving |
| Joins | Native, efficient | Denormalize or app-side |
| Transactions | ACID multi-table | Limited (single-doc or per-item) |
| Scale pattern | Vertical + read replicas | Horizontal sharding |
| Query style | Ad-hoc SQL | Model-specific APIs |
| Best for | Orders, payments, reporting | Catalogs, events, sessions |

## When SQL Wins

1. **Financial transactions** — debit/credit must be atomic across tables
2. **Complex reporting** — JOINs across orders, customers, inventory
3. **Strong consistency requirements** — inventory count cannot drift
4. **Mature team tooling** — ORMs, migrations (Prisma, Flyway)

**Interview line:** "For checkout and inventory I'd use PostgreSQL. For product catalog browsing I'd use the NoSQL layer in this repo."

## When NoSQL Wins (This Repo)

1. **Flexible product schema** — variants, tags, nested attributes without migrations
2. **High read volume, simple access patterns** — get by ID, filter by category
3. **Horizontal scale** — DynamoDB partition keys at AWS scale
4. **Document-oriented UX** — JSON-shaped data end-to-end

**Code:** `packages/db/` — same API regardless of provider.

## Hybrid Architecture (Common in Interviews)

```
                    ┌─────────────┐
  Product browse ──▶│  MongoDB /  │  (this repo)
                    │  DynamoDB   │
                    └─────────────┘
                    ┌─────────────┐
  Orders/checkout ─▶│ PostgreSQL  │  (extension)
                    └─────────────┘
```

## CAP Theorem (Practical)

- **SQL primary node:** CP-leaning for writes
- **MongoDB replica set:** strong on primary, eventual on secondaries
- **DynamoDB:** AP — availability + partition tolerance, eventual by default

Don't recite theory — tie to use case: "Product listing tolerates eventual consistency; stock decrement does not."

## Migration Between Worlds

| Direction | Approach |
|-----------|----------|
| SQL → NoSQL | Extract read models, CQRS, dual-write (like Scenario 2) |
| NoSQL → SQL | Normalize schema, ETL batch jobs, strangler fig |

## This Repo Scope

This project demonstrates **NoSQL only** intentionally — one data paradigm done deeply. Mention SQL in system design answers when the use case requires ACID joins.

## Related

- [nosql.md](./nosql.md) — MongoDB vs DynamoDB
- [scenarios.md](./scenarios.md) — Scenario 1 e-commerce design
- Playground REST tab — live CRUD demo
