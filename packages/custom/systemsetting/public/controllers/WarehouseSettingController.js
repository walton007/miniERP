'use strict';

angular.module('mean.systemsetting').controller('WarehouseSettingController', ['$scope', 'Global', 'Systemsetting',
'Warehouses',  function($scope, Global, Systemsetting, Warehouses, Minerals ) {

      $scope.getInitData = function() {
        $scope.warehouses = [];
        Warehouses.query(function(warehouses) {
          $scope.warehouses = warehouses;
          
        });
      };

      //object functions
      $scope.gridOptions = {
        data: 'warehouses',
        multiSelect: false,
        // rowHeight: 50,
        columnDefs: [{field:'name', displayName:'矿场名称'}, 
          {field:'comment', displayName:'备注', enableCellEdit: true},
          {field:'', width: 'auto', cellTemplate: '<button class="btn btn-danger" ng-click="delete()"><i class="glyphicon glyphicon-trash"></i></button>'}]
      };

      $scope.delete = function() {
        var index = this.row.rowIndex;
        var obj = this.row.entity;
        $scope.gridOptions.selectItem(index, false);
        obj.$delete(function() {
          $scope.warehouses.splice(index, 1);
        });
      };

      $scope.$on('ngGridEventEndCellEdit', function(evt){
            // Detect changes and send entity to REST server 
            var obj = evt.targetScope.row.entity;
            obj.$update(function() { 
            });
         });

      $scope.create = function(isValid) {

        if (isValid) {
          var obj = new Warehouses({
            name: this.name,
            comment: this.comment
          });
          obj.$save(function(newResource) {
            //$location.path('articles/' + response._id);
            $scope.warehouses.push(newResource);
            $scope.name = '';
            $scope.comment = '';
          });
        } else {
          $scope.submitted = true;
        }
      };

    
    }
  ]);