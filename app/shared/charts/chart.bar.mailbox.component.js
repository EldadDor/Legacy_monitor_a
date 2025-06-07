
/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";

	function ChartBarMailboxComponent($scope, $http, $timeout, $interval, controlService, dataService, authService, dbService, Constants) {
		var self = this;
		loadData();
		var checkInterval = $interval(updateChartData, Constants.QUEUE_CHECK_INTERVAL);

		$scope.$on('$destroy', function () {
			$interval.cancel(checkInterval);
		});
		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			// self.chartLabels = [];
			self.chartLabels = [];
			self.chartData = [];
			loadData();
		});
		self.defaultChartSize = self.chartSize;
		self.zoomIcon = "in";

		this.refreshInboxFolders = function () {
			updateChartData(true);
		};

		this.colors = ['#949FB1', '#949FB1', '#949FB1', '#949FB1'];


		this.zoomChart = function () {
			if (self.chartSize === "col-lg-12") {
				self.chartSize = self.defaultChartSize;
				self.zoomIcon = "in";
			} else {
				self.chartSize = "col-lg-12";
				self.zoomIcon = "out";
			}
		};

		this.onClick = function (points, evt) {
			// console.log(points[0]._index);
		};


		//this.colors = [
		//            {
		//              pointBackgroundColor: "rgba(159,204,0, 1)",
		//              pointHoverBackgroundColor: "rgba(159,204,0, 0.8)",
		//              pointBorderColor: '#fff',
		//              pointHoverBorderColor: "rgba(159,204,0, 1)"
		//            }
		//          ];
		this.items = [
			'Last hour',
			'Last 2 hours',
			'Last 3 hours'
		];
		this.chartPeriod = 'Last hour';

		this.options = {
			responsive: true,
			maintainAspectRatio: false,
			chartArea: {
				backgroundColor: '#ffffff'
			},
			scales: {
				yAxes: [{
					ticks: {
						min: 0,
						precision: 0
					},
					// scaleLabel: {
					// 	display: true,
					// 	// labelString: 'Baskets'
					// }
				}],
				xAxes: [{
					ticks: {
						display: false //this will remove only the label
					}
				}]
			},

			// legend: {
			// 	display: true,
			// 	labels: {
			// 		fontColor: 'rgb(255, 99, 132)'
			// 	}
			// },
			tooltips: {//https://www.chartjs.org/docs/latest/configuration/tooltip.html
				intersect: false,
				bodyFontSize: 14,
				titleFontSize: 14,
				backgroundColor: '#ffffff',
				// backgroundColor: "linear-gradient('#FFFFFF', '#E0E0E0')",
				titleFontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-ser',
				bodyFontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-ser',
				bodyFontColor: '#000',
				titleFontColor: '#000',
				borderColor: '#AAA',
				borderWidth: 1,
				cornerRadius: 6
			}
		};

		function loadData() {
			dataService.getData("ifs").then(function (data) {
				self.emailAccountsServers = [];
				data.forEach(function (server) {
					if (server.emailAccountUser !== undefined) {
						self.emailAccountsServers.push(server);
					}
				});
				updateChartData(false);
			});
		}


		function updateChartData(forceRefresh) {
			// var refreshMessageCount = (typeof forceRefresh === "undefined") ? false : forceRefresh;
			self.chartLabels = [];
			self.chartData = [];
			var arrayIndex = 0;
			angular.forEach(self.emailAccountsServers, function (server) {
				// self.chartData.push([]);
				controlService.getMessagesCount(server.emailAccountUser, forceRefresh)
					.then(function successCallback(response) {
						if (response !== "{}") {
							var emailAccount = JSON.parse(response);
							self.lastCheckTime = emailAccount.lastUpdatedDate;
							// console.log("lastCheckTime" + self.lastCheckTime);
							self.chartLabels.push(server.emailAccountUser);
							self.chartData.push(emailAccount.inboxMessageCount)
							arrayIndex++;
						}
					}, function errorCallback(response) {
						self.chartLabels.push(server.emailAccountUser);
						self.chartData.push(null)
						arrayIndex++;
					});
			});

		}
	}

	appModule.component('adChartBarMailbox', {
		templateUrl: 'app/shared/charts/chart.bar.mailbox.component.html',
		controller: ChartMailboxComponent,
		bindings: {
			chartSize: "=",
			chartType: "<",
			service: "<",
			series: "<",
			icon: "<"
		}
	});
})();