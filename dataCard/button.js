function showButton(){
	var timeSVGH = h/2-60;
	var timeSVG = d3.select("#arduinoTimeline") //timeline div id
		.append("svg")
		.attr("width",w)
		.attr("height",timeSVGH)  
		.style("margin-top","1px");

	var iconPic1 = timeSVG.append("g").attr("class","backlabels")
			.append("image")
		    .attr("x", w-70)
		    .attr("y", timeSVGH/2+35)
		    .attr("width",iconW+2)
		    .attr("height",iconW+2)
	        .attr("xlink:href", "/pelarsModules/dataCard/assets/icons/idea.png")
	var	iconName1 = timeSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", w-47)
		    .attr("y", timeSVGH/2+40+5)
		    .text("Success")
		    .attr("font-size",8)

	var	iconPic2 = timeSVG.append("g").attr("class","backlabels")
			.append("image")
		    .attr("x", w-70)
		    .attr("y", timeSVGH/2)
		    .attr("width",iconW+2)
		    .attr("height",iconW+2)
	        .attr("xlink:href","/pelarsModules/dataCard/assets/icons/thunder.png")
	var	iconName2 = timeSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", w-47)
		    .attr("y", timeSVGH/2+8)
		    .text("Frustration")
		    .attr("font-size",8)

	var xAxisCall = timeSVG.append('g');
    xAxisScale.domain([startTime, endTime]);
	    xAxisCall.call(xAxis)
	        .attr("class", "axis") //Assign "axis" class
	            .attr("text-anchor", "end")
	        .attr('transform', 'translate(0, ' + (timeSVGH-1) + ')');

	var iconBut = timeSVG.selectAll(".button1")	
		.data(button1)
		iconBut.enter()
		.append("image")
		.attr("class","button1")
		.attr("xlink:href", "/pelarsModules/dataCard/assets/icons/idea.png")
		.attr("x", function(d){
			return timeX(d.time);
		})
		.attr("y", timeSVGH/2+iconW/2+21)
		.attr("width",iconW)
		.attr("height",iconW);
	var iconLine1 = timeSVG.selectAll(".button1L")	
		.data(button1)
		iconLine1.enter()
		.append("line")
		.attr("class","button1L")
		.attr("x1", function(d){
			return timeX(d.time)+7.25;
		})
		.attr("x2", function(d){
			return timeX(d.time)+7.25;
		})
		.attr("y1", timeSVGH/2+iconW+25)
		.attr("y2", timeSVGH)
		.attr("stroke","grey")

	var iconBut2 = timeSVG.selectAll(".button2")	
		.data(button2)
		iconBut2.enter()
		.append("image")
		.attr("class","button2")
		.attr("xlink:href", "/pelarsModules/dataCard/assets/icons/thunder.png") //just checking now put back to thunder
		.attr("x", function(d){
			return timeX(d.time);
		})
		.attr("y", timeSVGH/2+iconW/2+21)
		.attr("width",iconW)
		.attr("height",iconW);

	var iconLine2 = timeSVG.selectAll(".button2L")	
		.data(button2)
		iconLine2.enter()
		.append("line")
		.attr("class","button2L")
		.attr("x1", function(d){
			return timeX(d.time)+8;
		})
		.attr("x2", function(d){
			return timeX(d.time)+8;
		})
		.attr("y1", timeSVGH/2+iconW+25)
		.attr("y2", timeSVGH)
		.attr("stroke","grey")
}