'use strict';

angular.module('mean.systemsetting').controller('BinDashboardController', ['$scope', '$log', 
  'Bins', '$modal',
  function($scope, $log,   Bins, Warehouses, $modal) {
    $scope.getInitData = function() {
      $scope.bins = [];
      Bins.query(function(bins) {
        $scope.bins = bins;
      });
    };

    $scope.gridOptions = {
      data: 'bins',
      multiSelect: false,
      i18n: 'zh-cn',
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
        displayName: '重量',
        cellFilter: 'number:2'
      }, {
        field: 'chemicalAttrs.power',
        displayName: '热值',
        cellFilter: 'number:2'
      }, {
        field: 'chemicalAttrs.nitrogen',
        displayName: 'nitrogen值',
        width: '100',
        cellFilter: 'number:2'
      }]
    };
  }
]);