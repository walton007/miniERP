'use strict';

angular.module('mean.systemsetting').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('systemsetting example page', {
      url: '/systemsetting/example',
      templateUrl: 'systemsetting/views/index.html'
    });
  }
]);
