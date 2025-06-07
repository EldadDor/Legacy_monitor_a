(function () {
	"use strict";

	function FromDatepickerComponent($scope) {
		var self = this;

		this.open = function () {
			self.popup.opened = true;
		};
		this.today = function () {
			self.date = new Date();
		};

		this.getYesterdayDate = function () {
			var date = new Date();
			date.setDate(date.getDate()-1);
			self.date = date;
		}
		this.today();

		// this.today();

		this.clear = function () {
			self.date = null;
		};

		this.dateOptions = {
			dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(),
			minDate: getMinDate(),
			startingDay: 7,
			showWeeks: false
		};



		function getMinDate() {
			var date = new Date();
			return date.setDate(date.getDate() - 180);
		}

		// Disable weekend selection
		function disabled(data) {
			// var date = data.date,
			// 	mode = data.mode;
			// return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		}

		this.open = function () {
			self.popup.opened = true;
		};

		this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		this.format = this.formats[2];
		this.altInputFormats = ['M!/d!/yyyy'];
		this.popup = {
			opened: false
		};
		this.dateChanged = function () {
		    $scope.$parent.queryForm.dateField.$setValidity('$valid', self.date !== undefined && self.date.getTime() >= self.dateOptions.minDate);
		}
	}

	appModule.component('adUntilDatepicker', {
		templateUrl: 'app/shared/untildatepicker.html',
		controller: FromDatepickerComponent,
		bindings: {
			date: "=",
		}
	});
})();