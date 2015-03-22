'use strict';

angular.module('mean.overview').config(function(stateHelperProvider) {
	stateHelperProvider.setNestedState({
		name: 'overview',
		url: '/overview',
		templateUrl: 'systemsetting/views/index.html',
		children: [{
			name: 'inventory',
			url: '/inventory',
			templateUrl: 'systemsetting/views/binDashboard.html',  
		}, {
			name: 'statistic',
			url: '/statistic',
			templateUrl: 'overview/views/statistic.html',
		}]
	});
});