# NoSQL Interview Questions

## Comparison Table

| Feature | MongoDB | DynamoDB |
|---------|---------|----------|
| Model | Document (BSON) | Key-value / Document |
| Query language | MQL / aggregation pipeline | API calls (GetItem, Query, Scan) |
| Joins | `$lookup` | Denormalize or single-table design |
| Schema | Flexible / schemaless | Flexible attributes per item |
| Scaling | Vertical + sharding | Horizontal, partition key design |
| Consistency | Strong on primary (replica set) | Eventual default, strong optional |
| Best for | Rich queries, multi-cloud | AWS-native KV at massive scale |
| Local dev | `docker compose up -d mongodb` | `docker compose up -d dynamodb-local` |

## Design Patterns in This Repo

### Repository Pattern
Abstracts data access behind `ProductRepository` interface. API and GraphQL never import MongoDB or DynamoDB directly.

```typescript
// packages/db/src/index.ts — factory selects provider via env
DATA_PROVIDER=mongodb | dynamodb
```

### Adapter Pattern
- `mongodb-adapter.ts` — indexes, text search, `findOneAndUpdate`
- `dynamodb-adapter.ts` — Scan + filter (demo), UpdateExpression

### Dual-Write Migration
`dual-write-adapter.ts` wraps primary + shadow secondary. Trigger `dual_write_migration` scenario to see `MIGRATION_DUAL_WRITE` events.

**Migration phases (Scenario 2):**
1. Implement DynamoDB adapter ✅
2. Dual-write behind feature flag ✅ (scenario)
3. Backfill historical data (batch job — extension)
4. Shadow-read comparison (extension)
5. Flip `DATA_PROVIDER=dynamodb`
6. Decommission MongoDB

## Common Questions

### Q: When MongoDB over DynamoDB?
**A:** Need ad-hoc queries, aggregations, text search, multi-cloud. Product catalog with nested variants fits MongoDB well.

### Q: When DynamoDB over MongoDB?
**A:** AWS-native, predictable access patterns, massive scale, on-demand auto-scaling. Key-value lookups by ID.

### Q: CAP theorem?
**A:** MongoDB replica set: CP-leaning on primary reads. DynamoDB: AP — highly available, partition tolerant, eventual consistency by default. Don't dogmatically label — explain tradeoffs for your use case.

### Q: How do you index?
**A:** MongoDB: compound indexes on `category`, `price`, text index on `name`/`description` (see adapter). DynamoDB: partition key `id`, GSIs for query patterns (extension).

### Q: Pagination?
**A:** This repo implements offset/cursor pagination in both adapters. `GET /api/products?limit=10&cursor=20`. DynamoDB production would use `LastEvaluatedKey`.

## Code References

- MongoDB: `packages/db/src/mongodb-adapter.ts`
- DynamoDB: `packages/db/src/dynamodb-adapter.ts`
- Factory: `packages/db/src/index.ts`
- Mock (tests): `packages/db/src/mock-adapter.ts`
- Dual-write: `packages/db/src/dual-write-adapter.ts`

## SQL vs NoSQL (Quick Answer)
Use SQL when you need ACID transactions across complex relations (orders + inventory + payments). Use NoSQL when schema is flexible, scale is horizontal, and access patterns are known upfront.
