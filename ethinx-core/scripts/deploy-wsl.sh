#!/bin/bash
# ── ETHINX CORE — WSL/BASH DEPLOY TO GCP CLOUD RUN ──────────────────────────
# Run from WSL: bash scripts/deploy-wsl.sh
# Prerequisites: gcloud CLI installed + authenticated
# ─────────────────────────────────────────────────────────────────────────────
set -e

PROJECT_ID="ethinx-portfolioforge"
SERVICE="ethinx-core"
REGION="australia-southeast1"
REPO="ethinx-core"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}"

echo ""
echo "══════════════════════════════════════════════════"
echo "  🐾 ETHINX CORE — CLOUD RUN DEPLOY (WSL)"
echo "  Project : $PROJECT_ID"
echo "  Image   : $IMAGE"
echo "  Region  : $REGION"
echo "══════════════════════════════════════════════════"
echo ""

# Set project
gcloud config set project "$PROJECT_ID"

# Enable APIs
echo "🔧 Enabling APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  --quiet

# Create Artifact Registry repo if missing
echo "📦 Checking Artifact Registry repo..."
gcloud artifacts repositories describe "$REPO" \
  --location="$REGION" --project="$PROJECT_ID" 2>/dev/null || \
gcloud artifacts repositories create "$REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="ETHINX Core Images" \
  --project="$PROJECT_ID"

# Build + push via Cloud Build
echo "🔨 Building container..."
gcloud builds submit --tag "$IMAGE" --quiet

# Deploy
echo "☁️  Deploying to Cloud Run..."
# Load env vars from .env if present
ENV_FLAGS="NODE_ENV=production"
if [ -f .env ]; then
  REDIS=$(grep '^REDIS_URL=' .env | cut -d= -f2-)
  STRIPE_KEY=$(grep '^STRIPE_SECRET_KEY=' .env | cut -d= -f2-)
  STRIPE_WH=$(grep '^STRIPE_WEBHOOK_SECRET=' .env | cut -d= -f2-)
  [ -n "$REDIS" ]      && ENV_FLAGS="$ENV_FLAGS,REDIS_URL=$REDIS"
  [ -n "$STRIPE_KEY" ] && ENV_FLAGS="$ENV_FLAGS,STRIPE_SECRET_KEY=$STRIPE_KEY"
  [ -n "$STRIPE_WH" ]  && ENV_FLAGS="$ENV_FLAGS,STRIPE_WEBHOOK_SECRET=$STRIPE_WH"
fi

gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 3 \
  --timeout 3600 \
  --session-affinity \
  --http2 \
  --set-env-vars "$ENV_FLAGS" \
  --quiet

# Get URL
SERVICE_URL=$(gcloud run services describe "$SERVICE" \
  --region "$REGION" --format 'value(status.url)')

echo ""
echo "══════════════════════════════════════════════════"
echo "  ✅ DEPLOYED"
echo "  🌐 $SERVICE_URL"
echo "  🐾 TDog is live."
echo "══════════════════════════════════════════════════"
echo ""

# Smoke test
echo "🧪 Smoke test..."
sleep 3
curl -sf "$SERVICE_URL/health" && echo " ✅ /health OK" || echo " ⚠️  Cold start — try again in 30s"
