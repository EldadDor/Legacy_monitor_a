/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function BsQueryComponent($scope, $uibModal, $log, dbService, authService) {
		var self = this;
		this.authState = authService;
		var data = [];
		self.hideGrid = true;
		self.isQueryRunning = false;
		this.queryCode = 1;
		this.searchParams = [
			{"name": "ת.ז", "id": 1},
			{"name": "פוליסה", "id": 2},
			{"name": "תביעה", "id": 3},
			{"name": "הפצה", "id": 4},
			{"name": "סל", "id": 5}
		];
		this.search = function (queryForm) {
			if (!queryForm.$valid) {
				return false;
			}
			self.isQueryRunning = true;
			self.hideGrid = true;
			self.queryInfoFeedback = null;
			self.queryErrorFeedback = null;

			dbService.showBasketsSendingStatus(self.searchKey, self.queryCode, self.fromDate).then(function (response) {
				self.isQueryRunning = false;
				if (response.data.BasketsSendingStatus.length > 0) {
					self.hideGrid = false;
				} else {
					self.queryErrorFeedback = '0 rows found';
					self.hideGrid = true;
				}
				self.gridOptions.data = response.data.BasketsSendingStatus;
			}, function (response) {
				self.queryErrorFeedback = response;
				self.isQueryRunning = false;
				self.gridOptions.data = [];
			});

		};
		this.gridOptions = {
			showGridFooter: true,
			enableFiltering: true,
			columnDefs: [
				{
					name: 'printNr', displayName: 'מספר הפצה', enableCellEdit: false, cellTooltip: true,
					cellTemplate: '<div ng-if="row.entity.printStsDisplayName.includes(\'הצלחה\')" class="pl-1">{{row.entity.printNr}} </div>' +
						'<div class="pl-1"><a target="_blank" ng-if="!row.entity.printStsDisplayName.includes(\'הצלחה\')" ng-href="http://searcher:8000/en-US/app/idi/search?q=search index=distrib source={{grid.appScope.$ctrl.authState.getCurrentDataSource().toLowerCase()}} sourcetype={{grid.appScope.$ctrl.authState.getCurrentAstroSourceType().toLowerCase()}} {{row.entity.printNr}}">{{row.entity.printNr}}</a></div>'
				},
				{name: 'basketNr', displayName: 'סל', enableCellEdit: false, cellTooltip: true},
				{name: 'basketPriority', displayName: "P", enableCellEdit: false, width: '60'},
				{name: 'srvActivity', displayName: 'סוג הפצה', enableCellEdit: false, cellTooltip: true},
				{name: 'insertUser', displayName: 'משתמש', enableCellEdit: false},
				// {name: 'mailNr', displayName: 'מייל', enableCellEdit: false},
				{name: 'tsDate', displayName: 'סיום טיפול', enableCellEdit: false, cellTooltip: true},
				{name: 'insertDate', displayName: 'יצירת סל', enableCellEdit: false, cellTooltip: true},
				{name: 'policyNr', displayName: 'פוליסה', enableCellEdit: false, cellTooltip: true},
				{name: 'claimNr', displayName: 'תביעה', enableCellEdit: false, cellTooltip: true},
				{
					name: 'printStsDisplayName',
					displayName: 'סטטוס',
					enableCellEdit: false,
					cellTooltip: true,
					cellTemplate: '<div class="text-right pr-1" ng-class="row.entity.printStsDisplayName.includes(\'הצלחה\') ? \'green\' : \'red\'">{{row.entity.printStsDisplayName}}</div>'
				},
				{name: 'distribDate', displayName: 'תאריך הפצה', enableCellEdit: false, cellTooltip: true},
				{name: 'client', displayName: 'לקוח', enableCellEdit: false, cellTooltip: true},
				{name: 'listType', displayName: 'מהלך', enableCellEdit: false},
			],
			data: data
		};

		this.gridOptions.onRegisterApi = function (gridApi) {
			//set gridApi on scope
			self.gridApi = gridApi;
		}

		function validateForm() {
			return queryForm.dateField.$valid;
		}

		this.restoreBaskets = function () {
			var selectedRowsSize = self.gridApi.selection.getSelectedRows().length;
			if(selectedRowsSize === 0) {
				self.queryErrorFeedback = "No rows selected";
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
						warningItem.name = selectedRowsSize + " baskets will be redistributed!"
						selectedItems.push(warningItem);
						return selectedItems;
					},
					operation: function () {
						return "redistribute baskets";
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				var selectedRows = self.gridApi.selection.getSelectedRows();
				self.isQueryRunning = true;
				self.userId = 0;
				var data = {
					queryCode: 1,
					userId: self.userId,
					failureCounter: true,
					docNrt: false,
					baskets: []
				};
				if (selectedRows.length > 0) {
					selectedRows.forEach(function (row) {
						data.baskets.push(row.printNr);
					});
					self.selectedRows = data;
					dbService.restoreBaskets(data).then(function (response) {
						self.isQueryRunning = false;
					}, function (response) {
						self.isQueryRunning = false;
						self.queryErrorFeedback = response;
					});
				}

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
				self.isQueryRunning = false;
			});
		}
	}

	appModule.component('adBsQuery', {
		templateUrl: 'app/components/queries/baskets/search/bs.query.html',
		controller: BsQueryComponent,
		bindings: {
			operation: "<"
		}
	});
})();