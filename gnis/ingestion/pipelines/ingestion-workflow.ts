// Ingestion Pipeline Workflow
// Orchestrates the complete data ingestion process

import { CensusConnector } from '../connectors/census-connector';
import { SchemaValidator } from '../validators/schema-validator';
import { TruthGovernor } from '../validators/truth-governor';
import { AuditLogger } from '../utils/audit-logger';

interface PipelineConfig {
  source: string;
  batchSize: number;
  concurrency: number;
  qualityThreshold: number;
}

interface PipelineResult {
  success: boolean;
  recordsProcessed: number;
  recordsAccepted: number;
  recordsRejected: number;
  errors: PipelineError[];
  duration: number;
}

interface PipelineError {
  recordId?: string;
  stage: string;
  error: string;
  timestamp: string;
}

export class IngestionPipeline {
  private config: PipelineConfig;
  private validator: SchemaValidator;
  private truthGovernor: TruthGovernor;
  private auditLogger: AuditLogger;

  constructor(config: PipelineConfig) {
    this.config = config;
    this.validator = new SchemaValidator();
    this.truthGovernor = new TruthGovernor();
    this.auditLogger = new AuditLogger();
  }

  /**
   * Execute the complete ingestion pipeline
   */
  async execute(connector: any, params: any): Promise<PipelineResult> {
    const startTime = Date.now();
    const result: PipelineResult = {
      success: false,
      recordsProcessed: 0,
      recordsAccepted: 0,
      recordsRejected: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Stage 1: Fetch data from external source
      this.auditLogger.log('PIPELINE_START', { source: this.config.source, params });
      const response = await connector.fetchGeographicData(params);
      
      // Stage 2: Process records in batches
      const batches = this.createBatches(response.data, this.config.batchSize);
      
      for (const batch of batches) {
        await this.processBatch(batch, result);
      }

      result.success = result.recordsRejected === 0 || 
                       (result.recordsAccepted / result.recordsProcessed) >= 0.95;
      
    } catch (error) {
      result.errors.push({
        stage: 'PIPELINE',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
      result.success = false;
    } finally {
      result.duration = Date.now() - startTime;
      this.auditLogger.log('PIPELINE_COMPLETE', result);
    }

    return result;
  }

  /**
   * Process a batch of records
   */
  private async processBatch(
    batch: any[],
    result: PipelineResult
  ): Promise<void> {
    const promises = batch.map(async (record) => {
      try {
        await this.processRecord(record);
        result.recordsAccepted++;
      } catch (error) {
        result.recordsRejected++;
        result.errors.push({
          recordId: record.id,
          stage: 'PROCESSING',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
      result.recordsProcessed++;
    });

    await Promise.all(promises);
  }

  /**
   * Process a single record through all validation stages
   */
  private async processRecord(record: any): Promise<void> {
    // Stage 1: Schema Validation
    this.auditLogger.log('VALIDATION_START', { recordId: record.id });
    const validationResult = await this.validator.validate(record);
    
    if (!validationResult.valid) {
      this.auditLogger.log('VALIDATION_FAILED', {
        recordId: record.id,
        errors: validationResult.errors,
        quality: validationResult.qualityMetrics,
      });
      throw new Error(`Validation failed: ${validationResult.errors[0]?.message}`);
    }

    // Stage 2: Quality Check
    if (validationResult.qualityMetrics.overall < this.config.qualityThreshold) {
      this.auditLogger.log('QUALITY_THRESHOLD_FAILED', {
        recordId: record.id,
        quality: validationResult.qualityMetrics,
        threshold: this.config.qualityThreshold,
      });
      throw new Error('Quality threshold not met');
    }

    // Stage 3: Truth Governor Review
    this.auditLogger.log('TRUTH_GOVERNOR_REVIEW', { recordId: record.id });
    const governorResult = await this.truthGovernor.review(record);
    
    if (!governorResult.approved) {
      this.auditLogger.log('TRUTH_GOVERNOR_REJECTED', {
        recordId: record.id,
        reason: governorResult.reason,
        severity: governorResult.severity,
      });
      throw new Error(`Truth Governor rejected: ${governorResult.reason}`);
    }

    // Stage 4: Data Acceptance
    record.metadata.governance.truthGovernorApproved = true;
    record.metadata.governance.approvalTimestamp = new Date().toISOString();
    
    this.auditLogger.log('RECORD_ACCEPTED', {
      recordId: record.id,
      quality: validationResult.qualityMetrics,
    });
  }

  /**
   * Create batches from array of records
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Get pipeline statistics
   */
  getStatistics(): any {
    return {
      source: this.config.source,
      config: this.config,
      // Additional statistics would be retrieved from audit logs
    };
  }
}

/**
 * Example usage:
 * 
 * const pipeline = new IngestionPipeline({
 *   source: 'US Census Bureau',
 *   batchSize: 1000,
 *   concurrency: 10,
 *   qualityThreshold: 0.90,
 * });
 * 
 * const connector = new CensusConnector(config);
 * const result = await pipeline.execute(connector, {
 *   dataset: 'dec/pl',
 *   geography: 'state:*',
 *   variables: ['NAME', 'POP100'],
 *   year: 2020,
 * });
 * 
 * console.log(`Processed: ${result.recordsProcessed}`);
 * console.log(`Accepted: ${result.recordsAccepted}`);
 * console.log(`Rejected: ${result.recordsRejected}`);
 */
