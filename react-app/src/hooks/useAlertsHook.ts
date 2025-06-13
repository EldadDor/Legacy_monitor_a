// src/hooks/useAlertsHook.ts
import { useState, useEffect, useCallback } from 'react';
import alertsService from '../services/AlertsService';
import { Server } from '../types/Server';

interface Alert {
    message: string;
    link?: string;
    type?: string;
}

interface UseAlertsReturn {
    alerts: Alert[];
    hostDownAlerts: any[];
    hostIdleAlerts: any[];
    addAlert: (message: string, type?: string, link?: string, env?: string) => void;
    addHostAlert: (server: Server, serverState: string, env?: string) => void;
    removeAlert: (message: string) => void;
    removeHostAlert: (server: Server, env?: string) => void;
    clearAlerts: () => void;
}

export const useAlerts = (): UseAlertsReturn => {
    const [alerts, setAlerts] = useState<Alert[]>(alertsService.getAlerts());
    const [hostDownAlerts, setHostDownAlerts] = useState<any[]>(alertsService.getHostDownAlerts());
    const [hostIdleAlerts, setHostIdleAlerts] = useState<any[]>(alertsService.getHostIdleAlerts());

    // Update local state when alerts change
    useEffect(() => {
        // Set up an interval to check for alerts
        const intervalId = setInterval(() => {
            setAlerts([...alertsService.getAlerts()]);
            setHostDownAlerts([...alertsService.getHostDownAlerts()]);
            setHostIdleAlerts([...alertsService.getHostIdleAlerts()]);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // Wrapper functions for alert service methods
    const addAlert = useCallback((message: string, type: string = 'warning', link?: string, env?: string) => {
        alertsService.addAlert(message, type, link, env);
        setAlerts([...alertsService.getAlerts()]);
    }, []);

    const addHostAlert = useCallback((server: Server, serverState: string, env?: string) => {
        alertsService.addHostAlert(server, serverState, env);
        setHostDownAlerts([...alertsService.getHostDownAlerts()]);
        setHostIdleAlerts([...alertsService.getHostIdleAlerts()]);
    }, []);

    const removeAlert = useCallback((message: string) => {
        alertsService.removeAlert(message);
        setAlerts([...alertsService.getAlerts()]);
    }, []);

    const removeHostAlert = useCallback((server: Server, env?: string) => {
        alertsService.removeHostAlert(server, env);
        setHostDownAlerts([...alertsService.getHostDownAlerts()]);
        setHostIdleAlerts([...alertsService.getHostIdleAlerts()]);
    }, []);

    const clearAlerts = useCallback(() => {
        alertsService.clearAlerts();
        setAlerts([]);
        setHostDownAlerts([]);
        setHostIdleAlerts([]);
    }, []);

    return {
        alerts,
        hostDownAlerts,
        hostIdleAlerts,
        addAlert,
        addHostAlert,
        removeAlert,
        removeHostAlert,
        clearAlerts
    };
};