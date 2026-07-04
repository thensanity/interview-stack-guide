# NoSQL Interview Questions

## Comparison Table

| Feature | MongoDB | DynamoDB |
|---------|---------|----------|
| Query language | MQL / aggregation | API calls only |
| Joins | `$lookup` | Denormalize |
| Best for | Rich queries | Key-value at scale on AWS |

## Code References

- MongoDB adapter: `packages/db/src/mongodb-adapter.ts`
- DynamoDB adapter: `packages/db/src/dynamodb-adapter.ts`
- Factory: `packages/db/src/index.ts`
