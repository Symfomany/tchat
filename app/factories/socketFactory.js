;(function() {


  'use strict';


  /**
   * $http service abstraction to make API calls with any HTTP method,
   * custom url and data object to be sent as request.
   * Every REST API call is measured, you can see how much it took
   * in the console.
   *
   * @category  factory
   * @author    Jozef Butko
   * @example   Inject QueryService as the dependency and then use it this way:
   *
   * QueryService.query('GET', 'users/user/', {get: query}, {post: params})
      .then(function(data) {
        console.log(data);
      }, function(error) {
        console.log(error);
      });
   *
   * @param     {String} method HTTP method, eg. 'PUT', 'GET'...
   * @param     {String} url API endpoint, eg. 'users/user' or 'system-properties'
   * @param     {Object} params Map of strings or objects which will be turned
   *                     to `?key1=value1&key2=value2` after the url. If the value
   *                     is not a string, it will be
   *                     JSONified
   * @return    {Object} data Data to be sent as the request message data
   * @version   1.1
   *
   */


  angular
    .module('chat')
    .factory('socket', [
      '$rootScope', socketFactory
    ]);


	function socketFactory($rootScope) {
			var socket = io.connect('http://caty.herokuapp.com/');
        
      var service = {
        on: on,
        emit: emit,
      };
      return service;

      
        
      function on(eventName, callback) {

          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
      }


      function emit(eventName, data, callback) {

            console.log(eventName, data);
						socket.emit(eventName, data, function () {
							
              var args = arguments;

							$rootScope.$apply(function () {
								if (callback) {
									callback.apply(socket, args);
								}
							});
						})
        }



    };

			

})();