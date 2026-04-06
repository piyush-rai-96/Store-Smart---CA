import React from 'react';
import { QuickAccessCard as QuickAccessCardType } from '../../../types/quickAccess';
import { QuickAccessCard } from './QuickAccessCard';
import './QuickAccess.css';

interface QuickAccessProps {
  cards: QuickAccessCardType[];
}

export const QuickAccess: React.FC<QuickAccessProps> = ({ cards }) => {
  return (
    <div className="quick-access">
      <h2 className="quick-access-title">⚡ Quick Access</h2>
      
      <div className="quick-access-grid">
        {cards.map(card => (
          <QuickAccessCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};
