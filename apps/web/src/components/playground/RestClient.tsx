"use client";

import { useState } from "react";
import { API_URL, REST_PRESETS, authHeaders } from "@/lib/playground";

interface ResponseInfo {
  status: number;
  statusText: string;
  body: string;
  headers: Record<string, string>;
  durationMs: number;
}

export function RestClient() {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/api/products?limit=5");
  const [body, setBody] = useState("");
  const [useAuth, setUseAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseInfo | null>(null);

  async function send() {
    setLoading(true);
    const start = Date.now();
    try {
      const headers = authHeaders(useAuth);
      if (method === "GET" || method === "HEAD") delete headers["Content-Type"];
      const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: method !== "GET" && method !== "HEAD" && body ? body : undefined,
      });
      const text = await res.text();
      const headerMap: Record<string, string> = {};
      res.headers.forEach((v, k) => { headerMap[k] = v; });
      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: text,
        headers: headerMap,
        durationMs: Date.now() - start,
      });
    } catch (e) {
      setResponse({
        status: 0,
        statusText: "Error",
        body: e instanceof Error ? e.message : "Request failed",
        headers: {},
        durationMs: Date.now() - start,
      });
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(p: (typeof REST_PRESETS)[0]) {
    setMethod(p.method);
    setPath(p.path);
    setBody(p.body);
  }

  return (
    <div className="pg-panel">
      <div className="pg-presets">
        {REST_PRESETS.map((p) => (
          <button key={p.label} type="button" className="pg-btn-sm" onClick={() => applyPreset(p)}>{p.label}</button>
        ))}
      </div>

      <div className="pg-row">
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="pg-select">
          {["GET", "POST", "PUT", "DELETE"].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <input className="pg-input" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/api/products" />
        <label className="pg-check"><input type="checkbox" checked={useAuth} onChange={(e) => setUseAuth(e.target.checked)} /> Bearer token</label>
        <button type="button" className="scenario-btn" onClick={send} disabled={loading}>{loading ? "Sending…" : "Send"}</button>
      </div>

      {method !== "GET" && method !== "DELETE" && (
        <textarea className="pg-textarea" value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="JSON body" />
      )}

      {response && (
        <div className="pg-response">
          <div className="pg-response-meta">
            <span className={response.status >= 400 ? "pg-err" : "pg-ok"}>{response.status} {response.statusText}</span>
            <span>{response.durationMs}ms</span>
            {response.headers["x-cache"] && <span className="badge badge-blue">X-Cache: {response.headers["x-cache"]}</span>}
            {response.headers["x-request-id"] && <span className="badge badge-purple">ID: {response.headers["x-request-id"].slice(0, 8)}…</span>}
          </div>
          <pre>{formatBody(response.body)}</pre>
        </div>
      )}
    </div>
  );
}

function formatBody(body: string) {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}
