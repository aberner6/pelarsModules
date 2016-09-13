	ardRectSVG = svgMain.append("g")
        .attr("id", "arduinoRect")
        .attr("transform", "translate(" + (0) + ", " + ((smallY/2+smallHeight)*2) + ")"); //150
        // .attr("transform", "translate(" + (leftMargin) + ", " + (h/2) + ")");
    console.log(startTime);
    console.log(endTime);

	var ardPathSVG = svgMain.append("g")
        .attr("id", "arduinoPath")
        .attr("transform", "translate(" + (0) + ", " + (yAxisBottom-forceheight) + ")");



	pathS
		.datum(newSoft) //softUseComp
    	.attr("class","timepathS")
		.attr("d", lineS);

	lineS = d3.svg.area()
		.x(function(d, i) { 
			if(d==undefined){ console.log("no") }
				else{
		       	return timeXTrue(parseInt(d.key));      			
				}
		})
		.y0(timeSVGH/2-(maxFaces*faceRadius))
		.y1(function(d, i) { 
			if(d==undefined){return 0;}
			if(d.total<0){ return 0}
				else{
					return ySPath(d.values[0].total); 
				}
		})
		.interpolate("linear");
	ySPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max software components
	      .range([timeSVGH/2-(maxFaces*faceRadius), 0]);




var lineHY = h/4;
yHPath.range([lineHY, 0]);
lineH = d3.svg.area()
		.x(function(d, i) { 
			if(d==undefined){ console.log("no") }
				else{
		       	return timeXTrue(parseInt(d.key));      			
				}
		})
		.y0(lineHY)
		.y1(function(d, i) { 
			if(d==undefined){return 0;}
			if(d.total<0){ return 0}
				else{
					return yHPath(d.values[0].total); 
				}
		})
		.interpolate("linear");
pathH
	.transition().attr("class","timepathH")
	.attr("d", lineH);




//to transition the logs
	yOther
	    .rangePoints([topMarg, lineHY]);

		d3.selectAll(".iconsHS").transition().attr("y", function(d, i) {
			return yOther(d)-7
        })
		d3.selectAll(".timeText").transition().attr("y", function(d, i) {
            return yOther(d)+5;
        })
		d3.selectAll("#ardRectz").transition().attr("y", function(d, i) {
			if(d.mod=="M" || d.mod=="B"){
	            return yOther(d.name);
    		}
        })
		d3.selectAll(".logCC").transition()
				.attr("y1", topMarg) 
			    .attr("y2", thisMax) 