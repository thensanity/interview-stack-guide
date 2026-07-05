#!/usr/bin/env bash
# Deploy full stack with free open-source tools: Docker Compose + Caddy + MongoDB + Redis
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/deploy/.env.deploy"

cd "$ROOT"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Creating deploy/.env.deploy from example..."
  cp "$ROOT/deploy/.env.deploy.example" "$ENV_FILE"
  echo ""
  echo ">>> Edit deploy/.env.deploy — set DOMAIN and ACME_EMAIL <<<"
  echo "    DOMAIN must have a DNS A record pointing to this server's public IP"
  echo ""
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ "$DOMAIN" == "interview.example.com" ]] || [[ -z "$DOMAIN" ]]; then
  echo "ERROR: Set a real DOMAIN in deploy/.env.deploy"
  exit 1
fi

if [[ -z "${ACME_EMAIL:-}" ]]; then
  echo "ERROR: Set ACME_EMAIL in deploy/.env.deploy (for Let's Encrypt HTTPS)"
  exit 1
fi

if ! command -v docker &>/dev/null; then
  echo "ERROR: Docker is required. Install: https://docs.docker.com/engine/install/"
  exit 1
fi

echo "Deploying to https://$DOMAIN"
echo "  Stack: Caddy + Next.js + Express API + MongoDB + Redis (all open source)"
echo ""

export DOMAIN ACME_EMAIL

docker compose -f docker-compose.deploy.yml --env-file "$ENV_FILE" up -d --build

echo ""
echo "Waiting for health checks..."
sleep 20

if docker compose -f docker-compose.deploy.yml --env-file "$ENV_FILE" exec -T api wget -qO- http://localhost:4000/health 2>/dev/null; then
  echo "API: healthy"
else
  echo "API: still starting (check logs if this persists)"
fi

echo ""
echo "============================================"
echo "  Deploy complete!"
echo "============================================"
echo ""
echo "  Playground:  https://$DOMAIN/playground"
echo "  API health:  https://$DOMAIN/health"
echo "  Presenter:   https://$DOMAIN/playground/demo"
echo ""
echo "  Logs:    docker compose -f docker-compose.deploy.yml --env-file deploy/.env.deploy logs -f"
echo "  Stop:    docker compose -f docker-compose.deploy.yml --env-file deploy/.env.deploy down"
echo "  Update:  git pull && ./scripts/deploy-oss.sh"
echo ""
echo "  HTTPS cert via Caddy + Let's Encrypt (allow 1-2 min on first run)"
echo "============================================"
