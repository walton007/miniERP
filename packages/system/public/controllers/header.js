'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus',
'$state',
function($scope, $rootScope, Global, Menus, $stateProvider) {
  $scope.global = Global;
  $scope.menus = {main: window.menus};
  $scope.mainMenus =  window.menus;

  // Default hard coded menu items for main menu
  var defaultMainMenu = [];

  // Query menus added by modules. Only returns menus that user is allowed to see.
  function queryMenu(name, defaultMenu) {

    Menus.query({
      name: name,
      defaultMenu: defaultMenu
    }, function(menu) {
      console.log('queryMenu in HeaderController menu:', menu);
      $scope.menus[name] = menu;

      Global.menu = menu;
      $scope.mainMenus = menu;

      //$stateProvider.go(menu[0].link);
      for (var i = 0; i < Global.menu.length; i = i + 1) {
        var submenu = (Global.menu[i]);
        if (submenu.isdefault) {
          $stateProvider.go(submenu.link);
          console.log('goto:', submenu.link);
          break;
        }
      }

    });
  }

  // Query server for menus and check permissions
  // var defer = queryMenu('main', defaultMainMenu);
  // console.log('defer:', defer);

  // $scope.isCollapsed = false;
  // $scope.curStateLink = "helo";

  $rootScope.$on('loggedin', function() {

    queryMenu('main', defaultMainMenu);

    $scope.global = {
      authenticated: !!$rootScope.user,
      user: $rootScope.user
    };
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      // var toPath = toState.url;
      // toPath = toPath.replace(new RegExp('/', 'g'), '');
      // toPath = toPath.replace(new RegExp(':', 'g'),'-');
      // $rootScope.state = toPath;
     
      // $scope.curState = toState;
      // $scope.curStateLink = toState.name;
      // $scope.apply(function() {
      //   $scope.curStateLink = toState.name;
      // });

       console.log('angular.module toState in HeaderController', toState);

    });
}]);