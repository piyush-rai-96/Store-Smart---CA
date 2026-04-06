import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { InsightMetric } from '../../../types/home';
import './InsightCard.css';

interface InsightCardProps {
  metric: InsightMetric;
}

export const InsightCard: React.FC<InsightCardProps> = ({ metric }) => {
  const getTrendIcon = () => {
    if (!metric.trend) return null;
    
    switch (metric.trend) {
      case 'up':
        return <TrendingUp size={16} />;
      case 'down':
        return <TrendingDown size={16} />;
      case 'neutral':
        return <Minus size={16} />;
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    if (!metric.status) return '';
    return `insight-card-${metric.status}`;
  };

  return (
    <div 
      className={`insight-card ${getStatusClass()} ${metric.onClick ? 'insight-card-clickable' : ''}`}
      onClick={metric.onClick}
    >
      <div className="insight-card-header">
        <span className="insight-card-label">{metric.label}</span>
        {metric.trend && metric.trendValue && (
          <div className={`insight-card-trend insight-card-trend-${metric.trend}`}>
            {getTrendIcon()}
            <span>{metric.trendValue}</span>
          </div>
        )}
      </div>
      <div className="insight-card-value">{metric.value}</div>
      {metric.subtitle && (
        <div className="insight-card-subtitle">{metric.subtitle}</div>
      )}
    </div>
  );
};
