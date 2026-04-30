import React from 'react';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import { User } from '../../types';
import { ROLE_NAMES, ROLE_COLORS, ROLE_ABBR } from '../../constants/roles';
import './WelcomeBar.css';

interface WelcomeBarProps {
  user: User;
}

export const WelcomeBar: React.FC<WelcomeBarProps> = ({ user }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAssignment = () => {
    if (user.role === 'DM' || user.role === 'HQ') {
      return user.district || 'All Districts';
    }
    if (user.role === 'SM') {
      return user.storeId ? `Store #${user.storeId} - ${user.store}` : 'Store';
    }
    return 'All Locations';
  };

  return (
    <div className="welcome-bar">
      <div className="welcome-row-1">
        <h1 className="welcome-greeting">Welcome back, {user.name}</h1>
        <div className="welcome-date">
          <CalendarTodayOutlined sx={{ fontSize: 16 }} />
          <span>{formatDate(new Date())}</span>
        </div>
      </div>

      <div className="welcome-row-2">
        <div className="role-badge" style={{ backgroundColor: ROLE_COLORS[user.role] }}>
          {ROLE_ABBR[user.role]}
        </div>
        <span className="role-title">{ROLE_NAMES[user.role]}</span>
        <span className="separator">•</span>
        <span className="assignment">{getAssignment()}</span>
      </div>
    </div>
  );
};
