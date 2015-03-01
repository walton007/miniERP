'use strict';

angular.module('mean.systemsetting').controller('ChangelogController', ['$scope', 'BinChangelogs',
    '$modal',
  function($scope, BinChangelogs, $modal) {
    
    function getPagedDataAsync() {
        BinChangelogs.query({pageNumber:$scope.pagingOptions.currentPage, pageSize: $scope.pagingOptions.pageSize}, function(data) {
          $scope.binChangelogs = data.paginatedResults;    
          $scope.totalServerItems = data.itemCount;     
        }); 
    };

    $scope.getInitData = function() {
      $scope.binChangelogs = [];
      getPagedDataAsync();
    };

    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1
    };  

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          getPagedDataAsync();
        }
    }, true);

    $scope.binChangelogGridOptions = {
      data: 'binChangelogs',
      multiSelect: false,
      enablePaging: true,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      // rowHeight: 50,
      columnDefs: [{
        field: 'name',
        displayName: '煤堆名称',
        width: '120',
      }, {
        field: 'warehouseName',
        displayName: '所属煤场'
      }, {
        field: 'comment',
        displayName: '备注'
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
        cellTemplate: '<button class="btn btn-info"><i class="glyphicon glyphicon-edit"></i></button>'
      }]
    };

  }
]);