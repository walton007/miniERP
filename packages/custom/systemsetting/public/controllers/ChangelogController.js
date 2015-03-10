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

    function getCellTemplate(field) {
      var changeFlag = 'row.entity.prevBin.FIELD !== row.entity.FIELD';
      var cellTemplate = "<div class = 'text-info' > <span data-ng-show='changeFlag'>{{row.entity.prevBin.FIELD}} /</span> <span ng-class='{\"text-danger\": changeFlag}'> {{row.entity.FIELD}} </span> </div>".replace(/changeFlag/g, changeFlag);
      return cellTemplate.replace(/FIELD/g, field);
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
        field: 'created',
        displayName: '修改时间',
        width: '180'
      }, {
        field: 'warehouseName',
        displayName: '所属煤场'
      }, {
        field: 'comment',
        displayName: '备注'
      }, {
        displayName: '重量',
        width: '120',
        cellTemplate: getCellTemplate('weight')
      }, {
        displayName: '热值',
        width: '120',
        cellTemplate: getCellTemplate('chemicalAttrs.power')
      }, {
        displayName: 'nitrogen值',
        width: '120',
        cellTemplate: getCellTemplate('chemicalAttrs.nitrogen')
      }]
    };

  }
]);