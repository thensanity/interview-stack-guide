# Pact Contract Testing Scaffold

Consumer-driven contracts between `web`/`react-spa` (consumers) and `api` (provider).

## Interview talking points

- **Consumer** defines expected API shape
- **Provider** verifies it can satisfy all consumer pacts
- Prevents breaking changes across independent deploy units

## Example workflow

```bash
# 1. Consumer generates pact file
npm run pact:consumer -w @interview/web

# 2. Provider verifies
npm run pact:provider -w @interview/api
```

## Files to add in production

| File | Purpose |
|------|---------|
| `contracts/products.consumer.pact.ts` | Web expects GET /api/products |
| `contracts/pact-broker.yml` | CI publishes pacts |

This scaffold documents the pattern; integrate `@pact-foundation/pact` for full implementation.
