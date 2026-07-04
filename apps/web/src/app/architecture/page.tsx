export default function ArchitecturePage() {
  return (
    <>
      <h2 style={{ marginBottom: "1.5rem" }}>System Architecture</h2>

      <div className="arch-section">
        <h2>High-Level Flow</h2>
        <pre>{`
┌─────────────┐     REST / GraphQL     ┌─────────────┐     Repository      ┌──────────────┐
│  Next.js    │ ────────────────────▶  │  Express +  │ ─────────────────▶  │  MongoDB OR  │
│  (App Router│                        │  Apollo GQL │                       │  DynamoDB    │
└─────────────┘                        └─────────────┘                       └──────────────┘
       │                                       │
       │         Docker containers             │
       ▼                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Deploy Target (choose one via DEPLOY_TARGET env)               │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │  AWS: ECS Fargate    │    │  K8s: Deployment + Service   │  │
│  │  ALB + ECR + DynamoDB│    │  Ingress + HPA + Helm        │  │
│  └──────────────────────┘    └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
        `}</pre>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Key Design Patterns</h3>
          <ul>
            <li><strong>Repository</strong> — abstract NoSQL provider</li>
            <li><strong>Factory</strong> — env-driven adapter selection</li>
            <li><strong>Adapter</strong> — MongoDB vs DynamoDB</li>
            <li><strong>Dual API</strong> — REST + GraphQL same data layer</li>
          </ul>
        </div>
        <div className="card">
          <h3>Interview Cheat Sheet</h3>
          <ul>
            <li>See <code>docs/interview-guide/</code> for Q&amp;A</li>
            <li>Each folder has inline comments</li>
            <li>CI/CD in <code>.github/workflows/</code></li>
            <li>AWS in <code>infrastructure/aws/</code></li>
            <li>K8s in <code>infrastructure/kubernetes/</code></li>
          </ul>
        </div>
      </div>
    </>
  );
}
