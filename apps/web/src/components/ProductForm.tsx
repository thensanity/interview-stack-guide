"use client";

import { useActionState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { createProductAction, type ProductFormState } from "@/app/products/actions";

const initialState: ProductFormState | null = null;

/** Client Component using Server Action + useActionState — interview: modern Next.js mutations */
export function ProductForm() {
  const { isAuthenticated } = useAuth();
  const [state, formAction, pending] = useActionState(createProductAction, initialState);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Add Product (Server Action → REST POST)</h3>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
        Uses <code>useActionState</code> + <code>revalidatePath</code> — no manual refresh needed.
        {!isAuthenticated && " Sign in above if ENABLE_AUTH=true."}
      </p>
      <form className="form" action={formAction}>
        <input name="name" placeholder="Name" required />
        <textarea name="description" placeholder="Description" required rows={2} />
        <input name="price" type="number" step="0.01" placeholder="Price" required />
        <input name="category" placeholder="Category" required />
        <button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create via Server Action"}
        </button>
      </form>
      {state && (
        <p
          style={{
            marginTop: "0.75rem",
            color: state.ok ? "var(--success)" : "#ef4444",
            fontSize: "0.85rem",
          }}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
