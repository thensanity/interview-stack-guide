# GraphQL Interview Questions

## REST vs GraphQL Decision Matrix

| Need | Choose | Example in Repo |
|------|--------|-----------------|
| Simple CRUD + HTTP caching | REST | `GET /api/products` |
| Mobile bandwidth optimization | GraphQL | Select only `id name price` |
| Multiple clients, different shapes | GraphQL | Web vs mobile field selection |
| Webhooks / integrations | REST | Standard HTTP verbs |
| Strong typing + introspection | GraphQL | `/graphql` with schema |

## Schema Design

Schema-first SDL in `packages/graphql/src/schema.ts`:
- `Product` type maps to domain model
- `ProductPage` for paginated results
- `productsByIds` for DataLoader batching demo
- Mutations mirror REST CRUD

## N+1 Problem & DataLoader

**Problem:** Resolving a list of IDs with individual DB calls per item.

**Solution:** `packages/graphql/src/dataloaders.ts` batches `findByIds` into one query.

```graphql
query {
  productsByIds(ids: ["id1", "id2", "id3"]) {
    id name price
  }
}
```

## Apollo Server v5

Express integration moved to separate package:

```typescript
import { expressMiddleware } from "@as-integrations/express4";
await server.start(); // required before mounting
```

See `apps/api/src/app.ts`.

## Pagination

```graphql
query {
  products(limit: 10, offset: 0) {
    items { id name price }
    total
    nextCursor
  }
}
```

## Common Questions

### Q: GraphQL vs REST for this product catalog?
**A:** REST for public caching and simplicity. GraphQL for clients needing flexible field selection. Both sit on same `ProductRepository` — no duplicated business logic.

### Q: How do you handle errors in GraphQL?
**A:** Partial data with `errors` array. For REST-style simplicity this project also exposes REST endpoints with standard HTTP status codes.

### Q: Subscriptions vs SSE?
**A:** GraphQL subscriptions need WebSocket. This project uses SSE (`/api/events/stream`) and WebSocket (`/api/events/ws`) for operational events — simpler for one-way server push.

### Q: How do you prevent over-fetching?
**A:** Client specifies fields. Compare GraphQL demo query vs REST response which returns full product objects.

### Q: Schema evolution?
**A:** Add optional fields (non-breaking). Deprecate with `@deprecated` directive. Version REST; evolve GraphQL additively.

## Code References

- Schema: `packages/graphql/src/schema.ts`
- Resolvers: `packages/graphql/src/resolvers.ts`
- DataLoader: `packages/graphql/src/dataloaders.ts`
- Apollo integration: `apps/api/src/app.ts`
- OpenAPI (REST counterpart): `apps/api/openapi.yaml`

## Security Notes
- Depth limiting and query cost analysis in production (mention)
- Auth context passed to resolvers when `ENABLE_AUTH=true`
- Rate limiting at HTTP layer applies to `/graphql` too
