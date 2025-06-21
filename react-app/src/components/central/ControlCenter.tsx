import React, { useState, useEffect } from 'react';
import { Server } from '../../types/Server';
import { Constants } from '../../utils/constantsConfiguration';
import ThemeSelector from '../theme/ThemeSelector';
import '../servers/ServersTable.css';
import styles from './ControlCenter.css';

interface ServerGroup {
  id: string;
  name: string;
  type: string;
  servers: Server[];
  expanded: boolean;
}

const ControlCenter: React.FC = () => {
  const [serverGroups, setServerGroups] = useState<ServerGroup[]>([]);
  const [selectedServers, setSelectedServers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize server groups
  useEffect(() => {
    const initialGroups: ServerGroup[] = [
      {
        id: 'microservices-clientzone',
        name: 'Microservices - ClientZone',
        type: 'clientzone',
        servers: [],
        expanded: true
      },
      {
        id: 'microservices-crm',
        name: 'Microservices - CRM',
        type: 'crm',
        servers: [],
        expanded: true
      },
      {
        id: 'microservices-batch',
        name: 'Microservices - Batch',
        type: 'batch',
        servers: [],
        expanded: true
      },
      {
        id: 'pearl-servers',
        name: 'Pearl-Servers',
        type: 'pearl',
        servers: [],
        expanded: true
      },
      {
        id: 'jidi-servers',
        name: 'Jidi-Servers',
        type: 'jidi',
        servers: [],
        expanded: true
      }
    ];

    setServerGroups(initialGroups);
    loadServersData();
  }, []);

  const loadServersData = async () => {
    setLoading(true);
    try {
      // Generate mock data for all server groups
      const mockServers = generateMockServers();

      // Update each group with its corresponding servers
      setServerGroups(prevGroups =>
          prevGroups.map(group => ({
            ...group,
            servers: mockServers.filter(server => server.type === group.type)
          }))
      );

      console.log('Generated mock servers:', mockServers);
      console.log('Updated server groups');
    } catch (error) {
      console.error('Error loading servers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockServers = (): Server[] => {
    const serverConfigs = [
      { type: 'clientzone', prefix: 'ClientZone', count: 4 },
      { type: 'crm', prefix: 'CRM', count: 3 },
      { type: 'batch', prefix: 'Batch', count: 5 },
      { type: 'pearl', prefix: 'Pearl', count: 3 },
      { type: 'jidi', prefix: 'Jidi', count: 4 }
    ];

    const mockServers: Server[] = [];
    const statusKeys = Object.keys(Constants.DEFAULT_SERVER_STATES);

    serverConfigs.forEach(config => {
      for (let i = 1; i <= config.count; i++) {
        const randomStatus = statusKeys[Math.floor(Math.random() * statusKeys.length)];
        const statusConfig = Constants.DEFAULT_SERVER_STATES[randomStatus as keyof typeof Constants.DEFAULT_SERVER_STATES];

        mockServers.push({
          id: `${config.type}-server-${i}`,
          host: `${config.type}-host-${String(i).padStart(2, '0')}`,
          name: `${config.prefix} Server ${i}`,
          link: `http://${config.type}-host-${String(i).padStart(2, '0')}:8080`,
          port: '8080',
          executable: `/opt/${config.type}/server.jar`,
          control: true,
          status: randomStatus,
          cssClass: statusConfig.cssClass,
          lastUpdatedDate: Date.now() - Math.floor(Math.random() * 300000), // Random time within last 5 minutes
          forceCheck: false,
          type: config.type,
          serverState: randomStatus
        });
      }
    });

    return mockServers;
  };

  const toggleGroupExpansion = (groupId: string) => {
    setServerGroups(prevGroups =>
        prevGroups.map(group =>
            group.id === groupId ? { ...group, expanded: !group.expanded } : group
        )
    );
  };

  const toggleServerSelection = (serverId: string) => {
    setSelectedServers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serverId)) {
        newSet.delete(serverId);
      } else {
        newSet.add(serverId);
      }
      return newSet;
    });
  };

  const selectAllServers = (groupId: string) => {
    const group = serverGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedServers(prev => {
        const newSet = new Set(prev);
        group.servers.forEach(server => newSet.add(server.id));
        return newSet;
      });
    }
  };

  const deselectAllServers = (groupId: string) => {
    const group = serverGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedServers(prev => {
        const newSet = new Set(prev);
        group.servers.forEach(server => newSet.delete(server.id));
        return newSet;
      });
    }
  };

  const performBulkAction = async (action: string) => {
    if (selectedServers.size === 0) {
      alert('Please select at least one server');
      return;
    }

    const confirmation = window.confirm(
        `Are you sure you want to ${action} ${selectedServers.size} selected server(s)?`
    );

    if (!confirmation) return;

    setLoading(true);
    try {
      console.log(`Performing ${action} on servers:`, Array.from(selectedServers));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refresh data after action
      await loadServersData();

      // Clear selection
      setSelectedServers(new Set());
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(`Error performing ${action}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const performServerAction = async (server: Server, action: string) => {
    const confirmation = window.confirm(
        `Are you sure you want to ${action} ${server.name}?`
    );

    if (!confirmation) return;

    setLoading(true);
    try {
      console.log(`Performing ${action} on server:`, server.id);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh data after action
      await loadServersData();
    } catch (error) {
      console.error(`Error performing ${action} on server ${server.name}:`, error);
      alert(`Error performing ${action} on ${server.name}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = serverGroups.map(group => ({
    ...group,
    servers: group.servers.filter(server =>
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.host.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  const renderServerRow = (server: Server) => (
      <tr key={server.id} className={server.cssClass || ''}>
        <td>
          <input
              type="checkbox"
              className="form-check-input"
              checked={selectedServers.has(server.id)}
              onChange={() => toggleServerSelection(server.id)}
          />
        </td>
        <td>{server.name}</td>
        <td>{server.host}</td>
        <td>{server.port}</td>
        <td>
        <span className={`badge ${getStatusBadgeClass(server.serverState || server.status)}`}>
          {server.serverState || server.status}
        </span>
        </td>
        <td>
          <small className="text-muted">
            {new Date(server.lastUpdatedDate).toLocaleString()}
          </small>
        </td>
        <td>
          <div className={`btn-group ${styles.actionButtons}`} role="group">
            <button
                className="btn btn-success btn-sm"
                onClick={() => performServerAction(server, 'start')}
                disabled={loading || server.serverState === 'RUNNING'}
            >
              Start
            </button>
            <button
                className="btn btn-warning btn-sm"
                onClick={() => performServerAction(server, 'stop')}
                disabled={loading || server.serverState === 'DOWN'}
            >
              Stop
            </button>
            <button
                className="btn btn-info btn-sm"
                onClick={() => performServerAction(server, 'restart')}
                disabled={loading}
            >
              Restart
            </button>
            <a
                href={server.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
            >
              Open
            </a>
          </div>
        </td>
      </tr>
  );

  const getStatusBadgeClass = (status: string | null): string => {
    switch (status) {
      case 'RUNNING':
        return 'bg-success';
      case 'DOWN':
      case 'OLD':
        return 'bg-danger';
      case 'IDLE':
        return 'bg-warning';
      case 'STARTING':
      case 'STOPPING':
      case 'RESTARTING':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  return (
      <div className={styles.controlCenterContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Control Center</h2>
          <div className="d-flex align-items-center gap-3">
            <ThemeSelector />
            <button
                className="btn btn-outline-primary"
                onClick={loadServersData}
                disabled={loading}
            >
              {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Refreshing...
                  </>
              ) : (
                  <>
                    <i className="fas fa-sync-alt me-2" />
                    Refresh All
                  </>
              )}
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Control Center</h2>
          <button
              className="btn btn-outline-primary"
              onClick={loadServersData}
              disabled={loading}
          >
            {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Refreshing...
                </>
            ) : (
                <>
                  <i className="fas fa-sync-alt me-2" />
                  Refresh All
                </>
            )}
          </button>
        </div>

        {/* Global Search */}
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search" />
            </span>
              <input
                  type="text"
                  className="form-control"
                  placeholder="Search servers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedServers.size > 0 && (
            <div className={`alert alert-info ${styles.bulkActionsBar} mb-3`}>
              <div className="d-flex justify-content-between align-items-center">
                <span>{selectedServers.size} server(s) selected</span>
                <div className="btn-group">
                  <button
                      className="btn btn-success btn-sm"
                      onClick={() => performBulkAction('start')}
                      disabled={loading}
                  >
                    Start Selected
                  </button>
                  <button
                      className="btn btn-warning btn-sm"
                      onClick={() => performBulkAction('stop')}
                      disabled={loading}
                  >
                    Stop Selected
                  </button>
                  <button
                      className="btn btn-info btn-sm"
                      onClick={() => performBulkAction('restart')}
                      disabled={loading}
                  >
                    Restart Selected
                  </button>
                  <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setSelectedServers(new Set())}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Server Groups */}
        <div className={styles.serverGroupsContainer}>
          {filteredGroups.map((group, index) => (
              <div key={group.id} className="servers-table-container mb-4">
                <div className={`table-header ${styles.serverGroupHeader}`}>
                  <div className="d-flex align-items-center">
                    <button
                        className={`btn btn-link p-0 me-3 ${styles.expandCollapseBtn}`}
                        onClick={() => toggleGroupExpansion(group.id)}
                    >
                      <i className={`fas ${group.expanded ? 'fa-chevron-down' : 'fa-chevron-right'}`} />
                    </button>
                    <h5 className="mb-0">{group.name}</h5>
                    <span className={`badge bg-secondary ms-2 ${styles.serverTypeBadge}`}>
                  {group.servers.length} servers
                </span>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => selectAllServers(group.id)}
                        disabled={group.servers.length === 0}
                    >
                      Select All
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => deselectAllServers(group.id)}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {group.expanded && (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                        <tr>
                          <th style={{ width: '40px' }}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={group.servers.length > 0 && group.servers.every(s => selectedServers.has(s.id))}
                                disabled={group.servers.length === 0}
                                onChange={() => {
                                  if (group.servers.every(s => selectedServers.has(s.id))) {
                                    deselectAllServers(group.id);
                                  } else {
                                    selectAllServers(group.id);
                                  }
                                }}
                            />
                          </th>
                          <th>Server Name</th>
                          <th>Host</th>
                          <th>Port</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                          <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {group.servers.length > 0 ? (
                            group.servers.map(renderServerRow)
                        ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-4 text-muted">
                                {loading ? (
                                    <>
                                      <div className="spinner-border text-primary mb-2" />
                                      <div>Loading servers...</div>
                                    </>
                                ) : (
                                    <>
                                      <div>No servers configured for {group.name}</div>
                                      <small className="text-muted">Group #{index + 1} - Type: {group.type}</small>
                                    </>
                                )}
                              </td>
                            </tr>
                        )}
                        </tbody>
                      </table>
                    </div>
                )}
              </div>
          ))}
        </div>

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
            <div className="mt-4">
              <details>
                <summary>Debug Information</summary>
                <pre className="bg-light p-2 mt-2">
              {JSON.stringify({
                serverGroupsCount: serverGroups.length,
                totalServers: serverGroups.reduce((acc, group) => acc + group.servers.length, 0),
                loading,
                selectedServersCount: selectedServers.size
              }, null, 2)}
            </pre>
              </details>
            </div>
        )}
      </div>
  );
};

export default ControlCenter;