import React, { useState, useEffect } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DashboardConfig, WidgetConfig } from '../../types/DashboardConfig';
import { BarChart, HorizontalChart, MailboxChart } from '../charts';
import { ServerTableConfig } from '../servers/ServerTableGroup';
import Widget from '../../shared/WidgetComponent';
import WidgetHeader from '../../shared/WidgetHeader';
import WidgetBody from '../../shared/WidgetBody';
import WidgetFooter from '../../shared/WidgetFooter';
import './CustomizableDashboard.css';

// Width provider adds responsiveness to the grid layout
const ReactGridLayout = WidthProvider(RGL);

interface CustomizableDashboardProps {
  initialConfig: DashboardConfig;
  chartData: {
    hourlyData: any[];
    mailboxData: any[];
    statusData: any[];
    autoDistrib: string | number;
    autoDistribQuery: string;
  };
  serverConfigs: {
    primaryServerConfigs: ServerTableConfig[];
    secondaryServerConfigs: ServerTableConfig[];
  };
  isLoading: boolean;
  lastCheckDate: number;
  onDashboardSave?: (dashboardConfig: DashboardConfig) => void;
}

const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
                                                                       initialConfig,
                                                                       chartData,
                                                                       serverConfigs,
                                                                       isLoading,
                                                                       lastCheckDate,
                                                                       onDashboardSave
                                                                     }) => {
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(initialConfig);
  const [isEditing, setIsEditing] = useState(false);

  // This function maps widget configurations to React components
  const renderWidget = (widget: WidgetConfig) => {
    const key = widget.id;

    switch (widget.type) {
      case 'auto-distrib':
        return (
            <div key={key} data-grid={{ ...widget }}>
              <Widget className="full-height">
                <WidgetHeader
                    title={widget.title}
                    onClose={isEditing ? () => removeWidget(widget.id) : undefined}
                />
                <WidgetBody loading={isLoading}>
                  <div className="auto-distrib-stats">
                    <h3>Baskets Created Today</h3>
                    <div className="stats-value">{chartData.autoDistrib || "0"}</div>
                    {chartData.autoDistribQuery && (
                        <div className="stats-query">
                          <small>Query: {chartData.autoDistribQuery}</small>
                        </div>
                    )}
                  </div>
                </WidgetBody>
                <WidgetFooter>
                  <small>Last updated: {new Date(lastCheckDate).toLocaleTimeString()}</small>
                </WidgetFooter>
              </Widget>
            </div>
        );

      case 'status-chart':
        return (
            <div key={key} data-grid={{ ...widget }}>
              <Widget className="full-height">
                <WidgetHeader
                    title={widget.title}
                    onClose={isEditing ? () => removeWidget(widget.id) : undefined}
                />
                <WidgetBody loading={isLoading}>
                  <HorizontalChart
                      data={chartData.statusData}
                      yAxisDataKey="status"
                      bars={[{ dataKey: 'count', fill: '#8884d8', name: 'Count' }]}
                      height={widget.height * 60 - 100} // Adjust height based on grid height
                  />
                </WidgetBody>
                <WidgetFooter>
                  <small>Last updated: {new Date(lastCheckDate).toLocaleTimeString()}</small>
                </WidgetFooter>
              </Widget>
            </div>
        );

      case 'hourly-chart':
        return (
            <div key={key} data-grid={{ ...widget }}>
              <Widget className="full-height">
                <WidgetHeader
                    title={widget.title}
                    onClose={isEditing ? () => removeWidget(widget.id) : undefined}
                />
                <WidgetBody loading={isLoading}>
                  <BarChart
                      data={chartData.hourlyData}
                      xAxisDataKey="hour"
                      bars={[{ dataKey: 'count', fill: '#8884d8', name: 'Activity' }]}
                      title="Baskets Created per Hour"
                      height={widget.height * 60 - 100} // Adjust height based on grid height
                  />
                </WidgetBody>
                <WidgetFooter>
                  <small>Last updated: {new Date(lastCheckDate).toLocaleTimeString()}</small>
                </WidgetFooter>
              </Widget>
            </div>
        );

      case 'mailbox-chart':
        return (
            <div key={key} data-grid={{ ...widget }}>
              <Widget className="full-height">
                <WidgetHeader
                    title={widget.title}
                    onClose={isEditing ? () => removeWidget(widget.id) : undefined}
                />
                <WidgetBody loading={isLoading}>
                  <MailboxChart
                      mailboxData={chartData.mailboxData}
                      title="Items by Mailbox"
                      height={widget.height * 60 - 100} // Adjust height based on grid height
                  />
                </WidgetBody>
                <WidgetFooter>
                  <small>Last updated: {new Date(lastCheckDate).toLocaleTimeString()}</small>
                </WidgetFooter>
              </Widget>
            </div>
        );

      default:
        return (
            <div key={key} data-grid={{ ...widget }}>
              <Widget className="full-height">
                <WidgetHeader
                    title={widget.title || "Unknown Widget"}
                    onClose={isEditing ? () => removeWidget(widget.id) : undefined}
                />
                <WidgetBody>
                  <div className="unknown-widget-message">
                    Unknown widget type: {widget.type}
                  </div>
                </WidgetBody>
              </Widget>
            </div>
        );
    }
  };

  // Add a new widget to the dashboard
  const addWidget = (widgetType: string) => {
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: getDefaultTitleForType(widgetType),
      width: getDefaultWidthForType(widgetType),
      height: getDefaultHeightForType(widgetType),
      x: 0, // Will be automatically positioned by react-grid-layout
      y: Infinity // Place at the bottom
    };

    setDashboardConfig(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }));
  };

  // Remove a widget from the dashboard
  const removeWidget = (widgetId: string) => {
    setDashboardConfig(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId)
    }));
  };

  // Get default title for a widget type
  const getDefaultTitleForType = (type: string): string => {
    const titleMap: Record<string, string> = {
      'auto-distrib': 'Auto Distribution',
      'status-chart': 'Status Distribution',
      'hourly-chart': 'Hourly Activity',
      'mailbox-chart': 'Mailbox Status'
    };

    return titleMap[type] || 'New Widget';
  };

  // Get default width for a widget type
  const getDefaultWidthForType = (type: string): number => {
    const widthMap: Record<string, number> = {
      'auto-distrib': 6,
      'status-chart': 6,
      'hourly-chart': 12,
      'mailbox-chart': 12
    };

    return widthMap[type] || 6;
  };

  // Get default height for a widget type
  const getDefaultHeightForType = (type: string): number => {
    const heightMap: Record<string, number> = {
      'auto-distrib': 4,
      'status-chart': 4,
      'hourly-chart': 5,
      'mailbox-chart': 6
    };

    return heightMap[type] || 4;
  };

  // Handle layout changes
  const handleLayoutChange = (layout: any) => {
    // Update widget positions and sizes based on new layout
    const updatedWidgets = dashboardConfig.widgets.map(widget => {
      const layoutItem = layout.find((item: any) => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          width: layoutItem.w,
          height: layoutItem.h
        };
      }
      return widget;
    });

    setDashboardConfig(prev => ({
      ...prev,
      widgets: updatedWidgets
    }));
  };

  // Save the current dashboard configuration
  const saveDashboardConfig = () => {
    if (onDashboardSave) {
      onDashboardSave(dashboardConfig);
    }

    setIsEditing(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Get layout configuration for react-grid-layout
  const getLayoutConfig = () => {
    return dashboardConfig.widgets.map(widget => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: widget.width,
      h: widget.height,
      minW: 3,
      minH: 2
    }));
  };

  return (
      <div className="customizable-dashboard">
        <div className="dashboard-toolbar">
          <div className="dashboard-actions">
            {isEditing ? (
                <>
                  <div className="widget-palette">
                    <button onClick={() => addWidget('auto-distrib')} className="btn btn-sm btn-outline-primary">
                      + Auto Distribution
                    </button>
                    <button onClick={() => addWidget('status-chart')} className="btn btn-sm btn-outline-primary">
                      + Status Chart
                    </button>
                    <button onClick={() => addWidget('hourly-chart')} className="btn btn-sm btn-outline-primary">
                      + Hourly Chart
                    </button>
                    <button onClick={() => addWidget('mailbox-chart')} className="btn btn-sm btn-outline-primary">
                      + Mailbox Chart
                    </button>
                  </div>
                  <button onClick={saveDashboardConfig} className="btn btn-success">
                    Save Layout
                  </button>
                  <button onClick={toggleEditMode} className="btn btn-outline-secondary">
                    Cancel
                  </button>
                </>
            ) : (
                <button onClick={toggleEditMode} className="btn btn-primary">
                  Customize Layout
                </button>
            )}
          </div>
        </div>

        <ReactGridLayout
            className="layout"
            layout={getLayoutConfig()}
            cols={dashboardConfig.columns}
            rowHeight={dashboardConfig.rowHeight}
            onLayoutChange={handleLayoutChange}
            isDraggable={isEditing}
            isResizable={isEditing}
            compactType="vertical"
            useCSSTransforms={true}
        >
          {dashboardConfig.widgets.map(widget => renderWidget(widget))}
        </ReactGridLayout>

        <div className="last-updated-info text-end mt-3">
          <small className="text-muted">
            Data last updated: {new Date(lastCheckDate).toLocaleTimeString()}
          </small>
        </div>
      </div>
  );
};

export default CustomizableDashboard;