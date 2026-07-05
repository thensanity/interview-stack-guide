"use client";

import { useState } from "react";
import { API_URL, authHeaders, storeAuth, clearAuth, getStoredUser, getStoredToken } from "@/lib/playground";

export function AuthPanel() {
  const [email, setEmail] = useState("admin@interview.local");
  const [password, setPassword] = useState("interview123");
  const [status, setStatus] = useState<string | null>(null);
  const [user, setUser] = useState(getStoredUser());
  const [tokenPreview, setTokenPreview] = useState(getStoredToken()?.slice(0, 40) ?? null);

  async function login() {
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Login failed");
      storeAuth(json.data.token, json.data.user);
      setUser(json.data.user);
      setTokenPreview(json.data.token.slice(0, 40) + "…");
      setStatus("Logged in — token stored in sessionStorage");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Login failed");
    }
  }

  async function fetchMe() {
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Not authenticated");
      setStatus(`Authenticated as ${json.data.email} (${json.data.role})`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Auth check failed");
    }
  }

  function logout() {
    clearAuth();
    setUser(null);
    setTokenPreview(null);
    setStatus("Logged out");
  }

  return (
    <div className="pg-panel">
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Demo JWT flow — use token in REST/GraphQL tabs. Set <code>ENABLE_AUTH=true</code> on API to enforce on mutations.
      </p>

      <div className="form" style={{ maxWidth: 420 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button type="button" onClick={login}>Login</button>
          <button type="button" className="pg-btn-sm" onClick={fetchMe}>GET /api/auth/me</button>
          <button type="button" className="pg-btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>

      {user && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <strong>{user.email}</strong> · role: {user.role}
          {tokenPreview && <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem", wordBreak: "break-all" }}>Token: {tokenPreview}</p>}
        </div>
      )}

      <div className="card" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        <strong>Demo users</strong>
        <ul style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
          <li>admin@interview.local / interview123</li>
          <li>viewer@interview.local / viewer123</li>
        </ul>
      </div>

      {status && <p style={{ marginTop: "1rem", color: "var(--success)", fontSize: "0.9rem" }}>{status}</p>}
    </div>
  );
}
