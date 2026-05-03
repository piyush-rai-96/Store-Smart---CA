import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppTopBar } from '../AppTopBar/AppTopBar';
import { AppSidebar } from '../AppSidebar/AppSidebar';
import { Breadcrumb } from '../../common/Breadcrumb';
import { AICopilot } from '../../../pages/AICopilot';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../types';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  return (
    <div className="main-layout">
      {/* Sticky left column — naturally reserves 64px (collapsed) or 280px (open) */}
      <AppSidebar
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />
      {/* Right column — flex:1, takes all remaining width */}
      <div className="main-layout-content">
        <AppTopBar user={user} onLogout={handleLogout} />
        <div className="main-layout-body">
          <Breadcrumb />
          <main className="main-layout-main">
            <Outlet />
          </main>
        </div>
      </div>
      {/* Ask Alan panel — always mounted so it opens as an overlay on any screen */}
      <AICopilot />
    </div>
  );
};
