# React vs Next.js — Interview Comparison Guide

This repo runs **both** frontends against the same API so you can demonstrate differences live.

| App | URL | Stack |
|-----|-----|-------|
| **React SPA** | http://localhost:5173 | Vite + React Router + CSR |
| **Next.js** | http://localhost:3000 | App Router + SSR/ISR |

```bash
npm run dev   # starts API + both frontends
```

---

## Core Difference (One Sentence)

**React** is a UI library — you choose routing, data fetching, and rendering strategy. **Next.js** is a React framework that adds server rendering, file-based routing, and production optimizations out of the box.

---

## Rendering Comparison

| | React SPA | Next.js |
|---|-----------|---------|
| **Default** | Client-side (CSR) | Server Components |
| **First HTML** | Empty `<div id="root">` | Pre-filled content |
| **Data fetch** | `useEffect` after mount | `async` Server Component |
| **Loading UX** | Spinner after JS loads | Content in first paint |
| **SEO** | Poor without SSR add-on | Built-in |

### Code Side-by-Side

**React (CSR)** — `apps/react-spa/src/pages/ProductsPage.tsx`:
```tsx
useEffect(() => {
  fetchProductsRest().then(setProducts);
}, []);
```

**Next.js (SSR)** — `apps/web/src/app/products/page.tsx`:
```tsx
export const dynamic = "force-dynamic";
const products = await fetchProductsRest(); // runs on server
```

### Live Demo for Interviewers

1. Open both `/products` pages
2. **View Page Source** — Next.js has product names in HTML; React does not
3. **Network tab** — React shows `/api/products` after JS bundle loads
4. **Disable JavaScript** — Next.js partially works; React shows blank page

---

## When to Choose Which

### Choose **React (SPA)** when:
- App is behind authentication (dashboards, admin panels)
- SEO is not important
- Static CDN deployment is enough

### Choose **Next.js** when:
- Public site needing SEO
- Mixed static + dynamic content (ISR)
- Fast first contentful paint matters

---

## Common Interview Questions

### Q: Is Next.js replacing React?
**A:** No. Next.js is built on React. You still write React components.

### Q: What is hydration?
**A:** Next.js SSR sends HTML; React attaches event listeners on the client. Pure CSR React builds the DOM from scratch — nothing to hydrate.

### Q: What are Server Components?
**A:** Next.js-only. Components that run on the server and don't ship JS to the client.

---

## File Map

| Concept | React SPA | Next.js |
|---------|-----------|---------|
| Entry | `apps/react-spa/src/main.tsx` | `apps/web/src/app/layout.tsx` |
| Products | `pages/ProductsPage.tsx` (CSR) | `app/products/page.tsx` (SSR) |
| Compare UI | `pages/ComparePage.tsx` | nav link to React app |
