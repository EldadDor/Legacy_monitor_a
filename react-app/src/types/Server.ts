// src/types/server.ts
export interface Server {
    id: string;
    host: string;
    name: string;
    link: string;
    port: string | null;
    executable: string | null;
    control: boolean;
    status: string | null;
    cssClass: string | null; // No undefined
    lastUpdatedDate: number;
    forceCheck: boolean;

    // Server management related fields
    emailAccountUser?: string | null;
    errorMessageCount?: number | null;
    priority?: string | null;
    fetcher?: boolean | null;
    withdrawalDurations?: Record<string, string>;
    fetchDurations?: Record<string, string>;
    boostMode?: string | null;
    psJobType?: string | null;
    psLimit?: number | null;
    tasksCounter?: number;
    totalTasksCounter?: number;
    jobs?: any[];
    triggerTime?: string;
    isSearchQueryRunning?: boolean;

    // UI-specific fields
    serverState?: string; // This is separate from 'status' for UI purposes
    type?: string; // Server type for UI display
    queueType?: string;
    serverUniqueId?: string;
    withdrawalSeconds?: number;
    fetchSeconds?: number;
    startTime?: string;
    stopTime?: string;
    lastUpdateTimestamp?: number;
    version?: string;
    runByPrintServer?: boolean;
}

export interface ServerStateResponse {
    processState?: string;
    jobsProcessState?: Record<string, string>;
    priority?: string;
    isFetcher?: boolean;
    withdrawalDurations?: Record<string, string>;
    fetchDurations?: Record<string, string>;
    poolSize?: string;
    jobType?: string;
    numOfPolicies?: number;
    tasksCounter?: number;
    totalTasksCounter?: number;
    lastUpdatedDate?: number;
}