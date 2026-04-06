import { UserRole } from '../types';

// Role display names
export const ROLE_NAMES: Record<UserRole, string> = {
  DM: 'District Manager',
  SM: 'Store Manager',
  RD: 'Regional Director',
  ADMIN: 'Administrator',
};

// Role badge colors
export const ROLE_COLORS: Record<UserRole, string> = {
  DM: '#1976d2',      // Blue
  SM: '#388e3c',      // Green
  RD: '#7b1fa2',      // Purple
  ADMIN: '#f57c00',   // Orange
};

// Role abbreviations
export const ROLE_ABBR: Record<UserRole, string> = {
  DM: 'DM',
  SM: 'SM',
  RD: 'RD',
  ADMIN: 'ADMIN',
};
