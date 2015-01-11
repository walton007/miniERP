'use strict';

angular.module('mean.coal').controller('CoalController', ['$scope', '$rootScope', 'Global', 'Coal',
  function($scope, $rootScope, Global, Coal) {
    $scope.global = Global;
    $scope.package = {
      name: 'coal'
    };
    // $rootScope.menuname = 'coalmanage';
    console.log('!@ in CoalController');
  }
]);
