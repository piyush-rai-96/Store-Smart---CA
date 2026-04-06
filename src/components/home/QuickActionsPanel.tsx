import React from 'react';
import { 
  Home, 
  TrendingDown, 
  Users, 
  ClipboardCheck, 
  Bot,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { Badge } from 'impact-ui/dist/components';
import { QuickAccessItem } from '../../types/home';
import './QuickActionsPanel.css';

interface QuickActionsPanelProps {
  items: QuickAccessItem[];
}

const iconMap: Record<string, LucideIcon> = {
  Home,
  TrendingUp: TrendingDown,
  Users,
  ClipboardCheck,
  Bot,
};

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ items }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Home;
    return <IconComponent size={20} />;
  };

  return (
    <div className="quick-actions-panel">
      <div className="quick-actions-list">
        {items.map((item) => (
          <button
            key={item.id}
            className="quick-action-item"
            onClick={item.onClick}
          >
            <div className="quick-action-icon">
              {getIcon(item.icon)}
            </div>
            
            <span className="quick-action-label">{item.label}</span>
            
            {item.badge && (
              <Badge
                label={String(item.badge)}
                color={typeof item.badge === 'number' && item.badge > 0 ? 'error' : 'info'}
                size="small"
              />
            )}
            
            <ArrowRight size={16} className="quick-action-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};
