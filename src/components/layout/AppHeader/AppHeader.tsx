import React, { useState } from 'react';
import { Bell, ChevronDown, HelpCircle, User as UserIcon, LogOut, AlertTriangle, Megaphone, ClipboardCheck, Package } from 'lucide-react';
import { User } from '../../../types';
import { ROLE_NAMES } from '../../../constants/roles';
import { APP_CONFIG, ASSETS } from '../../../constants/app';
import './AppHeader.css';

interface AppHeaderProps {
  user: User;
  notificationCount?: number;
  onLogout: () => void;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: <AlertTriangle size={14} />, text: 'Store #5678 Pine Grove audit overdue', time: '12 min ago', type: 'warning' as const },
  { id: 2, icon: <Megaphone size={14} />, text: 'New broadcast from HQ: Weekly priorities', time: '1h ago', type: 'info' as const },
  { id: 3, icon: <ClipboardCheck size={14} />, text: 'SEA compliance updated for District 14', time: '2h ago', type: 'success' as const },
  { id: 4, icon: <Package size={14} />, text: 'Inbound shipment delayed — Cologne East', time: '3h ago', type: 'warning' as const },
];

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  user, 
  notificationCount = 4,
  onLogout 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="app-header">
      <div className="app-header-left">
        <img src={ASSETS.iaLogo} alt="Impact Analytics" className="app-header-logo" />
        <div className="app-header-divider" />
        <h1 className="app-header-title">{APP_CONFIG.name}</h1>
      </div>

      <div className="app-header-right">
        {/* Help */}
        <button
          className="app-header-icon-btn"
          aria-label="Help & Support"
          title="Help & Support"
          onClick={() => window.open('https://impactanalytics.co', '_blank')}
        >
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <div className="app-header-notif-wrap">
          <button
            className="app-header-notification"
            aria-label={`Notifications — ${notificationCount} unread`}
            title="Notifications"
            onClick={() => { setShowNotifications(prev => !prev); setShowDropdown(false); }}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="app-header-notification-badge">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="app-header-dropdown-overlay" onClick={() => setShowNotifications(false)} />
              <div className="app-header-notif-panel">
                <div className="app-header-notif-header">
                  <span className="notif-header-title">Notifications</span>
                  <span className="notif-header-count">{notificationCount} new</span>
                </div>
                <div className="app-header-notif-list">
                  {MOCK_NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`app-header-notif-item notif-${n.type}`}>
                      <div className="notif-icon">{n.icon}</div>
                      <div className="notif-body">
                        <span className="notif-text">{n.text}</span>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="app-header-notif-footer">
                  <button className="notif-view-all" onClick={() => setShowNotifications(false)}>
                    Mark all as read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="app-header-user">
          <button 
            className="app-header-user-button"
            aria-label="User menu"
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
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
                <button className="app-header-dropdown-item disabled" disabled title="Coming soon">
                  <UserIcon size={14} />
                  My Profile
                </button>
                <button
                  className="app-header-dropdown-item"
                  onClick={() => { window.open('https://impactanalytics.co', '_blank'); setShowDropdown(false); }}
                >
                  <HelpCircle size={14} />
                  Help & Support
                </button>
                <div className="app-header-dropdown-divider" />
                <button 
                  className="app-header-dropdown-item logout"
                  onClick={onLogout}
                >
                  <LogOut size={14} />
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
