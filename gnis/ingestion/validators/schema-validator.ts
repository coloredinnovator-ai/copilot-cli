// Schema Validator
// Validates geographic objects against canonical schema

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import geoObjectSchema from '../../core/geo-object.json';
import validationRules from '../../core/validation-rules.json';

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  qualityMetrics: QualityMetrics;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'CRITICAL' | 'ERROR';
  rule: string;
}

interface ValidationWarning {
  field: string;
  message: string;
  rule: string;
}

interface QualityMetrics {
  completeness: number;
  accuracy: number;
  consistency: number;
  overall: number;
}

export class SchemaValidator {
  private ajv: Ajv;
  private schemaValidator: any;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);
    this.schemaValidator = this.ajv.compile(geoObjectSchema);
  }

  /**
   * Validate a geographic object against all rules
   */
  async validate(data: any): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Stage 1: JSON Schema validation
    const schemaValid = this.schemaValidator(data);
    if (!schemaValid && this.schemaValidator.errors) {
      for (const error of this.schemaValidator.errors) {
        errors.push({
          field: error.instancePath || 'root',
          message: error.message || 'Validation failed',
          severity: 'CRITICAL',
          rule: 'SCHEMA',
        });
      }
    }

    // Stage 2: Custom validation rules
    const customValidation = this.validateCustomRules(data);
    errors.push(...customValidation.errors);
    warnings.push(...customValidation.warnings);

    // Stage 3: Calculate quality metrics
    const qualityMetrics = this.calculateQualityMetrics(data, errors, warnings);

    return {
      valid: errors.length === 0 && qualityMetrics.overall >= 0.90,
      errors,
      warnings,
      qualityMetrics,
    };
  }

  /**
   * Validate custom business rules
   */
  private validateCustomRules(data: any): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Geographic validations
    if (data.geometry?.coordinates) {
      const [lon, lat] = data.geometry.coordinates;
      
      if (lat < -90 || lat > 90) {
        errors.push({
          field: 'geometry.coordinates[1]',
          message: 'Latitude must be between -90 and 90',
          severity: 'CRITICAL',
          rule: 'GEO-001',
        });
      }

      if (lon < -180 || lon > 180) {
        errors.push({
          field: 'geometry.coordinates[0]',
          message: 'Longitude must be between -180 and 180',
          severity: 'CRITICAL',
          rule: 'GEO-002',
        });
      }
    }

    // Temporal validations
    if (data.metadata?.created && data.metadata?.modified) {
      const created = new Date(data.metadata.created);
      const modified = new Date(data.metadata.modified);
      
      if (created > modified) {
        errors.push({
          field: 'metadata',
          message: 'Created timestamp must be before modified timestamp',
          severity: 'ERROR',
          rule: 'TIME-002',
        });
      }

      if (created > new Date() || modified > new Date()) {
        errors.push({
          field: 'metadata',
          message: 'Timestamps cannot be in the future',
          severity: 'ERROR',
          rule: 'TIME-005',
        });
      }
    }

    // Demographics validations
    if (data.properties?.demographics) {
      const { population, households } = data.properties.demographics;
      
      if (population !== undefined && population < 0) {
        errors.push({
          field: 'properties.demographics.population',
          message: 'Population must be non-negative',
          severity: 'CRITICAL',
          rule: 'DEMO-001',
        });
      }

      if (households && population && households > population) {
        warnings.push({
          field: 'properties.demographics',
          message: 'Households should not exceed population',
          rule: 'DEMO-003',
        });
      }
    }

    // Truth Governor approval check
    if (!data.metadata?.governance?.truthGovernorApproved) {
      errors.push({
        field: 'metadata.governance.truthGovernorApproved',
        message: 'Record must be approved by Truth Governor',
        severity: 'CRITICAL',
        rule: 'META-006',
      });
    }

    return { errors, warnings };
  }

  /**
   * Calculate data quality metrics
   */
  private calculateQualityMetrics(
    data: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): QualityMetrics {
    // Completeness: percentage of required fields present
    const requiredFields = this.getRequiredFields();
    const presentFields = this.countPresentFields(data, requiredFields);
    const completeness = presentFields / requiredFields.length;

    // Accuracy: percentage of valid fields (no errors)
    const totalFields = this.countTotalFields(data);
    const errorFields = new Set(errors.map((e) => e.field)).size;
    const accuracy = (totalFields - errorFields) / totalFields;

    // Consistency: percentage of consistency checks passed
    const consistencyChecks = warnings.length + errors.filter(
      (e) => e.rule.startsWith('TIME') || e.rule.startsWith('DEMO')
    ).length;
    const totalConsistencyChecks = 10; // Predefined number of consistency checks
    const consistency = 1 - Math.min(consistencyChecks / totalConsistencyChecks, 1);

    // Overall: weighted average
    const overall = completeness * 0.35 + accuracy * 0.35 + consistency * 0.3;

    return {
      completeness: Math.round(completeness * 1000) / 1000,
      accuracy: Math.round(accuracy * 1000) / 1000,
      consistency: Math.round(consistency * 1000) / 1000,
      overall: Math.round(overall * 1000) / 1000,
    };
  }

  private getRequiredFields(): string[] {
    return [
      'id',
      'type',
      'name.primary',
      'geometry.type',
      'geometry.coordinates',
      'metadata.created',
      'metadata.modified',
      'metadata.version',
      'metadata.source.provider',
      'metadata.source.ingestionDate',
    ];
  }

  private countPresentFields(data: any, fields: string[]): number {
    return fields.filter((field) => {
      const keys = field.split('.');
      let current = data;
      for (const key of keys) {
        if (current === undefined || current === null) return false;
        current = current[key];
      }
      return current !== undefined && current !== null;
    }).length;
  }

  private countTotalFields(data: any): number {
    let count = 0;
    const traverse = (obj: any) => {
      if (obj && typeof obj === 'object') {
        count += Object.keys(obj).length;
        for (const value of Object.values(obj)) {
          traverse(value);
        }
      }
    };
    traverse(data);
    return count;
  }
}
