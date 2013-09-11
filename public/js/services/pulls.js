//Articles service used for articles REST endpoint
angular.module('mean.pulls').factory("Pulls", ['$resource', function($resource) {
    return $resource('api/pulls', {}, {
        get: {
            method: 'POST'
        }
    });
}]);