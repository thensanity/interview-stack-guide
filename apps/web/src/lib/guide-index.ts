/** Searchable index of interview guide topics — used by /guide page */
export interface GuideEntry {
  id: string;
  title: string;
  summary: string;
  path: string;
  tags: string[];
}

export const GUIDE_INDEX: GuideEntry[] = [
  { id: "react", title: "React", summary: "CSR, hooks, Vite, React Router", path: "/docs/interview-guide/react.md", tags: ["frontend", "hooks", "vite", "csr"] },
  { id: "nextjs", title: "Next.js", summary: "SSR, ISR, App Router, Server Components", path: "/docs/interview-guide/nextjs.md", tags: ["frontend", "ssr", "isr", "rsc"] },
  { id: "react-vs-next", title: "React vs Next.js", summary: "When to use SPA vs SSR framework", path: "/docs/interview-guide/react-vs-nextjs.md", tags: ["frontend", "comparison"] },
  { id: "nosql", title: "NoSQL", summary: "MongoDB vs DynamoDB, repository pattern", path: "/docs/interview-guide/nosql.md", tags: ["database", "mongodb", "dynamodb"] },
  { id: "graphql", title: "GraphQL", summary: "REST vs GraphQL, DataLoader, Apollo", path: "/docs/interview-guide/graphql.md", tags: ["api", "graphql", "dataloader"] },
  { id: "cicd", title: "CI/CD", summary: "GitHub Actions, Docker, deploy pipelines", path: "/docs/interview-guide/cicd.md", tags: ["devops", "github", "docker"] },
  { id: "aws", title: "AWS", summary: "ECS, ALB, DynamoDB, Terraform", path: "/docs/interview-guide/aws.md", tags: ["cloud", "ecs", "terraform"] },
  { id: "k8s", title: "Kubernetes", summary: "Deployments, HPA, Helm, probes", path: "/docs/interview-guide/kubernetes.md", tags: ["cloud", "kubernetes", "helm"] },
  { id: "scenarios", title: "System Design Scenarios", summary: "12 interview walkthroughs", path: "/docs/interview-guide/scenarios.md", tags: ["system-design", "behavioral"] },
  { id: "events", title: "Situational Events", summary: "Runnable failure scenarios via SSE", path: "/docs/interview-guide/situational-events.md", tags: ["events", "sse", "resilience"] },
  { id: "testing", title: "Testing", summary: "Unit, integration, E2E pyramid", path: "/docs/interview-guide/testing.md", tags: ["testing", "playwright", "vitest"] },
  { id: "observability", title: "Observability", summary: "Logs, metrics, health probes", path: "/docs/interview-guide/observability.md", tags: ["metrics", "prometheus", "logging"] },
  { id: "behavioral", title: "Behavioral", summary: "STAR templates tied to this project", path: "/docs/interview-guide/behavioral.md", tags: ["behavioral", "star"] },
  { id: "sql", title: "SQL vs NoSQL", summary: "When to pick relational databases", path: "/docs/interview-guide/sql-vs-nosql.md", tags: ["database", "sql", "acid"] },
  { id: "playground", title: "Playground", summary: "Interactive demo lab for all features", path: "/docs/interview-guide/playground.md", tags: ["playground", "demo"] },
  { id: "matrix", title: "Decision Matrix", summary: "When to use X vs Y tables", path: "/docs/DECISION-MATRIX.md", tags: ["decisions", "comparison"] },
];

export function searchGuide(query: string): GuideEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return GUIDE_INDEX;
  return GUIDE_INDEX.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      e.tags.some((t) => t.includes(q))
  );
}
