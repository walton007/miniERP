'use strict';

angular.module('mean.systemsetting').controller('SystemsettingController', ['$scope', 'Global', 'Systemsetting',
  function($scope, Global, Systemsetting) {
    $scope.global = Global;
    $scope.package = {
      name: 'systemsetting'
    };
 
	    $scope.myData = [{name: 'Moroni', age: 50},
	    	{name: 'Tiancum', age: 43},
	    	{name: 'walton', age: 43}];
	    $scope.gridOptions = { data: 'myData' };
  }
]);

 