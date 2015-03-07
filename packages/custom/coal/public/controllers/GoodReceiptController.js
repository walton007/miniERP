'use strict';

angular.module('mean.coal').controller('GoodReceiptController', ['$scope', 'GoodReceipts',
    'BasicBins', 'Minerals', '$modal',
  function($scope, GoodReceipts, BasicBins, Minerals, $modal) {
    
    function getPagedDataAsync() {
        GoodReceipts.query({status:'all', pageNumber:$scope.pagingOptions.currentPage, pageSize: $scope.pagingOptions.pageSize}, function(data) {
          $scope.goodReceipts = data.paginatedResults;    
          $scope.totalServerItems = data.itemCount;     
        }); 
    };

    $scope.getInitData = function() {
      $scope.goodReceipts = [];
      getPagedDataAsync();

      //get minerals
      Minerals.query(function(minerals) {
        $scope.minerals = minerals;
        if (minerals.length) {
          $scope.mineralSelected = minerals[0];
        };
      });

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

    $scope.goodReceiptGridOptions = {
      data: 'goodReceipts',
      multiSelect: false,
      enablePaging: true,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      // rowHeight: 50,
      columnDefs: [{
        field: 'receiveDate',
        displayName: '日期',
        width: '180'
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
        field: 'status'
      }]
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var obj = new GoodReceipts({
          receiveDate: this.dt,
          binid: this.binSelected._id,
          mineralid: this.mineralSelected._id,
          weight: this.weight,
          inputChemicalAttrs: {
            nitrogen: this.nitrogen,
            power: this.power,
          }
        });
        obj.$save(function(newResource) {
          $scope.goodReceipts.push(newResource);
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

    // date control actions
    $scope.today = function() {
      return new Date();
    };
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
    $scope.format = 'yyyy/MM/dd';
    $scope.dt = new Date();
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
    $scope.minDate = new Date($scope.today() - 3*24 * 60 * 60 * 1000); 
    $scope.maxDate = new Date($scope.today() + 24 * 60 * 60 * 1000);  

     

  }
]);