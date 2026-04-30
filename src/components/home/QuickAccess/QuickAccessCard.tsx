import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'impact-ui';
import { QuickAccessCard as QuickAccessCardType } from '../../../types/quickAccess';
import './QuickAccessCard.css';

interface QuickAccessCardProps {
  card: QuickAccessCardType;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ card }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (card.isComingSoon) {
      alert('Coming Soon! This feature is under development.');
      return;
    }

    if (card.onClick) {
      card.onClick();
    } else if (card.route) {
      navigate(card.route);
    }
  };

  const getBadgeColor = () => {
    const colors = {
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      default: '#757575',
    };
    return colors[card.badge?.color || 'default'];
  };

  return (
    <Card size="small" className="quick-access-card">
      <div className="quick-access-card-content" onClick={handleClick}>
        <div className="quick-access-icon">{card.icon}</div>
        
        <h3 className="quick-access-title">{card.title}</h3>
        
        <p className="quick-access-subtitle">{card.subtitle}</p>
        
        {card.badge && (
          <div
            className="quick-access-badge"
            style={{
              backgroundColor: `${getBadgeColor()}15`,
              color: getBadgeColor(),
            }}
          >
            {card.badge.label}
          </div>
        )}

        {card.isComingSoon && (
          <div className="quick-access-coming-soon">Coming Soon</div>
        )}
      </div>
    </Card>
  );
};
