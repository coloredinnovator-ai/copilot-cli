// Census API Connector
// Connects to US Census Bureau API for demographic and geographic data

import axios from 'axios';
import { RateLimiter } from '../utils/rate-limiter';
import { RetryHandler } from '../utils/retry-handler';

interface CensusConfig {
  apiUrl: string;
  apiKey: string;
  timeout: number;
  maxRetries: number;
}

interface CensusResponse {
  data: any[];
  metadata: {
    total: number;
    page: number;
    perPage: number;
  };
}

export class CensusConnector {
  private config: CensusConfig;
  private rateLimiter: RateLimiter;
  private retryHandler: RetryHandler;

  constructor(config: CensusConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter({ requestsPerSecond: 10 });
    this.retryHandler = new RetryHandler({ maxRetries: config.maxRetries });
  }

  /**
   * Fetch geographic data from Census API
   */
  async fetchGeographicData(params: {
    dataset: string;
    geography: string;
    variables: string[];
    year?: number;
  }): Promise<CensusResponse> {
    await this.rateLimiter.waitForToken();

    const url = this.buildUrl(params);
    
    return this.retryHandler.execute(async () => {
      try {
        const response = await axios.get(url, {
          timeout: this.config.timeout,
          headers: {
            'User-Agent': 'GNIS-Enterprise/1.0',
            'Accept': 'application/json',
          },
          params: {
            key: this.config.apiKey,
          },
        });

        return this.transformResponse(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 429) {
            throw new Error('RATE_LIMIT_EXCEEDED');
          }
          if (error.response?.status === 401) {
            throw new Error('AUTHENTICATION_FAILED');
          }
        }
        throw error;
      }
    });
  }

  /**
   * Transform Census API response to GNIS canonical format
   */
  private transformResponse(data: any): CensusResponse {
    // Transform Census-specific format to GNIS geo-object format
    const transformed = data.map((record: any) => ({
      // Transformation logic here
      id: this.generateUUID(),
      type: 'Feature',
      name: {
        primary: record.NAME,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(record.INTPTLON),
          parseFloat(record.INTPTLAT),
        ],
      },
      properties: {
        classification: {
          category: 'administrative',
          subcategory: 'census_place',
        },
        location: {
          country: 'United States',
          countryCode: 'US',
          state: record.STATE,
        },
        demographics: {
          population: parseInt(record.POP, 10),
          populationYear: parseInt(record.YEAR, 10),
        },
        identifiers: {
          fipsCode: record.GEOID,
        },
      },
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: 1,
        source: {
          provider: 'US Census Bureau',
          dataset: record.DATASET,
          ingestionDate: new Date().toISOString(),
          license: 'Public Domain',
          apiEndpoint: this.config.apiUrl,
        },
      },
    }));

    return {
      data: transformed,
      metadata: {
        total: transformed.length,
        page: 1,
        perPage: transformed.length,
      },
    };
  }

  private buildUrl(params: any): string {
    const { dataset, geography, year = 2020 } = params;
    return `${this.config.apiUrl}/${year}/${dataset}`;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Test connection to Census API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.config.apiUrl}/healthcheck`, {
        timeout: 5000,
        params: { key: this.config.apiKey },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
