#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4000}"
WEB_URL="${WEB_URL:-http://localhost:3000}"

echo "Smoke testing against $API_URL"

for i in $(seq 1 30); do
  if curl -sf "$API_URL/health" >/dev/null 2>&1; then break; fi
  sleep 2
done

echo "API health: $(curl -s "$API_URL/health")"
echo "REST products: $(curl -s "$API_URL/api/products?limit=3")"
echo "GraphQL count: $(curl -s -X POST "$API_URL/graphql" -H 'Content-Type: application/json' -d '{"query":"{ productCount }"}')"
echo "OpenAPI: $(curl -s -o /dev/null -w '%{http_code}' "$API_URL/openapi.yaml")"
echo "Metrics: $(curl -s -o /dev/null -w '%{http_code}' "$API_URL/metrics")"
echo "Auth login: $(curl -s -X POST "$API_URL/api/auth/login" -H 'Content-Type: application/json' -d '{"email":"admin@interview.local","password":"interview123"}' | head -c 80)..."
echo "Web status: $(curl -s -o /dev/null -w '%{http_code}' "$WEB_URL/")"
echo "Playground: $(curl -s -o /dev/null -w '%{http_code}' "$WEB_URL/playground")"
echo ""
echo "Smoke OK — open $WEB_URL/playground"
