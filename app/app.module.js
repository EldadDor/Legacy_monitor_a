var appModule = angular.module("MyApp", ['ui.bootstrap', 'ui.router', 'ngCookies', 'chart.js', 'ui.grid', 'ui.grid.pinning','ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav','ui.grid.selection','ui.grid.validate']);
// appModule.factory('$exceptionHandler', function () {
// 	return function (exception, cause) {
// 		exception.message += 'Angular Exception: "' + cause + '"';
// 		throw exception;
// 	};
// });
appModule.config(function ($stateProvider, $urlRouterProvider) {
	//ChartJsProvider.setOptions( {scaleBeginAtZero: true} );
	// $sceProvider.enabled(false);
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state({
			name: 'home',
			url: '/',
			template: '<astro-dashboard></astro-dashboard>'
		})
		.state({
			name: 'login',
			url: '/login',
			template: '<ad-login></ad-login>'
		})
		.state({
			name: 'dcmonitor',
			url: '/dcmonitor',
			template: '<ad-dcmonitor></ad-dcmonitor>'
		})
		.state({
			name: 'digitalforms',
			url: '/digitalforms',
			template: '<ad-digitalforms></ad-digitalforms>'
		})
		.state({
			name: 'myinbox',
			url: '/myinbox',
			template: '<ad-my-inbox></ad-my-inbox>'
		})
		.state({
			name: 'tables',
			url: '/tables',
			template: '<ad-charts  chart-size="\'col-lg-6\'" chart-type="\'line\'"></ad-charts>'
		})
		.state({
			name: 'queries',
			url: '/queries',
			template: '<ad-queries></ad-queries>'
		})
		.state({
			name: 'campaigns',
			url: '/campaigns',
			template: '<ad-campaigns></ad-campaigns>'
		})
		.state({
			name: 'whatsapp',
			url: '/whatsapp',
			template: '<ad-whatsapp></ad-whatsapp>'
		})
		.state({
			name: 'admin',
			url: '/admin',
			template: '<ad-admin></ad-admin>'
		});
});

appModule.constant('Constants', {
	'EVENTS': {'UPDATE_DATA': 'updateDataEvent', 'UPDATE_INBOX': 'updateInboxMessages'},
	'ASTRO_CHECK_INTERVAL': '15000',
	'QUEUE_CHECK_INTERVAL': '30000',
	'DC_CHECK_INTERVAL': '15000',
	'ENV': {'PROD': 'PROD', 'DEV': 'DEV'},
	'DATA_SOURCES': {'USERTEST': 'USERTEST', 'YEST': 'YEST', 'TEST': 'TEST', 'TRAINING': 'TRAINING'},
	'PRINTSERVER_JOBTYPES': {'0': 'ALL', '1': 'ONLINE', '2': 'BATCH'},
	'LOG_LINES': {'0': 50, '1': 100, '2': 300, '3': 500, '4': 1000},
	'DEFAULT_LOG_LINES': 50,
	'ASTRO_QUEUE_TYPES': {
		'-1': 'NONE',
		'1': 'HIGH_ONLY',
		'0': 'LOW_ONLY',
		'3': 'PRIORITY_ONLY',
		'4': 'PRIORITY_LOW',
		'5': 'BOOST',
		'6': 'HIGH_BOOST',
		'7': 'HIGH_LOW_BOOST',
		'2': 'ALL'
	},
	'ASTRO_DASHBOARD_QUEUE_TYPES': {
		'-1': 'NONE',
		'1': 'HIGH',
		'0': 'LOW',
		'3': 'P',
		'4': 'P_L',
		'5': 'BOOST',
		'6': 'H_B',
		'7': 'H_L_B',
		'2': 'ALL'
	},
	// 'BOOST_MODES': {
	// 	'0': 'DEFAULT',
	// 	'1': 'LOW BOOST',
	// 	'2': 'DEFAULT BOOST',
	// 	'3': 'HIGH BOOST',
	// 	'4': 'TURBO BOOST'
	// },
	'BOOST_MODES': {
		1: 1,
		3: 3,
		5: 5,
		10: 10,
		15: 15
	},
	'WITHDRAWAL_SPEEDS': {
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		7: 7,
		10: 10,
		15: 15,
		20: 20,
		25: 25,
		30: 30
	},
	'ASTRO_PRIORITIES': {"HIGH": 1, "LOW": 0, "PRIORITY": 2, "BOOST": 3},
	'ASTRO_QUEUES': {0:'HIGH',1: 'LOW', 2:'PRIORITY', 3:'BOOST'},
	'ASTRO_QUEUE_PRIORITIES': [
		{priority: 1, name:'High', color: "orange-light", icon: "fa-long-arrow-alt-up"},
		{priority: 0, name:'Low', color: "blue-light", icon: "fa-long-arrow-alt-down"},
		{priority: 2, name:'P', color: "p-queue-light", icon: "fa-priority-queue"},
		{priority: 3, name:'B', color: "b-queue-light", icon: "fa-boost-queue"}
	],
	'SERVER_STATE': {
		'RUNNING': 0,
		'HALTING': 1,
		'IDLE': 2,
		'DOWN': 3,
		'DISCONNECTED': 4,
		'SWITCHING': 5,
		'OLD': 6,
		'PS_SWITCHING': 7,
		'FETCHER_SWITCHING': 8,
		'RESTARTING': 9,
		'STARTING': 10,
		'STOPPING': 11,
		'PS_CHANGE_LIMIT': 12,
		'WITHDRAWAL_DURATION': 13,
		'FETCH_DURATION': 14
	},
	'ASTRO_STATES': [
		{serverState: 'RUNNING', cssClass: 'success', operation: 'run'},
		{serverState: 'HALTING', cssClass: 'danger'},
		{serverState: 'IDLE', cssClass: 'warning', operation: 'idle'},
		{serverState: 'DOWN', cssClass: 'danger'},
		{serverState: 'DISCONNECTED', cssClass: 'danger disconnected'},
		{serverState: 'SWITCHING', cssClass: 'warning', operation: 'switch priority'},
		{serverState: 'OLD', cssClass: 'primary'},
		{serverState: 'PS_SWITCHING', cssClass: 'warning', operation: 'PrintServer: setJobType'},
		{serverState: 'FETCHER_SWITCHING', cssClass: 'warning', operation: 'switch fetcher'},
		{serverState: 'RESTARTING', cssClass: 'warning', operation: 'restart'},
		{serverState: 'STARTING', cssClass: 'warning', operation: 'start'},
		{serverState: 'STOPPING', cssClass: 'warning', operation: 'stop'},
		{serverState: 'PS_CHANGE_LIMIT', cssClass: 'warning', operation: 'PrintServer: setNumofPolicies'},
		{serverState: 'WITHDRAWAL_DURATION', cssClass: 'warning', operation: 'change withdrawal duration'},
		{serverState: 'FETCH_DURATION', cssClass: 'warning', operation: 'change fetch duration'}
	],
	'DC_STATES': [
		{serverState: 'FAILURE', cssClass: 'warning'},
		{serverState: 'SUCCESS', cssClass: 'success'},
		{serverState: 'ERROR', cssClass: 'danger'},
		{serverState: 'TIMEOUT', cssClass: 'warning'},
		{serverState: 'DOWN', cssClass: 'danger'}
	],
	'rex': 'rex \"sid=(?P<distribnr>\\d+)#(?P<basketnr>\\d+)_(?P<userid>\\d+)_(?P<srvnr>\\d+)_(?P<ltype>\\d+)_(?P<failure>\\d+)_(?P<priority>\\d+)-?\"'

});

appModule.filter('range', function() {
	return function(input, min, max) {
		min = parseInt(min); //Make string input int
		max = parseInt(max);
		for (var i=min; i<max; i++)
			input.push(i);
		return input;
	};
});

appModule.filter('num', function() {
	return function(input) {
		return parseInt(input);
	}
});

