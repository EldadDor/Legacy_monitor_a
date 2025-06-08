// /react-app/src/hooks/useSplunkService.ts

import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContextProvider';

// Define the chart data interface
interface ChartData {
  hourlyData: Array<{
    hour: string;
    count: number;
  }>;
  mailboxData: Array<{
    name: string;
    completed: number;
    inProgress: number;
  }>;
  statusData: Array<{
    status: string;
    count: number;
  }>;
}

// Define response interfaces
interface SearchResponse {
  data: string; // Changed to string to be consistent
  query: string;
}

export const useSplunkService = () => {
  const { getCurrentDataSource } = useAuth();

  // Function for general search results
  const getSearchResults = useCallback(async (
      sourceType: string,
      source: string,
      searchTerm: string,
      earliestTime?: string,
      latestTime?: string
  ): Promise<SearchResponse> => {
    try {
      // In a real app, this would be an API call to your Splunk service
      // For now, we'll simulate the response

      console.log(`Searching ${sourceType} for "${searchTerm}" in ${source}`);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock response - convert number to string for consistency
      return {
        data: Math.floor(Math.random() * 100).toString(), // Convert to string
        query: `index=ifs sourcetype=${sourceType} source=${source} "${searchTerm}" | stats count`
      };
    } catch (error) {
      console.error('Error in Splunk search:', error);
      throw error;
    }
  }, []);

  // Function for count search results
  const getCountSearchResults = useCallback(async (
      sourceType: string,
      source: string,
      searchTerm: string
  ): Promise<SearchResponse> => {
    return getSearchResults(sourceType, source, searchTerm, '-24h', 'now');
  }, [getSearchResults]);

  // Function to get chart data
  const getChartData = useCallback(async (
      sourceType: string,
      dataSource: string
  ): Promise<ChartData> => {
    try {
      // In a real app, this would be an API call to fetch all chart data
      // For now, we'll simulate the response with mock data

      console.log(`Fetching chart data for ${sourceType} in ${dataSource}`);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate hourly data (last 12 hours)
      const hourlyData = Array.from({ length: 12 }, (_, i) => {
        const hour = String(i).padStart(2, '0') + ':00';
        return {
          hour,
          count: Math.floor(Math.random() * 50) // Random count between 0-50
        };
      });

      // Generate mailbox data (5 mailboxes)
      const mailboxNames = ['Inbox', 'Processing', 'Review', 'Archive', 'Exceptions'];
      const mailboxData = mailboxNames.map(name => ({
        name,
        completed: Math.floor(Math.random() * 100), // Random between 0-100
        inProgress: Math.floor(Math.random() * 30)  // Random between 0-30
      }));

      // Generate status data
      const statusData = [
        { status: 'Completed', count: Math.floor(Math.random() * 200 + 100) },
        { status: 'In Progress', count: Math.floor(Math.random() * 100) },
        { status: 'Failed', count: Math.floor(Math.random() * 20) },
        { status: 'Waiting', count: Math.floor(Math.random() * 50) }
      ];

      return {
        hourlyData,
        mailboxData,
        statusData
      };
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Return empty data on error
      return {
        hourlyData: [],
        mailboxData: [],
        statusData: []
      };
    }
  }, []);

  // Function for digital search results
  const getDigitalSearchResults = useCallback(async (
      queryDigital: string,
      earliestTime?: string,
      latestTime?: string
  ): Promise<SearchResponse> => {
    // Implementation for digital search results
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      data: JSON.stringify({
        results: [
          { timestamp: new Date().toISOString(), message: "Log entry 1" },
          { timestamp: new Date().toISOString(), message: "Log entry 2" }
        ]
      }),
      query: queryDigital
    };
  }, []);

  return {
    getSearchResults,
    getCountSearchResults,
    getDigitalSearchResults,
    getChartData
  };
};