import type { Server } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import type { EventBus } from "@interview/events";

/** WebSocket event stream — interview: compare with SSE (bidirectional vs server-push) */
export function attachEventWebSocket(server: Server, bus: EventBus) {
  const wss = new WebSocketServer({ server, path: "/api/events/ws" });

  wss.on("connection", (ws: WebSocket) => {
    for (const event of bus.getHistory(20).reverse()) {
      ws.send(JSON.stringify({ type: "event", data: event }));
    }

    const unsub = bus.subscribe((event) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: "event", data: event }));
      }
    });

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", timestamp: new Date().toISOString() }));
        }
      } catch {
        ws.send(JSON.stringify({ type: "error", message: "Invalid message" }));
      }
    });

    ws.on("close", unsub);
  });

  return wss;
}
