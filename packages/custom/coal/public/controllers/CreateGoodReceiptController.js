'use strict';

angular.module('mean.coal').controller('CreateGoodReceiptController', ['$scope', 'GoodReceipts',
    'BasicBins', 'Minerals',  'GlobalSetting', '$log',
  function($scope, GoodReceipts, BasicBins, Minerals, GlobalSetting, $log) {
    $scope.getInitData = function() {
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

    $scope.create = function(isValid) {
      if (isValid) {
        this.dt.setHours(this.dateTm.getHours());
        this.dt.setMinutes(this.dateTm.getMinutes());
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
          bootbox.alert('创建成功！');
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
    
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.format = GlobalSetting.dataFormat;
    $scope.minDate = GlobalSetting.minDate(); 
    $scope.maxDate = GlobalSetting.maxDate();
    $scope.dateOptions = GlobalSetting.dateOptions;

    $scope.dateTm = new Date();
  }
]);
