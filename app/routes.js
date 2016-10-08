/**
 * 
 * AngularJS Boilerplate
 * @description           Description
 * @author                Jozef Butko // www.jozefbutko.com/resume
 * @url                   www.jozefbutko.com
 * @version               1.1.7
 * @date                  March 2015
 * @license               MIT
 * 
 */
;(function() {

angular.module('chat', ['ngRoute'])
	   
		.factory('messagesFactory',['$q','$http', function ($q, $http) {
				var service = {
					
					getMessages: function(){

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

						return deferred.promise;
					}
				};


				return service;
			
			}])

	   .config(function ($routeProvider, $locationProvider, $httpProvider) {
			
			$locationProvider.html5Mode(false);

			//same origin, CORS
			//$httpProvider.defaults.useXDomain = true;
			/*$httpProvider.defaults.withCredentials = true;
			delete $httpProvider.defaults.headers.common["X-Requested-With"];
			$httpProvider.defaults.headers.common["Accept"] = "application/json";
			$httpProvider.defaults.headers.common["Content-Type"] = "application/json";*/
			
			
			$routeProvider
				.when('/', { 
					templateUrl : 'app/partials/login.html',
					controllerAs: 'main',
					controller: 'AuthController'
				})
				.when('/chat', {
					templateUrl : 'app/partials/chat.html',
					controllerAs: 'main',
					controller : 'ChatController',
					resolve: {
						messages: function(messagesFactory){
							console.log(messagesFactory.getMessages())
							return messagesFactory.messages;
						}
					}
				})
				.when('/signin', {
					templateUrl : 'app/partials/login.html',
					controllerAs: 'main',
					controller: 'AuthController',
					resolve: {
						toaster: function(toaster) {
							console.log(toaster)
							return toaster;
						}
					}
				})
				.when('/signup', {
					templateUrl : 'app/partials/signup.html',
					controllerAs: 'main',
					controller : 'AuthController',
				})
				.when('/logout', {
					url : 'http://caty.herokuapp.com/disconnect',
					redirectTo : '/'
				})
				.otherwise({redirectTo : '/' });
		});


})();