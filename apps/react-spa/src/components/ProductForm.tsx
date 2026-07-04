import { useState } from "react";

interface Props {
  onCreate: (input: { name: string; description: string; price: number; category: string }) => Promise<void>;
}

export default function ProductForm({ onCreate }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus(null);

    try {
      await onCreate({
        name: data.get("name") as string,
        description: data.get("description") as string,
        price: parseFloat(data.get("price") as string),
        category: data.get("category") as string,
      });
      setStatus("Product created!");
      form.reset();
    } catch {
      setStatus("Failed — is the API running?");
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Create Product (client mutation)</h3>
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
