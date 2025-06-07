/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function ExcludeUserQueryComponent($scope, $uibModal, $log, dbService, authService) {
		var self = this;
		this.authState = authService;
		self.isQueryRunning = false;
		this.queryCode = 1;
		this.searchParams = [
			{"name": "החרגת משתמש", "tooltip": "", "id": 1},
			{"name": "ביטול החרגת משתמש","tooltip": "", "id": 2}
		];

		this.excludeCellNr = function (queryForm) {
			if (!queryForm.$valid) {
				return false;
			}
			self.isQueryRunning = true;
			self.queryInfoFeedback = null;
			self.queryErrorFeedback = null;
			var data = {
				queryCode: self.queryCode,
				userId: self.userId,
				updateUser: self.updateUser,
				cellNr: self.cellNr,
				userName: self.userName
			};

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
						warningItem.name = data.cellNr + " phone number will be excluded"
						selectedItems.push(warningItem);
						return selectedItems;
					},
					operation: function () {
						return self.operation;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				dbService.excludeCellNr(data).then(function (response) {
					self.isQueryRunning = false;
					self.queryInfoFeedback = response.data;
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

	appModule.component('adExcludeUserQuery', {
		templateUrl: 'app/components/queries/baskets/exclude.user.query.html',
		controller: ExcludeUserQueryComponent,
		bindings: {
			operation: "<"
		}
	});
})();