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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? `${API_URL}/graphql`;

/** REST client — NoSQL document CRUD via REST */
export async function fetchProductsRest(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Failed to fetch products via REST");
  const json = await res.json();
  return json.data;
}

/** GraphQL client — flexible queries, interview: over-fetching vs under-fetching */
export async function fetchProductsGraphQL(): Promise<Product[]> {
  const query = `
    query GetProducts {
      products { id name description price category tags inStock createdAt updatedAt }
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
  return json.data.products;
}

export async function fetchHealth(): Promise<{ status: string; provider: string; deployTarget: string }> {
  const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
  return res.json();
}

export async function createProduct(input: {
  name: string;
  description: string;
  price: number;
  category: string;
}): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  return json.data;
}
