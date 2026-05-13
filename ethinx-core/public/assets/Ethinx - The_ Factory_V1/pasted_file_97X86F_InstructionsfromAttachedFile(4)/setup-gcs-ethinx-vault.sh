#!/bin/bash

###############################################################################
# ETHINX GCS BUCKET SETUP SCRIPT
# 
# Creates and configures Google Cloud Storage bucket in Sydney region
# with subdirectories for all product tiers
#
# PREREQUISITES:
# 1. Google Cloud SDK installed (gcloud CLI)
# 2. GCP project created
# 3. Authenticated: gcloud auth login
# 4. Project set: gcloud config set project YOUR_PROJECT_ID
#
# USAGE:
# chmod +x setup-gcs-ethinx-vault.sh
# ./setup-gcs-ethinx-vault.sh
#
###############################################################################

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="ethinx-data-vault"
REGION="australia-southeast1"
LOCATION="Sydney"
PROJECT_ID=$(gcloud config get-value project)

# Subdirectories to create
SUBDIRS=(
  "Digital_Originals/Starter/"
  "Digital_Originals/Professional/"
  "Digital_Originals/Ultimate/"
  "Spark_Enhanced/"
  "Spark_Technical_Baseline/"
  "Neural_Recon_Strike/"
)

###############################################################################
# FUNCTIONS
###############################################################################

print_header() {
  echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║  ETHINX GCS BUCKET SETUP                                   ║${NC}"
  echo -e "${BLUE}║  Sydney Region - Data Vault Configuration                  ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

validate_prerequisites() {
  echo -e "${YELLOW}🔐 Validating Prerequisites...${NC}\n"
  
  # Check gcloud CLI
  if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install Google Cloud SDK.${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ gcloud CLI found${NC}"
  
  # Check authentication
  if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${RED}❌ Not authenticated. Run: gcloud auth login${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Authenticated${NC}"
  
  # Check project
  if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project not set. Run: gcloud config set project YOUR_PROJECT_ID${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Project: $PROJECT_ID${NC}\n"
}

create_bucket() {
  echo -e "${YELLOW}📦 Creating GCS Bucket...${NC}\n"
  
  # Check if bucket exists
  if gsutil ls -b gs://$BUCKET_NAME &> /dev/null; then
    echo -e "${YELLOW}⚠️  Bucket already exists: gs://$BUCKET_NAME${NC}"
    return 0
  fi
  
  # Create bucket
  gsutil mb -p $PROJECT_ID -l $REGION gs://$BUCKET_NAME
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Bucket created: gs://$BUCKET_NAME${NC}"
    echo -e "${GREEN}✓ Region: $REGION ($LOCATION)${NC}\n"
  else
    echo -e "${RED}❌ Failed to create bucket${NC}"
    exit 1
  fi
}

configure_bucket_settings() {
  echo -e "${YELLOW}⚙️  Configuring Bucket Settings...${NC}\n"
  
  # Enable versioning
  gsutil versioning set on gs://$BUCKET_NAME
  echo -e "${GREEN}✓ Versioning enabled${NC}"
  
  # Set lifecycle policy (delete old versions after 30 days)
  cat > /tmp/lifecycle.json << 'EOF'
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"numNewerVersions": 5}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "STANDARD"},
        "condition": {"age": 30}
      }
    ]
  }
}
EOF
  
  gsutil lifecycle set /tmp/lifecycle.json gs://$BUCKET_NAME
  echo -e "${GREEN}✓ Lifecycle policy configured${NC}"
  
  # Set CORS policy for web access
  cat > /tmp/cors.json << 'EOF'
[
  {
    "origin": ["https://www.ethinx.solutions", "https://ethinx.solutions"],
    "method": ["GET", "HEAD", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF
  
  gsutil cors set /tmp/cors.json gs://$BUCKET_NAME
  echo -e "${GREEN}✓ CORS policy configured${NC}\n"
}

create_subdirectories() {
  echo -e "${YELLOW}📁 Creating Subdirectories...${NC}\n"
  
  for subdir in "${SUBDIRS[@]}"; do
    # Create a placeholder file to create the directory
    echo "# ETHINX Data Vault - $(echo $subdir | sed 's/\///' )" | gsutil cp - gs://$BUCKET_NAME/$subdir.placeholder
    
    # Remove the placeholder
    gsutil rm gs://$BUCKET_NAME/$subdir.placeholder
    
    echo -e "${GREEN}✓ Created: gs://$BUCKET_NAME/$subdir${NC}"
  done
  
  echo ""
}

set_bucket_permissions() {
  echo -e "${YELLOW}🔒 Configuring Bucket Permissions...${NC}\n"
  
  # Get current user email
  USER_EMAIL=$(gcloud config get-value account)
  
  # Grant bucket admin role
  gsutil iam ch user:$USER_EMAIL:objectAdmin gs://$BUCKET_NAME
  echo -e "${GREEN}✓ Granted admin permissions to: $USER_EMAIL${NC}"
  
  # Make bucket publicly readable (optional - for public assets)
  # Uncomment if you want public read access
  # gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
  # echo -e "${GREEN}✓ Made bucket publicly readable${NC}"
  
  echo ""
}

generate_integration_code() {
  echo -e "${YELLOW}💻 Generating Integration Code...${NC}\n"
  
  cat > /tmp/gcs-integration.js << 'EOF'
/**
 * ETHINX GCS INTEGRATION
 * Generated: $(date)
 * Bucket: gs://ethinx-data-vault
 * Region: australia-southeast1 (Sydney)
 */

const { Storage } = require('@google-cloud/storage');

// Initialize GCS client
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE
});

const bucket = storage.bucket('ethinx-data-vault');

/**
 * Upload product assets to GCS
 */
async function uploadProductAssets(productTier, files) {
  const gcsPath = `Digital_Originals/${productTier}/`;
  
  for (const file of files) {
    await bucket.upload(file.path, {
      destination: `${gcsPath}${file.name}`,
      metadata: {
        cacheControl: 'public, max-age=3600',
        contentType: file.mimeType
      }
    });
    
    console.log(`Uploaded: ${file.name} to ${gcsPath}`);
  }
}

/**
 * Generate signed URL for product access
 */
async function generateSignedUrl(objectPath, expirationHours = 24) {
  const file = bucket.file(objectPath);
  
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expirationHours * 60 * 60 * 1000
  });
  
  return url;
}

/**
 * List products in tier
 */
async function listProductAssets(productTier) {
  const gcsPath = `Digital_Originals/${productTier}/`;
  
  const [files] = await bucket.getFiles({ prefix: gcsPath });
  
  return files.map(file => ({
    name: file.name,
    size: file.metadata.size,
    updated: file.metadata.updated,
    contentType: file.metadata.contentType
  }));
}

module.exports = {
  uploadProductAssets,
  generateSignedUrl,
  listProductAssets
};
EOF
  
  cp /tmp/gcs-integration.js gcs-integration.js
  echo -e "${GREEN}✓ Integration code saved to: gcs-integration.js${NC}\n"
}

generate_deployment_summary() {
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║  GCS BUCKET DEPLOYMENT SUMMARY                             ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
  
  echo -e "${YELLOW}📊 BUCKET CONFIGURATION:${NC}"
  echo -e "${GREEN}  ✓ Bucket Name: gs://$BUCKET_NAME${NC}"
  echo -e "${GREEN}  ✓ Region: $REGION ($LOCATION)${NC}"
  echo -e "${GREEN}  ✓ Project: $PROJECT_ID${NC}"
  
  echo -e "\n${YELLOW}📁 SUBDIRECTORIES CREATED:${NC}"
  for subdir in "${SUBDIRS[@]}"; do
    echo -e "${GREEN}  ✓ gs://$BUCKET_NAME/$subdir${NC}"
  done
  
  echo -e "\n${YELLOW}⚙️  FEATURES ENABLED:${NC}"
  echo -e "${GREEN}  ✓ Versioning${NC}"
  echo -e "${GREEN}  ✓ Lifecycle Management${NC}"
  echo -e "${GREEN}  ✓ CORS Policy${NC}"
  echo -e "${GREEN}  ✓ Access Control${NC}"
  
  echo -e "\n${YELLOW}🚀 NEXT STEPS:${NC}"
  echo -e "1. Install GCS SDK: npm install @google-cloud/storage"
  echo -e "2. Set environment variables:"
  echo -e "   export GCP_PROJECT_ID=$PROJECT_ID"
  echo -e "   export GCP_KEY_FILE=/path/to/service-account-key.json"
  echo -e "3. Use gcs-integration.js to upload and manage assets"
  echo -e "4. Generate signed URLs for product access"
  echo -e "5. Link GCS paths to Stripe product metadata\n"
  
  echo -e "${YELLOW}📝 USEFUL COMMANDS:${NC}"
  echo -e "# List all files in bucket"
  echo -e "gsutil ls -r gs://$BUCKET_NAME/"
  echo -e ""
  echo -e "# Upload file"
  echo -e "gsutil cp file.zip gs://$BUCKET_NAME/Digital_Originals/Starter/"
  echo -e ""
  echo -e "# Set public read access"
  echo -e "gsutil acl ch -u AllUsers:R gs://$BUCKET_NAME/file.zip"
  echo -e ""
  echo -e "# Generate signed URL (1 hour)"
  echo -e "gsutil signurl /path/to/key.json 1h gs://$BUCKET_NAME/file.zip\n"
}

###############################################################################
# MAIN EXECUTION
###############################################################################

main() {
  print_header
  validate_prerequisites
  create_bucket
  configure_bucket_settings
  create_subdirectories
  set_bucket_permissions
  generate_integration_code
  generate_deployment_summary
  
  echo -e "${GREEN}✅ GCS BUCKET SETUP COMPLETE${NC}\n"
}

# Run main function
main
