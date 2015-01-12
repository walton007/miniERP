'use strict';

angular.module('mean.overview').config(function(stateHelperProvider) {
	stateHelperProvider.setNestedState({
		name: 'overview',
		url: '/overview',
		templateUrl: 'overview/views/index.html',
		children: [{
			name: 'inventory',
			url: '/inventory',
			templateUrl: 'overview/views/inventory.html',
		}, {
			name: 'statistic',
			url: '/statistic',
			templateUrl: 'overview/views/statistic.html',
		}]
	});
});