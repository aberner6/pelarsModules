var iconBut1 = timeSVG.selectAll(".button1")	

lightbulb = timeSVG.selectAll(".clip-circ"+lIndex+"l")
    .attr("id","clip-circ")


var iconBut2 = timeSVG.selectAll(".button2")	

thunder = timeSVG.selectAll(".clip-circ"+tIndex+"t")
    .attr("id","clip-circ")

overview = timeSVG.selectAll(".clip-rect")

resNote = timeSVG.selectAll(".commentIcon")
studCommentDoc = timeSVG.selectAll(".studCommentIcon")
studImgDoc = timeSVG.selectAll(".camIcon")
var docImg = svgMain.selectAll(".clip-circ"+lIndex+"SD")
    .attr("id","clip-circ")

//face data
rectFace = timeSVG.append("g")
	.attr("class","facerect").selectAll(".facerect")

//for network node moving viz
var vis = svgMain //for the visualization
    .append('svg:g')
	path2 = vis.selectAll("path2")
	    .attr("class","link2") 
	circNode = vis.selectAll("nodez")
//for links non-moving viz
var plot = svgMain.append("g")
    .attr("id", "plot")
d3.select("#plot").selectAll(".link")


//hands data
	var g = timeSVG.selectAll(".hand")
 	pathActive1 = timeSVG.append("g")
	    .append("path")
	    .attr("class","activepath1")
	pathActive2 = timeSVG.append("g")
		.append("path")
		.attr("class","activepath2")	    
 	pathActive3 = timeSVG.append("g")
    	.append("path")
	    .attr("class","activepath3")

// ide data
// little rects and their icons
	var ardRectSVG = svgMain.append("g")
        .attr("id", "arduinoRect")
	var g = ardRectSVG.selectAll(".ide")
	iconsHS.enter().append("image")
           .attr("class", "iconsHS")
//text per icon
	ardRectSVG.selectAll(".timeText")
		.data(bothHS)
//paths
	var ardPathSVG = svgMain.append("g")
        .attr("id", "arduinoPath")
	pathS = ardPathSVG.append("g")
		.append("path")
		.attr("class","timepathS")
	pathH = ardPathSVG.append("g")
		.append("path")
		.attr("class","timepathH")
	//can go from lineS1 which would be 0 for x to lineS which populates with data like this:
	// pathS
	// 	.datum(softUseComp).transition()
	// 	.attr("d", lineS);

//phase pie
	var netSVG = svgMain
		.append("g")
		.attr("class","piePhase")

	var pathPie = netSVG.selectAll("pathPie")
	sliceLabel.enter().append("svg:text")
	    .attr("class", "arcLabel")

//phase rects
	var rectPhase = timeSVG.selectAll(".phase")
	var textPhase = timeSVG.selectAll(".phaseText")

//THESE ARE THE SCALES WE COULD WORK WITH

//for smaller areas
	// timeX2.domain([startTime, endTime]).range([forcewidth/4, forcewidth]);
	timeX
	.domain([startTime, endTime])
	.range([leftMargin, w-leftMargin]);

//face path
	var yPath = d3.scale.linear()
	  .domain([0, maxTotal])
	  .range([timeSVGH/2, 0]);
//arduino components
	yOther
	    .rangePoints([topMarg, forceheight]);

//hand path
  	yActivePath = d3.scale.linear() 
		.domain([0,maxActiveOverall])
		.range([timeSVGH-maxRadius, timeSVGH/2+(maxFaces*faceRadius)]);
 	 xActivePath = d3.scale.linear() //startTime, endTime
		.domain([startTime, endTime]).range([10, w-40]);
//arduino curves paths
	yHPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max hardware components
	      .range([timeSVGH/2-(maxFaces*faceRadius), 0]);
	ySPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max software components
	      .range([timeSVGH/2-(maxFaces*faceRadius), 0]);
	lineH = d3.svg.area()
		.x(function(d, i) { 
			if(d==undefined){ return 0; }
				else{
		       	return xPath(d.time);      			
				}
		})
		.y0(timeSVGH/2-(maxFaces*faceRadius))
		.y1(function(d, i) { 
			if(d==undefined){return 0;}
			if(d.total<0){ return 0}
				else{
					return yHPath(d.total);  //actually totals now
				}
		})
		.interpolate("linear");

	lineS = d3.svg.area()
		.x(function(d, i) { 
			if(d==undefined){ return 0; }
				else{
		       	return xPath(d.time);      			
				}
		})
		.y0(timeSVGH/2-(maxFaces*faceRadius))
		.y1(function(d, i) { 
			if(d==undefined){return 0;}
			if(d.total<0){ return 0}
				else{
					return ySPath(d.total); 
				}
		})
		.interpolate("linear");


sendnesteddata has the xaxis


var leftMargin = 100;
var timeX = d3.scale.linear()
	.range([leftMargin, w-rightMargin]);
d3.selectAll("rect.faceRect").transition().attr("x",function(d){ return timeX(d.time)})

//test this when server is working and gives length to button images
d3.selectAll(".button1").transition().attr("x",function(d){ return timeX(d.time)})
d3.selectAll(".button2").transition().attr("x",function(d){ return timeX(d.time)})

d3.selectAll("rect#ardRectz").transition().attr("x", function(d,i){ return timeX(d.time)});
ardRectSVG
	.transition()
    .attr("transform", "translate(" + (leftMargin) + ", " + (h/2) + ")");
//anything time-based always has plan.doc/reflect
//turned off getMulti
//turned off parse button


  	pathActive1
  		.datum(softS1).transition()  		
  		.attr("d", lineActive1);

  	pathActive2
  		.datum(softS2).transition()  		
  		.attr("d", lineActive2);

  	pathActive3
  		.datum(softS3).transition()  		
  		.attr("d", lineActive3);


