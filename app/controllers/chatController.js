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
      'API_URL': 'http://caty.herokuapp.com/' // old...
    })
	.controller('ChatController',ChatController)

	.filter('ago',function(){
		return function(date){
				if(!date){
					return moment().locale('fr').fromNow()
				}

				return moment(date).locale('fr').fromNow(); // 4 years ago
			};
	})
	.filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '…';
                }
            }
            return input;
        };
    })
	.filter('titlecase', function() {
		return function( input ) {
			return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
	});

	




  ChatController.$inject = ['storage','toaster', 'URLS','socket' ,'messages'];


  
  function ChatController(storage, toaster, URLS, socket, messages) {


		/**
		 * Virtual Model
		 */
		var vm = this;

		vm.loginFormDatas = {};
		vm.send = send; 
		vm.messages = messages;  //load from factory resolved with $q
		vm.nb = 0;

		var userName = storage.get('user') ? storage.get('user').username : "Anonyme";
		socket.emit('user:add', userName);

		socket.on('count',function(nb){
			vm.nb = nb.count
		});

		/**
		 * Send a message
		 */
		function send(){
			vm.messages.push({userName : userName, content : vm.message})
			var data =  {
				username: userName,
				message: vm.message
			};

			socket.emit('messages:send', data, function(data){});

			socket.on('messages:success',function(message){
				vm.messages.push(message)
			});

			socket.on('user:joined',function(data){
				toaster.success('Connecté', data.username + " est connecté");
			});

			socket.on('messages:error',function(err){
				toaster.error( 'OMG', err);
			});

			vm.message = ""; //empty textarea
		}

		

  };

})();