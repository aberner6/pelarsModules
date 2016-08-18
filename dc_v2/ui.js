var h = $("#container").height();
var w = $("#container").innerWidth();

var leftMargin = 20;
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

var xRectScale = d3.scale.linear()
	.domain([1, 4])
	.range([leftThird*1.5, rightThird+rectWidth*1.1])
var x2RectScale = d3.scale.linear()
	.domain([4, 7])
	.range([rectWidth, w-rectWidth*2])
var x3RectScale = d3.scale.linear()
	.domain([0, howManyDataStreams-1])
	.range([rectWidth*2.4, w-rectWidth*2.4])
//colors
var hardwareColor = "#15989C";
var softwareColor = "#B19B80";

var leftMargin = 5;
var topMargin = leftMargin;
setSVG();
var dataIs = [];
var theseRects;
var unClicked = 0;
var svgBack;
function setSVG(){
	d3.tsv("data/descrips.tsv", function(error, dataS) {
	  // x.domain([0, d3.max(data, function(d) { return d.value; })]);
	  dataIs.push(dataS);
	  // console.log(data);
	  makeThings(dataIs);
	})
}

function makeThings(data){
	svgBack= d3.select("#container").append("svg")
		.attr("class", "backSVG")
		.attr("width",w).attr("height",h+topMargin)
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
	svgMain = svgBack;
	// d3.select("#container").append("svg")
	// 	.attr("class", "mainSVG")
	// 	.attr("width",w).attr("height",h+topMargin)
	// 	.attr("transform", "translate(" + 0 + "," + 0 + ")")
	timeSVG = svgMain
		.append("g")
		.attr("class","timelineSVG")
		.attr("width", w)
		.attr("height", timeSVGH)  
		.style("margin-top","1px");

console.log(data);
	var backR = svgBack.selectAll("g")
	// var backR = svgMain.selectAll("g")
		.data(data[0])
		.enter()
		.append("g")
		.attr("class", "backRects")
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

	var center = svgBack
		.append("circle")
	    .attr("cx", w/2)
	    .attr("cy",topHalf)
	    .attr("r",5)
	    .attr("fill","pink");
	var center2 = svgBack
		.append("circle")
	    .attr("cx", w/2)
	    .attr("cy",bottomHalf)
	    .attr("r",5)
	    .attr("fill","pink");

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

    var specialHeight = (h/howManyDataStreams)-10;

    theseRects
        .on("click", function(d,i){
        	d3.selectAll("g.backRects")
        		.transition()
		      	.attr("transform", function(d, i) {  
		      		var x = x3RectScale(i);
					var y = specialHeight-10;
		   //    		var x = 0;
					// var y = specialHeight*2+(i*specialHeight/2);//rectHeight/3+(i*rectHeight/3);		
		      		return "translate(" + x + "," + (y) + ")"; 
		      	});
			d3.selectAll("#rectangle")
        		.transition()
        		.attr("width", rectWidth/3)
        		.attr("height", specialHeight/2)
			
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
        			return "black";
        		})

        		// .transition()
        		// .attr("width", rectWidth/2)

        	unClicked = 1;
        	console.log(unClicked+"unClicked")
        	makeShow(whichName);
console.log(d);
			updateHoverbox(d);
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

	$.getScript('staticData.js');
	setUpHoverbox();
}
var hoverbox,
	hoverboxMinWidth = 450,
	hoverboxHeight = 110,
	hoverBoxPortScaleMax = 500000000,
	hoverBoxPathScaleMax = 120000000;
function setUpHoverbox(){
//HOVERBOX
//Setup hover box
	hoverbox = svgMain.append("g")
		.attr("id", "hoverbox")
		.attr("class", "hidden")
		.attr("transform", "translate(0,0)");

	hoverbox.append("rect")
		.attr("class", "background")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", hoverboxMinWidth)
		.attr("height", hoverboxHeight);

	hoverbox.append("text")
		.attr("class", "title")
		.attr("x", 10)
		.attr("y", 24)
		.text("Port: Houston to NYC");

	hoverbox.append("rect")
		.attr("class", "imports")
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.attr("x", 10)
		.attr("y", 50)
		.attr("width", 50)
		.attr("height", 20)
		.attr("opacity", .7);

	hoverbox.append("rect")
		.attr("class", "exports")
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.attr("x", 50)
		.attr("y", 50)
		.attr("width", 50)
		.attr("height", 20)
		.attr("opacity", .7);


	hoverbox.append("rect")
		.attr("class", "total")
		.attr("stroke", "none")
		.attr("fill", "none")
		.attr("stroke-width", 0)
		.attr("x", 10)
		.attr("y", 50)
		.attr("width", 50)
		.attr("height", 20);


	hoverbox.append("text")
		.attr("class", "imports")
		.attr("x", 0)
		.attr("y", 0)
		.text("imports")
		.attr("opacity", .7);

	hoverbox.append("text")
		.attr("class", "exports")
		.attr("x", 0)
		.attr("y", 0)
		.text("exports")
		.attr("opacity", .7);


	hoverbox.append("text")
		.attr("class", "total")
		.attr("x", 0)
		.attr("y", 0)
		.text("total");
}

function makeShow(whichName){
	if(whichName=="Hands"){
		// updateHoverbox()
	}
}
function updateHoverbox(receiveData){
	var hoverData = receiveData;
	console.log(hoverData.name+"hover data")	
	if(hoverData.name=="Hands"){
		activateHoverbox("Hands");
	}
}
