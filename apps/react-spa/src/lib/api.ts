import { authHeaders } from "./auth";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProducts {
  items: Product[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    nextCursor?: string;
    provider: string;
  };
}

export interface AuthLoginResult {
  token: string;
  user: { id: string; email: string; role: "admin" | "viewer" };
}

/** Vite exposes env vars via import.meta.env — compare with Next.js NEXT_PUBLIC_* */
const API_URL = import.meta.env.VITE_API_URL ?? "";

function apiPath(path: string): string {
  return API_URL ? `${API_URL}${path}` : path;
}

export async function login(email: string, password: string): Promise<AuthLoginResult> {
  const res = await fetch(apiPath("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "Login failed");
  }
  const json = await res.json();
  return json.data;
}

export async function fetchProductsPaginated(
  options?: { limit?: number; cursor?: string },
  token?: string | null
): Promise<PaginatedProducts> {
  const params = new URLSearchParams({ limit: String(options?.limit ?? 5) });
  if (options?.cursor) params.set("cursor", options.cursor);

  const res = await fetch(apiPath(`/api/products?${params}`), {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch products via REST");
  const json = await res.json();
  return { items: json.data, meta: json.meta };
}

/** @deprecated Use fetchProductsPaginated — kept for GraphQL demo */
export async function fetchProductsRest(token?: string | null): Promise<Product[]> {
  const result = await fetchProductsPaginated({ limit: 20 }, token);
  return result.items;
}

export async function fetchProductById(id: string, token?: string | null): Promise<Product | null> {
  const res = await fetch(apiPath(`/api/products/${id}`), { headers: authHeaders(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data;
}

export async function fetchProductsGraphQL(): Promise<Product[]> {
  const query = `query { products { items { id name description price category inStock } total } }`;
  const res = await fetch(apiPath("/graphql"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to fetch via GraphQL");
  const json = await res.json();
  return json.data.products.items;
}

export async function fetchHealth(): Promise<{ status: string; provider: string; deployTarget: string; auth?: boolean }> {
  const res = await fetch(apiPath("/health"));
  return res.json();
}

export async function createProduct(
  input: { name: string; description: string; price: number; category: string },
  token?: string | null
): Promise<Product> {
  const res = await fetch(apiPath("/api/products"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? json.error ?? "Failed to create product");
  }
  return json.data;
}
