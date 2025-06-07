/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function StatsIfsComponent($scope, $http, $interval, splunkService, authService, Constants) {
		var self = this;
		getStatsForToday();
		var checkInterval = $interval(getStatsForToday, 60000);
		$scope.$on('$destroy', function () {
			console.log("$destroy stats checkInterval");
			$interval.cancel(checkInterval);
		});

		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			self.incomingEmails = "";
			self.returnedEmails = "";
			self.failedEmails = "";
			self.failedPfrMessages = "";
			self.conversionFailedEmails = "";
			self.incomingSmsMessages = "";
			self.incomingWhatsAppMessages = "";
			self.whatsAppFailedMessages = "";
			self.incomingFaxes = "";
			self.casefetMessages = "";
			self.casefetFailedMessages = "";
			getStatsForToday();
		});


		function getStatsForToday() {
			self.lastCheckDate = Date.now();
			var ifsSourceType = authService.getCurrentIfsSourceType();
			splunkService.getCountSearchResults(ifsSourceType, "pmr", "Starting to process new personal email NOT multisend").then(function (response) {
				self.incomingEmails = response.data;
				self.incomingEmailsQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.incomingEmails = "";
			});
			splunkService.getCountSearchResults(ifsSourceType, "returned-resend", "Starting to process new returned email").then(function (response) {
				self.returnedEmails = response.data;
				self.returnedEmailsQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.returnedEmails = "";
			});
			splunkService.getCountSearchResults(authService.getCurrentDocConverterSourceType(), "*", "DOC_NOT_CONVERTED NOT .heic").then(function (response) {
				self.failedConversions = response.data;
				self.failedConversionsQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.returnedEmails = "";
			});
			splunkService.getCountSearchResults(ifsSourceType, "pmr", "Failed to handle the incoming email").then(function (response) {
				self.failedPmrMessages = response.data;
				self.failedPmrMessagesQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.failedPmrMessages = "";
			});
			splunkService.getCountSearchResults(ifsSourceType, "pfr", "Failed to handle the incoming email").then(function (response) {
				self.failedPfrMessages = response.data;
				self.failedPfrMessagesQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.failedPfrMessages = "";
			});
			splunkService.getCountSearchResults(ifsSourceType, "pmr", "WERE ALL DOCS BEEN CONVERTED false").then(function (response) {
				self.conversionFailedEmails = response.data;
				self.conversionFailedEmailsQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.conversionFailedEmails = "";
			});
			splunkService.getCountSearchResults(ifsSourceType, "pmr", "Starting to process new personal email multisend").then(function (response) {
				self.incomingSmsMessages = response.data;
				self.incomingSmsMessagesQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.incomingSmsMessages = "";
			});

			splunkService.getCountSearchResults(ifsSourceType, "twilio-receiver", "Starting to process new twilio message").then(function (response) {
				self.incomingWhatsAppMessages = response.data;
				self.incomingWhatsAppMessagesQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.incomingWhatsAppMessages = "";
			});
			splunkService.getCountSearchResults(ifsSourceType, "twilio-receiver", "twilio error").then(function (response) {
				self.whatsAppFailedMessages = response.data;
				self.whatsAppFailedMessagesQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.whatsAppFailedMessages = "";
			});

			splunkService.getCountSearchResults(ifsSourceType, "pfr", "Starting to process new \"fax email\"").then(function (response) {
				self.incomingFaxes = response.data;
				self.incomingFaxesQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.incomingFaxes = "";
			});

			splunkService.getCountSearchResults(ifsSourceType, "casefet", "Finished process for Message").then(function (response) {
				self.casefetMessages = response.data;
				self.casefetMessagesQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.casefetMessages = "";
			});
			splunkService.getCountSearchResults(ifsSourceType, "casefet", "\"handleMessageError()\" OR \"Error handling ScannedFile\"").then(function (response) {
				self.casefetFailedMessages = response.data;
				self.casefetFailedMessagesQuery = response.query;
			}, function (response) {
				console.log("Failed to fetch splunk search results, response=" + response);
				self.casefetFailedMessages = "";
			});
		}
	}

	appModule.component('adStatsIfs', {
		templateUrl: 'app/components/stats/ifs/stats.ifs.html',
		controller: StatsIfsComponent
	});
})();