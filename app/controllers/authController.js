

/**
 * Main application controller
 *
 * nN globals are left behind.
 * 
 */
;(function() {

  'use strict';


  angular
    .module('chat')
	.controller('AuthController',AuthController);


  AuthController.$inject = ['$scope','$http','$location','socket', 'QueryFactory','storage', 'toaster', 'URLS'];

  
  function AuthController($scope,$http,$location, socket, QueryFactory, storage, toaster, URLS) {

		/**
		 * Virtual Model (scope)
		 */
		var vm = this;


		vm.signin = signin;
		vm.logout = logout;
		vm.signup = signup;
		vm.user = storage.get('user');

		/*socket.on('connect', function () {
			console.log('connected');		//verify if an user is connected
			socket.emit('self:join', {roomName: 'hot...'}, function(data){
					console.log(data);		//verify if an user is connected
			});
		});*/

		
	
		/**
		 * Signin User
		 */
		function signin(){

			QueryFactory
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
			
			QueryFactory
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

			QueryFactory
			.query('POST', 'signup', {username: vm.username, password: vm.password, password2: vm.confirmation})
			.then(function(response){

				if (response.data === 'success') {
					toaster.success( 'Great!',  "Votre compte a bien été crée");

					QueryFactory
					.query('POST', 'connect', {'username': vm.username, password: vm.password})
					.then(function(response){
						console.log('Vous êtes maintenant inscris !', response);
						console.log(socket);
						vm.signupFormDatas = {};
						socket.emit('init', {});
						storage.set('user', vm.username)
						$location.path('/chat');
					});

				}
				else{
					toaster.error('Erreur :(', response.data);
				}
					
			});

	}

  };

})();