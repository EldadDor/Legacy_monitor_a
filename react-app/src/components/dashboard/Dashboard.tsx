// /react-app/src/components/dashboard/Dashboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContextProvider';
import { useSplunkService } from '../../hooks/useSplunkService';
import { Constants } from '../../utils/constantsConfiguration';
import { Server } from '../../types/Server';

import './DashboardStyles.css';

// Import shared components
import Widget from '../../shared/WidgetComponent';
import WidgetHeader from '../../shared/WidgetHeader';
import WidgetBody from '../../shared/WidgetBody';
import WidgetFooter from '../../shared/WidgetFooter';

// Import chart components
import { BarChart, HorizontalChart, MailboxChart } from '../charts';

// Import server table components
import ServerTableGroup, { ServerTableConfig } from '../servers/ServerTableGroup';
import { ServerTableService } from '../../services/ServerTableService';
import { controlService } from '../../services/controlService';

const Dashboard: React.FC = () => {
    const { isAuthenticated, getCurrentIfsSourceType, getCurrentDataSource } = useAuth();
    const { getCountSearchResults, getChartData } = useSplunkService();

    // State variables for auto-distribution data
    const [autoDistrib, setAutoDistrib] = useState<string | number>("");
    const [autoDistribQuery, setAutoDistribQuery] = useState<string>("");
    const [lastCheckDate, setLastCheckDate] = useState<number>(Date.now());

    // State variables for charts
    const [hourlyData, setHourlyData] = useState<any[]>([]);
    const [mailboxData, setMailboxData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // State for server tables - combined and separate for primary/secondary
    const [serverTableConfigs, setServerTableConfigs] = useState<ServerTableConfig[]>(
        ServerTableService.getEmptyTableConfigs()
    );

    // Add these two state variables for primary and secondary server configs
    // Fixed by removing the arguments to getEmptyTableConfigs()
    const [primaryServerConfigs, setPrimaryServerConfigs] = useState<ServerTableConfig[]>(
        ServerTableService.getEmptyTableConfigs()
    );
    const [secondaryServerConfigs, setSecondaryServerConfigs] = useState<ServerTableConfig[]>(
        ServerTableService.getEmptyTableConfigs()
    );

    const [serverData, setServerData] = useState<Record<string, Server[]>>({});
    const [controlStates, setControlStates] = useState<Record<string, boolean>>({});
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    // Handle server actions
    const handleServerAction = useCallback((action: string, selectedServers: Server[], tableType: string) => {
        console.log(`Dashboard action: ${action} on ${selectedServers.length} servers of type: ${tableType}`);

        // Update loading state for this table type
        setLoadingStates(prev => ({ ...prev, [tableType]: true }));

        // Here you would call your control service
        // Example implementation:
        /*
        controlService.performServerAction(action, selectedServers, tableType)
          .then(() => {
            // Refresh server data for this table type
            fetchServerData(tableType);
          })
          .catch(error => {
            console.error(`Failed to perform ${action} on ${tableType} servers:`, error);
          })
          .finally(() => {
            setLoadingStates(prev => ({ ...prev, [tableType]: false }));
          });
        */

        // For now, just simulate the action
        setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, [tableType]: false }));
        }, 1000);
    }, []);

    // Handle control toggle
    const handleToggleControl = useCallback((tableId: string, control: boolean) => {
        setControlStates(prev => ({ ...prev, [tableId]: control }));

        // Call your control service to update the backend
        // controlService.toggleControl(tableId, control, getCurrentEnv());

        console.log(`Control for ${tableId} set to: ${control}`);
    }, []);

    // Filter server configs by type
    const filterServerConfigsByType = useCallback((configs: ServerTableConfig[], primaryTypes: string[]) => {
        // Create a set of primary server types for faster lookup
        const primaryTypesSet = new Set(primaryTypes);

        // Split configs into primary and secondary
        const primary: ServerTableConfig[] = [];
        const secondary: ServerTableConfig[] = [];

        configs.forEach(config => {
            if (primaryTypesSet.has(config.type)) {
                primary.push(config);
            } else {
                secondary.push(config);
            }
        });

        return { primary, secondary };
    }, []);

    // Fetch server data for all types
    const fetchAllServerData = useCallback(async () => {
        const serverTypes = ServerTableService.getServerTypes();
        const newServerData: Record<string, Server[]> = {};
        const newLoadingStates: Record<string, boolean> = {};

        // Set all to loading
        serverTypes.forEach(type => {
            newLoadingStates[type.id] = true;
        });
        setLoadingStates(newLoadingStates);

        try {
            // Get all servers once
            const allServers = await controlService.getServers();

            // Filter servers by type and organize them into the newServerData object
            serverTypes.forEach(typeConfig => {
                const serversOfType = allServers.filter(server =>
                    server.name.startsWith(typeConfig.type) || server.type === typeConfig.type
                );

                // Add type information if not present
                newServerData[typeConfig.id] = serversOfType.map(server => ({
                    ...server,
                    id: server.id || `${server.name}-${Math.random().toString(36).substring(2, 9)}`,
                    serverState: server.status || 'Unknown',
                    type: server.type || typeConfig.type
                }));

                // Mark this type as loaded
                newLoadingStates[typeConfig.id] = false;
            });

            setServerData(newServerData);
            setLoadingStates(newLoadingStates);

            // Update all configs together
            const allConfigs = ServerTableService.createTableConfigs(
                newServerData,
                controlStates,
                newLoadingStates
            );

            setServerTableConfigs(allConfigs);

            // Define which server types are primary (important)
            const primaryServerTypes = ['astro', 'ifs'];

            // Split the configs into primary and secondary
            const { primary, secondary } = filterServerConfigsByType(allConfigs, primaryServerTypes);

            // Update primary and secondary configs separately
            setPrimaryServerConfigs(primary);
            setSecondaryServerConfigs(secondary);

        } catch (error) {
            console.error("Failed to fetch server data:", error);
            // Reset loading states
            const resetLoadingStates: Record<string, boolean> = {};
            serverTypes.forEach(type => {
                resetLoadingStates[type.id] = false;
            });
            setLoadingStates(resetLoadingStates);
        }
    }, [controlStates, filterServerConfigsByType]);

    // Fetch dashboard data (charts + servers)
    const fetchDashboardData = useCallback(async () => {
        setLastCheckDate(Date.now());
        setIsLoading(true);

        try {
            const ifsSourceType = getCurrentIfsSourceType();
            const dataSource = getCurrentDataSource();

            // Fetch chart data
            const [autoDistribResponse, chartResponse] = await Promise.all([
                getCountSearchResults(ifsSourceType, "auto-distrib", "Basket created"),
                getChartData(ifsSourceType, dataSource)
            ]);

            setAutoDistrib(autoDistribResponse.data.toString());
            setAutoDistribQuery(autoDistribResponse.query);

            if (chartResponse) {
                setHourlyData(chartResponse.hourlyData || []);
                setMailboxData(chartResponse.mailboxData || []);
                setStatusData(chartResponse.statusData || []);
            }

            // Fetch server data
            await fetchAllServerData();

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            setAutoDistrib("Error");
            setHourlyData([]);
            setMailboxData([]);
            setStatusData([]);
        } finally {
            setIsLoading(false);
        }
    }, [getCurrentIfsSourceType, getCurrentDataSource, getCountSearchResults, getChartData, fetchAllServerData]);

    // Initial data load
    useEffect(() => {
        if (isAuthenticated) {
            fetchDashboardData();

            const intervalId = setInterval(() => {
                fetchDashboardData();
            }, 60000);

            return () => {
                console.log("Cleaning up dashboard interval");
                clearInterval(intervalId);
            };
        }
    }, [isAuthenticated, fetchDashboardData]);

    // Event listener for data updates
    useEffect(() => {
        const handleDataUpdate = () => {
            setAutoDistrib("");
            setHourlyData([]);
            setMailboxData([]);
            setStatusData([]);
            fetchDashboardData();
        };

        document.addEventListener(Constants.EVENTS.UPDATE_DATA, handleDataUpdate);

        return () => {
            document.removeEventListener(Constants.EVENTS.UPDATE_DATA, handleDataUpdate);
        };
    }, [fetchDashboardData]);

    // Sample data for testing
    const sampleHourlyData = [
        { hour: '00:00', count: 12 }, { hour: '01:00', count: 8 }, { hour: '02:00', count: 5 },
        { hour: '03:00', count: 3 }, { hour: '04:00', count: 2 }, { hour: '05:00', count: 4 },
        { hour: '06:00', count: 7 }, { hour: '07:00', count: 15 }, { hour: '08:00', count: 25 },
        { hour: '09:00', count: 32 }, { hour: '10:00', count: 28 }, { hour: '11:00', count: 20 },
    ];

    const sampleMailboxData = [
        { name: 'Mailbox 1', completed: 45, inProgress: 12 }, { name: 'Mailbox 2', completed: 32, inProgress: 8 },
        { name: 'Mailbox 3', completed: 60, inProgress: 5 }, { name: 'Mailbox 4', completed: 28, inProgress: 15 },
        { name: 'Mailbox 5', completed: 40, inProgress: 10 },
    ];

    const sampleStatusData = [
        { status: 'Completed', count: 235 }, { status: 'In Progress', count: 75 },
        { status: 'Failed', count: 12 }, { status: 'Waiting', count: 45 },
    ];

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>

            <div className="dashboard-widgets">
                {/* Auto Distribution Widget */}
                <Widget>
                    <WidgetHeader title="Auto Distribution" />
                    <WidgetBody loading={isLoading}>
                        <div className="auto-distrib-stats">
                            <h3>Baskets Created Today</h3>
                            <div className="stats-value">{autoDistrib || "0"}</div>
                            {autoDistribQuery && (
                                <div className="stats-query">
                                    <small>Query: {autoDistribQuery}</small>
                                </div>
                            )}
                        </div>
                    </WidgetBody>
                    <WidgetFooter>
                        <small>Last updated: {new Date(lastCheckDate).toLocaleTimeString()}</small>
                    </WidgetFooter>
                </Widget>

                {/* Status Distribution Widget */}
                <Widget>
                    <WidgetHeader title="Status Distribution" />
                    <WidgetBody loading={isLoading}>
                        <HorizontalChart
                            data={statusData.length > 0 ? statusData : sampleStatusData}
                            yAxisDataKey="status"
                            bars={[
                                { dataKey: 'count', fill: '#8884d8', name: 'Count' }
                            ]}
                            height={250}
                        />
                    </WidgetBody>
                    <WidgetFooter>
                        <small>Last updated: {new Date(lastCheckDate).toLocaleTimeString()}</small>
                    </WidgetFooter>
                </Widget>

                {/* Hourly Activity Chart - Full Width */}
                <Widget className="full-width">
                    <WidgetHeader title="Hourly Activity" />
                    <WidgetBody loading={isLoading}>
                        <BarChart
                            data={hourlyData.length > 0 ? hourlyData : sampleHourlyData}
                            xAxisDataKey="hour"
                            bars={[
                                { dataKey: 'count', fill: '#8884d8', name: 'Activity' }
                            ]}
                            title="Baskets Created per Hour"
                            height={300}
                        />
                    </WidgetBody>
                    <WidgetFooter>
                        <small>Last updated: {new Date(lastCheckDate).toLocaleTimeString()}</small>
                    </WidgetFooter>
                </Widget>

                {/* Mailbox Status Chart - Full Width */}
                <Widget className="full-width">
                    <WidgetHeader title="Mailbox Status" />
                    <WidgetBody loading={isLoading}>
                        <MailboxChart
                            mailboxData={mailboxData.length > 0 ? mailboxData : sampleMailboxData}
                            title="Items by Mailbox"
                            height={350}
                        />
                    </WidgetBody>
                    <WidgetFooter>
                        <small>Last updated: {new Date(lastCheckDate).toLocaleTimeString()}</small>
                    </WidgetFooter>
                </Widget>
            </div>

            {/* Primary Server Management Section */}
            <div className="primary-server-management-section">
                <h2 className="section-header mb-3">
                    Primary Server Management
                    <span className="section-subtitle">Critical Production Servers</span>
                </h2>

                <ServerTableGroup
                    tables={primaryServerConfigs}
                    onServerAction={handleServerAction}
                    onToggleControl={handleToggleControl}
                    layout="grid"
                    allowCollapse={false}
                    className="primary-servers"
                />
            </div>

            {/* Secondary Server Management Section */}
            <div className="secondary-server-management-section">
                <h2 className="section-header mb-3">
                    Secondary Services
                    <span className="section-subtitle">Supporting & Utility Servers</span>
                </h2>

                <ServerTableGroup
                    tables={secondaryServerConfigs}
                    onServerAction={handleServerAction}
                    onToggleControl={handleToggleControl}
                    layout="stacked"
                    allowCollapse={true}
                    className="secondary-servers"
                />
            </div>

            <div className="last-updated-info text-end mt-3">
                <small className="text-muted">
                    Server data last updated: {new Date(lastCheckDate).toLocaleTimeString()}
                </small>
            </div>
        </div>
    );
};

export default Dashboard;