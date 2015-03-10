'use strict';

angular.module('mean.coal').config(function(stateHelperProvider) {
	stateHelperProvider.setNestedState({
		name: 'coalmanage',
		url: '/coalmanage',
		templateUrl: 'coal/views/index.html',
		children: [{
			name: 'comehistory',
			url: '/comehistory',
			templateUrl: 'coal/views/comehistory.html',
		}, {
			name: 'comecreate',
			url: '/comecreate',
			templateUrl: 'coal/views/comecreate.html',
		}, {
			name: 'comecheck',
			url: '/comecheck',
			templateUrl: 'coal/views/comecheck.html',
		}, {
			name: 'labrecords',
			url: '/labrecords',
			templateUrl: 'coal/views/labrecords.html',
		}, {
			name: 'labcreaterecord',
			url: '/labcreaterecord',
			templateUrl: 'coal/views/labcreaterecord.html',
		},{
			name: 'labcheck',
			url: '/labcheck',
			templateUrl: 'coal/views/labcheck.html',
		}, {
			name: 'consumeplanlist',
			url: '/consumeplanlist',
			templateUrl: 'coal/views/consumeplanlist.html',
		}, {
			name: 'consumehistory',
			url: '/consumecheck',
			templateUrl: 'coal/views/consumehistory.html',
		}]
	});
});