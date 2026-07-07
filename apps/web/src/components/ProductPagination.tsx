"use client";

import Link from "next/link";

interface Props {
  limit: number;
  nextCursor?: string;
  currentCursor?: string;
}

/** URL-driven pagination — interview: searchParams vs React useState cursor */
export function ProductPagination({ limit, nextCursor, currentCursor }: Props) {
  return (
    <div className="pagination-bar">
      {currentCursor && (
        <Link href={`/products?limit=${limit}`} className="scenario-btn">
          ← First page
        </Link>
      )}
      {nextCursor ? (
        <Link href={`/products?limit=${limit}&cursor=${encodeURIComponent(nextCursor)}`} className="scenario-btn">
          Load more →
        </Link>
      ) : (
        currentCursor && <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>End of list</span>
      )}
    </div>
  );
}
