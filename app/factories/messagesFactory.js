;(function() {


  'use strict';


  /**
   * $http service abstraction to make API calls with any HTTP method,
   * custom url and data object to be sent as request.
   * Every REST API call is measured, you can see how much it took
   * in the console.
   *
   *
   */


  angular
    .module('chat')
    .factory('messagesFactory', [
      'queryFactory', messagesFactory
    ]);


	function messagesFactory(queryFactory) {

      var service = {
        messages: getMessages
      };

      return service;


      function getMessages() {

            var deferred = $q.defer();

            $http({
              url:  'http://localhost:7076/messages',
              method: 'GET',
            }).then(function(response) {
                console.log(response);
                deferred.resolve(response);
            },
            function(error) {
              deferred.reject(error);
            });


          console.log(deferred.promise);
      }


  };

			

})();