// /react-app/src/utils/constantsConfiguration.ts

export const Constants = {
  ENV: {
    PROD: 'PROD',
    USERTEST: 'USERTEST',
    YEST: 'YEST'
  },
  DATA_SOURCES: {
    PROD: 'PROD',
    USERTEST: 'USERTEST',
    YEST: 'YEST'
  },
  EVENTS: {
    UPDATE_DATA: 'update-data'
  },
  // Server state constants
  SERVER_STATE: {
    RUNNING: 'RUNNING',
    IDLE: 'IDLE',
    STARTING: 'STARTING',
    STOPPING: 'STOPPING',
    RESTARTING: 'RESTARTING',
    DOWN: 'DOWN',
    OLD: 'OLD',
    SWITCHING: 'SWITCHING',
    FETCHER_SWITCHING: 'FETCHER_SWITCHING',
    WITHDRAWAL_DURATION: 'WITHDRAWAL_DURATION',
    FETCH_DURATION: 'FETCH_DURATION',
    PS_SWITCHING: 'PS_SWITCHING',
    PS_CHANGE_LIMIT: 'PS_CHANGE_LIMIT'
  },

  // Check intervals
  ASTRO_CHECK_INTERVAL: 5000, // 5 seconds
  QUEUE_CHECK_INTERVAL: 30000, // 30 seconds

  // Default number of log lines to fetch
  DEFAULT_LOG_LINES: 200,

  BOOST_MODES: {
    'NORMAL': 'Normal',
    'FAST': 'Fast',
    'TURBO': 'Turbo',
    'MAX': 'Maximum'
  },


  // PrintServer job types
  PRINTSERVER_JOBTYPES: {
    '0': 'SoS',
    '1': 'Batch',
    '2': 'Realtime',
    '3': 'All'
  },

  // Astro dashboard queue types
  ASTRO_DASHBOARD_QUEUE_TYPES: {
    'P': 'Primary',
    'S': 'Secondary',
    'T': 'Tertiary',
    'Q': 'Quaternary',
    '5': 'Quinary'
  },

  // Regular expressions
  rex: "rex field=raw \"(\\S+)\\s+(\\S+)\\s+(\\S+)\\s+:\\s+(.*)\\s+:\\s+basket\\s+(\\S+)\\s+.*type=([\\w]+)\\s+.*priority=(\\w+)\"",

  // Astro queue types
  ASTRO_QUEUE_TYPES: {
    '0': 'BOOST',
    '1': 'PRIORITY',
    '2': 'HIGH',
    '3': 'LOW'
  },

  // Astro priorities
  ASTRO_PRIORITIES: {
    'BOOST': '0',
    'PRIORITY': '1',
    'HIGH': '2',
    'LOW': '3'
  },


  ASTRO_QUEUE_PRIORITIES: [
    { priority: '0', name: 'BOOST', icon: 'fa-rocket', color: '#dc3545' },
    { priority: '1', name: 'PRIORITY', icon: 'fa-star', color: '#fd7e14' },
    { priority: '2', name: 'HIGH', icon: 'fa-chevron-up', color: '#28a745' },
    { priority: '3', name: 'LOW', icon: 'fa-chevron-down', color: '#17a2b8' }
  ],


// Withdrawal speeds configuration
  WITHDRAWAL_SPEEDS: {
    '5': '5 sec',
    '10': '10 sec',
    '15': '15 sec',
    '30': '30 sec',
    '60': '1 min',
    '120': '2 min',
    '300': '5 min',
    '600': '10 min',
    '900': '15 min',
    '1800': '30 min',
    '3600': '1 hour'
  },

  // Default server states with visual representation
  DEFAULT_SERVER_STATES: {
    RUNNING: {
      serverState: 'RUNNING',
      cssClass: 'green-bg',
      operation: 'Run'
    },
    IDLE: {
      serverState: 'IDLE',
      cssClass: 'yellow-bg',
      operation: 'Idle'
    },
    STARTING: {
      serverState: 'STARTING',
      cssClass: 'blue-bg',
      operation: 'Start'
    },
    STOPPING: {
      serverState: 'STOPPING',
      cssClass: 'blue-bg',
      operation: 'Shutdown'
    },
    RESTARTING: {
      serverState: 'RESTARTING',
      cssClass: 'blue-bg',
      operation: 'Restart'
    },
    DOWN: {
      serverState: 'DOWN',
      cssClass: 'red-bg',
      operation: 'Down'
    },
    OLD: {
      serverState: 'OLD',
      cssClass: 'red-bg',
      operation: 'Old'
    },
    SWITCHING: {
      serverState: 'SWITCHING',
      cssClass: 'blue-bg',
      operation: 'Switch Priority'
    },
    FETCHER_SWITCHING: {
      serverState: 'FETCHER_SWITCHING',
      cssClass: 'blue-bg',
      operation: 'Switch Fetcher'
    },
    WITHDRAWAL_DURATION: {
      serverState: 'WITHDRAWAL_DURATION',
      cssClass: 'blue-bg',
      operation: 'Change Withdrawal Duration'
    },
    FETCH_DURATION: {
      serverState: 'FETCH_DURATION',
      cssClass: 'blue-bg',
      operation: 'Change Fetch Duration'
    },
    PS_SWITCHING: {
      serverState: 'PS_SWITCHING',
      cssClass: 'blue-bg',
      operation: 'Change Job Type'
    },
    PS_CHANGE_LIMIT: {
      serverState: 'PS_CHANGE_LIMIT',
      cssClass: 'blue-bg',
      operation: 'Change Policy Limit'
    }
  }
};