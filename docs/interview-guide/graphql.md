# GraphQL Interview Questions

## REST vs GraphQL Decision Matrix

| Need | Choose |
|------|--------|
| Simple CRUD | REST |
| Mobile bandwidth optimization | GraphQL |
| Multiple clients, different shapes | GraphQL |

## Apollo Server v5

Express integration is now a separate package:

```typescript
import { expressMiddleware } from "@as-integrations/express4";
```

See `apps/api/src/index.ts`. Same API as v4 — call `await server.start()` before mounting middleware.

## Code References

- Schema: `packages/graphql/src/schema.ts`
- Resolvers: `packages/graphql/src/resolvers.ts`
- Apollo integration: `apps/api/src/index.ts`
