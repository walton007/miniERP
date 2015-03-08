'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.coal').factory('GoodReceipts', ['$resource',
  function($resource) {
    return $resource('goodReceipts/:grId', { 
    	'pageSize': 5,
    	'pageNumber': 0,
    	'status': 'all',
    	'grId': '@_id'
    }, { 
    	'query':  {method:'GET', isArray:false},
    	update: {
	        method: 'PUT'
	      }
    });
    
  }
]);
