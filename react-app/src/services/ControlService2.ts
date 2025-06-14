
import { Server, ServerStateResponse } from '../types/Server';

// Sample server data for demonstration
const generateSampleServers = (type: string, count: number): Server[] => {
  const servers: Server[] = [];
  
  for (let i = 1; i <= count; i++) {
    const serverName = `${type}-server-${i}`;
    const status = Math.random() > 0.8 ? 'DOWN' : 
                  Math.random() > 0.5 ? 'RUNNING' : 'IDLE';
    
    const server: Server = {
      id: `${type}-${i}`,
      host: Math.random() > 0.5 ? 'wsdev' : 'wsprod',
      name: serverName,
      link: `/control/${type}/${i}`,
      port: Math.random() > 0.1 ? `${8000 + i}` : null,
      executable: Math.random() > 0.9 ? '/path/to/executable' : null,
      control: false,
      status: status,
      cssClass: status === 'RUNNING' ? 'green-bg' : 
               status === 'IDLE' ? 'yellow-bg' : 'red-bg',
      lastUpdatedDate: Date.now() - Math.random() * 3600000,
      forceCheck: false,
      emailAccountUser: Math.random() > 0.7 ? `${type}-mail-${i}@example.com` : null,
      errorMessageCount: Math.random() > 0.8 ? Math.floor(Math.random() * 10) : null,
    };
    
    // Add type-specific properties
    if (type === 'astro') {
      server.priority = Math.random() > 0.5 ? 'HIGH' : 'LOW';
      server.fetcher = Math.random() > 0.5;
      server.withdrawalDurations = {
        'NORMAL': `${Math.floor(Math.random() * 60)}`,
        'FAST': `${Math.floor(Math.random() * 30)}`,
        'SLOW': `${Math.floor(Math.random() * 120)}`
      };
      server.fetchDurations = {
        'NORMAL': `${Math.floor(Math.random() * 60)}`,
        'FAST': `${Math.floor(Math.random() * 30)}`,
        'SLOW': `${Math.floor(Math.random() * 120)}`
      };
      server.boostMode = Math.random() > 0.7 ? 'BOOSTED' : null;
    } else if (type === 'ifs') {
      server.tasksCounter = Math.floor(Math.random() * 100);
      server.totalTasksCounter = 100 + Math.floor(Math.random() * 900);
    } else if (type === 'dc' || type === 'ninja') {
      server.jobs = Array(Math.floor(Math.random() * 5) + 1).fill(0).map((_, idx) => ({
        id: `job-${idx}`,
        status: Math.random() > 0.7 ? 'RUNNING' : 'IDLE',
        cssClass: Math.random() > 0.7 ? 'green-bg' : 'yellow-bg'
      }));
    }
    
    servers.push(server);
  }
  
  return servers;
};

// Singleton map to store server data for simulation
let serverCache: Record<string, Server[]> = {};

export const controlService = {
  /**
   * Get all servers of a specific type
   * @returns Promise with array of servers
   */
  getServers: async (): Promise<Server[]> => {
    // This simulates fetching all servers from the backend
    const allServers: Server[] = [];
    
    // If we don't have data yet, generate it
    if (Object.keys(serverCache).length === 0) {
      serverCache = {
        ifs: generateSampleServers('ifs', 8),
        astro: generateSampleServers('astro', 6),
        dc: generateSampleServers('dc', 4),
        ninja: generateSampleServers('ninja', 3),
        sqr: generateSampleServers('sqr', 2),
        autofont: generateSampleServers('autofont', 3)
      };
    }
    
    // Flatten all servers into a single array
    Object.values(serverCache).forEach(servers => {
      allServers.push(...servers);
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return allServers;
  },
  
  /**
   * Get servers of a specific type
   * @param type The server type to fetch
   * @returns Promise with array of servers of the requested type
   */
  getServersByType: async (type: string): Promise<Server[]> => {
    // If we don't have data yet, generate it
    if (!serverCache[type]) {
      const counts: Record<string, number> = {
        ifs: 8,
        astro: 6,
        dc: 4,
        ninja: 3,
        sqr: 2,
        autofont: 3
      };
      
      serverCache[type] = generateSampleServers(type, counts[type] || 5);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [...serverCache[type]]; // Return a copy to prevent mutations
  },
  
  /**
   * Get the current state of a server
   * @param server The server to check
   * @param forceCheck Whether to force a fresh check
   * @returns Promise with server state response
   */
  getServerState: async (server: Server, forceCheck: boolean): Promise<ServerStateResponse> => {
    console.log(`Getting state for server ${server.name}, force: ${forceCheck}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate server state response
    const response: ServerStateResponse = {
      processState: Math.random() > 0.8 ? 'DOWN' : 
                   Math.random() > 0.5 ? 'RUNNING' : 'IDLE',
      lastUpdatedDate: Date.now()
    };
    
    if (server.name.startsWith('astro')) {
      response.priority = Math.random() > 0.5 ? 'HIGH' : 'LOW';
      response.isFetcher = Math.random() > 0.5;
      response.withdrawalDurations = {
        'NORMAL': `${Math.floor(Math.random() * 60)}`,
        'FAST': `${Math.floor(Math.random() * 30)}`,
        'SLOW': `${Math.floor(Math.random() * 120)}`
      };
      response.fetchDurations = {
        'NORMAL': `${Math.floor(Math.random() * 60)}`,
        'FAST': `${Math.floor(Math.random() * 30)}`,
        'SLOW': `${Math.floor(Math.random() * 120)}`
      };
      response.poolSize = Math.random() > 0.7 ? 'BOOSTED' : 'NORMAL';
    } else {
      response.tasksCounter = Math.floor(Math.random() * 100);
      response.totalTasksCounter = 100 + Math.floor(Math.random() * 900);
    }
    
    if (server.jobs && server.jobs.length > 0) {
      response.jobsProcessState = {};
      server.jobs.forEach(job => {
        response.jobsProcessState![job.id] = Math.random() > 0.7 ? 'RUNNING' : 'IDLE';
      });
    }
    
    return response;
  },
  
  /**
   * Change the state of a server
   * @param server The server to modify
   * @param state The target state
   * @param p1 Optional parameter
   * @returns Promise with server state response
   */
  changeServerState: async (server: Server, state: string, p1?: any): Promise<ServerStateResponse> => {
    console.log(`Changing server ${server.name} state to ${state}, param: ${p1}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update cache
    if (serverCache[server.type || '']) {
      const serverIndex = serverCache[server.type || ''].findIndex(s => s.id === server.id);
      if (serverIndex >= 0) {
        serverCache[server.type || ''][serverIndex].status = state;
        serverCache[server.type || ''][serverIndex].cssClass = 
          state === 'RUNNING' ? 'green-bg' : 
          state === 'IDLE' ? 'yellow-bg' : 'red-bg';
      }
    }
    
    return {
      processState: state,
      lastUpdatedDate: Date.now()
    };
  },
  
  /**
   * Control server with a specific operation
   * @param server The server to modify
   * @param link The operation link/command
   * @param args Any arguments for the operation
   * @returns Promise with response text
   */
  controlServer: async (server: Server, link: string, args: any): Promise<string> => {
    console.log(`Controlling server ${server.name} with link ${link}, args: ${args}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `Operation ${link} completed successfully on ${server.name} with args: ${args || 'none'}`;
  },
  
  /**
   * Get the count of error messages for a mailbox
   * @param emailAccount The email account to check
   * @param forceCheck Whether to force a fresh check
   * @returns Promise with error count as JSON
   */
  getMessagesCount: async (emailAccount: string, forceCheck: boolean): Promise<string> => {
    console.log(`Getting message count for ${emailAccount}, force: ${forceCheck}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const errorCount = Math.floor(Math.random() * 10);
    return JSON.stringify({ errorMessageCount: errorCount });
  },
  
  /**
   * Toggle control for a server type
   * @param type The server type
   * @param control Whether control is enabled
   * @param env The environment
   */
  toggleControl: async (type: string, control: boolean, env: string): Promise<void> => {
    console.log(`Toggle control for ${type} to ${control} in ${env}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  // Additional methods that would be present in your AngularJS controlService
  startAppServers: async (server: Server, state: string): Promise<ServerStateResponse> => {
    return controlService.changeServerState(server, state);
  },
  
  shutdownAppServers: async (server: Server, state: string): Promise<ServerStateResponse> => {
    return controlService.changeServerState(server, state);
  },
  
  restartAppServers: async (server: Server, state: string): Promise<ServerStateResponse> => {
    return controlService.changeServerState(server, state);
  },
  
  switchPriority: async (server: Server, state: string): Promise<ServerStateResponse> => {
    return controlService.changeServerState(server, state);
  },
  
  changePriority: async (server: Server, state: string, priorityValue: string): Promise<ServerStateResponse> => {
    console.log(`Changing priority of ${server.name} to ${priorityValue}`);
    return controlService.changeServerState(server, state);
  },
  
  changeWithdrawalDuration: async (server: Server, state: string, durationName: string): Promise<ServerStateResponse> => {
    console.log(`Changing withdrawal duration of ${server.name} to ${durationName}`);
    return controlService.changeServerState(server, state);
  },
  
  changeFetchDuration: async (server: Server, state: string, durationName: string): Promise<ServerStateResponse> => {
    console.log(`Changing fetch duration of ${server.name} to ${durationName}`);
    return controlService.changeServerState(server, state);
  },
  
  switchFetcher: async (server: Server, state: string): Promise<ServerStateResponse> => {
    return controlService.changeServerState(server, state);
  },
  
  changeJobType: async (server: Server, state: string, jobType: string): Promise<ServerStateResponse> => {
    console.log(`Changing job type of ${server.name} to ${jobType}`);
    return controlService.changeServerState(server, state);
  },
  
  setNumOfPolicies: async (server: Server, state: string, numPolicies: number): Promise<ServerStateResponse> => {
    console.log(`Setting num of policies for ${server.name} to ${numPolicies}`);
    return controlService.changeServerState(server, state);
  },
  
  tailSplunkLog: async (server: Server, lines: number): Promise<string> => {
    console.log(`Getting last ${lines} log lines for ${server.name}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate sample log content
    const logLines = [];
    for (let i = 0; i < lines; i++) {
      const timestamp = new Date(Date.now() - (lines - i) * 60000).toISOString();
      const level = ['INFO', 'WARN', 'ERROR', 'DEBUG'][Math.floor(Math.random() * 4)];
      const message = [
        `Processing request for client XYZ-${Math.floor(Math.random() * 1000)}`,
        `Connection established to database shard ${Math.floor(Math.random() * 5)}`,
        `Completed job #${Math.floor(Math.random() * 10000)} in ${Math.floor(Math.random() * 5000)}ms`,
        `Resource usage: CPU ${Math.floor(Math.random() * 100)}%, Memory ${Math.floor(Math.random() * 8)}GB`,
        `Thread pool size adjusted to ${Math.floor(Math.random() * 50) + 10}`
      ][Math.floor(Math.random() * 5)];
      
      logLines.push(`${timestamp} [${level}] [${server.name}] ${message}`);
    }
    
    return logLines.join('\n');
  },
  
  isNeeviaConverter: (server: Server): boolean => {
    return server.name.toLowerCase().includes('neevia');
  }
};