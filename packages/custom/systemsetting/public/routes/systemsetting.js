'use strict';

angular.module('mean.systemsetting').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('systemsetting example page', {
      url: '/systemsetting/example',
      templateUrl: 'systemsetting/views/index.html'
    });
  }
]);

angular.module('mean.systemsetting').config(function(stateHelperProvider) {
	stateHelperProvider.setNestedState({
		name: 'systemsetting',
		url: '/systemsetting',
		templateUrl: 'systemsetting/views/index.html',
		children: [{
			name: 'inventory',
			url: '/inventory',
			templateUrl: 'systemsetting/views/inventory.html',
		}, {
			name: 'coals',
			url: '/coals',
			templateUrl: 'systemsetting/views/coals.html',
		}, {
			name: 'users',
			url: '/users',
			templateUrl: 'systemsetting/views/users.html',
		}, {
			name: 'logs',
			url: '/logs',
			templateUrl: 'systemsetting/views/logs.html',
		}]
	});
});