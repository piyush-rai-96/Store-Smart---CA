import React from 'react';
import { Home, TrendingUp, Users, Package, Calendar, GraduationCap, ArrowRight } from 'lucide-react';
import { QuickAccessItem } from '../../../types/home';
import './QuickAccess.css';

interface QuickAccessProps {
  items: QuickAccessItem[];
}

export const QuickAccess: React.FC<QuickAccessProps> = ({ items }) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Home, TrendingUp, Users, Package, Calendar, GraduationCap
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <div className="quick-access">
      <h3 className="quick-access-title">⚡ Quick Access</h3>
      <div className="quick-access-grid">
        {items.map(item => (
          <button
            key={item.id}
            className="quick-access-item"
            onClick={item.onClick}
          >
            <div className="quick-access-icon">
              {getIcon(item.icon)}
            </div>
            <div className="quick-access-content">
              <div className="quick-access-label">{item.label}</div>
              {item.badge && (
                <div className="quick-access-badge">{item.badge}</div>
              )}
            </div>
            <ArrowRight size={16} className="quick-access-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};
