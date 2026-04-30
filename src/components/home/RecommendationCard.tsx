import React from 'react';
import { Card } from 'impact-ui';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import { RecommendedAction } from '../../types/home';
import './RecommendationCard.css';

interface RecommendationCardProps {
  recommendations: RecommendedAction[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendations }) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'recommendation-item-high';
      case 'medium':
        return 'recommendation-item-medium';
      default:
        return 'recommendation-item-low';
    }
  };

  return (
    <Card size="small" sx={{ maxWidth: '100%', minHeight: 0, padding: '14px 16px' }}>
      <div className="recommendation-list">
        {recommendations.map((rec) => (
          <button
            key={rec.id}
            className={`recommendation-item ${getPriorityClass(rec.priority)}`}
            onClick={rec.onClick}
          >
            <div className="recommendation-content">
              <div className="recommendation-header">
                {rec.priority === 'high' && <ErrorOutlined sx={{ fontSize: 16 }} />}
                <div className="recommendation-item-title">{rec.title}</div>
              </div>
              {rec.description && (
                <div className="recommendation-desc">{rec.description}</div>
              )}
            </div>
            
            <ArrowForwardOutlined sx={{ fontSize: 16 }} className="recommendation-arrow" />
          </button>
        ))}
      </div>
    </Card>
  );
};
