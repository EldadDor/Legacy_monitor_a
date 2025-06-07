/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function StatsComponent($scope, $http, $interval, splunkService, authService, Constants) {
		var self = this;
		getStatsForToday();
		var checkInterval = $interval(getStatsForToday, 60000);
		$scope.$on('$destroy', function () {
			console.log("$destroy stats checkInterval");
			$interval.cancel(checkInterval);
		});

		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			self.autoDistrib = "";
			getStatsForToday();
		});

		function getStatsForToday() {
			self.lastCheckDate = Date.now();
			var ifsSourceType = authService.getCurrentIfsSourceType();

			splunkService.getCountSearchResults(ifsSourceType, "auto-distrib", "Basket created").then(function (response) {
				self.autoDistrib = response.data;
				self.autoDistribQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.autoDistrib = "";
			});
		}
	}

	appModule.component('adStats', {
		templateUrl: 'app/components/stats/stats.html',
		controller: StatsComponent
	});
})();