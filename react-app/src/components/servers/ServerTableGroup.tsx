
import React, { useState } from 'react';
import { Server } from '../../types/Server';
import ServersTable from './ServersTable';
import './ServerTableGroup.css';

export interface ServerTableConfig {
  id: string;
  title: string;
  type: string;
  data: Server[];
  control: boolean;
  loading: boolean;
  canPerformAction: boolean;
  description?: string;
}

interface ServerTableGroupProps {
  tables: ServerTableConfig[];
  onServerAction: (action: string, servers: Server[], tableType: string) => void;
  onToggleControl: (tableId: string, control: boolean) => void;
  layout?: 'grid' | 'stacked';
  allowCollapse?: boolean;
  className?: string;
}

const ServerTableGroup: React.FC<ServerTableGroupProps> = ({
                                                             tables,
                                                             onServerAction,
                                                             onToggleControl,
                                                             layout = 'grid',
                                                             allowCollapse = true,
                                                             className = ''
                                                           }) => {
  // Track which tables are collapsed
  const [collapsedTables, setCollapsedTables] = useState<Record<string, boolean>>({});

  // Handle table collapse toggle
  const handleCollapseToggle = (tableId: string) => {
    if (!allowCollapse) return;

    setCollapsedTables(prev => ({
      ...prev,
      [tableId]: !prev[tableId]
    }));
  };

  // Handle server action for a specific table
  const handleServerAction = (tableId: string) => (action: string, servers: Server[]) => {
    onServerAction(action, servers, tableId);
  };

  // Handle control toggle for a specific table
  const handleToggleControl = (tableId: string) => (control: boolean) => {
    onToggleControl(tableId, control);
  };

  // Check if a table should be displayed (has data or is loading)
  const shouldDisplayTable = (table: ServerTableConfig): boolean => {
    return table.loading || table.data.length > 0;
  };

  return (
      <div className={`server-table-group ${layout} ${className}`}>
        {tables.filter(shouldDisplayTable).map(table => (
            <div
                key={table.id}
                className={`table-container ${collapsedTables[table.id] ? 'collapsed' : ''}`}
            >
              <div className="table-header-bar">
                <div className="table-info">
                  <h3 className="table-title">{table.title}</h3>
                  {table.description && (
                      <div className="table-description">{table.description}</div>
                  )}
                </div>

                <div className="table-controls">
                  {/* Only show control toggle if the table has control capability */}
                  {table.canPerformAction !== undefined && (
                      <div className="control-toggle">
                        <label className="form-check form-switch">
                          <input
                              type="checkbox"
                              className="form-check-input"
                              checked={table.control}
                              onChange={(e) => handleToggleControl(table.id)(e.target.checked)}
                          />
                          <span className="control-toggle-label">Control</span>
                        </label>
                      </div>
                  )}

                  {/* Only show collapse button if allowCollapse is true */}
                  {allowCollapse && (
                      <button
                          className="btn btn-sm btn-outline-secondary collapse-btn"
                          onClick={() => handleCollapseToggle(table.id)}
                      >
                        {collapsedTables[table.id] ? 'Expand' : 'Collapse'}
                      </button>
                  )}
                </div>
              </div>

              <div className="table-content">
                <ServersTable
                    title={table.title}
                    servers={table.data}
                    onServerAction={handleServerAction(table.id)}
                    canPerformAction={table.control}
                    loading={table.loading}
                    showHeader={false}
                    compact={layout === 'stacked'}
                />
              </div>
            </div>
        ))}
      </div>
  );
};

export default ServerTableGroup;