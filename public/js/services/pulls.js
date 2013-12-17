//Articles service used for articles REST endpoint
angular.module('mean.pulls')
	.factory("Pulls", ['$resource', function($resource) {
	    return $resource('api/pulls', {}, {
	        post: {
	            method: 'POST', isArray:false
	        }
	    });
	}])
	.factory("Save", ['$resource', function($resource) {
	    return $resource('api/save', {}, {
	        post: {
	            method: 'POST', isArray:false
	        }
	    });
	}])
	.factory("Find", ['$resource', function($resource) {
	    return $resource('api/find', {}, {
	        get: {
	            method: 'GET', isArray:false
	        }
	    });
	}]);