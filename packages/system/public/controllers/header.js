'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus',
   '$state',
  function($scope, $rootScope, Global, Menus, $stateProvider) {
    $scope.global = Global;
    $scope.menus = {};

    // Default hard coded menu items for main menu
    var defaultMainMenu = [];

    // Query menus added by modules. Only returns menus that user is allowed to see.
    function queryMenu(name, defaultMenu) {

      Menus.query({
        name: name,
        defaultMenu: defaultMenu
      }, function(menu) {
        $scope.menus[name] = menu;
        
        Global.menu = menu;

        $stateProvider.go(menu[0].link);
        
      });
    }

    // Query server for menus and check permissions
    queryMenu('main', defaultMainMenu);

    $scope.isCollapsed = false;

    $rootScope.$on('loggedin', function() {

      queryMenu('main', defaultMainMenu);

      $scope.global = {
        authenticated: !! $rootScope.user,
        user: $rootScope.user
      };
    });

    $rootScope.$watch('menuname', function(newVal, oldVal) {
      console.log('!!watch menuname:', newVal, oldVal, Global.menu);
      if (Global.menu) {
        for (var i = 0; i < Global.menu.length; i = i+1) {  
            var menu = (Global.menu[i]);  
            console.log('!!menu.link ', menu.link, newVal.indexOf(menu.link));
            if (newVal.indexOf(menu.link) >= 0) {
              $rootScope.currentMenu = menu;
              console.log('$rootScope.currentMenu:', menu);
              break;
            }
        }  
      }
    });

  }
]);
