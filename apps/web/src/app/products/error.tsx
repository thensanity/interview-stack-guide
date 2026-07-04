"use client";

export default function ProductsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card" style={{ borderColor: "#ef4444" }}>
      <h3>Something went wrong</h3>
      <p style={{ color: "var(--muted)", margin: "0.5rem 0 1rem", fontSize: "0.9rem" }}>
        {error.message || "Failed to load products — try triggering Recover All on /scenarios"}
      </p>
      <button className="scenario-btn" onClick={reset}>Retry</button>
    </div>
  );
}
