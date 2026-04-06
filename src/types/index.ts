// User role types
export type UserRole = 'DM' | 'SM' | 'RD' | 'ADMIN';

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  district?: string;
  districtId?: string;
  store?: string;
  storeId?: string;
  avatar?: string;
}

// Auth context type
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
}

// Route paths - centralized for easy management
export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  HOME: '/home',
  MASTER_POG: '/planogram/master-pog',
} as const;
