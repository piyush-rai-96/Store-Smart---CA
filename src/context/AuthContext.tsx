import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { VALID_CREDENTIALS, AUTH_STORAGE_KEY } from '../constants/auth';
import { storage } from '../utils/storage';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedAuth = storage.get<{ user: User }>(AUTH_STORAGE_KEY);
      // Validate that stored user has required new fields
      if (storedAuth && storedAuth.user && storedAuth.user.id && storedAuth.user.role) {
        setIsAuthenticated(true);
        setUser(storedAuth.user);
      } else if (storedAuth) {
        // Clear invalid old data
        storage.remove(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      // Clear corrupted data
      storage.remove(AUTH_STORAGE_KEY);
    }
  }, []);

  // Login function - validates credentials and updates state
  const login = (email: string, password: string): boolean => {
    // Validate credentials
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      const userData: User = {
        id: 'user-001',
        email: email,
        name: 'John Doe',
        role: 'DM', // District Manager role
        district: 'District 14 - Tennessee',
        districtId: 'D14',
      };

      // Update state
      setIsAuthenticated(true);
      setUser(userData);

      // Persist to localStorage
      storage.set(AUTH_STORAGE_KEY, { user: userData });

      return true;
    }

    return false;
  };

  // Logout function - clears state and storage
  const logout = (): void => {
    setIsAuthenticated(false);
    setUser(null);
    storage.remove(AUTH_STORAGE_KEY);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
