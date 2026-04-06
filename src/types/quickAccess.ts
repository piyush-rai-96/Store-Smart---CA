import { ReactNode } from 'react';
import { UserRole } from './index';

// Quick Access Card Badge
export interface QuickAccessBadge {
  label: string;
  color: 'success' | 'warning' | 'error' | 'info' | 'default';
  variant?: 'filled' | 'outlined';
}

// Quick Access Card interface
export interface QuickAccessCard {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  badge?: QuickAccessBadge;
  route?: string;
  onClick?: () => void;
  roles: UserRole[];
  order: number;
  isComingSoon?: boolean;
}
