# Azure Static Web Apps Deployment

## Overview

Deploy GNIS infrastructure to Azure Static Web Apps with integrated Azure Functions for serverless API endpoints.

## Prerequisites

- Azure subscription
- Azure CLI installed (`az`)
- Azure Static Web Apps extension

## Setup

### 1. Create Azure Resources

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name gnis-enterprise-rg \
  --location eastus

# Create static web app
az staticwebapp create \
  --name gnis-enterprise \
  --resource-group gnis-enterprise-rg \
  --source https://github.com/coloredinnovator-ai/copilot-cli \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "out" \
  --login-with-github
```

### 2. Configure Environment Variables

```bash
# Set application settings (environment variables)
az staticwebapp appsettings set \
  --name gnis-enterprise \
  --resource-group gnis-enterprise-rg \
  --setting-names \
    CENSUS_API_KEY=$CENSUS_API_KEY \
    GNIS_API_KEY=$GNIS_API_KEY \
    TRUTH_GOVERNOR_SECRET=$TRUTH_GOVERNOR_SECRET
```

### 3. Configure Custom Domain

```bash
# Add custom domain
az staticwebapp hostname set \
  --name gnis-enterprise \
  --resource-group gnis-enterprise-rg \
  --hostname gnis.yourdomain.com
```

## Deployment

### Automatic Deployment

GitHub Actions workflow automatically deploys on push to `main`:

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: "api"
          output_location: "out"
```

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy using Azure CLI
az staticwebapp deploy \
  --name gnis-enterprise \
  --resource-group gnis-enterprise-rg \
  --source-path ./out
```

## API Functions

Place Azure Functions in `/api` directory:

```
/api
├── ingestion/
│   ├── function.json
│   └── index.ts
├── validation/
│   ├── function.json
│   └── index.ts
└── host.json
```

## Configuration Files

### staticwebapp.config.json

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/admin/*",
      "allowedRoles": ["admin"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/assets/*"]
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html",
      "statusCode": 404
    }
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'"
  }
}
```

## Features

- ✅ Global CDN distribution
- ✅ Automatic SSL/TLS
- ✅ Built-in authentication
- ✅ Azure Functions integration
- ✅ Custom domains
- ✅ Staging environments
- ✅ CI/CD via GitHub Actions

## Monitoring

```bash
# View logs
az monitor activity-log list \
  --resource-group gnis-enterprise-rg \
  --start-time 2025-12-23

# View metrics
az monitor metrics list \
  --resource gnis-enterprise \
  --resource-group gnis-enterprise-rg \
  --metric-names Requests
```

## Security

- Enable Azure AD authentication
- Configure RBAC for admin access
- Use Azure Key Vault for secrets
- Enable Application Insights for monitoring

## Cost Optimization

- Free tier: 100GB bandwidth/month
- Standard tier: $9/month + bandwidth
- Azure Functions: Consumption plan (pay-per-execution)

---

**Status**: ✅ Production-Ready  
**Last Updated**: 2025-12-23  
**Maintained by**: Cloud Infrastructure Team
