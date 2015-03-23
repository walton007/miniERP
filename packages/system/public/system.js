'use strict';

angular.module('mean.system', ['ui.router', 'ui.router.stateHelper', 'mean-factory-interceptor'])
  .run(['$rootScope', '$location', 'roleService', function($rootScope, $location, roleService) {
    $rootScope.numberPattern = /^[0-9]*[.]?[0-9]*$/;

    console.log('angular.module run', $rootScope);
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      // var toPath = toState.url;
      // toPath = toPath.replace(new RegExp('/', 'g'), '');
      // toPath = toPath.replace(new RegExp(':', 'g'),'-');
      // $rootScope.state = toPath;
     
      // $rootScope.curState = toState;
      $rootScope.curStateLink = toState.name;
    });

    console.log('roleService: ', roleService);

    if ($location.$$path !== '/auth/register' && $location.$$path !== '/auth/login') {
      $location.url(roleService.getDefaultUrl());
    }
  }])
;
