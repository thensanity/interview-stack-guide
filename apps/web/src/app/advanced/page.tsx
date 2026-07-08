import { fetchProductsPaginated } from "@/lib/api";
import { OptimisticList } from "@/components/OptimisticList";

export default async function AdvancedPage() {
  let items: { id: string; name: string }[] = [];
  try {
    const result = await fetchProductsPaginated({ limit: 5 });
    items = result.items.map((p) => ({ id: p.id, name: p.name }));
  } catch {
    items = [];
  }

  return (
    <>
      <h2>Advanced React / Next.js Patterns</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        Tier 2 demos: useOptimistic, middleware auth, BFF route handlers, parallel modal routes.
      </p>
      <OptimisticList initial={items} />
      <div className="grid" style={{ marginTop: "1.5rem" }}>
        <div className="card">
          <h3>Middleware</h3>
          <p style={{ fontSize: "0.85rem" }}>CSP + security headers on every request. Try <code>/admin</code> without login.</p>
        </div>
        <div className="card">
          <h3>BFF Proxy</h3>
          <p style={{ fontSize: "0.85rem" }}><code>/api/proxy/health</code> forwards to Express API.</p>
        </div>
        <div className="card">
          <h3>Parallel Modal</h3>
          <p style={{ fontSize: "0.85rem" }}>Click products on /products — intercepting route opens modal overlay.</p>
        </div>
      </div>
    </>
  );
}
