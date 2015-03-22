'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', [

  function() {
    var _this = this;
    _this._data = {
      user: window.user,
      authenticated: false,
      isAdmin: false
    };
    if (window.user && window.user.roles) {
      _this._data.authenticated = window.user.roles.length;
      _this._data.isAdmin = window.user.roles.indexOf('admin') !== -1;
    }
    return _this._data;
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
  };
  this.getDefaultUrl = function() {
    if (!window.user || !window.user.roles) {
      return '/auth/login';
    } 

    var roles = window.user.roles;
    if (roles.indexOf('admin')) {
      return '/systemsetting/users';
    };
    if (roles.indexOf('chemChecker')) {
      return '/coalmanage/labrecords';
    };
    return '/coalmanage/comehistory';
  };
})
.filter('roleTranslate', ['roleService', function(roleService) {
  var roleObject = roleService.roles(); 
  return function(roles) {
    return $.map(roles, function(role, idx) {
      return roleObject[role];
    }).join(';');
  };
}]);
