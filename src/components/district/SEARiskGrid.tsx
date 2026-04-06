import React from 'react';
import { SEARiskPoint } from '../../types/district';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import './SEARiskGrid.css';

interface SEARiskGridProps {
  data: SEARiskPoint[];
  onStoreClick: (storeNumber: string) => void;
}

export const SEARiskGrid: React.FC<SEARiskGridProps> = ({ data, onStoreClick }) => {
  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'chronic': return <AlertTriangle size={16} />;
      case 'one-time-dip': return <AlertCircle size={16} />;
      case 'strong': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'chronic': return '#dc3545';
      case 'one-time-dip': return '#ffc107';
      case 'strong': return '#28a745';
      case 'moderate': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'chronic': return 'Chronic Risk';
      case 'one-time-dip': return 'One-Time Dip';
      case 'strong': return 'Strong';
      case 'moderate': return 'Moderate';
      default: return 'Unknown';
    }
  };

  const groupedData = {
    chronic: data.filter(d => d.riskLevel === 'chronic'),
    'one-time-dip': data.filter(d => d.riskLevel === 'one-time-dip'),
    strong: data.filter(d => d.riskLevel === 'strong'),
    moderate: data.filter(d => d.riskLevel === 'moderate'),
  };

  return (
    <div className="sea-risk-container">
      <div className="sea-risk-header">
        <h3 className="sea-risk-title">SEA Risk Grid</h3>
        <p className="sea-risk-subtitle">Store Excellence Audit Risk Assessment</p>
      </div>

      <div className="sea-risk-grid">
        {Object.entries(groupedData).map(([riskLevel, stores]) => (
          stores.length > 0 && (
            <div key={riskLevel} className="sea-risk-category">
              <div 
                className="sea-risk-category-header"
                style={{ borderLeftColor: getRiskColor(riskLevel) }}
              >
                <div className="sea-risk-icon" style={{ color: getRiskColor(riskLevel) }}>
                  {getRiskIcon(riskLevel)}
                </div>
                <div className="sea-risk-category-title">
                  {getRiskLabel(riskLevel)}
                  <span className="sea-risk-count">({stores.length})</span>
                </div>
              </div>
              
              <div className="sea-risk-stores">
                {stores.map((store) => (
                  <div
                    key={store.storeNumber}
                    className="sea-risk-store-card"
                    onClick={() => onStoreClick(store.storeNumber)}
                    style={{ borderLeftColor: getRiskColor(riskLevel) }}
                  >
                    <div className="sea-risk-store-header">
                      <span className="sea-risk-store-number">#{store.storeNumber}</span>
                      <span className="sea-risk-store-name">{store.storeName}</span>
                    </div>
                    <div className="sea-risk-store-metrics">
                      <div className="sea-risk-metric">
                        <span className="sea-risk-metric-label">SEA Score</span>
                        <span 
                          className="sea-risk-metric-value"
                          style={{ color: store.seaScore >= 85 ? '#28a745' : store.seaScore >= 75 ? '#ffc107' : '#dc3545' }}
                        >
                          {store.seaScore}%
                        </span>
                      </div>
                      <div className="sea-risk-metric">
                        <span className="sea-risk-metric-label">Failures</span>
                        <span className="sea-risk-metric-value sea-risk-failures">
                          {store.failureCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};
