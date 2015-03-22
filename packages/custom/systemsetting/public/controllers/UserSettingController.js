'use strict';

var rowTemplate = "<div ng-dblclick=\"onDblClickRow(row)\" ng-style=\"{ 'cursor': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\">\r" +
    "\n" +
    "\t<div class=\"ngVerticalBar\" ng-style=\"{height: rowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div>\r" +
    "\n" +
    "\t<div ng-cell></div>\r" +
    "\n" +
    "</div>";
 // '<div ng-dblclick="onDblClickRow(row)" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div><div ng-cell></div></div>',

angular.module('mean.systemsetting').controller('UserSettingController', ['$scope',  
  'Users', 'roleService', '$modal',
  function($scope, Users, roleService, $modal) { 
    $scope.getInitData = function() {
      console.log(111);
      Users.query({}, function(users) {
        console.log('222 users:', users);
        $scope.users = users;
      });
    };
    $scope.editMode = false;
    $scope.users = [];
    $scope.roles = roleService.asArray();
    
    $scope.roleSelected = $scope.roles[0]; 

    $scope.gridOptions = {
      data: 'users',
      multiSelect: false,
      // rowHeight: 50,
      rowTemplate:rowTemplate,
      i18n: 'zh-cn',
      columnDefs: [{
        field: 'username',
        displayName: '用户名称',
        width: '120',
      }, {
        field: 'name',
        displayName: '昵称'
      }, {
        field: 'roles',
        displayName: '角色',
        cellFilter: 'roleTranslate'
      }]
    };

    $scope.chooseRole = function(role) {
      for (var i = $scope.roles.length - 1; i >= 0; i--) {
        if ($scope.roles[i].role === role) {
          $scope.roleSelected = $scope.roles[i];
          break;
        }
      };

    }

    $scope.onDblClickRow = function(rowItem) {
      $scope.selectedUser = rowItem.entity;
      $scope.editMode = true;
      $scope.name = $scope.selectedUser.name;
      $scope.username = $scope.selectedUser.username;
      $scope.chooseRole($scope.selectedUser.roles[0]);
      // console.log('rowItem:', rowItem);
    };
  
    $scope.create = function(isValid) {
      if (isValid && $scope.password !== $scope.confirmPassword) {
        $scope.submitted = true;
        $scope.passwordNoEqualErr = true;
        return;
      }

      if (isValid) {
        var obj = new Users({
            // email: $scope.email,
            name: $scope.name,
            username: $scope.username,
            password: $scope.password,
            confirmPassword: $scope.confirmPassword,
            roles: [$scope.roleSelected.role]
        });
        obj.$save(function(newResource) {
          $scope.users.push(newResource);
          $scope.name = $scope.username = $scope.email = $scope.password = $scope.confirmPassword = '';
        }, function(errObj) {
          bootbox.alert('创建失败！错误原因：'+ errObj.data.error);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.update = function() {
      $scope.editMode = false;
      var hasUpdate = false;
      if ($scope.selectedUser.roles[0] !== $scope.roleSelected.role) {
        hasUpdate = true;
        $scope.selectedUser.roles.pop();
        $scope.selectedUser.roles.push($scope.roleSelected.role);
      }
      if (!!$scope.resetPassword) {
        hasUpdate = true;
        $scope.selectedUser.password = $scope.resetPassword;
      }
      if (hasUpdate) {
        $scope.selectedUser.$update({}, function(updateObj) {
          console.log('update success:', updateObj);
        }, function(err) {
          console.log('err:', err);
        });
      };
    };

    $scope.back = function() {
      $scope.editMode = false;
    };
  }
]);