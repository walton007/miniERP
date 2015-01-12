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
  var defer = queryMenu('main', defaultMainMenu);
  console.log('defer:', defer);

  $scope.isCollapsed = false;

  $rootScope.$on('loggedin', function() {

    queryMenu('main', defaultMainMenu);

    $scope.global = {
      authenticated: !!$rootScope.user,
      user: $rootScope.user
    };
  });

  $rootScope.$watch('menuname', function(newVal, oldVal) {
    console.log('!!watch menuname:', newVal, oldVal, Global.menu);
    if (newVal.indexOf('.') > 0) {
      return;
    } else if (Global.menu) {
      for (var i = 0; i < Global.menu.length; i = i + 1) {
        var currentMenu = (Global.menu[i]);
        if (newVal === currentMenu.link) {
          $rootScope.currentMenu = currentMenu;
          console.log('$rootScope.currentMenu:', currentMenu);

          //handle submenu
          for (var j = 0; j < currentMenu.submenus.length; j = j + 1) {
            var submenu = currentMenu.submenus[j];
            if (submenu.isdefault) {
              console.log('goto submenu:', submenu.link);
              $stateProvider.go(submenu.link);
              break;
            }
          }

          break;
        }
      }
    }
  });
}]);