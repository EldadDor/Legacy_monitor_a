/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";
	function ServersTableComponent($scope, $interval, $http, $uibModal, $log, controlService, dataService, authService, alertsService, Constants) {
		var self = this;
		this.sortType = 'host'; // set the default sort type
		this.sortReverse = false;  // set the default sort order
		this.search = '';     // set the default search/filter term
		this.states = $scope.$parent.$ctrl.states;
		this.authState = authService;
		this.stop = {};
		this.styleOptions = {"LOW":"red-bg", "P": "red-bg"};

		this.psJobTypes = Constants.PRINTSERVER_JOBTYPES;
		this.queueTypes = Constants.ASTRO_DASHBOARD_QUEUE_TYPES;
		this.boostModes = Constants.BOOST_MODES;
		this.withdrawalSpeeds = Constants.WITHDRAWAL_SPEEDS;
		this.fetchSpeeds = Constants.WITHDRAWAL_SPEEDS;
		init();

		this.runServers = function () {
			controlServersOperation(controlService.changeServerState, Constants.SERVER_STATE.RUNNING);
		};

		this.idleServers = function () {
			controlServersOperation(controlService.changeServerState, Constants.SERVER_STATE.IDLE);
		};

		////

		this.startServers = function () {
			controlServersOperation(controlService.startAppServers, Constants.SERVER_STATE.STARTING);
		};

		this.shutdownServers = function () {
			controlServersOperation(controlService.shutdownAppServers, Constants.SERVER_STATE.STOPPING);
		};

		this.restartServers = function () {
			controlServersOperation(controlService.restartAppServers, Constants.SERVER_STATE.RESTARTING);
		};

		this.toggleControl = function () {
			self.control=!self.control;
			controlService.toggleControl(self.type, self.control, authService.getCurrentEnv());
		};

		this.checkAll = function () {
			angular.forEach(self.data, function (server) {
				if (self.allSelected && server.executable==null) {
					server.control = true;
				} else {
					server.control = false;
				}
			});
		};

		this.$onChanges = function (changes) {
			console.log("onChanges", changes);
			alertsService.clearAlerts();
			checkServersState();
		};

		this.showServerLog = function (server) {
			server.isSearchQueryRunning = true;
			controlService.tailSplunkLog(server, Constants.DEFAULT_LOG_LINES).then(function (serverLog) {
				server.isSearchQueryRunning = false;
				var modalInstance = $uibModal.open({
					animation: true,
					component: 'logModalComponent',
					size: 'xl',
					resolve: {
						server: function () {
							return server;
						},
						serverLog: function () {
							return serverLog;
						}
					}
				});
			}, function (response) {
				server.isSearchQueryRunning = false;
			});
		};

		this.switchPriority = function() {
			controlServersOperation(controlService.switchPriority, Constants.SERVER_STATE.SWITCHING);
		};

		this.changePriority = function (server) {
			var priorityValue = Object.keys(self.queueTypes).find(key => self.queueTypes[key] === server.priority);
			controlServersOperation(controlService.changePriority, Constants.SERVER_STATE.SWITCHING, server, priorityValue);
		};
		this.changeWithdrawalDuration = function (server, priorityName) {
			controlServersOperation(controlService.changeWithdrawalDuration, Constants.SERVER_STATE.WITHDRAWAL_DURATION, server, priorityName);
		};
		this.changeFetchDuration = function (server, priorityName) {
			controlServersOperation(controlService.changeFetchDuration, Constants.SERVER_STATE.FETCH_DURATION, server, priorityName);
		};

		// this.changeBoostMode = function (server) {
		// 	var boostModeValue = Object.keys(self.boostModes).find(key => self.boostModes[key] === server.priority);
		// 	controlServersOperation(controlService.changeBoostMode, Constants.SERVER_STATE.SWITCHING, server, boostModeValue);
		// };

		this.switchFetcher = function (server) {
			controlServersOperation(controlService.switchFetcher, Constants.SERVER_STATE.FETCHER_SWITCHING, server);
		};
		this.controlServer = function (server, link) {
			var args = null;
			if(link === "CM/setPoolSize") {
				if(server.boostMode == null) {
					console.log("server.boostMode is null")
					return;
				}
				args = server.boostMode;
			}
			if(link === "Printery/reschedule") {
				if(server.triggerTime == null) {
					console.log("server.triggerTime is null")
					return;
				}
				var time = server.triggerTime.split(":");
				args = time[0] + "/" + time[1];
			}
			controlService.controlServer(server, link, args).then(function successCallback(response) {
				var modalInstance = $uibModal.open({
					animation: true,
					component: 'popupComponent',
					size: 'md',
					resolve: {
						text: function () {
							return response;
						}
					}
				});
			}, function errorCallback(response) {
			});
		};


		this.switchServerRunningState = function (server) {
			if(server.status !== "IDLE" && server.status !== "RUNNING") {
				return;
			}
			var state = server.status === "IDLE" ? Constants.SERVER_STATE.RUNNING : Constants.SERVER_STATE.IDLE;
			controlServersOperation(controlService.changeServerState, state, server);
		};

		this.switchJobRunningState = function (server, job) {
			if (job.status !== "IDLE" && job.status !== "RUNNING") {
				return;
			}
			var state = job.status === "IDLE" ? Constants.SERVER_STATE.RUNNING : Constants.SERVER_STATE.IDLE;
			controlServersOperation(controlService.changeServerState, state, server, job.id);
		};

		this.changeJobType = function(server) {
			var jobTypeValue  = Object.keys(self.psJobTypes).find(key => self.psJobTypes[key] === server.psJobType);
			controlServersOperation(controlService.changeJobType, Constants.SERVER_STATE.PS_SWITCHING, server, jobTypeValue);
		};

		this.setNumOfPolicies = function (server) {
			controlServersOperation(controlService.setNumOfPolicies, Constants.SERVER_STATE.PS_CHANGE_LIMIT, server, server.psLimit);
		};

		function init() {
			var checkServersStateInterval = $interval(checkServersState, $scope.$parent.$ctrl.checkInterval);
			checkServersState();
			var checkErrorMessageCountInterval = $interval(checkErrorMessageCount, $scope.$parent.$ctrl.checkInterval);
			checkErrorMessageCount();
			$scope.$on('$destroy', function () {
				console.log("$destroy");
				$interval.cancel(checkServersStateInterval);
				$interval.cancel(checkErrorMessageCountInterval);
			});
		}

		function controlServersOperation(f, state, server, p1) {
			var selectedItems = [];
			var operation = self.states[state].operation;
			var serverState = self.states[state].serverState;
			if (server !== undefined) {
				selectedItems.push(server);
			} else {
				angular.forEach(self.data, function (server, arrayIndex) {
					if (server.control && server.executable == null) {
						selectedItems.push(server);
					}
				});
			}
			if (Object.keys(selectedItems).length === 0) { // if no item was selected
				return;
			}
			var modalInstance = $uibModal.open({
				animation: true,
				component: 'modalComponent',
				resolve: {
					items: function () {
						return selectedItems;
					},
					operation: function() {
						return operation;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				changeServersState(f, selectedItems, serverState, p1);
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
				if (server !== undefined) {
					updateServerState(server, false);
				}
			});
		}

		function changeServersState(f, selectedServers, state, p1) {
			angular.forEach(selectedServers, function (server, arrayIndex) {
				if (!controlService.isNeeviaConverter(server) && isValid(server)) {
					server.forceCheck = true;
					server.status = null;
					f(server, state, p1)
						.then(function successCallback(response) {
							updateResponseStatus(server, response);
							$log.info("updateResponseStatus: server=" + server.name + ", status=" + server.status)
							updateServerState(server, true);
						}, function errorCallback(response) {
							updateErrorStatus(server, Constants.SERVER_STATE.DOWN);
							updateServerState(server, true);
						});
				}
				server.control = false;
			});
		}

		function checkServersState() {
			var currentEnv = authService.getCurrentEnv();
			angular.forEach(self.data, function (server) {
				if(server.forceCheck) {
					//skipping servers check after forced check (forced check returns updated state)
					// server.forceCheck = false;
				} else {
					if (isValid(server)) {
						updateServerState(server, false)
					} else {
						updateErrorStatus(server, Constants.SERVER_STATE.OLD);
					}
				}
			});
		}

		function updateServerState(server, forceCheck) {
			server.forceCheck = forceCheck;
			var alert = server.host + "::" + server.name + " is down";
			controlService.getServerState(server, forceCheck)
				.then(function successCallback(response) {
					updateResponseStatus(server, response);
					server.forceCheck = false;
					if(response.processState !== undefined && self.states[response.processState].serverState !== 'DOWN') {
						alertsService.removeAlert(alert);
					} else {
						alertsService.addAlert(alert, "", authService.getCurrentEnv());
					}
					if(response.processState !== undefined) {
						var serverState = self.states[response.processState].serverState;
						if(serverState === 'RUNNING') {
							alertsService.removeHostAlert(server);
						} else if(serverState === 'DOWN') {
							alertsService.addHostAlert(server, Constants.SERVER_STATE.DOWN, authService.getCurrentEnv());
						} else if(serverState === 'IDLE') {
							alertsService.addHostAlert(server, Constants.SERVER_STATE.IDLE, authService.getCurrentEnv());
						}
					}
				}, function errorCallback(response) {
					updateErrorStatus(server, Constants.SERVER_STATE.DOWN);
					server.forceCheck = false;
					alertsService.addAlert(alert, "", authService.getCurrentEnv());
					alertsService.addHostAlert(server, Constants.SERVER_STATE.DOWN, authService.getCurrentEnv());
				});
		}

		function checkErrorMessageCount() {
			var currentEnv = authService.getCurrentEnv();
			angular.forEach(self.data, function (server) {
				if (server.emailAccountUser != null) {
					var alert = "There are failed messages in " + server.emailAccountUser + " mailbox";
					controlService.getMessagesCount(server.emailAccountUser, false)
						.then(function successCallback(response) {
							if(response !== "") {
								server.errorMessageCount = JSON.parse(response).errorMessageCount;
								if (server.errorMessageCount > 0) {
									alertsService.addAlert(alert, "", currentEnv);
								} else {
									alertsService.removeAlert(alert);
								}
							}
						}, function errorCallback(response) {
							server.errorMessageCount = null;
							alertsService.removeAlert(alert);
						});
				}
			});
		}

		function updateResponseStatus(server, response) {
			if (server.name.startsWith("astro")) {
				var priorityValue = Object.keys(Constants.ASTRO_QUEUE_TYPES).find(key => Constants.ASTRO_QUEUE_TYPES[key] === response.priority);
				server.priority = self.queueTypes[priorityValue];
				server.fetcher = response.isFetcher;
				server.withdrawalDurations = response.withdrawalDurations;
				server.fetchDurations = response.fetchDurations;
				if(server.host === "localhost") {
					$log.info(server.withdrawalDurations);
					$log.info(server.fetchDurations);
				}
			} else {
				server.tasksCounter = response.tasksCounter;
				server.totalTasksCounter = response.totalTasksCounter;
			}
			if (response.poolSize !== undefined) {
				server.boostMode = response.poolSize;
			}
			if(response.processState !== undefined) {
				server.status = self.states[response.processState].serverState;
				server.cssClass = self.states[response.processState].cssClass;
				if(response.jobsProcessState != null && response.jobsProcessState !== undefined) {
					if(server.jobs === undefined) {
						$log.info("jobs is undefined, server=" + server.name);
					} else {
						angular.forEach(response.jobsProcessState, function (value, key) {
							var jobIndex = server.jobs.findIndex(function (item) {
								return item.id === key;
							});
							// var arrKey = Object.keys(server.jobs).find(job => server.jobs.filter(function(item) { return item.id === key; }));
							if (server.jobs[jobIndex] !== undefined) {
								server.jobs[jobIndex].status = self.states[value].serverState;
								server.jobs[jobIndex].cssClass = self.states[value].cssClass;
							}
						});
					}
				}
			}
			server.psJobType = self.psJobTypes[response.jobType];
			server.psLimit = response.numOfPolicies;
			if (response.lastUpdatedDate) {
				server.lastUpdatedDate = response.lastUpdatedDate;
			} else {
				server.lastUpdatedDate = Date.now();
			}
		}

		function updateErrorStatus(server, status) {
			if (server.name.startsWith("astro")) {
				server.priority = null;
				server.fetcher = null;
				server.withdrawalDurations = null;
				server.fetchDurations = null;
				server.boostMode = null;
			}
			server.status = self.states[status].serverState;
			server.cssClass = self.states[status].cssClass;
			server.lastUpdatedDate = Date.now();
		}

		function isValid(server) {
			if (server.host != null && server.link != null && (server.port != null || server.host==='wsdev' || server.host==='wsprod')) {
				return true;
			}
			return false;
		}
	}


	appModule.component('adServersTable', {
		templateUrl: 'app/shared/serversTable.html',
		controller: ServersTableComponent,
		bindings: {
			data: "<",
			type: "<",
			control: "<"
		}
	});
})();