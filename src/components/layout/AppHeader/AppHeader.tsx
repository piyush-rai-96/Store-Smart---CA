import React, { useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { User } from '../../../types';
import { ROLE_NAMES } from '../../../constants/roles';
import './AppHeader.css';

interface AppHeaderProps {
  user: User;
  notificationCount?: number;
  onLogout: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  user, 
  notificationCount = 0,
  onLogout 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h1 className="app-header-title">StoreHub</h1>
      </div>

      <div className="app-header-right">
        {/* Notifications */}
        <button className="app-header-notification" aria-label="Notifications">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="app-header-notification-badge">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="app-header-user">
          <button 
            className="app-header-user-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="app-header-user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="app-header-user-info">
              <div className="app-header-user-name">{user.name}</div>
              <div className="app-header-user-role">{ROLE_NAMES[user.role]}</div>
            </div>
            <ChevronDown size={16} className="app-header-user-chevron" />
          </button>

          {showDropdown && (
            <>
              <div 
                className="app-header-dropdown-overlay"
                onClick={() => setShowDropdown(false)}
              />
              <div className="app-header-dropdown">
                <button 
                  className="app-header-dropdown-item"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
