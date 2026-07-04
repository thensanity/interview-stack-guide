import { fetchHealth } from "@/lib/api";

/** SSG + ISR demo — interview: explain revalidate, static vs dynamic rendering */
export const revalidate = 60;

export default async function HomePage() {
  let health = { status: "unknown", provider: "unknown", deployTarget: "unknown" };
  try {
    health = await fetchHealth();
  } catch {
    /* API may be offline during static build */
  }

  return (
    <>
      <section className="hero">
        <h2>Full-Stack Interview Reference</h2>
        <p>
          A production-shaped monorepo demonstrating Next.js, dual NoSQL backends,
          GraphQL + REST APIs, CI/CD pipelines, and AWS / Kubernetes deployment patterns.
        </p>
      </section>

      <div className="status-bar">
        <div><span>API Status: </span><strong>{health.status}</strong></div>
        <div><span>NoSQL Provider: </span><strong>{health.provider}</strong></div>
        <div><span>Deploy Target: </span><strong>{health.deployTarget}</strong></div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>React SPA (port 5173)</h3>
          <p>Vite + React Router — pure client-side rendering for side-by-side comparison.</p>
          <ul>
            <li>useEffect data fetching (CSR)</li>
            <li>React Router navigation</li>
            <li>Compare page vs Next.js SSR</li>
          </ul>
          <div style={{ marginTop: "0.75rem" }}>
            <span className="badge badge-blue">React 19</span>
            <span className="badge badge-purple">Vite</span>
          </div>
        </div>

        <div className="card">
          <h3>Next.js Frontend</h3>
          <p>App Router, SSR, ISR, Server Components, standalone Docker output.</p>
          <ul>
            <li>Server-side data fetching</li>
            <li>Client mutations via REST</li>
            <li>Route-based code splitting</li>
          </ul>
          <div style={{ marginTop: "0.75rem" }}>
            <span className="badge badge-blue">React 19</span>
            <span className="badge badge-blue">App Router</span>
          </div>
        </div>

        <div className="card">
          <h3>NoSQL / GraphQL Duality</h3>
          <p>Repository pattern with MongoDB and DynamoDB adapters behind REST + GraphQL.</p>
          <ul>
            <li>Swap providers via env var</li>
            <li>Same domain model, two query interfaces</li>
            <li>Factory + adapter patterns</li>
          </ul>
          <div style={{ marginTop: "0.75rem" }}>
            <span className="badge badge-purple">MongoDB</span>
            <span className="badge badge-purple">DynamoDB</span>
            <span className="badge badge-purple">GraphQL</span>
          </div>
        </div>

        <div className="card">
          <h3>CI/CD Pipeline</h3>
          <p>GitHub Actions: lint, test, build, containerize, deploy to AWS or K8s.</p>
          <ul>
            <li>Matrix builds per service</li>
            <li>Docker multi-stage builds</li>
            <li>Environment promotion</li>
          </ul>
          <div style={{ marginTop: "0.75rem" }}>
            <span className="badge badge-green">GitHub Actions</span>
            <span className="badge badge-green">Docker</span>
          </div>
        </div>

        <div className="card">
          <h3>AWS / Kubernetes Duality</h3>
          <p>Deploy the same containers to ECS Fargate (AWS) or any K8s cluster.</p>
          <ul>
            <li>Terraform for AWS infra</li>
            <li>Helm chart + raw manifests</li>
            <li>Health/readiness probes</li>
          </ul>
          <div style={{ marginTop: "0.75rem" }}>
            <span className="badge badge-green">ECS</span>
            <span className="badge badge-green">EKS-ready</span>
            <span className="badge badge-green">Helm</span>
          </div>
        </div>
      </div>
    </>
  );
}
