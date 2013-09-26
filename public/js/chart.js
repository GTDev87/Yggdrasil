function formattedObj(jsonData) {
    var pairIsObjectType = function(pair){
        var typeValue = typeof(pair[1]);
        return typeValue === "array" || typeValue === "object";
    };

    var returnObject = {};

    var pairs = _.pairs(jsonData);

    returnObject.children = _.map(
        pairs,
        function (pair) {
        	if(pair && !pairIsObjectType(pair)){
        		var valObj = {};
        		valObj.name = pair[0];
        		valObj.children = [{name: pair[1]}];
        		return valObj;
        	}
            return {name: pair[0], children: [{name: {}}]};
        }
    );

    return returnObject;
}


function myTreeChart () {

    //defaults
    var width = 960,
    	height = 800,
		barHeight = 20,
		barWidth = width * .2,
		duration = 400,
		diagonal = d3.svg.diagonal()
    		.projection(function(d) { return [d.y, d.x]; }),
		i = 0;

    var myChart = function(selection){
    	selection.each(function(data){
    		var depth = 1,
          		container = d3.select(this);

          	var tree = d3.layout.tree()
        		.children(function(d) { return d.children })
        		.size([height, 100]);


    		myChart.update = function() { container.transition().duration(600).call(myChart) };

    		source = data[0];
    		// console.log("data = %j", data);
    		// console.log("source = %j", source);

			// Compute the flattened node list. TODO use d3.layout.hierarchy.
			var nodes = tree.nodes(source);

			// Compute the "layout".
			nodes.forEach(function(n, i) {
				n.x = i * barHeight;
			});

			// Update the nodes…
			var node = container.selectAll("g.node")
				.data(nodes, function(d) { return d.id || (d.id = ++i); });

			var nodeEnter = node.enter().append("svg:g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
				.style("opacity", 1e-6);

			// Enter any new nodes at the parent's previous position.
			nodeEnter.append("svg:rect")
				.attr("y", -barHeight / 2)
				.attr("height", barHeight)
				.attr("width", barWidth)
				.style("fill", color)
				.on("dblclick", dblclick)
				.on("click", click);

			nodeEnter.append("svg:text")
				.attr("dy", 3.5)
				.attr("dx", 5.5)
				.text(function(d) { return d.name; });

			// Transition nodes to their new position.
			nodeEnter.transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				.style("opacity", 1);

			node.transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				.style("opacity", 1)
			.select("rect")
				.style("fill", color);

			// Transition exiting nodes to the parent's new position.
			node.exit().transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
				.style("opacity", 1e-6)
				.remove();

			// Update the links…
			var link = container.selectAll("path.link")
				.data(tree.links(nodes), function(d) { 
					//console.log("new d = %j", d);
					return d.target.id; 
				});

			// Enter any new links at the parent's previous position.
			link.enter().insert("svg:path", "g")
				.attr("class", "link")
				.attr("d", function(d) {
					// console.log("enter link d = %j", d);
			    	var o = {x: source.x0, y: source.y0};
			    	// console.log("after enter");
			    	return diagonal({source: o, target: o});
				})
			.transition()
				.duration(duration)
				.attr("d", diagonal);

			// Transition links to their new position.
			link.transition()
				.duration(duration)
				.attr("d", diagonal);

			// Transition exiting nodes to the parent's new position.
			link.exit().transition()
				.duration(duration)
				.attr("d", function(d) {
					var o = {x: source.x, y: source.y};
					return diagonal({source: o, target: o});
				})
				.remove();

			// Stash the old positions for transition.
			nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});

			// Toggle children on dblclick
			function dblclick(d) {
				if (d.children) {
					d._children = d.children;
					d.children = null;
				} else {
					d.children = d._children;
					d._children = null;
				}
				// console.log("d = %j", d)

				myChart.update();
			}

			function click(d) {

				d3.select("#detailsBox")
					.select("svg")
                	.remove();

                var detailsBox = d3.select("#detailsBox")
                    .append("svg:svg")
                        .attr("width", 960)
                        .attr("height", 800)
                    .append("svg:g")
                        .attr("transform", "translate(20,30)");


				

				// console.log("details = %j", d.details);
				// console.log("d3 format details = %j", jsonToD3Format(d.details));

				var detailsObj = formattedObj(d.details);
				detailsObj.name = d.name;
				detailsObj.x0 = 0;
				detailsObj.y0 = 0;


				detailsBox
					.datum([detailsObj])
					.call(myTreeChart());


			}

			function color(d) {
				return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
			}
    	})
    }


    //public setters and getters
    ////////////////////////////
    myChart.source = function(value) {
      if (!arguments.length) {return source;}
      source = value;
      return myChart;
    };

    myChart.barHeight = function(value) {
      if (!arguments.length) {return barHeight;}
      barHeight = value;
      return myChart;
    };

    myChart.barWidth = function(value) {
      if (!arguments.length) {return barWidth;}
      barWidth = value;
      return myChart;
    };

    myChart.duration = function(value) {
      if (!arguments.length) {return duration;}
      duration = value;
      return myChart;
    };

    myChart.diagonal = function(value) {
      if (!arguments.length) {return diagonal;}
      diagonal = value;
      return myChart;
    };

    myChart.vis = function(value) {
      if (!arguments.length) {return vis;}
      vis = value;
      return myChart;
    };

    myChart.tree = function(value) {
      if (!arguments.length) {return tree;}
      tree = value;
      return myChart;
    };

    myChart.i = function(value) {
      if (!arguments.length) {return i;}
      i = value;
      return myChart;
    };

    return myChart;
}