'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.coal').factory('BasicBins', ['$resource',
  function($resource) {
    // return $resource('basicBins', { 
    // }, {
      
    // });
    return $resource('basicBins');
  }
]);
