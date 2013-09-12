'use strict';

/* Directives */
angular.module('mean.directives', [])
	.directive('chartViz', visualizeData(chartViz))

function visualizeData (func) { 
	return function() {
		return {
			restrict: 'E',
			scope: {
				val: '='
			},
			link: function (scope, element, attrs) {
				scope.$watch('val', function (newVal, oldVal) {
					func(newVal);
				});
			}
		}
	}
};