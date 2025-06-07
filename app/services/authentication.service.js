/**
 * Created by vladimir on 22/03/2017.
 */


(function () {
	function AuthService($http, $q, $log, Constants) {
		var self = this;
		this.authenticate = function (credentials, callback) {
			var headers = credentials ? {
				authorization: "Basic "
				+ btoa(credentials.username + ":" + credentials.password)
			} : {};

			$http.get('user', {headers: headers}).then(function (response) {
				if (response.data.username) {
					self.username = response.data.username;
					self.currentUser = response.data.name;
					self.currentRole = response.data.roles[0];
					self.authenticated = true;
					self.currentEnv = self.isProdRoleUser() ? Constants.ENV.PROD : Constants.ENV.DEV;
					self.currentDataSource = self.isProdRoleUser() ? Constants.DATA_SOURCES.PROD : Constants.DATA_SOURCES.USERTEST;
				} else {
					self.authenticated = false;
				}
				callback && callback(self.authenticated);
			}, function () {
				self.authenticated = false;
				callback && callback(self.authenticated);
			});
		};

		this.isAuthenticated = function () {
			return self.authenticated;
		};
		this.setAuthenticated = function (authenticated) {
			self.authenticated = authenticated;
		};
		this.getUsername = function () {
			return self.username;
		};
		this.getCurrentUser = function () {
			return self.currentUser;
		};
		this.getCurrentEnv = function () {
			return self.currentEnv;
		};
		this.setCurrentEnv = function (currentEnv) {
			self.currentEnv = currentEnv;
		};
		this.getCurrentDataSource = function () {
			if(!self.currentDataSource) {
				return Constants.ENV.PROD;
			}
			return self.currentDataSource;
		};
		this.getCurrentAstroSourceType = function () {
			var astroSourceType = "astro";
			if (!self.isProd()) {
				astroSourceType += "-dev";
			}
			return astroSourceType;
		};
		this.getCurrentAstroSource = function () {
			if (self.isProd()) {
				return self.getCurrentEnv();
			} else {
				return self.getCurrentDataSource();
			}
		};
		this.getCurrentIfsSourceType = function () {
			var ifsSourceType = "ifs";
			if (!self.isProd()) {
				ifsSourceType += "-dev";
			}
			return ifsSourceType;
		};

		this.getCurrentDocConverterSourceType = function () {
			var docConverterSourceType = "neviaconverter";
			if (!self.isProd()) {
				docConverterSourceType += "-dev";
			}
			return docConverterSourceType;
		};

		this.setCurrentDataSource = function (currentDataSource) {
			self.currentDataSource = currentDataSource;
		};
		this.isProd = function () {
			return self.currentEnv == Constants.ENV.PROD;
		};
		this.isCmDevDataSource = function () {
			return !self.isProd() && (self.getCurrentDataSource() === Constants.DATA_SOURCES.USERTEST || self.getCurrentDataSource() === Constants.DATA_SOURCES.YEST);
		};
		this.isProdRoleUser = function () {
			return self.currentRole === "ROLE_PROD" || self.currentRole === "ROLE_DIGITAL_FORMS";
		};
		this.isDigitalFormsRoleUser = function () {
			return self.currentRole === "ROLE_DIGITAL_FORMS";
		}

	}

	appModule.service("authService", AuthService);
})();
