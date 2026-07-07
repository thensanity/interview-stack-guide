import { Suspense } from "react";
import { ProductForm } from "@/components/ProductForm";
import { ProductList } from "@/components/ProductList";
import ProductsLoading from "./loading";

interface Props {
  searchParams: Promise<{ cursor?: string; limit?: string }>;
}

/** SSR shell + Suspense streaming for product list — interview: partial hydration */
export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const limit = Math.min(parseInt(params.limit ?? "5", 10) || 5, 20);
  const cursor = params.cursor;

  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>Products (REST + NoSQL)</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Server-rendered shell streams the product list via Suspense. Pagination uses URL searchParams.
      </p>

      <Suspense fallback={<ProductsLoading />}>
        <ProductList limit={limit} cursor={cursor} />
      </Suspense>

      <ProductForm />
    </>
  );
}
