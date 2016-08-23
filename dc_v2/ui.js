var h = $("#container").height();
var w = $("#container").innerWidth();

// var leftMargin = 20;
var rightMargin = 35;
// var cwidth=200,cheight=200,cmargin=25,maxr=5;

//more values
var topMarg = 10;
var textH = 30;
var iconW = 15;
var iconLMarg = 27;
var textL = 10;
var anchor = "middle";

var topMargin = 100;
var svgMain, timeSVG;
//forcediagram width, height
var forcewidth = w/3-15;
var forceheight = h/3.5;
//small height
var timeSVGH = h/2;

var howManyDataStreams = 8;
var pressW = 70;
// var pressH = 30;
var center =  w/2 - pressW/2;

var rectWidth = w/(howManyDataStreams)+pressW/4;
var rectHeight = rectWidth;

var topHalf = h/2-rectHeight-10;//h/3;
var bottomHalf = h/2+rectHeight/2; //pressW;

var leftThird = rectWidth;//center-(rectWidth/2);
var rightThird = w-rectWidth*2; //center+(rectWidth/2);

// var rightThirdz = w-rectWidth; //center+(rectWidth/2);
var xaRectScale = d3.scale.linear()
	.domain([1, howManyDataStreams/2])
	.range([leftThird, rightThird])
var xbRectScale = d3.scale.linear()
	.domain([5, howManyDataStreams])
	.range([leftThird, rightThird])


var xRectScale = d3.scale.linear()
	.domain([1, 5])
	.range([leftThird*1.5, rightThird+rectWidth*1.1])
var x2RectScale = d3.scale.linear()
	.domain([5, 8])
	.range([rectWidth, w-rectWidth*2])
var x3RectScale = d3.scale.linear()
	.domain([0, howManyDataStreams-1])
	.range([rectWidth*2.4, w-rectWidth*2.4])
//colors
var hardwareColor = "#15989C";
var softwareColor = "#B19B80";
var darkColor = "#3d3d3c";
var textColor = darkColor;
var backgroundColor = "white";
var strokeColor = darkColor;
var lightColor = "none";

var leftMargin = 100;
var topMargin = 5;
setSVG();
var dataIs = [];
var theseRects;
var unClicked = 0;
var svgBack;

var clickedAgain = false;
function setSVG(){
	d3.tsv("data/descrips.tsv", function(error, dataS) {
	  // x.domain([0, d3.max(data, function(d) { return d.value; })]);
	  dataIs.push(dataS);
	  // console.log(data);
	  makeThings(dataIs);
	})
}
var prevName = [];
var index = 0;
var specialHeight = (h/howManyDataStreams)-10;
var smallY =  specialHeight-10;
var smallWidth = rectWidth/3;
var smallHeight = specialHeight/2;
var backData;
function makeThings(data){
	svgBack= d3.select("#container").append("svg")
		.attr("class", "backSVG")
		.attr("width",w).attr("height",h+topMargin)
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
	svgMain = svgBack;

	timeSVG = svgMain
		.append("g")
		.attr("class","timelineSVG")
		.attr("width", w)
		.attr("height", timeSVGH)  
		.style("margin-top","1px");
	backData = data;
console.log(data);
	var backR = svgBack.selectAll("g")
	// var backR = svgMain.selectAll("g")
		.data(data[0])
		.enter()
		.append("g")
		.attr("class", "backRects")
      	.attr("transform", function(d, i) { 
      		// console.log(i)
      		// console.log(d.name);
      		// console.log(d);
      		var x;
			// if(i<5){
				// x = xNRectScale(i); //-leftMargin; //-rectWidth/2
			// } 
			// else{
			// 	x = x2RectScale(i); //-leftMargin; //-rectWidth/2
			// }
			if(i<5){
				console.log(i+d.name+"under"+xaRectScale(i));
				x = xaRectScale(i); //-leftMargin; //-rectWidth/2
			} 
			else{
				console.log(i+d.name+"over"+xbRectScale(i))
				x = xbRectScale(i); //-leftMargin; //-rectWidth/2
			}
			var y;
			if(i<5){
				y = topHalf-topMargin;
			}else{
				y = bottomHalf-topMargin;
			}			
      		return "translate(" + x + "," + y + ")"; 
      	});
    var origStroke = 2;
  	theseRects = backR.append("rect")
		.attr("id","rectangle")
		.attr("class",function(d,i){
			return i;
		})
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.attr("fill","white")
		.attr("stroke","lightgray")  
		.attr("stroke-width",1) 

	var textName = backR.append("text")
		.attr("id","name")
		.attr("class",function(d,i){
			return "name"+i;
		})
	      .attr("y", 15)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name })
	      .attr("x", function(d,i){
	      	var adjust = $(".name"+i).width();
	      	return rectWidth/2-adjust/2;
	      });
	var textIcon = backR.append("image")
		.attr("id","capt")
		.attr("class",function(d,i){
			return "capt"+i;
		})
        .attr("xlink:href",function(d,i){
        	return "assets/icons0/"+d.name+".png"
        })
		.attr("x", rectWidth/2-pressW/2)
		.attr("y", rectHeight/2-pressW/2)
		.attr("width", pressW)
		.attr("height", pressW)
		.attr("opacity", 1);

	// var statsIcon = svgBack.append("g").attr("class","stats")
	// 	.append("image")
	// 	.attr("class","stats")
 //        .attr("xlink:href",function(d,i){
 //        	return "assets/icons0/stats.png"
 //        })
	// 	.attr("x", rectWidth/2)
	// 	.attr("y", h-rectHeight/2)
	// 	.attr("width", pressW)
	// 	.attr("height", pressW)
	// 	.attr("opacity", 1)
	// 	.on("click", function(){
	// 		makeShow("stats")
	// 	})

	var textDescrip = backR.append("text")
		.attr("id","textDescrip")
		.attr("class",function(d,i){
			return "capt"+i;
		});
		textDescrip
	      .attr("x", rectWidth/4)
	      .attr("y", rectHeight/2-pressW/2)
	      .attr("dy", ".35em")
	      .attr("opacity",0)
	      .text(function(d,i) {    
				return d.descrip;
			})
          .call(wrap, rectWidth-20);


    theseRects
        .on("click", function(d,i){
        	d3.selectAll("g.backRects")
        		.transition()
		      	.attr("transform", function(d, i) {  
		      		var x = x3RectScale(i);
					var y = smallY; //smallY // specialHeight-10	
		      		return "translate(" + x + "," + (y) + ")"; 
		      	});
			d3.selectAll("#rectangle")
        		.transition()
        		.attr("width", smallWidth) //rectWidth/3
        		.attr("height", smallHeight) //specialHeight/2
			
        	d3.selectAll("#capt")
        		.transition()
        		.attr("x", rectWidth/6-pressW/4)
        		.attr("y", specialHeight/4-pressW/4)
        		.attr("width", pressW/2)
        		.attr("height", pressW/2)
        		.attr("opacity",1);
	    	d3.selectAll("#name").attr("opacity",0);
	    	d3.selectAll("#textDescrip").attr("opacity",0);

        	var whichName;
	    	d3.select(this)
        		.attr("stroke-width", origStroke*2)
        		.attr("stroke",function(d,i){
        			whichName = d.name;
        			prevName.push(whichName);
        			index++;
        			return darkColor;
        		})

        		// .transition()
        		// .attr("width", rectWidth/2)
			if(index>1&&whichName==prevName[index-1]){
				clickedAgain = true;
				console.log(whichName+clickedAgain+prevName[index-1])
			}
        	unClicked = 1;
        	console.log(unClicked+"unClicked")
        	makeShow(whichName);
			console.log(d);
        })
        console.log(unClicked)

    	theseRects
	        .on("mouseover", function(d,i){
	        	if(unClicked ==0){
		        	d3.select("text.capt"+i)
		        		.attr("opacity",1);
		        	d3.select("image.capt"+i)
		        		.attr("opacity",0);
	        	}else{
					d3.selectAll("#name").attr("opacity",0)
				    d3.selectAll("#textDescrip").attr("opacity",0)		        		
		        }
	        })
	        .on("mouseout", function(d,i){
	        	if(unClicked==0){
		        	d3.select("text.capt"+i)
		        		.attr("opacity",0);
		        	d3.select("image.capt"+i)
		        		.attr("opacity",1);
	        	}
	        	else{
					d3.selectAll("#name").attr("opacity",0)
				    d3.selectAll("#textDescrip").attr("opacity",0)		        			        		
	        	}
	        });

	function wrap(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.1, // ems
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", 10).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", 10).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	      }
	    }
	  });
	}

	var hardwareKeyX = w+iconW;
	var softwareKeyX = hardwareKeyX;
	var radiusKey = 4;
	var hardwareKeyY = h/4;
	var softwareKeyY = h/4+(radiusKey*4);
//right top key
	// var kitColor = svgMain.append("g").attr("class","kitlabels")
	// 	.append("circle")
	//     .attr("cx", hardwareKeyX)
	//     .attr("cy", hardwareKeyY)
	//     .attr("r", radiusKey)
	//     .attr("fill",hardwareColor)
	//     .attr("stroke",hardwareColor)
	// var	kitNameColor = svgMain.append("g").attr("class","kitlabels")
	// 	.append("text")
	//     .attr("x",hardwareKeyX+radiusKey*2)
	//     .attr("y", hardwareKeyY)
	//     .text("Hardware")
	//     .attr("text-anchor",anchor)

	// var kitColor2 = svgMain.append("g").attr("class","kitlabels")
	// 	.append("circle")
	//     .attr("cx", softwareKeyX)
	//     .attr("cy", softwareKeyY)
	//     .attr("r", radiusKey)
	//     .attr("fill",softwareColor)
	//     .attr("stroke",softwareColor)
	// var	kitNameColor2 = svgMain.append("g").attr("class","kitlabels")
	// 	.append("text")
	//     .attr("x", softwareKeyX+radiusKey*2)
	//     .attr("y", softwareKeyY)
	//     .text("Software")
	//     .attr("text-anchor",anchor)

	// $.getScript('staticData.js');
	// setUpHoverbox();
}

var handsShow = false;
var buttonShow = false;
function makeShow(whichName){
	var hoverData = whichName;
	console.log(hoverData+"hover data")	
	if(hoverData=="Hands"){
		$("g.axis").show();
		showingHands();
		showingPhotos();
	}
	if(hoverData=="Phases"){
		$("g.axis").show();
		revealPhases();
	}
	if(hoverData=="Faces"){
		$("g.axis").show();
		revealFaces();
	}
	if(hoverData=="Button"){
		$("g.axis").show();
		revealButton();
	}
	if(hoverData=="Documentation"){
		$("g.axis").show();
		revealDoc();
	}
	if(hoverData == "Statistics"){
		$("g.statsRects").show()
	}
	// if(hoverData ==)
}