import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from 'impact-ui/dist/components';
import { useNavigate } from 'react-router-dom';
import { SidebarNew } from '../Sidebar/SidebarNew';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../types';
import { APP_CONFIG } from '../../../constants/app';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  const dropMenuOptions = [
    {
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="main-layout">
      <SidebarNew 
        user={user} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`main-layout-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          title={APP_CONFIG.name}
          userName={user.name}
          dropMenuOptions={dropMenuOptions}
          avatarType="withoutPicture"
        />
        <main className="main-layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
