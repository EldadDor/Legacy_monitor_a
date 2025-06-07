/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function DcMonitorComponent($scope, $http, $interval, dataService, authService, controlService, splunkService, Constants) {
		var self = this;
		self.isQueryRunning = false;
		// this.states = Constants.ASTRO_STATES;
		// this.checkInterval = Constants.ASTRO_CHECK_INTERVAL;
		this.states = Constants.DC_STATES;
		// this.checkInterval = Constants.DC_CHECK_INTERVAL;
		if (authService.isAuthenticated()) {
			updateData();
		}
		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			updateData();
		});

		this.testDcConverter = function (server) {
			self.isQueryRunning = true;
-	        $http.get("/NeeviaConverter/getServerState/" + server.host + "/" + authService.getCurrentEnv())
				.then(function successCallback(response) {
					server.conversionStatus = self.states[response.data.processState].serverState;
					server.cssClass = self.states[response.data.processState].cssClass;
					server.lastUpdatedDate = response.lastUpdatedDate;
					self.isQueryRunning = false;
				}, function errorCallback(response) {
					server.conversionStatus = self.states[Constants.SERVER_STATE.DOWN].serverState;
					server.cssClass = self.states[Constants.SERVER_STATE.DOWN].cssClass;
					server.lastUpdatedDate = Date.now();
					self.isQueryRunning = false;
				});
		};

		var data = [];
		this.gridOptions = {
			showGridFooter: true,
			enableFiltering: true,
			data: data,
			columnDefs: [{field: 'host', width: '15%'}, {field: 'time', width: '15%'}, {
				field: 'srcFile',
				width: '70%'
			}]
		};

		function updateData() {
			dataService.getData("dc").then(function (data) {
				self.dcData = data;
			});
			var sourceType = "neviaconverter";
			if (!authService.isProd()) {
				sourceType += "-dev";
			}
			splunkService.getSearchResults(sourceType, "DOC_NOT_CONVERTED", "host,srcFile,time","-24h").then(function (response) {
				// var myObjects = [];
				// var jsonAsObj = JSON.parse(response.data);
				// for (var i = 0; i < jsonAsObj.rows.length; i++) {
				// 	var newObject = {};
				// 	for (var j = 0; j < jsonAsObj.fields.length; j++) {
				// 		var key = jsonAsObj.fields[j]
				// 		newObject[key] = jsonAsObj.rows[i][j];
				// 	}
				// 	myObjects.push(newObject);
				// }
				// for (var i = 0; i < JSON.parse(response.data).rows.length; i++) {
				// 	var item = {};
				// 	item = {
				// 		"host": JSON.parse(response.data).rows[i][0],
				// 		"time": JSON.parse(response.data).rows[i][2],
				// 		"srcFile": JSON.parse(response.data).rows[i][1]
				// 	};
				// 	myObjects.push(item);
				// }
				self.failedConversionsQuery = response.query;
				self.gridOptions.data = JSON.parse(response.data).results;
			}, function (reason) {
				console.log(reason);
				self.gridOptions.data = [];
			});
		}
	}

	appModule.component('adDcmonitor', {
		templateUrl: 'app/components/dcmonitor/dcmonitor.html',
		controller: DcMonitorComponent
	});
})();