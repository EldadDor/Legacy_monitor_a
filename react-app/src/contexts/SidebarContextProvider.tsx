// /react-app/src/contexts/SidebarContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const MOBILE_VIEW_WIDTH = 992; // Same as the original AngularJS implementation

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  
  // Initialize from localStorage (replacing $cookieStore)
  useEffect(() => {
    const storedToggle = localStorage.getItem('sidebarToggle');
    if (storedToggle !== null) {
      setIsCollapsed(storedToggle === 'true');
    } else {
      // Default: expanded on desktop, collapsed on mobile
      setIsCollapsed(window.innerWidth < MOBILE_VIEW_WIDTH);
    }
  }, []);
  
  // Handle window resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MOBILE_VIEW_WIDTH) {
        setIsCollapsed(true);
      } else {
        // Restore saved preference on desktop
        const storedToggle = localStorage.getItem('sidebarToggle');
        if (storedToggle !== null) {
          setIsCollapsed(storedToggle === 'true');
        } else {
          setIsCollapsed(false);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Toggle sidebar function
  const toggleSidebar = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem('sidebarToggle', String(newValue));
  };
  
  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};