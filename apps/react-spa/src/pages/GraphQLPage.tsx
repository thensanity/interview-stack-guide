import { useEffect, useState } from "react";
import { fetchProductsGraphQL, type Product } from "../lib/api";

export default function GraphQLPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductsGraphQL()
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : "GraphQL failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>GraphQL Demo (CSR)</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
        Same GraphQL endpoint as Next.js — but fetched client-side after hydration
      </p>

      <pre className="code-block">{`query { products { items { id name price category inStock } total } }`}</pre>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="product-list" style={{ marginTop: "1rem" }}>
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
