"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SystemStatusStrip } from "./SystemStatusStrip";
import { RestClient } from "./RestClient";
import { AuthPanel } from "./AuthPanel";
import { ScenarioConsole } from "./ScenarioConsole";
import { TransportPanel } from "./TransportPanel";
import { PatternLauncher } from "./PatternLauncher";
import type { PlaygroundTab } from "@/lib/playground";

const GraphQLExplorer = dynamic(() => import("./GraphQLExplorer").then((m) => m.GraphQLExplorer), {
  ssr: false,
  loading: () => <p className="loading">Loading GraphQL explorer…</p>,
});

const SwaggerPanel = dynamic(() => import("./SwaggerPanel").then((m) => m.SwaggerPanel), {
  ssr: false,
  loading: () => <p className="loading">Loading Swagger UI…</p>,
});

const TABS: { id: PlaygroundTab; label: string }[] = [
  { id: "patterns", label: "Patterns" },
  { id: "rest", label: "REST" },
  { id: "graphql", label: "GraphQL" },
  { id: "auth", label: "Auth" },
  { id: "scenarios", label: "Scenarios" },
  { id: "transports", label: "SSE / WS" },
  { id: "api-docs", label: "OpenAPI" },
];

export function PlaygroundShell({ initialTab = "patterns" }: { initialTab?: PlaygroundTab }) {
  const [tab, setTab] = useState<PlaygroundTab>(initialTab);

  function handlePatternLaunch(nextTab: PlaygroundTab, _action?: string) {
    setTab(nextTab);
  }

  return (
    <div className="playground">
      <SystemStatusStrip />

      <nav className="pg-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`pg-tab ${tab === t.id ? "pg-tab-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <a href="/playground/demo" className="pg-tab pg-tab-demo">▶ Presenter Mode</a>
      </nav>

      <div className="pg-content">
        {tab === "patterns" && <PatternLauncher onNavigate={handlePatternLaunch} />}
        {tab === "rest" && <RestClient />}
        {tab === "graphql" && <GraphQLExplorer />}
        {tab === "auth" && <AuthPanel />}
        {tab === "scenarios" && <ScenarioConsole />}
        {tab === "transports" && <TransportPanel />}
        {tab === "api-docs" && <SwaggerPanel />}
      </div>
    </div>
  );
}
