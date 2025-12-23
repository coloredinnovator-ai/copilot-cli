// Data Quality Monitor Component
// Real-time monitoring of ingestion pipeline and data quality

import React, { useEffect, useState } from 'react';

interface QualityMetrics {
  completeness: number;
  accuracy: number;
  consistency: number;
  overall: number;
}

interface PipelineStats {
  recordsProcessed: number;
  recordsAccepted: number;
  recordsRejected: number;
  successRate: number;
  avgLatency: number;
  queueDepth: number;
}

interface DataQualityMonitorProps {
  refreshInterval?: number;
}

export const DataQualityMonitor: React.FC<DataQualityMonitorProps> = ({
  refreshInterval = 5000,
}) => {
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    completeness: 0,
    accuracy: 0,
    consistency: 0,
    overall: 0,
  });
  const [pipelineStats, setPipelineStats] = useState<PipelineStats>({
    recordsProcessed: 0,
    recordsAccepted: 0,
    recordsRejected: 0,
    successRate: 0,
    avgLatency: 0,
    queueDepth: 0,
  });
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // In production, these would be actual API calls
        const mockQuality: QualityMetrics = {
          completeness: 0.96,
          accuracy: 0.98,
          consistency: 0.99,
          overall: 0.97,
        };
        
        const mockStats: PipelineStats = {
          recordsProcessed: 125430,
          recordsAccepted: 123456,
          recordsRejected: 1974,
          successRate: 0.984,
          avgLatency: 2.3,
          queueDepth: 234,
        };

        setQualityMetrics(mockQuality);
        setPipelineStats(mockStats);

        // Check for alerts
        const newAlerts: string[] = [];
        if (mockStats.successRate < 0.95) {
          newAlerts.push('WARNING: Success rate below 95%');
        }
        if (mockStats.avgLatency > 5) {
          newAlerts.push('WARNING: Average latency exceeds 5 seconds');
        }
        if (mockStats.queueDepth > 1000) {
          newAlerts.push('WARNING: Queue depth exceeds threshold');
        }
        setAlerts(newAlerts);

      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getQualityColor = (value: number): string => {
    if (value >= 0.98) return '#4caf50';
    if (value >= 0.95) return '#ff9800';
    return '#f44336';
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatPercent = (num: number): string => {
    return `${(num * 100).toFixed(1)}%`;
  };

  return (
    <div className="quality-monitor">
      <h2>Data Quality Monitor</h2>
      
      {alerts.length > 0 && (
        <div className="alerts">
          {alerts.map((alert, idx) => (
            <div key={idx} className="alert">
              ⚠️ {alert}
            </div>
          ))}
        </div>
      )}

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Quality Metrics</h3>
          <div className="metric-item">
            <span className="metric-label">Completeness</span>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${qualityMetrics.completeness * 100}%`,
                  backgroundColor: getQualityColor(qualityMetrics.completeness),
                }}
              />
            </div>
            <span className="metric-value">{formatPercent(qualityMetrics.completeness)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Accuracy</span>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${qualityMetrics.accuracy * 100}%`,
                  backgroundColor: getQualityColor(qualityMetrics.accuracy),
                }}
              />
            </div>
            <span className="metric-value">{formatPercent(qualityMetrics.accuracy)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Consistency</span>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${qualityMetrics.consistency * 100}%`,
                  backgroundColor: getQualityColor(qualityMetrics.consistency),
                }}
              />
            </div>
            <span className="metric-value">{formatPercent(qualityMetrics.consistency)}</span>
          </div>
          <div className="metric-item overall">
            <span className="metric-label">Overall Quality</span>
            <span className="metric-value large" style={{ color: getQualityColor(qualityMetrics.overall) }}>
              {formatPercent(qualityMetrics.overall)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <h3>Pipeline Statistics</h3>
          <div className="stat-item">
            <span className="stat-label">Records Processed</span>
            <span className="stat-value">{formatNumber(pipelineStats.recordsProcessed)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Records Accepted</span>
            <span className="stat-value success">{formatNumber(pipelineStats.recordsAccepted)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Records Rejected</span>
            <span className="stat-value error">{formatNumber(pipelineStats.recordsRejected)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">{formatPercent(pipelineStats.successRate)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Latency</span>
            <span className="stat-value">{pipelineStats.avgLatency.toFixed(2)}s</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Queue Depth</span>
            <span className="stat-value">{formatNumber(pipelineStats.queueDepth)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .quality-monitor {
          padding: 2rem;
          background: #f5f5f5;
          min-height: 100vh;
        }
        h2 {
          margin-bottom: 1.5rem;
          color: #333;
        }
        .alerts {
          margin-bottom: 1.5rem;
        }
        .alert {
          background: #fff3cd;
          border: 1px solid #ffc107;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          color: #856404;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        .metric-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .metric-card h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.2rem;
        }
        .metric-item {
          margin-bottom: 1rem;
        }
        .metric-item.overall {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e0e0e0;
        }
        .metric-label {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.25rem;
        }
        .metric-bar {
          width: 100%;
          height: 24px;
          background: #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }
        .metric-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .metric-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
        }
        .metric-value.large {
          font-size: 2rem;
          display: block;
          text-align: center;
        }
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .stat-item:last-child {
          border-bottom: none;
        }
        .stat-label {
          color: #666;
        }
        .stat-value {
          font-weight: 600;
          color: #333;
        }
        .stat-value.success {
          color: #4caf50;
        }
        .stat-value.error {
          color: #f44336;
        }
      `}</style>
    </div>
  );
};

export default DataQualityMonitor;
