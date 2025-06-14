
// src/services/controlService.ts
import { Server, ServerStateResponse } from '../types/Server';
import { Constants } from '../utils/constantsConfiguration';

// API base URL - adjust according to your actual backend setup
const API_BASE_URL = '/api';

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
     * Fetches the list of all configured servers.
     * @returns Promise with array of servers
     */
    getServers: async (): Promise<Server[]> => {
        console.log("Fetching all servers...");

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
        console.log(`Fetching servers of type: ${type}`);

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
     * Get the current state of a specific server.
     * @param server The server to check
     * @param forceCheck Whether to force a check or use cached data
     * @returns Promise with server state information
     */
    getServerState: async (server: Server, forceCheck?: boolean): Promise<ServerStateResponse> => {
        console.log(`Getting state for server ${server.name}, forceCheck: ${forceCheck}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const isAstro = server.name.toLowerCase().startsWith('astro');

        // Generate different response types based on server type
        if (isAstro) {
            return {
                processState: Math.random() > 0.3 ? 'RUNNING' : 'IDLE',
                priority: Object.keys(Constants.ASTRO_QUEUE_TYPES || { 'HIGH': '', 'LOW': '' })[Math.floor(Math.random() * 2)],
                isFetcher: server.fetcher || false,
                withdrawalDurations: { '60': '1 min', '300': '5 min' },
                fetchDurations: { '60': '1 min', '300': '5 min' },
                lastUpdatedDate: Date.now()
            };
        } else if (server.name.toLowerCase().includes('printserver')) {
            return {
                processState: Math.random() > 0.3 ? 'RUNNING' : 'IDLE',
                jobType: '1', // Batch
                numOfPolicies: 10,
                jobsProcessState: { 'job1': 'RUNNING', 'job2': 'IDLE' },
                lastUpdatedDate: Date.now()
            };
        } else {
            return {
                processState: Math.random() > 0.3 ? 'RUNNING' : 'IDLE',
                lastUpdatedDate: Date.now()
            };
        }
    },

    /**
     * Change the state of a server (e.g., RUNNING, IDLE).
     * @param server The server to modify
     * @param state The target state
     * @param jobId Optional job ID if changing state for a specific job
     * @returns Promise with response
     */
    changeServerState: async (server: Server, state: string, jobId?: string): Promise<ServerStateResponse> => {
        console.log(`Changing state of server ${server.name} to ${state}` + (jobId ? ` for job ${jobId}` : ''));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update cache if the server exists in it
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].status = state;
                serverCache[server.type][serverIndex].cssClass =
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
     * Control server with a specific operation.
     * @param server The server to modify
     * @param link The operation link/command
     * @param args Any arguments for the operation
     * @returns Promise with response text
     */
    controlServer: async (server: Server, link: string, args: any): Promise<string> => {
        console.log(`Controlling server ${server.name} with link ${link}, args:`, args);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        return `Operation ${link} completed successfully on ${server.name} with args: ${args || 'none'}`;
    },

    /**
     * Starts application servers.
     * @param server The server to start
     * @param state Typically "STARTING"
     */
    startAppServers: async (server: Server, state: string): Promise<ServerStateResponse> => {
        console.log(`Starting app server ${server.name}, target state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update cache
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].status = 'RUNNING';
                serverCache[server.type][serverIndex].cssClass = 'green-bg';
            }
        }

        return {
            processState: 'RUNNING',
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Shuts down application servers.
     * @param server The server to shut down
     * @param state Typically "STOPPING"
     */
    shutdownAppServers: async (server: Server, state: string): Promise<ServerStateResponse> => {
        console.log(`Shutting down app server ${server.name}, target state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update cache
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].status = 'DOWN';
                serverCache[server.type][serverIndex].cssClass = 'red-bg';
            }
        }

        return {
            processState: 'DOWN',
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Restarts application servers.
     * @param server The server to restart
     * @param state Typically "RESTARTING"
     */
    restartAppServers: async (server: Server, state: string): Promise<ServerStateResponse> => {
        console.log(`Restarting app server ${server.name}, target state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update cache
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].status = 'RUNNING';
                serverCache[server.type][serverIndex].cssClass = 'green-bg';
            }
        }

        return {
            processState: 'RUNNING',
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Toggles control for a server type in an environment.
     * @param type Server type
     * @param control Boolean indicating if control is enabled
     * @param env Environment name
     */
    toggleControl: async (type: string, control: boolean, env: string): Promise<void> => {
        console.log(`Toggling control for type ${type} to ${control} in env ${env}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
    },

    /**
     * Tails Splunk log for a server.
     * @param server The server for which to get logs
     * @param lines Number of log lines to retrieve
     */
    tailSplunkLog: async (server: Server, lines: number): Promise<string> => {
        console.log(`Tailing Splunk log for ${server.name}, lines: ${lines}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

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

    /**
     * Switches priority for a server.
     * @param server The server to modify
     * @param state Typically "SWITCHING"
     */
    switchPriority: async (server: Server, state: string): Promise<ServerStateResponse> => {
        console.log(`Switching priority for server ${server.name}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        const priorities = Object.values(Constants.ASTRO_DASHBOARD_QUEUE_TYPES || { 'Primary': 'Primary', 'Secondary': 'Secondary' });
        const currentIndex = priorities.indexOf(server.priority || 'Primary');
        const nextIndex = (currentIndex + 1) % priorities.length;
        const newPriority = priorities[nextIndex];

        // Update cache
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].priority = newPriority;
            }
        }

        return {
            processState: state,
            priority: newPriority,
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Changes priority for a server to a specific value.
     * @param server The server to modify
     * @param state Typically "SWITCHING"
     * @param priority The new priority value
     */
    changePriority: async (server: Server, state: string, priority: string): Promise<ServerStateResponse> => {
        console.log(`Changing priority for server ${server.name} to ${priority}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        // Update cache
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].priority = priority;
            }
        }

        return {
            processState: state,
            priority: priority,
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Changes withdrawal duration for a server.
     * @param server The server to modify
     * @param state Typically "WITHDRAWAL_DURATION"
     * @param duration The new duration value
     */
    changeWithdrawalDuration: async (server: Server, state: string, duration: string): Promise<ServerStateResponse> => {
        console.log(`Changing withdrawal duration for ${server.name} to ${duration}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        // Update cache for visualization purposes
        if (server.type && serverCache[server.type] && server.withdrawalDurations) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0 && serverCache[server.type][serverIndex].withdrawalDurations) {
                // This would depend on your actual data structure
                // Here we're assuming duration is a key in the withdrawalDurations object
                // that we want to set as the active duration
                serverCache[server.type][serverIndex].withdrawalDurations = {
                    ...serverCache[server.type][serverIndex].withdrawalDurations,
                    active: duration
                };
            }
        }

        return {
            processState: state,
            withdrawalDurations: { [duration]: `${duration} sec` },
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Changes fetch duration for a server.
     * @param server The server to modify
     * @param state Typically "FETCH_DURATION"
     * @param duration The new duration value
     */
    changeFetchDuration: async (server: Server, state: string, duration: string): Promise<ServerStateResponse> => {
        console.log(`Changing fetch duration for ${server.name} to ${duration}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        // Update cache for visualization purposes
        if (server.type && serverCache[server.type] && server.fetchDurations) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0 && serverCache[server.type][serverIndex].fetchDurations) {
                // Similar to withdrawal durations
                serverCache[server.type][serverIndex].fetchDurations = {
                    ...serverCache[server.type][serverIndex].fetchDurations,
                    active: duration
                };
            }
        }

        return {
            processState: state,
            fetchDurations: { [duration]: `${duration} sec` },
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Switches fetcher state for a server.
     * @param server The server to modify
     * @param state Typically "FETCHER_SWITCHING"
     */
    switchFetcher: async (server: Server, state: string): Promise<ServerStateResponse> => {
        console.log(`Switching fetcher for server ${server.name}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        const newFetcherStatus = !(server.fetcher);

        // Update cache
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].fetcher = newFetcherStatus;
            }
        }

        return {
            processState: state,
            isFetcher: newFetcherStatus,
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Changes job type for a PrintServer.
     * @param server The server to modify
     * @param state Typically "PS_SWITCHING"
     * @param jobType The new job type
     */
    changeJobType: async (server: Server, state: string, jobType: string): Promise<ServerStateResponse> => {
        console.log(`Changing job type for PS ${server.name} to ${jobType}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        // Update cache
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].psJobType = jobType;
            }
        }

        return {
            processState: state,
            jobType: jobType,
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Sets number of policies for a PrintServer.
     * @param server The server to modify
     * @param state Typically "PS_CHANGE_LIMIT"
     * @param limit The new limit
     */
    setNumOfPolicies: async (server: Server, state: string, limit: number): Promise<ServerStateResponse> => {
        console.log(`Setting num of policies for PS ${server.name} to ${limit}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        // Update cache
        if (server.type && serverCache[server.type]) {
            const serverIndex = serverCache[server.type].findIndex(s => s.id === server.id);
            if (serverIndex >= 0) {
                serverCache[server.type][serverIndex].psLimit = limit;
            }
        }

        return {
            processState: state,
            numOfPolicies: limit,
            lastUpdatedDate: Date.now()
        };
    },

    /**
     * Gets message count for an email account.
     * @param emailUser The email account user
     * @param forceCheck Whether to force check
     */
    getMessagesCount: async (emailUser: string, forceCheck: boolean): Promise<string> => {
        console.log(`Getting message count for ${emailUser}, forceCheck: ${forceCheck}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));

        // Randomly decide whether to return error messages
        const errorMessageCount = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0;

        // Return in the format expected by the component
        return JSON.stringify({ errorMessageCount });
    },

    /**
     * Checks if a server is a Neevia converter.
     * @param server The server to check
     * @returns Boolean indicating if it's a Neevia converter
     */
    isNeeviaConverter: (server: Server): boolean => {
        // Check if server is a Neevia converter based on name or type
        const isNeevia = server.type === 'NEEVIA_CONVERTER' ||
            server.name.toLowerCase().includes('neevia');

        console.log(`Server ${server.name} isNeeviaConverter check: ${isNeevia}`);
        return isNeevia;
    }
};

export default controlService;