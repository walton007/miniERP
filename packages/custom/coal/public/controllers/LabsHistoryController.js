'use strict';

angular.module('mean.coal').controller('LabsHistoryController', ['$scope', 'GoodReceipts',
      '$modal',
  function($scope, GoodReceipts, $modal) {
    
    function getPagedDataAsync() {
        GoodReceipts.query({status:'all', pageNumber:$scope.pagingOptions.currentPage, pageSize: $scope.pagingOptions.pageSize}, function(data) {
          $scope.goodReceipts = data.paginatedResults;    
          $scope.totalServerItems = data.itemCount;     
        }); 
    };

    $scope.getInitData = function() {
        $scope.goodReceipts = [];
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

    $scope.selection = [];
    $scope.goodReceiptGridOptions = {
      data: 'goodReceipts',
      selectedItems: $scope.selection,
      multiSelect: false,
      enablePaging: true,

      showFooter: true,
      i18n: 'zh-cn',
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      // rowHeight: 50,
      columnDefs: [{
        field: 'receiveDate',
        displayName: '日期',
        width: '180',
        cellFilter: 'date:"medium"'  
      }, {
        field: 'sequence',
        displayName: '批次'
      }, {
        field: 'mineralName',
        displayName: '矿源'
      }, {
        field: 'binName',
        displayName: '堆放煤堆'
      }, {
        field: 'weight',
        displayName: '重量'
      }, {
        displayName: '操作员',
        field: 'creatorName'
      }, {
        displayName: '状态',
        field: 'status',
        cellFilter: 'goodReceiptStatusFilter' 
      }]
    };
  }
]);