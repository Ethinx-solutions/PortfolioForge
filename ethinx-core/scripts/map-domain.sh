#!/bin/bash
# ─── ETHINX CORE — DOMAIN MAPPING ─────────────────────
# Maps ethinx.solutions to Cloud Run service
# After running this, add the DNS records in Cloudflare
set -e

SERVICE="ethinx-core"
REGION="australia-southeast1"
DOMAIN="ethinx.solutions"

echo "🌐 Mapping $DOMAIN → $SERVICE..."

gcloud run domain-mappings create \
  --service "$SERVICE" \
  --domain "$DOMAIN" \
  --region "$REGION"

echo ""
echo "📋 DNS records to add in Cloudflare:"
echo ""
gcloud run domain-mappings describe \
  --domain "$DOMAIN" \
  --region "$REGION" \
  --format 'table(resourceRecords.type, resourceRecords.rrdata)'

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Go to Cloudflare → ethinx.solutions → DNS"
echo "  Add the records shown above"
echo "  Set proxy status to DNS ONLY (grey cloud)"
echo "  SSL/TLS → Full (strict)"
echo "═══════════════════════════════════════════════════"
