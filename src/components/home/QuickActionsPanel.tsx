import React from 'react';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import TrendingDownOutlined from '@mui/icons-material/TrendingDownOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import AssignmentTurnedInOutlined from '@mui/icons-material/AssignmentTurnedInOutlined';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import { Badge } from 'impact-ui';
import { QuickAccessItem } from '../../types/home';
import './QuickActionsPanel.css';

type MuiIconComponent = React.ComponentType<{ className?: string; sx?: Record<string, unknown> }>;

interface QuickActionsPanelProps {
  items: QuickAccessItem[];
}

const iconMap: Record<string, MuiIconComponent> = {
  Home: HomeOutlined,
  TrendingUp: TrendingDownOutlined,
  Users: GroupOutlined,
  ClipboardCheck: AssignmentTurnedInOutlined,
  Bot: SmartToyOutlined,
};

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ items }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || HomeOutlined;
    return <IconComponent sx={{ fontSize: 20 }} />;
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
            
            <ArrowForwardOutlined sx={{ fontSize: 16 }} className="quick-action-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};
