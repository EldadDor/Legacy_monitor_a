import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContextProvider';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaSpinner, FaServer } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { Modal } from '../../shared/ModalComponent';
import './ServersTable.css';
import { Server } from '../../types/Server'; // Import shared type
import { Constants } from '../../utils/constantsConfiguration';
import { controlService } from '../../services/controlService';

// Server interface aligned with controlService.ts and augmented with UI fields


const IconWrapper: React.FC<{ icon?: IconType, className?: string }> = ({ icon: IconComponent, className }) => {
  if (!IconComponent) {
    return null;
  }
  const ActualIcon = IconComponent as React.ElementType;
  return <span className={className}><ActualIcon /></span>;
};

interface ServersTableProps {
  title: string;
  servers: Server[];
  onServerAction: (action: string, servers: Server[]) => void;
  canPerformAction?: boolean;
  loading?: boolean;
}

// Updated headers to use new/correct property names from the Server interface
const serverTableHeaders: Array<{ key: keyof Server; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'host', label: 'Host' },
  { key: 'port', label: 'Port' },
  { key: 'serverState', label: 'Status' }, // Assuming serverState is the primary UI status display
  { key: 'priority', label: 'Queue' }, // Using 'priority' if it's the source for queue display
  { key: 'psLimit', label: 'Policy Limit' },
  { key: 'withdrawalSeconds', label: 'Withdrawal' }, // Kept if 'withdrawalSeconds' is a distinct, calculated UI field
  { key: 'fetchSeconds', label: 'Fetch' }, // Kept if 'fetchSeconds' is a distinct, calculated UI field
  { key: 'boostMode', label: 'Boost' },
  { key: 'psJobType', label: 'Job Type' },
];

const ServersTable: React.FC<ServersTableProps> = ({
                                                     title,
                                                     servers = [],
                                                     onServerAction,
                                                     canPerformAction = true,
                                                     loading = false
                                                   }) => {
  const [sortType, setSortType] = useState<keyof Server>('name');
  const [sortReverse, setSortReverse] = useState<boolean>(false);

  const [selectedItems, setSelectedItems] = useState<Server[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<string>('');
  const [showServerLog, setShowServerLog] = useState<boolean>(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [serverLogs, setServerLogs] = useState<string[]>([]);
  const [isLogLoading, setIsLogLoading] = useState<boolean>(false);

  const sortedServers = useMemo(() => {
    return [...servers].sort((a, b) => {
      let aValue = a[sortType];
      let bValue = b[sortType];

      if (aValue === null || aValue === undefined) aValue = '' as any;
      if (bValue === null || bValue === undefined) bValue = '' as any;

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      return sortReverse ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
    });
  }, [servers, sortType, sortReverse]);

  const filteredServers = useMemo(() => {
    if (!searchTerm) return sortedServers;
    return sortedServers.filter(server =>
        Object.values(server)
            .filter(value => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') // Include boolean for 'fetcher' etc.
            .some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedServers, searchTerm]);

  useEffect(() => {
    if (filteredServers.length > 0 && selectedItems.length === filteredServers.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, filteredServers]);

  useEffect(() => {
    setSelectedItems([]);
  }, [servers]);

  const handleSort = (columnName: keyof Server) => {
    if (sortType === columnName) {
      setSortReverse(!sortReverse);
    } else {
      setSortType(columnName);
      setSortReverse(false);
    }
  };

  const renderSortIcon = (columnName: keyof Server) => {
    if (sortType !== columnName) {
      return <IconWrapper icon={FaSort} className="sort-icon ms-1" />;
    }
    return sortReverse ?
        <IconWrapper icon={FaSortDown} className="sort-icon ms-1" /> :
        <IconWrapper icon={FaSortUp} className="sort-icon ms-1" />;
  };

  const handleShowServerLog = useCallback(async (server: Server) => {
    setSelectedServer(server);
    setIsLogLoading(true);
    setShowServerLog(true);

    try {
      // The 'server' object passed here must conform to controlService's Server type.
      // Our updated Server interface ensures this.
      const logLines = await controlService.tailSplunkLog(
          server,
          Constants.DEFAULT_LOG_LINES
      );

      if (logLines && Array.isArray(logLines)) {
        setServerLogs(logLines);
      } else {
        setServerLogs(['Log data is not in the expected format or is empty.']);
      }
    } catch (error) {
      console.error('Error fetching server logs:', error);
      setServerLogs([`Error loading logs: ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setIsLogLoading(false);
    }
  }, []);

  const toggleItemSelection = (server: Server) => {
    setSelectedItems(prevSelected => {
      const isSelected = prevSelected.some(item => item.id === server.id);
      if (isSelected) {
        return prevSelected.filter(item => item.id !== server.id);
      } else {
        return [...prevSelected, server];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...filteredServers]);
    }
  };

  const initiateAction = (action: string) => {
    if (selectedItems.length === 0) return;
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const confirmServerAction = () => {
    onServerAction(confirmAction, selectedItems);
    setShowConfirmModal(false);
    setSelectedItems([]);
  };

  const cancelServerAction = () => {
    setShowConfirmModal(false);
  };

  const closeServerLog = () => {
    setShowServerLog(false);
    setSelectedServer(null);
    setServerLogs([]);
  };

  // Uses serverState (UI specific) or status (backend) for CSS class
  const getServerStateClass = (server: Server) => {
    const stateForCss = server.serverState || server.status;
    if(!stateForCss) return server.cssClass || ''; // Fallback to cssClass if provided
    const stateConfig = Constants.DEFAULT_SERVER_STATES[stateForCss as keyof typeof Constants.DEFAULT_SERVER_STATES];
    return stateConfig ? stateConfig.cssClass : server.cssClass || '';
  };

  const formatOptionalDisplay = (
      value?: string | number | boolean | null,
      mapping?: Record<string, string>
  ): string => {
    if (value === undefined || value === null || String(value).trim() === '') return '-';
    const stringValue = String(value);
    return mapping && mapping[stringValue] ? mapping[stringValue] : stringValue;
  };

  return (
      <div className="servers-table-container card shadow-sm mb-4">
        <div className="card-header table-header d-flex justify-content-between align-items-center p-3">
          <h5 className="mb-0">{title}</h5>
          <div className="search-container input-group w-auto">
            <span className="input-group-text"><IconWrapper icon={FaSearch} /></span>
            <input
                type="text"
                className="form-control"
                placeholder="Search servers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body p-0">
          {canPerformAction && selectedItems.length > 0 && (
              <div className="action-buttons-bar p-3 border-bottom">
                <span className="me-2">{selectedItems.length} item(s) selected.</span>
                <button
                    type="button"
                    className="btn btn-sm btn-primary me-1"
                    onClick={() => initiateAction('start')}
                >
                  Start
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => initiateAction('restart')}
                >
                  Restart
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => initiateAction('stop')}
                >
                  Stop
                </button>
              </div>
          )}

          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="thead-light">
              <tr>
                {canPerformAction && (
                    <th style={{ width: '30px' }} className="text-center">
                      <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectAll && filteredServers.length > 0}
                          onChange={toggleSelectAll}
                          disabled={loading || filteredServers.length === 0}
                          title={selectAll ? "Deselect all" : "Select all"}
                      />
                    </th>
                )}
                {serverTableHeaders.map(header => (
                    <th key={String(header.key)} onClick={() => handleSort(header.key)} className="sortable text-nowrap">
                      {header.label}
                      {renderSortIcon(header.key)}
                    </th>
                ))}
                <th className="text-nowrap">Actions</th>
              </tr>
              </thead>
              <tbody>
              {loading ? (
                  <tr>
                    <td colSpan={canPerformAction ? serverTableHeaders.length + 2 : serverTableHeaders.length + 1} className="text-center p-4">
                      <IconWrapper icon={FaSpinner} className="spinner fa-spin fa-2x" />
                      <div className="mt-2">Loading servers...</div>
                    </td>
                  </tr>
              ) : filteredServers.length === 0 ? (
                  <tr>
                    <td colSpan={canPerformAction ? serverTableHeaders.length + 2 : serverTableHeaders.length + 1} className="text-center p-4">
                      No servers found matching your criteria.
                    </td>
                  </tr>
              ) : (
                  filteredServers.map(server => (
                      <tr key={server.id} className={getServerStateClass(server)}>
                        {canPerformAction && (
                            <td className="text-center">
                              <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedItems.some(item => item.id === server.id)}
                                  onChange={() => toggleItemSelection(server)}
                                  disabled={loading}
                              />
                            </td>
                        )}
                        {/* Updated to use new/correct property names */}
                        <td>{server.name}</td>
                        <td>{server.host}</td>
                        <td>{formatOptionalDisplay(server.port)}</td>
                        <td className="fw-bold">{formatOptionalDisplay(server.serverState || server.status)}</td> {/* Display UI serverState or backend status */}
                        <td>{formatOptionalDisplay(server.priority, Constants.ASTRO_DASHBOARD_QUEUE_TYPES)}</td> {/* Using priority with mapping */}
                        <td>{formatOptionalDisplay(server.psLimit)}</td>
                        <td>{formatOptionalDisplay(server.withdrawalSeconds)}</td> {/* Assuming withdrawalSeconds is populated for UI */}
                        <td>{formatOptionalDisplay(server.fetchSeconds)}</td> {/* Assuming fetchSeconds is populated for UI */}
                        <td>{formatOptionalDisplay(server.boostMode, Constants.BOOST_MODES)}</td>
                        <td>{formatOptionalDisplay(server.psJobType, Constants.PRINTSERVER_JOBTYPES)}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                                type="button"
                                className="btn btn-info"
                                onClick={() => handleShowServerLog(server)} // Server object should now be compliant
                                title="View Logs"
                                disabled={!server.link} // Optionally disable if link is critical and might be missing (though type says it's required)
                            >
                              {server.isSearchQueryRunning
                                  ? <IconWrapper icon={FaSpinner} className="spinner fa-spin" />
                                  : 'Logs'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  setSelectedItems([server]);
                                  initiateAction('start');
                                }}
                                disabled={!canPerformAction || loading || (server.serverState || server.status) === Constants.SERVER_STATE.RUNNING}
                                title="Start Server"
                            >
                              Start
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => {
                                  setSelectedItems([server]);
                                  initiateAction('restart');
                                }}
                                disabled={!canPerformAction || loading}
                                title="Restart Server"
                            >
                              Restart
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                  setSelectedItems([server]);
                                  initiateAction('stop');
                                }}
                                disabled={!canPerformAction || loading || (server.serverState || server.status) === Constants.SERVER_STATE.DOWN}
                                title="Stop Server"
                            >
                              Stop
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {showConfirmModal && (
            <Modal
                title={`Confirm Action: ${confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)} Server(s)`}
                onClose={cancelServerAction}
            >
              <div className="modal-body">
                <p>Are you sure you want to <strong>{confirmAction}</strong> the following server(s)?</p>
                <ul className="list-unstyled">
                  {selectedItems.map((server) => (
                      <li key={server.id}>
                        <IconWrapper icon={FaServer} className="server-icon me-2" /> {server.name} ({server.host})
                      </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelServerAction}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={confirmServerAction}>
                  Confirm {confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)}
                </button>
              </div>
            </Modal>
        )}

        {showServerLog && selectedServer && (
            <Modal
                title={`Server Logs: ${selectedServer.name} (${selectedServer.host}:${selectedServer.port || 'N/A'})`}
                size="xl"
                onClose={closeServerLog}
            >
              <div className="modal-body">
                {isLogLoading ? (
                    <div className="text-center p-4">
                      <IconWrapper icon={FaSpinner} className="spinner fa-spin fa-3x" />
                      <p className="mt-2">Loading logs...</p>
                    </div>
                ) : (
                    <pre className="server-logs bg-dark text-white p-3 rounded" style={{maxHeight: '60vh', overflowY: 'auto', fontSize: '0.85em'}}>
                {serverLogs.length > 0 ? serverLogs.join('\n') : "No log data available or logs are empty."}
              </pre>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeServerLog}>
                  Close
                </button>
              </div>
            </Modal>
        )}
      </div>
  );
};

export default ServersTable;