# Testing Guide

Testing pyramid implemented in this repo — interview talking points with real code.

## Pyramid

```
        /  E2E  \        Playwright (e2e/)
       / Integration \   API integration tests
      /    Unit       \  validation, events, db, config
```

## Unit Tests

| Package | File | Covers |
|---------|------|--------|
| validation | `packages/validation/src/schemas.test.ts` | Zod schema validation |
| events | `packages/events/src/event-bus.test.ts` | Pub/sub, history |
| db | `packages/db/src/repository.test.ts` | Pagination, dual-write |
| api | `apps/api/src/config.test.ts` | Config loading |

Run: `npm run test -w @interview/validation`

## Integration Tests

`apps/api/src/integration.test.ts` — boots real Express app with MockProductRepository:
- Health endpoint
- Paginated product list
- Validation errors (400)
- JWT login
- OpenAPI spec
- Prometheus metrics

No external DB required — uses in-memory mock.

## E2E Tests

`e2e/api.spec.ts` — Playwright against running API:
- Requires API on port 4000 OR starts via test setup

Run: `npm run test:e2e`

## Interview Answers

**Q: How do you test a Repository with multiple adapters?**
> Contract tests against `MockProductRepository`, then adapter-specific integration tests with testcontainers for MongoDB/DynamoDB.

**Q: Unit vs integration vs E2E?**
> Unit for business logic (validation, event bus). Integration for API contracts with mocked DB. E2E for critical user flows (create product → see event).

**Q: How does CI run tests?**
> `.github/workflows/ci.yml` runs `npm run test --workspaces` on every PR.

## Adding Tests

```bash
# New unit test
apps/api/src/my-feature.test.ts

# Run single workspace
npm run test -w @interview/api
```
