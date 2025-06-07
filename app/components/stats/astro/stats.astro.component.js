/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";
	var rex = "rex \"sid=(?P<distribnr>\\d+)#(?P<basketnr>\\d+)_(?P<userid>\\d+)_(?P<srvnr>\\d+)_(?P<priority>\\d+)-?\"";

	function StatsAstroComponent($scope, $http, $interval, splunkService, authService, Constants) {
		var self = this;
		getStatsForToday();
		var checkInterval = $interval(getStatsForToday, 60000);
		$scope.$on('$destroy', function () {
			console.log("$destroy stats checkInterval");
			$interval.cancel(checkInterval);
		});

		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			self.failedBaskets = "";
			self.failedSmsBaskets = "";
			self.failedEmailBaskets = "";
			self.failedWaBaskets = "";
			self.failedFaxBaskets = "";
			self.completedBaskets = "";
			self.outgoingSmsMessages = "";
			self.outgoingEmails = "";
			self.outgoingWhatsAppMessages = "";
			self.outgoingFaxes = "";
			getStatsForToday();
		});


		function getStatsForToday() {
			self.lastCheckDate = Date.now();
			var astroSourceType = authService.getCurrentAstroSourceType();
			var astroSource = authService.getCurrentAstroSource();


			splunkService.getCountSearchResults(astroSourceType, astroSource, "Basket Completed Successfully").then(function (response) {
				self.completedBaskets = response.data;
				self.completedBasketsQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.completedBaskets = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket  | " + rex + " | dedup distribnr").then(function (response) {
				// self.failedBaskets = Math.floor(response/3);
				self.failedBaskets = response.data;
				self.failedBasketsQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.failedBaskets = "";
			});

			splunkService.getCountSearchResults(astroSourceType, astroSource, "sending *-EMAIL | " + rex + " | where srvnr in (6,13,14)").then(function (response) {
				self.outgoingEmails = response.data;
				self.outgoingEmailsQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.outgoingEmails = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + rex + " | where srvnr in (6,13,14) | dedup distribnr").then(function (response) {
				self.failedEmailBaskets = response.data;
				self.failedEmailBasketsQuery = extractQuery(response);;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.failedEmailBaskets = "";
			});

			splunkService.getCountSearchResults(astroSourceType, astroSource, "sending to SMS | " + rex + " | where srvnr=8").then(function (response) {
				self.outgoingSmsMessages = response.data;
				self.outgoingSmsMessagesQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.outgoingSmsMessages = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + rex + " | where srvnr=8 | dedup distribnr").then(function (response) {
				self.failedSmsBaskets = response.data;
				self.failedSmsBasketsQuery = extractQuery(response);;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.failedSmsBaskets = "";
			});

			splunkService.getCountSearchResults(astroSourceType, astroSource, "Sending WhatsApp | " + rex + " | where srvnr=16").then(function (response) {
				self.outgoingWhatsAppMessages = response.data;
				self.outgoingWhatsAppMessagesQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.outgoingWhatsAppMessages = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + rex + " | where srvnr=16 | dedup distribnr").then(function (response) {
				self.failedWaBaskets = response.data;
				self.failedWaBasketsQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.failedWaBaskets = "";
			});

			splunkService.getCountSearchResults(astroSourceType, astroSource, "sending to FAX | " + rex + " | where srvnr=2").then(function (response) {
				self.outgoingFaxes = response.data;
				self.outgoingFaxesQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.outgoingFaxes = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + rex + " | where srvnr=2 | dedup distribnr").then(function (response) {
				self.failedFaxBaskets = response.data;
				self.failedFaxBasketsQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.failedFaxBaskets = "";
			});
		}

		function extractQuery(response) {
			var res = response.query.split("rex");
			var query = res[0] + "rex" + encodeURIComponent(res[1]);
			return query;
		}
	}

	appModule.component('adStatsAstro', {
		templateUrl: 'app/components/stats/astro/stats.astro.html',
		controller: StatsAstroComponent
	});
})();