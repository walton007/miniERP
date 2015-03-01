'use strict';

angular.module('mean.systemsetting').controller('BinSettingController', ['$scope', '$log', 'Systemsetting',
  'Bins', 'Warehouses', '$modal',
  function($scope, $log, Systemsetting, Bins, Warehouses, $modal) {
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

    $scope.numberPattern = /^[0-9]*[.]?[0-9]*$/;

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
        cellTemplate: '<button class="btn btn-info" ng-click="openEditDialog()"><i class="glyphicon glyphicon-edit"></i></button>'
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

    $scope.openEditDialog = function() {
      var obj = this.row.entity;
      var rowIndex = this.row.rowIndex
      var modalInstance = $modal.open({
        templateUrl: 'EditBinDialog.html',
        controller: 'EditBinController',
        size: 'lg',
        resolve: {
          editBin: function() {
            return angular.copy(obj);
          },
          warehouses: function() {
            return angular.copy($scope.warehouses);
          },
          $modal: function() {
            return $modal;
          }
        }
      });
      modalInstance.result.then(function(updateBin) {
        angular.extend($scope.bins[rowIndex], updateBin);
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

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
        }, function(errObj) {
          bootbox.alert('创建失败！错误原因：'+ errObj.data.error);
        });
      } else {
        $scope.submitted = true;
      }
    };
  }
]).controller('EditBinController', function($scope, $modalInstance, editBin, warehouses, $modal) {


  $scope.warehouses = warehouses;
  for (var i = warehouses.length - 1; i >= 0; i--) {
    if (warehouses[i]._id === editBin.warehouse) {
      $scope.warehouseSelected = warehouses[i];
      break;
    }
  };

  $scope.editBin =   $.extend(editBin, {comment: ''});
  $scope.numberPattern = /^[0-9]*[.]?[0-9]*$/;
  
  $scope.updateBin = function(isValid) {
    if (isValid) {
      bootbox.confirm("你确定更新煤堆信息吗？老的数据不会再保留！", 
        function(confirm) {
          if (confirm) {
            $scope.editBin.$update(function(updateBinObj) {
              // console.log('updateBinObj:', updateBinObj);
              $modalInstance.close(updateBinObj);
            }, function(errObj) {
              bootbox.alert('更新失败！错误原因：'+ errObj.data.error);
            });
          } else {
            $modalInstance.dismiss();
          }
        });
    } else {
      $scope.submitted = true;
    }
  };
  $scope.dismisse = function() {
    $modalInstance.dismiss();
  }

});