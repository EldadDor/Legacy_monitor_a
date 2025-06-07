/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";
	function ChartComponents($scope, $http, $timeout, $interval, authService) {
		var self = this;
		this.authState = authService;
		this.basketsB4QueueChartSize = 'col-lg-6';
		this.basketsInQueue = 'col-lg-6';
		// var self = this;
		// checkBasketQueues();
		// var checkBasketQueuesInterval = $interval(checkBasketQueues, 30000);
		// $scope.$on('$destroy', function () {
		// 	$interval.cancel(checkBasketQueuesInterval);
		// });
		// this.basketsInQueueSeries = ['High priority baskets in queue','Low priority baskets in queue'];
		//
		// this.onClickInQueue = function (points, evt) {
		// 	console.log(points[0]._index);
		// 	showBasketsInQueueList(self.responseInQueue, points[0]._index)
		// };
		// this.onClickBeforeQueue = function (points, evt) {
		// 	console.log(points[0]._index);
		// 	showBasketsBeforeQueueList(self.responseB4Queue, points[0]._index)
		// };
		//
		// this.colors = ['#5bc0de', '#f0ad4e', '#ff8e72'];
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
		// this.items = [
		// 	'Last hour',
		// 	'Last 2 hours',
		// 	'Last 3 hours'
		// ];
		// this.chartPeriod='Last hour';
		//
		// this.options = {
		// 	scales: {
		// 		yAxes: [{
		// 			ticks: {
		// 				beginAtZero: true,
		// 				stepSize: 10,
		// 				min: 0
		// 			}
		// 		}],
		// 		xAxes: [{
		// 			min: 0
		// 		}]
		// 	}
		// };

		// function checkBasketQueues() {
		//
		// 	$http.get("/AstroServer/basketsInQueue").then(function (response) {
		// 		self.responseInQueue = response;
		// 		self.basketsInQueueLabels = [];
		// 		self.basketsInQueueData = [];
		// 		self.basketsInQueueData.push([]);
		// 		self.basketsInQueueData.push([]);
		// 		angular.forEach(response.data, function (queueStatus, date) {
		// 			self.basketsInQueueLabels.push(date);
		// 			var highQueue = JSON.parse(queueStatus["HIGH"]);
		// 			var lowQueue = JSON.parse(queueStatus["LOW"]);
		// 			self.basketsInQueueData[0].push(highQueue.size);
		// 			self.basketsInQueueData[1].push(lowQueue.size);
		//
		// 		});
		//
		// 		showBasketsInQueueList(response, Object.keys(response.data).length - 1);
		// 	});
		//
		// }
		//
		// function showBasketsInQueueList(response, index) {
		// 	self.highQueueData = [];
		// 	self.lowQueueData = [];
		// 	self.highBasketsSize = 0;
		// 	self.lowBasketsSize = 0;
		// 	var date = Object.keys(response.data)[index];
		// 	var obj = response.data[date];
		// 	var highQueue = JSON.parse(obj["HIGH"]);
		// 	var lowQueue = JSON.parse(obj["LOW"]);
		// 	if (highQueue.size > 0) {
		// 		angular.forEach(highQueue.Baskets, function (basket) {
		// 			self.highQueueData.push(basket);
		// 		});
		// 		self.highBasketsSize = highQueue.size;
		// 	}
		// 	if (lowQueue.size > 0) {
		// 		angular.forEach(lowQueue.Baskets, function (basket) {
		// 			self.lowQueueData.push(basket);
		// 		});
		// 		self.lowBasketsSize = lowQueue.size;
		// 	}
		// 	self.highBasketsDate = date;
		// 	self.lowBasketsDate = date;
		// }
		//
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

	appModule.component('adCharts', {
		templateUrl: 'app/shared/charts/chart.components.html',
		controller: ChartComponents,
		bindings: {
			chartSize: "<",
		}
	});
})();