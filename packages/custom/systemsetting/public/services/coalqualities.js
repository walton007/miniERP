'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.systemsetting').factory('CoalQualities', ['$resource',
  function($resource) {
    return $resource('coalQualities/:coalQualityId', {
      mineralId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
