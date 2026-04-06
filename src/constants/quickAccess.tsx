import { BarChart3, Store, Bot, ClipboardCheck, MessageSquare, TrendingUp, Package, Users } from 'lucide-react';
import { QuickAccessCard } from '../types/quickAccess';

// Quick Access Cards Configuration
export const QUICK_ACCESS_CARDS: QuickAccessCard[] = [
  // District Manager Cards
  {
    id: 'my-district',
    title: 'My District',
    subtitle: '24 Stores',
    icon: <BarChart3 size={48} />,
    badge: {
      label: 'DPI 92.4',
      color: 'success',
    },
    route: '/district',
    roles: ['DM', 'RD'],
    order: 1,
    isComingSoon: true,
  },
  {
    id: 'store-leaderboard',
    title: 'Store Leaderboard',
    subtitle: 'View All',
    icon: <Store size={48} />,
    badge: {
      label: 'Top: #1142',
      color: 'info',
    },
    route: '/leaderboard',
    roles: ['DM', 'RD'],
    order: 2,
    isComingSoon: true,
  },
  
  // Store Manager Cards
  {
    id: 'my-store',
    title: 'My Store Dashboard',
    subtitle: 'Store #1142',
    icon: <Store size={48} />,
    badge: {
      label: 'DPI 95.4',
      color: 'success',
    },
    route: '/store',
    roles: ['SM'],
    order: 1,
    isComingSoon: true,
  },
  {
    id: 'inventory-pog',
    title: 'Inventory & POG',
    subtitle: 'Current POG',
    icon: <Package size={48} />,
    badge: {
      label: 'Spring 2026',
      color: 'info',
    },
    route: '/inventory',
    roles: ['SM'],
    order: 2,
    isComingSoon: true,
  },
  
  // Shared Cards
  {
    id: 'copilot',
    title: 'Co-Pilot AI',
    subtitle: 'Ask Me Anything',
    icon: <Bot size={48} />,
    badge: {
      label: 'Available',
      color: 'success',
    },
    route: '/copilot',
    roles: ['DM', 'SM', 'RD', 'ADMIN'],
    order: 3,
    isComingSoon: true,
  },
  {
    id: 'latest-audit',
    title: 'Latest SEA Audit',
    subtitle: 'District Avg',
    icon: <ClipboardCheck size={48} />,
    badge: {
      label: '86.2%',
      color: 'warning',
    },
    route: '/audit',
    roles: ['DM', 'SM', 'RD'],
    order: 4,
    isComingSoon: true,
  },
  {
    id: 'messages',
    title: 'Recent Messages',
    subtitle: 'Conversations',
    icon: <MessageSquare size={48} />,
    badge: {
      label: '5 New',
      color: 'error',
    },
    route: '/messages',
    roles: ['DM', 'SM', 'RD', 'ADMIN'],
    order: 5,
    isComingSoon: true,
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    subtitle: 'View Reports',
    icon: <TrendingUp size={48} />,
    badge: {
      label: 'Updated Today',
      color: 'info',
    },
    route: '/reports',
    roles: ['DM', 'RD', 'ADMIN'],
    order: 6,
    isComingSoon: true,
  },
  {
    id: 'team',
    title: 'Team Management',
    subtitle: 'My Team',
    icon: <Users size={48} />,
    badge: {
      label: '12 Members',
      color: 'default',
    },
    route: '/team',
    roles: ['SM'],
    order: 6,
    isComingSoon: true,
  },
];
