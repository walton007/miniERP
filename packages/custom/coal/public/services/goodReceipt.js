'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.coal').factory('GoodReceipts', ['$resource',
  function($resource) {
    return $resource('goodReceipts', { 
    	'pageSize': 5,
    	'pageNumber': 0,
    	'status': 'all'
    }, { 
    	'query':  {method:'GET', isArray:false}
    });
  }
]);
