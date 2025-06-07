/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";

	function HzChartComponent($scope, $http, $timeout, $interval, authService , Constants) {
		var self = this;
		updateChartData();
		var checkInterval = $interval(updateChartData, 30000);
		$scope.$on('$destroy', function () {
			console.log("$destroy hz updateChartData interval");
			$interval.cancel(checkInterval);
		});
		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			self.chartLabels = [];
			self.chartData = [];
			updateChartData();
		});
		self.defaultChartSize  = self.chartSize;
		self.zoomIcon  = "in";

		this.zoomChart = function () {
			if (self.chartSize === "col-lg-12") {
				self.chartSize = self.defaultChartSize;
				self.zoomIcon = "in";
			} else {
				self.chartSize = "col-lg-12";
				self.zoomIcon = "out";
			}
		};
		this.chartSeries = [self.series + ' - HIGH', self.series + ' - LOW', self.series + ' - PRIORITY', self.series + ' - BOOST'];

		this.onClick = function (points, evt) {
			console.log(points[0]._index);
			showBasketsInQueueList(self.responseInQueue, points[0]._index)
		};
		// this.onClickBeforeQueue = function (points, evt) {
		// 	console.log(points[0]._index);
		// 	showBasketsBeforeQueueList(self.responseB4Queue, points[0]._index)
		// };

		this.colors = ['#f0ad4e', '#5bc0de', '#46BFBD','#949FB1'];
		//this.colors = [
		//            {
		//              backgroundColor: "#5bc0de",
		//              pointBackgroundColor: "rgba(159,204,0, 1)",
		//              pointHoverBackgroundColor: "rgba(159,204,0, 0.8)",
		//              borderColor: "rgba(159,204,0, 1)",
		//              pointBorderColor: '#fff',
		//              pointHoverBorderColor: "rgba(159,204,0, 1)"
		//            }, '#f0ad4e', '#ff8e72"'
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

		function updateChartData() {
			if (authService.getCurrentEnv() !== Constants.ENV.PROD && authService.getCurrentDataSource() !== Constants.DATA_SOURCES.USERTEST) {
				return;
			}
			var url = "/AstroServer/" + self.service + "/" + authService.getCurrentDataSource();
			$http.get(url).then(function (response) {
				self.responseInQueue = response;
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
						var highQueue = JSON.parse(queueStatus["HIGH"]);
						self.chartData[0].push(highQueue.size);
						var lowQueue = JSON.parse(queueStatus["LOW"]);
						self.chartData[1].push(lowQueue.size);
						if (queueStatus["PRIORITY"] !== undefined) {
							var priorityQueue = JSON.parse(queueStatus["PRIORITY"]);
							self.chartData[2].push(priorityQueue.size);
						}
						if (queueStatus["BOOST"] !== undefined) {
							var boostQueue = JSON.parse(queueStatus["BOOST"]);
							self.chartData[3].push(boostQueue.size);
						}
					}
				});
				showBasketsInQueueList(response, Object.keys(response.data).length - 1);
			});

		}

		function showBasketsInQueueList(response, index) {
			self.highQueueData = [];
			self.lowQueueData = [];
			self.priorityQueueData = [];
			self.boostQueueData = [];
			self.highBasketsSize = 0;
			self.lowBasketsSize = 0;
			self.priorityBasketsSize = 0;
			self.boostBasketsSize = 0;
			var date = Object.keys(response.data)[index];
			var obj = response.data[date];
			var highQueue = JSON.parse(obj["HIGH"]);
			if (highQueue.size > 0) {
				angular.forEach(highQueue.Baskets, function (basket) {
					self.highQueueData.push(basket);
				});
				self.highBasketsSize = highQueue.size;
			}
			var lowQueue = JSON.parse(obj["LOW"]);
			if (lowQueue.size > 0) {
				angular.forEach(lowQueue.Baskets, function (basket) {
					self.lowQueueData.push(basket);
				});
				self.lowBasketsSize = lowQueue.size;
			}
			if (obj["PRIORITY"] !== undefined) {
				var priorityQueue = JSON.parse(obj["PRIORITY"]);
				if (priorityQueue.size > 0) {
					angular.forEach(priorityQueue.Baskets, function (basket) {
						self.priorityQueueData.push(basket);
					});
					self.priorityBasketsSize = lowQueue.size;
				}
			}
			if (obj["BOOST"] !== undefined) {
				var boostQueue = JSON.parse(obj["BOOST"]);
				if (boostQueue.size > 0) {
					angular.forEach(boostQueue.Baskets, function (basket) {
						self.boostQueueData.push(basket);
					});
					self.boostBasketsSize = boostQueue.size;
				}
			}
			self.highBasketsDate = date;
			self.lowBasketsDate = date;
			self.priorityBasketsDate = date;
			self.boostBasketsDate = date;
		}

		// function showBasketsBeforeQueueList(response, index) {
		// 	self.highBasketsSize = 0;
		// 	self.lowBasketsSize = 0;
		// 	self.highQueueData = [];
		// 	self.lowQueueData = [];
		// 	var date = Object.keys(response.data)[index];
		// 	var obj = response.data[date];
		// 	var highQueue = JSON.parse(obj).BasketsQueues[0].Baskets;
		// 	var lowQueue = JSON.parse(obj).BasketsQueues[1].Baskets;
		// 	var imageQueue = JSON.parse(obj).BasketsQueues[2].Baskets;
		// 	if (highQueue.size > 0) {
		// 		angular.forEach(highQueue.BasketsQueues, function (basket) {
		// 			self.highQueueData.push(basket);
		// 		});
		// 		self.highBasketsSize = highQueue.size;
		// 	}
		// 	if (lowQueue.size > 0) {
		// 		angular.forEach(lowQueue.BasketsQueues, function (basket) {
		// 			self.lowQueueData.push(basket);
		// 		});
		// 		self.lowBasketsSize = lowQueue.size;
		// 	}
		// 	self.highBasketsDate = date;
		// 	self.lowBasketsDate = date;
		// }


	}

	appModule.component('adHzChart', {
		templateUrl: 'app/shared/charts/hz.chart.component.html',
		controller: HzChartComponent,
		bindings: {
			chartSize: "=",
			chartType: "<",
			service: "<",
			series: "<",
			highQueueData: "=",
			lowQueueData: "=",
			priorityQueueData: "=",
			boostQueueData: "=",
			highBasketsSize: "=",
			lowBasketsSize: "=",
			priorityBasketsSize: "=",
			boostBasketsSize: "=",
			highBasketsDate: "=",
			lowBasketsDate: "=",
			priorityBasketsDate: "=",
			boostBasketsDate: "=",
			icon: "<"
		}
	});
})();