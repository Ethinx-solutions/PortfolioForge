import { WebSocketServer } from "ws";
import { subscribe, getLogs, log } from "./logger.js";

export function attachWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    log("System", "info", "🔌 Dashboard WS connected");

    // Send recent log history on connect
    const history = getLogs(50);
    ws.send(JSON.stringify({ type: "history", data: history }));

    // Subscribe to live logs
    const unsub = subscribe(ws);

    ws.on("close", () => {
      unsub();
      log("System", "info", "🔌 Dashboard WS disconnected");
    });

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === "ping") ws.send(JSON.stringify({ type: "pong" }));
      } catch {}
    });
  });

  return wss;
}
