/**
 * Created by vladimir on 04/04/2017.
 */

(function () {
	"use strict";

	function MyInboxComponent($scope, $rootScope, $http, $interval, controlService, authService, Constants) {
		var self = this;
		self.hideGrid = true;
		self.isQueryRunning = false;
		var stompClient = null;
		askNotificationPermission();
		getBroadcastMessages();
		connect();
		// var checkInterval = $interval(getBroadcastMessages, 30000);
		$scope.$on('$destroy', function () {
			console.log("$destroy MyInboxComponent");
			disconnect();
		});

		this.submitMessage = function (sendMessageForm) {
			if (!sendMessageForm.$valid) {
				return false;
			}
			self.isQueryRunning = true;
			stompClient.send("/app/addMessage", {}, JSON.stringify({'message': self.message, 'username': authService.getUsername()}));
			self.isQueryRunning = false;
		};

		this.deleteMessage = function (key) {
			self.isQueryRunning = true;
			stompClient.send("/app/removeMessage", {}, key);
			self.isQueryRunning = false;
		};

		this.gridOptions = {
			showGridFooter: true,
			enableFiltering: true,
			showHeader: false,
			columnDefs :  [{ field: 'date', maxWidth:'180'},
				{field: 'message'},
				{
					field: 'delete', maxWidth:'50', cellTemplate:'<div style="text-align: center"><button ng-click=\'grid.appScope.$ctrl.deleteMessage(row.entity.key)\' type="button" class="close" aria-label="Close"> <span aria-hidden="true">&times;</span></button></div>'
				}]
		};

		function getBroadcastMessages() {
			$http.get("/getBroadcastMessages").then(function (response) {
				self.gridOptions.data = response.data.InboxMessages;
				self.hideGrid = false;
			}, function (response) {
				console.log("Failed to fetch broadcast messages, response=" + response);
				self.gridOptions.data = [];
			});
		}





		function connect() {
			var socket = new SockJS('/myinbox-websocket');
			stompClient = Stomp.over(socket);
			stompClient.connect({}, function (frame) {
				var messageCount = 0;
				console.log('Connected: ' + frame);
				stompClient.subscribe('/topic/messages', function (data) {
					var messages = JSON.parse(data.body).InboxMessages;
					var newMessageCount = messages.length;
					showMessages(messages);
					if(newMessageCount > messageCount) {
						var message  = messages[0].message;
						var username = message.split(/\[(.*?)\]/)[1];
						var notification = new Notification('New Message from ' + username, {body: message});
					}
					messageCount = newMessageCount;
				});
			});
			console.log("MyInboxComponent websocket connected");
		}

		function disconnect() {
			if (stompClient !== null) {
				stompClient.disconnect();
				console.log("MyInboxComponent websocket disconnected");
			} else {
				console.log("MyInboxComponent stompClient is null");
			}
		}

		function showMessages(messages) {
			self.gridOptions.data = messages;
			self.hideGrid = false;
		}

		function askNotificationPermission() {

		  // Let's check if the browser supports notifications
		  if (!('Notification' in window)) {
		    console.log("This browser does not support notifications.");
		  } else {
		    if(checkNotificationPromise()) {
		      Notification.requestPermission()
		      .then(function(permission) {
		        handlePermission(permission);
		      })
		    } else {
		      Notification.requestPermission(function(permission) {
		        handlePermission(permission);
		      });
		    }
		  }
		}

		// function to actually ask the permissions
		function handlePermission(permission) {
			// Whatever the user answers, we make sure Chrome stores the information
			if (!('permission' in Notification)) {
				Notification.permission = permission;
			}
			// set the button to shown or hidden, depending on what the user answers
			if (Notification.permission === 'denied' || Notification.permission === 'default') {
				console.log('block');
			} else {
				console.log('none');
			}
		}

		function checkNotificationPromise() {
		    try {
		      Notification.requestPermission().then();
		    } catch(e) {
		      return false;
		    }
		    return true;
		  }
	}

	appModule.component('adMyInbox', {
		templateUrl: 'app/components/myinbox/myinbox.html',
		controller: MyInboxComponent
	});
})();