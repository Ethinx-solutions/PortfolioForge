#!/bin/bash
# ─── ETHINX CONTENT ENGINE — PRODUCTION DEPLOY (Hetzner + Cloudflare tunnel) ──
# Target: 91.99.162.243 (SSH alias: Tdog) → content.ethinx.solutions via cloudflared
set -euo pipefail

HOST="Tdog"
APP_DIR="/opt/ethinx-core"

echo "📦 Packaging ethinx-core (excluding node_modules/.git/.env)…"
tar --exclude=node_modules --exclude=.git --exclude=.env \
  -czf /tmp/ethinx-core.tar.gz -C "$APP_DIR/.." ethinx-core 2>/dev/null || \
tar --exclude=node_modules --exclude=.git --exclude=.env \
  -czf /tmp/ethinx-core.tar.gz -C "$(dirname "$0")/.." ethinx-core

echo "🚀 Uploading to $HOST…"
scp /tmp/ethinx-core.tar.gz "$HOST:/tmp/ethinx-core.tar.gz"
rm /tmp/ethinx-core.tar.gz

echo "🔧 Syncing files + installing deps (production .env is preserved)…"
ssh "$HOST" bash -s <<'REMOTE'
set -euo pipefail
cd /opt/ethinx-core
tar -xzf /tmp/ethinx-core.tar.gz --strip-components=1 --overwrite
rm /tmp/ethinx-core.tar.gz
# Idempotent: npm ci removes node_modules and installs EXACTLY per lockfile.
npm ci --omit=dev --silent
# Guard: refuse to boot if production env file is missing a REDIS_URL.
if [ -z "$(grep -E '^REDIS_URL=' .env 2>/dev/null)" ]; then
  echo "❌ .env is missing REDIS_URL — aborting." >&2
  exit 1
fi
REMOTE

echo "🔄 Reloading PM2 via ecosystem (both apps, env from .env)…"
ssh "$HOST" "cd /opt/ethinx-core && pm2 restart ecosystem.config.cjs --update-env && pm2 save"

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ DEPLOYED → https://content.ethinx.solutions"
echo "═══════════════════════════════════════════════════"