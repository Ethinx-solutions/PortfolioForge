# ethinx-core

Content engine API + worker for the Ethinx platform. Deployed on Hetzner and exposed via Cloudflare tunnel at `https://content.ethinx.solutions`.

## Infrastructure Note (Aug 2026)

- **Redis:** The host `redis-server.service` is **permanently disabled**. The PM2 Celery workers (`ethinx-agent-fabric`) and `ethinx-content` both correctly route through Docker's `ethinx-redis` on `127.0.0.1:6379` (persistent volume + `--appendonly yes`). Do **not** start the host service — it will cause a boot race condition for port 6379.
- **Networking:** `server.js` must remain bound to `127.0.0.1`. Do **not** run `sed` replacements for `0.0.0.0` — public traffic is handled exclusively via the secure tunnel (`cloudflared-optivid.service`, ingress `content.ethinx.solutions → http://localhost:3200`).
- **Config loading:** `.env` is loaded once via `core/env.js` by absolute app-root path — independent of `process.cwd()`. In production a missing `REDIS_URL` throws at boot (no silent in-memory fallback).
- **PM2:** Both processes (`ethinx-content`, `ethinx-content-worker`) are managed by `ecosystem.config.cjs` and saved to the dump. Deploy via `scripts/deploy-hetzner.sh` (npm ci + `pm2 restart ecosystem.config.cjs` + `pm2 save`).

## Commands

```bash
npm install
pm2 start ecosystem.config.cjs && pm2 save
bash scripts/deploy-hetzner.sh
```
