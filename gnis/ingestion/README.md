# GNIS Data Ingestion Pipeline

## Overview

The GNIS data ingestion pipeline is an enterprise-grade, API-first system designed to safely and reliably ingest geographic data from external sources into the GNIS infrastructure.

---

## Architecture

```
┌─────────────────┐
│  External APIs  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Connectors    │ ← API clients for external sources
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Validators    │ ← Schema validation & quality checks
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Truth Governor  │ ← Policy enforcement
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Storage   │ ← Accepted records
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Audit Logs    │ ← Immutable audit trail
└─────────────────┘
```

---

## Ingestion Stages

### Stage 1: API Connection
**Location**: `/ingestion/connectors/`

- Connect to external API endpoints
- Authenticate with API keys/tokens
- Handle rate limiting and pagination
- Retry logic for transient failures
- Transform API response to internal format

### Stage 2: Schema Validation
**Location**: `/ingestion/validators/`

- Validate against canonical geo-object schema
- Check required fields presence
- Validate data types and formats
- Ensure geographic coordinate validity
- Calculate data quality metrics

### Stage 3: Truth Governor Review
**Integration**: `/governance/truth_governor.json`

- Check for forbidden actions
- Execute required validations
- Verify compliance rules
- Approve or reject ingestion
- Log decision and reasoning

### Stage 4: Data Acceptance
**Result**: Accepted data stored in system

- Assign UUID to new records
- Set metadata timestamps
- Store in data layer
- Trigger downstream processing
- Update indexes and caches

### Stage 5: Audit Logging
**Requirement**: Complete audit trail

- Log all operations
- Record success/failure
- Capture validation results
- Store provenance information
- Ensure immutability

---

## Pipeline Workflows

### Workflow Types

1. **Real-time Ingestion**
   - Triggered by API webhook
   - Low-latency processing
   - Immediate validation
   - Use case: Critical updates

2. **Batch Ingestion**
   - Scheduled periodic runs
   - Bulk data processing
   - Optimized throughput
   - Use case: Census data, periodic updates

3. **On-Demand Ingestion**
   - Manual trigger via admin interface
   - Used for one-time imports
   - Full validation required
   - Use case: New data source onboarding

---

## Supported Data Sources

### Government Sources
- **US Census Bureau**: Population, demographics, boundaries
- **USGS GNIS**: Geographic names and features
- **TIGER/Line**: Geographic boundaries and roads
- **NOAA**: Climate and weather data

### Commercial Sources
- **OpenStreetMap**: Crowdsourced geographic data
- **Google Places API**: Points of interest
- **Esri**: Commercial GIS datasets

### Custom Sources
- API endpoints conforming to GNIS API specification
- Authentication via OAuth 2.0 or API keys
- Must provide data in GeoJSON or compatible format

---

## Data Quality Requirements

### Minimum Thresholds

| Metric | Minimum | Recommended | Excellent |
|--------|---------|-------------|-----------|
| Completeness | 90% | 95% | 98% |
| Accuracy | 90% | 95% | 99% |
| Consistency | 90% | 99% | 100% |

Records below minimum thresholds are **rejected**.

### Quality Calculation

```
Completeness = Required fields present / Total required fields
Accuracy = Valid fields / Total fields
Consistency = Consistency checks passed / Total checks
Overall Score = (Completeness × 0.35) + (Accuracy × 0.35) + (Consistency × 0.30)
```

---

## Error Handling

### Error Categories

1. **Connection Errors**
   - Action: Retry with exponential backoff
   - Max retries: 3
   - Alert: After final failure

2. **Authentication Errors**
   - Action: Check credentials, rotate keys
   - Max retries: 1
   - Alert: Immediate

3. **Validation Errors**
   - Action: Reject record, log details
   - Max retries: 0
   - Alert: If rate exceeds threshold

4. **Truth Governor Rejection**
   - Action: Block ingestion, create incident
   - Max retries: 0 (policy violation)
   - Alert: Immediate (L3/L4)

### Retry Strategy

```
Delay = BaseDelay × (2 ^ AttemptNumber) + Jitter
BaseDelay = 1 second
MaxAttempts = 3
MaxDelay = 60 seconds
```

---

## Monitoring and Observability

### Key Metrics

- **Ingestion Rate**: Records per second
- **Success Rate**: Successful ingestions / Total attempts
- **Validation Pass Rate**: Records passing validation
- **Average Latency**: Time from API call to storage
- **Error Rate**: Failed ingestions / Total attempts
- **Queue Depth**: Pending records in pipeline

### Alerts

| Condition | Threshold | Severity | Action |
|-----------|-----------|----------|--------|
| High error rate | >5% | WARNING | Investigate |
| Connection failures | >10/hour | ERROR | Check API status |
| Truth Governor rejections | Any L3/L4 | CRITICAL | Immediate response |
| Queue depth | >10000 | WARNING | Scale up |
| Latency | >5s average | WARNING | Performance review |

---

## Security Considerations

### API Keys and Secrets
- Store in environment variables or secret managers
- Rotate keys every 90 days
- Use separate keys for dev/staging/prod
- Never log API keys

### Data in Transit
- All API calls over HTTPS/TLS 1.3
- Certificate pinning for critical sources
- Validate SSL certificates

### Data at Rest
- Encrypt sensitive data fields
- Use field-level encryption for PII
- Maintain encryption key hierarchy

### Access Control
- Ingestion service runs with minimal privileges
- Service accounts for API access
- Role-based access to admin functions
- Audit all administrative actions

---

## Configuration

### Environment Variables

```bash
# API Endpoints
CENSUS_API_URL=https://api.census.gov/data
GNIS_API_URL=https://geonames.usgs.gov/apex/f

# Authentication
CENSUS_API_KEY=<secret>
GNIS_API_KEY=<secret>
OSM_API_KEY=<secret>

# Pipeline Settings
INGESTION_BATCH_SIZE=1000
INGESTION_CONCURRENCY=10
VALIDATION_TIMEOUT=30
MAX_RETRY_ATTEMPTS=3

# Quality Thresholds
MIN_COMPLETENESS=0.90
MIN_ACCURACY=0.90
MIN_CONSISTENCY=0.90

# Monitoring
METRICS_ENDPOINT=https://metrics.internal/ingest
ALERT_WEBHOOK=https://alerts.internal/webhook
```

---

## Development and Testing

### Local Development

```bash
# Set up environment
cp .env.example .env
# Edit .env with test API keys

# Install dependencies
npm install

# Run validators locally
npm run validate-schema test-data.json

# Test connector
npm run test-connector census

# Run full pipeline locally
npm run pipeline:dev
```

### Testing

```bash
# Unit tests
npm run test:unit

# Integration tests (requires test API keys)
npm run test:integration

# Validation tests
npm run test:validation

# End-to-end pipeline test
npm run test:e2e
```

---

## Deployment

### GitHub Actions Pipeline

```yaml
name: Deploy Ingestion Pipeline
on:
  push:
    branches: [main]
    paths: [gnis/ingestion/**]

jobs:
  deploy:
    - Test connectors
    - Validate schemas
    - Run security scan
    - Deploy to staging
    - Run smoke tests
    - Deploy to production
```

### Multi-Cloud Deployment

- **Azure Functions**: Serverless ingestion workers
- **GCP Cloud Functions**: Parallel processing
- **AWS Lambda**: Backup/fallback deployment

---

## Troubleshooting

### Common Issues

1. **"Schema Validation Failed"**
   - Check incoming data format
   - Verify required fields present
   - Review validation error details

2. **"Truth Governor Rejection"**
   - Review rejection reason in logs
   - Check compliance with governance policies
   - Request exception if justified

3. **"API Rate Limit Exceeded"**
   - Reduce ingestion rate
   - Increase delay between calls
   - Request higher rate limit from provider

4. **"Connection Timeout"**
   - Check network connectivity
   - Verify API endpoint status
   - Increase timeout settings

---

## Performance Optimization

### Best Practices

1. **Batch Processing**: Group records for efficient processing
2. **Parallel Validation**: Validate multiple records concurrently
3. **Caching**: Cache frequently accessed reference data
4. **Connection Pooling**: Reuse HTTP connections
5. **Compression**: Enable gzip for API responses

### Scaling

- **Horizontal**: Add more ingestion workers
- **Vertical**: Increase worker resources
- **Queue-Based**: Use message queue for async processing
- **Sharding**: Partition data by geographic region

---

## Compliance and Audit

### Audit Requirements

Every ingestion must log:
- Source API endpoint
- Request timestamp
- Response data (sanitized)
- Validation results
- Truth Governor decision
- Final acceptance/rejection

### Retention

- Audit logs: 7 years minimum
- Data lineage: Perpetual
- Error logs: 1 year

---

## API Documentation

See `/docs/api/ingestion-api.md` for detailed API specifications.

---

**Maintained by**: Data Engineering Team  
**Last Updated**: 2025-12-23  
**Status**: ✅ Production-Ready
