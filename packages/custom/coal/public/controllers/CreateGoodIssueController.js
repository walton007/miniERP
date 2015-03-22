'use strict';

angular.module('mean.coal').controller('CreateGoodIssueController', ['$scope', 'GoodIssues',
    'BasicBins', 'GlobalSetting',
  function($scope, GoodIssues, BasicBins, GlobalSetting) {
    function alertErrMsg(error) {
      var errMsg = ' 输入失败！错误原因：'+ error
      if ('notEnoughWeight' === error) {
        errMsg = '库存不足！请重新输入！';
      };
      
      bootbox.alert(errMsg);
    }

    $scope.getInitData = function() {
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
        var obj = new GoodIssues({
          issueDate: this.dt,
          binid: this.binSelected._id,
          weight: this.weight
        });
        obj.$save(function(newResource) {
          bootbox.alert('创建成功！');
          $scope.weight = '';
        }, function(errObj) {
          alertErrMsg(errObj.data.error);
        });
        $scope.submitted = false;
      } else {
        $scope.submitted = true;
      }
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.format = GlobalSetting.dateFormat;
    $scope.dateOptions = GlobalSetting.dateOptions;
    $scope.minDate = GlobalSetting.minDate(); 
    $scope.maxDate = GlobalSetting.maxDate();

    $scope.dateTm = new Date();
  }
]);