"use client";

import { useState } from "react";
import { createProduct } from "@/lib/api";

/** Client Component — interview: Server vs Client boundary, form actions */
export function ProductForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await createProduct({
        name: data.get("name") as string,
        description: data.get("description") as string,
        price: parseFloat(data.get("price") as string),
        category: data.get("category") as string,
      });
      setStatus("Product created! Refresh to see it.");
      form.reset();
    } catch {
      setStatus("Failed to create product. Is the API running?");
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Add Product (Client Mutation → REST POST)</h3>
      <form className="form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required />
        <textarea name="description" placeholder="Description" required rows={2} />
        <input name="price" type="number" step="0.01" placeholder="Price" required />
        <input name="category" placeholder="Category" required />
        <button type="submit">Create via REST</button>
      </form>
      {status && <p style={{ marginTop: "0.75rem", color: "var(--success)", fontSize: "0.85rem" }}>{status}</p>}
    </div>
  );
}
