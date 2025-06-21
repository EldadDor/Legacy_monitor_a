import React, { useState, useEffect } from 'react';
import { Server } from '../../types/Server';
import { Constants } from '../../utils/constantsConfiguration';
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
        type: 'microservice',
        servers: [],
        expanded: true
      },
      {
        id: 'microservices-crm',
        name: 'Microservices - CRM',
        type: 'microservice',
        servers: [],
        expanded: true
      },
      {
        id: 'microservices-batch',
        name: 'Microservices - Batch',
        type: 'microservice',
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
      // TODO: Replace with actual API calls for each server group
      // For now, creating mock data structure
      const mockServers = generateMockServers();

      setServerGroups(prevGroups =>
          prevGroups.map(group => ({
            ...group,
            servers: mockServers.filter(server => server.type === group.type)
          }))
      );
    } catch (error) {
      console.error('Error loading servers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockServers = (): Server[] => {
    // Mock data generation - replace with actual API calls
    const serverTypes = ['microservice', 'pearl', 'jidi'];
    const mockServers: Server[] = [];

    serverTypes.forEach(type => {
      for (let i = 1; i <= 3; i++) {
        mockServers.push({
          id: `${type}-server-${i}`,
          host: `${type}-host-${i}`,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Server ${i}`,
          link: `http://${type}-host-${i}:8080`,
          port: '8080',
          executable: `/opt/${type}/server.jar`,
          control: true,
          status: Object.keys(Constants.DEFAULT_SERVER_STATES)[Math.floor(Math.random() * Object.keys(Constants.DEFAULT_SERVER_STATES).length)],
          cssClass: Constants.DEFAULT_SERVER_STATES[Object.keys(Constants.DEFAULT_SERVER_STATES)[Math.floor(Math.random() * Object.keys(Constants.DEFAULT_SERVER_STATES).length)] as keyof typeof Constants.DEFAULT_SERVER_STATES].cssClass,
          lastUpdatedDate: Date.now(),
          forceCheck: false,
          type: type,
          serverState: Object.keys(Constants.DEFAULT_SERVER_STATES)[Math.floor(Math.random() * Object.keys(Constants.DEFAULT_SERVER_STATES).length)]
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
      // TODO: Implement actual bulk actions
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
      // TODO: Implement actual server actions
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
      <div className={`container-fluid ${styles.controlCenterContainer}`}>
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
            <div className={`alert alert-info ${styles.bulkActionsBar}`}>
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
        {filteredGroups.map(group => (
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
                                  'No servers found'
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
  );
};

export default ControlCenter;