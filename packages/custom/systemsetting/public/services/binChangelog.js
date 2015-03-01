'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.systemsetting').factory('BinChangelogs', ['$resource',
  function($resource) {
    return $resource('binChangelogs', { 
    	'pageSize': 5,
    	'pageNumber': 0,
    }, { 
    	'query':  {method:'GET', isArray:false}
    });
  }
]);
