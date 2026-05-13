#!/bin/bash
# ─── ETHINX CORE — GCLOUD CLI SETUP ───────────────────
# Run this ONCE in WSL if gcloud is not installed
# Purpose: Installs gcloud CLI and authenticates you

set -e

echo "🔍 Checking for gcloud..."
if command -v gcloud &> /dev/null; then
  echo "✅ gcloud already installed: $(gcloud --version 2>&1 | head -1)"
  echo "Current project: $(gcloud config get-value project 2>/dev/null)"
  exit 0
fi

echo "📦 Installing Google Cloud CLI..."
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates gnupg curl

curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg

echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | \
  sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list

sudo apt-get update && sudo apt-get install -y google-cloud-cli

echo ""
echo "✅ gcloud installed. Now run:"
echo "   gcloud init"
echo "   gcloud auth login"
echo ""
echo "Then set your project:"
echo "   gcloud config set project YOUR_PROJECT_ID"
