angular.module('mean').controller('IndexController', ['$scope', 'Global', 'Pulls', function ($scope, Global, Pulls) {
    $scope.global = Global;
    $scope.request = {};
    $scope.request.oauth = {};
    $scope.result = {};

    $scope.getDataRequest = function () {
    	console.log("called getDataRequest");
    	console.log("$scope.request = %j", $scope.request);
    	Pulls.get($scope.request, function(pullResults){
    		$scope.result.data = pullResults;
    		$scope.result.query = "/";
    		$scope.describeData()
    		console.log("pullResults = %j", pullResults);
    		console.log("response");
    	});
    }

    $scope.describeData = function () {
    	console.log("data to describe = %j", $scope.result.data);
    	$scope.result.processed = canopy.json($scope.result.data).describe($scope.result.query);
    }
}]);