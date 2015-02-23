'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.systemsetting').factory('Minerals', ['$resource',
  function($resource) {
    return $resource('minerals/:mineralId', {
      mineralId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
