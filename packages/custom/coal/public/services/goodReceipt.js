'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.coal').factory('GoodReceipts', ['$resource',
  function($resource) {
    return $resource('goodReceipts/:grId', { 
    	'grId': '@_id'
    }, { 
    	'query':  {method:'GET', isArray:false},
    	update: {
	        method: 'PUT'
	      }
    });
    
  }
]);
