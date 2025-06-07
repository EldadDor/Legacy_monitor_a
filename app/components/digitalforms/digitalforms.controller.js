/**
 * Created by vladimir on 04/04/2017.
 */


(function () {
		"use strict";

		function DigitalFormsComponent($scope, $http, $interval, dataService, authService, controlService, splunkService, dbService, Constants) {
			var self = this;
			self.hideGrid = false;
			self.isQueryRunning = false;
			self.hideGrid2 = false;
			self.isQueryRunning2 = false;
			var fromDate = new Date();
			fromDate.setDate(fromDate.getDate() - 1);
			self.fromDate = fromDate;
			self.toDate = new Date();
			self.digitalFormSuffix = "";
			self.showDatesAlert = false;
			self.showDatesWideRangeAlert = false;


			self.name = '';

			self.digitalForm = {
				id: null,
				name: null,
				typeAheadFlag: false,
				readonly: true
			};


			this.search = function (queryForm) {
				if (!queryForm.$valid) {
					//alert("not ok !!!");
					return false;
				}
				if (!validateForm(queryForm)) {
					//alert("not ok ???");
					return false;
				}
				updateData();

			};

			this.search2 = function (queryForm) {
				if (!queryForm.$valid) {
					//alert("not ok !!!");
					return false;
				}
				updateData2();

			};

			//remove 3   $ctrl.queryDigitalFormList($viewValue)
			this.queryDigitalFormList = function (searchStr) {
				alert("in queryDigitalFormList");
				alert(searchStr);
				dbService.getAllDigitalForms(searchStr).then(function (response) {
					if (response.data.DigitalFormList.length > 0) {
						//alert ("there is data");
					}
					//return  response.data.DigitalFormList;
					//self.digitalforms3  =response.data.DigitalFormList;
				}, function (response) {
					return [];
				});

			}

			//remove 2
			this.formatDigitalFormLabel = function (model) {
				//alert (model);
				if (typeof self.digitalforms2 != "undefined") {
					//alert ("okkkkkk");
					for (var i = 0; i < self.digitalforms2.length; i++) {
						if (model === self.digitalforms2[i].id) {
							return self.digitalforms2[i].id || self.digitalforms2[i].name;
						}
					}

				}

			}


			function validateForm(queryForm) {
				var isValid = true;
				if (self.fromDate > self.toDate) {
					isValid = false;
					self.showDatesAlert = true;
				}
				//check range is 2 days at most
				else {
					self.showDatesAlert = false;
					//alert (fromDate);
					var toDateValMax = new Date(self.fromDate);
					//var toDateAsStringb4 = eval(toDateValMax.getMonth() + 1) + "/" + toDateValMax.getDate() + "/" + toDateValMax.getFullYear() + ":00:00:00";
					//alert (toDateAsStringb4);
					toDateValMax.setDate(toDateValMax.getDate() + 2);

					//alert ("toDateValMax");
					//alert (toDateValMax);
					//var fromDateAsString = eval(self.fromDate.getMonth() + 1) + "/" + self.fromDate.getDate() + "/" + self.fromDate.getFullYear() + ":00:00:00";
					//var toDateAsString = eval(toDateValMax.getMonth() + 1) + "/" + toDateValMax.getDate() + "/" + toDateValMax.getFullYear() + ":00:00:00";
					//alert (fromDateAsString);
					//alert (toDateAsString);

					if (self.toDate > toDateValMax) {
						//alert ("bye");
						isValid = false;
						self.showDatesWideRangeAlert = true;
					}
					else {
						self.showDatesWideRangeAlert = false;
						//alert ("hi");
					}
				}

				return isValid;
			}

			if (authService.isAuthenticated()) {
				updateData();
			}
			$scope.$on(Constants.EVENTS.UPDATE_DATA, function (response) {
				updateData();
			});


			var data = [];
			// BasketNrSuccess  basketnr  PrintNr  distribnr
			this.gridOptions = {
				showGridFooter: true,
				enableFiltering: true,
				data: data,
				columnDefs: [{field: 'digitalFormId', displayName: 'טופס', width: '10%'},
					{field: 'digitalFormName', displayName: 'שם טופס', width: '20%'},
					{field: 'clientId', displayName: 'לקוח', width: '10%'},
					//{field: 'PrintNr', displayName: 'הפצה', width: '10%'},
					{field: 'time', displayName: 'זמן שליחה', width: '15%'},
					{field: 'fullICVFormlink', displayName: 'לינק', width: '35%'},
					{field: 'basket_nr', displayName: 'מספר סל', width: '10%'}
				]
			};

			var data = [];
			this.gridOptions2 = {
				showGridFooter: true,
				enableFiltering: true,
				data: data,
				columnDefs: [{field: 'digitalFormId', displayName: 'מספר טופס', width: '20%'},
					{field: 'digitalFormName', displayName: 'שם טופס', width: '35%'},
					{field: 'clientPId', displayName: 'לקוח', width: '10%'},
					{field: 'time', displayName: 'זמן הגשה', width: '20%'},
					{field: 'basket_nr', displayName: 'מספר סל', width: '15%'}
				]
			};

			var data = [];
			this.gridOptions3 = {
				showGridFooter: true,
				enableFiltering: true,
				data: data,
				columnDefs: [{field: 'digitalFormId', displayName: 'מספר טופס', width: '10%'},
					{field: 'digitalFormName', displayName: 'שם טופס', width: '20%'},
					{field: 'client', displayName: 'לקוח', width: '10%'},
					{field: 'time', displayName: 'זמן הגשה', width: '10%'},
					// {field: 'basket_nr', displayName: 'מספר סל', width: '10%'},
					{field: 'policy', displayName: 'פוליסה', width: '10%'},
					{field: 'claim', displayName: 'מס תביעה', width: '10%'},
					{field: 'brand', displayName: 'מותג', width: '10%'},
					{field: 'isValid', displayName: 'האם הגשה הסתיימה באופן תקין?', width: '20%'}
				]
			};


			var data = [];
			this.gridOptions4 = {
				showGridFooter: true,
				enableFiltering: true,
				data: data,
				columnDefs: [{field: 'Status', displayName: 'סטטוס', width: '5%'},
					{field: 'time', displayName: 'זמן כניסה לטופס', width: '10%'},
					{field: 'digitalSuffix', displayName: 'סיומת לינק', width: '10%'},
					{field: 'source', displayName: 'מקור', width: '5%'},
					//		{field: 'sourcetype', displayName: 'sourcetype', width: '10%'},
					{field: 'UserAgent', displayName: 'נתוני דפדפן', width: '70%'}
				]
			};


			function updateData() {
				//var env2 = authService.getCurrentEnv();
				//alert ("updateData");
				//alert (env2);
				self.isQueryRunning = true;
				self.hideGrid = true;
//| rename basketnr as BasketNrSuccess
				var query = "clientPos=icvForm icvStage=createForm icvAction=icvCreateFormAction Finished with fullICVFormlink | table _time digitalFormId digitalFormName fullICVFormlink clientId basket_nr  ";
				// 	var query = "clientPos=icvForm icvStage=createForm icvAction=icvCreateFormAction Finished with fullICVFormlink | table _time digitalFormId fullICVFormlink clientId basket_nr  | rename basket_nr  as basketnr   "+
				// 						" | join type=outer basketnr [search index=distrib  Basket Completed Successfully | table  basketnr PrintNr ]  ";

				//| table digitalFormId fullICVFormlink clientId basket_nr policyNr srvnr
				// BasketNrSuccess   basketnr
				var columns = "digitalFormId,digitalFormName,basket_nr,clientId,fullICVFormlink,time";
				var source = authService.getCurrentEnv() === Constants.ENV.PROD ? Constants.ENV.PROD.toLowerCase() : authService.getCurrentDataSource().toLowerCase();
				var sourceType = "*";

				//alert(self.toDate);
				//alert (self.digitalFormId);


				var queryDigitalFormId = self.digitalForm.id;
				if (self.digitalForm.id == null) {
					queryDigitalFormId = "";
				}

				splunkService.getDigitalSearchResults(queryDigitalFormId, self.clientId, self.fromDate, self.toDate, source, sourceType, query, columns).then(function (response) {
					self.gridOptions.data = JSON.parse(response).results;
					self.isQueryRunning = false;
					self.hideGrid = false;
				}, function (reason) {
					console.log(reason);
					self.gridOptions.data = [];

				});

				var submitQuery = "clientPos=icvForm icvStage=submitForm icvAction=icvCreateFormSubmitAction Started with ";
				//digitalFormId clientPId  digital_form_nr basket_nr icvJson
				var submitColumns = "digitalFormId,digitalFormName,basket_nr,clientPId,time";
				var submitSourceType = "icv";

				splunkService.getDigitalSearchResults(queryDigitalFormId, self.clientId, self.fromDate, self.toDate, source, submitSourceType, submitQuery, submitColumns).then(function (response) {
					self.gridOptions2.data = JSON.parse(response).results;
				}, function (reason) {
					console.log(reason);
					self.gridOptions2.data = [];
				});

				//digitalFormId digitalFormNr client claim brand policy  isValid icvJson
				var submitEndsQuery = "clientPos=icvForm icvStage=submitForm icvAction=icvCreateFormSubmitAction Finished with result ";
				var submitEndsColumns = "digitalFormId,digitalFormName,client,time,policy,claim,brand,isValid";

				splunkService.getDigitalSearchResults(queryDigitalFormId, self.clientId, self.fromDate, self.toDate, source, submitSourceType, submitEndsQuery, submitEndsColumns).then(function (response) {
					self.gridOptions3.data = JSON.parse(response).results;
				}, function (reason) {
					console.log(reason);
					self.gridOptions3.data = [];
				});

				// self.digitalforms = [{'id': 113, 'name': 'Aaron'},
				// 				{'id': 66, 'name': 'Bert'},
				// 				{'id': 110, 'name': 'Cesar'},
				// 				{'id': 106, 'name': 'David'},
				// 				{'id': 107, 'name': 'Elsa'}];


				//alert ("call getAllDigitalForms from ctrl");
				dbService.getAllDigitalForms(0, '').then(function (response) {
					//self.isQueryRunning = false;
					//alert ("is there data?");

					// if (response.data.DigitalFormList.length > 0) {
					//alert ("there is data");
					// self.hideGrid = false;
					// } else {
					//alert ("there is no data");
					//	self.queryErrorFeedback = '0 rows found';
					//	self.hideGrid = true;
					// }
					//BasketsSendingStatus  digitalforms2
					self.digitalforms2 = response.data.DigitalFormList;
					// alert ("init  digitalForm2!!!!");
				}, function (response) {
					// alert ("ex");
					//alert (response.data);
					//if (response.data == null) {
					//alert ("data is  null" );
					//}
					// else{
					//    alert ("data is not  null" );
					// }

					//self.queryErrorFeedback = response;
					//self.isQueryRunning = false;
					//self.gridOptions.data = [];
				});


			} //end of updateData()


			function updateData2() {
				self.isQueryRunning2 = true;
				self.hideGrid2 = true;


				var userAgentSourceType = "access_combined";
				//"GET /personalicv/chat/m/WV44XVCYLV HTTP/1.1" *

				var digitalSuffix = self.digitalFormSuffix;
				if (digitalSuffix === "") {
					digitalSuffix = "*";
				}

				var userAgentQuery = "\"GET /personalicv/chat/m/" + digitalSuffix + " HTTP/1.1\"";
				var userAgentSource = "*";
				var userAgentColumns = "Status,time,digitalSuffix,source,UserAgent";

				splunkService.getDigitalSearchResults('', '', self.fromDate, self.toDate, userAgentSource, userAgentSourceType, userAgentQuery, userAgentColumns).then(function (response) {
					self.gridOptions4.data = JSON.parse(response).results;
					self.isQueryRunning2 = false;
					self.hideGrid2 = false;
				}, function (reason) {
					console.log(reason);
					self.gridOptions4.data = [];
				});
			} //end of updateData2()


			// $scope.digitalForm


			this.selectTypeAhead = function ($item) {
			//	alert ("on selectTypeAhead");
				//alert ($item.id);
				//alert($item.label);
				//typeahead provides us the ID
				self.digitalForm.id = $item.id;
				self.digitalForm.name = $item.name;
				self.digitalForm.label = $item.label;
				//it has been modified by typeahead
				self.digitalForm.typeAheadFlag = true;
			};

			this.onChangeDigitalForm = function (digitalForm) {
				//alert ("on change");
				//alert(digitalForm);
				if (digitalForm === "") {
					//alert ("nothing");
					//alert (self.digitalForm.id);
					//alert (self.digitalForm.name);
					//alert (self.digitalForm.label);
					self.digitalForm.name = "";
					self.digitalForm.id = "";
					self.digitalForm.label = "";
				}
				else{
					//alert ("not nothing");
					if (digitalForm !== self.digitalForm.id) {
						self.digitalForm.name = "";
						self.digitalForm.label = "";
					}
					self.digitalForm.id = digitalForm;
					//alert ('now is ' + digitalForm);
				}

			}

			//remove 1
			self.formatTypeahead = function (array, id) {
				var o = _.find(array, {id: id});
				return (o ? o.name || id : id);
			}

			// listener for client.firstName to look if it has been modified
			// by typeahead or not (since only through typeahead the ID is informed)
			$scope.$watch('digitalForm.name', function (newVal, oldVal) {
				if (self.digitalForm.typeAheadFlag) {
					self.digitalForm.typeAheadFlag = false;
				} else {
					//if not informed by typeahead we delete the id
					self.digitalForm.id = null;
				}

			});


			//   queryGlobalAuthList(type, query) {
			//		return this.globalAuthService.fetchGlobalAuthList(type, query, this.showCancelled);
			//}


		}

		appModule.component('adDigitalforms', {
			templateUrl: 'app/components/digitalforms/digitalforms.html',
			controller: DigitalFormsComponent
		});
	}

)();