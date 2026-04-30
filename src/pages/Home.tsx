import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from 'impact-ui';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../types';
import { APP_CONFIG } from '../constants/app';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  const dropMenuOptions = [
    {
      label: user.name,
      onClick: () => {},
    },
    {
      label: user.email,
      onClick: () => {},
    },
    {
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="home-container">
      <Header
        title={APP_CONFIG.name}
        userName={user.name}
        dropMenuOptions={dropMenuOptions}
        avatarType="withoutPicture"
      />
      <div className="home-content">
        {/* Blank Home Page */}
      </div>
    </div>
  );
};
