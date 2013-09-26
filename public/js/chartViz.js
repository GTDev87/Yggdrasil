function chartViz(selection, jsonData){
  console.log("selection = %j", selection);
  
  jsonData.x0 = 0,
  jsonData.y0 = 0;

  selection
    .datum([jsonData])
    .call(myTreeChart());
}

