/**
 * Created by vladimir on 05/04/2017.
 */
function AppComponent($rootScope,$location, authService, sidebarService, Constants,$log) {
	this.authState = authService;
	this.toggleState = sidebarService;
	authService.authenticate(null, function () {
		if (!authService.isAuthenticated()) {
			$location.path("/login");
		} else {
			$rootScope.$broadcast(Constants.EVENTS.UPDATE_DATA);
		}
	});
	$log.debug("Root.ctor");
}
appModule.component("myApp", {
	templateUrl: "app/components/app.component.html",
	controller: AppComponent
});