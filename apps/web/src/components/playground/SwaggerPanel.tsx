"use client";

import dynamic from "next/dynamic";
import { API_URL } from "@/lib/playground";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export function SwaggerPanel() {
  return (
    <div className="pg-panel pg-swagger">
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Interactive REST docs from <code>openapi.yaml</code> — try endpoints without curl.
      </p>
      <SwaggerUI url={`${API_URL}/openapi.yaml`} docExpansion="list" defaultModelsExpandDepth={-1} />
    </div>
  );
}
