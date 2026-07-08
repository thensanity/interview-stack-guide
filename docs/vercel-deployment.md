# Deploying to Vercel

This monorepo contains **three apps**. Only the **Next.js frontend** (`apps/web`) can be deployed to Vercel.

| App | Deploy to |
|-----|-----------|
| `apps/web` (Next.js) | **Vercel** |
| `apps/api` (Express) | Railway, Render, Fly.io, ECS, or Docker |
| `apps/react-spa` (Vite) | Vercel Static, Netlify, or S3 + CloudFront |

---

## Why your build failed

The error `@interview/api@1.0.0 build → Cannot find module '@interview/db'` means Vercel tried to build the **Express API**, not the Next.js app.

Common causes:

1. **Root Directory** is set to `apps/api` (or repo root with wrong framework detection)
2. Vercel ran `npm run build` which builds the entire monorepo including API
3. Workspace packages (`packages/db`, etc.) were never compiled before the API TypeScript build

The API is a long-running Express server — it is **not compatible** with Vercel's serverless model without a full rewrite.

---

## Fix: deploy only `apps/web`

### Step 1 — Vercel project settings

In [Vercel Dashboard](https://vercel.com) → your project → **Settings** → **General**:

| Setting | Value |
|---------|-------|
| **Root Directory** | `apps/web` |
| **Framework Preset** | Next.js |
| **Build Command** | `next build` (default) |
| **Install Command** | `cd ../.. && npm install` |
| **Output Directory** | *(leave default — Vercel auto-detects `.next`)* |

The repo includes `apps/web/vercel.json` with these commands pre-configured.

### Step 2 — Environment variables

In **Settings** → **Environment Variables**, add:

| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.railway.app` | Yes (for live data) |
| `NEXT_PUBLIC_GRAPHQL_URL` | `https://your-api.railway.app/graphql` | Yes (for GraphQL page) |

Without these, pages still build and render, but product data fetches will fail unless the API is reachable.

### Step 3 — Deploy the API separately

The frontend calls an external API. Deploy `apps/api` to one of:

- **Railway** — `railway up` from repo root with Dockerfile `apps/api/Dockerfile`
- **Render** — Web Service, Docker, port 4000
- **Fly.io** — `fly launch` in `apps/api`

Then point `NEXT_PUBLIC_API_URL` at that URL.

---

## Alternative: deploy from repo root

If you prefer **Root Directory = `.`** (repository root), the root `vercel.json` uses:

```json
{
  "buildCommand": "npm run vercel-build",
  "installCommand": "npm install"
}
```

The `vercel-build` script only runs `next build` for `@interview/web` — it skips the API entirely.

---

## Verify locally before deploying

```bash
# Simulate Vercel build (web only)
npm install
npm run vercel-build

# Or from apps/web after monorepo install
cd apps/web && next build
```

---

## What works on Vercel vs what needs the API

| Feature | Works without API |
|---------|-------------------|
| Home page (ISR) | Partial — health status shows unknown |
| `/products` SSR | Needs API or shows error state |
| `/patterns`, `/decisions`, `/architecture` | Yes (static content) |
| Server Actions (create product) | Needs API |
| Login / JWT | Needs API |
| `/api/proxy/*` BFF routes | Needs API |

---

## Interview talking point

> "We deploy the Next.js frontend to Vercel for edge SSR and ISR, and the Express API to a container platform (ECS/Railway) because Vercel optimizes for frontend/serverless — long-running WebSocket servers and GraphQL subscriptions belong on a persistent backend."

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Cannot find module '@interview/db'` | Root Directory is wrong — set to `apps/web` |
| `Command "npm run build" exited with 2` on API | Same — you're building API, not web |
| Blank products page | Set `NEXT_PUBLIC_API_URL` to a running API |
| `placehold.co` images blocked | Already allowed in `next.config.js` `remotePatterns` |
| Middleware redirect loop | Sign in locally first; cookie `auth_token` required for `/admin` |
