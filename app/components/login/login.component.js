/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";
	function LoginComponent($location, authService) {
		var self = this;
		this.credentials = {};
		this.login = function () {
			authService.authenticate(this.credentials, function (authenticated) {
				if (authenticated) {
					$location.path("/");
					self.error = false;
				} else {
					$location.path("/login");
					self.error = true;
				}
			});
		};
	}

	appModule.component('adLogin', {
		templateUrl: 'app/components/login/login.html',
		controller: LoginComponent
	});
})();