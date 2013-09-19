function chart () {
    //defaults
    var width = 0,
		barHeight = 0,
		barWidth = 0,
		duration = 0,
		root = {},
		source = {},
		diagonal = function(){},
		vis = {},
		tree = {},
		i = 0;

    var myChart = function(){
		console.log("source = %j", source);

		// Compute the flattened node list. TODO use d3.layout.hierarchy.
		var nodes = tree.nodes(root);

		// Compute the "layout".
		nodes.forEach(function(n, i) {
			n.x = i * barHeight;
		});

		// Update the nodes…
		var node = vis.selectAll("g.node")
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
		var link = vis.selectAll("path.link")
			.data(tree.links(nodes), function(d) { return d.target.id; });

		// Enter any new links at the parent's previous position.
		link.enter().insert("svg:path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
		    	var o = {x: source.x0, y: source.y0};
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

		// Toggle children on click.
		function click(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}

			chart()
				.barHeight(barHeight)
				.barWidth(barWidth)
				.duration(duration)
				.root(root)
				.source(d)
				.diagonal(diagonal)
				.vis(vis)
				.tree(tree)
				.i(i)();
		}

		function color(d) {
			return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
		}

    }


    //public setters and getters
    ////////////////////////////
    myChart.source = function(value) {
      if (!arguments.length) {return source;}
      source = value;
      return myChart;
    };

    myChart.root = function(value) {
      if (!arguments.length) {return root;}
      root = value;
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