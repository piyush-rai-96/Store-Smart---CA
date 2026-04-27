import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppHeader } from '../AppHeader/AppHeader';
import { Breadcrumb } from '../../common/Breadcrumb';
import { SidebarNew } from '../Sidebar/SidebarNew';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../types';
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

  return (
    <div className="main-layout">
      <SidebarNew 
        user={user} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`main-layout-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AppHeader
          user={user}
          onLogout={handleLogout}
        />
        <Breadcrumb />
        <main className="main-layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
