'use strict';

angular.module('mean.system', ['ui.router', 'ui.router.stateHelper', 'mean-factory-interceptor'])
  .run(['$rootScope', function($rootScope) {
    $rootScope.numberPattern = /^[0-9]*[.]?[0-9]*$/;

    // console.log('angular.module run', $rootScope);
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      var toPath = toState.url;
      toPath = toPath.replace(new RegExp('/', 'g'), '');
      toPath = toPath.replace(new RegExp(':', 'g'),'-');
      $rootScope.state = toPath;
      console.log('angular.module stateChangeStart', toPath);

      if($rootScope.state === '' ) {
        $rootScope.state = 'firstPage';
      }

      if (toState.name) {
        $rootScope.menuname = toState.name;
        console.log('angular.module stateChangeStart toState.name:', toState.name);
      }

    });
  }])
;
