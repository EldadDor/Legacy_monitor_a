(function () {
	angular.module("MyApp").factory("dbService", function ($http, $q, authService, Constants) {
		var map = {
			"PROD": "wsprod",
			"DEV": "wsdev"
		};
		return ({
			showBasketsInQueueByType: showBasketsInQueueByType,
			showBasketsBeforeQueue: showBasketsBeforeQueue,
			showFutureBasketsBeforeQueue: showFutureBasketsBeforeQueue,
			showFailedBasketsBeforeQueue: showFailedBasketsBeforeQueue,
			showCompletedBaskets: showCompletedBaskets,
			showBasketsSendingStatus: showBasketsSendingStatus,
			showCampaignPopulation: showCampaignPopulation,
			showCampaignDistribution: showCampaignDistribution,
			updateCmLead: updateCmLead,
			distribCampaign: distribCampaign,
			cancelAutoProcess: cancelAutoProcess,
			abortAutoProcess: abortAutoProcess,
			getAllDigitalForms: getAllDigitalForms,
			restoreBaskets: restoreBaskets,
			excludeCellNr: excludeCellNr,
			cmScheduledLeadsCount: cmScheduledLeadsCount
		});

		function showBasketsBeforeQueue() {
			var url = "/AstroServer/basketsB4QueueLastEntry/" + authService.getCurrentDataSource();
			// var url = "http://" + getLBHost() + "/webservices/AstroServer/Hazelcast/BasketsB4Queue";
			return $http.get(url);
		}

		function showFutureBasketsBeforeQueue() {
			var url = "/AstroServer/futureBasketsLastEntry/" + authService.getCurrentDataSource();
			return $http.get(url);
		}

		function showFailedBasketsBeforeQueue() {
			var url = "/AstroServer/failedBasketsLastEntry/" + authService.getCurrentDataSource();
			return $http.get(url);
		}

		function showCompletedBaskets() {
			var url = "/AstroServer/completedBasketsLastEntry/" + authService.getCurrentDataSource();
			return $http.get(url);
		}

		function cmScheduledLeadsCount() {
			var url = "/AstroServer/cmScheduledLeadsCountLastEntry/" + authService.getCurrentDataSource();
			return $http.get(url);
		}

		function showBasketsInQueueByType(queueType) {
			var url = "/AstroServer/basketsInQueueLastEntry/" + queueType + "/" + authService.getCurrentDataSource();
			// var url = "http://" + getLBHost() + "/webservices/AstroServer/Hazelcast/BasketsInQueue/" + queueType;
			return $http.get(url);
		}

		function showBasketsSendingStatus(searchKey, queryCode, fromDate) {
			console.log("[showBasketsSendingStatus] [" + authService.getCurrentDataSource() +"] searchKey=" + searchKey + ", queryCode=" + queryCode + ", fromDate=" + fromDate);
			var fromDateAsString = eval(fromDate.getMonth() + 1) + "/" + fromDate.getDate() + "/" + fromDate.getFullYear();
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/BasketsSendingStatus",
				method: "GET",
				params: {searchKey: searchKey, queryCode: queryCode, fromDate: fromDateAsString}
			});
		}

		function showCampaignPopulation(listType, sendNr, rowsLimit, queryCode) {
			console.log("[showCampaignPopulation] [" + authService.getCurrentDataSource() +"] listType=" + listType + ", sendNr=" + sendNr +  ", rowsLimit=" + rowsLimit + ", queryCode=" + queryCode);
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/ShowCampaignPopulation",
				method: "GET",
				params: {listType: listType, sendNr: sendNr, queryCode: queryCode, rowsLimit: rowsLimit}
			});
		}

		function showCampaignDistribution(data) {
			var dataAsJson = JSON.stringify(data)
			console.log("[showCampaignDistribution] [" + authService.getCurrentDataSource() +"] data=" + dataAsJson);
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/ShowCampaignDistribution",
				method: 'POST',
				data: dataAsJson,
				headers: {
					'Content-type': 'text/plain'
				}
			});
		}

		function updateCmLead(sendNr, leadNr, columnName, newValue, queryCode) {
			console.log("[updateCmLead] [" + authService.getCurrentDataSource() +"] sendNr=" + sendNr + ", leadNr=" + leadNr + ", columnName=" + columnName + ", newValue=" + newValue + ", queryCode=" + queryCode);
			var json = {
				'sendNr': sendNr,
				'leadNr': leadNr,
				'columnName': columnName,
				'newValue': newValue,
				'queryCode': queryCode
			};
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/UpdateCmLead",
				method: 'POST',
				data: JSON.stringify(json),
				headers: {
					'Content-type': 'text/plain'
				}
			});
		}

		function distribCampaign(data) {
			var dataAsJson = JSON.stringify(data)
			console.log("[distribCampaign] [" + authService.getCurrentDataSource() +"] data=" + dataAsJson);
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/DistribCampaign",
				method: 'POST',
				data: dataAsJson,
				headers: {
					'Content-type': 'text/plain'
				}
			});
		}

		function cancelAutoProcess(listType, fromDate) {
			console.log("[cancelAutoProcess] [" + authService.getCurrentDataSource() +"] listType=" + listType + ", fromDate=" + fromDate);
			var fromDateAsString = eval(fromDate.getMonth() + 1) + "/" + fromDate.getDate() + "/" + fromDate.getFullYear();
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/CancelAutoProcess",
				method: "GET",
				params: {listType: listType, fromDate: fromDateAsString}
			});
		}
		function abortAutoProcess(listType, hostname, port) {
			console.log("[abortAutoProcess] [" + authService.getCurrentDataSource() +"] listType=" + listType + ", hostname=" + hostname + ", port=" + port);
			return $http({
				url: "http://" + hostname + ":" + port + "/webservices/IfsServer/CM/AbortCMProcess",
				method: "GET",
				params: {listType: listType}
			});
		}

		function restoreBaskets(data) {
			var dataAsJson = JSON.stringify(data)
			console.log("[restoreBaskets] [" + authService.getCurrentDataSource() +"] data=" + dataAsJson);
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/RestoreBaskets",
				method: "POST",
				data: dataAsJson,
				headers: {
					'Content-type': 'text/plain'
				}
			});
		}

		function excludeCellNr(data) {
			var dataAsJson = JSON.stringify(data)
			console.log("[excludeCellNr] [" + authService.getCurrentDataSource() +"] data=" + dataAsJson);
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/ExcludeCellNr",
				method: "POST",
				data: dataAsJson,
				headers: {
					'Content-type': 'text/plain'
				}
			});
		}


		function getAllDigitalForms(searchStr) {
			console.log("[getAllDigitalForms] [" + authService.getCurrentDataSource() +"] searchStr=" + searchStr);
			var digitalFormId = 0;
			var digitalFormName = searchStr;
			var numericRepr = parseInt(searchStr);
			if (isNaN(numericRepr)) {

			}
			else {
				digitalFormName = '*';
				if (numericRepr === 0) {
					digitalFormName = '';
				}
				digitalFormId = numericRepr;
			}
			return $http({
				url: "http://" + getLBHost() + "/webservices/AstroServer/GetDigitalFormsBySearch",
				method: "GET",
				params: {digitalFormId: digitalFormId, digitalFormName: digitalFormName}
			});
		}

		function getLBHost() {
			// return "localhost:9090";
			var env = authService.getCurrentEnv();
			var dataSource = authService.getCurrentDataSource();
			var lbHost = map[env];
			if (!authService.isProd()) {
				lbHost += "/" + dataSource;
			}
			return lbHost;
		}
	});
})();