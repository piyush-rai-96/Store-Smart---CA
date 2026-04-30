import React from 'react';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { RecommendedAction } from '../../../types/home';
import './RecommendedActions.css';

interface RecommendedActionsProps {
  actions: RecommendedAction[];
}

export const RecommendedActions: React.FC<RecommendedActionsProps> = ({ actions }) => {
  return (
    <div className="recommended-actions">
      <div className="recommended-actions-header">
        <AutoAwesomeOutlined sx={{ fontSize: 18 }} />
        <h3 className="recommended-actions-title">Recommended Actions</h3>
      </div>
      <div className="recommended-actions-list">
        {actions.map(action => (
          <button
            key={action.id}
            className={`recommended-action recommended-action-${action.priority}`}
            onClick={action.onClick}
          >
            <div className="recommended-action-content">
              <div className="recommended-action-title">{action.title}</div>
              {action.description && (
                <div className="recommended-action-description">{action.description}</div>
              )}
            </div>
            <KeyboardArrowRight sx={{ fontSize: 16 }} className="recommended-action-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};
