// src/types/DashboardConfig.ts

export interface WidgetConfig {
  id: string;
  type: string;  // e.g., "bar-chart", "status-chart", "server-table"
  title: string;
  width: number;  // Width in grid units
  height: number; // Height in grid units
  x: number;      // X position in grid
  y: number;      // Y position in grid
  config?: any;   // Widget-specific configuration
}

export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  columns: number;
  rowHeight: number;
  widgets: WidgetConfig[];
  isDefault?: boolean;
}