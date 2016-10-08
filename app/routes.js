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
					controller : 'ChatController'
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