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
	.controller('AuthController',AuthController);


  AuthController.$inject = ['$scope','$http','$location','socket', 'QueryService','storage', 'toaster', 'URLS'];

  
  function AuthController($scope,$http,$location, socket, QueryService, storage, toaster, URLS) {


		/**
		 * Virtual Model
		 */
		var vm = this;

		vm.loginFormDatas = {};
		vm.login = login;
		vm.logout = logout;
		vm.signup = signup;
		vm.user = storage.get('user');

		socket.on('connect', function () {
			console.log('connected');		//verify if an user is connected
			socket.emit('self:join', {roomName: 'hot...'}, function(data){
					console.log(data);		//verify if an user is connected
			});
		});

		
	
		/**
		 * Login User
		 */
		function login(){

			QueryService
			.query('POST', 'connect',{username: vm.username, password: vm.password})
			.then(function(response){
				console.log(response);
				if (response.data === 'success') {
					toaster.success( 'Great!',  "Bienvenue " + vm.userName);
					storage.set('user', vm.username)
					vm.user = vm.username;
					$location.path('/chat');
				}else{
					toaster.error('Mauvais Login/ Mdp', response.data);
				}
			});
			
		}



		/**
		 * Logout User
		 */
		function logout () {
			
			QueryService
			.query('GET', 'disconnect')
			.then(function(response){
				storage.remove('user')
				$location.path('/signin');
			});
			
		};




		/**
		 * Signup an user && AUtologin
		 */
		function signup(isValid) {

			QueryService
			.query('POST', 'signup', {username: vm.username, password: vm.password, password2: vm.confirmation})
			.then(function(response){

				if (response.data === 'success') {
					toaster.success( 'Great!',  "Votre compte a bien été crée");

					QueryService
					.query('POST', 'connect', {'username': vm.username, password: vm.password})
					.then(function(response){
						console.log('Vous êtes maintenant inscris !', response);
						console.log(socket);
						vm.signupFormDatas = {};
						socket.emit('init', {});
						storage.set('user', vm.username)
						$location.path('/chat');
					});


				}else{
					toaster.error('Erreur :(', response.data);
				}
					
			});

	}

  };

})();