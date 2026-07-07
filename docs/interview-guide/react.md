# React Interview Questions

See also: [React vs Next.js comparison](./react-vs-nextjs.md)

## What is React?

A JavaScript **library** for building UIs via components and declarative state. It does not include routing, data fetching, or SSR — you add those (React Router, Vite, etc.).

This project's React app lives at `apps/react-spa/`.

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Components** | Reusable UI units (function components + hooks) |
| **JSX** | HTML-like syntax compiled to `React.createElement` |
| **State** | `useState` — local component data |
| **Effects** | `useEffect` — side effects after render (API calls) |
| **Props** | Data passed parent → child (one-way flow) |
| **Virtual DOM** | Diffing algorithm for efficient updates |

---

## CSR Data Fetching Pattern

```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/products")
    .then(res => res.json())
    .then(json => setData(json.data))
    .finally(() => setLoading(false));
}, []);
```

**Interview point:** Data loads *after* JS executes — causes loading spinners and worse SEO vs SSR.

---

## React Router (this project)

```tsx
<Routes>
  <Route path="/products" element={<ProductsPage />} />
</Routes>
```

Compare with Next.js file-based routing: `app/products/page.tsx`.

---

## Vite vs Create React App

CRA is deprecated. **Vite** is the modern choice:
- Native ESM in dev (instant HMR)
- Rollup for production builds
- `vite.config.ts` proxy for API during dev

---

## Common Interview Questions

### Q: Controlled vs uncontrolled components?
**A:** Controlled: form value tied to React state. Uncontrolled: DOM holds value via `ref`. Prefer controlled for validation.

### Q: useEffect cleanup?
**A:** Return a function from useEffect to cancel subscriptions, timers, or abort fetch on unmount.

### Q: React.memo / useMemo / useCallback?
**A:** Performance optimizations. Don't premature-optimize — use when profiling shows unnecessary re-renders.

### Q: Why not just use React for everything?
**A:** For public sites, CSR means empty HTML until JS loads — bad SEO and slow first paint. Next.js adds SSR on top of React.

---

## Code References

| File | Purpose |
|------|---------|
| `apps/react-spa/src/main.tsx` | App entry + BrowserRouter |
| `apps/react-spa/src/context/AuthContext.tsx` | JWT auth via Context + localStorage |
| `apps/react-spa/src/hooks/useProducts.ts` | Cursor pagination hook |
| `apps/react-spa/src/pages/ProductsPage.tsx` | CSR data fetching + Load more |
| `apps/react-spa/src/pages/ProductDetailPage.tsx` | Dynamic route `/products/:id` |
| `apps/react-spa/src/pages/ComparePage.tsx` | Side-by-side comparison table |
| `apps/react-spa/vite.config.ts` | Dev proxy to API |
