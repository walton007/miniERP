'use strict';

angular.module('mean.coal').controller('GoodIssueController', ['$scope', 'GoodIssues',
    'BasicBins', 'GlobalSetting',
  function($scope, GoodIssues, BasicBins, GlobalSetting) {
    function alertErrMsg(error) {
      var errMsg = ' 输入失败！错误原因：'+ error
      if ('notEnoughWeight' === error) {
        errMsg = '库存不足！请重新输入！';
      };
      
      bootbox.alert(errMsg);
    }
    
    function getPagedDataAsync() {
        GoodIssues.query({status:'planning', pageNumber:$scope.pagingOptions.currentPage, pageSize: $scope.pagingOptions.pageSize}, function(data) {
          $scope.goodIssues = data.paginatedResults;    
          $scope.totalServerItems = data.itemCount;     
        }); 
    };

    $scope.getInitData = function() {
      $scope.goodIssues = [];
      getPagedDataAsync();

      //get bins
      BasicBins.query(function(bins) {
        $scope.bins = bins;
        if (bins.length) {
          $scope.binSelected = bins[0];
        };
        
      });
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
      i18n: 'zh-cn',
      multiSelect: false,
      enablePaging: true,
      showFooter: true,
      enableColumnResize: true,
      enableColumnReordering:true,
      enableHighlighting:true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      // rowHeight: 50,
      columnDefs: [{
        field: 'issueDate',
        displayName: '日期',
        width: '180',
        cellFilter: 'date:"medium"'
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
        field: 'editActualWeight',
        displayName: '实际用煤重量',
        enableCellEdit: true,
        cellClass: 'minierp-editable'
      }, {
        displayName: '操作员',
        field: 'creatorName'
      }, {
        displayName: '状态',
        field: 'status',
        cellFilter: 'goodIssueStatusFilter' 
      }]
    };

    $scope.$on('ngGridEventEndCellEdit', function(event) {
        var gi = event.targetScope.row.entity;
        var actualWeight = parseFloat(gi.editActualWeight);
        if (!actualWeight) {
          $scope.$apply(function() {
            gi.editActualWeight = '';
          });
        } else {
          // gi.actualWeight = actualWeight;
          GoodIssues.update({_id: gi._id, actualWeight: actualWeight},
            function(updateObj) {
              gi.status = updateObj.status;
              bootbox.alert('输入成功！');

              for (var i = $scope.goodIssues.length - 1; i >= 0; i--) {
                if ($scope.goodIssues[i]._id === updateObj._id) {
                  // $scope.goodIssues.slice(i, i+1);
                  $scope.goodIssues.splice(i, 1);
                  break;
                }
              };
            },
            function(errObj) {
              alertErrMsg(errObj.data.error);
            });
        }
    });
  }
]);