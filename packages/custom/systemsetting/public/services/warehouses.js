'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.systemsetting').factory('Warehouses', ['$resource',
  function($resource) {
    return $resource('warehouses/:warehouseId', {
      warehouseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
