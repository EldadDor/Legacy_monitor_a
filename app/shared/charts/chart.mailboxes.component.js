
/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";

	function ChartMailboxComponent($scope, $http, $timeout, $interval, controlService, dataService, authService, dbService, Constants) {
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

		this.colors = ['#f0ad4e', '#5bc0de', '#46BFBD', '#949FB1', '#ff8397'];


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
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						precision: 0
					},
					min: 0,
					gridLines: {
						display: false
					}
				}],
				xAxes: [{
					min: 0,
					gridLines: {
						display: false
					}
				}]
			},
			chartArea: {
				backgroundColor: '#ffffff'
			},
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
			self.chartSeries = [];

			var url = self.service + "?env=" +  authService.getCurrentEnv().toLowerCase() + "&forceRefresh=" + forceRefresh
			self.chartData.push([]);

			$http.get(url).then(function (response) {
				var j=0;
				var i = 0;
				angular.forEach(response.data, function (mailboxQueues, emailAccountUser) {
					self.chartSeries.push(emailAccountUser);

					self.chartData.push([]);
					angular.forEach(mailboxQueues, function (mailboxQueue, date) {
						if(j === 0) {
							self.chartLabels.push(date);
						}
						self.chartData[i].push(mailboxQueue.inboxMessageCount);
					});
					i++;
					j++;
				});
			});


		}
	}

	appModule.component('adChartMailbox', {
		templateUrl: 'app/shared/charts/chart.mailboxes.component.html',
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