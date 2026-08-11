import { WebSocketServer } from "ws";
import { subscribe, getLogs } from "./logger.js";

export function attachWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  // Heartbeat: Cloudflare tunnel drops idle WS after ~100s. Ping every 30s.
  const HEARTBEAT_MS = 30_000;
  const heartbeat = setInterval(() => {
    for (const ws of wss.clients) {
      if (ws.isAlive === false) {
        ws.terminate();
        continue;
      }
      ws.isAlive = false;
      ws.ping();
    }
  }, HEARTBEAT_MS);

  wss.on("close", () => clearInterval(heartbeat));

  wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.on("pong", () => { ws.isAlive = true; });
    console.log("🔌 Dashboard WS connected");

    // Send recent log history on connect
    const history = getLogs(50);
    ws.send(JSON.stringify({ type: "history", data: history }));

    // Subscribe to live logs
    const unsub = subscribe(ws);

    ws.on("close", () => {
      unsub();
      console.log("🔌 Dashboard WS disconnected");
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