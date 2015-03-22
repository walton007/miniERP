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
			name: 'createGoodReceipt',
			url: '/createGoodReceipt',
			templateUrl: 'coal/views/createGoodReceipt.html',
		}, {
			name: 'comecheck',
			url: '/comecheck',
			templateUrl: 'coal/views/comecheck.html',
		}, {
			name: 'labrecords',
			url: '/labrecords',
			templateUrl: 'coal/views/labrecords.html',
		}, {
			name: 'labsHistory',
			url: '/labsHistory',
			templateUrl: 'coal/views/labrecordsHistory.html',
		}, {
			name: 'createGoodIssue',
			url: '/createGoodIssue',
			templateUrl: 'coal/views/createGoodIssue.html',
		}, {
			name: 'recordConsume',
			url: '/recordConsume',
			templateUrl: 'coal/views/recordConsume.html',
		}, {
			name: 'consumehistory',
			url: '/consumecheck',
			templateUrl: 'coal/views/consumehistory.html',
		}]
	});
});