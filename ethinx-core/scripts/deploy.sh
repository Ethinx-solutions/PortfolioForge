#!/bin/bash
# ─── ETHINX CORE — ARTIFACT REGISTRY + CLOUD RUN DEPLOY ──
set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
SERVICE="ethinx-core"
REGION="australia-southeast1"
REPO="ethinx-core"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}"

if [ -z "$PROJECT_ID" ]; then
  echo "❌ No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "🚀 Deploying ETHINX Core"
echo "   Project:  $PROJECT_ID"
echo "   Image:    $IMAGE"
echo "   Region:   $REGION"
echo ""

# ── ENABLE APIS ────────────────────────────────────────
echo "🔧 Enabling APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  --quiet

# ── CREATE ARTIFACT REGISTRY REPO (if not exists) ──────
echo "📦 Ensuring Artifact Registry repo..."
gcloud artifacts repositories describe "$REPO" \
  --location="$REGION" \
  --project="$PROJECT_ID" 2>/dev/null || \
gcloud artifacts repositories create "$REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="ETHINX Core Images" \
  --project="$PROJECT_ID"

# ── BUILD + PUSH ───────────────────────────────────────
echo "📦 Building container image..."
gcloud builds submit --tag "$IMAGE" --quiet

# ── DEPLOY TO CLOUD RUN ────────────────────────────────
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars "NODE_ENV=production,REDIS_URL=${REDIS_URL},STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY},STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}" \
  --quiet

# ── GET SERVICE URL ────────────────────────────────────
SERVICE_URL=$(gcloud run services describe "$SERVICE" \
  --region "$REGION" \
  --format 'value(status.url)')

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ ETHINX CORE DEPLOYED"
echo "  🌐 URL: $SERVICE_URL"
echo "  📍 Region: $REGION"
echo "═══════════════════════════════════════════════════"
