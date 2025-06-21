
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'default' | 'dark-red' | 'light';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContextProvider = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContextProvider);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeType;
    return savedTheme || 'default';
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('app-theme', theme);
    
    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContextProvider.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContextProvider.Provider>
  );
};