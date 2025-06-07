/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function QueriesComponent(authService) {
		this.authState = authService;
		this.oneAtATime = true;

		this.cancelAutoProcessSearchParams = [
			{"name": "ListType", "id": 1}
		];

		this.status = {
			isCustomHeaderOpen: false,
			isFirstOpen: true,
			isFirstDisabled: false
		};

	}

	appModule.component('adQueries', {
		templateUrl: 'app/components/queries/queries.html',
		controller: QueriesComponent
	});
})();