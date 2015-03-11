'use strict';

angular.module('mean.coal').controller('GoodIssueController', ['$scope', 'GoodIssues',
    'BasicBins', 'GlobalSetting',
  function($scope, GoodIssues, BasicBins, GlobalSetting) {
    
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
        enableCellEdit: true
      }, {
        displayName: '操作员',
        field: 'creatorName'
      }, {
        displayName: '状态',
        field: 'status',
        cellFilter: 'goodIssueStatusFilter' 
      }]
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var obj = new GoodIssues({
          issueDate: this.dt,
          binid: this.binSelected._id,
          weight: this.weight
        });
        obj.$save(function(newResource) {
          $scope.goodIssues.push(newResource);
          $scope.weight = '';
        }, function(errObj) {
          bootbox.alert('创建失败！错误原因：'+ errObj.data.error);
        });
        $scope.submitted = false;
      } else {
        $scope.submitted = true;
      }
    };

    $scope.$on('ngGridEventEndCellEdit', function(event) {
        var gi = event.targetScope.row.entity;
        var actualWeight = parseFloat(gi.editActualWeight);
        if (!actualWeight) {
          gi.editActualWeight = '';
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
            });
        }
    });

    // date control actions
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
    $scope.format = GlobalSetting.dateFormat;
    $scope.dateOptions = GlobalSetting.dateOptions;
    $scope.minDate = GlobalSetting.minDate; 
    $scope.maxDate = GlobalSetting.maxDate;
  }
]);