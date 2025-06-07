/**
 * Created by vladimir on 26/11/2017.
 */



(function () {
	angular.module("MyApp").factory("alertsService", function ($http, $q, authService, Constants) {
		var self = this;
		this.alerts = [];
		this.hostDownAlerts = [];
		this.hostIdleAlerts = [];
		// Return public API.
		return ({
			addAlert: add,
			addHostAlert: addHostAlert,
			removeAlert: remove,
			removeHostAlert: removeHostAlert,
			getAlerts: get,
			getHostDownAlerts: getHostDownAlerts,
			getHostIdleAlerts: getHostIdleAlerts,
			clearAlerts: clear
		});

		function clear() {
			while (self.alerts.length > 0) {
				self.alerts.pop();
			}
			while (self.hostDownAlerts.length > 0) {
				self.hostDownAlerts.pop();
			}
			while (self.hostIdleAlerts.length > 0) {
				self.hostIdleAlerts.pop();
			}
		}

		function get() {
			return self.alerts;
		}

		function getHostDownAlerts() {
			return self.hostDownAlerts;
		}

		function getHostIdleAlerts() {
			return self.hostIdleAlerts;
		}

		function add(message, link, env) {
			//console.log("message: " + message + " link:" + link + " env: " +env);
			if (env !== undefined && authService.getCurrentEnv() !== env) {
				return;
			}
			for (var i = 0; i < self.alerts.length; i++) {
				if (self.alerts[i].message === message) {
					return;
				}
			}
			var alert = {};
			alert.link = link;
			alert.message = message;
			self.alerts.push(alert);
		}

		function addHostAlert(server, serverState, env) {
			var serverId = getServerId(server);
			if (env !== undefined && authService.getCurrentEnv() !== env) {
				return;
			}
			if(server.name.startsWith("pdf-source-storage")) {
				return;
			}
			for (var i = 0; i < self.hostDownAlerts.length; i++) {
				if (self.hostDownAlerts[i].serverId === serverId) {
					return;
				}
			}
			for (var i = 0; i < self.hostIdleAlerts.length; i++) {
				if (self.hostIdleAlerts[i].serverId === serverId) {
					return;
				}
			}
			var alert = {};
			alert.serverId = serverId;
			if (serverState === Constants.SERVER_STATE.DOWN) {
				self.hostDownAlerts.push(alert);
			} else {
				self.hostIdleAlerts.push(alert);
			}
		}

		function remove(message) {
			for (var i = 0; i < self.alerts.length; i++) {
				if (self.alerts[i].message === message) {
					self.alerts.splice(i, 1);
					break;
				}
			}
		}

		function removeHostAlert(server, env) {
			if(server.name.startsWith("pdf-source-storage")) {
				return;
			}
			var serverId = getServerId(server);
			for (var i = 0; i < self.hostDownAlerts.length; i++) {
				if (self.hostDownAlerts[i].serverId === serverId) {
					self.hostDownAlerts.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < self.hostIdleAlerts.length; i++) {
				if (self.hostIdleAlerts[i].serverId === serverId) {
					self.hostIdleAlerts.splice(i, 1);
					break;
				}
			}

		}

		function getServerId(server) {
			return server.host + server.name;
		}

	});
})();

