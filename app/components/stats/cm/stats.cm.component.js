/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function StatsCmComponent($scope, $http, $interval, splunkService, authService, dbService, Constants) {
		var self = this;
		getStatsForToday();
		var checkInterval = $interval(getStatsForToday, 60000);
		$scope.$on('$destroy', function () {
			console.log("$destroy stats checkInterval");
			$interval.cancel(checkInterval);
		});

		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			self.cmPmCreated  = "";
			self.cmPmDistributed  = "";
			self.cmPmFailed  = "";
			self.cmPmFailedFinal  = "";
			self.cmPmCancelled  = "";
			self.cmSmsCreated = "";
			self.cmSmsFailed = "";
			self.cmSmsFailedFinal = "";
			self.cmSmsCancelled = "";
			self.cmSmsDistributed = "";
			self.cmSmsScheduled = "";
			self.distribPlanSmsCreated = "";
			self.distribPlanSmsDistributed = "";
			self.distribPlanSmsFailed = "";
			self.distribPlanSmsFailedFinal = "";
			self.distribPlanSmsCancelled = "";
			self.distribPlanEmailCreated = "";
			self.distribPlanEmailDistributed = "";
			self.distribPlanEmailFailed = "";
			self.distribPlanEmailFailedFinal = "";
			self.distribPlanEmailCancelled = "";
			getStatsForToday();
		});


		function getStatsForToday() {
			self.lastCheckDate = Date.now();
			var ifsSourceType = authService.getCurrentIfsSourceType();
			var astroSourceType = authService.getCurrentAstroSourceType();
			var astroSource = authService.getCurrentAstroSource();

			// splunkService.getCountSearchResults(ifsSourceType, "cm-sms", "basket created for client").then(function (response) {
			splunkService.getCountSearchResults(ifsSourceType, "cm-sms", "basket created for client NOT DistribNr=null","@d-5h").then(function (response) {
				self.cmSmsCreated = response.data;
				self.cmSmsCreatedQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmSmsCreated = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Basket Completed Successfully | " + Constants.rex + " | where userid=5785 and srvnr IN (8,16,17)").then(function (response) {
				self.cmSmsDistributed = response.data;
				self.cmSmsDistributedQuery = extractQuery(response);
				self.cmSmsDistributedProgress = 4;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmSmsDistributed = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | dedup distribnr | where userid=5785 and srvnr IN (8,16,17)").then(function (response) {
				self.cmSmsFailed = response.data;
				self.cmSmsFailedQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmSmsFailed = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | where userid=5785 and srvnr IN (8,16,17) and failure=2").then(function (response) {
				self.cmSmsFailedFinal = response.data;
				self.cmSmsFailedFinalQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmSmsFailedFinal = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "MiniBasketQueueWithdrawer Basket cancelled reason | " + Constants.rex + " | where userid=5785 and srvnr IN (8,16,17)").then(function (response) {
				self.cmSmsCancelled = response.data;
				self.cmSmsCancelledQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmSmsCancelled = "";
			});

			splunkService.getCountSearchResults(ifsSourceType, "cm-pm", "WhatsApp basket construction ignored", "@d-5h").then(function (response) {
				self.cmPmCreated = response.data;
				self.cmPmCreatedQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmPmCreated = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Basket Completed Successfully  | " + Constants.rex + " | where userid=6327 and srvnr=13 and NOT ltype IN (10677,1006,927,980,981,989,990,991,10116,10115)").then(function (response) {
				self.cmPmDistributed = response.data;
				self.cmPmDistributedQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmPmDistributed = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | dedup distribnr | where userid=6327 and srvnr=13").then(function (response) {
				self.cmPmFailed = response.data;
				self.cmPmFailedQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmPmFailed = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | where userid=6327 and srvnr=13 and failure=2").then(function (response) {
				self.cmPmFailedFinal = response.data;
				self.cmPmFailedFinalQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmPmFailedFinal = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "MiniBasketQueueWithdrawer Basket cancelled reason | " + Constants.rex + " | where userid=6327 and srvnr=13").then(function (response) {
				self.cmPmCancelled = response.data;
				self.cmPmCancelledQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.cmPmCancelled = "";
			});


			splunkService.getCountSearchResults(ifsSourceType, "distrib-plan", "smsOrPMDistribution() srvActivity=מייל אישי").then(function (response) {
				self.distribPlanEmailCreated = response.data;
				self.distribPlanEmailCreatedQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanEmailCreated = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Basket Completed Successfully | " + Constants.rex + " | where userid=9656 and srvnr=13").then(function (response) {
				self.distribPlanEmailDistributed = response.data;
				self.distribPlanEmailDistributedQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanEmailDistributed = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | dedup distribnr | where userid=9656 and srvnr=13").then(function (response) {
				self.distribPlanEmailFailed = response.data;
				self.distribPlanEmailFailedQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanEmailFailed = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | where userid=9656 and srvnr=13  and failure=2").then(function (response) {
				self.distribPlanEmailFailedFinal = response.data;
				self.distribPlanEmailFailedFinalQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanEmailFailedFinal = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "MiniBasketQueueWithdrawer Basket cancelled reason | " + Constants.rex + " | where userid=9656 and srvnr=13").then(function (response) {
				self.distribPlanEmailCancelled = response.data;
				self.distribPlanEmailCancelledQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanEmailCancelled = "";
			});

			splunkService.getCountSearchResults(ifsSourceType, "distrib-plan", "smsOrPMDistribution() srvActivity=שליחת SMS").then(function (response) {
				self.distribPlanSmsCreated = response.data;
				self.distribPlanSmsCreatedQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanSmsCreated = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Basket Completed Successfully | " + Constants.rex + " | where userid=9656 and srvnr IN (8,16,17)").then(function (response) {
				self.distribPlanSmsDistributed = response.data;
				self.distribPlanSmsDistributedQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanSmsDistributed = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | dedup distribnr | where userid=9656 and srvnr IN (8,16,17)").then(function (response) {
				self.distribPlanSmsFailed = response.data;
				self.distribPlanSmsFailedQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanSmsFailed = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "Failed updating Basket | " + Constants.rex + " | where userid=9656 and srvnr IN (8,16,17)  and failure=2").then(function (response) {
				self.distribPlanSmsFailedFinal = response.data;
				self.distribPlanSmsFailedFinalQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanSmsFailedFinal = "";
			});
			splunkService.getCountSearchResults(astroSourceType, astroSource, "MiniBasketQueueWithdrawer Basket cancelled reason | " + Constants.rex + " | where userid=9656 and IN (8,16,17)").then(function (response) {
				self.distribPlanSmsCancelled = response.data;
				self.distribPlanSmsCancelledQuery = extractQuery(response);
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.distribPlanSmsCancelled = "";
			});

			dbService.cmScheduledLeadsCount().then(function (response) {
				self.cmSmsScheduledCount = response.data.cmSmsScheduledCount;
				self.cmPmScheduledCount = response.data.cmPmScheduledCount;
				self.cmRenewalSmsScheduledCount = response.data.cmRenewalSmsScheduledCount;
				self.cmRenewalPmScheduledCount = response.data.cmRenewalPmScheduledCount;
				self.cmScheduledDate = Date.now();
			}, function () {
				self.cmPmScheduledCount = null;
				self.cmSmsScheduledCount = null;
				self.cmRenewalSmsScheduledCount = null;
				self.cmRenewalPmScheduledCount = null;
				self.cmScheduledDate = Date.now();
			});
		}

		function extractQuery(response) {
			var res = response.query.split("rex");
			var query = res[0] + "rex" + encodeURIComponent(res[1]);
			return query;
		}

	}

	appModule.component('adStatsCm', {
		templateUrl: 'app/components/stats/cm/stats.cm.html',
		controller: StatsCmComponent
	});
})();