'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.coal').factory('GoodIssues', ['$resource',
  function($resource) {
    return $resource('goodIssues/:giId', { 
    	'giId': '@_id'
    }, { 
    	'query':  {method:'GET', isArray: false},
    	'update': {
	        method: 'PUT'
	      }
    });
    
  }
]);
