import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";
import { createProduct } from "../lib/api";
import ProductForm from "../components/ProductForm";

/** Classic CSR pattern — useProducts hook with cursor pagination */
export default function ProductsPage() {
  const { token, isAuthenticated } = useAuth();
  const { products, total, loading, loadingMore, error, hasMore, loadMore, refresh } = useProducts(5);

  async function handleCreate(input: { name: string; description: string; price: number; category: string }) {
    await createProduct(input, token);
    refresh();
  }

  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>Products (CSR + REST)</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
        Data fetched via <code>useProducts</code> hook with cursor pagination — contrast with Next.js searchParams.
      </p>

      {loading && <p className="loading">Loading products...</p>}
      {error && <p className="error">API unavailable: {error}</p>}

      {!loading && !error && (
        <>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            Showing {products.length} of {total} products
          </p>
          <div className="product-list">
            {products.map((p) => (
              <Link key={p.id} to={`/products/${p.id}`} className="product-item product-link">
                <div>
                  <h4>{p.name}</h4>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{p.description}</p>
                  <div className="meta">{p.category} · {p.inStock ? "In stock" : "Out of stock"}</div>
                </div>
                <div className="price">${p.price.toFixed(2)}</div>
              </Link>
            ))}
            {products.length === 0 && <p className="loading">No products yet.</p>}
          </div>

          <div className="pagination-bar">
            {hasMore && (
              <button type="button" className="scenario-btn" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            )}
          </div>
        </>
      )}

      <ProductForm onCreate={handleCreate} authRequired={isAuthenticated} />
    </>
  );
}
