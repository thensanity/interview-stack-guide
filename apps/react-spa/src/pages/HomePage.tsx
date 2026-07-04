import { useEffect, useState } from "react";
import { fetchHealth } from "../lib/api";

/** CSR-only home — data fetched in useEffect after mount (compare with Next.js ISR on server) */
export default function HomePage() {
  const [health, setHealth] = useState({ status: "loading...", provider: "—", deployTarget: "—" });

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: "offline", provider: "—", deployTarget: "—" }));
  }, []);

  return (
    <>
      <section className="hero">
        <h2>Plain React SPA</h2>
        <p>
          Same API, same UI goals — but everything renders in the browser. No SSR, no file-based routing,
          no Server Components. Built with Vite + React Router.
        </p>
      </section>

      <div className="status-bar">
        <div><span>API Status: </span><strong>{health.status}</strong></div>
        <div><span>NoSQL Provider: </span><strong>{health.provider}</strong></div>
        <div><span>Deploy Target: </span><strong>{health.deployTarget}</strong></div>
        <div><span>Rendering: </span><strong>CSR (client-side)</strong></div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>React (this app)</h3>
          <ul>
            <li>Client-side rendering only</li>
            <li>React Router for URLs</li>
            <li>useEffect + useState for data</li>
            <li>Vite dev server + proxy</li>
          </ul>
        </div>
        <div className="card">
          <h3>Next.js (port 3000)</h3>
          <ul>
            <li>SSR, SSG, and ISR options</li>
            <li>File-based App Router</li>
            <li>Server Components by default</li>
            <li>Built-in SEO &amp; metadata API</li>
          </ul>
        </div>
        <div className="card">
          <h3>Interview Tip</h3>
          <p>
            Open both apps side-by-side. View page source on /products — Next.js has HTML content;
            React SPA shows an empty <code>&lt;div id="root"&gt;</code>.
          </p>
        </div>
      </div>
    </>
  );
}
