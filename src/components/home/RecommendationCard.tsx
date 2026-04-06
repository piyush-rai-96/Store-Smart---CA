import React from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
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
    <div className="recommendation-card">
      <div className="recommendation-list">
        {recommendations.map((rec) => (
          <button
            key={rec.id}
            className={`recommendation-item ${getPriorityClass(rec.priority)}`}
            onClick={rec.onClick}
          >
            <div className="recommendation-content">
              <div className="recommendation-header">
                {rec.priority === 'high' && <AlertCircle size={16} />}
                <div className="recommendation-item-title">{rec.title}</div>
              </div>
              {rec.description && (
                <div className="recommendation-desc">{rec.description}</div>
              )}
            </div>
            
            <ArrowRight size={16} className="recommendation-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};
