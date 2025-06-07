(function () {
	"use strict";
	function ModalComponent() {
		var $ctrl = this;
		$ctrl.$onInit = function () {
			$ctrl.items = $ctrl.resolve.items;
			$ctrl.operation = $ctrl.resolve.operation;
		};
		$ctrl.ok = function () {
			$ctrl.close();
		};
		$ctrl.cancel = function () {
			$ctrl.dismiss({$value: 'cancel'});
		};
	}

	appModule.component('modalComponent', {
		templateUrl: 'app/shared/modal.html',
		controller: ModalComponent,
		bindings: {
			resolve: '<',
			close: '&',
			dismiss: '&'
		}
	});
})();