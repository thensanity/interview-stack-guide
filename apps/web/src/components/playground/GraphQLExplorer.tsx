"use client";

import { useCallback, useState } from "react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import "graphiql/style.css";
import { GRAPHQL_URL, DEMO_QUERIES, authHeaders } from "@/lib/playground";

export function GraphQLExplorer() {
  const [query, setQuery] = useState(DEMO_QUERIES.products);

  const fetcher = useCallback(
    createGraphiQLFetcher({
      url: GRAPHQL_URL,
      fetch: (url, init) =>
        fetch(url, {
          ...init,
          headers: { ...init?.headers, ...authHeaders() },
        }),
    }),
    []
  );

  return (
    <div className="pg-panel pg-graphiql">
      <div className="pg-presets">
        {Object.entries(DEMO_QUERIES).map(([key, q]) => (
          <button key={key} type="button" className="pg-btn-sm" onClick={() => setQuery(q)}>{key}</button>
        ))}
      </div>
      <div className="pg-graphiql-wrap">
        <GraphiQL fetcher={fetcher} query={query} onEditQuery={setQuery} defaultEditorToolsVisibility />
      </div>
    </div>
  );
}
