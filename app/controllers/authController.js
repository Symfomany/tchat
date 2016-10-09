/**
 * Auth controller to handle login, logout etc ...
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

	
		/**
		 * Signin User with 
		 */
		function signin(){

			socket.emit('signin', {username: vm.username, password: vm.password});
			
			socket.on('signin:error',function(data){
				toaster.error('Erreur :(', data.message);
			});

			socket.on('signin:success',function(data){
				storage.set('user', data)
				toaster.success( 'Great!',  "Bienvenue " + data.username);
				//$rootScope.$apply() 
				$location.path('/chat');
			});
			

			/*
			* With QueryFactory & app Heroku http://caty.herokuapp.com/ 
			*
			QueryFactory
			.query('POST', 'connect',{username: vm.username, password: vm.password})
			.then(function(response){
				if (response.data === 'success') {
					toaster.success( 'Great!',  "Bienvenue " + vm.userName);
					storage.set('user', vm.username)
					vm.user = vm.username;
					$location.path('/chat');
				}else{
					toaster.error('Mauvais Login/ Mdp', response.data);
				}
			});
			*/
			
		}



		/**
		 * Logout User
		 */
		function logout () {
			storage.remove('user')
			$scope.user = null;
			$location.path('/signin');
			
			/*	
			* With QueryFactory & app Heroku http://caty.herokuapp.com/ 
			*
			QueryFactory
			.query('GET', 'disconnect')
			.then(function(response){
				storage.remove('user')
				$location.path('/signin');
			});
			*/
			
		};



		/**
		 * Signup an user && AUtologin
		 */
		function signup(isValid) {

			socket.emit('signup', {username: vm.username, password: vm.password});
			
			socket.on('signup:error',function(data){
				toaster.error('Erreur :(', data.message);
			});

			socket.on('signup:success',function(data){
				toaster.success( 'Great!',  "Bienvenue " + data.username);
				storage.set('user', data)
				$location.path('/chat');
			});
			

			/*
			* With QueryFactory & app Heroku http://caty.herokuapp.com/ 
			*
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
			*/

	}




}; //end controlleur

})();