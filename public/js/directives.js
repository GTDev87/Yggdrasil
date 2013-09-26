'use strict';

/* Directives */
angular.module('mean.directives', [])
    .directive('chartViz', visualizeData(chartViz));

var testObj = {
    flare:{
        analytics:{
            cluster: {
                AgglomerativeCluster: 3938,
                CommunityStructure: 3812,
                HierarchicalCluster: 6714,
                MergeEdge: 743
            },
            graph: {
                LinkDistance: 5731,
                MaxFlowMinCut: 7840,
                ShortestPaths: 5914,
                SpanningTree: 3416
            }
        }
    }
}




function jsonToD3Format(jsonData) {
    var pairIsObjectType = function(pair){
        var typeValue = typeof(pair[1]);
        return typeValue === "array" || typeValue === "object";
    };

    var returnObject = {};

    var pairs = _.pairs(jsonData);
    var objectPairs = _.filter(pairs, pairIsObjectType);
    var valuePairs = _.without(pairs, pairIsObjectType);

    returnObject.details = _.object(valuePairs);

    returnObject.children = _.map(
        objectPairs,
        function(pair){
            var childObject = jsonToD3Format(pair[1]);
            childObject.name = pair[0];
            return childObject;
        }
    );

    return returnObject;
}


function visualizeData (func) { 
    return function() {
        return {
            restrict: 'E',
            scope: {
                val: '='
            },
            link: function (scope, element, attrs) {
                

                scope.$watch('val', function (newVal, oldVal) {
                    d3.select("#chart")
                        .select("svg")
                        .remove();

                    var selection = d3.select("#chart")
                        .append("svg:svg")
                            .attr("width", 960)
                            .attr("height", 800)
                        .append("svg:g")
                            .attr("transform", "translate(20,30)");

                    console.log("testobj processed = %j", jsonToD3Format(newVal));
                    func(selection, jsonToD3Format(newVal));
                });
            }
        }
    }
};