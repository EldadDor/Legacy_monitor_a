/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function CampaignQueryComponent($scope, $uibModal, $log, $timeout, $window, dbService, authService, uiGridValidateService) {
		var self = this;
		this.authState = authService;
		// this.distribHour = 9;
		var data = [];
		self.hideGrid = true;
		self.isQueryRunning = false;
		this.queryCode = 1;
		var editableFields = ['client', 'policyNr', 'claimNr','brand','phoneNr'];
		// var digitFields = ['client', 'policyNr', 'claimNr','phoneNr'];

		uiGridValidateService.setValidator('numeric',
			function (argument) {
				return function (oldValue, newValue, rowEntity, colDef) {
					if (!newValue) {
						return true; // We should not test for existence here
					} else {
						return /^\d+$/.test(newValue);
					}
				};
			},
			function (argument) {
				return 'You can only insert digits in this field"';
			}
		);

		uiGridValidateService.setValidator('length',
			function (argument) {
				return function (oldValue, newValue, rowEntity, colDef) {
					if (!newValue) {
						return true; // We should not test for existence here
					}
					return newValue.length === argument;
				};
			},
			function (argument) {
				return "Value should be " + argument + " characters long";
			}
		);


		function filterColumns() {
			if (self.gridOptions.data !== undefined) {
				self.gridOptions.columnDefs.forEach(function (col) {
					col.visible = self.gridOptions.data.filter(function (item) {
						var itemColName = item[col.name];
						if (!angular.isDefined(itemColName)) {
							return false;
						}
						return editableFields.includes(col.name) || (itemColName != null && itemColName !== "");
					}).length;
				});
			}
		}

		this.showDistribution = function () {
			if(!self.selectedRows) {
				return false;
			}

			self.isQueryRunning = true;
			self.hideGrid = true;
			self.queryInfoFeedback = null;
			self.queryErrorFeedback = null;

			dbService.showCampaignDistribution(self.selectedRows).then(function (response) {
				self.isQueryRunning = false;
				if (response.data.CampaignPopulation !== undefined && response.data.CampaignPopulation.length > 0) {
					self.hideGrid = false;
				} else {
					self.queryErrorFeedback = '0 rows found';
					self.hideGrid = true;
				}
				self.gridOptions.data = response.data.CampaignPopulation;
				self.sendNr = response.data.sendNr;
				self.listType = response.data.listType;
				self.cmpgnDsc = response.data.cmpgnDsc;
				self.campaignSize = response.data.campaignSize;
				filterColumns();
			}, function (response) {
				handleError(response);
			});
		};

		this.searchCampaign = function (queryForm) {
			if (!queryForm.$valid) {
				return false;
			}
			self.isQueryRunning = true;
			self.hideGrid = true;
			self.queryInfoFeedback = null;
			self.queryErrorFeedback = null;

			if (self.listTypeSearchKey == null && self.sendNrSearchKey == null) {
				handleError("at least one field is required: list_type or send_nr");
				return;
			}

			dbService.showCampaignPopulation(self.listTypeSearchKey, self.sendNrSearchKey,  self.rowsLimit, self.queryCode).then(function (response) {
				self.isQueryRunning = false;
				if (response.data.CampaignPopulation !== undefined && response.data.CampaignPopulation.length > 0) {
					self.hideGrid = false;
				} else {
					self.queryErrorFeedback = '0 rows found';
					self.hideGrid = true;
				}
				self.gridOptions.data = response.data.CampaignPopulation;
				self.sendNr = response.data.sendNr;
				self.listType = response.data.listType;
				self.cmpgnDsc = response.data.cmpgnDsc;
				self.campaignSize = response.data.campaignSize;
				filterColumns();
			}, function (response) {
				handleError(response);
			});

		};

		this.validateForm = function () {
			// return queryForm.dateField.$valid;
		}

		this.gridOptions = {
			showGridFooter: true,
			enableFiltering: true,
			columnDefs: [
				{name: 'id', displayName: "#", enableCellEdit: false, width: '40'},
				{name: 'leadNr', displayName: 'ליד', enableCellEdit: false, cellTooltip: true},
				{name: 'client', displayName: 'לקוח', enableCellEdit: true, width: '105', headerCellClass: 'editableHeader', validators: {required: true, length: 9, numeric: true}, cellTemplate: 'ui-grid/cellTitleValidator'},
				{name: 'policyNr', displayName: 'פוליסה', enableCellEdit: true, width: '105', headerCellClass: 'editableHeader', validators: {numeric: true}, cellTemplate: 'ui-grid/cellTitleValidator'},
				{name: 'claimNr', displayName: 'תביעה', enableCellEdit: true, width: '105', headerCellClass: 'editableHeader', validators: {numeric: true}, cellTemplate: 'ui-grid/cellTitleValidator'},
				{
					name: 'brand',
					displayName: 'מותג',
					enableCellEdit: true,
					width: '90',
					editableCellTemplate: 'ui-grid/dropdownEditor',
					cellFilter: 'mapBrand',
					editDropdownValueLabel: 'brand',
					editDropdownOptionsArray: [
						{id: '1', brand: 'ביטוח ישיר'},
						{id: '2', brand: '9 ביטוח'},
						{id: '3', brand: 'YNET ביטוח'}
					],
					headerCellClass: 'editableHeader'
				},
				{name: 'phoneNr', displayName: 'טלפון', enableCellEdit: true, width: '105', headerCellClass: 'editableHeader', validators: {required: true, length: 10, numeric: true}, cellTemplate: 'ui-grid/cellTitleValidator'},
				{name: 'status', displayName: 'סטטוס ליד', enableCellEdit: false, cellTooltip: true},
				{name: 'failureReason', displayName: 'סיבת כישלון', enableCellEdit: false},
				{name: 'updateDate', displayName: 'תאריך עדכון', enableCellEdit: false, cellTooltip: true},
				{name: 'printNr', displayName: 'מספר הפצה', enableCellEdit: false,
					cellTemplate: '<div ng-if="row.entity.printSts.includes(\'הצלחה\')" class="pl-1">{{row.entity.printNr}} </div>' +
					'<div class="pl-1"><a target="_blank" ng-if="!row.entity.printSts.includes(\'הצלחה\')" ng-href="http://searcher:8000/en-US/app/idi/search?q=search index=distrib source={{grid.appScope.$ctrl.authState.getCurrentDataSource().toLowerCase()}} sourcetype=astro-dev {{row.entity.printNr}}">{{row.entity.printNr}}</a></div>'},
				{name: 'smsText', displayName: 'טקסט', enableCellEdit: false, cellTooltip: true},
				{name: 'insertDate', displayName: 'תאריך הפצה', enableCellEdit: false, cellTooltip: true},
				{name: 'printSts', displayName: 'סטטוס הפצה', enableCellEdit: false, cellTooltip: true,
					cellTemplate: '<div class="text-right pr-1" ng-class="row.entity.printSts.includes(\'הצלחה\') ? \'green\' : \'red\'">{{row.entity.printSts}}</div>'}
			],
			data: data
		};

		self.msg = {};
		this.gridOptions.onRegisterApi = function (gridApi) {
			//set gridApi on scope
			self.gridApi = gridApi;
			// gridApi.validate.on.validationFailed($scope, function (rowEntity, colDef, newValue, oldValue) {
			// 	$window.alert('rowEntity: ' + rowEntity + '\n' +
			// 		'colDef: ' + colDef + '\n' +
			// 		'newValue: ' + newValue + '\n' +
			// 		'oldValue: ' + oldValue);
			// });
			gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
				if (oldValue === newValue) {
					return;
				}
				self.gridApi.grid.validate.runValidators(rowEntity, colDef, rowEntity[colDef.name], oldValue, self.gridApi.grid).then(function () {
					if (uiGridValidateService.isInvalid(rowEntity, colDef)) {
						$log.warn('cell #' + rowEntity.id + '[' + colDef.name + '] vallue=\'' + newValue + '\' is invalid, edit aborted');
					} else {
						self.isQueryRunning = true;
						self.queryInfoFeedback = null;
						self.queryErrorFeedback = null;
						self.msg.lastCellEdited = colDef.displayName + ' [#' + rowEntity.id + ']  ' + oldValue + ' --> ' + newValue;
						// $scope.$apply();
						dbService.updateCmLead(self.sendNr, rowEntity.leadNr, colDef.name, newValue, self.queryCode).then(function (response) {
							self.isQueryRunning = false;
						}, function (response) {
							self.isQueryRunning = false;
							self.queryErrorFeedback = response;
						});
					}
				});

			});

			gridApi.selection.on.rowSelectionChanged($scope, function (row) {
				var msg = 'row selected ' + row.isSelected;
				$log.log(msg);
			});

			gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
				var msg = 'rows changed ' + rows.length;
				$log.log(msg);
			});
		};

		self.gridOptions.multiSelect = true;
		self.info = {};

		this.selectAll = function () {
			self.gridApi.selection.selectAllRows();
		};

		this.clearAll = function () {
			self.gridApi.selection.clearSelectedRows();
		};

		this.distribCampaign = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				component: 'modalComponent',
				resolve: {
					items: function () {
						var selectedItems = [];
						var dataSorceItem = {};
						dataSorceItem.name = authService.getCurrentDataSource();
						selectedItems.push(dataSorceItem);
						var warningItem = {};
						var selectedRowsSize = self.gridApi.selection.getSelectedRows().length;
						warningItem.name = (selectedRowsSize === 0 ? self.campaignSize : selectedRowsSize) + " leads will be redistributed!"
						selectedItems.push(warningItem);
						return selectedItems;
					},
					operation: function () {
						return "redistribute campaign";
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				var selectedRows = self.gridApi.selection.getSelectedRows();
				self.isQueryRunning = true;
				var data = {
					sendNr: self.sendNr,
					queryCode: self.queryCode,
					leads: [],
					distribHour: self.distribHour
				};
				if (selectedRows.length > 0 && selectedRows.length < self.gridOptions.data.length) {
					selectedRows.forEach(function (row) {
						data.leads.push({"leadNr": row.leadNr});
					});
					self.selectedRows = data;
				}
				dbService.distribCampaign(data).then(function (response) {
					self.isQueryRunning = false;
				}, function (response) {
					self.isQueryRunning = false;
					self.queryErrorFeedback = response;
				});
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
				self.isQueryRunning = false;
			});


		};

		function handleError(error) {
			self.queryErrorFeedback = error;
			self.isQueryRunning = false;
			self.gridOptions.data = [];
			self.sendNr = null;
			self.listType = null;
			self.campaignSize = null;
		}

		this.isDistribHourRestricted = function () {
			var hour = new Date().getHours();
			return hour < 9 || hour >= 19;
		}

		this.onSearchTypeChange = function () {
			self.gridOptions.data = [];
			self.hideGrid = true;
		}
	}

	appModule.component('adCampaignQuery', {
		templateUrl: 'app/components/campaigns/campaign/campaignQuery.html',
		controller: CampaignQueryComponent,
		bindings: {
			searchParams: "<",
			operation: "<"
		}
	}).filter('mapBrand', function () {
		var brandHash = {
			'1': 'ביטוח ישיר',
			'2': '9 ביטוח',
			'3': 'YNET ביטוח'
		};

		return function (input) {
			if (!input) {
				return '';
			} else {
				return brandHash[input];
			}
		};
	});


})();

