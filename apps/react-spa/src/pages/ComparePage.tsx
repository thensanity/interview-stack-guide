const COMPARISON = [
  { topic: "Rendering", react: "Client-side only (CSR)", next: "SSR, SSG, ISR, CSR", nextWin: true },
  { topic: "Routing", react: "React Router (config/code)", next: "File-based App Router", nextWin: true },
  { topic: "Data fetching", react: "useEffect + fetch on mount", next: "Server Components, async pages", nextWin: true },
  { topic: "SEO", react: "Poor (empty HTML shell)", next: "Excellent (pre-rendered HTML)", nextWin: true },
  { topic: "Bundle / tooling", react: "Vite — fast, minimal", next: "Next.js webpack/turbopack", reactWin: true },
  { topic: "Learning curve", react: "Lower — just React", next: "Higher — framework concepts", reactWin: true },
  { topic: "Deployment", react: "Static files → any CDN", next: "Node server or static export", reactWin: true },
  { topic: "API routes", react: "Separate backend required", next: "Built-in Route Handlers", nextWin: true },
  { topic: "Code splitting", react: "React.lazy + Suspense", next: "Automatic per-route", nextWin: true },
  { topic: "Env variables", react: "VITE_* (client)", next: "NEXT_PUBLIC_* (client)", tie: true },
  { topic: "Best for", react: "Dashboards, admin panels, SPAs", next: "Marketing, e-commerce, SEO sites", tie: true },
];

export default function ComparePage() {
  return (
    <>
      <h2>React vs Next.js — Side-by-Side</h2>
      <p style={{ color: "var(--muted)", margin: "0.5rem 0 1rem", fontSize: "0.9rem" }}>
        Run both apps and compare behavior. Full guide: <code>docs/interview-guide/react-vs-nextjs.md</code>
      </p>

      <table className="compare-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>React SPA (this app)</th>
            <th>Next.js (port 3000)</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map((row) => (
            <tr key={row.topic}>
              <td>{row.topic}</td>
              <td className={row.reactWin ? "win" : undefined}>{row.react}</td>
              <td className={row.nextWin ? "win" : undefined}>{row.next}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid" style={{ marginTop: "2rem" }}>
        <div className="card">
          <h3>When to say "React"</h3>
          <p>Internal tools, authenticated apps behind login, real-time dashboards, embedding in existing apps, or when SEO doesn't matter.</p>
        </div>
        <div className="card">
          <h3>When to say "Next.js"</h3>
          <p>Public-facing sites, e-commerce, blogs, anything needing SEO, fast first paint, or mixed static/dynamic content.</p>
        </div>
      </div>

      <h3 style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>Live Experiment</h3>
      <ol style={{ color: "var(--muted)", paddingLeft: "1.25rem", fontSize: "0.9rem" }}>
        <li>Open <a href="http://localhost:5173/products" style={{ color: "var(--react)" }}>React /products</a> and <a href="http://localhost:3000/products" style={{ color: "var(--react)" }}>Next.js /products</a></li>
        <li>Right-click → View Page Source on each</li>
        <li>Next.js shows product HTML; React shows empty root div</li>
        <li>Open Network tab — React fetches /api/products after JS loads</li>
      </ol>
    </>
  );
}
