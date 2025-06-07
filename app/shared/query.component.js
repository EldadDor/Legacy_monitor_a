/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function QueryComponent($scope, $uibModal, $log, dbService, authService, dataService) {
		var self = this;
		this.authState = authService;
		var data = [];
		self.hideGrid = true;
		self.isQueryRunning = false;
		this.queryCode = 1;
		var cmServersMap = {
			"PROD": ['cm-pm', 'cm-sms', 'auto-distrib'],
			"USERTEST": ['cm-pm [ut]', 'cm-sms [ut]', 'auto-distrib [ut]'],
			"YEST": ['cm-pm [yest]', 'cm-sms [yest]', 'auto-distrib [yest]']
		};
		var cmServers = ['cm-pm', 'cm-sms', 'auto-distrib'];

		this.search = function (queryForm) {
			if (!queryForm.$valid) {
				return false;
			}
			self.isQueryRunning = true;
			self.hideGrid = true;
			self.queryInfoFeedback = [];
			self.queryErrorFeedback = [];
			if (self.searchParams[self.queryCode - 1].name === 'ListType') {
				cancelAutoProcess();
			}
		};

		function validateForm() {
			return queryForm.dateField.$valid;
		}

		function cancelAutoProcess() {
			var modalInstance = $uibModal.open({
				animation: true,
				component: 'modalComponent',
				resolve: {
					items: function () {
						var selectedItems = [];
						var item = {};
						item.name = authService.getCurrentDataSource();
						selectedItems.push(item);
						return selectedItems;
					},
					operation: function () {
						return self.operation;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				dataService.getData("ifs").then(function (data) {
					var cmIfsData = [];
					var dataSource = dataService.getCmHostnameDataSource();

					data.forEach(function (row) {
						// $log.info(row.name);
						var cmServers = cmServersMap[authService.getCurrentDataSource()]
						if (cmServers.includes(row.name) && row.name.endsWith(dataSource)) {
							cmIfsData.push(row);
						}
					});
					cmIfsData.forEach(function (row) {
						dbService.abortAutoProcess(self.searchKey, row.host, row.port).then(function (response) {
							self.queryInfoFeedback.push(response.data);
						}, function (response) {
							self.queryErrorFeedback.push(response);
						});
					});
				});

				dbService.cancelAutoProcess(self.searchKey, self.fromDate).then(function (response) {
					self.isQueryRunning = false;
					self.queryInfoFeedback.push(response.data);
				}, function (response) {
					self.isQueryRunning = false;
					self.queryErrorFeedback.push(response);
				});
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
				self.isQueryRunning = false;
			});

		}
	}

	appModule.component('adQuery', {
		templateUrl: 'app/shared/query.html',
		controller: QueryComponent,
		bindings: {
			searchParams: "<",
			operation: "<"
		}
	});
})();