import { fetchHealth } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PatternsPage() {
  let health: Awaited<ReturnType<typeof fetchHealth>> | null = null;
  try {
    health = await fetchHealth();
  } catch {
    health = null;
  }

  const patterns = [
    {
      name: "Repository Pattern",
      location: "packages/db/",
      use: "Swap MongoDB/DynamoDB without changing API code",
      interview: "How would you migrate databases?",
    },
    {
      name: "Adapter Pattern",
      location: "packages/db/src/*-adapter.ts",
      use: "Provider-specific implementations behind one interface",
      interview: "Explain polymorphism in data access",
    },
    {
      name: "Dual-Write Migration",
      location: "packages/db/src/dual-write-adapter.ts",
      use: "Phase 2 of MongoDB→DynamoDB migration",
      interview: "Trigger dual_write_migration scenario at /scenarios",
    },
    {
      name: "Cache-Aside (Redis)",
      location: "apps/api/src/middleware/cache.ts",
      use: "Optional Redis caching for GET /api/products",
      interview: "Check X-Cache: HIT/MISS response header",
    },
    {
      name: "JWT Authentication",
      location: "apps/api/src/middleware/auth.ts",
      use: "POST /api/auth/login → Bearer token on mutations",
      interview: "Set ENABLE_AUTH=true to enforce",
    },
    {
      name: "Zod Validation",
      location: "packages/validation/",
      use: "Shared schemas for REST request validation",
      interview: "Fail fast with 400 + field errors",
    },
    {
      name: "DataLoader (N+1 fix)",
      location: "packages/graphql/src/dataloaders.ts",
      use: "Batch product lookups in GraphQL",
      interview: "Query productsByIds to demo batching",
    },
    {
      name: "SSE vs WebSocket",
      location: "apps/api/src/routes/events.ts + websocket/",
      use: "SSE for server-push; WS for bidirectional ping/pong",
      interview: "Compare transports on /scenarios event feed",
    },
    {
      name: "Prometheus Metrics",
      location: "apps/api/src/middleware/metrics.ts",
      use: "RED metrics at GET /metrics",
      interview: "Correlate with structured JSON logs",
    },
    {
      name: "Situational Scenarios",
      location: "apps/api/src/events/scenario-simulator.ts",
      use: "Runnable failure injection for live demos",
      interview: "10 scenarios including CI/CD and migration",
    },
    {
      name: "SSR vs CSR",
      location: "apps/web vs apps/react-spa",
      use: "Same API, different rendering strategies",
      interview: "View source on /products in both apps",
    },
    {
      name: "Error Boundaries",
      location: "apps/web/src/app/products/error.tsx",
      use: "File-based error UI in Next.js App Router",
      interview: "Trigger db_error scenario to see it",
    },
  ];

  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>Patterns Museum</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Live code references for every major pattern in this repo — point interviewers here during system design.
      </p>

      {health && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <strong>API Status:</strong> {health.status} · Provider: {health.provider} · Target: {health.deployTarget}
        </div>
      )}

      <div className="grid">
        {patterns.map((p) => (
          <div key={p.name} className="card">
            <h3>{p.name}</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{p.use}</p>
            <p><code>{p.location}</code></p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}><em>Interview:</em> {p.interview}</p>
          </div>
        ))}
      </div>
    </>
  );
}
