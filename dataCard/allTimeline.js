
var alltimeSVGH = h-60;

var allTimeSVG = d3.select("#allTimeline") //timeline div id
	.append("svg")
	.attr("width",w)
	.attr("height",alltimeSVGH)  
	// .style("border","1px solid white") 
	.style("margin-top","1px");

var options = [];
options.push("BTN", "RLY", "LED", "POT", "LDR", "TMP", "ACR", "PEZ", "RGB", "COL", "ROT", "IF", "Interval", "Fade", "Swap", "Map", "Counter", "Trigger", "Note", "Random", "PONG", "SimonSays");
var hColor = d3.scale.ordinal()
    .domain(options)
	.range([hardwareColor,"teal"]);

var sColor = d3.scale.ordinal()
    .domain(options)
	.range(["brown","tan"]);

function showAllIDE(){

	var iconPic1 = allTimeSVG.append("g").attr("class","backlabels")
			.append("image")
		    .attr("x", w-70)
		    .attr("y", 20)
		    .attr("width",iconW+2)
		    .attr("height",iconW+2)
	        .attr("xlink:href", "/pelarsModules/dataCard/assets/icons/idea.png")
	var	iconName1 = allTimeSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", w-47)
		    .attr("y", 30)
		    .text("Success")
		    .attr("font-size",8)

	var	iconPic2 = allTimeSVG.append("g").attr("class","backlabels")
			.append("image")
		    .attr("x", w-70)
		    .attr("y", 0)
		    .attr("width",iconW+2)
		    .attr("height",iconW+2)
	        .attr("xlink:href","/pelarsModules/dataCard/assets/icons/thunder.png")
	var	iconName2 = allTimeSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", w-47)
		    .attr("y", 10)
		    .text("Frustration")
		    .attr("font-size",8)

	var xAxisCall = allTimeSVG.append('g');
    xAxisScale.domain([startTime, endTime]);
	    xAxisCall.call(xAxis)
	        .attr("class", "axis") //Assign "axis" class
	            .attr("text-anchor", "end")
	        .attr('transform', 'translate(0, ' + (alltimeSVGH-1) + ')');

	var iconBut = allTimeSVG.selectAll(".button1")	
		.data(button1)
		iconBut.enter()
		.append("image")
		.attr("class","button1")
		.attr("xlink:href", "/pelarsModules/dataCard/assets/icons/idea.png")
		.attr("x", function(d){
			return timeX(d.time);
		})
		.attr("y", iconW/2+21)
		.attr("width",iconW)
		.attr("height",iconW);
	var iconLine1 = allTimeSVG.selectAll(".button1L")	
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
		.attr("y1", iconW+25)
		.attr("y2", alltimeSVGH)
		.attr("stroke","grey")

	var iconBut2 = allTimeSVG.selectAll(".button2")	
		.data(button2)
		iconBut2.enter()
		.append("image")
		.attr("class","button2")
		.attr("xlink:href", "/pelarsModules/dataCard/assets/icons/thunder.png") //just checking now put back to thunder
		.attr("x", function(d){
			return timeX(d.time);
		})
		.attr("y", iconW/2+21)
		.attr("width",iconW)
		.attr("height",iconW);

	var iconLine2 = allTimeSVG.selectAll(".button2L")	
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
		.attr("y1", iconW+25)
		.attr("y2", alltimeSVGH)
		.attr("stroke","grey")

	yOther
	    .rangePoints([50, alltimeSVGH-50]);
	// timeX2
	// .domain([startTime, endTime])
	// .range([forcewidth/4, forcewidth]);
	timeX2.domain([startTime, endTime]).range([50, w-50]);
	var g = allTimeSVG.selectAll(".ide")
		.data(ide_nest2)
		.enter()
	  	.append("g")
	  	.attr("class","ide");
		g.selectAll(".ide")
			.data(function(d) {
				return d.values;				
			}) 
			.enter()
			.append("rect")
			.attr("x", function(d){
				if(d.mod=="M" || d.mod=="B"){
					return timeX2(d.time)
				}
			})
	        .attr("y", function(d, i) {
				if(d.mod=="M" || d.mod=="B"){
		            return yOther(d.name);
	    		}
	        })
			.attr("width",function(d,i){
				if(d.mod=="M" || d.mod=="B"){
					if(d.oc==1){
						if(d.end){
							return timeX2(d.end)-timeX2(d.time);
						}else{
							return timeX2(endTime)-timeX2(d.time);				
						}
					} 
				}
				else{
					return 0;
				}
			})
			.attr("height", 5)
			.attr("fill", function(d){
				if(yOther(d.name)!=undefined){
					if(d.mod=="M"){
						// return hColor(d.name);
						return hardwareColor;
					} if (d.mod=="B"){
						return softwareColor;
						// return sColor(d.name);
					} 
				} else{
						return "none";
					}
			})
			.attr("stroke", "none")
			.attr("opacity",function(d){
				if(yOther(d.name)!=undefined){
					if(d.mod=="M" || d.mod=="B"){
							return .4;
						} 
					}
					else{
						return 0;
					}
			})









	var linkedItems = allTimeSVG.selectAll(".linkIDE")
		.data(links)
		.enter()
	  	.append("rect")
		.attr("x", function(d){
				return timeX2(d.time)
		})
        .attr("y", function(d, i) {
			if(yOther(d.source.name)!=undefined){
	        	console.log(d)
	            return yOther(d.source.name);
    		}
        })
		.attr("width", 5)
		.attr("height", function(d,i){
			if(yOther(d.source.name)!=undefined){
				return 10;
			}else{
				return 0;
			}
		})
		.attr("fill", function(d,i){
			if(d.oc==2){
				return "black";
			} else{
				return "none"
			}
		})
		.attr("stroke", function(d,i){
			if(d.oc==2){
				return "none"
			} else {
				return "black"
			}
		})
		.attr("stroke-dasharray", "1 1 1")
//JUST DRAW LINKS BY HAND


// var multimediaData = []//0;
// //go get it from server
// 	var overview;
// 	    overview = allTimeSVG.selectAll(".screen")
// 	        .data(multimedia)
// 	        .enter()
// 	        .append("image")
// 	        .attr("class", "screen")
// 	        .attr("xlink:href", function(d, i) {
// 	            return d.photS;
// 	        })
// 	        .attr("x", function(d, i) {
// 	            return timeX2(d.time); //scale based on d.time
// 	        })
// 	        .attr("y", function(d, i) {
// 	            return 100;
// 	        })
// 	        .attr("width", 100)
// 	        .attr("height", 100);





    var iconsHS;
       	iconsHS = allTimeSVG.selectAll(".iconsHS")
           .data(bothHS)
       	iconsHS.enter().append("image")
           .attr("class", "iconsHS")
           .attr("xlink:href", function(d, i) {
               return "/pelarsModules/dataCard/assets/icons/"+d.toLowerCase() + ".png";
           })
           .attr("y", function(d,i) {
        		return yOther(d)-7;
           })
           .attr("width", iconW)
           .attr("height", iconW)
           .attr("x", 2)

	allTimeSVG.selectAll(".timeText")
		.data(bothHS)
		.enter()
		.append("text")
		.attr("class","timeText")
		.attr("x", iconLMarg)
        .attr("y", function(d, i) {
            return yOther(d)+5;
        })
		.attr("fill", "black")
		.text(function(d){
			return d;
		})
		.attr("font-size",8)
		.attr("text-anchor","start")
}