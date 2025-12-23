// Truth Governor Validator Implementation
// Enforces governance policies defined in truth_governor.json

import truthGovernorConfig from '../../governance/truth_governor.json';

interface GovernorReview {
  approved: boolean;
  reason?: string;
  severity?: string;
  violations: Violation[];
  warnings: Warning[];
}

interface Violation {
  ruleId: string;
  rule: string;
  reason: string;
  severity: string;
}

interface Warning {
  ruleId: string;
  message: string;
}

export class TruthGovernor {
  private config: typeof truthGovernorConfig;

  constructor() {
    this.config = truthGovernorConfig;
  }

  /**
   * Review a data record against all governance policies
   */
  async review(record: any): Promise<GovernorReview> {
    const violations: Violation[] = [];
    const warnings: Warning[] = [];

    // Check forbidden actions
    const forbiddenViolations = this.checkForbiddenActions(record);
    violations.push(...forbiddenViolations);

    // Check required validations
    const requiredViolations = this.checkRequiredValidations(record);
    violations.push(...requiredViolations);

    // Check compliance rules
    const complianceWarnings = this.checkComplianceRules(record);
    warnings.push(...complianceWarnings);

    // Determine if approved
    const criticalViolations = violations.filter(v => v.severity === 'CRITICAL');
    const approved = criticalViolations.length === 0;

    return {
      approved,
      reason: criticalViolations.length > 0 
        ? criticalViolations[0].reason 
        : undefined,
      severity: criticalViolations.length > 0 
        ? criticalViolations[0].severity 
        : undefined,
      violations,
      warnings,
    };
  }

  /**
   * Check if any forbidden actions are being performed
   */
  private checkForbiddenActions(record: any): Violation[] {
    const violations: Violation[] = [];

    // FA-001: Manual data entry check
    if (record.metadata?.source?.ingestionMethod === 'manual') {
      violations.push({
        ruleId: 'FA-001',
        rule: 'manual_data_entry',
        reason: 'All data must come via validated API endpoints',
        severity: 'CRITICAL',
      });
    }

    // FA-002: Unvalidated API ingestion
    if (!record.metadata?.quality?.validationPassed) {
      violations.push({
        ruleId: 'FA-002',
        rule: 'unvalidated_api_ingestion',
        reason: 'All API data must pass schema validation',
        severity: 'CRITICAL',
      });
    }

    // FA-003: Schema bypass check
    if (record.metadata?.governance?.schemaBypassed === true) {
      violations.push({
        ruleId: 'FA-003',
        rule: 'schema_bypass',
        reason: 'No operation may bypass canonical schema validation',
        severity: 'CRITICAL',
      });
    }

    // FA-005: Unauthorized PII access
    if (this.containsPII(record) && !record.metadata?.governance?.piiAuthorized) {
      violations.push({
        ruleId: 'FA-005',
        rule: 'unauthorized_pii_access',
        reason: 'Personal Identifiable Information requires explicit authorization',
        severity: 'CRITICAL',
      });
    }

    // FA-008: Secret hardcoding check
    if (this.containsHardcodedSecrets(record)) {
      violations.push({
        ruleId: 'FA-008',
        rule: 'secret_hardcoding',
        reason: 'Secrets must never be hardcoded in source code',
        severity: 'CRITICAL',
      });
    }

    return violations;
  }

  /**
   * Check if all required validations have been performed
   */
  private checkRequiredValidations(record: any): Violation[] {
    const violations: Violation[] = [];

    // RV-001: Schema conformance
    if (!record.id || !record.type || !record.name || !record.geometry) {
      violations.push({
        ruleId: 'RV-001',
        rule: 'schema_conformance',
        reason: 'All data must conform to canonical geo-object schema',
        severity: 'CRITICAL',
      });
    }

    // RV-002: API authentication
    if (!record.metadata?.source?.apiEndpoint) {
      violations.push({
        ruleId: 'RV-002',
        rule: 'api_authentication',
        reason: 'All API requests must include valid authentication tokens',
        severity: 'CRITICAL',
      });
    }

    // RV-004: Data quality threshold
    const quality = record.metadata?.quality;
    if (quality) {
      const thresholds = this.config.required_validations.rules
        .find(r => r.id === 'RV-004')?.thresholds;
      
      if (thresholds) {
        if (quality.completeness < thresholds.completeness ||
            quality.accuracy < thresholds.accuracy ||
            quality.consistency < thresholds.consistency) {
          violations.push({
            ruleId: 'RV-004',
            rule: 'data_quality_threshold',
            reason: 'Ingested data must meet minimum quality standards',
            severity: 'CRITICAL',
          });
        }
      }
    }

    // RV-006: Geographic bounds check
    if (record.geometry?.coordinates) {
      const [lon, lat] = record.geometry.coordinates;
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        violations.push({
          ruleId: 'RV-006',
          rule: 'geographic_bounds_check',
          reason: 'Coordinates must be within valid geographic bounds',
          severity: 'CRITICAL',
        });
      }
    }

    return violations;
  }

  /**
   * Check compliance with regulatory frameworks
   */
  private checkComplianceRules(record: any): Warning[] {
    const warnings: Warning[] = [];

    // GDPR compliance check
    if (this.containsEUData(record)) {
      if (!record.metadata?.governance?.gdprCompliant) {
        warnings.push({
          ruleId: 'GDPR-001',
          message: 'EU data subject detected but GDPR compliance not confirmed',
        });
      }
    }

    // CCPA compliance check
    if (this.containsCaliforniaData(record)) {
      if (!record.metadata?.governance?.ccpaCompliant) {
        warnings.push({
          ruleId: 'CCPA-001',
          message: 'California resident data detected but CCPA compliance not confirmed',
        });
      }
    }

    // Data classification check
    if (!record.metadata?.governance?.dataClassification) {
      warnings.push({
        ruleId: 'CLASS-001',
        message: 'Data classification not specified',
      });
    }

    return warnings;
  }

  /**
   * Check if record contains Personally Identifiable Information
   */
  private containsPII(record: any): boolean {
    const piiFields = ['email', 'phone', 'ssn', 'address', 'firstName', 'lastName'];
    return this.containsFields(record, piiFields);
  }

  /**
   * Check if record contains hardcoded secrets
   */
  private containsHardcodedSecrets(record: any): boolean {
    const json = JSON.stringify(record).toLowerCase();
    const secretPatterns = [
      /api[_-]?key/i,
      /secret[_-]?key/i,
      /password/i,
      /token/i,
      /bearer\s+[a-zA-Z0-9]/i,
      /[a-f0-9]{32}/i, // MD5 hash pattern
    ];

    return secretPatterns.some(pattern => pattern.test(json));
  }

  /**
   * Check if record contains EU data subject information
   */
  private containsEUData(record: any): boolean {
    const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
    return euCountries.includes(record.properties?.location?.countryCode);
  }

  /**
   * Check if record contains California resident data
   */
  private containsCaliforniaData(record: any): boolean {
    return record.properties?.location?.stateCode === 'CA';
  }

  /**
   * Helper to check if record contains specific fields
   */
  private containsFields(obj: any, fields: string[]): boolean {
    const json = JSON.stringify(obj).toLowerCase();
    return fields.some(field => json.includes(field.toLowerCase()));
  }

  /**
   * Get escalation level for violations
   */
  getEscalationLevel(violations: Violation[]): string {
    const criticalCount = violations.filter(v => v.severity === 'CRITICAL').length;
    
    if (criticalCount > 0) {
      return 'L3_CRITICAL';
    }
    
    const highCount = violations.filter(v => v.severity === 'HIGH').length;
    if (highCount > 0) {
      return 'L2_REJECTION';
    }
    
    return 'L1_WARNING';
  }

  /**
   * Log governance decision to audit trail
   */
  async logDecision(record: any, review: GovernorReview): Promise<void> {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      recordId: record.id,
      decision: review.approved ? 'APPROVED' : 'REJECTED',
      violations: review.violations,
      warnings: review.warnings,
      escalationLevel: this.getEscalationLevel(review.violations),
    };

    // In production, this would write to an immutable audit log
    console.log('Truth Governor Decision:', JSON.stringify(auditEntry, null, 2));
  }
}
