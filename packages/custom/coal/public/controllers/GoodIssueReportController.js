'use strict';

angular.module('mean.coal').controller('GoodIssueReportController', ['$scope', 'GoodIssues',
      '$modal',
  function($scope, GoodIssues, $modal) {
    
    function getPagedDataAsync() {
        GoodIssues.query({status:'checkedAndoutdated', pageNumber:$scope.pagingOptions.currentPage, pageSize: $scope.pagingOptions.pageSize}, function(data) {
          $scope.goodIssues = data.paginatedResults;    
          $scope.totalServerItems = data.itemCount;     
        }); 
    };

    $scope.getInitData = function() {
      $scope.goodIssues = [];
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

    $scope.gridOptions = {
      data: 'goodIssues',
      multiSelect: false,
      enablePaging: true,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      // rowHeight: 50,
      columnDefs: [{
        field: 'issueDate',
        displayName: '日期',
        width: '180'
      }, {
        field: 'sequence',
        displayName: '批次'
      }, {
        field: 'binName',
        displayName: '堆放煤堆'
      }, {
        field: 'planWeight',
        displayName: '计划用煤重量'
      }, {
        field: 'acturalWeight',
        displayName: '实际用煤重量'
      }, {
        displayName: '操作员',
        field: 'creatorName'
      }, {
        displayName: '状态',
        field: 'status'
      }, {
        displayName: '',
        cellTemplate: " <span data-ng-show='row.entity.warnflag' class='icon-warning-sign text-warn'>   </span>  "
      }]
    };
  }
]);