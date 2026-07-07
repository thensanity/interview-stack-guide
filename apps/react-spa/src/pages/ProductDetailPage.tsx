import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById, type Product } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/** Dynamic route — interview contrast with Next.js generateMetadata */
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(id, token)
      .then((p) => {
        if (!p) setError("Product not found");
        else setProduct(p);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <p className="loading">Loading product…</p>;
  if (error || !product) {
    return (
      <>
        <Link to="/products">← Back to products</Link>
        <p className="error">{error ?? "Not found"}</p>
      </>
    );
  }

  return (
    <>
      <Link to="/products" style={{ color: "var(--muted)", fontSize: "0.85rem" }}>← Back to products</Link>
      <article className="card product-detail" style={{ marginTop: "1rem" }}>
        <h2>{product.name}</h2>
        <p style={{ color: "var(--muted)", margin: "0.75rem 0" }}>{product.description}</p>
        <div className="product-detail-meta">
          <span className="price">${product.price.toFixed(2)}</span>
          <span>{product.category}</span>
          <span>{product.inStock ? "In stock" : "Out of stock"}</span>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "1.5rem" }}>
          ID: <code>{product.id}</code>
        </p>
      </article>
    </>
  );
}
