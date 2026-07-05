# ADR 002: Dual Database via Repository Pattern

## Status
Accepted

## Context
Interviewers ask about MongoDB vs DynamoDB and migration strategies. The API should not branch on provider-specific logic.

## Decision
`ProductRepository` interface with factory-selected adapters (`DATA_PROVIDER` env). Optional `DualWriteRepository` for migration phase 2.

## Consequences
- **Positive:** Swap providers without touching REST/GraphQL layers; runnable migration scenario
- **Negative:** Lowest-common-denominator API; DynamoDB uses Scan in demo (not production pattern)
- **Mitigation:** Document GSI design as extension in nosql.md

## Alternatives Considered
- **Single DB only:** rejected — misses key interview topic
- **ORM (Prisma):** rejected — hides NoSQL tradeoffs we want to discuss
