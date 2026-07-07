import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

/** Dynamic SEO metadata — interview: generateMetadata for product pages */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Interview Stack Guide`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) notFound();

  return (
    <>
      <nav style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
        <Link href="/products" style={{ color: "var(--muted)" }}>← Back to products</Link>
      </nav>

      <article className="card product-detail">
        <h2>{product.name}</h2>
        <p style={{ color: "var(--muted)", margin: "0.75rem 0" }}>{product.description}</p>
        <div className="product-detail-meta">
          <span className="price">${product.price.toFixed(2)}</span>
          <span>{product.category}</span>
          <span>{product.inStock ? "In stock" : "Out of stock"}</span>
        </div>
        {product.tags.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            {product.tags.map((tag) => (
              <span key={tag} className="badge badge-purple">{tag}</span>
            ))}
          </div>
        )}
        <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "1.5rem" }}>
          ID: <code>{product.id}</code> · Updated {new Date(product.updatedAt).toLocaleDateString()}
        </p>
      </article>
    </>
  );
}
