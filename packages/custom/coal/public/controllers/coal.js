'use strict';

angular.module('mean.coal').controller('CoalController', ['$scope', 'Global', 'Coal',
  function($scope, Global, Coal) {
    $scope.global = Global;
    $scope.package = {
      name: 'coal'
    };
  }
]);
