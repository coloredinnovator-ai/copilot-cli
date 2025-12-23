# Job Contracts Index

This index provides a comprehensive catalog of all job contracts in this repository, organized by category and function.

## Contract Categories

### Issue Management Contracts

#### 1. [Triage Incoming Issues](./triage-incoming-issues.yml)
- **Contract ID**: JC-TRIAGE-001
- **Purpose**: Automatically label newly opened or reopened issues with 'triage' label
- **Trigger**: issues.opened, issues.reopened, issues.unlabeled
- **Authorization Level**: PUBLIC
- **Original**: `.github/workflows/triage-issues.yml`

#### 2. [Close Invalid Issues](./close-invalid-issues.yml)
- **Contract ID**: JC-CLOSE-INVALID-001
- **Purpose**: Automatically close issues marked as invalid
- **Trigger**: issues.labeled (when label = 'invalid')
- **Authorization Level**: INTERNAL
- **Original**: `.github/workflows/close-invalid.yml`

#### 3. [Close Single-Word Issues](./close-single-word-issues.yml)
- **Contract ID**: JC-CLOSE-SINGLE-001
- **Purpose**: Detect and close low-quality issues with minimal content
- **Trigger**: issues.opened
- **Authorization Level**: INTERNAL
- **Original**: `.github/workflows/close-single-word-issues.yml`

#### 4. [Feature Request Auto-Response](./feature-request-auto-response.yml)
- **Contract ID**: JC-FEATURE-001
- **Purpose**: Provide helpful information when issues are labeled as feature requests
- **Trigger**: issues.labeled (when label = 'feature-request')
- **Authorization Level**: PUBLIC
- **Original**: `.github/workflows/feature-request-comment.yml`

#### 5. [No Response Issue Handler](./no-response-issue-handler.yml)
- **Contract ID**: JC-NO-RESPONSE-001
- **Purpose**: Close issues labeled 'more-info-needed' after period without response
- **Trigger**: schedule (every 6 hours)
- **Authorization Level**: INTERNAL
- **Original**: `.github/workflows/no-response.yml`

#### 6. [Unable to Reproduce Handler](./unable-to-reproduce-handler.yml)
- **Contract ID**: JC-UNABLE-REPRODUCE-001
- **Purpose**: Request additional information for issues that cannot be reproduced
- **Trigger**: issues.labeled (when label = 'unable-to-reproduce')
- **Authorization Level**: INTERNAL
- **Original**: `.github/workflows/unable-to-reproduce-comment.yml`

#### 7. [Issue Close Cleanup](./issue-close-cleanup.yml)
- **Contract ID**: JC-CLOSE-CLEANUP-001
- **Purpose**: Remove triage label when issues are closed
- **Trigger**: issues.closed
- **Authorization Level**: INTERNAL
- **Original**: `.github/workflows/on-issue-close.yml`

#### 8. [Remove Triage Label](./remove-triage-label.yml)
- **Contract ID**: JC-REMOVE-TRIAGE-001
- **Purpose**: Remove triage label when issues receive status labels
- **Trigger**: issues.labeled (specific labels)
- **Authorization Level**: INTERNAL
- **Original**: `.github/workflows/remove-triage-label.yml`

### Maintenance Contracts

#### 9. [Stale Issues Management](./stale-issues-management.yml)
- **Contract ID**: JC-STALE-001
- **Purpose**: Automatically label stale issues for repository health
- **Trigger**: schedule (daily at 1:30 AM UTC)
- **Authorization Level**: INTERNAL
- **Original**: `.github/workflows/stale-issues.yml`

### Distribution and Installation Contracts

#### 10. [WinGet Package Submission](./winget-package-submission.yml)
- **Contract ID**: JC-WINGET-001
- **Purpose**: Submit releases to Windows Package Manager repository
- **Trigger**: release.published
- **Authorization Level**: RESTRICTED
- **Original**: `.github/workflows/winget.yml`

#### 11. [Copilot CLI Installation](./copilot-cli-installation.yml)
- **Contract ID**: JC-INSTALL-001
- **Purpose**: Secure cross-platform installation of GitHub Copilot CLI
- **Trigger**: manual (curl/wget invocation)
- **Authorization Level**: PUBLIC
- **Original**: `install.sh`

## Contract Statistics

### By Authorization Level
- **PUBLIC**: 3 contracts
- **INTERNAL**: 7 contracts
- **RESTRICTED**: 1 contract
- **CONFIDENTIAL**: 0 contracts

### By Trigger Type
- **Event-driven**: 8 contracts
- **Scheduled**: 2 contracts
- **Manual**: 1 contract

### By Function
- **Issue Management**: 8 contracts
- **Maintenance**: 1 contract
- **Distribution**: 2 contracts

## Contract Selection Guide

### When to Use Which Contract

**For Issue Triage:**
- New issues → `triage-incoming-issues.yml`
- Invalid issues → `close-invalid-issues.yml`
- Low-quality issues → `close-single-word-issues.yml`
- Feature requests → `feature-request-auto-response.yml`
- Awaiting information → `no-response-issue-handler.yml`
- Cannot reproduce → `unable-to-reproduce-handler.yml`

**For Issue Cleanup:**
- Closed issues → `issue-close-cleanup.yml`
- Categorized issues → `remove-triage-label.yml`
- Old issues → `stale-issues-management.yml`

**For Distribution:**
- Windows releases → `winget-package-submission.yml`
- User installation → `copilot-cli-installation.yml`

## Migration Status

All human-defined jobs have been successfully migrated to AI-generated job contracts:

| Original File | Status | Contract File |
|--------------|--------|---------------|
| `.github/workflows/triage-issues.yml` | ✅ Migrated | `triage-incoming-issues.yml` |
| `.github/workflows/stale-issues.yml` | ✅ Migrated | `stale-issues-management.yml` |
| `.github/workflows/winget.yml` | ✅ Migrated | `winget-package-submission.yml` |
| `.github/workflows/close-invalid.yml` | ✅ Migrated | `close-invalid-issues.yml` |
| `.github/workflows/close-single-word-issues.yml` | ✅ Migrated | `close-single-word-issues.yml` |
| `.github/workflows/feature-request-comment.yml` | ✅ Migrated | `feature-request-auto-response.yml` |
| `.github/workflows/no-response.yml` | ✅ Migrated | `no-response-issue-handler.yml` |
| `.github/workflows/on-issue-close.yml` | ✅ Migrated | `issue-close-cleanup.yml` |
| `.github/workflows/remove-triage-label.yml` | ✅ Migrated | `remove-triage-label.yml` |
| `.github/workflows/unable-to-reproduce-comment.yml` | ✅ Migrated | `unable-to-reproduce-handler.yml` |
| `install.sh` | ✅ Migrated | `copilot-cli-installation.yml` |

**Total**: 11 of 11 jobs migrated (100%)

## Next Steps

1. **Phase 1 (Current)**: Job contracts defined and documented
2. **Phase 2**: Implement contract executor infrastructure
3. **Phase 3**: Deploy contracts to production
4. **Phase 4**: Monitor and optimize based on metrics
5. **Phase 5**: Expand to additional automation use cases

## Related Documentation

- [Job Contracts System Overview](./README.md)
- [Executor Infrastructure](./EXECUTOR.md)
- [Governance and Security Framework](./GOVERNANCE.md)
- [Canonical Intent README](../../README.md)

## Contributing New Contracts

To add a new job contract:

1. Define human intent clearly (objective, constraints, success criteria)
2. Create YAML file following the schema in `README.md`
3. Specify governance requirements (authorization, compliance)
4. Define security controls (permissions, secrets, sanitization)
5. Implement monitoring (metrics, alerts, logging)
6. Add contract to this index
7. Submit for review based on authorization level
8. Deploy through standard release process

## Support

For questions or issues with job contracts:
- Review contract documentation in this directory
- Consult the canonical README.md for principles
- Contact platform operations for infrastructure issues
- Escalate to security team for security concerns
