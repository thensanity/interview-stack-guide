"use client";

import { useState } from "react";
import Link from "next/link";
import { searchGuide } from "@/lib/guide-index";

export default function GuidePage() {
  const [query, setQuery] = useState("");
  const results = searchGuide(query);

  return (
    <>
      <h2>Interview Guide Search</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        Search all topics — docs live in <code>docs/interview-guide/</code> on GitHub.
      </p>

      <input
        className="guide-search"
        placeholder="Search: graphql, kubernetes, auth, testing…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1rem" }}>{results.length} results</p>

      {results.map((r) => (
        <div key={r.id} className="guide-result">
          <h4>{r.title}</h4>
          <p>{r.summary}</p>
          <p style={{ fontSize: "0.75rem", marginTop: "0.35rem" }}>
            Tags: {r.tags.join(", ")} ·{" "}
            <Link href="/playground" style={{ color: "var(--accent)" }}>Try in Playground →</Link>
          </p>
        </div>
      ))}
    </>
  );
}
