// /react-app/src/hooks/useAlerts.ts

import { useState, useCallback, useEffect } from 'react';

export interface Alert {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  timeout?: number; // Time in milliseconds before auto-dismissal
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Add a new alert
  const addAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAlert = { ...alert, id };
    
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
    
    // Auto-dismiss alert if timeout is specified
    if (alert.timeout) {
      setTimeout(() => {
        removeAlert(newAlert.id);
      }, alert.timeout);
    }
    
    return newAlert.id;
  }, []);

  // Remove an alert by ID
  const removeAlert = useCallback((id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  }, []);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Convenience methods for different alert types
  const success = useCallback((message: string, timeout = 5000) => {
    return addAlert({ message, type: 'success', timeout });
  }, [addAlert]);

  const info = useCallback((message: string, timeout = 5000) => {
    return addAlert({ message, type: 'info', timeout });
  }, [addAlert]);

  const warning = useCallback((message: string, timeout = 5000) => {
    return addAlert({ message, type: 'warning', timeout });
  }, [addAlert]);

  const error = useCallback((message: string, timeout = 8000) => {
    return addAlert({ message, type: 'danger', timeout });
  }, [addAlert]);

  // Listen for global alert events
  useEffect(() => {
    const handleGlobalAlert = (event: CustomEvent) => {
      const { message, type, timeout } = event.detail;
      addAlert({ message, type, timeout });
    };

    // Cast is needed because CustomEvent isn't recognized in the standard Event type
    document.addEventListener('app:alert', handleGlobalAlert as EventListener);
    
    return () => {
      document.removeEventListener('app:alert', handleGlobalAlert as EventListener);
    };
  }, [addAlert]);

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    success,
    info,
    warning,
    error
  };
};