// src/services/ServerTableService.ts

import { Server } from '../types/Server';

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

export interface ServerTypeConfig {
  id: string;
  title: string;
  type: string;
  defaultControl: boolean;
  description?: string;
  isPrimary?: boolean;
}

export class ServerTableService {
  // Define server types configuration
  static readonly SERVER_TYPES: ServerTypeConfig[] = [
    {
      id: 'astro',
      title: 'Astro Servers',
      type: 'astro',
      defaultControl: true,
      description: 'Main processing servers for Astro services',
      isPrimary: true
    },
    {
      id: 'ifs',
      title: 'IFS Servers',
      type: 'ifs',
      defaultControl: true,
      description: 'Image File Services infrastructure',
      isPrimary: true
    },
    {
      id: 'dc',
      title: 'Document Conversion',
      type: 'dc',
      defaultControl: false,
      description: 'Document conversion services'
    },
    {
      id: 'ninja',
      title: 'Ninja Services',
      type: 'ninja',
      defaultControl: false,
      description: 'Ninja PDF processing services'
    },
    {
      id: 'sqr',
      title: 'SQR Servers',
      type: 'sqr',
      defaultControl: false,
      description: 'Report generation servers'
    },
    {
      id: 'autofont',
      title: 'AutoFont Servers',
      type: 'autofont',
      defaultControl: false,
      description: 'Font management services'
    }
  ];

  /**
   * Get all configured server types
   * @returns Array of server type configurations
   */
  static getServerTypes(): ServerTypeConfig[] {
    return this.SERVER_TYPES;
  }

  /**
   * Get primary server types
   * @returns Array of primary server type configurations
   */
  static getPrimaryServerTypes(): ServerTypeConfig[] {
    return this.SERVER_TYPES.filter(type => type.isPrimary);
  }

  /**
   * Get secondary server types
   * @returns Array of secondary server type configurations
   */
  static getSecondaryServerTypes(): ServerTypeConfig[] {
    return this.SERVER_TYPES.filter(type => !type.isPrimary);
  }

  /**
   * Create empty table configs for initialization
   * @returns Array of empty server table configurations
   */
  static getEmptyTableConfigs(): ServerTableConfig[] {
    return this.SERVER_TYPES.map(type => ({
      id: type.id,
      title: type.title,
      type: type.type,
      data: [],
      control: type.defaultControl,
      loading: false,
      canPerformAction: type.defaultControl,
      description: type.description
    }));
  }

  /**
   * Create table configurations based on server data and states
   * @param serverData The server data organized by type
   * @param controlStates The control states for each type
   * @param loadingStates The loading states for each type
   * @returns Array of server table configurations
   */
  static createTableConfigs(
      serverData: Record<string, Server[]>,
      controlStates: Record<string, boolean>,
      loadingStates: Record<string, boolean> = {}
  ): ServerTableConfig[] {
    return this.SERVER_TYPES.map(type => ({
      id: type.id,
      title: type.title,
      type: type.type,
      data: serverData[type.id] || [],
      control: controlStates[type.id] ?? type.defaultControl,
      loading: loadingStates[type.id] || false,
      canPerformAction: controlStates[type.id] ?? type.defaultControl,
      description: type.description
    }));
  }

  /**
   * Get the CSS class for a server state
   * @param state The server state
   * @returns CSS class string
   */
  static getServerStateClass(state: string | null | undefined): string {
    if (!state) return 'status-unknown';

    const stateMap: Record<string, string> = {
      'RUNNING': 'status-running',
      'IDLE': 'status-idle',
      'DOWN': 'status-down',
      'STARTING': 'status-starting',
      'STOPPING': 'status-stopping',
      'ERROR': 'status-error'
    };

    return stateMap[state.toUpperCase()] || 'status-unknown';
  }

  /**
   * Get the display name for a server state
   * @param state The server state
   * @returns Display name string
   */
  static getServerStateDisplayName(state: string | null | undefined): string {
    if (!state) return 'Unknown';

    const stateMap: Record<string, string> = {
      'RUNNING': 'Running',
      'IDLE': 'Idle',
      'DOWN': 'Down',
      'STARTING': 'Starting...',
      'STOPPING': 'Stopping...',
      'ERROR': 'Error'
    };

    return stateMap[state.toUpperCase()] || state;
  }
}