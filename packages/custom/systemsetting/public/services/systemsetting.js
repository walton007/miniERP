'use strict';

angular.module('mean.systemsetting').factory('GlobalSetting', [
  function() {
    var today = function() {
      return new Date();
    };
    return {
      dateOptions: {
        formatYear: 'yy',
        startingDay: 1
      },
      minDate: function() {
        return new Date(today() - 3*24 * 60 * 60 * 1000); 
      },
      maxDate: function() {
        return new Date(today()  + 24 * 60 * 60 * 1000); 
      },
      dataFormat: 'yyyy-MM-dd' 
    };
  }
]).filter('goodReceiptStatusFilter', [ function() {
  return function(status) {
    var statusDict = {
      'checked': "已化验",
      'new': "等待化验",
      'outdated': '过期'
    };
    return statusDict[status];
  };
}]).filter('goodIssueStatusFilter', [ function() {
  return function(status) {
    var statusDict = {
      'checked': "已消耗",
      'planning': "计划中",
      'outdated': '过期'
    };
    return statusDict[status];
  };
}]);


