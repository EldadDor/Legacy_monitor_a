(function () {
	"use strict";

	function LogModalComponent($sce, controlService, Constants) {
		var $ctrl = this;
		this.logLines = Constants.LOG_LINES;
		this.logSize = Constants.DEFAULT_LOG_LINES;
		$ctrl.isSearchQueryRunning = false;

		$ctrl.$onInit = function () {
			$ctrl.server = $ctrl.resolve.server;
			$ctrl.query = $ctrl.resolve.query;
			$ctrl.title = $ctrl.resolve.title;
			$ctrl.serverLog = $sce.trustAsHtml($ctrl.resolve.serverLog);
		};

		$ctrl.ok = function () {
			$ctrl.close();
		};

		this.refreshLog = function () {
			$ctrl.changeLogSize();
		};

		this.gridOptions = {
			showGridFooter: true,
			enableFiltering: true,
			data: $ctrl.resolve.data
		};

		this.changeLogSize = function () {
			$ctrl.isSearchQueryRunning = true;
			controlService.tailSplunkLog($ctrl.server, $ctrl.logSize, $ctrl.query).then(function (serverLog) {
				$ctrl.serverLog = $sce.trustAsHtml(serverLog);
				$ctrl.isSearchQueryRunning = false;
			}, function (response) {
				$ctrl.isSearchQueryRunning = false;
			});
		};


	}

	appModule.component('logModalComponent', {
		templateUrl: 'app/shared/log.modal.html',
		controller: LogModalComponent,
		bindings: {
			resolve: '<',
			close: '&',
			dismiss: '&'
		}
	});
})();