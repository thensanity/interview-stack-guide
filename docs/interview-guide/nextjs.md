# Next.js Interview Questions

See also: [React vs Next.js comparison](./react-vs-nextjs.md)

## Rendering Strategies

| Strategy | Config | When to Use |
|----------|--------|-------------|
| Static (SSG) | default | Marketing pages, docs |
| ISR | `revalidate: N` | Semi-dynamic content |
| SSR | `dynamic = "force-dynamic"` | Personalized, real-time data |
| Streaming | `<Suspense>` + async Server Components | Progressive page load |
| Client | `"use client"` | Forms, animations, browser APIs |

## Code References

| Feature | File |
|---------|------|
| Home page ISR | `apps/web/src/app/page.tsx` |
| Suspense streaming | `apps/web/src/app/products/page.tsx` |
| Async product list | `apps/web/src/components/ProductList.tsx` |
| URL pagination | `apps/web/src/components/ProductPagination.tsx` |
| Server Actions | `apps/web/src/app/products/actions.ts` |
| useActionState form | `apps/web/src/components/ProductForm.tsx` |
| Dynamic route + SEO | `apps/web/src/app/products/[id]/page.tsx` |
| JWT + cookie auth | `apps/web/src/components/LoginPanel.tsx` |

## Common Interview Questions

### Q: Server Actions vs client fetch?
**A:** Server Actions run on the server, can read cookies securely, and pair with `revalidatePath` for cache invalidation. Client fetch is simpler but exposes tokens to the browser and requires manual cache updates.

### Q: Suspense vs loading.tsx?
**A:** `loading.tsx` wraps the entire route segment. Inline `<Suspense>` streams individual async components within a page — finer-grained loading UI.

### Q: generateMetadata purpose?
**A:** Sets per-page `<title>`, description, and Open Graph tags for SEO — essential for product/detail pages.
