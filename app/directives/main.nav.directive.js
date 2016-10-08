;(function() {

  'use strict';

  /**
   * Main navigation, just a HTML template
   * @author Jozef Butko
   * @ngdoc  Directive
   *
   * @example
   * <main-nav><main-nav/>
   *
   */
  angular
    .module('chat')
    .directive('mainNav', MainNav);
    
  MainNav.$inject = ['$location','storage'];


  function MainNav($location, storage) {

    // Definition of directive
    var directiveDefinitionObject = {
      restrict: 'E',
      templateUrl: 'app/directives/main-nav.html',
      link: function (scope, element, attrs) {
          scope.logout = function() {
            storage.remove('user')
            $location.path("/signin");
            scope.user = null;
          };
          scope.user = storage.get('user');
      }
    };

    return directiveDefinitionObject;
  }

})();