var hardwareOnly = [];
var hardNames = [];
var softwareOnly = [];
var softNames = [];
var uniqueNames = [];
var uniqueHards = [];
var uniqueSofts = [];
var bothHS = [];
///////summary
var diffSoftHard;
var totalComps = [];
var	hardUseComp = [];
var	softUseComp = [];
//default values
var maxFaces = 4;
var faceRadius = 5;
var maxRadius = faceRadius*4;
var colorText = "black";

var timeSVGH = h/2-60;
var activeSVG;

function ideDataCreation(){
	var nada = d3.select("body")
		.append("svg")
		.attr("width",0)
		.attr("height",0)  
	//rectangles to represent amount of time each component was used
	//also some stuff related to 
	//this is for icons for each component used in small scale timeline
	var g = nada.selectAll(".ide")
		.data(ide_nest2)
		.enter()
	  	.append("g")
	  	.attr("class","ide");
		g.selectAll(".logs")
			.data(function(d) {
				return d.values;				
			}) 
			.enter()
			.append("g")
			.attr("class", function(d){
				if(d.name){
					if(d.mod=="M"){
						d.timeEdit = Math.round(d.time/100)*100;
						hardwareOnly.push(d);
						hardNames.push(d.name);
					}
					if(d.mod=="B"){
						d.timeEdit = Math.round(d.time/100)*100;
						softwareOnly.push(d);
						softNames.push(d.name);
					}
					uniqueHards = unique(hardNames);
					uniqueSofts = unique(softNames);
					bothHS = uniqueHards.concat(uniqueSofts);
					yOther.domain(bothHS);
				}
				return "logs";
			})
		hardwareOnly.sort(function(x, y){
		   return d3.ascending(x.time, y.time);
		})
		uniqueHWOnly = _.uniq(hardwareOnly, function(hware) { return hware.timeEdit; })

		softwareOnly.sort(function(x, y){
		   return d3.ascending(x.time, y.time);
		})
		uniqueSWOnly = _.uniq(softwareOnly, function(sware) { return sware.timeEdit; })
		
		console.log(uniqueSWOnly.length+"in sw unique")
		console.log(uniqueHWOnly.length+"in hw unique")
		// showOverTime();
		// showIDE();
}
function ideOverTime(){
	activeSVG = d3.select("#arduinoUse")
		.append("svg")
		.attr("width",forcewidth)
		.attr("height",forceheight)  
		.style("border","1px solid white") 
		.style("margin-top","1px");

	yOther
	    .rangePoints([topMarg, forceheight-topMarg/2-iconW/2]);
	timeX2.domain([startTime, endTime]).range([forcewidth/4, forcewidth]);

	d3.selectAll(".logs").append("rect")
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
				} else{
					return 0;
				}
			}
		})
		.attr("height", 5)
		.attr("fill", function(d){
			if(yOther(d.name)!=undefined){
			if(d.mod=="M"){
				return hardwareColor;
			} if (d.mod=="B"){
				return softwareColor;
					// return colorScale(d.mod);
				} else{
					return "none";
				}
			} else{
					return "none";
				}
		})
		.attr("stroke", "none")
		.attr("opacity",.4);

    var iconsHS;
       iconsHS = activeSVG.selectAll(".iconsHS")
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

	activeSVG.selectAll(".timeText")
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
	//show labels
	$(".boxname.arduinoUse").slideDown()
}

function showIDEuse(){
	var timeSVG = d3.select("#arduinoTimeline") //timeline div id
		.append("svg")
		.attr("width",w)
		.attr("height",timeSVGH)  
		.style("margin-top","1px");

	var xAxisCall = timeSVG.append('g');
    xAxisScale.domain([startTime, endTime]);

	    xAxisCall.call(xAxis)
	        .attr("class", "axis") //Assign "axis" class
	            .attr("text-anchor", "end")
	        .attr('transform', 'translate(0, ' + (timeSVGH-1) + ')');


	var kitPic = timeSVG.append("g").attr("class","backlabels")
			.append("image")
		    .attr("x", iconW/2)
		    .attr("y", timeSVGH-45)
		    .attr("width",iconW+2)
		    .attr("height",iconW+2)
	        .attr("xlink:href", "/pelarsModules/dataCard/assets/icons/btn.png")
	var	labelsKit = timeSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", iconW)
		    .attr("y", timeSVGH-22)
		    .text("Kit Use")
		    .attr("text-anchor","middle")
		    .attr("font-size",8)
	var kitColor = timeSVG.append("g").attr("class","backlabels")
			.append("circle")
		    .attr("cx", w-70)
		    .attr("cy", 23)
		    .attr("r", 4)
		    .attr("fill",hardwareColor)
		    .attr("stroke",hardwareColor)
	var	kitNameColor = timeSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", w-60)
		    .attr("y", 25)
		    .text("Hardware")
		    .attr("font-size",8)
	var kitColor2 = timeSVG.append("g").attr("class","backlabels")
			.append("circle")
		    .attr("cx", w-70)
		    .attr("cy", 8)
		    .attr("r", 4)
		    .attr("fill",softwareColor)
		    .attr("stroke",softwareColor)
	var	kitNameColor2 = timeSVG.append("g").attr("class","backlabels")
			.append("text")
		    .attr("x", w-60)
		    .attr("y", 10)
		    .text("Software")
		    .attr("font-size",8)
	for(j=startTime; j<endTime; j++){
		var thisDate = new Date(j).getMinutes();
		var thisHour = new Date(j).getHours();
		var thisD = thisHour+thisDate;
			hardUseComp[thisD] = ({ 
				"total":hardUseTotals(thisDate), 
				"time": j,
				"min":thisDate,
				"hour":thisHour
			});
			softUseComp[thisD] = ({ 
				"total":softUseTotals(thisDate), 
				"time": j,
				"min":thisDate,
				"hour":thisHour
			});
	}

    console.log("hardware in use"+uniqueHards);
    console.log("software in use"+uniqueSofts);
	console.log("components in use"+uniqueNames)
	diffSoftHard = _.difference(uniqueSofts, uniqueHards);
	console.log("this is the difference between hard and soft"+diffSoftHard)
	var both = uniqueHards.concat(diffSoftHard);
	var both2 = diffSoftHard.concat(uniqueHards);
	var bothLength;
	if(uniqueHards.length>=diffSoftHard.length){
		bothLength = uniqueHards.length;
	} else{
		bothLength = diffSoftHard.length;
	}

	//if arrays are dirty with undefined values
	hardUseComp = cleanArray(hardUseComp)
	softUseComp = cleanArray(softUseComp)

	var yHPath, ySPath, minTotal, maxTotal, pathH, index, lineS, lineH, svgPath;

	var howManyHard = [];
	var howManySoft = [];
	for (i=0; i<hardUseComp.length; i++){
		howManyHard.push(hardUseComp[i].total);
	}
	for (i=0; i<softUseComp.length; i++){
		howManySoft.push(softUseComp[i].total);
	}
	var maxHeightH = d3.max(howManyHard);
	var maxHeightS = d3.max(howManySoft);
	if(maxHeightH>maxHeightS){
		maxHeight = maxHeightH;
	} else{
		maxHeight = maxHeightS;
	}

	xPath = d3.scale.linear()
	      .domain([startTime,endTime]).range([10, w-40]);
	yHPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max hardware components
	      .range([timeSVGH-(maxFaces*faceRadius), 0]);
	ySPath = d3.scale.linear()
	      .domain([0,maxHeight+1]) //max software components
	      .range([timeSVGH-(maxFaces*faceRadius), 0]);

	//defines path for hardware area
	lineH = d3.svg.area()
      .x(function(d, i) { 
      	if(d==undefined){ return 0; }
      		else{
		       	return xPath(d.time);      			
      		}
      })
      .y0(timeSVGH-(maxFaces*faceRadius))
      .y1(function(d, i) { 
      	if(d==undefined){return 0;}
      	if(d.total<0){ return 0}
      		else{
      			return yHPath(d.total);  
      		}
      })
      .interpolate("linear");
	//defines path for software area
	lineS = d3.svg.area()
      .x(function(d, i) { 
      	if(d==undefined){ return 0; }
      		else{
		       	return xPath(d.time);      			
      		}
      })
      .y0(timeSVGH-(maxFaces*faceRadius))
      .y1(function(d, i) { 
      	if(d==undefined){return 0;}
      	if(d.total<0){ return 0}
      		else{
      			return ySPath(d.total); 
      		}
      })
      .interpolate("linear");

	//this makes the mountain type paths for hardware use and software use
	var opacityPath = .5;
	  pathH = timeSVG.append("g")
	    .append("path")
	    .attr("class","timepathH")
	  		.attr("fill",hardwareColor)
	  		.attr("opacity",opacityPath)
	  		.attr("stroke",hardwareColor);
	  	pathH
	  		.datum(hardUseComp)
		    .attr("class","timepathH")
	  		.attr("d", lineH);

	var pathS;
	  pathS = timeSVG.append("g")
	    .append("path")
	    .attr("class","timepathS")
	  		.attr("fill",softwareColor)
	  		.attr("opacity",opacityPath)
	  		.attr("stroke",softwareColor);
	  	pathS
	  		.datum(softUseComp)
	  		.attr("d", lineS);

    function ardUseTotals(index) {
        var total = 0;
        for (i = 0; i < ideData.length; i++) {
            if (ideData[i].minute == index) {
                total++;
            } else {}
        }
        return total;
    }
    function hardUseTotals(index) {
        var total = 0;
        for (i = 0; i < uniqueHWOnly.length; i++) {
            if (uniqueHWOnly[i].minute == index){ 
                total++;
            } 
        }
        return total;
    }
    function softUseTotals(index) {
        var total = 0;
        for (i = 0; i < uniqueSWOnly.length; i++) {
            if (uniqueSWOnly[i].minute == index) {
                total++;
            } 
        }
        return total;
    }

	$(".boxname.arduinoTimeline").slideDown()
}
