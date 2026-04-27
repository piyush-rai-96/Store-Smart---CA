import React from 'react';
import { User } from '../../../types';
import { ROLE_NAMES } from '../../../constants/roles';
import './WelcomeBar.css';

interface WelcomeBarProps {
  user: User;
}

export const WelcomeBar: React.FC<WelcomeBarProps> = ({ user }) => {
  const getAssignment = () => {
    if (user.role === 'DM' || user.role === 'HQ') {
      return user.district || 'All Districts';
    }
    if (user.role === 'SM') {
      return user.storeId ? `Store #${user.storeId}` : 'Store';
    }
    return 'All Locations';
  };

  return (
    <div className="welcome-bar-premium">
      <div className="welcome-bar-content">
        <div className="welcome-bar-main">
          <h1 className="welcome-bar-greeting">
            Welcome back, <span className="welcome-bar-name">{user.name}</span>
          </h1>
          <p className="welcome-bar-subtitle">
            Here's what needs your attention today
          </p>
        </div>
        <div className="welcome-bar-meta">
          <div className="welcome-bar-role-badge">
            {ROLE_NAMES[user.role]}
          </div>
          <div className="welcome-bar-assignment">
            {getAssignment()}
          </div>
        </div>
      </div>
    </div>
  );
};
