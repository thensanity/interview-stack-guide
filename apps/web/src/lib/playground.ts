export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? `${API_URL}/graphql`;

const TOKEN_KEY = "interview-auth-token";
const USER_KEY = "interview-auth-user";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function storeAuth(token: string, user: AuthUser) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `interview-auth-token=${token}; path=/; SameSite=Lax`;
}

export function clearAuth() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  document.cookie = "interview-auth-token=; path=/; max-age=0";
}

export function authHeaders(includeToken = true): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (includeToken) {
    const token = getStoredToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export const DEMO_QUERIES = {
  products: `query GetProducts {
  products(limit: 10) {
    items { id name price category inStock }
    total
    nextCursor
  }
  dataProvider
}`,
  productsByIds: `query BatchProducts {
  productsByIds(ids: ["p1", "p2"]) {
    id name price
  }
}`,
  scenarios: `query {
  activeScenarios
  events { type message timestamp }
}`,
};

export const REST_PRESETS = [
  { label: "Health", method: "GET", path: "/health", body: "" },
  { label: "Ready", method: "GET", path: "/ready", body: "" },
  { label: "List Products", method: "GET", path: "/api/products?limit=5", body: "" },
  { label: "Create Product", method: "POST", path: "/api/products", body: JSON.stringify({ name: "Playground Widget", description: "Created from playground", price: 24.99, category: "demo" }, null, 2) },
  { label: "Metrics", method: "GET", path: "/metrics", body: "" },
  { label: "Scenarios", method: "GET", path: "/api/scenarios", body: "" },
];

export const PATTERN_LAUNCHERS = [
  { id: "dual_write_migration", name: "Dual-Write Migration", tab: "scenarios" as const, description: "Trigger migration scenario" },
  { id: "cicd_pipeline", name: "CI/CD Pipeline", tab: "scenarios" as const, description: "Simulate pipeline stages" },
  { id: "traffic_spike", name: "Traffic Spike", tab: "scenarios" as const, description: "Add latency" },
  { id: "auth", name: "JWT Auth", tab: "auth" as const, description: "Login and use token" },
  { id: "graphql-dataloader", name: "DataLoader", tab: "graphql" as const, description: "Run productsByIds query" },
  { id: "cache", name: "Redis Cache", tab: "rest" as const, description: "GET products twice, compare X-Cache" },
];

export type PlaygroundTab = "rest" | "graphql" | "auth" | "scenarios" | "transports" | "api-docs" | "patterns";

export const INTERVIEW_DEMO_SCRIPT = [
  { delay: 0, scenario: "traffic_spike", label: "Simulate traffic spike" },
  { delay: 8000, scenario: "db_slow", label: "Database slows down" },
  { delay: 16000, scenario: "db_error", label: "Next DB call fails" },
  { delay: 22000, scenario: "recover", label: "Recover all scenarios" },
];
