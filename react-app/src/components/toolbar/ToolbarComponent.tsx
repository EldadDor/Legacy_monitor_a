// /react-app/src/components/toolbar/Toolbar.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContextProvider';
import { useSplunkService } from '../../hooks/useSplunkService';
import { useAlerts } from '../../hooks/useAlertsHook';
import { Constants } from '../../utils/constantsConfiguration';
import { Modal } from '../../shared/ModalComponent';
import './ToolbarStyles.css';

// Extract constants
const UPDATE_INTERVAL_MS = 1000;
const LOG_SEARCH_DAYS = '-7d';
const LOG_FIELDS = 'time,ServerName,Host,ControlAction,Username,StationNr,ServerType';

const Toolbar: React.FC = () => {
  // State hooks
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(true);
  const [isSearchQueryRunning, setIsSearchQueryRunning] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [logData, setLogData] = useState<any[]>([]);
  
  // Custom hooks
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    logout, 
    getCurrentEnv, 
    setCurrentDataSource, 
    getCurrentDataSource 
  } = useAuth();
  const { getSearchResults } = useSplunkService();
  const { alerts } = useAlerts();
  
  // Clock ticker effect
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, UPDATE_INTERVAL_MS);
    
    return () => {
      clearInterval(tickInterval);
    };
  }, []);
  
  // Environment selection handler
  const handleEnvSelect = useCallback(() => {
    const currentEnv = getCurrentEnv();
    if (currentEnv === Constants.ENV.PROD) {
      setCurrentDataSource(Constants.DATA_SOURCES.PROD);
    } else {
      setCurrentDataSource(Constants.DATA_SOURCES.USERTEST);
    }
    
    // Dispatch update event
    document.dispatchEvent(new Event(Constants.EVENTS.UPDATE_DATA));
  }, [getCurrentEnv, setCurrentDataSource]);
  
  // Data source selection handler
  const handleDataSourceSelect = useCallback(() => {
    document.dispatchEvent(new Event(Constants.EVENTS.UPDATE_DATA));
  }, []);
  
  // Control operations log handler
  const handleShowControlOperationsLog = useCallback(async () => {
    const sourceType = "astromonitor";
    const query = "Control action performed";
    
    setIsSearchQueryRunning(true);
    
    try {
      const response = await getSearchResults(
        sourceType, 
        query, 
        LOG_FIELDS, 
        LOG_SEARCH_DAYS
      );

      // Or if response.data might be a stringified JSON:
      setLogData(JSON.parse(response.data).results); // Now this works because response.data is a string


      setShowLogModal(true);
    } catch (error) {
      console.error("Failed to fetch log data:", error);
    } finally {
      setIsSearchQueryRunning(false);
    }
  }, [getSearchResults]);
  
  // Log modal close handler
  const handleCloseLogModal = useCallback(() => {
    setShowLogModal(false);
  }, []);
  
  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);
  
  return (
    <div className="toolbar">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {isAuthenticated && (
                <>
                  <li className="nav-item dropdown">
                    <select 
                      className="form-select" 
                      value={getCurrentEnv()} 
                      onChange={handleEnvSelect}
                    >
                      {Object.values(Constants.ENV).map(env => (
                        <option key={env} value={env}>{env}</option>
                      ))}
                    </select>
                  </li>
                  
                  <li className="nav-item dropdown">
                    <select 
                      className="form-select" 
                      value={getCurrentDataSource()} 
                      onChange={handleDataSourceSelect}
                    >
                      {Object.values(Constants.DATA_SOURCES).map(ds => (
                        <option key={ds} value={ds}>{ds}</option>
                      ))}
                    </select>
                  </li>
                  
                  <li className="nav-item">
                    <button 
                      className="btn btn-link nav-link" 
                      onClick={handleShowControlOperationsLog}
                      disabled={isSearchQueryRunning}
                    >
                      {isSearchQueryRunning ? 'Loading...' : 'Control Operations Log'}
                    </button>
                  </li>
                </>
              )}
            </ul>
            
            <div className="navbar-text me-3">
              {new Date(currentTime).toLocaleTimeString()}
            </div>
            
            {isAuthenticated && (
              <button 
                className="btn btn-outline-light" 
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      
      {alerts.length > 0 && (
        <div className="alerts-container">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert alert-${alert.type}`}>
              {alert.message}
            </div>
          ))}
        </div>
      )}
      
      {showLogModal && (
        <Modal
          title="Control Actions"
          size="xl"
          onClose={handleCloseLogModal}
        >
          <div className="log-modal-content">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Server Name</th>
                  <th>Host</th>
                  <th>Control Action</th>
                  <th>Username</th>
                  <th>Station Nr</th>
                  <th>Server Type</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.time}</td>
                    <td>{item.ServerName}</td>
                    <td>{item.Host}</td>
                    <td>{item.ControlAction}</td>
                    <td>{item.Username}</td>
                    <td>{item.StationNr}</td>
                    <td>{item.ServerType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Toolbar;