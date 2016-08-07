var h = $("#container").height();
var w = $("#container").width()-55;
var leftMargin = 20;
var rightMargin = 35;
var cwidth=200,cheight=200,cmargin=25,maxr=5;

//more values
var topMarg = 10;
var textH = 30;
var iconW = 15;
var iconLMarg = 27;
var textL = 10;

var topMargin = 100;
var svgMain, timeSVG;
//forcediagram width, height
var forcewidth = w/3-15;
var forceheight = h/3.5;
//small height
var timeSVGH = h/2;

var howManyDataStreams = 6;
var pressW = 20;
// var pressH = 30;
var center =  w/2 - pressW/2;
var leftThird = center-w/4;
var rightThird = center+w/4;
var topHalf = h/3;
var bottomHalf = h/2+pressW;
var anchor = "start";

var xRectScale = d3.scale.linear()
	.domain([0, howManyDataStreams])
	.range([w/8, w-w/10])

//colors
var hardwareColor = "#15989C";
var softwareColor = "#B19B80";

setSVG();

function setSVG(){

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

	var backR = svgMain.selectAll(".backRects")
		.data(d3.range(howManyDataStreams))
		.enter()
		.append("rect")
		.attr("class","backRects")
		.attr("x", function(d,i){
			if(i<howManyDataStreams/2){
				return xRectScale(i);
			} else{
				return xRectScale(i-(howManyDataStreams/2));
			}
		})
		.attr("y", function(d,i){
			if(i<howManyDataStreams/2){
				return topHalf;
			}else{
				return bottomHalf;
			}
		})
		.attr("width", w/(howManyDataStreams/2))
		.attr("height", h/2-topHalf)
		.attr("fill","blue")
		.attr("stroke","white")





	var	handPic = svgMain.append("g").attr("class","backlabels")
		.append("image")
	    .attr("x", leftThird)
	    .attr("y",topHalf)
	    .attr("width", pressW)
	    .attr("height",pressW)
        .attr("xlink:href","assets/hand.png")
	var	labelsHand = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", leftThird)
	    .attr("y", topHalf)
	    .text("Hands")
	    .attr("dy", "-1em")
	    .attr("text-anchor",anchor)
	var	facePic = svgMain.append("g").attr("class","backlabels")
		.append("image")
	    .attr("x", leftThird)
	    .attr("y", bottomHalf)
	    .attr("width", pressW)
	    .attr("height", pressW)
        .attr("xlink:href", "assets/face2.png")
	var	labelsFace = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", leftThird)
	    .attr("y", bottomHalf)
	    .text("Faces")
	    .attr("dy", "-1em")
	    .attr("text-anchor",anchor)

//center top
	var buttonP = svgMain.append("g").attr("class","buttonPress")
		.append("image")
	    .attr("x", center)
	    .attr("y", topHalf)
		.attr("width",pressW)
		.attr("height",pressW)
		.attr("xlink:href", "assets/icons/idea.png")
	var	labelsButton = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", center)
	    .attr("y", topHalf)
	    .text("Button Press")
	    .attr("dy", "-1em")
	    .attr("text-anchor",anchor)

//if just this is clicked, we see panels of images and comments
//sized according to width/number of inputs to docu tool
	var cameraS = svgMain.append("g").attr("class","cameraStudent")
		.append("image")
	    .attr("x", center)
	    .attr("y", bottomHalf)
		.attr("width",pressW)
		.attr("height",pressW)
		.attr("xlink:href", "assets/camera.png")
	var	labelsCameraS = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", center)
	    .attr("y", bottomHalf)
	    .text("Documentation")
	    .attr("dy", "-1em")
	    .attr("text-anchor",anchor)

//right side top half
	var kitPic = svgMain.append("g").attr("class","backlabels")
		.append("image")
	    .attr("x", rightThird)
	    .attr("y", topHalf)
	    .attr("width", pressW)
	    .attr("height",pressW)
        .attr("xlink:href", "assets/kit.png")
	var	labelsKit = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", rightThird)
	    .attr("y", topHalf)
	    .text("Kit")
	    .attr("dy", "-1em")
	    .attr("text-anchor",anchor)
//right side bottom half
	var linksMade = svgMain.append("g").attr("class","backlabels")
		.append("image")
	    .attr("x", rightThird)
	    .attr("y", bottomHalf)
	    .attr("width", pressW)
	    .attr("height",pressW)
        .attr("xlink:href", "assets/links.jpg")
	var	labelsLinks = svgMain.append("g").attr("class","backlabels")
		.append("text")
	    .attr("x", rightThird)
	    .attr("y", bottomHalf)
	    .text("Links Made")
	    .attr("dy", "-1em")
	    .attr("text-anchor",anchor)

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
