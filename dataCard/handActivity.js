
var hardCumu = [];
var softS1 = [];
var softS2 = [];
var softS3 = [];
var theseTotals = [];
var one = [];
var two = [];
var three = [];
var activeOne = [];
var activeTwo = [];
var activeThree = [];
var handSVGH = h/2-60;

function showHands(){
	//labels
	var handSVG = d3.select("#handActivity") //timeline div id
		.append("svg")
		.attr("width",w)
		.attr("height",handSVGH)  
        .style("margin-top","1px"); 

	var	handPic = handSVG.append("g").attr("class","backlabels")
			.append("image")
		    .attr("x", iconW/2)
		    .attr("y", 20)
		    .attr("width",iconW+2)
		    .attr("height",iconW+2)
	        .attr("xlink:href","/pelarsModules/dataCard/assets/hand.png")
	var	labelsHand = handSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", iconW*2)
		    .attr("y", 10)
		    .text("Hand Activity")
		    .attr("text-anchor","middle")
		    .attr("font-size",8)

	var xAxisCall = handSVG.append('g');
    xAxisScale.domain([startTime, endTime]);
	    xAxisCall.call(xAxis)
	        .attr("class", "axis") //Assign "axis" class
	            .attr("text-anchor", "end")
	        .attr('transform', 'translate(0, ' + (handSVGH-1) + ')');

	var g = handSVG.selectAll(".hand")
		.data(handData.values.sort(d3.ascending))
		.enter()
	  	.append("g")
	  	.attr("transform",function(d,i) {
	  		theseTotals.push(d.values.length);
			theseTotals.sort(d3.descending); 			
	  		return "translate("+0+",0)";
	  	})
	  	.attr("class", function(d,i){
  			if(d.values.length==theseTotals[0]){
	  			one.push(d.values);
	  		}
  			if(d.values.length==theseTotals[1]){
	  			two.push(d.values);
	  		}
  			if(d.values.length==theseTotals[2]){
	  			three.push(d.values);
	  		}
	  		else{}	
	  		return "hand";
	  	})

	var rx1 = [];
	var ry1 = [];
	var time1 = [];
	if(one!="undefined"){
		for(i=0; i<one[0].length; i++){
		  	time1.push(one[0][i].time)
		  	rx1.push(one[0][i].rx);
		  	ry1.push(one[0][i].ry);
		}
		if(time1.length>0){ //check if array is full
			for(i=0; i<one[0].length; i++){
				if(i>0){
			    	activeOne.push({
			    		"changeDist": Math.sqrt(Math.pow((rx1[i]-rx1[i-1]), 2) + Math.pow((ry1[i]-ry1[i-1]),2)),
			    		"changeTime": time1[i]-time1[i-1],
			    		"thisTime": time1[i]
			    	})
			    }
			}
		}
		var delta1 = [];
		if(activeOne){
			for(i=0; i<activeOne.length; i++){
				delta1.push(activeOne[i].changeDist);
			}
		}
		var cumu1 = delta1;
		    _.map(cumu1,function(num,i){ if(i > 0) cumu1[i] += cumu1[i-1]; });
		var interval = 160;
		for(i=0; i<cumu1.length; i++){
			if(i>interval){
				softS1.push((cumu1[i]-cumu1[i-interval])/(activeOne[i].thisTime-activeOne[i-interval].thisTime))
			}
		}
	}else{console.log("no")}

	var rx2 = [];
	var ry2 = [];
	var time2 = [];
	if(two.length>0){
		for(i=0; i<two[0].length; i++){
		  	time2.push(two[0][i].time)
		  	rx2.push(two[0][i].rx);
		  	ry2.push(two[0][i].ry);
		}
		if(time2.length>0){ //check if array is full
			for(i=0; i<two[0].length; i++){
				if(i>0){
			    	activeTwo.push({
			    		"changeDist": Math.sqrt(Math.pow((rx2[i]-rx2[i-1]), 2) + Math.pow((ry2[i]-ry2[i-1]),2)),
			    		"changeTime": time2[i]-time2[i-1],
			    		"thisTime": time2[i]
			    	})
			    }
			}
		}
		var delta2 = [];
		if(activeTwo){
			for(i=0; i<activeTwo.length; i++){
				delta2.push(activeTwo[i].changeDist);
			}
		}
		var cumu2 = delta2;
		    _.map(cumu2,function(num,i){ if(i > 0) cumu2[i] += cumu2[i-1]; });
		for(i=0; i<cumu2.length; i++){
			if(i>interval){
				softS2.push((cumu2[i]-cumu2[i-interval])/(activeTwo[i].thisTime-activeTwo[i-interval].thisTime))
			}
		}
	}
	else{console.log("notwo")}

	var rx3 = [];
	var ry3 = [];
	var time3 = [];
	if(three.length>0){
		for(i=0; i<three[0].length; i++){
		  	time3.push(three[0][i].time)
		  	rx3.push(three[0][i].rx);
		  	ry3.push(three[0][i].ry);
		}
		if(time3.length>0){ //check if array is full
			for(i=0; i<three[0].length; i++){
				if(i>0){
			    	activeThree.push({
			    		"changeDist": Math.sqrt(Math.pow((rx3[i]-rx3[i-1]), 2) + Math.pow((ry3[i]-ry3[i-1]),2)),
			    		"changeTime": time3[i]-time3[i-1],
			    		"thisTime": time3[i]
			    	})
			    }
			}
		}
		var delta3 = [];
		if(activeThree){
			for(i=0; i<activeThree.length; i++){
				delta3.push(activeThree[i].changeDist);
			}
		}
		var cumu3 = delta3;
		    _.map(cumu3,function(num,i){ if(i > 0) cumu3[i] += cumu3[i-1]; });
		for(i=0; i<cumu3.length; i++){
			if(i>interval){
				softS3.push((cumu3[i]-cumu3[i-interval])/(activeThree[i].thisTime-activeThree[i-interval].thisTime))
			}
		}
	}
	else{console.log("nothree")}





	var maxActive1, maxActive2, maxActive3;
	if(softS1.length>0){
		var maxActive1 = d3.max(softS1)//d3.max(justSpeed);//d3.max(justDelta);	
	}
	if(softS2.length>0){
		var maxActive2 = d3.max(softS2)//d3.max(justSpeed);//d3.max(justDelta);	
	}
	if(softS3.length>0){
		var maxActive3 = d3.max(softS3)//d3.max(justSpeed);//d3.max(justDelta);
	}
	var maxActiveOverall;

	if(maxActive2>maxActive1){
		maxActiveOverall = maxActive2;
	} else{
		maxActiveOverall = maxActive1;
	}
	if(maxActive3>maxActiveOverall){
		maxActiveOverall = maxActive3;
	} else{
		maxActiveOverall = maxActiveOverall;
	}

	var pathActive1, lineActive1, pathActive2, lineActive2, pathActive3, lineActive3;

	var yActivePath;
  	yActivePath = d3.scale.linear() 
      .domain([0,maxActiveOverall]).range([handSVGH-maxRadius, handSVGH/2+(maxFaces*faceRadius)]); 

  	xActivePath = d3.scale.linear() //startTime, endTime
      .domain([startTime, endTime]).range([10, w-40]);

	lineActive1 = d3.svg.line()
		.x(function(d, i) { return xActivePath(activeOne[i].thisTime); })
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle")
	pathActive1 = handSVG.append("g")
		.append("path")
		.attr("class","activepath1")
		.attr("fill","none")
		.attr("stroke","darkgrey")
		.attr("stroke-dasharray",1)
		.attr("stroke-width",2)
  	pathActive1
  		.datum(softS1)
  		.attr("d", lineActive1);

	lineActive2 = d3.svg.line()
      .x(function(d, i) { return xActivePath(activeTwo[i].thisTime); })
      .y(function(d, i) { return yActivePath(d); })
      .interpolate("bundle")
	pathActive2 = handSVG.append("g")
		.append("path")
		.attr("class","activepath2")
		.attr("fill","none")
		.attr("stroke","darkgrey")
		.attr("stroke-dasharray",2)
		.attr("stroke-width",2);
  	pathActive2
  		.datum(softS2)
  		.attr("d", lineActive2);

	lineActive3 = d3.svg.line()
		.x(function(d, i) { return xActivePath(activeThree[i].thisTime); })
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("linear")
	pathActive3 = handSVG.append("g")
		.append("path")
		.attr("class","activepath3")
		.attr("fill","none")
		.attr("stroke","darkgrey")
		.attr("stroke-width",2);
  	pathActive3
  		.datum(softS3)
  		.attr("d", lineActive3);
}	