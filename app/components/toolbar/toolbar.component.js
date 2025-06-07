/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";
	function ToolbarComponent($rootScope, $http, $location, $interval, $uibModal, authService, alertsService, controlService, splunkService, Constants) {
		var self = this;
		this.environments = Constants.ENV;
		this.dataSources = Constants.DATA_SOURCES;
		this.state = authService;
		this.alerts = alertsService.getAlerts();
		this.isNavCollapsed = true;
		this.isCollapsed = false;
		this.isCollapsedHorizontal = false;
		this.isSearchQueryRunning = false;
		tick();
		$interval(tick, 1000);

		this.logout = function () {
			// $http.post('logout', {}).finally(function () {
			// 	authService.setAuthenticated(false);
			// 	$location.path("/login");
			// });
		};

		this.selectEnv = function () {
			if(authService.getCurrentEnv() === Constants.ENV.PROD) {
				authService.setCurrentDataSource(Constants.DATA_SOURCES.PROD);
			} else {
				authService.setCurrentDataSource(Constants.DATA_SOURCES.USERTEST);
			}
			$rootScope.$broadcast(Constants.EVENTS.UPDATE_DATA);
		};

		this.selectDataSource = function () {
			$rootScope.$broadcast(Constants.EVENTS.UPDATE_DATA);
		};

		function tick() {
			self.tickingClock = Date.now();
		}

		this.showControlOperationsLog = function () {
			var server = {};
			server.host='astromonitor';
			server.source='prod';
			server.sourcetype='astromonitor';
			var query = "Control action performed";
			var sourceType = "astromonitor";
			self.isSearchQueryRunning = true;
			splunkService.getSearchResults(sourceType, query, "time,ServerName,Host,ControlAction,Username,StationNr,ServerType", "-7d").then(function (response) {
				self.isSearchQueryRunning = false;
				var modalInstance = $uibModal.open({
					animation: true,
					component: 'logModalComponent',
					size: 'xl',
					resolve: {
						server: function () {
							var server={};
							server.host = sourceType;
							server.name = "dashboard";
							return server;
						},
						query: function () {
							return query;
						},
						title: function () {
							return "Control Actions";
						},
						data: function () {
							return JSON.parse(response.data).results;
						}
					}
				});
			}, function (response) {
				self.isSearchQueryRunning = false;
				console.log(response);
			});
		};
	}


	appModule.component('adToolbar', {
		templateUrl: 'app/components/toolbar/toolbar.html',
		controller: ToolbarComponent
	});
})();