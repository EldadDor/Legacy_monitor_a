import React, { useState, useCallback } from 'react';
import { Server } from '../../types/Server';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaSpinner } from 'react-icons/fa';
import './ServersTable.css';

interface ServersTableProps {
  title: string;
  servers: Server[];
  onServerAction: (action: string, servers: Server[]) => void;
  canPerformAction?: boolean;
  loading?: boolean;
  showHeader?: boolean;
  compact?: boolean;
}

const ServersTable: React.FC<ServersTableProps> = ({
                                                     title,
                                                     servers,
                                                     onServerAction,
                                                     canPerformAction = true,
                                                     loading = false,
                                                     showHeader = true,
                                                     compact = false
                                                   }) => {
  const [sortKey, setSortKey] = useState<string>('host');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedServers, setSelectedServers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Handle sort
  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }, [sortKey, sortDirection]);

  // Handle search
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle server selection
  const handleSelectServer = useCallback((server: Server) => {
    setSelectedServers(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(server.id)) {
        newSelection.delete(server.id);
      } else {
        newSelection.add(server.id);
      }
      return newSelection;
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedServers(new Set());
    } else {
      const allIds = filteredServers.map(server => server.id);
      setSelectedServers(new Set(allIds));
    }
    setSelectAll(!selectAll);
  }, [selectAll]);

  // Filter servers based on search term
  const filteredServers = servers.filter(server => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
        server.name?.toLowerCase().includes(term) ||
        server.host?.toLowerCase().includes(term) ||
        server.status?.toLowerCase().includes(term)
    );
  });

  // Sort servers
  const sortedServers = [...filteredServers].sort((a, b) => {
    const aValue = a[sortKey as keyof Server];
    const bValue = b[sortKey as keyof Server];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    // String comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
    }

    // Number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
    }

    // Boolean comparison
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortDirection === 'asc'
          ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
          : (bValue ? 1 : 0) - (aValue ? 1 : 0);
    }

    return 0;
  });

  // Execute action on selected servers
  const executeAction = useCallback((action: string) => {
    if (!canPerformAction) return;

    const selectedServerObjects = sortedServers.filter(server =>
        selectedServers.has(server.id)
    );

    if (selectedServerObjects.length === 0) {
      alert('Please select at least one server.');
      return;
    }

    onServerAction(action, selectedServerObjects);
  }, [canPerformAction, onServerAction, selectedServers, sortedServers]);

  // Get sort icon based on current sort state
  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <FaSort className="sort-icon" />;
    return sortDirection === 'asc'
        ? <FaSortUp className="sort-icon" />
        : <FaSortDown className="sort-icon" />;
  };

  return (
      <div className={`servers-table-container ${compact ? 'compact' : ''}`}>
        {showHeader && (
            <div className="table-header">
              <h5>{title}</h5>
              <div className="search-container">
                <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Search servers..."
                      value={searchTerm}
                      onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
        )}

        {canPerformAction && (
            <div className="action-buttons-bar">
              <div className="btn-toolbar">
                <div className="btn-group me-2">
                  <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => executeAction('start')}
                      disabled={!canPerformAction || selectedServers.size === 0}
                  >
                    Start
                  </button>
                  <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => executeAction('idle')}
                      disabled={!canPerformAction || selectedServers.size === 0}
                  >
                    Idle
                  </button>
                  <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => executeAction('stop')}
                      disabled={!canPerformAction || selectedServers.size === 0}
                  >
                    Stop
                  </button>
                </div>
                <div className="btn-group">
                  <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => executeAction('restart')}
                      disabled={!canPerformAction || selectedServers.size === 0}
                  >
                    Restart
                  </button>
                </div>
              </div>
            </div>
        )}

        <div className="table-responsive">
          {loading ? (
              <div className="text-center p-4">
                <FaSpinner className="spinner me-2" />
                <span>Loading servers...</span>
              </div>
          ) : sortedServers.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-muted">No servers found</p>
              </div>
          ) : (
              <table className={`table table-hover ${compact ? 'table-sm' : ''}`}>
                <thead>
                <tr>
                  {canPerformAction && (
                      <th>
                        <div className="form-check">
                          <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectAll}
                              onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                  )}
                  <th
                      className="sortable"
                      onClick={() => handleSort('host')}
                  >
                    Host {getSortIcon('host')}
                  </th>
                  <th
                      className="sortable"
                      onClick={() => handleSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th
                      className="sortable"
                      onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  {!compact && (
                      <>
                        <th
                            className="sortable"
                            onClick={() => handleSort('lastUpdatedDate')}
                        >
                          Last Updated {getSortIcon('lastUpdatedDate')}
                        </th>
                        <th>Actions</th>
                      </>
                  )}
                </tr>
                </thead>
                <tbody>
                {sortedServers.map(server => (
                    <tr
                        key={server.id}
                        className={`${server.cssClass || ''} ${selectedServers.has(server.id) ? 'selected' : ''}`}
                    >
                      {canPerformAction && (
                          <td>
                            <div className="form-check">
                              <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedServers.has(server.id)}
                                  onChange={() => handleSelectServer(server)}
                                  disabled={server.executable !== null}
                              />
                            </div>
                          </td>
                      )}
                      <td>{server.host}</td>
                      <td>{server.name}</td>
                      <td>
                    <span className={`badge ${
                        server.status === 'RUNNING' ? 'bg-success' :
                            server.status === 'IDLE' ? 'bg-warning' :
                                server.status === 'DOWN' ? 'bg-danger' :
                                    'bg-secondary'
                    }`}>
                      {server.status}
                    </span>
                      </td>
                      {!compact && (
                          <>
                            <td>
                              {server.lastUpdatedDate
                                  ? new Date(server.lastUpdatedDate).toLocaleTimeString()
                                  : 'N/A'}
                            </td>
                            <td>
                              <div className="btn-group">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => onServerAction('view-log', [server])}
                                    disabled={!canPerformAction}
                                >
                                  Logs
                                </button>
                                {server.status === 'RUNNING' && (
                                    <button
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => onServerAction('toggle-state', [server])}
                                        disabled={!canPerformAction}
                                    >
                                      Idle
                                    </button>
                                )}
                                {server.status === 'IDLE' && (
                                    <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => onServerAction('toggle-state', [server])}
                                        disabled={!canPerformAction}
                                    >
                                      Run
                                    </button>
                                )}
                              </div>
                            </td>
                          </>
                      )}
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>
      </div>
  );
};

export default ServersTable;