(function () {
	"use strict";
	function PopupComponent() {
		var $ctrl = this;
		$ctrl.$onInit = function () {
			$ctrl.text = $ctrl.resolve.text
		};
		$ctrl.ok = function () {
			$ctrl.close();
		};
	}

	appModule.component('popupComponent', {
		templateUrl: 'app/shared/popup.html',
		controller: PopupComponent,
		bindings: {
			resolve: '<',
			close: '&',
			dismiss: '&'
		}
	});
})();