'use strict';

angular.module('mean.coal').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('coal example page', {
      url: '/coal/example',
      templateUrl: 'coal/views/index.html'
    });
  }
]);
