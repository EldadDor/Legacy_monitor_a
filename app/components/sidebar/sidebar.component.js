/**
 * Created by vladimir on 03/04/2017.
 */
(function () {
	"use strict";
	function SidebarComponent($scope, sidebarService, authService) {
		this.state = authService;

		$scope.getWidth = function () {
			return window.innerWidth;
		};

		$scope.$watch($scope.getWidth, function (newValue, oldValue) {
			sidebarService.toggleOnResize(newValue);
		});

		this.toggleSidebar = function () {
			sidebarService.toggleSidebar();
		};

		window.onresize = function () {
			$scope.$apply();
		};
	}


	appModule.component('adSidebar', {
		templateUrl: 'app/components/sidebar/sidebar.html',
		controller: SidebarComponent
	});
})();