/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";

	function ChartBarComponent($scope, $http, $timeout, $interval, authService, dbService, Constants) {
		var self = this;
		updateChartData();
		var checkInterval = $interval(updateChartData, Constants.QUEUE_CHECK_INTERVAL);
		$scope.$on('$destroy', function () {
			$interval.cancel(checkInterval);
		});
		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			// self.chartLabels = [];
			self.chartData = [];
			updateChartData();
		});
		self.defaultChartSize = self.chartSize;
		self.zoomIcon = "in";

		this.colors = ['#f0ad4e', '#5bc0de', '#46BFBD', '#949FB1'];


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
			// responsive: true,
			maintainAspectRatio: false,
			chartArea: {
				backgroundColor: '#ffffff'
			},
			scales: {
				yAxes: [{
					ticks: {
						min: 0,
						max: 100,
						precision: 0,
						stepSize: 50
					},
					scaleLabel: {
						display: true,
						// labelString: 'Baskets'
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

		function updateChartData() {
			self.chartSeries = [];
			self.chartData = [];
			self.chartData.push([]);
			self.chartData.push([]);
			self.chartData.push([]);
			self.chartData.push([]);
			if (authService.getCurrentEnv() === Constants.ENV.PROD || authService.getCurrentDataSource() === Constants.DATA_SOURCES.USERTEST) {
				angular.forEach(Constants.ASTRO_QUEUES, function (queue, arrayIndex) {
					dbService.showBasketsInQueueByType(queue).then(function (response) {
						self.chartData[arrayIndex].push(response.data.size)
						self.chartSeries.push(queue);
						self.lastCheckTime = Date.now();
					});
				}, function (response) {
					self.chartData[priority].push(null)
				});
			}
		}
	}

	appModule.component('adChartBar', {
		templateUrl: 'app/shared/charts/chart.bar.component.html',
		controller: ChartBarComponent,
		bindings: {
			chartSize: "=",
			chartType: "<",
			service: "<",
			series: "<",
			icon: "<"
		}
	});
})();