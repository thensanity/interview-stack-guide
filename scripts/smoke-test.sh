#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for API..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:4000/health >/dev/null 2>&1; then break; fi
  sleep 2
done

echo "API health: $(curl -s http://localhost:4000/health)"
echo "REST count: $(curl -s http://localhost:4000/api/products | jq '.data | length')"
echo "GraphQL: $(curl -s -X POST http://localhost:4000/graphql -H 'Content-Type: application/json' -d '{"query":"{ productCount }"}' | jq -c '.data')"
echo "Web status: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/)"
echo ""
echo "Demo OK — open http://localhost:3000"
