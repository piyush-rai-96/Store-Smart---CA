import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from 'impact-ui';
import './Breadcrumb.css';

const ROUTE_LABELS: Record<string, string> = {
  '/store-operations/home': 'My Space',
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
  'store-operations': 'Store Operations Hub',
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

  const list = [
    {
      label: 'Home',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/store-operations/home');
      },
      to: '/store-operations/home',
    },
    ...(sectionLabel ? [{ label: sectionLabel, disabled: true, to: '#' }] : []),
    { label: pageLabel, disabled: true, to: '#' },
  ];

  return (
    <nav className="breadcrumb-bar" aria-label="Breadcrumb">
      <Breadcrumbs list={list} />
    </nav>
  );
};
