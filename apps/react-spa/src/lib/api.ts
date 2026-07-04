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

/** Vite exposes env vars via import.meta.env — compare with Next.js NEXT_PUBLIC_* */
const API_URL = import.meta.env.VITE_API_URL ?? "";

function apiPath(path: string): string {
  return API_URL ? `${API_URL}${path}` : path;
}

export async function fetchProductsRest(): Promise<Product[]> {
  const res = await fetch(apiPath("/api/products"));
  if (!res.ok) throw new Error("Failed to fetch products via REST");
  const json = await res.json();
  return json.data;
}

export async function fetchProductsGraphQL(): Promise<Product[]> {
  const query = `query { products { id name description price category inStock } }`;
  const res = await fetch(apiPath("/graphql"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to fetch via GraphQL");
  const json = await res.json();
  return json.data.products;
}

export async function fetchHealth(): Promise<{ status: string; provider: string; deployTarget: string }> {
  const res = await fetch(apiPath("/health"));
  return res.json();
}

export async function createProduct(input: {
  name: string;
  description: string;
  price: number;
  category: string;
}): Promise<Product> {
  const res = await fetch(apiPath("/api/products"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  return json.data;
}
