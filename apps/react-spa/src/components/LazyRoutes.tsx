import { lazy, Suspense } from "react";

/** Code splitting demo — interview contrast with Next.js automatic per-route splitting */
export const LazyScenariosPage = lazy(() => import("../pages/ScenariosPage"));
export const LazyGraphQLPage = lazy(() => import("../pages/GraphQLPage"));

export function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<p className="loading">Loading route chunk…</p>}>{children}</Suspense>;
}
