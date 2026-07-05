#!/usr/bin/env bash
# Master setup script — local dev OR public OSS deploy
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}==>${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${RED}!${NC} $*"; }

MODE="${1:-}"

usage() {
  cat <<'EOF'
Interview Stack Guide — Setup

Usage:
  ./scripts/setup-all.sh local     # Docker: API + Web + DB + Redis (no domain needed)
  ./scripts/setup-all.sh dev       # npm run dev (fastest for coding)
  ./scripts/setup-all.sh demo      # Playground demo — no MongoDB required
  ./scripts/setup-all.sh public    # HTTPS deploy with Caddy (needs domain + Docker)
  ./scripts/setup-all.sh check     # Verify prerequisites only

Examples:
  ./scripts/setup-all.sh local
  # → http://localhost:3000/playground

  ./scripts/setup-all.sh public
  # → https://YOUR_DOMAIN/playground
EOF
}

check_node() {
  if ! command -v node &>/dev/null; then
    warn "Node.js 20+ required: https://nodejs.org/"
    return 1
  fi
  ok "Node $(node -v)"
}

check_docker() {
  if ! command -v docker &>/dev/null; then
    warn "Docker not installed"
    return 1
  fi
  if ! docker info &>/dev/null; then
    warn "Docker daemon not running (try: sudo systemctl start docker)"
    return 1
  fi
  ok "Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"
}

install_docker() {
  if check_docker 2>/dev/null; then return 0; fi
  info "Installing Docker..."
  if command -v curl &>/dev/null && sudo -n true 2>/dev/null; then
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER" 2>/dev/null || true
    ok "Docker installed — you may need to log out/in for group access"
    sudo docker info &>/dev/null && ok "Docker daemon running"
  else
    warn "Cannot auto-install Docker. Install manually: https://docs.docker.com/engine/install/"
    return 1
  fi
}

setup_env_files() {
  if [[ ! -f .env ]]; then
    cp .env.example .env
    ok "Created .env from .env.example"
  else
    ok ".env already exists"
  fi
}

setup_dev() {
  info "Setting up local development (npm)..."
  check_node
  setup_env_files
  info "Installing dependencies..."
  npm install
  ok "Dependencies installed"
  echo ""
  echo "============================================"
  echo "  Dev setup complete!"
  echo "============================================"
  echo ""
  echo "  Start MongoDB:  docker compose up -d mongodb redis"
  echo "  Or skip DB:     use mock in tests only"
  echo ""
  echo "  Run everything: npm run dev"
  echo ""
  echo "  Playground:     http://localhost:3000/playground"
  echo "  API:            http://localhost:4000"
  echo "  React SPA:      http://localhost:5173"
  echo "============================================"
}

setup_local_docker() {
  info "Setting up full stack in Docker (local, no HTTPS)..."
  install_docker || exit 1
  DOCKER="${DOCKER_CMD:-docker}"
  if ! docker info &>/dev/null; then
    DOCKER="sudo docker"
  fi
  info "Building containers (first run takes several minutes)..."
  $DOCKER compose -f docker-compose.deploy.local.yml up -d --build
  info "Waiting for services..."
  sleep 25
  if curl -sf http://localhost:4000/health &>/dev/null; then
    ok "API healthy"
  else
    warn "API not ready yet — run: docker compose -f docker-compose.deploy.local.yml logs -f api"
  fi
  if curl -sf http://localhost:3000/playground -o /dev/null; then
    ok "Web healthy"
  else
    warn "Web not ready yet — run: docker compose -f docker-compose.deploy.local.yml logs -f web"
  fi
  echo ""
  echo "============================================"
  echo "  Local Docker stack running!"
  echo "============================================"
  echo ""
  echo "  Playground:  http://localhost:3000/playground"
  echo "  Presenter:   http://localhost:3000/playground/demo"
  echo "  API health:  http://localhost:4000/health"
  echo "  GraphQL:     http://localhost:4000/graphql"
  echo ""
  echo "  Logs:  docker compose -f docker-compose.deploy.local.yml logs -f"
  echo "  Stop:  docker compose -f docker-compose.deploy.local.yml down"
  echo "============================================"
}

setup_demo() {
  info "Setting up playground demo (no MongoDB/Docker required)..."
  check_node
  setup_env_files
  npm install
  ok "Starting API (mock DB) + Next.js..."
  echo ""
  echo "============================================"
  echo "  Demo mode — Playground ready in ~10s"
  echo "============================================"
  echo ""
  echo "  Playground:  http://localhost:3000/playground"
  echo "  API:         http://localhost:4000"
  echo ""
  echo "  Press Ctrl+C to stop"
  echo "============================================"
  npm run demo
}

setup_public() {
  info "Setting up public HTTPS deploy..."
  install_docker || exit 1

  ENV_FILE="$ROOT/deploy/.env.deploy"
  if [[ ! -f "$ENV_FILE" ]]; then
    cp deploy/.env.deploy.example "$ENV_FILE"
  fi

  # shellcheck disable=SC1090
  source "$ENV_FILE" 2>/dev/null || true

  PUBLIC_IP=$(curl -sf ifconfig.me 2>/dev/null || curl -sf icanhazip.com 2>/dev/null || echo "unknown")

  echo ""
  echo "Your server's public IP appears to be: $PUBLIC_IP"
  echo ""
  echo "Before continuing, ensure:"
  echo "  1. DOMAIN in deploy/.env.deploy points here (DNS A record)"
  echo "  2. Ports 80 and 443 are open in your cloud firewall"
  echo "  3. ACME_EMAIL is set for Let's Encrypt"
  echo ""
  echo "No domain yet? Free options:"
  echo "  • DuckDNS:  https://www.duckdns.org/  → yourname.duckdns.org"
  echo "  • nip.io:   use ${PUBLIC_IP}.nip.io (testing only)"
  echo ""

  if [[ "${DOMAIN:-interview.example.com}" == "interview.example.com" ]]; then
    warn "Edit deploy/.env.deploy first:"
    echo "  nano deploy/.env.deploy"
    echo ""
    echo "  DOMAIN=${PUBLIC_IP}.nip.io    # quick test (HTTPS may fail on nip.io)"
    echo "  DOMAIN=yourname.duckdns.org   # recommended free option"
    echo "  ACME_EMAIL=you@example.com"
    exit 1
  fi

  bash "$ROOT/scripts/deploy-oss.sh"
}

run_check() {
  echo "Prerequisites check:"
  check_node && true || warn "Node missing"
  check_docker && true || warn "Docker missing"
  setup_env_files
  PUBLIC_IP=$(curl -sf ifconfig.me 2>/dev/null || echo "unknown")
  ok "Public IP (if on cloud VM): $PUBLIC_IP"
}

case "$MODE" in
  local)  setup_local_docker ;;
  dev)    setup_dev ;;
  demo)   setup_demo ;;
  public) setup_public ;;
  check)  run_check ;;
  *)      usage; exit 1 ;;
esac
