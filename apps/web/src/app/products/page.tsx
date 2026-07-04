import { fetchProductsRest } from "@/lib/api";
import { ProductForm } from "@/components/ProductForm";

/** SSR page — interview: explain streaming, Suspense, cache revalidation */
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof fetchProductsRest>> = [];
  let error: string | null = null;

  try {
    products = await fetchProductsRest();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load products";
  }

  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>Products (REST + NoSQL)</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Server-rendered via REST API → Repository → MongoDB or DynamoDB
      </p>

      {error && (
        <div className="card" style={{ borderColor: "#ef4444", marginBottom: "1rem" }}>
          API unavailable: {error}. Start the API with <code>npm run dev</code>.
        </div>
      )}

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
        {products.length === 0 && !error && (
          <p style={{ color: "var(--muted)" }}>No products yet. Create one below.</p>
        )}
      </div>

      <ProductForm />
    </>
  );
}
