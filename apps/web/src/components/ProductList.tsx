import Link from "next/link";
import { fetchProductsPaginated } from "@/lib/api";
import { ProductPagination } from "@/components/ProductPagination";

interface Props {
  limit: number;
  cursor?: string;
}

/** Async Server Component — streams inside Suspense boundary */
export async function ProductList({ limit, cursor }: Props) {
  let result: Awaited<ReturnType<typeof fetchProductsPaginated>>;
  let error: string | null = null;

  try {
    result = await fetchProductsPaginated({ limit, cursor });
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load products";
    return (
      <div className="card" style={{ borderColor: "#ef4444", marginBottom: "1rem" }}>
        API unavailable: {error}. Start the API with <code>npm run dev</code>.
      </div>
    );
  }

  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
        Showing {result.items.length} of {result.meta.total} products (page size {limit})
        {result.meta.nextCursor ? " · more available" : ""}
      </p>

      <div className="product-list">
        {result.items.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="product-item product-link">
            <div>
              <h4>{p.name}</h4>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{p.description}</p>
              <div className="meta">{p.category} · {p.inStock ? "In stock" : "Out of stock"}</div>
            </div>
            <div className="price">${p.price.toFixed(2)}</div>
          </Link>
        ))}
        {result.items.length === 0 && (
          <p style={{ color: "var(--muted)" }}>No products yet. Create one below.</p>
        )}
      </div>

      <ProductPagination
        limit={limit}
        nextCursor={result.meta.nextCursor}
        currentCursor={cursor}
      />
    </>
  );
}
