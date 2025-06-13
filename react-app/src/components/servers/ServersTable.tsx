// src/components/servers/ServersTable.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContextProvider';
import {
  FaSort, FaSortUp, FaSortDown, FaSearch, FaSpinner,
  FaServer, FaPlay, FaStop, FaRedo, FaFileAlt
} from 'react-icons/fa';
import { IconType } from 'react-icons';
import { Modal } from '../../shared/ModalComponent';
import './ServersTable.css';
import { Server } from '../../types/Server';
import { Constants } from '../../utils/constantsConfiguration';
import { controlService } from '../../services/controlService';

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
  { key: 'serverState', label: 'Status' },
  { key: 'priority', label: 'Queue' },
  { key: 'psLimit', label: 'Policy Limit' },
  { key: 'withdrawalSeconds', label: 'Withdrawal' },
  { key: 'fetchSeconds', label: 'Fetch' },
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
            .filter(value => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
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

  const getServerStateClass = (server: Server) => {
    const stateForCss = server.serverState || server.status;
    if(!stateForCss) return server.cssClass || '';
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
      <div className="servers-table-container servers-table-container-wide card">
      <div className="card-header table-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{title}</h5>
          <div className="search-container input-group">
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
              <div className="action-buttons-bar d-flex align-items-center">
                <span className="me-3 fw-medium">{selectedItems.length} server(s) selected</span>
                <div className="d-flex gap-2">
                  <button
                      type="button"
                      className="btn btn-sm btn-success d-flex align-items-center gap-1"
                      onClick={() => initiateAction('start')}
                  >
                    <IconWrapper icon={FaPlay} /> Start
                  </button>
                  <button
                      type="button"
                      className="btn btn-sm btn-warning d-flex align-items-center gap-1"
                      onClick={() => initiateAction('restart')}
                  >
                    <IconWrapper icon={FaRedo} /> Restart
                  </button>
                  <button
                      type="button"
                      className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                      onClick={() => initiateAction('stop')}
                  >
                    <IconWrapper icon={FaStop} /> Stop
                  </button>
                </div>
              </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
              <tr>
                {canPerformAction && (
                    <th style={{ width: '40px' }} className="text-center">
                      <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectAll && filteredServers.length > 0}
                          onChange={toggleSelectAll}
                          disabled={loading || filteredServers.length === 0}
                          title={selectAll ? "Deselect all servers" : "Select all servers"}
                      />
                    </th>
                )}
                {serverTableHeaders.map(header => (
                    <th key={String(header.key)} onClick={() => handleSort(header.key)} className="sortable">
                      {header.label}
                      {renderSortIcon(header.key)}
                    </th>
                ))}
                <th className="text-center">Actions</th>
              </tr>
              </thead>
              <tbody>
              {loading ? (
                  <tr>
                    <td colSpan={canPerformAction ? serverTableHeaders.length + 2 : serverTableHeaders.length + 1} className="text-center p-5">
                      <IconWrapper icon={FaSpinner} className="spinner fa-spin fa-2x mb-3" />
                      <div>Loading servers...</div>
                    </td>
                  </tr>
              ) : filteredServers.length === 0 ? (
                  <tr>
                    <td colSpan={canPerformAction ? serverTableHeaders.length + 2 : serverTableHeaders.length + 1} className="text-center p-5">
                      <div className="text-muted">No servers found matching your criteria.</div>
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
                        <td>{server.name}</td>
                        <td>{server.host}</td>
                        <td>{formatOptionalDisplay(server.port)}</td>
                        <td className="fw-bold">{formatOptionalDisplay(server.serverState || server.status)}</td>
                        <td>{formatOptionalDisplay(server.priority, Constants.ASTRO_DASHBOARD_QUEUE_TYPES)}</td>
                        <td>{formatOptionalDisplay(server.psLimit)}</td>
                        <td>{formatOptionalDisplay(server.withdrawalSeconds)}</td>
                        <td>{formatOptionalDisplay(server.fetchSeconds)}</td>
                        <td>{formatOptionalDisplay(server.boostMode, Constants.BOOST_MODES)}</td>
                        <td>{formatOptionalDisplay(server.psJobType, Constants.PRINTSERVER_JOBTYPES)}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                                type="button"
                                className="btn btn-outline-secondary d-flex align-items-center"
                                onClick={() => handleShowServerLog(server)}
                                title="View Logs"
                                disabled={!server.link}
                            >
                              {server.isSearchQueryRunning ? (
                                  <IconWrapper icon={FaSpinner} className="spinner" />
                              ) : (
                                  <IconWrapper icon={FaFileAlt} />
                              )}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-success d-flex align-items-center"
                                onClick={() => {
                                  setSelectedItems([server]);
                                  initiateAction('start');
                                }}
                                disabled={!canPerformAction || loading || (server.serverState || server.status) === Constants.SERVER_STATE.RUNNING}
                                title="Start Server"
                            >
                              <IconWrapper icon={FaPlay} />
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-warning d-flex align-items-center"
                                onClick={() => {
                                  setSelectedItems([server]);
                                  initiateAction('restart');
                                }}
                                disabled={!canPerformAction || loading}
                                title="Restart Server"
                            >
                              <IconWrapper icon={FaRedo} />
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-danger d-flex align-items-center"
                                onClick={() => {
                                  setSelectedItems([server]);
                                  initiateAction('stop');
                                }}
                                disabled={!canPerformAction || loading || (server.serverState || server.status) === Constants.SERVER_STATE.DOWN}
                                title="Stop Server"
                            >
                              <IconWrapper icon={FaStop} />
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
                <ul className="list-group">
                  {selectedItems.map((server) => (
                      <li key={server.id} className="list-group-item d-flex align-items-center">
                        <IconWrapper icon={FaServer} className="server-icon me-2" />
                        <div className="ms-2">
                          <span className="fw-bold">{server.name}</span>
                          <small className="text-muted d-block">{server.host}{server.port ? `:${server.port}` : ''}</small>
                        </div>
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
                title={`Server Logs: ${selectedServer.name} (${selectedServer.host}${selectedServer.port ? `:${selectedServer.port}` : ''})`}
                size="xl"
                onClose={closeServerLog}
            >
              <div className="modal-body">
                {isLogLoading ? (
                    <div className="text-center p-5">
                      <IconWrapper icon={FaSpinner} className="spinner fa-spin fa-3x mb-3" />
                      <p>Loading logs...</p>
                    </div>
                ) : (
                    <div className="server-logs">
                      {serverLogs.length > 0 ? serverLogs.join('\n') : "No log data available."}
                    </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeServerLog}>
                  Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleShowServerLog(selectedServer)}
                    disabled={isLogLoading}
                >
                  Refresh {isLogLoading && <IconWrapper icon={FaSpinner} className="spinner ms-1" />}
                </button>
              </div>
            </Modal>
        )}
      </div>
  );
};

export default ServersTable;