var h = $("#container").height();
var w = 1425//$("#container").innerWidth();
// var leftMargin = 20;
var rightMargin = 35;
var cwidth=200,cheight=200,cmargin=25,maxr=5;

//more values
var topMarg = 10;
var textH = 30;
var iconW = 15;
var iconLMarg = 27;
var textL = 10;

// var topMargin = 100;
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

var xRectScale = d3.scale.linear()
	.domain([0, 4])
	.range([leftThird-rectWidth, rightThird+rectWidth])
var x2RectScale = d3.scale.linear()
	.domain([4, 8])
	.range([leftThird, rightThird+rectWidth*1.5])
//colors
var hardwareColor = "#15989C";
var softwareColor = "#B19B80";

var leftMargin = 5;
var topMargin = leftMargin;
setSVG();
var data = [];
function setSVG(){
	d3.tsv("data/descrips.tsv", function(error, dataIs) {
	  // x.domain([0, d3.max(data, function(d) { return d.value; })]);
	  data.push(dataIs);
	  console.log(data);
	  makeThings(data);
	})
}
function makeThings(data){
	svgMain = d3.select("#container").append("svg")
		.attr("class", "mainSVG")
		.attr("width",w+55).attr("height",h+topMargin)
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
	timeSVG = svgMain
		.append("g")
		.attr("class","timelineSVG")
		.attr("width", w)
		.attr("height", timeSVGH)  
		.style("margin-top","1px");

console.log(data);
	var backR = svgMain.selectAll("g")
		.data(data[0])
		.enter()
		.append("g")
      	.attr("transform", function(d, i) { 
      		console.log(i)
      		console.log(d.name);
      		console.log(d);
      		var x;
			if(i<4){
				x = xRectScale(i); //-leftMargin; //-rectWidth/2
			} else{
				x = x2RectScale(i); //-leftMargin; //-rectWidth/2
			}

			var y;
			if(i<4){
				y = topHalf-topMargin;
			}else{
				y = bottomHalf-topMargin;
			}			
      		return "translate(" + x + "," + y + ")"; 
      	});
  	backR.append("rect")
		.attr("class",function(d,i){
			return "rect"+d;
		})
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.attr("fill","none")
		.style("stroke-width",2)
		.attr("stroke", hardwareColor)



	var center = svgMain
		.append("circle")
	    .attr("cx", w/2)
	    .attr("cy",topHalf)
	    .attr("r",5)
	    .attr("fill","pink");
	var center2 = svgMain
		.append("circle")
	    .attr("cx", w/2)
	    .attr("cy",bottomHalf)
	    .attr("r",5)
	    .attr("fill","pink");

	backR.append("text").attr("class","textie")
	      .attr("x", rectWidth/4)
	      .attr("y", rectHeight / 2)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.descrip })
        // New added line to call the function to wrap after a given width
        .call(wrap, rectWidth-20);

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














	// var backR = svgMain.selectAll(".rect")
	// 	.data(d3.range(howManyDataStreams))
	// 	.enter()
	// 	.append("rect")
	// 	.attr("class",function(d,i){
	// 		return "rect"+d;
	// 	})
	// 	.attr("x", function(d,i){
	// 		if(i<howManyDataStreams/2){
	// 			return xRectScale(i)-leftMargin; //-rectWidth/2
	// 		} else{
	// 			return x2RectScale(i)-leftMargin; //-rectWidth/2
	// 		}
	// 	})
	// 	.attr("y", function(d,i){
	// 		if(i<howManyDataStreams/2){
	// 			return topHalf-topMargin;
	// 		}else{
	// 			return bottomHalf-topMargin;
	// 		}
	// 	})
	// 	.attr("width", rectWidth)
	// 	.attr("height", rectHeight)
	// 	.attr("fill","none")
	// 	.style("stroke-width",2)
	// 	.attr("stroke", hardwareColor)
// d3.select("rect.rect0").on("mouseover", function(d){ $(".

// 	var textXPad = rectWidth/2;
// 	var textYPad = rectHeight/2;
	var anchor = "middle";

// 	var	handPic = svgMain.append("g").attr("class","card_hand")
// 		.append("image")
// 	    .attr("x", xRectScale(0))
// 	    .attr("y",topHalf)
// 	    .attr("width", pressW)
// 	    .attr("height",pressW)
//         .attr("xlink:href","assets/icons0/mainIcon-04.png")
// 	var	labelsHand = svgMain.append("g").attr("class","card_hand")
// 		.append("text")
// 	    .attr("x", xRectScale(0)+textXPad)
// 	    .attr("y", topHalf+textYPad)
// 	    .text("Hands")
// 	    .attr("dy", "-1em")
// 	    .attr("text-anchor",anchor)

// 	var	facePic = svgMain.append("g").attr("class","backlabels")
// 		.append("image")
// 	    .attr("x", x2RectScale(4))
// 	    .attr("y", bottomHalf)
// 	    .attr("width", pressW)
// 	    .attr("height", pressW)
//         .attr("xlink:href", "assets/icons0/mainIcon-06.png")
// 	var	labelsFace = svgMain.append("g").attr("class","backlabels")
// 		.append("text")
// 	    .attr("x", x2RectScale(4)+textXPad)
// 	    .attr("y", bottomHalf+textYPad)
// 	    .text("Faces")
// 	    .attr("dy", "-1em")
// 	    .attr("text-anchor",anchor)

// //center top
// 	var buttonP = svgMain.append("g").attr("class","buttonPress")
// 		.append("image")
// 	    .attr("x", xRectScale(1))
// 	    .attr("y", topHalf)
// 		.attr("width",pressW)
// 		.attr("height",pressW)
// 		.attr("xlink:href", "assets/icons0/mainIcon-07.png")
// 	var	labelsButton = svgMain.append("g").attr("class","backlabels")
// 		.append("text")
// 	    .attr("x", xRectScale(1)+textXPad)
// 	    .attr("y", topHalf+textYPad)
// 	    .text("Button Press")
// 	    .attr("dy", "-1em")
// 	    .attr("text-anchor",anchor)

// //if just this is clicked, we see panels of images and comments
// //sized according to width/number of inputs to docu tool
// 	var cameraS = svgMain.append("g").attr("class","cameraStudent")
// 		.append("image")
// 	    .attr("x", x2RectScale(5))
// 	    .attr("y", bottomHalf)
// 		.attr("width",pressW)
// 		.attr("height",pressW)
// 		.attr("xlink:href", "assets/icons0/mainIcon-03.png")
// 	var	labelsCameraS = svgMain.append("g").attr("class","backlabels")
// 		.append("text")
// 	    .attr("x", x2RectScale(5)+textXPad)
// 	    .attr("y", bottomHalf+textYPad)
// 	    .text("Documentation")
// 	    .attr("dy", "-1em")
// 	    .attr("text-anchor",anchor)

// //right side top half
// 	var kitPic = svgMain.append("g").attr("class","backlabels")
// 		.append("image")
// 	    .attr("x", xRectScale(2))
// 	    .attr("y", topHalf)
// 	    .attr("width", pressW)
// 	    .attr("height",pressW)
//         .attr("xlink:href", "assets/icons0/mainIcon-05.png")
// 	var	labelsKit = svgMain.append("g").attr("class","backlabels")
// 		.append("text")
// 	    .attr("x", xRectScale(2)+textXPad)
// 	    .attr("y", topHalf+textYPad)
// 	    .text("Kit")
// 	    .attr("dy", "-1em")
// 	    .attr("text-anchor",anchor)
// //right side bottom half
// 	var linksMade = svgMain.append("g").attr("class","backlabels")
// 		.append("image")
// 	    .attr("x", x2RectScale(6))
// 	    .attr("y", bottomHalf)
// 	    .attr("width", pressW)
// 	    .attr("height",pressW)
//         .attr("xlink:href", "assets/icons0/mainIcon-02.png")
// 	var	labelsLinks = svgMain.append("g").attr("class","backlabels")
// 		.append("text")
// 	    .attr("x", x2RectScale(6)+textXPad)
// 	    .attr("y", bottomHalf+textYPad)
// 	    .text("Links Made")
// 	    .attr("dy", "-1em")
// 	    .attr("text-anchor",anchor)

// //right side bottom half
// 	var phasePic = svgMain.append("g").attr("class","backlabels")
// 		.append("image")
// 	    .attr("x", xRectScale(3))
// 	    .attr("y", topHalf)
// 	    .attr("width", pressW)
// 	    .attr("height",pressW)
//         .attr("xlink:href", "assets/icons0/mainIcon-01.png")
// 	var	labelsPhase = svgMain.append("g").attr("class","backlabels")
// 		.append("text")
// 	    .attr("x", xRectScale(3)+textXPad)
// 	    .attr("y", topHalf+textYPad)
// 	    .text("Project Phases")
// 	    .attr("dy", "-1em")
// 	    .attr("text-anchor",anchor)










	var hardwareKeyX = w+iconW;
	var softwareKeyX = hardwareKeyX;
	var radiusKey = 4;
	var hardwareKeyY = h/4;
	var softwareKeyY = h/4+(radiusKey*4);
//right top key
	var kitColor = svgMain.append("g").attr("class","kitlabels")
		.append("circle")
	    .attr("cx", hardwareKeyX)
	    .attr("cy", hardwareKeyY)
	    .attr("r", radiusKey)
	    .attr("fill",hardwareColor)
	    .attr("stroke",hardwareColor)
	var	kitNameColor = svgMain.append("g").attr("class","kitlabels")
		.append("text")
	    .attr("x",hardwareKeyX+radiusKey*2)
	    .attr("y", hardwareKeyY)
	    .text("Hardware")
	    .attr("text-anchor",anchor)

	var kitColor2 = svgMain.append("g").attr("class","kitlabels")
		.append("circle")
	    .attr("cx", softwareKeyX)
	    .attr("cy", softwareKeyY)
	    .attr("r", radiusKey)
	    .attr("fill",softwareColor)
	    .attr("stroke",softwareColor)
	var	kitNameColor2 = svgMain.append("g").attr("class","kitlabels")
		.append("text")
	    .attr("x", softwareKeyX+radiusKey*2)
	    .attr("y", softwareKeyY)
	    .text("Software")
	    .attr("text-anchor",anchor)

}
