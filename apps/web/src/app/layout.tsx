import type { Metadata } from "next";
import "./globals.css";
import { OfflineBanner } from "@/components/OfflineBanner";

export const metadata: Metadata = {
  title: "Interview Stack Guide",
  description: "Next.js + NoSQL/GraphQL + CI/CD + AWS/K8s reference project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OfflineBanner />
        <header className="header">
          <div className="container">
            <h1>Interview Stack Guide</h1>
            <nav>
              <a href="/">Home</a>
              <a href="/playground">Playground</a>
              <a href="/guide">Guide</a>
              <a href="/products">Products (SSR)</a>
              <a href="/graphql-demo">GraphQL Demo</a>
              <a href="/scenarios">Scenarios</a>
              <a href="/patterns">Patterns</a>
              <a href="/decisions">Decisions</a>
              <a href="/debug">Debug</a>
              <a href="/architecture">Architecture</a>
              <a href="http://localhost:5173/scenarios" target="_blank" rel="noreferrer">React vs Next.js →</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container">
            Reference project for Next.js, NoSQL, GraphQL, CI/CD, AWS &amp; Kubernetes interviews
          </div>
        </footer>
      </body>
    </html>
  );
}
