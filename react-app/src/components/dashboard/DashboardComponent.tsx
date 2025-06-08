// /react-app/src/components/dashboard/DashboardComponent.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContextProvider';
import { useSplunkService } from '../../hooks/useSplunkService';
import { Constants } from '../../utils/constantsConfiguration';
import './DashboardStyles.css';

// Import shared components
import Widget from '../../shared/WidgetComponent';
import WidgetHeader from '../../shared/WidgetHeader';
import WidgetBody from '../../shared/WidgetBody';
import WidgetFooter from '../../shared/WidgetFooter';

// Import chart components
import { BarChart, HorizontalChart, MailboxChart, RateChart, BarMailboxChart } from '../charts';


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

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLastCheckDate(Date.now());
    setIsLoading(true);

    try {
      const ifsSourceType = getCurrentIfsSourceType();
      const dataSource = getCurrentDataSource();

      // Fetch auto-distrib count
      const autoDistribResponse = await getCountSearchResults(ifsSourceType, "auto-distrib", "Basket created");
      setAutoDistrib(autoDistribResponse.data.toString());

      setAutoDistribQuery(autoDistribResponse.query);

      // Fetch chart data
      const chartResponse = await getChartData(ifsSourceType, dataSource);

      // Update chart data states
      if (chartResponse) {
        setHourlyData(chartResponse.hourlyData || []);
        setMailboxData(chartResponse.mailboxData || []);
        setStatusData(chartResponse.statusData || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Set default values in case of error
      setAutoDistrib("Error");
      setHourlyData([]);
      setMailboxData([]);
      setStatusData([]);
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentIfsSourceType, getCurrentDataSource, getCountSearchResults, getChartData]);

  // Initial data load
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();

      // Set up polling interval (60 seconds)
      const intervalId = setInterval(() => {
        fetchDashboardData();
      }, 60000);

      // Clean up interval on component unmount
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

    // Subscribe to update event
    document.addEventListener(Constants.EVENTS.UPDATE_DATA, handleDataUpdate);

    // Clean up event listener
    return () => {
      document.removeEventListener(Constants.EVENTS.UPDATE_DATA, handleDataUpdate);
    };
  }, [fetchDashboardData]);

  // Sample data for testing/preview when actual data is not available
  const sampleHourlyData = [
    { hour: '00:00', count: 12 },
    { hour: '01:00', count: 8 },
    { hour: '02:00', count: 5 },
    { hour: '03:00', count: 3 },
    { hour: '04:00', count: 2 },
    { hour: '05:00', count: 4 },
    { hour: '06:00', count: 7 },
    { hour: '07:00', count: 15 },
    { hour: '08:00', count: 25 },
    { hour: '09:00', count: 32 },
    { hour: '10:00', count: 28 },
    { hour: '11:00', count: 20 },
  ];

  const sampleMailboxData = [
    { name: 'Mailbox 1', completed: 45, inProgress: 12 },
    { name: 'Mailbox 2', completed: 32, inProgress: 8 },
    { name: 'Mailbox 3', completed: 60, inProgress: 5 },
    { name: 'Mailbox 4', completed: 28, inProgress: 15 },
    { name: 'Mailbox 5', completed: 40, inProgress: 10 },
  ];

  const sampleStatusData = [
    { status: 'Completed', count: 235 },
    { status: 'In Progress', count: 75 },
    { status: 'Failed', count: 12 },
    { status: 'Waiting', count: 45 },
  ];

  // If not authenticated, don't render
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
      </div>
  );
};

export default Dashboard;