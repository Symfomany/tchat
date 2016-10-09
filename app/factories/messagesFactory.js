;(function() {


  'use strict';


  angular
    .module('chat')
    .factory('messagesFactory', ['$q',messagesFactory]);
    
    
    function messagesFactory($q) {
      
			var socket = io.connect();
			var messages = [];
			var service = {
				getMessages: function(){
					var defer;
					defer = $q.defer();
					socket.emit('messages:receive')
					socket.on('messages:all',function(data){
						defer.resolve(data);
					});

					return defer.promise;
				}
			};

			return service;
		};
			

})();