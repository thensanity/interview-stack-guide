import { fetchProductsGraphQL } from "@/lib/api";

/** GraphQL data fetching demo — compare with REST products page */
export const dynamic = "force-dynamic";

export default async function GraphQLDemoPage() {
  let products: Awaited<ReturnType<typeof fetchProductsGraphQL>> = [];
  let error: string | null = null;

  try {
    products = await fetchProductsGraphQL();
  } catch (e) {
    error = e instanceof Error ? e.message : "GraphQL fetch failed";
  }

  const query = `query GetProducts {
  products { id name price category inStock }
  dataProvider
}`;

  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>GraphQL Demo</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Same data, different query interface — interview gold for REST vs GraphQL tradeoffs
      </p>

      <div className="arch-section">
        <h2>Sample Query</h2>
        <pre>{query}</pre>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "#ef4444" }}>
          {error}
        </div>
      )}

      <div className="product-list">
        {products.map((p) => (
          <div key={p.id} className="product-item">
            <div>
              <h4>{p.name}</h4>
              <div className="meta">{p.category}</div>
            </div>
            <div className="price">${p.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
