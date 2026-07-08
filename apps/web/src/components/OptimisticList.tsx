"use client";

import { useOptimistic, useTransition } from "react";

interface Item {
  id: string;
  name: string;
}

/** React 19 useOptimistic demo — interview: instant UI before server confirms */
export function OptimisticList({ initial }: { initial: Item[] }) {
  const [items, setItems] = useOptimistic(initial);
  const [, startTransition] = useTransition();

  function addItem() {
    const optimistic: Item = { id: `temp-${Date.now()}`, name: "New item (optimistic)" };
    startTransition(async () => {
      setItems([optimistic, ...items]);
      await new Promise((r) => setTimeout(r, 800));
      setItems([{ id: crypto.randomUUID(), name: "New item (confirmed)" }, ...items]);
    });
  }

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h3>useOptimistic Demo</h3>
      <button type="button" className="scenario-btn" onClick={addItem}>Add optimistic item</button>
      <ul style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
        {items.map((i) => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>
    </div>
  );
}
