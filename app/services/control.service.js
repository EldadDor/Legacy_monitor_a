/**
 * Created by vladimir on 19/03/2017.
 */

(function () {
	angular.module("MyApp").factory("controlService", function ($http, $q, $log, Constants) {
		// Return public API.
		return ({
			changeServerState: changeServerState,
			getServerState: getServerState,
			tailLog: tailLog,
			tailSplunkLog: tailSplunkLog,
			// getSearchResults: getSearchResults,
			switchPriority: switchPriority,
			isNeeviaConverter: isNeeviaConverter,
			getMessagesCount: getMessagesCount,
			getMailboxQueue: getMailboxQueue,
			changeJobType: changeJobType,
			setNumOfPolicies: setNumOfPolicies,
			changePriority: changePriority,
			changeWithdrawalDuration: changeWithdrawalDuration,
			changeFetchDuration: changeFetchDuration,
			switchFetcher: switchFetcher,
			controlServer: controlServer,
			submitMessage: submitMessage,
			toggleControl: toggleControl,
			getControlState: getControlState,
			startAppServers: startAppServers,
			shutdownAppServers: shutdownAppServers,
			restartAppServers: restartAppServers
		});


		function changeServerState(server, state, job) {
			var request = $http({
				method: "GET",
				url: "http://" + server.host + (server.port != null ? ":" + server.port : "") + server.link + "changeServerState?action=" + state + (job != null ? "&jobId=" + job : ""),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
			return request.then(function successCallback(response) {
				registerControlAction(server, "changeServerState:" + state);
				return (response.data);
			}, handleError);
		}

		function controlServer(server, operation, args) {
			var request = $http({
				method: "GET",
				url: "http://" + server.host + (server.port != null ? ":" + server.port : "") + server.link + operation + (args != null ? "/" + args : ""),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
			return request.then(function successCallback(response) {
				registerControlAction(server, "operation:" + operation);
				return (response.data);
			}, handleError);
		}

		function checkServerState(server) {
			var url = "http://" + server.host;
			if (server.port != null) {
				url += ":" + server.port;
			}
			url += server.link;
			if (isAppCheck(server.link)) {
				return $http.get(url + "getServerState").then(handleSuccess, handleError);
			}
			return $http.get(url).then(handleOnlineCheckSuccess, handleError);
		}

		function getServerState(server, forceCheck) {
			if(server.host === "localhost") {
				return checkServerState(server);
			}
			// if (isNeeviaConverter(server)) {
			// 	return $http.get("/NeeviaConverter/getServerState/" + server.host).then(handleSuccess, handleError);
			// }
			var appCheck = isAppCheck(server.link)
			var url = "/getServerState?server=" + server.name + "&host=" + server.host + "&port=" + server.port + "&link=" + server.link + "&appCheck=" + appCheck + "&forceCheck=" + forceCheck;
			return $http.get(url).then(handleSuccess, handleError);
		}

		function isAppCheck(link) {
			return !!(link.includes("IfsServer") || link.includes("IfsJobServer") || link.includes("AstroServer") || link.includes("printServer"));
		}

		function tailLog(path) {
			var request = $http({
				method: "GET",
				url: "/tailLog?path=" + path,
				transformResponse: []
			});
			return request.then(handleSuccess, handleError);
		}

		function tailSplunkLog(server, tailSize, query) {
			if(query === undefined) {
				query="";
			}
			var request = $http({
				method: "GET",
				url: "/tailSplunkLog?host=" + server.host + "&source=" + server.source + "&sourcetype=" + server.sourcetype + "&tailSize=" + tailSize + "&query=" + query,
				transformResponse: []
			});
			return request.then(handleSuccess, handleError);
		}

		// function getSearchResults(sourceType, query, columns) {
		// 	var request = $http({
		// 		method: "GET",
		// 		url: "/getSearchResults",
		// 		params: {"sourceType": sourceType, "query": query, "columns": columns},
		// 		transformResponse: []
		// 	});
		// 	return request.then(handleSuccess, handleError);
		// }

		function getMessagesCount(user, forceRefresh) {
			var request = $http({
				method: "GET",
				url: "/mailboxQueueLastEntry?user=" + user + "&forceRefresh=" + forceRefresh,
				transformResponse: []
			});
			return request.then(handleSuccess, handleError);
		}

		function getMailboxQueue(user, forceRefresh) {
			var request = $http({
				method: "GET",
				url: "/mailboxQueue?user=" + user + "&forceRefresh=" + forceRefresh,
				transformResponse: []
			});
			return request.then(handleSuccess, handleError);
		}

		function switchPriority(server) {
			var url = "http://" + server.host + ":" + server.port + server.link + "switchPriority";
			return $http.post(url).then(function successCallback(response) {
				registerControlAction(server, "switchPriority");
				return (response.data);
			}, handleError);
		}

		function changeJobType(server, state, jobType) {
			var url = "http://" + server.host + server.link + "setJobType/" + jobType;
			return $http.get(url).then(function successCallback(response) {
				registerControlAction(server, "changeJobType:" + jobType);
				return (response.data);
			}, handleError);
		}

		function setNumOfPolicies(server, state, limit) {
			var url = "http://" + server.host + server.link + "setNumOfPolicies/" + limit;
			return $http.get(url).then(function successCallback(response) {
				registerControlAction(server, "setNumOfPolicies:" + limit);
				return (response.data);
			}, handleError);
		}


		function changePriority(server, state, priority) {
			var url = "http://" + server.host + ":" + server.port + server.link + "changePriority/" + priority;
			return $http.get(url).then(function successCallback(response) {
				registerControlAction(server, "changePriority:" + Constants.ASTRO_QUEUE_TYPES[priority]);
				return (response.data);
			}, handleError);
		}
		function changeWithdrawalDuration(server, state, priorityName) {
			var priority = Constants.ASTRO_PRIORITIES[priorityName];
			var withdrawalDuration = server.withdrawalDurations[priorityName];
			var url = "http://" + server.host + ":" + server.port + server.link + "changeWithdrawlSpeed/" + priority + "/" + withdrawalDuration;
			return $http.get(url).then(function successCallback(response) {
				registerControlAction(server, "changeWithdrawalDuration:" + priorityName + "-" + withdrawalDuration);
				return (response.data);
			}, handleError);
		}

		function changeFetchDuration(server, state, priorityName) {
			var priority = Constants.ASTRO_PRIORITIES[priorityName];
			var fetchDuration = server.fetchDurations[priorityName];
			var url = "http://" + server.host + ":" + server.port + server.link + "changeFetchSpeed/" + priority + "/" + fetchDuration;
			return $http.get(url).then(function successCallback(response) {
				registerControlAction(server, "changeFetchDuration:" + priorityName + "-" + fetchDuration);
				return (response.data);
			}, handleError);
		}

		// function changeBoostMode(server, state, boostMode) {
		// 	var url = "http://" + server.host + ":" + server.port + server.link + "setPoolSize/" + boostMode;
		// 	var data = {
		// 		boostMode: boostMode
		// 	};
		// 	return $http.post(url, JSON.stringify(data)).then(function successCallback(response) {
		// 		registerControlAction(server, "changeCmSmsBoostMode:" + Constants.BOOST_MODES[boostMode]);
		// 		return (response.data);
		// 	}, handleError);
		// }

		function switchFetcher(server, state) {
			var url = "http://" + server.host + ":" + server.port + server.link + "switchFetcher";
			return $http.get(url).then(function successCallback(response) {
				registerControlAction(server, "switchFetcher");
				return (response.data);
			}, handleError);
		}

		function isNeeviaConverter(server) {
			return server.name.startsWith("document-converter");
		}

		function handleError(response) {
			if (!angular.isObject(response.data) || !response.data.message) {
				return ( $q.reject("An unknown error occurred.") );
			}
			return ( $q.reject(response.data.message) );
		}

		function handleSuccess(response) {
			return (response.data);
		}

		function handleOnlineCheckSuccess() {
			response = {};
			response.processState = "0";
			return (response);
		}

		function registerControlAction(server, state) {
			$http({
				method: 'POST',
				url: "/registerControlAction",
				data: server,
				params: {"action": state}
			}).then(function successCallback(response) {
				console.log("Log saved for server=" + server.name + ", host=" + server.host + ", action=" + state + ", type=" + server.sourcetype)
			});
		}

		function submitMessage(message) {
			return $http({
				method: 'POST',
				url: "/submitBroadcastMessage",
				data: null,
				params: {"message": message}
			});
		}

		// function deleteMessage(key) {
		// 	return $http({
		// 		method: 'POST',
		// 		url: "/deleteBroadcastMessage",
		// 		data: null,
		// 		params: {"key": key}
		// 	});
		// }
		//

		function toggleControl(type, control, env) {
			return $http({
				method: 'POST',
				url: "/toggleControl",
				data: null,
				params: {"type": type, "control": control, "env": env}
			});
		}

		function getControlState(type, env) {
			return $http({
				method: 'GET',
				url: "/getControlState",
				data: null,
				params: {"type": type, "env": env}
			}).then(handleSuccess,handleError);
		}

		function startAppServers(server, state) {
			if(server.host.startsWith("ifs") && server.os !== "linux") {
				console.log("Can't start server " + server.name + " running on " + server.host + ": not linux os")
				return;
			}
			if(server.deployName === undefined) {
				server.deployName = "";
			}
			var request = $http({
				method: 'POST',
				url: "/startAppServer",
				data: null,
				params: {"host": server.host, "serverName": server.deployName, "contextName": server.source}
			});

			return request.then(function successCallback(response) {
				registerControlAction(server, "startAppServer");
				printExitCode("startAppServer", response);
				return getServerState(server, true);
			});
		}

		function shutdownAppServers(server, state) {
			if(server.host.startsWith("ifs") && server.os !== "linux") {
				console.log("Can't shutdown server " + server.name + " running on " + server.host + ": not linux os")
				return;
			}
			if(server.deployName === undefined) {
				server.deployName = "";
			}
			var request = $http({
				method: 'POST',
				url: "/stopAppServer",
				data: null,
				params: {"host": server.host, "serverName": server.deployName, "contextName": server.source}
			});

			return request.then(function successCallback(response) {
				registerControlAction(server, "shutdownAppServer");
				printExitCode("shutdownAppServer", response);
				return getServerState(server, true);
			});
		}

		function restartAppServers(server, state) {
			if(server.host.startsWith("ifs") && server.os !== "linux") {
				console.log("Can't restart server " + server.name + " running on " + server.host + ": not linux os")
				return;
			}
			if(server.deployName === undefined) {
				server.deployName = "";
			}
			var request = $http({
				method: 'POST',
				url: "/restartAppServer",
				data: null,
				params: {"host": server.host, "serverName": server.deployName, "contextName": server.source}
			});

			return request.then(function successCallback(response) {
				registerControlAction(server, "restartAppServer");
				printExitCode("restartAppServer", response);
				return getServerState(server, true);
			});
		}

		function printExitCode(op, response) {
			var msg = op + " returned exitCode=" + response.data;
			if (response.data === 0) {
				$log.info(msg);
			} else {
				$log.error(msg);
			}
		}

	});
})();

