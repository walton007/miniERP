'use strict';

angular.module('mean.systemsetting').controller('SystemsettingController', ['$scope', 'Global', 'Systemsetting',
  function($scope, Global, Systemsetting) {
    $scope.global = Global;
    $scope.package = {
      name: 'systemsetting'
    };
  }
]);
