function chartViz(jsonData){
  var width = 960,
    height = 800;

  jsonData.x0 = 0,
  jsonData.y0 = 0;

  var mytree = d3.layout.tree()
      .size([height, 100]);

  var mydiagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  // d3.select("#chart")
  //   .remove("svg:svg")

  var myvis = d3.select("#chart")
    .append("svg:svg")
      .attr("width", width)
      .attr("height", height)
    .append("svg:g")
      .attr("transform", "translate(20,30)");

  chart()
    .barHeight(20)
    .barWidth(width * .8)
    .duration(400)
    .root(jsonData)
    .source(jsonData)
    .diagonal(mydiagonal)
    .vis(myvis)
    .tree(mytree)
    .i(0)();
}

