# Frontend Engineer Learning Path

Study plan using this repo — each step has runnable code.

## Week 1: React Fundamentals
1. Read `docs/interview-guide/react.md`
2. Run `npm run dev:react` — explore `apps/react-spa/`
3. Trace CSR flow: `ProductsPage.tsx` → `fetchProductsRest()` → API
4. Compare with Next.js `/products` — view page source

## Week 2: Next.js & Rendering
1. Read `docs/interview-guide/nextjs.md` and `react-vs-nextjs.md`
2. Run `npm run dev:next`
3. Study ISR on `apps/web/src/app/page.tsx`
4. Study SSR on `apps/web/src/app/products/page.tsx`
5. Study Client Component: `ProductForm.tsx`

## Week 3: State & Real-Time
1. Explore `useEventStream` hook (SSE)
2. Open `/scenarios` — trigger traffic_spike, watch loading states
3. Visit `/patterns` museum page
4. Compare error handling: `error.tsx` vs inline React state

## Week 4: GraphQL & API Consumption
1. Read `docs/interview-guide/graphql.md`
2. Compare REST vs GraphQL pages side-by-side
3. Study pagination: `GET /api/products?limit=5`
4. Practice interview answer: "When REST vs GraphQL?"

## Interview Demo Script
1. Open React and Next.js side-by-side
2. View source on both `/products` pages
3. Create a product — watch event feed
4. Say: "Same API, different rendering tradeoffs"
