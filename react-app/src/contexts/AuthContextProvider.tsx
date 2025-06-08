// Update to /react-app/src/contexts/AuthContextProvider.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Constants } from '../utils/constantsConfiguration';

interface User {
  username: string;
  roles: string[];
  dataSource: string;
  env: string;
  ifsSourceType: string;
  // Add other user properties as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentIfsSourceType: () => string;
  getCurrentDataSource: () => string;
  setCurrentDataSource: (dataSource: string) => void;
  getCurrentEnv: () => string;
  setCurrentEnv: (env: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize auth state from local storage OR auto-login for development
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      // AUTO-LOGIN FOR DEVELOPMENT
      // Set to false when not needed for testing
      const devModeEnabled = true; // Toggle this to enable/disable auto-login

      if (devModeEnabled) {
        console.log('DEV MODE: Auto-login enabled');
        const userData: User = {
          username: 'dev-user',
          roles: ['ADMIN', 'USER'],
          dataSource: Constants.DATA_SOURCES.PROD,
          env: Constants.ENV.PROD,
          ifsSourceType: 'default-source-type'
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));

        // Trigger data update event
        document.dispatchEvent(new Event(Constants.EVENTS.UPDATE_DATA));
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real application, this would be an API call
      // For now, simulate the authentication process

      // Example API call (replace with your actual API)
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });

      // For demonstration, simulate a successful login
      // In development mode, accept any credentials
      const devModeEnabled = true; // Should match the above setting

      if (devModeEnabled || (username === 'admin' && password === 'password')) {
        const userData: User = {
          username: username || 'dev-user',
          roles: ['ADMIN', 'USER'],
          dataSource: Constants.DATA_SOURCES.PROD,
          env: Constants.ENV.PROD,
          ifsSourceType: 'default-source-type'
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));

        // Trigger data update event
        document.dispatchEvent(new Event(Constants.EVENTS.UPDATE_DATA));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear authentication state
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');

    // In a real application, you might also want to call a logout API
    // Example: await fetch('/api/auth/logout', { method: 'POST' });
  };

  const getCurrentIfsSourceType = () => {
    if (!user) return 'default-source-type';

    // Logic similar to the original authentication.service.js
    let ifsSourceType = "ifs";
    if (user.env !== Constants.ENV.PROD) {
      ifsSourceType += "-dev";
    }
    return user.ifsSourceType || ifsSourceType;
  };

  const getCurrentDataSource = () => {
    return user?.dataSource || Constants.DATA_SOURCES.PROD;
  };

  const setCurrentDataSource = (dataSource: string) => {
    if (user) {
      const updatedUser = { ...user, dataSource };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Trigger data update event
      document.dispatchEvent(new Event(Constants.EVENTS.UPDATE_DATA));
    }
  };

  const getCurrentEnv = () => {
    return user?.env || Constants.ENV.PROD;
  };

  const setCurrentEnv = (env: string) => {
    if (user) {
      const updatedUser = { ...user, env };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Trigger data update event
      document.dispatchEvent(new Event(Constants.EVENTS.UPDATE_DATA));

      // Update data source based on environment - similar to original logic
      if (env === Constants.ENV.PROD) {
        setCurrentDataSource(Constants.DATA_SOURCES.PROD);
      }
    }
  };

  return (
      <AuthContext.Provider value={{
        isAuthenticated,
        user,
        login,
        logout,
        getCurrentIfsSourceType,
        getCurrentDataSource,
        setCurrentDataSource,
        getCurrentEnv,
        setCurrentEnv
      }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};