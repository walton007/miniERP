'use strict';

angular.module('mean.systemsetting').controller('SystemsettingController', ['$scope', 'Global', 'Systemsetting', '$modal',
  function($scope, Global, Systemsetting, $modal) {
    $scope.global = Global;
    $scope.package = {
      name: 'systemsetting'
    };
 
	    $scope.myData = [{name: 'Moroni', age: 50},
	    	{name: 'Tiancum', age: 43},
	    	{name: 'walton', age: 43}];
	    $scope.gridOptions = { data: 'myData' };

      $scope.tryopen = function() {
        // $modal.open();
        var newWarn = $modal.open({
          templateUrl: 'OperationDialog.html',
          controller: 'C_add_Warn',
          resolve:{
            header : function() { return angular.copy("新增"); },
            msg : function() { return angular.copy("这是消息"); }
         }
        });
      }
  }
])
.controller('C_add_Warn',function($scope,header,msg){
        $scope.header = header;
        $scope.msg = msg;
});

 