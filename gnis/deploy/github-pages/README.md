# GitHub Pages Deployment Configuration

## Overview

This configuration enables static site deployment to GitHub Pages for public-facing GNIS dashboards.

## Setup

1. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions
   - Branch: `gh-pages` (auto-created)

2. **Configure Deployment Workflow**:
   - Located in `.github/workflows/deploy-github-pages.yml`
   - Automatically deploys on push to `main` branch

3. **Custom Domain** (optional):
   - Add `CNAME` file with your domain
   - Configure DNS A records to GitHub Pages IPs

## Build Process

```bash
# Build static site
npm run build
next export

# Deploy to GitHub Pages
gh-pages -d out
```

## Configuration Files

### next.config.js
```javascript
module.exports = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/gnis' : '',
  images: {
    unoptimized: true,
  },
}
```

### package.json scripts
```json
{
  "deploy:github": "next build && next export && gh-pages -d out"
}
```

## Environment Variables

Set in GitHub Secrets:
- `CENSUS_API_KEY`: Census Bureau API key
- `GNIS_API_KEY`: USGS GNIS API key

## URL Structure

- Production: `https://yourusername.github.io/copilot-cli/`
- Custom domain: `https://gnis.yourdomain.com/`

## Features

- ✅ Static site generation
- ✅ CDN-backed (GitHub's global CDN)
- ✅ Free hosting for public repositories
- ✅ Automatic HTTPS
- ✅ Zero server maintenance

## Limitations

- Static content only (no server-side rendering)
- Client-side API calls only
- Limited to 1GB repository size
- 100GB bandwidth per month (soft limit)

## Troubleshooting

### Build Fails
```bash
# Check build locally
npm run build
next export
```

### 404 Errors
- Verify `basePath` in `next.config.js`
- Check that paths are relative

### API Errors
- Ensure API keys are set in GitHub Secrets
- Verify CORS settings on external APIs

---

**Status**: ✅ Production-Ready  
**Last Updated**: 2025-12-23  
**Maintained by**: DevOps Team
