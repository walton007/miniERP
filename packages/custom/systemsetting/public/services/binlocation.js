'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.systemsetting').factory('Bins', ['$resource',
  function($resource) {
    return $resource('bins/:binId', {
      binId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
