# Google Cloud Platform Deployment

## Overview

Deploy GNIS infrastructure to Google Cloud Platform using Cloud Run for containerized deployments and Cloud Storage for static assets.

## Prerequisites

- GCP account with billing enabled
- `gcloud` CLI installed
- Docker installed
- GCP project created

## Setup

### 1. Initialize GCP Project

```bash
# Login to GCP
gcloud auth login

# Set project
gcloud config set project gnis-enterprise-project

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  storage-api.googleapis.com \
  secretmanager.googleapis.com
```

### 2. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create gnis-deployer \
  --description="GNIS deployment service account" \
  --display-name="GNIS Deployer"

# Grant permissions
gcloud projects add-iam-policy-binding gnis-enterprise-project \
  --member="serviceAccount:gnis-deployer@gnis-enterprise-project.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding gnis-enterprise-project \
  --member="serviceAccount:gnis-deployer@gnis-enterprise-project.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=gnis-deployer@gnis-enterprise-project.iam.gserviceaccount.com
```

### 3. Configure Secrets

```bash
# Create secrets in Secret Manager
echo -n "$CENSUS_API_KEY" | gcloud secrets create census-api-key --data-file=-
echo -n "$GNIS_API_KEY" | gcloud secrets create gnis-api-key --data-file=-
echo -n "$TRUTH_GOVERNOR_SECRET" | gcloud secrets create truth-governor-secret --data-file=-
```

### 4. Create Cloud Storage Bucket

```bash
# Create bucket for static assets
gcloud storage buckets create gs://gnis-enterprise-storage \
  --location=us-central1 \
  --uniform-bucket-level-access

# Make bucket public (for public assets)
gcloud storage buckets add-iam-policy-binding gs://gnis-enterprise-storage \
  --member=allUsers \
  --role=roles/storage.objectViewer
```

## Deployment

### Build Docker Container

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
```

### Deploy to Cloud Run

```bash
# Build and push container
gcloud builds submit --tag gcr.io/gnis-enterprise-project/gnis-app

# Deploy to Cloud Run
gcloud run deploy gnis-enterprise \
  --image gcr.io/gnis-enterprise-project/gnis-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="CENSUS_API_KEY=census-api-key:latest,GNIS_API_KEY=gnis-api-key:latest" \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 100 \
  --concurrency 80
```

### Deploy Static Assets

```bash
# Build static assets
npm run build
next export

# Upload to Cloud Storage
gcloud storage cp -r ./out/* gs://gnis-enterprise-storage/

# Set cache control
gcloud storage objects update gs://gnis-enterprise-storage/** \
  --cache-control="public, max-age=3600"
```

## CI/CD with Cloud Build

Create `cloudbuild.yaml`:

```yaml
steps:
  # Build
  - name: 'node:18'
    entrypoint: npm
    args: ['ci']
  
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'build']
  
  # Test
  - name: 'node:18'
    entrypoint: npm
    args: ['test']
  
  # Build container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/gnis-app:$COMMIT_SHA', '.']
  
  # Push container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/gnis-app:$COMMIT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'gnis-enterprise'
      - '--image=gcr.io/$PROJECT_ID/gnis-app:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'

images:
  - 'gcr.io/$PROJECT_ID/gnis-app:$COMMIT_SHA'
```

### Trigger Builds on Git Push

```bash
# Create build trigger
gcloud builds triggers create github \
  --repo-name=copilot-cli \
  --repo-owner=coloredinnovator-ai \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## Custom Domain

```bash
# Map custom domain to Cloud Run service
gcloud run domain-mappings create \
  --service gnis-enterprise \
  --domain gnis.yourdomain.com \
  --region us-central1
```

## Load Balancing and CDN

```bash
# Create backend service
gcloud compute backend-services create gnis-backend \
  --global

# Create URL map
gcloud compute url-maps create gnis-lb \
  --default-service gnis-backend

# Create HTTPS proxy
gcloud compute target-https-proxies create gnis-https-proxy \
  --url-map gnis-lb

# Create forwarding rule
gcloud compute forwarding-rules create gnis-https-rule \
  --global \
  --target-https-proxy gnis-https-proxy \
  --ports 443

# Enable Cloud CDN
gcloud compute backend-services update gnis-backend \
  --enable-cdn \
  --global
```

## Monitoring

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gnis-enterprise" --limit 50

# View metrics
gcloud monitoring dashboards create --config-from-file=dashboard.json
```

## Features

- ✅ Fully managed containerized deployment
- ✅ Auto-scaling (0 to 1000+ instances)
- ✅ Pay-per-request pricing
- ✅ Cloud CDN integration
- ✅ Global load balancing
- ✅ Secret Manager integration
- ✅ Cloud Build CI/CD

## Cost Optimization

- Cloud Run: $0.00002400 per vCPU-second
- Cloud Storage: $0.020 per GB per month
- Cloud CDN: $0.08-0.20 per GB (varies by region)
- Free tier: 2 million requests/month

---

**Status**: ✅ Production-Ready  
**Last Updated**: 2025-12-23  
**Maintained by**: Cloud Infrastructure Team
