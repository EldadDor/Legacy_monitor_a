/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";

	function RateChartComponent($scope, $http, $timeout, $interval, authService, Constants) {
		var self = this;
		updateChartData();
		var checkInterval = $interval(updateChartData, 30000);
		$scope.$on('$destroy', function () {
			$interval.cancel(checkInterval);
		});
		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			self.chartLabels = [];
			self.chartData = [];
			updateChartData();
		});
		self.defaultChartSize  = self.chartSize;
		self.zoomIcon  = "in";

		this.chartSeries = [self.series + ' - HIGH', self.series + ' - LOW', self.series + ' - PRIORITY', self.series + ' - BOOST', self.series + ' - IMAGE'];
		this.colors = ['#f0ad4e', '#5bc0de', '#46BFBD', '#949FB1', '#ff8397'];


		this.zoomChart = function () {
			if (self.chartSize === "col-lg-12") {
				self.chartSize = self.defaultChartSize;
				self.zoomIcon  = "in";
			} else {
				self.chartSize = "col-lg-12";
				self.zoomIcon  = "out";
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
			maintainAspectRatio: false,
			responsive: true,
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

		function updateChartData() {
			var url = "/AstroServer/" + self.service + "/" + authService.getCurrentDataSource();
			$http.get(url).then(function (response) {
				self.chartLabels = [];
				self.chartData = [];
				self.chartData.push([]);
				self.chartData.push([]);
				self.chartData.push([]);
				self.chartData.push([]);
				angular.forEach(response.data, function (queueStatus, date) {
					self.chartLabels.push(date);
					if(queueStatus == null) {
						self.chartData[0].push(null);
						self.chartData[1].push(null);
						self.chartData[2].push(null);
						self.chartData[3].push(null);
 					} else {
						self.chartData[0].push(JSON.parse(queueStatus).BasketsQueues[0].size);
						self.chartData[1].push(JSON.parse(queueStatus).BasketsQueues[1].size);
						self.chartData[2].push(JSON.parse(queueStatus).BasketsQueues[2].size);
						self.chartData[3].push(JSON.parse(queueStatus).BasketsQueues[3].size);

					}
				});
			});
		}
	}

	appModule.component('adRateChart', {
		templateUrl: 'app/shared/charts/rate.chart.component.html',
		controller: RateChartComponent,
		bindings: {
			chartSize: "=",
			chartType: "<",
			service: "<",
			series: "<",
			icon: "<"
		}
	});
})();