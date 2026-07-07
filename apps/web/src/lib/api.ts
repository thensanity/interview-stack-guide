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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? `${API_URL}/graphql`;

export async function login(email: string, password: string): Promise<AuthLoginResult> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "Login failed");
  }
  const json = await res.json();
  return json.data;
}

/** Paginated REST fetch — interview: cursor pagination + cache tags */
export async function fetchProductsPaginated(
  options?: { limit?: number; cursor?: string },
  token?: string | null
): Promise<PaginatedProducts> {
  const params = new URLSearchParams({ limit: String(options?.limit ?? 5) });
  if (options?.cursor) params.set("cursor", options.cursor);

  const res = await fetch(`${API_URL}/api/products?${params}`, {
    headers: authHeaders(token),
    next: { revalidate: 30, tags: ["products"] },
  });
  if (!res.ok) throw new Error("Failed to fetch products via REST");
  const json = await res.json();
  return { items: json.data, meta: json.meta };
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    next: { revalidate: 60, tags: [`product-${id}`] },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data;
}

/** @deprecated Use fetchProductsPaginated */
export async function fetchProductsRest(): Promise<Product[]> {
  const result = await fetchProductsPaginated({ limit: 20 });
  return result.items;
}

export async function fetchProductsGraphQL(): Promise<Product[]> {
  const query = `
    query GetProducts {
      products { items { id name description price category tags inStock createdAt updatedAt } total nextCursor }
      dataProvider
    }
  `;
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error("Failed to fetch products via GraphQL");
  const json = await res.json();
  return json.data.products.items;
}

export async function fetchHealth(): Promise<{ status: string; provider: string; deployTarget: string; auth?: boolean }> {
  const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
  return res.json();
}

export async function createProductViaApi(
  input: { name: string; description: string; price: number; category: string },
  token?: string | null
): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products`, {
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

/** Back-compat alias */
export const createProduct = createProductViaApi;
