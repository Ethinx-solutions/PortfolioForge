# ethinx-core — ETHINX Auto Content Machine

Content engine API + agent worker for Ethinx. Auto-generates, reviews, schedules, and distributes content. Serves the ETHINX Command Center dashboard.

## Quick Start (local)

```bash
npm install

# Option A — Redis via Docker (recommended): brings up redis + app
docker-compose up -d          # app on http://localhost:3000, redis on :6379

# Option B — Redis via PM2 (Windows / no Docker):
pm2 start ecosystem.config.js --env production
pm2 logs content-machine
```

Requires a `REDIS_URL` in `.env` for background jobs. Without Redis the API/dashboard still run (in-memory store fallback), and the worker logs a single warning instead of crash-looping.

```bash
# Local docker redis:
# REDIS_URL=redis://localhost:6379

# Upstash (serverless):
# REDIS_URL=rediss://default:<password>@<host>:6379
```

## Commands

```bash
npm run dev        # API server only (node api/server.js)
npm run worker     # BullMQ worker only
npm start          # both via concurrently
pm2 start ecosystem.config.js --env production   # persistent process
pm2 logs content-machine
pm2 monit
docker-compose up -d          # persist via Docker
docker-compose logs -f app
```

## Environment (.env)

| Var              | Purpose                                   |
|------------------|-------------------------------------------|
| `PORT`           | HTTP port (default 3000)                  |
| `HOST`           | Bind address (default `0.0.0.0`)          |
| `REDIS_URL`      | `redis://` or `rediss://` connection      |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe billing |
| `API_KEYS`       | Key for external service calls            |

## Endpoints

- `GET /` — ETHINX Command Center dashboard (React, fully offline — no CDN)
- `GET /healthz` — liveness probe
- `GET /readyz` — readiness (checks Redis)
- `GET /api/status` — system + Redis status
- `GET /api/content/briefs` — content engine briefs
- `POST /run` — enqueue a job (requires Redis)

## Infrastructure Note (Aug 2026)

- **Redis on Hetzner:** local `redis-server.service` is disabled; the container `ethinx-redis` on `127.0.0.1:6379` is used. On local dev use Docker or Upstash.
- **Binding:** default is `0.0.0.0:3000` (reachable on LAN). Set `HOST=127.0.0.1` in `.env` to restrict when behind a tunnel.
- **PM2:** processes are managed via `ecosystem.config.js` (`content-machine`) and `ecosystem.config.cjs` (split server/worker on Hetzner). Deploy via `scripts/deploy-hetzner.sh`.