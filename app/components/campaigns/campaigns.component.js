/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function CampaignsComponent($scope, $interval, $log, dataService, authService, controlService, Constants) {
		var self = this;
		this.authState = authService;
		this.oneAtATime = true;

		var cmServers = ['cm-pm [ut]', 'cm-sms [ut]', 'cm-pm [yest]', 'cm-sms [yest]'];
		var astroServers = ['astro [ut]','astro [yest]'];

		this.authState = authService;
		this.states = Constants.ASTRO_STATES;
		this.checkInterval = Constants.ASTRO_CHECK_INTERVAL;
		this.checkControlStateInterval = null;
		loadDashboard();

		this.cancelAutoProcessSearchParams = [
			{"name": "ListType", "id": 1}
		];
		this.campaignSearchParams = [
			{"name": "MAIL", "id": 1},
			{"name": "SMS", "id": 2},
			{"name": "WHATSAPP", "id": 3},
			{"name": "NOTIFICATION", "id": 4}
		];
		this.status = {
			isCustomHeaderOpen: false,
			isFirstOpen: true,
			isFirstDisabled: false
		};
		$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
			loadDashboard();
		});

		function loadDashboard() {
			if (!authService.isCmDevDataSource()) {
				return;
			}
			if (!self.checkControlStateInterval) {
				self.checkControlStateInterval = $interval(checkControlState, 5000);
				$scope.$on('$destroy', function () {
					$interval.cancel(self.checkControlStateInterval);
				});
			}
			updateData();
		}


		function checkControlState() {
			controlService.getControlState(self.ifsDataType, authService.getCurrentEnv()).then(function (response) {
				self.ifsControl = response;
			});
			controlService.getControlState(self.astroDataType, authService.getCurrentEnv()).then(function (response) {
				self.astroControl = response;
			});
		}

		function updateData() {
			dataService.getData("ifs").then(function (data) {
				var filteredData = [];
				var dataSource = dataService.getCmHostnameDataSource();

				data.forEach(function (row) {
					// $log.info(row.name);
					if(cmServers.includes(row.name) && row.name.endsWith(dataSource)) {
						filteredData.push(row);
					}

				});
				self.ifsData = filteredData;
				self.ifsDataType = 'ifs';
				controlService.getControlState(self.ifsDataType, authService.getCurrentEnv()).then(function (response) {
					self.ifsControl = response;
				});
			});
			dataService.getData("astro").then(function (data) {
				var filteredData = [];
				var dataSource = dataService.getCmHostnameDataSource();
				data.forEach(function (row) {
					if (astroServers.includes(row.name) && row.name.endsWith(dataSource) && !(row.host === 'pbbatch2' || row.host === 'pbbatch3')) {
						filteredData.push(row);
					}

				});
				self.astroData = filteredData;
				self.astroDataType = 'astro';
				controlService.getControlState(self.astroDataType, authService.getCurrentEnv()).then(function (response) {
					self.astroControl = response;
				});

			});
		}

	}

	appModule.component('adCampaigns', {
		templateUrl: 'app/components/campaigns/campaigns.html',
		controller: CampaignsComponent
	});
})();