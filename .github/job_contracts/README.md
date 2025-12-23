# Job Contracts System

## Overview

This directory contains AI-generated job contracts that define all automated tasks, workflows, and operations in this repository. This system implements the **"Humans Define Law"** directive from the canonical README.

## Humans Define Law

The fundamental principle is:
- **Humans define the LAW** (objectives, constraints, governance)
- **AI generates the CONTRACT** (implementation, execution, automation)

Humans specify WHAT needs to be done and WHY. AI determines HOW to do it efficiently and securely.

## Job Contract Schema

Every job contract follows this YAML structure:

```yaml
job_contract:
  name: <descriptive-job-name>
  version: <semantic-version>
  
  metadata:
    created_by: <human-author>
    created_at: <ISO-8601-timestamp>
    last_modified: <ISO-8601-timestamp>
    contract_id: <unique-identifier>
    tags: [<tag1>, <tag2>]
  
  governance:
    authorization_level: <public|internal|restricted|confidential>
    requires_approval: <boolean>
    approvers: [<github-username>]
    compliance_frameworks: [<framework-name>]
    audit_logging: <boolean>
  
  human_intent:
    objective: <clear-statement-of-purpose>
    success_criteria: [<criterion1>, <criterion2>]
    constraints: [<constraint1>, <constraint2>]
    business_value: <explanation>
  
  ai_implementation:
    execution_strategy: <description>
    technology_stack: [<tech1>, <tech2>]
    resources_required:
      compute: <description>
      storage: <description>
      network: <description>
    estimated_duration: <time-estimate>
  
  triggers:
    - type: <schedule|webhook|manual|event>
      configuration:
        <trigger-specific-config>
  
  inputs:
    - name: <input-name>
      type: <string|number|boolean|object>
      required: <boolean>
      default: <default-value>
      description: <explanation>
      validation:
        pattern: <regex>
        constraints: [<constraint>]
  
  execution:
    steps:
      - id: <step-id>
        name: <step-name>
        action: <action-type>
        configuration:
          <step-specific-config>
        dependencies: [<step-id>]
        error_handling:
          retry_policy:
            max_attempts: <number>
            backoff_strategy: <linear|exponential>
          on_failure: <abort|continue|rollback>
  
  outputs:
    - name: <output-name>
      type: <type>
      description: <explanation>
      destination: <where-output-goes>
  
  security:
    secrets_required: [<secret-name>]
    permissions_needed: [<permission>]
    security_scanning: <boolean>
    vulnerability_thresholds:
      critical: <number>
      high: <number>
    sanitization_rules: [<rule>]
  
  monitoring:
    metrics: [<metric-name>]
    alerts:
      - condition: <alert-condition>
        severity: <low|medium|high|critical>
        notification_channels: [<channel>]
    logging_level: <debug|info|warn|error>
  
  rollback:
    enabled: <boolean>
    strategy: <automatic|manual>
    conditions: [<condition>]
    restore_point: <description>
```

## Contract Lifecycle

1. **Definition**: Human defines intent and governance
2. **Generation**: AI generates implementation details
3. **Validation**: Automated checks verify contract completeness
4. **Execution**: Contract executor runs the job
5. **Monitoring**: Real-time tracking of execution
6. **Audit**: Complete logging for compliance

## Contract Categories

- **Workflow Contracts**: GitHub Actions workflows
- **Script Contracts**: Automated scripts and tools
- **Integration Contracts**: Third-party integrations
- **Maintenance Contracts**: Repository maintenance tasks
- **Security Contracts**: Security and compliance automation

## Governance Principles

1. **Transparency**: All contracts are version-controlled and auditable
2. **Accountability**: Clear ownership and authorization trails
3. **Security**: Built-in security controls and vulnerability management
4. **Compliance**: Framework-aligned for regulatory requirements
5. **Scalability**: Designed for enterprise-scale operations

## Using Job Contracts

### Manual Execution
```bash
copilot-contract execute <contract-file>
```

### Scheduled Execution
Contracts with schedule triggers run automatically via the contract executor.

### Event-Driven Execution
Contracts respond to GitHub events as specified in their triggers.

## Contract Validation

All contracts must pass:
- Schema validation
- Security scanning
- Dependency verification
- Authorization checks

## Support and Contribution

For questions about job contracts, consult the canonical README.md for the "Humans Define Law" directive and intent normalization rules.
