import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Store, 
  Bot, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavigationItem } from '../../../types/home';
import { User } from '../../../types';
import './Sidebar.css';

interface SidebarProps {
  user: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'Home',
      path: '/home',
    },
    {
      id: 'district',
      label: 'District Center',
      icon: 'Building2',
      path: '/district',
      roles: ['DM', 'RD', 'ADMIN'],
    },
    {
      id: 'store',
      label: 'Store Deep Dive',
      icon: 'Store',
      path: '/store',
    },
    {
      id: 'copilot',
      label: 'Co-Pilot',
      icon: 'Bot',
      path: '/copilot',
      badge: 'AI',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: 'Settings',
      path: '/admin',
      roles: ['ADMIN'],
    },
  ];

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Home,
      Building2,
      Store,
      Bot,
      Settings,
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  const filteredItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">DG</div>
            <span className="sidebar-brand-text">StoreHub</span>
          </div>
        )}
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {filteredItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="sidebar-nav-icon">
                {getIcon(item.icon)}
              </span>
              {!isCollapsed && (
                <>
                  <span className="sidebar-nav-label">{item.label}</span>
                  {item.badge && (
                    <span className="sidebar-nav-badge">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{user.role}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
