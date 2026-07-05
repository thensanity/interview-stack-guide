export default function DecisionsPage() {
  const matrix = [
    { useCase: "Public SEO catalog", react: "❌", next: "✅ ISR/SSR", rest: "✅", gql: "Optional", mongo: "✅", dynamo: "✅", ecs: "Either", k8s: "Either" },
    { useCase: "Auth-gated dashboard", react: "✅", next: "✅", rest: "✅", gql: "✅", mongo: "✅", dynamo: "✅", ecs: "Either", k8s: "Either" },
    { useCase: "Mobile bandwidth-sensitive", react: "Either", next: "Either", rest: "❌", gql: "✅", mongo: "—", dynamo: "—", ecs: "—", k8s: "—" },
    { useCase: "AWS-native at scale", react: "—", next: "—", rest: "—", gql: "—", mongo: "❌", dynamo: "✅", ecs: "✅", k8s: "Optional" },
    { useCase: "Multi-cloud portable", react: "—", next: "—", rest: "—", gql: "—", mongo: "✅", dynamo: "❌", ecs: "❌", k8s: "✅" },
    { useCase: "Real-time events", react: "SSE/WS", next: "SSE/WS", rest: "—", gql: "Subscriptions*", mongo: "—", dynamo: "—", ecs: "—", k8s: "—" },
    { useCase: "Rich ad-hoc queries", react: "—", next: "—", rest: "Limited", gql: "✅", mongo: "✅", dynamo: "❌", ecs: "—", k8s: "—" },
    { useCase: "Key-value at massive scale", react: "—", next: "—", rest: "—", gql: "—", mongo: "❌", dynamo: "✅", ecs: "✅", k8s: "Either" },
  ];

  return (
    <>
      <h2>Decision Matrix</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Quick reference for &quot;when would you use X?&quot; interview questions. See also{" "}
        <code>docs/DECISION-MATRIX.md</code> for full narrative.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Use Case</th>
              <th>React</th>
              <th>Next.js</th>
              <th>REST</th>
              <th>GraphQL</th>
              <th>MongoDB</th>
              <th>DynamoDB</th>
              <th>ECS</th>
              <th>K8s</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.useCase} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "0.5rem" }}>{row.useCase}</td>
                <td style={{ textAlign: "center" }}>{row.react}</td>
                <td style={{ textAlign: "center" }}>{row.next}</td>
                <td style={{ textAlign: "center" }}>{row.rest}</td>
                <td style={{ textAlign: "center" }}>{row.gql}</td>
                <td style={{ textAlign: "center" }}>{row.mongo}</td>
                <td style={{ textAlign: "center" }}>{row.dynamo}</td>
                <td style={{ textAlign: "center" }}>{row.ecs}</td>
                <td style={{ textAlign: "center" }}>{row.k8s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        <h3>Learning Paths</h3>
        <ul>
          <li><code>docs/learning-paths/frontend-engineer.md</code></li>
          <li><code>docs/learning-paths/backend-engineer.md</code></li>
          <li><code>docs/learning-paths/devops-engineer.md</code></li>
          <li><code>docs/learning-paths/full-stack.md</code></li>
        </ul>
      </div>
    </>
  );
}
