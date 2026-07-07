import { useState } from "react";

interface Props {
  onCreate: (input: { name: string; description: string; price: number; category: string }) => Promise<void>;
  authRequired?: boolean;
}

export default function ProductForm({ onCreate, authRequired }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus(null);
    setError(false);

    try {
      await onCreate({
        name: data.get("name") as string,
        description: data.get("description") as string,
        price: parseFloat(data.get("price") as string),
        category: data.get("category") as string,
      });
      setStatus("Product created!");
      form.reset();
    } catch (err) {
      setError(true);
      setStatus(err instanceof Error ? err.message : "Failed — is the API running?");
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Create Product (client mutation)</h3>
      {!authRequired && (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          Sign in above if API has ENABLE_AUTH=true
        </p>
      )}
      <form className="form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required />
        <textarea name="description" placeholder="Description" required rows={2} />
        <input name="price" type="number" step="0.01" placeholder="Price" required />
        <input name="category" placeholder="Category" required />
        <button type="submit">Create via REST</button>
      </form>
      {status && (
        <p style={{ marginTop: "0.75rem", color: error ? "#ef4444" : "var(--success)", fontSize: "0.85rem" }}>
          {status}
        </p>
      )}
    </div>
  );
}
