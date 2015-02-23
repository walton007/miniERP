'use strict';

angular.module('mean.systemsetting').controller('MineralSettingController', ['$scope', 'Systemsetting',
  'Minerals', 'CoalQualities', '$modal',
  function($scope, Systemsetting, Minerals, CoalQualities, $modal) {
    // $scope.coalQualities = [];
    $scope.getInitData = function() {
      $scope.coalQualities = [];
      CoalQualities.query(function(coalQualities) {
        $scope.coalQualities = coalQualities;
        if (coalQualities.length) {
          $scope.qualitySelected = coalQualities[0];
        };
      });

      Minerals.query(function(minerals) {
        $scope.minerals = minerals;
      });
    };

    //mineral functions
    $scope.mineralGridOptions = {
      data: 'minerals',
      multiSelect: false,
      // rowHeight: 50,
      columnDefs: [{
        field: 'name',
        displayName: '矿源名称'
      }, {
        field: 'comment',
        displayName: '备注',
        enableCellEdit: true
      }, {
        field: 'qualityName',
        displayName: '媒质'
      }, {
        field: '',
        width: 'auto',
        cellTemplate: '<button class="btn btn-danger" ng-click="deleteMineral()"><i class="glyphicon glyphicon-trash"></i></button>'
      }]
    };

    $scope.deleteMineral = function() {
      var index = this.row.rowIndex;
      var mineral = this.row.entity;
      $scope.mineralGridOptions.selectItem(index, false);
      mineral.$delete(function() {
        $scope.minerals.splice(index, 1);
      });
    };

    $scope.$on('ngGridEventEndCellEdit', function(evt) {
      // Detect changes and send entity to REST server
      console.log('evt.targetScope.row.entity:', evt.targetScope.row.entity);
      var mineral = evt.targetScope.row.entity;
      mineral.$update(function() {
        // $location.path('articles/' + article._id);
      });
    });

    $scope.createMineral = function(isValid) {

      if (isValid) {
        var mineral = new Minerals({
          name: this.name,
          comment: this.comment,
          qualityid: this.qualitySelected._id
        });
        mineral.$save(function(newResource) {
          //$location.path('articles/' + response._id);
          $scope.minerals.push(newResource);
          $scope.name = '';
          $scope.comment = '';
        });
      } else {
        $scope.submitted = true;
      }
    };


    // $scope.tryopen = function() {
    //   // $modal.open();
    //   $modal.open({
    //     templateUrl: 'OperationDialog.html',
    //     controller: 'C_add_Warn',
    //     resolve: {
    //       header: function() {
    //         return angular.copy('新增');
    //       },
    //       msg: function() {
    //         return angular.copy('这是消息');
    //       }
    //     }
    //   });
    // };
  }
]);

// .controller('C_add_Warn', function($scope, header, msg) {
//   $scope.header = header;
//   $scope.msg = msg;
// });