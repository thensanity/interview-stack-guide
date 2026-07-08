import Link from "next/link";
import { fetchProductById } from "@/lib/api";

/** Intercepting route — modal quick-view without full navigation */
export default async function ProductModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="card modal-card">
        <Link href="/products" style={{ float: "right", color: "var(--muted)" }}>✕</Link>
        <h3>{product.name}</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{product.description}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <Link href={`/products/${id}`}>Open full page →</Link>
      </div>
    </div>
  );
}
