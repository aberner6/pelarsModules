
var maxFaces;
var faceUseComp = [];
var faceNum = [];
var faceRadius = 5;
var maxRadius = faceRadius*4;
var	faceTotal = [];

var timeX = d3.scale.linear()
	timeX.domain([startTime, endTime]).range([14, w-50]);

var faceSVGH = h-60;

var miniTime = [];
var whatTime = [];

function goFace(incomingData, summary){
	faceData = incomingData;
	summaryFace = summary;

	for(j=0; j<summaryFace.length; j++){
		miniTime.push(summaryFace[j].values.min_time)
		whatTime.push(summaryFace[j].values.max_time)
	}
	timeMin = d3.min(miniTime);
	timeMax = d3.max(whatTime);
}

function showFace(){
	var faceSVG = d3.select("#arduinoTimeline") //timeline div id
		.append("svg")
		.attr("width",w)
		.attr("height",faceSVGH+5)  
		.style("margin-top","1px");

	var	facePic = faceSVG.append("g").attr("class","backlabels")
			.append("image")
		    .attr("x", 2)
		    .attr("y", faceSVGH/2-24+iconW)
		    .attr("width",iconW)
		    .attr("height",iconW)
	        .attr("xlink:href", "/pelarsModules/dataCard/assets/face2.png");
	var	labelsFace = faceSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", 0)
		    .attr("text-anchor","left")
		    .attr("y", faceSVGH/2+iconW) //197
		    .text("Faces")
		    .attr("font-size",8);

	var faceAxisCall = faceSVG.append('g');
    xAxisScale.domain([startTime, endTime]);

	    faceAxisCall.call(xAxis)
	        .attr("class", "axis") //Assign "axis" class
	            .attr("text-anchor", "end")
	        .attr('transform', 'translate(' + (4) + ', ' + (faceSVGH/2+100) + ')');
	var faceColor = "#AB47BC";
	var faceY = d3.scale.linear()
		.range([0,faceSVGH/4])
	rectFace = faceSVG.append("g").attr("class","facerect").selectAll(".facerect")
	    .data(faceData.values)
	  	.enter().append("rect")
	    .attr("class", "facerect")
	    .attr("x", function(d){
	    	faceNum.push(d.num);
	    	maxFaces = d3.max(faceNum);
	    	faceY.domain([1, maxFaces])
	    	return timeX(d.time);
	    })
	    .attr("y", function(d,i){
	    	return faceSVGH/2-faceY(d.num)
	    })
	    .attr("height", function(d,i){
	    	if(2*faceY(d.num)<0){
	    		return 0;
	    	}else{
		    	return 2*faceY(d.num);
		    }
	    })
	    .attr("width",2)
	    .attr("fill", faceColor)
	    .attr("opacity",.6)
		.attr("stroke","none")
	maxFaces = d3.max(faceNum);
}

