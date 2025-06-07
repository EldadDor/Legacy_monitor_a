/**
 * Created by vladimir on 19/03/2017.
 */

(function () {
	angular.module("MyApp").factory("splunkService", function ($http, $q, authService, Constants) {
		var queryLink = "http://searcher:8000/en-US/app/idi/search?earliest=@earliest&q=search index%3Ddistrib ";

		// Return public API.
		return ({
			getSearchResults: getSearchResults,
			getDigitalSearchResults: getDigitalSearchResults,
			getCountSearchResults: getCountSearchResults,
			getCompletedBasketsRate: getCompletedBasketsRate
		});



		function getDigitalSearchResults(digitalFormId, clientId, fromDate, toDate, source,sourceType, query, columns) {

			//  FORMAT IS  LIKE 5/11/2021:08:00:00 BUT SENDING  TIME 00:00:00
			var toDateVal = new Date(toDate);
			toDateVal.setDate(toDateVal.getDate() + 1);


			var digitalFormIdVal = digitalFormId;
			var clientIdVal = clientId;

			//alert ("on splunk value of param is");
			//alert (digitalFormId);

			if (typeof digitalFormIdVal == "undefined" || digitalFormIdVal == "" ) {
				digitalFormIdVal = '*';
			}
			if (typeof clientIdVal == "undefined" || clientIdVal == "") {
				clientIdVal = '*';
			}
			var fromDateAsString = eval(fromDate.getMonth() + 1) + "/" + fromDate.getDate() + "/" + fromDate.getFullYear() + ":00:00:00";
			var toDateAsString = eval(toDateVal.getMonth() + 1) + "/" + toDateVal.getDate() + "/" + toDateVal.getFullYear() + ":00:00:00";
			//alert ("on splunk service#####");
			//alert (fromDateAsString);
		  //	alert (toDateAsString);

			var request = $http({
				method: "GET",
				url: "/getDigitalSearchResults",
				params: {
					"digitalFormId": digitalFormIdVal,
					"clientId": clientIdVal,
					"fromDate": fromDateAsString,
					"toDate": toDateAsString,
					"source": source,
					"sourceType": sourceType,
					"query" : query,
					"columns": columns
				},
				transformResponse: []
			});
			return request.then(handleSuccess, handleError);
		}


		function getSearchResults(sourceType, query, columns, earliest) {
			var request = $http({
				method: "GET",
				url: "/getSearchResults",
				params: {"sourceType": sourceType, "query": query, "columns": columns, "earliest": earliest},
				transformResponse: []
			});
			return request.then(function successCallback(response) {
				var source="*";
				response.query = queryLink.replace("@earliest", earliest) + " source%3D" + source + " sourcetype%3D" + sourceType + " " + query;
				return response;
			}, handleError);
		}

		function getCountSearchResults(sourceType, source, query, earliest) {
			if (sourceType === "ifs-dev") {
				source += authService.getCurrentDataSource() === Constants.DATA_SOURCES.USERTEST ? "-ut" : "-" + authService.getCurrentDataSource().toLowerCase();
			}
			if(earliest === undefined) {
				earliest = "@d";
			}
			var request = $http({
				method: "GET",
				url: "/getCountSearchResults",
				params: {"sourceType": sourceType, "source": source, "query": query, "earliest": earliest},
				transformResponse: []
			});
			return request.then(function successCallback(response) {
				response.query = queryLink.replace("@earliest", earliest) + " source%3D" + source + " sourcetype%3D" + sourceType + " " + query;
				return response;
			}, handleError);
		}

		function getCompletedBasketsRate() {
			var url = "/AstroServer/basketsHandlingRateLastEntry/" + authService.getCurrentDataSource();
			return $http.get(url);
		}

		function handleError(response) {
			if (!angular.isObject(response.data) || !response.data.message) {
				return ($q.reject("An unknown error occurred."));
			}
			return ($q.reject(response.data.message));
		}

		function handleSuccess(response) {
			return (response.data);
		}


	});
})();

