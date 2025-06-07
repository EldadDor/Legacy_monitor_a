(function () {
	angular.module("MyApp").factory("dataService", function ($http, $q, authService, Constants) {
		var map = {
			"PROD": {"ifs" : {}, "astro" : {}, "dc" : {}, "ninja" : {}, "sqr" : {}, "autofont" : {}},
			"DEV":  {"ifs" : {}, "astro" : {}, "dc" : {}, "ninja" : {}, "sqr" : {}, "autofont" : {}}
		};
		return ({
			getData: getData,
			getCmHostnameDataSource: getCmHostnameDataSource,
		});

		function getData(dataType) {
			var env = authService.getCurrentEnv();
			var data = map[env][dataType];
			if (Object.keys(data).length > 0) { // if data object is not empty
				console.log(env + " DATA FROM CACHE, dataType=" + dataType);
				return $q.when(data);
			}

			return $http.get("/data?dataType=" + dataType + "&env=" + env)
				.then(function (response) {
					console.log(env + " DATA FROM SERVER, dataType=" + dataType );
					map[env][dataType] = response.data;
					return response.data;
				});
		}

		function getCmHostnameDataSource() {
			if(authService.isProd()) {
				return "";
			}
			var dataSource;
			if (authService.getCurrentDataSource() === Constants.DATA_SOURCES.USERTEST) {
				dataSource = '[ut]';
			} else if (authService.getCurrentDataSource() === Constants.DATA_SOURCES.YEST) {
				dataSource = '[yest]';
			}
			return dataSource;
		}
	});
})();