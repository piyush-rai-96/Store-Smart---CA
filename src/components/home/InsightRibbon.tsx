import React from 'react';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlined from '@mui/icons-material/TrendingDownOutlined';
import { InsightMetric } from '../../types/home';
import './InsightRibbon.css';

interface InsightRibbonProps {
  insights: InsightMetric[];
}

export const InsightRibbon: React.FC<InsightRibbonProps> = ({ insights }) => {
  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'positive':
        return 'insight-ribbon-card-positive';
      case 'warning':
        return 'insight-ribbon-card-warning';
      case 'negative':
        return 'insight-ribbon-card-negative';
      default:
        return 'insight-ribbon-card-neutral';
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <TrendingUpOutlined sx={{ fontSize: 14 }} />;
    if (trend === 'down') return <TrendingDownOutlined sx={{ fontSize: 14 }} />;
    return null;
  };

  return (
    <div className="insight-ribbon">
      <div className="insight-ribbon-container">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`insight-ribbon-card ${getStatusClass(insight.status)}`}
            onClick={insight.onClick}
            role={insight.onClick ? 'button' : undefined}
            tabIndex={insight.onClick ? 0 : undefined}
          >
            <div className="insight-ribbon-card-inner">
              <div className="insight-ribbon-header">
                <span className="insight-ribbon-label">{insight.label}</span>
                {insight.trend && insight.trendValue && (
                  <div className={`insight-ribbon-trend insight-ribbon-trend-${insight.trend}`}>
                    {getTrendIcon(insight.trend)}
                    <span>{insight.trendValue}</span>
                  </div>
                )}
              </div>
              
              <div className="insight-ribbon-value">{insight.value}</div>
              
              {insight.subtitle && (
                <div className="insight-ribbon-subtitle">{insight.subtitle}</div>
              )}
            </div>
            
            <div className="insight-ribbon-card-accent" />
          </div>
        ))}
      </div>
    </div>
  );
};
