/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";

	function AstroDashboardComponent($state, $scope, $interval, $log, dataService, authService, dbService, controlService, splunkService, alertsService, Constants) {
		var self = this;
		this.authState = authService;
		this.states = Constants.ASTRO_STATES;
		this.checkInterval = Constants.ASTRO_CHECK_INTERVAL;
		this.checkBasketsQueuesInterval = null;
		this.priorities = Constants.ASTRO_PRIORITIES;
		this.queuePriorities = Constants.ASTRO_QUEUE_PRIORITIES;
		this.basketsB4QueueChartSize = 'col-lg-3';
		this.basketsInQueueChartSize = 'col-lg-3';
		this.basketsHandlingRateChartSize = 'col-lg-3 col-md-6 col-xs-12';
		this.mailboxesChartSize = 'col-lg-3 col-md-6 col-xs-12';
		this.basketsInQueue = 'col-lg-3';
		this.failedBaskets = 'col-lg-3';
		this.mailboxQueue = 'col-lg-3';
		this.alertState = alertsService;
		// this.hostDownCount = alertsService.getHostDownAlerts().length;
		// this.hostIdleCount = alertsService.getHostIdleAlerts().length;


		if (authService.isAuthenticated()) {
				loadDashboard();
		}
		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			loadDashboard();
		});

		function loadDashboard() {
			if (authService.isDigitalFormsRoleUser()) {
				$state.go("digitalforms");
				return;
			}
			self.basketsBeforeQueues = null;
			self.futureBasketsBeforeQueues = null;
			self.completedBasketsRates = null;
			self.highPriorityBasketsQueueSize = null;
			self.lowPriorityBasketsQueueSize = null;
			self.priorityBasketsQueueSize = null;
			self.boostBasketsQueueSize = null;
			angular.forEach(self.queuePriorities, function (queuePriority) {
				queuePriority.completedBasketsCount = null;
				queuePriority.completedBasketsLastHourCount = null;
				queuePriority.failedBasketsCount = null;
				queuePriority.failedBasketsLastHourCount = null;
			});
			self.queuePriorities = Constants.ASTRO_QUEUE_PRIORITIES;
			if (!self.checkBasketsQueuesInterval) {
				self.checkBasketsQueuesInterval = $interval(checkBasketsQueues, Constants.QUEUE_CHECK_INTERVAL);
				self.checkControlStateInterval = $interval(checkControlState, 5000);
				$scope.$on('$destroy', function () {
					$interval.cancel(self.checkBasketsQueuesInterval);
					$interval.cancel(self.checkControlStateInterval);
				});
			}
			updateData();
			checkBasketsQueues();
		}

		function checkControlState() {
			controlService.getControlState(self.ifsDataType, authService.getCurrentEnv()).then(function (response) {
				self.ifsControl = response;
			});
			controlService.getControlState(self.astroDataType, authService.getCurrentEnv()).then(function (response) {
				self.astroControl = response;
			});
			controlService.getControlState(self.ninjaDataType, authService.getCurrentEnv()).then(function (response) {
				self.ninjaControl = response;
			});
			// controlService.getControlState(self.sqrDataType, authService.getCurrentEnv()).then(function (response) {
			// 	self.sqrControl = response;
			// });
		}

		this.filterEmailAccounts = function (server) {
			if (server.emailAccountUser !== undefined) {
				return server;
			} else {
				return;
			}
		};

		function updateData() {
			dataService.getData("ifs").then(function (data) {
				self.ifsData = data;
				self.ifsDataType = 'ifs';
				controlService.getControlState(self.ifsDataType, authService.getCurrentEnv()).then(function (response) {
					self.ifsControl = response;
				});
			});
			dataService.getData("astro").then(function (data) {
				self.astroData = data;
				self.astroDataType = 'astro';
				controlService.getControlState(self.astroDataType, authService.getCurrentEnv()).then(function (response) {
					self.astroControl = response;
				});

			});
			dataService.getData("ninja").then(function (data) {
				self.ninjaData = data;
				self.ninjaDataType = 'ninja';
				controlService.getControlState(self.ninjaDataType, authService.getCurrentEnv()).then(function (response) {
					self.ninjaControl = response;
				});
			});
			dataService.getData("sqr").then(function (data) {
				self.sqrData = data;
				self.sqrDataType = 'sqr';
				controlService.getControlState(self.sqrDataType, authService.getCurrentEnv()).then(function (response) {
					self.sqrControl = response;
				});
			});
			dataService.getData("autofont").then(function (data) {
				self.autofontData = data;
				self.autofontDataType = 'autofont';
				controlService.getControlState(self.autofontDataType, authService.getCurrentEnv()).then(function (response) {
					self.autofontControl = response;
				});
			});

			dataService.getData("dc").then(function (data) {
				self.dcData = data;
				self.dcDataType = 'dc';
				controlService.getControlState(self.dcDataType, authService.getCurrentEnv()).then(function (response) {
					self.dcControl = response;
				});
			});
		}

		function checkBasketsQueues() {
			dbService.showBasketsBeforeQueue().then(function (response) {
				if (response.data.BasketsQueues === undefined) {
					self.basketsBeforeQueues = null;
				} else {
					//###############todo vladimir remove after order fix#########################
					var temp = response.data.BasketsQueues[3];
					response.data.BasketsQueues[3] = response.data.BasketsQueues[4];
					response.data.BasketsQueues[4] = temp;
					//##############################################################

					angular.forEach(response.data.BasketsQueues, function (queue, i) {
						if (i < 4) {
							queue.icon = self.queuePriorities[i].icon;
							queue.color = self.queuePriorities[i].color;
							queue.text = self.queuePriorities[i].name;
						}
					});
					if (response.data.BasketsQueues[4].size === 0) {
						response.data.BasketsQueues[4] = {};
					} else {
						response.data.BasketsQueues[4].icon = "fa-file-image-o";
					}
					self.basketsBeforeQueues = response.data.BasketsQueues;
				}
				self.basketsBeforeQueueDate = Date.now();
			}, function () {
				self.basketsBeforeQueues = null;
				self.basketsBeforeQueueDate = Date.now();
			});

			dbService.showFutureBasketsBeforeQueue().then(function (response) {
				self.futureBasketsBeforeQueues = response.data.BasketsQueues;
				self.futureBasketsBeforeQueueDate = Date.now();
			}, function () {
				self.futureBasketsBeforeQueues = null;
				self.futureBasketsBeforeQueueDate = Date.now();
			});

			dbService.showFailedBasketsBeforeQueue().then(function (response) {
				self.failedBasketsLastHourCount = response.data.BasketsQueues;
				self.failedBasketsLastHourCountDate = Date.now();
			}, function () {
				self.failedBasketsLastHourCount = null;
				self.failedBasketsLastHourCountDate = Date.now();
			});

			dbService.showCompletedBaskets().then(function (response) {
				if (response.data.BasketsQueues === undefined) {
					self.completedBasketsRates = null;
				} else {
					self.completedBasketsRates = response.data.BasketsQueues;
					self.completedBasketsRatesDate = Date.now();
					angular.forEach(self.queuePriorities, function (queuePriority, i) {
						var completedBasketsRate = self.completedBasketsRates[i].size;
						queuePriority.completedBasketsRateDate = Date.now();
						let queueSize = self.basketsBeforeQueues[i].size;
						if (queueSize === 0) {
							queuePriority.ewt = "~"
						} else if (completedBasketsRate === 0) {
							queuePriority.ewt = "∞"
						} else {
							var seconds = queueSize / completedBasketsRate * 60;
							var minutes = Math.floor(seconds / 60);
							var hours = Math.floor(seconds / 60 / 60);
							if (minutes >= 1 && minutes < 60) {
								queuePriority.ewt = minutes + "m";
							} else if (minutes >= 60) {
								queuePriority.ewt = hours + "h";
								minutes = minutes % 60;
								if (minutes > 0) {
									queuePriority.ewt += " " + minutes + "m";
								}
							} else {
								queuePriority.ewt = Math.floor(seconds) + "s"
							}
							// queuePriority.ewt = Math.round(( + Number.EPSILON) * 100) / 100;
						}
					});
				}
			}, function () {
				self.completedBasketsRate = null;
				self.completedBasketsRateDate = Date.now();
			});

			var astroSourceType = authService.getCurrentAstroSourceType();
			var ifsSourceType = authService.getCurrentIfsSourceType();
			var astroSource = authService.getCurrentAstroSource();
			angular.forEach(self.queuePriorities, function (queuePriority, i) {
				splunkService.getCountSearchResults(astroSourceType, astroSource, "Basket Completed Successfully | " + Constants.rex + " | where priority=" + queuePriority.priority).then(function (response) {
					queuePriority.completedBasketsCount = response.data;
					queuePriority.completedBasketsCountQuery = extractQuery(response);
					queuePriority.completedBasketsCountDate = Date.now();
				}, function (response) {
					console.log("Failed to fetch splunk search results, response=" + response);
					queuePriority.completedBasketsCount = "";
					queuePriority.completedBasketsCountDate = Date.now();
				})
				splunkService.getCountSearchResults(astroSourceType, astroSource, "Basket Completed Successfully | " + Constants.rex + " | where priority=" + queuePriority.priority, "-1h").then(function (response) {
					queuePriority.completedBasketsLastHourCount = response.data;
					queuePriority.completedBasketsLastHourCountQuery = extractQuery(response);
					queuePriority.completedBasketsLastHourCountDate = Date.now();
				}, function (response) {
					console.log("Failed to fetch splunk search results, response=" + response);
					queuePriority.completedBasketsLastHourCount = "";
					queuePriority.completedBasketsLastHourCountDate = Date.now();
				})
				splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | dedup distribnr | where priority=" + queuePriority.priority, "-1h").then(function (response) {
					queuePriority.failedBasketsLastHourCount = response.data;
					queuePriority.failedBasketsLastHourCountQuery = extractQuery(response);
					queuePriority.failedBasketsLastHourCountDate = Date.now();
				}, function (response) {
					console.log("Failed to fetch splunk search results, response=" + response);
					queuePriority.failedBasketsLastHourCount = "";
					queuePriority.failedBasketsLastHourCountDate = Date.now();
				})

				splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | dedup distribnr | where priority=" + queuePriority.priority).then(function (response) {
					queuePriority.failedBasketsCount = parseInt(response.data);
					queuePriority.failedBasketsCountQuery = extractQuery(response);
					queuePriority.failedBasketsCountDate = Date.now();
				}, function (response) {
					console.log("Failed to fetch splunk search results, response=" + response);
					queuePriority.failedBasketsCount = "";
					queuePriority.failedBasketsCountDate = Date.now();
				})
			});

			splunkService.getCountSearchResults(ifsSourceType, "returned-resend", "Starting to process new returned email","-1h").then(function (response) {
				self.returnedCount = response.data;
				self.returnedCountQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.returnedCount = "";
			});

			splunkService.getCountSearchResults(authService.getCurrentDocConverterSourceType(), "*", "DOC_NOT_CONVERTED NOT .heic","-1h").then(function (response) {
				self.failedConversionsCount = response.data;
				self.failedConversionsCountQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.failedConversionsCount = "";
			});

			if (authService.getCurrentEnv() === Constants.ENV.PROD || authService.getCurrentDataSource() === Constants.DATA_SOURCES.USERTEST) {
				dbService.showBasketsInQueueByType("HIGH").then(function (response) {
					self.highPriorityBasketsQueueSize = response.data.size;
					self.highPriorityBasketsQueueDate = Date.now();
				}, function () {
					self.highPriorityBasketsQueueSize = "error";
					self.highPriorityBasketsQueueDate = Date.now();
				});
				dbService.showBasketsInQueueByType("LOW").then(function (response) {
					self.lowPriorityBasketsQueueSize = response.data.size;
					self.lowPriorityBasketsQueueDate = Date.now();
				}, function () {
					self.lowPriorityBasketsQueueSize = "error";
					self.lowPriorityBasketsQueueDate = Date.now();
				});

				dbService.showBasketsInQueueByType("PRIORITY").then(function (response) {
					self.priorityBasketsQueueSize = response.data.size;
					self.priorityBasketsQueueDate = Date.now();
				}, function () {
					self.priorityBasketsQueueSize = "error";
					self.priorityBasketsQueueDate = Date.now();
				});

				dbService.showBasketsInQueueByType("BOOST").then(function (response) {
					self.boostBasketsQueueSize = response.data.size;
					self.boostBasketsQueueDate = Date.now();
				}, function () {
					self.boostBasketsQueueSize = "error";
					self.boostBasketsQueueDate = Date.now();
				});
			}
		}

		function extractQuery(response) {
			var res = response.query.split("rex");
			var query = res[0] + "rex" + encodeURIComponent(res[1]);
			return query;
		}
	}

	appModule.component('astroDashboard', {
		templateUrl: 'app/components/dashboard/dashboard.html',
		controller: AstroDashboardComponent
	});
})();