# Next.js Interview Questions

See also: [React vs Next.js comparison](./react-vs-nextjs.md)

## Rendering Strategies

| Strategy | Config | When to Use |
|----------|--------|-------------|
| Static (SSG) | default | Marketing pages, docs |
| ISR | `revalidate: N` | Semi-dynamic content |
| SSR | `dynamic = "force-dynamic"` | Personalized, real-time data |
| Client | `"use client"` | Forms, animations, browser APIs |

## Code References

- Home page ISR: `apps/web/src/app/page.tsx`
- SSR products: `apps/web/src/app/products/page.tsx`
- Client form: `apps/web/src/components/ProductForm.tsx`
