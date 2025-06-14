// src/services/DashboardConfigService.ts

import { DashboardConfig } from '../types/DashboardConfig';

export class DashboardConfigService {
  private static readonly STORAGE_KEY = 'dashboard_configurations';
  
  // Default dashboard configuration
  static readonly DEFAULT_CONFIG: DashboardConfig = {
    id: 'default',
    name: 'Default Dashboard',
    description: 'Default dashboard layout',
    columns: 12,
    rowHeight: 60,
    isDefault: true,
    widgets: [
      {
        id: 'auto-distrib',
        type: 'auto-distrib',
        title: 'Auto Distribution',
        width: 6,
        height: 4,
        x: 0,
        y: 0
      },
      {
        id: 'status-chart',
        type: 'status-chart',
        title: 'Status Distribution',
        width: 6,
        height: 4,
        x: 6,
        y: 0
      },
      {
        id: 'hourly-chart',
        type: 'hourly-chart',
        title: 'Hourly Activity',
        width: 12,
        height: 5,
        x: 0,
        y: 4
      },
      {
        id: 'mailbox-chart',
        type: 'mailbox-chart',
        title: 'Mailbox Status',
        width: 12,
        height: 6,
        x: 0,
        y: 9
      }
    ]
  };
  
  // Save a dashboard configuration
  static saveDashboardConfig(config: DashboardConfig): void {
    const configs = this.getAllDashboardConfigs();
    const existingIndex = configs.findIndex(c => c.id === config.id);
    
    if (existingIndex >= 0) {
      configs[existingIndex] = config;
    } else {
      configs.push(config);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configs));
  }
  
  // Get a dashboard configuration by ID
  static getDashboardConfig(id: string): DashboardConfig {
    const configs = this.getAllDashboardConfigs();
    const config = configs.find(c => c.id === id);
    
    return config || this.DEFAULT_CONFIG;
  }
  
  // Get all dashboard configurations
  static getAllDashboardConfigs(): DashboardConfig[] {
    const configsJson = localStorage.getItem(this.STORAGE_KEY);
    
    if (!configsJson) {
      return [this.DEFAULT_CONFIG];
    }
    
    try {
      const configs = JSON.parse(configsJson) as DashboardConfig[];
      
      // Make sure the default config is always included
      if (!configs.some(c => c.id === 'default')) {
        configs.unshift(this.DEFAULT_CONFIG);
      }
      
      return configs;
    } catch (error) {
      console.error('Error parsing dashboard configurations:', error);
      return [this.DEFAULT_CONFIG];
    }
  }
  
  // Delete a dashboard configuration
  static deleteDashboardConfig(id: string): void {
    // Don't allow deleting the default config
    if (id === 'default') {
      return;
    }
    
    const configs = this.getAllDashboardConfigs();
    const filteredConfigs = configs.filter(c => c.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredConfigs));
  }
  
  // Create a new dashboard configuration
  static createNewDashboardConfig(name: string, description?: string): DashboardConfig {
    return {
      id: `dashboard-${Date.now()}`,
      name,
      description,
      columns: 12,
      rowHeight: 60,
      widgets: []
    };
  }
}