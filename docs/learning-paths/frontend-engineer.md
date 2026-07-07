# Frontend Engineer Learning Path

Study plan using this repo — each step has runnable code.

## Week 1: React Fundamentals
1. Read `docs/interview-guide/react.md`
2. Run `npm run dev:react` — explore `apps/react-spa/`
3. Trace CSR flow: `ProductsPage.tsx` → `useProducts()` → API
4. Compare with Next.js `/products` — view page source

## Week 2: Next.js & Rendering
1. Read `docs/interview-guide/nextjs.md` and `react-vs-nextjs.md`
2. Run `npm run dev:next`
3. Study ISR on `apps/web/src/app/page.tsx`
4. Study Suspense streaming on `apps/web/src/app/products/page.tsx`
5. Study Server Action form: `ProductForm.tsx` + `actions.ts`

## Week 3: State & Real-Time
1. Explore `useEventStream` hook (SSE)
2. Open `/scenarios` — trigger traffic_spike, watch loading states
3. Visit `/patterns` museum page
4. Compare error handling: `error.tsx` vs inline React state

## Week 4: GraphQL & API Consumption
1. Read `docs/interview-guide/graphql.md`
2. Compare REST vs GraphQL pages side-by-side
3. Study pagination: cursor via `useProducts` (React) vs `?cursor=` (Next.js)
4. Practice interview answer: "When REST vs GraphQL?"

## Week 5: Auth & Protected Mutations
1. Sign in via header `LoginPanel` on both apps
2. Set `ENABLE_AUTH=true` in `.env` and restart API
3. Trace JWT: `POST /api/auth/login` → Bearer header → Server Action cookie
4. Compare React Context + localStorage vs Next.js cookie for Server Actions

## Week 6: Pagination & Dynamic Routes
1. React: click **Load more** — cursor stored in component state (`useProducts`)
2. Next.js: click **Load more** — cursor in URL searchParams
3. Open `/products/[id]` on both apps — compare CSR detail vs `generateMetadata`

## Week 7: Server Actions & Streaming
1. Create a product on Next.js — watch list update without refresh (`revalidatePath`)
2. Throttle network in DevTools — observe Suspense fallback on `/products`
3. Read `apps/web/src/app/products/actions.ts` and explain `useActionState`

## Week 8: Frontend Testing
1. Read `docs/interview-guide/testing.md`
2. Run `npm run test -w @interview/react-spa` and `npm run test -w @interview/web`
3. Study `ProductForm.test.tsx` and `actions.test.ts`
4. Practice: "How do you test Server Actions vs client forms?"

## Interview Demo Script
1. Open React and Next.js side-by-side
2. Sign in on both — show JWT in Network tab
3. View source on both `/products` pages
4. Paginate — state (React) vs URL (Next.js)
5. Create a product on Next.js — no manual refresh
6. Open a product detail — show `generateMetadata` in page source
7. Say: "Same API, different rendering and mutation tradeoffs"
