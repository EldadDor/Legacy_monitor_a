/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function InboxComponent($scope, $http, $interval, controlService, Constants) {
		var self = this;
		var stompClient = null;

		getBroadcastMessages();
		connect();
		$scope.$on('$destroy', function () {
			console.log("$destroy InboxComponent");
			disconnect();
		});

		function getBroadcastMessages() {
			$http.get("/getBroadcastMessages").then(function (response) {
				self.messagesCount = response.data.InboxMessages.length;
			}, function (response) {
				console.log("Failed to fetch broadcast messages, response=" + response);
				self.messagesCount = null;
			});
		}

		function connect() {
			var socket = new SockJS('/inbox-websocket');
			stompClient = Stomp.over(socket);
			stompClient.connect({}, function (frame) {
				console.log('Connected: ' + frame);
				stompClient.subscribe('/topic/messages', function (data) {
					self.messagesCount = JSON.parse(data.body).InboxMessages.length;
				});
			});
		}

		function disconnect() {
			if (stompClient !== null) {
				stompClient.disconnect();
				console.log("InboxComponent websocket disconnected");
			} else {
				console.log("InboxComponent stompClient is null");
			}
		}
	}

	appModule.component('adInbox', {
		templateUrl: 'app/components/inbox/inbox.html',
		controller: InboxComponent
	});
})();