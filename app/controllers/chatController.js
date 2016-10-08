'use strict';

/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 * 
 */
;(function() {

  angular
    .module('chat')
	.constant('URLS', {
      'API_URL': 'http://caty.herokuapp.com/'
    })
	.controller('ChatController',ChatController);

  ChatController.$inject = ['$scope','$http','socket', 'QueryFactory','storage', 'toaster', 'URLS', 'messages'];


  
  function ChatController($scope,$http, socket, QueryFactory,storage, toaster, URLS, messages) {
	  console.log(messages);

	  var messages = messages
		/**
		 * Virtual Model
		 */
		var vm = this;

		vm.loginFormDatas = {};
		vm.send = send; 
		vm.messages = send; 
		vm.user = storage.get('user');


		/**
		 * Init
		 */
		load();

		//console.log(socket);
		//socket.emit('init');
		socket.emit('ready') 

		socket.on('messages', null, function(data){
			console.log(data);
		});
	


		/**
		 * Send a message
		 */
		function load(){
			
			vm.messages =  messages.data
				
		}



		/**
		 * Send a message
		 */
		function send(){
			var now =  new Date(); 
			var data =  {
				roomName: "HOT",
				userName: vm.user,
				date:  new Date(),
				time:  new Date().getTime(),
				message: vm.message
			};
			
			socket.emit('send:message', data, function(data){
			});

			/*webNotification.showNotification(scope.notificationTitle, {
                    body: scope.notificationText,
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');

                        setTimeout(function hideNotification() {
                            console.log('Hiding notification....');
                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 5000);
                    }
			});*/	

			vm.messages.push(
			{
				id: vm.messages.length,
				content:  vm.message,
				userName: (vm.user) ? (vm.user) : 'Anonyme',
				date: new Date()
			});

			vm.message = "";
				
		}

		


  };

})();