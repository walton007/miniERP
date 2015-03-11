'use strict';

angular.module('mean.systemsetting').controller('QualitySettingController', ['$scope', 'Global',  
'CoalQualities',  
    function($scope, Global, CoalQualities) {
      $scope.getInitData = function() {
        $scope.coalQualities = [];
        CoalQualities.query(function(coalQualities) {
          $scope.coalQualities = coalQualities;
          if (coalQualities.length) {
            $scope.qualitySelected = coalQualities[0];
          };
        });
      };

      $scope.$on('ngGridEventEndCellEdit', function(evt){
            // Detect changes and send entity to REST server
            console.log('evt.targetScope.row.entity:', evt.targetScope.row.entity);
            var obj = evt.targetScope.row.entity;
            obj.$update(function() {
              // $location.path('articles/' + article._id);
            }, function(errResp) {
              console.warn(errResp);
              alert('errResp', errResp);

            });
         });

      //coal quality functions
      $scope.qualityGridOptions = {
        data: 'coalQualities',
        i18n: 'zh-cn',
        columnDefs: [{field:'name', displayName:'媒质名称'}, 
          {field:'comment', displayName:'备注', enableCellEdit: true},
          {field:'', width: 'auto', cellTemplate: '<button class="btn btn-danger" ng-click="delete()"><i class="glyphicon glyphicon-trash"></i></button>'}]
      };

      $scope.delete = function() {
        var index = this.row.rowIndex;
        var obj = this.row.entity;
        $scope.qualityGridOptions.selectItem(index, false);
        obj.$delete(function() {
          $scope.coalQualities.splice(index, 1);
        });
      };

      $scope.createQuality = function(isValid) {
        if (isValid) {
          var quality = new CoalQualities({
            name: this.qualityname,
            comment: this.qualitycomment
          });
          quality.$save(function(response) {
            $scope.coalQualities.push(response); 

            $scope.qualityname = '';
            $scope.qualitycomment = ''; 
          });
        } else {
          $scope.submitted = true;
        }
      };

    }
  ]);