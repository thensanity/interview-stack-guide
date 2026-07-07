import { useEffect, useState } from "react";
import { fetchHealth } from "../lib/api";

const patterns = [
  { name: "Repository Pattern", path: "packages/db/", tip: "Swap DB providers via DATA_PROVIDER env" },
  { name: "CSR Data Fetching", path: "apps/react-spa/src/pages/ProductsPage.tsx", tip: "useEffect + useState — compare with Next.js SSR" },
  { name: "SSE Event Stream", path: "apps/react-spa/src/hooks/useEventStream.ts", tip: "Real-time events without WebSocket complexity" },
  { name: "WebSocket Events", path: "apps/api/src/websocket/event-ws.ts", tip: "Bidirectional — send ping, receive pong" },
  { name: "Client Error State", path: "apps/react-spa/src/pages/ProductsPage.tsx", tip: "Inline error vs Next.js error.tsx boundary" },
  { name: "JWT Auth UI", path: "apps/react-spa/src/components/LoginPanel.tsx", tip: "Context + localStorage — compare Next.js cookie for Server Actions" },
  { name: "Cursor Pagination", path: "apps/react-spa/src/hooks/useProducts.ts", tip: "Load more with nextCursor in component state" },
  { name: "Dynamic Route", path: "apps/react-spa/src/pages/ProductDetailPage.tsx", tip: "React Router /products/:id — compare generateMetadata in Next.js" },
  { name: "JWT Auth", path: "apps/api/src/middleware/auth.ts", tip: "POST /api/auth/login then Authorization: Bearer" },
  { name: "Pagination", path: "GET /api/products?limit=10&cursor=0", tip: "Cursor-based pagination in meta.nextCursor" },
  { name: "Zod Validation", path: "packages/validation/", tip: "Invalid POST returns 400 with field errors" },
];

export default function PatternsPage() {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => setHealth({ status: "unreachable" }));
  }, []);

  return (
    <>
      <h2>Patterns Museum (React SPA)</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        Same patterns as Next.js — demonstrated with client-side React. Open DevTools Network tab during demos.
      </p>

      {health && (
        <div className="card" style={{ marginBottom: "1rem" }}>
          API: {String(health.status)} · Provider: {String(health.provider ?? "unknown")}
        </div>
      )}

      <div className="grid">
        {patterns.map((p) => (
          <div key={p.name} className="card">
            <h3>{p.name}</h3>
            <code style={{ fontSize: "0.8rem" }}>{p.path}</code>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>{p.tip}</p>
          </div>
        ))}
      </div>
    </>
  );
}
