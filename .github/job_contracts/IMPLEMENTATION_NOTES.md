# Implementation Notes for Contract Executor

## Overview

This document contains important implementation notes for the contract executor when translating job contracts into executable workflows.

## Known Contract-to-Implementation Mappings

### 1. PowerShell Logic Translation

**Contract**: `winget-package-submission.yml`

**Issue**: PowerShell conditional logic in contract uses GitHub Actions syntax which needs translation.

**Implementation Note**: 
```powershell
# Contract documents intent:
$packageId = if ('${{ !github.event.release.prerelease }}' -eq 'true') { ... }

# Executor should implement as:
$packageId = if (-not ${{ github.event.release.prerelease }}) {
  'GitHub.Copilot'
} else {
  'GitHub.Copilot.Prerelease'
}

# And version assignment:
$packageVersion = '${{ github.event.release.tag_name }}'
```

### 2. Version Normalization

**Contract**: `copilot-cli-installation.yml`

**Issue**: Version normalization logic needs to be explicitly implemented.

**Implementation Note**:
```bash
# Contract documents intent to normalize version
# Executor must implement:
if [ -n "$VERSION" ]; then
  case "$VERSION" in
    v*) ;;
    *) VERSION="v$VERSION" ;;
  esac
  DOWNLOAD_URL="..."
fi
```

### 3. Shell Input Escaping

**Contract**: `close-single-word-issues.yml`

**Issue**: GitHub context values need proper escaping when used in shell.

**Implementation Note**:
```bash
# Contract shows logical flow
# Executor must implement with proper escaping:
TITLE=$(printf '%s' '${{ github.event.issue.title }}' | cat)
BODY=$(printf '%s' '${{ github.event.issue.body }}' | cat)
# Or use GitHub Actions built-in input handling
```

### 4. Long Comment Templates

**Contracts**: `unable-to-reproduce-handler.yml`, `feature-request-auto-response.yml`

**Issue**: Large comment bodies are embedded in contracts.

**Implementation Note**:
Executor should support template references:
```yaml
# Contract can document full text for clarity
# Executor can reference external templates:
command: gh issue comment "$NUMBER" --body-file .github/templates/unable-to-reproduce.md
```

## Security Considerations

### Input Sanitization
The executor MUST implement the sanitization rules declared in contracts:
- `sanitize-issue-content`: Remove/escape shell metacharacters
- `validate-issue-number`: Ensure positive integer
- `sanitize-label-names`: Alphanumeric and hyphens only
- `validate-download-urls`: Whitelist trusted domains
- `sanitize-comment-markdown`: Remove script tags, validate markdown
- `validate-version-strings`: Semantic version format
- `prevent-directory-traversal`: No .. in paths

### Secret Handling
- Secrets MUST never be logged
- Use GitHub Actions secret masking
- Validate secret availability before execution
- Rotate secrets on schedule (90 days)

## Translation Best Practices

### 1. Preserve Intent
The contract documents WHAT should happen. The executor determines HOW:
- Contract: "Close issue with explanation"
- Executor: Implements with proper error handling, retries, logging

### 2. Add Safety Rails
Executor should add protections not explicitly in contracts:
- Rate limiting for API calls
- Timeout enforcement
- Resource limit checks
- Graceful degradation

### 3. Enhance Observability
Beyond contract monitoring requirements:
- Detailed execution traces
- Performance profiling
- Resource usage tracking
- User-facing status updates

### 4. Implement Rollback
Contracts define rollback strategy, executor implements:
- State capture before execution
- Incremental rollback steps
- Validation after rollback
- Notification on rollback

## GitHub Actions Integration

### Mapping Contract Triggers to Workflow Triggers

```yaml
# Contract:
triggers:
  - type: event
    configuration:
      events: [issues.opened, issues.reopened]

# GitHub Actions:
on:
  issues:
    types: [opened, reopened]
```

### Mapping Contract Steps to Actions Steps

```yaml
# Contract:
execution:
  steps:
    - id: label_issues
      name: Add label
      action: github-cli-command
      configuration:
        command: gh issue edit "$NUMBER" --add-label "triage"

# GitHub Actions:
jobs:
  label_issues:
    runs-on: ubuntu-latest
    steps:
      - name: Add label
        run: gh issue edit "$NUMBER" --add-label "triage"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NUMBER: ${{ github.event.issue.number }}
```

### Mapping Contract Security to Workflow Permissions

```yaml
# Contract:
security:
  permissions_needed: [issues:write]

# GitHub Actions:
permissions:
  issues: write
```

## Testing Executor Implementation

### Unit Tests
- Test each contract parser component
- Validate schema compliance checking
- Test security scanning logic
- Verify rollback procedures

### Integration Tests
- Test contract-to-workflow translation
- Validate GitHub Actions integration
- Test with actual GitHub API (staging)
- Verify audit logging

### End-to-End Tests
- Execute real contracts in test environment
- Validate complete lifecycle
- Test failure scenarios
- Verify monitoring and alerting

## Future Enhancements

### Dynamic Contract Generation
Contracts could be generated from high-level intent:
```yaml
intent:
  goal: "Triage new issues"
  constraints: ["No manual intervention", "< 30 second latency"]
  
# AI generates complete contract with optimal implementation
```

### Contract Versioning
Support multiple contract versions simultaneously:
```yaml
job_contract:
  name: triage-issues
  version: 2.0.0
  backward_compatible_with: [1.x.x]
```

### Contract Composition
Allow contracts to reference and compose others:
```yaml
job_contract:
  name: complete-issue-workflow
  includes:
    - triage-incoming-issues
    - close-invalid-issues
```

## Maintenance

### Regular Review
- Quarterly: Review all contracts for optimization
- Monthly: Update security thresholds
- Weekly: Review execution metrics
- Daily: Monitor alerts and failures

### Contract Updates
When updating contracts:
1. Increment version number
2. Document changes in migration notes
3. Test with executor in staging
4. Deploy with gradual rollout
5. Monitor for regressions

## Support

For executor implementation questions:
- Review this document
- Consult EXECUTOR.md for architecture
- Check GOVERNANCE.md for security requirements
- Reference original workflow files for behavior

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-23  
**Maintained By**: Platform Operations Team
