'use strict';

angular.module('mean.system', ['ui.router', 'mean-factory-interceptor'])
  .run(['$rootScope', function($rootScope) {
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

      if (toPath) {
        $rootScope.menuname = toPath;
        console.log('angular.module stateChangeStart toPath:', toPath);
      }

    });
  }])
;
