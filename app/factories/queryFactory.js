;(function() {


  'use strict';


  /**
   * $http service abstraction to make API calls with any HTTP method,
   * custom url and data object to be sent as request.
   * Every REST API call is measured, you can see how much it took
   * in the console.
   *
   * @category  factory
   * @example   Inject QueryService as the dependency and then use it this way:
   *
   */


  angular
    .module('chat')
    .factory('QueryService', [
      '$http', '$q','URLS', QueryService
    ]);



  //////////////// factory



  function QueryService($http, $q, URLS) {


    var service = {
      query: query
    };

    return service;


    //////////////// definition

    function query(method, url, data, params) {

      var deferred = $q.defer();

      	$http({
          url: URLS.API_URL + url,
          method: method,
          data: data,
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response) {
            deferred.resolve(response);
        },
         function(error) {
          deferred.reject(error);
        });


      return deferred.promise;
    }

  }




})();