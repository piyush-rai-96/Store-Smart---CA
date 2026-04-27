import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumb.css';

const ROUTE_LABELS: Record<string, string> = {
  '/store-operations/home': 'Home',
  '/store-operations/district-intelligence': 'District Intelligence',
  '/store-operations/store-deep-dive': 'Store Deep Dive',
  '/planogram/master-pog': 'Master POG Management',
  '/planogram/rule-management': 'POG Rule Management',
  '/planogram/localization-engine': 'POG Localization Engine',
  '/command-center/ai-copilot': 'AI Copilot',
  '/command-center/operations-queue': 'Operations Queue',
  '/command-center/communications': 'Communications',
  '/app-config/user-access': 'User Access Management',
};

const SECTION_LABELS: Record<string, string> = {
  'store-operations': 'Store Operations',
  'planogram': 'Planogram Intelligence',
  'command-center': 'Command Center',
  'app-config': 'Application Config',
};

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const pageLabel = ROUTE_LABELS[path];
  if (!pageLabel) return null;

  const segments = path.split('/').filter(Boolean);
  const sectionKey = segments[0];
  const sectionLabel = SECTION_LABELS[sectionKey];

  const isHome = path === '/store-operations/home';

  return (
    <nav className="breadcrumb-bar" aria-label="Breadcrumb">
      <button className="breadcrumb-home" onClick={() => navigate('/store-operations/home')} aria-label="Home">
        <Home size={13} />
      </button>
      {sectionLabel && !isHome && (
        <>
          <ChevronRight size={12} className="breadcrumb-sep" />
          <span className="breadcrumb-section">{sectionLabel}</span>
        </>
      )}
      {!isHome && (
        <>
          <ChevronRight size={12} className="breadcrumb-sep" />
          <span className="breadcrumb-current">{pageLabel}</span>
        </>
      )}
      {isHome && (
        <>
          <ChevronRight size={12} className="breadcrumb-sep" />
          <span className="breadcrumb-current">Dashboard</span>
        </>
      )}
    </nav>
  );
};
