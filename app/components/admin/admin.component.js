/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function AdminComponent($scope,$http, $interval) {
		var self = this;
		var checkLoggedUsersInterval = $interval(checkLoggedUsers, 30000);
		checkLoggedUsers();
		$scope.$on('$destroy', function () {
			console.log("$destroy checkLoggedUsersInterval");
			$interval.cancel(checkLoggedUsersInterval);
		});

		function checkLoggedUsers() {
			self.data = [];
			$http.get("/getAllLoggedUsers").then(function (response) {
				angular.forEach(response.data, function (user) {
					// user["username"] = '<img src="http://phonebook:1440/employees/photo?user='+ user["username"]+'"/>' + user["username"];
					user["lastUpdatedDate"] = Date.now();
					self.data.push(user);
				});
			})
		}

	}

	appModule.component('adAdmin', {
		templateUrl: 'app/components/admin/admin.html',
		controller: AdminComponent
	});
})();