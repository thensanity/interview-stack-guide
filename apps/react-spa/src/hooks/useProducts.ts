import { useCallback, useEffect, useState } from "react";
import { fetchProductsPaginated, type Product } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/** Cursor pagination hook — interview contrast with Next.js searchParams */
export function useProducts(pageSize = 5) {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (cursor?: string, append = false) => {
      if (append) setLoadingMore(true);
      else {
        setLoading(true);
        setError(null);
      }
      try {
        const result = await fetchProductsPaginated({ limit: pageSize, cursor }, token);
        setProducts((prev) => (append ? [...prev, ...result.items] : result.items));
        setNextCursor(result.meta.nextCursor);
        setTotal(result.meta.total);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load products");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize, token]
  );

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(() => {
    if (nextCursor && !loadingMore) load(nextCursor, true);
  }, [nextCursor, loadingMore, load]);

  const refresh = useCallback(() => load(), [load]);

  return {
    products,
    total,
    loading,
    loadingMore,
    error,
    hasMore: !!nextCursor,
    loadMore,
    refresh,
  };
}
