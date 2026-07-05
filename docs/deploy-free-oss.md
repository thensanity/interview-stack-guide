# Free Open-Source Deployment Guide

Deploy the **full stack** (Next.js playground + API + MongoDB + Redis + HTTPS) using only **free and open-source** software.

## Stack (100% OSS)

| Component | Role | License |
|-----------|------|---------|
| [Docker](https://www.docker.com/) | Container runtime | Apache 2.0 |
| [Docker Compose](https://docs.docker.com/compose/) | Orchestration | Apache 2.0 |
| [Caddy](https://caddyserver.com/) | Reverse proxy + auto HTTPS | Apache 2.0 |
| [MongoDB](https://www.mongodb.com/) | Database (Community) | SSPL |
| [Redis](https://redis.io/) | Cache | BSD |
| [Node.js](https://nodejs.org/) | API + Next.js | MIT |

No proprietary PaaS required. You only need a **free Linux server** with a public IP.

---

## Step 1: Get a free server

Pick one (all can run Docker):

| Provider | Free tier | Notes |
|----------|-----------|-------|
| [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) | 4 ARM CPUs, 24 GB RAM | Best long-term free option |
| [Google Cloud](https://cloud.google.com/free) | e2-micro 1 year | Good for trials |
| [Hetzner](https://www.hetzner.com/) | ~€4/mo | Not free but cheapest paid option |
| **Your own PC** | Free | Use with [ngrok](https://ngrok.com/) or port forwarding for demos |

**Oracle Cloud quick path:**
1. Create account → Compute → Create VM (Ampere ARM, Ubuntu 22.04)
2. Open ports **80** and **443** in Security List / firewall
3. Note the public IP

---

## Step 2: Point a domain at your server

You need a hostname for HTTPS (Let's Encrypt).

**Option A — Your own domain**  
Add a DNS **A record**: `interview.yourdomain.com` → `YOUR_SERVER_IP`

**Option B — Free dynamic DNS (no domain purchase)**  
Use [DuckDNS](https://www.duckdns.org/) or [nip.io](https://nip.io/):
- DuckDNS: `yourname.duckdns.org` → your IP
- nip.io: `YOUR_IP.nip.io` works without signup (fine for testing)

---

## Step 3: Install Docker on the server

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in
```

---

## Step 4: Deploy from this repo

```bash
git clone https://github.com/thensanity/interview-stack-guide.git
cd interview-stack-guide

cp deploy/.env.deploy.example deploy/.env.deploy
nano deploy/.env.deploy   # set DOMAIN and ACME_EMAIL

chmod +x scripts/deploy-oss.sh
./scripts/deploy-oss.sh
```

### `deploy/.env.deploy` example

```bash
DOMAIN=interview.yourdomain.com
ACME_EMAIL=you@example.com
JWT_SECRET=use-a-long-random-string-here
ENABLE_AUTH=false
```

---

## Step 5: Open the playground

After 1–2 minutes (first HTTPS cert):

- **Playground:** `https://YOUR_DOMAIN/playground`
- **Presenter mode:** `https://YOUR_DOMAIN/playground/demo`
- **Health check:** `https://YOUR_DOMAIN/health`

Everything runs on **one domain** — Caddy routes `/api`, `/graphql`, `/health` to the API and everything else to Next.js. The playground works for external visitors because `NEXT_PUBLIC_API_URL` is baked as `https://YOUR_DOMAIN` at build time.

---

## Architecture

```
Internet (HTTPS)
       │
       ▼
   Caddy :443          ← automatic Let's Encrypt TLS
       │
       ├── /api/*  /graphql  /health  →  API :4000
       │
       └── /*  (playground, products, …)  →  Next.js :3000
                    │
                    ├── MongoDB
                    └── Redis
```

---

## Useful commands

```bash
# View logs
docker compose -f docker-compose.deploy.yml --env-file deploy/.env.deploy logs -f

# Restart after code changes
git pull
./scripts/deploy-oss.sh

# Stop everything
docker compose -f docker-compose.deploy.yml --env-file deploy/.env.deploy down

# Smoke test
API_URL=https://YOUR_DOMAIN WEB_URL=https://YOUR_DOMAIN bash scripts/smoke-test.sh
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| HTTPS certificate fails | Ensure ports 80+443 open; DOMAIN DNS points to server |
| Playground shows API errors | Rebuild web after changing DOMAIN: `./scripts/deploy-oss.sh` |
| WebSocket tab disconnected | Most proxies work; check Caddy logs |
| Out of memory on small VM | Disable Redis in compose or use 1 GB swap |

---

## Alternative OSS platforms (self-hosted)

If you want a UI on top of Docker:

| Platform | What it is |
|----------|------------|
| [Coolify](https://coolify.io/) | Open-source Vercel/Heroku alternative |
| [CapRover](https://caprover.com/) | Self-hosted PaaS |
| [Dokku](https://dokku.com/) | Mini-Heroku on your VM |

This repo's `docker-compose.deploy.yml` works on any of them as a Compose stack.

---

## Security notes for public demos

- Change `JWT_SECRET` in `deploy/.env.deploy`
- Set `ENABLE_AUTH=true` if you expose mutations publicly
- Demo login credentials are intentional for interviews — not for production users
- Consider rate limits (`RATE_LIMIT_MAX`) on small servers

---

## Related files

- `docker-compose.deploy.yml` — production compose file
- `deploy/Caddyfile` — reverse proxy rules
- `deploy/.env.deploy.example` — environment template
- `scripts/deploy-oss.sh` — one-command deploy
