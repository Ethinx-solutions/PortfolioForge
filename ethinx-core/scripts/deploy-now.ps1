#!/usr/bin/env pwsh
# ── ETHINX CORE — ONE-SHOT DEPLOY TO GCP CLOUD RUN ──────────────────────────
# Run from: C:\Users\tdogg\Ethinx-PortfolioForge\ethinx-core
# Prerequisites: gcloud CLI installed + authenticated (gcloud auth login)
# ─────────────────────────────────────────────────────────────────────────────

$PROJECT_ID   = "ethinx-portfolioforge"
$SERVICE      = "ethinx-core"
$REGION       = "australia-southeast1"
$REPO         = "ethinx-core"
$IMAGE        = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$SERVICE"

Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🐾 ETHINX CORE — CLOUD RUN DEPLOY"               -ForegroundColor Yellow
Write-Host "  Project : $PROJECT_ID"
Write-Host "  Image   : $IMAGE"
Write-Host "  Region  : $REGION"
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ── SET PROJECT ────────────────────────────────────────────────────────────────
Write-Host "⚙️  Setting GCP project..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID

# ── ENABLE REQUIRED APIS ───────────────────────────────────────────────────────
Write-Host "🔧 Enabling APIs (Cloud Run, Build, Artifact Registry)..." -ForegroundColor Cyan
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com --quiet

# ── ENSURE ARTIFACT REGISTRY REPO ─────────────────────────────────────────────
Write-Host "📦 Checking Artifact Registry repo..." -ForegroundColor Cyan
$repoExists = gcloud artifacts repositories describe $REPO --location=$REGION --project=$PROJECT_ID 2>$null
if (-not $repoExists) {
    Write-Host "   Creating repo $REPO..." -ForegroundColor Yellow
    gcloud artifacts repositories create $REPO `
        --repository-format=docker `
        --location=$REGION `
        --description="ETHINX Core Images" `
        --project=$PROJECT_ID
}

# ── BUILD + PUSH VIA CLOUD BUILD ───────────────────────────────────────────────
Write-Host "🔨 Building container (Google Cloud Build)..." -ForegroundColor Cyan
gcloud builds submit --tag $IMAGE --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check Cloud Build logs in GCP console." -ForegroundColor Red
    exit 1
}

# ── LOAD ENV VARS ──────────────────────────────────────────────────────────────
$envFile = Join-Path $PSScriptRoot "../.env"
$envVars = ""
if (Test-Path $envFile) {
    Get-Content $envFile | Where-Object { $_ -match "^[^#].*=.*" } | ForEach-Object {
        $parts = $_ -split "=", 2
        if ($parts[0] -match "REDIS_URL|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET") {
            $envVars += "$($parts[0])=$($parts[1]),"
        }
    }
    $envVars = $envVars.TrimEnd(",")
}

# ── DEPLOY TO CLOUD RUN ─────────────────────────────────────────────────────────
Write-Host "☁️  Deploying to Cloud Run..." -ForegroundColor Cyan
$deployArgs = @(
    "run", "deploy", $SERVICE,
    "--image", $IMAGE,
    "--platform", "managed",
    "--region", $REGION,
    "--allow-unauthenticated",
    "--port", "3000",
    "--memory", "512Mi",
    "--cpu", "1",
    "--min-instances", "1",
    "--max-instances", "3",
    "--timeout", "3600",
    "--session-affinity",
    "--http2",
    "--quiet"
)
if ($envVars) {
    $deployArgs += @("--set-env-vars", "NODE_ENV=production,$envVars")
} else {
    $deployArgs += @("--set-env-vars", "NODE_ENV=production")
}
& gcloud @deployArgs
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deploy failed. Check Cloud Run logs." -ForegroundColor Red
    exit 1
}

# ── GET SERVICE URL ──────────────────────────────────────────────────────────────
$SERVICE_URL = gcloud run services describe $SERVICE --region $REGION --format "value(status.url)"

Write-Host ""
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ DEPLOYED SUCCESSFULLY"                              -ForegroundColor Green
Write-Host "  🌐 $SERVICE_URL"                                       -ForegroundColor Yellow
Write-Host "  🐾 TDog is live and watching."                        -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# ── SMOKE TEST ───────────────────────────────────────────────────────────────────
Write-Host "🧪 Smoke test → $SERVICE_URL/health" -ForegroundColor Cyan
try {
    $resp = Invoke-WebRequest -Uri "$SERVICE_URL/health" -UseBasicParsing -TimeoutSec 15
    if ($resp.StatusCode -eq 200) {
        Write-Host "   ✅ /health → 200 OK" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  /health → $($resp.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Health check failed (Cold start? Try again in 30s)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Open in browser: $SERVICE_URL" -ForegroundColor Cyan
Start-Process $SERVICE_URL
