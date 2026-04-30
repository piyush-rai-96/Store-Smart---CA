import React from 'react';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import InventoryOutlined from '@mui/icons-material/InventoryOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import { Badge } from 'impact-ui';
import { QuickAccessItem } from '../../../types/home';
import './QuickAccess.css';

interface QuickAccessProps {
  items: QuickAccessItem[];
}

export const QuickAccess: React.FC<QuickAccessProps> = ({ items }) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ sx?: Record<string, unknown> }>> = {
      Home: HomeOutlined,
      TrendingUp: TrendingUpOutlined,
      Users: GroupOutlined,
      Package: InventoryOutlined,
      Calendar: CalendarTodayOutlined,
      GraduationCap: SchoolOutlined,
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent sx={{ fontSize: 20 }} /> : null;
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
              {item.badge !== undefined && item.badge !== null && item.badge !== '' && (
                <Badge
                  className="quick-access-badge"
                  label={String(item.badge)}
                  color={typeof item.badge === 'number' && item.badge > 0 ? 'error' : 'info'}
                  size="small"
                />
              )}
            </div>
            <ArrowForwardOutlined sx={{ fontSize: 16 }} className="quick-access-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};
