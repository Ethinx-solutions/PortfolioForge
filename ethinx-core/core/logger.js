// Centralized logger — captures all agent/plugin/system output
// Broadcasts to connected WebSocket clients in real-time

const LOG_BUFFER_SIZE = 500;
const logs = [];
const subscribers = new Set();

export function log(source, level, message, meta = {}) {
  const entry = {
    id: Date.now() + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    source,
    level,
    message,
    meta
  };

  logs.push(entry);
  if (logs.length > LOG_BUFFER_SIZE) logs.shift();

  // Broadcast to all WS subscribers
  const payload = JSON.stringify({ type: "log", data: entry });
  for (const ws of subscribers) {
    try { ws.send(payload); } catch {}
  }

  // Also print to console
  const icon = level === "error" ? "❌" : level === "warn" ? "⚠️" : "📋";
  console.log(`${icon} [${source}] ${message}`);

  return entry;
}

export function getLogs(limit = 100, filter = {}) {
  let result = [...logs];
  if (filter.source) result = result.filter(l => l.source === filter.source);
  if (filter.level) result = result.filter(l => l.level === filter.level);
  return result.slice(-limit);
}

export function subscribe(ws) {
  subscribers.add(ws);
  return () => subscribers.delete(ws);
}

export function getSubscriberCount() {
  return subscribers.size;
}
