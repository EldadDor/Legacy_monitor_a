/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function WhatsappComponent($scope, $interval, $log, dataService, authService, controlService, Constants) {
		var self = this;
		this.authState = authService;

	}

	appModule.component('adWhatsapp', {
		templateUrl: 'app/components/whatsapp/whatsapp.html',
		controller: WhatsappComponent
	});
})();