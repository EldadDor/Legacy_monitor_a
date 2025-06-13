// src/services/AlertsService.ts
import { Server } from '../types/Server';
import { Constants } from '../utils/constantsConfiguration';
import { useAuth } from '../contexts/AuthContextProvider';

interface Alert {
  message: string;
  link?: string;
  type?: string;
}

interface HostAlert {
  serverId: string;
}

class AlertsService {
  private alerts: Alert[] = [];
  private hostDownAlerts: HostAlert[] = [];
  private hostIdleAlerts: HostAlert[] = [];

  // Get current alerts
  getAlerts(): Alert[] {
    return this.alerts;
  }

  // Get host down alerts
  getHostDownAlerts(): HostAlert[] {
    return this.hostDownAlerts;
  }

  // Get host idle alerts
  getHostIdleAlerts(): HostAlert[] {
    return this.hostIdleAlerts;
  }

  // Add an alert
  addAlert(message: string, type: string = 'warning', link?: string, env?: string): void {
    // Get current environment from auth context
    const currentEnv = this.getCurrentEnv();
    
    // Skip if environment doesn't match
    if (env !== undefined && currentEnv !== env) {
      return;
    }

    // Check for duplicates
    for (let i = 0; i < this.alerts.length; i++) {
      if (this.alerts[i].message === message) {
        return;
      }
    }

    const alert: Alert = {
      message,
      link,
      type
    };
    
    this.alerts.push(alert);
  }

  // Add a host alert
  addHostAlert(server: Server, serverState: string, env?: string): void {
    const serverId = this.getServerId(server);
    const currentEnv = this.getCurrentEnv();
    
    // Skip if environment doesn't match
    if (env !== undefined && currentEnv !== env) {
      return;
    }
    
    // Skip certain server types
    if (server.name.startsWith("pdf-source-storage")) {
      return;
    }
    
    // Check for duplicates in down alerts
    for (let i = 0; i < this.hostDownAlerts.length; i++) {
      if (this.hostDownAlerts[i].serverId === serverId) {
        return;
      }
    }
    
    // Check for duplicates in idle alerts
    for (let i = 0; i < this.hostIdleAlerts.length; i++) {
      if (this.hostIdleAlerts[i].serverId === serverId) {
        return;
      }
    }
    
    const alert: HostAlert = {
      serverId
    };
    
    if (serverState === Constants.SERVER_STATE.DOWN) {
      this.hostDownAlerts.push(alert);
    } else {
      this.hostIdleAlerts.push(alert);
    }
  }

  // Remove an alert by message
  removeAlert(message: string): void {
    for (let i = 0; i < this.alerts.length; i++) {
      if (this.alerts[i].message === message) {
        this.alerts.splice(i, 1);
        break;
      }
    }
  }

  // Remove a host alert
  removeHostAlert(server: Server, env?: string): void {
    if (server.name.startsWith("pdf-source-storage")) {
      return;
    }
    
    const serverId = this.getServerId(server);
    
    // Remove from down alerts
    for (let i = 0; i < this.hostDownAlerts.length; i++) {
      if (this.hostDownAlerts[i].serverId === serverId) {
        this.hostDownAlerts.splice(i, 1);
        break;
      }
    }
    
    // Remove from idle alerts
    for (let i = 0; i < this.hostIdleAlerts.length; i++) {
      if (this.hostIdleAlerts[i].serverId === serverId) {
        this.hostIdleAlerts.splice(i, 1);
        break;
      }
    }
  }

  // Clear all alerts
  clearAlerts(): void {
    this.alerts = [];
    this.hostDownAlerts = [];
    this.hostIdleAlerts = [];
  }

  // Helper method to get server ID
  private getServerId(server: Server): string {
    return server.host + server.name;
  }
  
  // Helper method to get current environment
  // You would typically get this from your authentication context
  private getCurrentEnv(): string {
    // This is a placeholder - in a real app, you would get this from the auth context
    return localStorage.getItem('currentEnv') || 'PROD';
  }
}

// Create a singleton instance
const alertsService = new AlertsService();

export default alertsService;