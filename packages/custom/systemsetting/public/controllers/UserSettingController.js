'use strict';

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
    $scope.users = [];
    $scope.roles = roleService.asArray();
    
    $scope.roleSelected = $scope.roles[0]; 

    $scope.gridOptions = {
      data: 'users',
      multiSelect: false,
      // rowHeight: 50,
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
  }
])
.service('roleService', function() {
  var rolesArray = [{
      'name': "来煤操作员",
      role: 'worker'
    },{
      'name': "来煤班长",
      role: 'workerAdmin'
    },{
      'name': "化验员",
      role: 'chemChecker'
    },{
      'name': "化验科科长",
      role: 'chemAdmin'
    },{
      'name': "用煤工",
      role: 'workerB'
    },{ 
      'name': "用煤班长",
      role: 'workerBAdmin'
    }, {
      'name': "超级管理员",
      role: 'admin'
    },{
      'name': "只读小超管",
      role: 'readOnlyAdmin'
    }];

  var rolesDict = {};
  $.each(rolesArray, function(indexInArray, obj) {
      rolesDict[obj.role] = obj.name;
    });

  this.roles = function() {
    return rolesDict;
  };
  this.asArray = function() {
    return rolesArray;
  }
})
.filter('roleTranslate', ['roleService', function(roleService) {
  var roleObject = roleService.roles(); 
  return function(roles) {
    return $.map(roles, function(role, idx) {
      return roleObject[role];
    }).join(';');
  };
}]);