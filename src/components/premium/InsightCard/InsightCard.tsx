import React from 'react';
import { Card } from 'impact-ui';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlined from '@mui/icons-material/TrendingDownOutlined';
import Remove from '@mui/icons-material/Remove';
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
        return <TrendingUpOutlined sx={{ fontSize: 16 }} />;
      case 'down':
        return <TrendingDownOutlined sx={{ fontSize: 16 }} />;
      case 'neutral':
        return <Remove sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    if (!metric.status) return '';
    return `insight-card-${metric.status}`;
  };

  return (
    <Card
      size="small"
      sx={{ maxWidth: '100%', minHeight: 0, padding: '16px', cursor: metric.onClick ? 'pointer' : undefined }}
      onClick={metric.onClick}
    >
      <div className={`insight-card-inner ${getStatusClass()} ${metric.onClick ? 'insight-card-clickable' : ''}`}>
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
    </Card>
  );
};
