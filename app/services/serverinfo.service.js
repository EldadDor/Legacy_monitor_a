(function () {
	angular.module("MyApp").factory("serverinfoService", function ($http, $q, authService, Constants) {
		var map = {
			"PROD": "wsprod",
			"DEV": "wsdev/USERTEST"
		};
		return ({
			showServerInfo: showServerInfo
		});

		function showServerInfo() {
			var url = "http://localhost:9090/webservices/AstroServer/Hazelcast/ServersInformation";
			return $http.get(url);
		}


		function getLBHost() {
			var env = authService.getCurrentEnv();
			return map[env];
		}
	});
})();