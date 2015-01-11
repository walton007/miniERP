'use strict';

angular.module('mean.coal').config(function(stateHelperProvider) {
	stateHelperProvider.setNestedState({
		name: 'coalmanage',
		url: '/coalmanage',
		templateUrl: 'coal/views/index.html',
		children: [{
			name: 'comehistory',
			url: '/coalmanage/comehistory',
			templateUrl: 'coal/views/comehistory.html',
		}, {
			name: 'comecreate',
			url: '/coalmanage/comecreate',
			templateUrl: 'coal/views/comecreate.html',
		}, {
			name: 'comecheck',
			url: '/coalmanage/comecheck',
			templateUrl: 'coal/views/comecheck.html',
		}]
	});
});