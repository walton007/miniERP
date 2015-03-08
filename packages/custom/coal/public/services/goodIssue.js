'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.coal').factory('GoodIssues', ['$resource',
  function($resource) {
    return $resource('goodIssues/:giId', { 
    	'pageSize': 5,
    	'pageNumber': 0,
    	'status': 'all',
    	'giId': '@_id'
    }, { 
    	'query':  {method:'GET', isArray:false},
    	update: {
	        method: 'PUT'
	      }
    });
    
  }
]);
