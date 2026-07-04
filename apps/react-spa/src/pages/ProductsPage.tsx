import { useEffect, useState } from "react";
import { fetchProductsRest, createProduct, type Product } from "../lib/api";
import { fetchWithRetry } from "../lib/events";
import ProductForm from "../components/ProductForm";

/** Classic CSR pattern — fetch after mount, show loading state */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadProducts() {
    setLoading(true);
    setError(null);
    fetchWithRetry(() => fetchProductsRest())
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleCreate(input: { name: string; description: string; price: number; category: string }) {
    await createProduct(input);
    loadProducts();
  }

  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>Products (CSR + REST)</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
        Data fetched in <code>useEffect</code> after component mounts — interview contrast with Next.js SSR
      </p>

      {loading && <p className="loading">Loading products...</p>}
      {error && <p className="error">API unavailable: {error}</p>}

      {!loading && !error && (
        <div className="product-list">
          {products.map((p) => (
            <div key={p.id} className="product-item">
              <div>
                <h4>{p.name}</h4>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{p.description}</p>
                <div className="meta">{p.category} · {p.inStock ? "In stock" : "Out of stock"}</div>
              </div>
              <div className="price">${p.price.toFixed(2)}</div>
            </div>
          ))}
          {products.length === 0 && <p className="loading">No products yet.</p>}
        </div>
      )}

      <ProductForm onCreate={handleCreate} />
    </>
  );
}
