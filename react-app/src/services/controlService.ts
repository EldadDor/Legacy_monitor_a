// src/services/controlService.ts
import { Server, ServerStateResponse } from '../types/Server';
import { Constants } from '../utils/constantsConfiguration';

// API base URL - adjust according to your actual backend setup
const API_BASE_URL = '/api';

export const controlService = {
    /**
     * Fetches the list of all configured servers.
     * @returns Promise with array of servers
     */
    async getServers(): Promise<Server[]> {
        console.log("Fetching all servers...");

        // Simulate API call - replace with actual API call in production
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Placeholder data - replace with actual API call
        return [
            {
                id: 'server1',
                host: 'host1.example.com',
                name: 'AppServer01',
                link: 'appserver01/control',
                port: '8080',
                executable: 'server.jar',
                control: false,
                status: 'RUNNING',
                cssClass: null,
                lastUpdatedDate: Date.now(),
                forceCheck: false,
                serverState: 'RUNNING',
                type: 'APPLICATION'
            },
            {
                id: 'server2',
                host: 'host2.example.com',
                name: 'DBServer01',
                link: 'dbserver01/status',
                port: null,
                executable: null,
                control: false,
                status: 'IDLE',
                cssClass: null,
                lastUpdatedDate: Date.now(),
                forceCheck: false,
                serverState: 'IDLE',
                type: 'DATABASE'
            },
            {
                id: 'server3',
                host: 'localhost',
                name: 'astro-fetcher',
                link: 'astro/control',
                port: '8080',
                executable: null,
                control: false,
                status: 'RUNNING',
                cssClass: null,
                lastUpdatedDate: Date.now(),
                forceCheck: false,
                serverState: 'RUNNING',
                type: 'ASTRO',
                fetcher: true,
                priority: 'Primary'
            }
        ] as Server[];
    },

    /**
     * Get the current state of a specific server.
     * @param server The server to check
     * @param forceCheck Whether to force a check or use cached data
     * @returns Promise with server state information
     */
    getServerState: async (server: Server, forceCheck?: boolean): Promise<ServerStateResponse> => {
        console.log(`Getting state for server ${server.name}, forceCheck: ${forceCheck}`);

        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const isAstro = server.name.toLowerCase().startsWith('astro');

        // Generate different response types based on server type
        if (isAstro) {
            return {
                processState: Math.random() > 0.3 ? 'RUNNING' : 'IDLE',
                priority: Object.keys(Constants.ASTRO_QUEUE_TYPES)[Math.floor(Math.random() * 5)],
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
    changeServerState: async (server: Server, state: string, jobId?: string): Promise<any> => {
        console.log(`Changing state of server ${server.name} to ${state}` + (jobId ? ` for job ${jobId}` : ''));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real implementation, you would call your backend API
        // Example:
        // const response = await fetch(`${API_BASE_URL}/servers/${server.id}/state`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ state, jobId })
        // });
        // if (!response.ok) { throw new Error('Failed to change server state'); }
        // return response.json();

        return { success: true, newState: state };
    },

    /**
     * Starts application servers.
     * @param server The server to start
     * @param state Typically "STARTING"
     */
    startAppServers: async (server: Server, state: string): Promise<any> => {
        console.log(`Starting app server ${server.name}, target state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        return { success: true, status: 'STARTING' };
    },

    /**
     * Shuts down application servers.
     * @param server The server to shut down
     * @param state Typically "STOPPING"
     */
    shutdownAppServers: async (server: Server, state: string): Promise<any> => {
        console.log(`Shutting down app server ${server.name}, target state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        return { success: true, status: 'STOPPING' };
    },

    /**
     * Restarts application servers.
     * @param server The server to restart
     * @param state Typically "RESTARTING"
     */
    restartAppServers: async (server: Server, state: string): Promise<any> => {
        console.log(`Restarting app server ${server.name}, target state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        return { success: true, status: 'RESTARTING' };
    },

    /**
     * Toggles control for a server type in an environment.
     * @param type Server type
     * @param control Boolean indicating if control is enabled
     * @param env Environment name
     */
    toggleControl: async (type: string, control: boolean, env: string): Promise<any> => {
        console.log(`Toggling control for type ${type} to ${control} in env ${env}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        return { success: true };
    },

    /**
     * Tails Splunk log for a server.
     * @param server The server for which to get logs
     * @param lines Number of log lines to retrieve
     */
    tailSplunkLog: async (server: Server, lines: number): Promise<string[]> => {
        console.log(`Tailing Splunk log for ${server.name}, lines: ${lines}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate some dummy log lines
        const logLines = [];
        for (let i = 0; i < Math.min(lines, 20); i++) {
            logLines.push(`[${new Date().toISOString()}] INFO Server ${server.name}: Processing task ${i}`);
        }

        return logLines;
    },

    /**
     * Switches priority for a server.
     * @param server The server to modify
     * @param state Typically "SWITCHING"
     */
    switchPriority: async (server: Server, state: string): Promise<any> => {
        console.log(`Switching priority for server ${server.name}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        const priorities = Object.values(Constants.ASTRO_DASHBOARD_QUEUE_TYPES);
        const currentIndex = priorities.indexOf(server.priority || 'Primary');
        const nextIndex = (currentIndex + 1) % priorities.length;
        const newPriority = priorities[nextIndex];

        return { success: true, newPriority };
    },

    /**
     * Changes priority for a server to a specific value.
     * @param server The server to modify
     * @param state Typically "SWITCHING"
     * @param priority The new priority value
     */
    changePriority: async (server: Server, state: string, priority: string): Promise<any> => {
        console.log(`Changing priority for server ${server.name} to ${priority}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        return { success: true, prioritySet: priority };
    },

    /**
     * Changes withdrawal duration for a server.
     * @param server The server to modify
     * @param state Typically "WITHDRAWAL_DURATION"
     * @param duration The new duration value
     */
    changeWithdrawalDuration: async (server: Server, state: string, duration: string): Promise<any> => {
        console.log(`Changing withdrawal duration for ${server.name} to ${duration}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        return { success: true };
    },

    /**
     * Changes fetch duration for a server.
     * @param server The server to modify
     * @param state Typically "FETCH_DURATION"
     * @param duration The new duration value
     */
    changeFetchDuration: async (server: Server, state: string, duration: string): Promise<any> => {
        console.log(`Changing fetch duration for ${server.name} to ${duration}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        return { success: true };
    },

    /**
     * Switches fetcher state for a server.
     * @param server The server to modify
     * @param state Typically "FETCHER_SWITCHING"
     */
    switchFetcher: async (server: Server, state: string): Promise<any> => {
        console.log(`Switching fetcher for server ${server.name}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        return { success: true, fetcherEnabled: !(server.fetcher) };
    },

    /**
     * Control server with a specific operation.
     * @param server The server to modify
     * @param link The operation link/command
     * @param args Any arguments for the operation
     * @returns Promise with response text
     */
    controlServer: async (server: Server, link: string, args: any): Promise<string> => {
        console.log(`Controlling server ${server.name} with link ${link}, args: ${args}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        return `Operation ${link} completed successfully on ${server.name} with args: ${args}`;
    },

    /**
     * Changes job type for a PrintServer.
     * @param server The server to modify
     * @param state Typically "PS_SWITCHING"
     * @param jobType The new job type
     */
    changeJobType: async (server: Server, state: string, jobType: string): Promise<any> => {
        console.log(`Changing job type for PS ${server.name} to ${jobType}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        return { success: true };
    },

    /**
     * Sets number of policies for a PrintServer.
     * @param server The server to modify
     * @param state Typically "PS_CHANGE_LIMIT"
     * @param limit The new limit
     */
    setNumOfPolicies: async (server: Server, state: string, limit: number): Promise<any> => {
        console.log(`Setting num of policies for PS ${server.name} to ${limit}, state: ${state}`);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));

        return { success: true };
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