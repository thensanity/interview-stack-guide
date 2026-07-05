import { PlaygroundShell } from "@/components/playground/PlaygroundShell";

export const dynamic = "force-dynamic";

export default function PlaygroundPage() {
  return (
    <>
      <h2 style={{ marginBottom: "0.25rem" }}>Interview Playground</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Test and demo every feature in one place — REST, GraphQL, auth, scenarios, SSE/WebSocket, and OpenAPI.
      </p>
      <PlaygroundShell />
    </>
  );
}
