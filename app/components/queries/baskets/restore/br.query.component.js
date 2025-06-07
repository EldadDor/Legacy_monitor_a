/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function BrQueryComponent($scope, $uibModal, $log, dbService, authService) {
		var self = this;
		this.authState = authService;
		self.isQueryRunning = false;
		self.failureCounter = true;
		self.docNrt = false;
		this.queryCode = 1;
		this.searchParams = [
			{"name": "הפצה", "tooltip": "print_nr", "id": 1},
			{"name": "סל","tooltip": "basket_nr", "id": 2}
		];

		this.restoreBaskets = function (queryForm) {
			if (!queryForm.$valid) {
				return false;
			}
			self.isQueryRunning = true;
			self.queryInfoFeedback = null;
			self.queryErrorFeedback = null;
			var data = {
				queryCode: self.queryCode,
				userId: self.userId,
				failureCounter: self.failureCounter,
				docNrt: self.docNrt,
				baskets: []
			};
			var selectedRows = self.searchKey.split('\n');
			selectedRows.forEach(function (row) {
				var baskets = row.split(',');
				baskets.forEach(function (basket) {
					if(!isNaN(basket)) {
						data.baskets.push(basket);
					}
				});
			});
			if(data.baskets.length === 0) {
				self.queryErrorFeedback = "Please fill valid basket number";
				self.isQueryRunning = false;
				return;
			}
			var modalInstance = $uibModal.open({
				animation: true,
				component: 'modalComponent',
				resolve: {
					items: function () {
						var selectedItems = [];
						var dataSourceItem = {};
						dataSourceItem.name = authService.getCurrentDataSource();
						selectedItems.push(dataSourceItem);
						var warningItem = {};
						warningItem.name = data.baskets.length + " baskets will be redistributed!"
						selectedItems.push(warningItem);
						return selectedItems;
					},
					operation: function () {
						return self.operation;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				dbService.restoreBaskets(data).then(function (response) {
					self.isQueryRunning = false;
					self.queryInfoFeedback = "Baskets redistributed: " + response.data;
				}, function (response) {
					self.isQueryRunning = false;
					self.queryErrorFeedback = response;
				});
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
				self.isQueryRunning = false;
			});
		}

		function validateForm() {
			return queryForm.dateField.$valid;
		}
	}

	appModule.component('adBrQuery', {
		templateUrl: 'app/components/queries/baskets/restore/br.query.html',
		controller: BrQueryComponent,
		bindings: {
			operation: "<"
		}
	});
})();