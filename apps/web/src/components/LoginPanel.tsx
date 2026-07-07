"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";

/** JWT login — sets localStorage + cookie for Server Actions */
export function LoginPanel() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("admin@interview.local");
  const [password, setPassword] = useState("interview123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className="auth-bar">
        <span>
          Signed in as <strong>{user.email}</strong> ({user.role})
        </span>
        <button type="button" className="scenario-btn" onClick={logout}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-bar">
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Password"
        />
        <button type="submit" className="scenario-btn" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {error && <span className="auth-error">{error}</span>}
      <span className="auth-hint">Demo: admin@interview.local / interview123 · Set ENABLE_AUTH=true to require JWT for mutations</span>
    </div>
  );
}
