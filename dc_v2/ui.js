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

	// var center = svgBack
	// 	.append("circle")
	//     .attr("cx", w/2)
	//     .attr("cy",topHalf)
	//     .attr("r",5)
	//     .attr("fill","pink");
	// var center2 = svgBack
	// 	.append("circle")
	//     .attr("cx", w/2)
	//     .attr("cy",bottomHalf)
	//     .attr("r",5)
	//     .attr("fill","pink");

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
	setUpHoverbox();
}

var hoverbox,
	hoverboxMinWidth = 200,
	hoverboxHeight = 110,
	hoverBoxPortScaleMax = 500000000,
	hoverBoxPathScaleMax = 120000000;
var textStart = 10;
var rectStart = textStart*5;
var hovRectWidth = hoverboxMinWidth-rectStart-textStart;
function setUpHoverbox(){
//HOVERBOX
//Setup hover box
//placement of hoverbox X 
//needs to be based on hoverbox width and overall width

	hoverbox = svgMain.append("g")
		.attr("id", "hoverbox")
		.attr("class", "hidden")
		// translate(335,118)
		.attr("transform", "translate(" + (335) + "," + (118) + ")"); //967
		//hand rect is at 
		// translate(469.20001220703125,75)

	hoverbox.append("rect")
		.attr("class", "background")
		.attr("x", 0)
		.attr("y", 0)
		.attr("fill",backgroundColor)
		.attr("stroke",strokeColor)
		.attr("stroke-width",4)
		.attr("width", hoverboxMinWidth)
		.attr("height", hoverboxHeight);

	hoverbox.append("text")
		.attr("class", "title")
		.attr("x", textStart)//hoverboxMinWidth-9) //191
		.attr("y", 24)
		.attr("text-anchor","start")
		.attr("fill",textColor)
		.text("Data: ");
	var dataRect = 2;
	var dataOpa = .8;
	
	//if data type is hands, hov rect height is 20 - relative to the number of data streams shown
	var	hovRectHeight = 20;
	var buffer = 10;
	var rect1Y = 50;
	var rect2Y = rect1Y + hovRectHeight+buffer;
	var titleY = 24;


	hoverbox.append("rect")
		.attr("class", "total")
		.attr("stroke", strokeColor)
		.attr("fill", "none")
		.attr("stroke-width", 1)
		.attr("x", rectStart)
		.attr("y", rect1Y)
		.attr("width", hovRectWidth)
		.attr("height", hovRectHeight);
	hoverbox.append("rect")
		.attr("class", "imports")
		.attr("x", 10)
		.attr("y", rect1Y)
		.attr("fill", "grey")
		.attr("width", dataRect)
		.attr("height", hovRectHeight)
		.attr("opacity", dataOpa);
	hoverbox.append("rect")
		.attr("class", "exports")
		.attr("x", 50)
		.attr("y", rect1Y)
		.attr("fill","red")
		.attr("width", dataRect)
		.attr("height", hovRectHeight)
		.attr("opacity", dataOpa);
	hoverbox.append("text")
		.attr("class", "imports1")
		.attr("x", textStart)
		.attr("y", rect1Y+hovRectHeight/2)
		.text("Speed");



	hoverbox.append("rect")
		.attr("class", "total2")
		.attr("stroke", strokeColor)
		.attr("fill", "none")
		.attr("stroke-width", 1)
		.attr("x", rectStart)
		.attr("y", rect2Y)
		.attr("width", hovRectWidth)
		.attr("height", hovRectHeight);
	hoverbox.append("rect")
		.attr("class", "imports2")
		.attr("x", 10)
		.attr("y", rect2Y)
		.attr("fill", "grey")
		.attr("width", dataRect)
		.attr("height", hovRectHeight)
		.attr("opacity", dataOpa);
	hoverbox.append("rect")
		.attr("class", "exports2")
		.attr("x", 50)
		.attr("y", rect2Y)
		.attr("fill","red")
		.attr("width", dataRect)
		.attr("height", hovRectHeight)
		.attr("opacity", dataOpa);
	hoverbox.append("text")
		.attr("class", "imports2")
		.attr("x", textStart)
		.attr("y", rect2Y+hovRectHeight/2)
		.text("Prox.");
}

var handsShow = false;
var buttonShow = false;
function makeShow(whichName){
	//could just show/hide hoverbox with jquery toggle?
	if(whichName=="Hands" && handsShow==false){
		numSelected = numSelected+1;
		console.log("showing because hands were clicked"+numSelected)
		updateHoverbox(whichName);
	}
	if(clickedAgain==true){
		numSelected = numSelected-1;
		console.log("hiding because unclicked"+numSelected);
		hideHoverbox();
	}

	if(whichName=="Button" && buttonShow==false && handsShow==true){
		numSelected = numSelected+1;
		console.log("2 selected"+numSelected);
		buttonShow = true;		
	}
	// if(whichName=="Button" && buttonShow==false handsShow==false){
	// 	numSelected = numSelected+1;
	// 	console.log("1 selected"+numSelected);
	// 	buttonShow = true;		
	// }
}
function updateHoverbox(receiveData){
	var hoverData = receiveData;
	console.log(hoverData+"hover data")	
	if(hoverData=="Hands"){
		$("g.axis").show();
		// showPhotos();
		showingHands();
		showingPhotos();
		activateHoverbox("Hands");
	}
}
