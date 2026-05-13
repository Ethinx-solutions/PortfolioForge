#!/bin/bash
# T-DOG EMPIRE OS — Secret Rotation & Hardening Script
# Run this on the Hetzner server to move secrets into a protected file

RELAY_DIR="/var/www/empire-os-relay"
SECRETS_FILE="${RELAY_DIR}/secrets.json"

echo "╔══════════════════════════════════════════════════╗"
echo "║  T-DOG EMPIRE OS — Security Hardening           ║"
echo "╚══════════════════════════════════════════════════╝"

# Create secrets file with restricted permissions
cat > "${SECRETS_FILE}" << 'SECRETS'
{
  "NODE_ENV": "production",
  "PORT": 3002,
  "DASHBOARD_WEBHOOK_SECRET": "0af348ea4ead8745324f59b2dece05126865f7ccddf453f6ed9cc3eacb2cda17",
  "STRIPE_WEBHOOK_SECRET": "whsec_7s6B00gLIOriigAfzDKuw7dxmKGXIMPU",
  "DASHBOARD_URL": "https://ethinx-dash-mz7rowca.manus.space"
}
SECRETS

chmod 600 "${SECRETS_FILE}"
echo "[OK] Secrets file created at ${SECRETS_FILE} with 600 permissions"

# Clear bash history of inline secrets
history -c 2>/dev/null
cat /dev/null > ~/.bash_history
echo "[OK] Bash history cleared"

# Verify
echo ""
echo "=== Verification ==="
ls -la "${SECRETS_FILE}"
echo ""
echo "Hardening complete. Restart relay with: pm2 restart empire-os-relay"
