'use strict';

angular.module('mean.systemsetting').controller('BinSettingController', ['$scope', 'Systemsetting',
  'Bins', 'Warehouses', '$modal',
  function($scope, Systemsetting, Bins, Warehouses, $modal) {
    $scope.getInitData = function() {
      $scope.bins = [];
      Bins.query(function(bins) {
        $scope.bins = bins;
      });

      Warehouses.query(function(warehouses) {
        $scope.warehouses = warehouses;
        if (warehouses.length) {
          $scope.warehouseSelected = warehouses[0];
        };
      });
    };
 
    $scope.gridOptions = {
      data: 'bins',
      multiSelect: false,
      // rowHeight: 50,
      columnDefs: [{
        field: 'name',
        displayName: '煤堆名称',
        width: '120',
      }, {
        field: 'warehouseName',
        displayName: '所属煤场'
      }, {
        field: 'weight',
        displayName: '重量'
      }, {
        field: 'chemicalAttrs.power',
        displayName: '热值'
      }, {
        field: 'chemicalAttrs.nitrogen',
        displayName: 'nitrogen值',
        width: '100',
      }, {
        field: '',
        width: 'auto',
        cellTemplate: '<button class="btn btn-danger" ng-click="delete()"><i class="glyphicon glyphicon-trash"></i></button>'
      }]
    };

    $scope.delete = function() {
      var index = this.row.rowIndex;
      var obj = this.row.entity;
      $scope.gridOptions.selectItem(index, false);
      obj.$delete(function() {
        $scope.obj.splice(index, 1);
      });
    };

    $scope.$on('ngGridEventEndCellEdit', function(evt) {
      // Detect changes and send entity to REST server
      // console.log('evt.targetScope.row.entity:', evt.targetScope.row.entity);
      var mineral = evt.targetScope.row.entity;
      mineral.$update(function() {
        // $location.path('articles/' + article._id);
      });
    });

    $scope.create = function(isValid) {

      if (isValid) {
        var obj = new Bins({
          name: this.name,
          warehouseId: this.warehouseSelected._id,
          weight: this.weight,
          chemicalAttrs: {
            nitrogen: this.nitrogen,
            power: this.power,
          }
        });
        obj.$save(function(newResource) {
          $scope.bins.push(newResource);
          $scope.name = '';
          $scope.weight = '';
          $scope.power = '';
          $scope.nitrogen = '';
        });
      } else {
        $scope.submitted = true;
      }
    };


    // $scope.tryopen = function() {
    //   // $modal.open();
    //   $modal.open({
    //     templateUrl: 'OperationDialog.html',
    //     controller: 'C_add_Warn',
    //     resolve: {
    //       header: function() {
    //         return angular.copy('新增');
    //       },
    //       msg: function() {
    //         return angular.copy('这是消息');
    //       }
    //     }
    //   });
    // };
  }
]);

// .controller('C_add_Warn', function($scope, header, msg) {
//   $scope.header = header;
//   $scope.msg = msg;
// });