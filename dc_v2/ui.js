var h = $("#container").height();
var w = $("#container").innerWidth();
var h2 = h*1.6;
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
var numClicked = 0;
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
	.domain([0,5])
	.range([leftThird+rectWidth, rightThird-rectWidth-iconW*2])
var xbRectScale = d3.scale.linear()
	.domain([2,9])
	.range([leftThird+rectWidth/2, rightThird-rectWidth])


var xRectScale = d3.scale.linear()
	.domain([1, 5])
	.range([leftThird*1.5, rightThird+rectWidth*1.1])
var x2RectScale = d3.scale.linear()
	.domain([5, 8])
	.range([rectWidth, w-rectWidth*2])
var x3RectScale = d3.scale.linear()
	.domain([0, howManyDataStreams])
	.range([leftThird+rectWidth, rightThird-rectWidth/2])

	// .range([rectWidth*2.4, w-rectWidth*2.4])
//colors
var hardwareColor = "#15989C";
var softwareColor = "#B19B80";
var darkColor = "#3d3d3c";
var textColor = darkColor;
var backgroundColor = "white";
var strokeColor = darkColor;
var lightColor = "none";

var typeScale = d3.scale.ordinal()
  .domain([0, 4])
  .range(["green","teal","turquoise","aquamarine", "blue"]);

var leftMargin = 100;
var topMargin = 5;
setSVG();
var dataIs = [];
var theseRects;
var unClicked = 0;
var svgBack;
var clicked = false;
var clickedAgain = false;

var topIcons;
var bottomIcons;
var belowIcons;

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
var smallY =  specialHeight/2; //-10;

var smallWidth = rectWidth/3;
var smallHeight = specialHeight/2;


topIcons = smallY/2;
bottomIcons = topIcons+smallHeight;
belowIcons = bottomIcons+smallHeight*2;
// var medWidth = rectWidth/2;
// var medHeight = specialHeight
var backData;
var sumSVG;
var behindSVG;
var svgT;

function makeThings(data){
	svgBack= d3.select("#container").append("svg")
		.attr("class", "backSVG")
		.attr("width",w).attr("height",h)
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
	svgMain = svgBack;

	timeSVG = svgMain
		.append("g")
		.attr("class","timelineSVG")
		.attr("width", w)
		.attr("height", timeSVGH)  
		.style("margin-top","1px");

	svgT = d3.select("#container").append("svg")
		.attr("class", "svgTwo")
		.attr("width",w).attr("height",h)
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
	behindSVG = d3.select(".svgTwo").append("svg:rect").attr("class","behindRect")
		.attr("x",10).attr("y",belowIcons-30)
		.attr("fill","white").attr("width",w-30).attr("height",h)
		// .attr("opacity",0)
// d3.selectAll(".behind").transition().attr("width",w-30)
	// sumSVG= timeSVG.append("svg")
	// 	.attr("class", "sumSVG")
	// 	.style("position","absolute").style("left","0px")
	// 	.style("display","none")
	// 	.attr("width",w).attr("height",h-topMargin)
	// 	.attr("transform", "translate(" + 0 + "," + h+topMargin + ")")
d3.select(".backSVG").append("svg:circle").attr("cx",w/2 - 5).attr("cy",h/4).attr("fill","pink").attr("r",10)
	backData = data;
console.log(data);
var marginal = 1.2;
	var backR = svgBack.selectAll("g")
	// var backR = svgMain.selectAll("g")
		.data(data[0])
		.enter()
		.append("g")
		.attr("class", "backRects")
      	.attr("transform", function(d, i) { 
      		var x,y;
      		if(d.type==1){
				y = topHalf*marginal //-topMargin;
				x = leftThird+rectWidth-iconW*2; 
      			return "translate(" + x + "," + y + ")";       			
      		}
      		if(d.type==4){
				y = topHalf*marginal //-topMargin;
				x = rightThird-rectWidth+iconW*2; 
      			return "translate(" + x + "," + y + ")";     			
      		}
      		if(d.type==2){
      			console.log(i);
				y = topHalf*marginal+topMargin*iconW;
				x = xaRectScale(i); //-leftMargin; //-rectWidth/2
      			return "translate(" + x + "," + y + ")"; 
			} 
			if(d.type==3){
				console.log(i);
				y = topHalf*marginal+topMargin*iconW*1.5;
				x = xbRectScale(i); //-leftMargin; //-rectWidth/2
	      		return "translate(" + x + "," + y + ")"; 
      		}	
      	});
    var origStroke = 2;
  	theseRects = backR.append("rect")
		.attr("id","rectangle")
		.attr("class",function(d,i){
			return d.name;
		})
		.attr("width", function(d){
			if(d.name=="Timeline" || d.name=="Summary"){
				return rectWidth;
			}else{
				return smallWidth;
			}

		})
		.attr("height", function(d){
			if(d.name=="Timeline" || d.name=="Summary"){
				return rectHeight;
			}else{
				return 0;
			}
		})
		.attr("fill","white")
		.attr("stroke",function(d,i){
				if(d.side==3){
					return "lightblue"
				} else{
					return "lightgray"
				}
			})
		.attr("stroke-width",1)
		.attr("opacity",function(d,i){
      		if(d.name=="Timeline" || d.name=="Summary"){
				return 1;
			} else{
			}			
		})

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
			if(d.name=="Timeline" || d.name=="Summary"){
		      	return rectWidth/2-adjust/2;
			}else{
		      	return smallWidth/2-adjust/2;
			}
	      })
	      .attr("opacity", function(d){
			if(d.name=="Timeline" || d.name=="Summary"){
				return 1;
			}
			else{
				return 0;
			}
	      })
	var textIcon = backR.append("image")
		.attr("id","capt")
		.attr("class",function(d,i){
			return "capt"+i;
		})
        .attr("xlink:href",function(d,i){
        	return "assets/icons0/"+d.name+".png"
        })
		.attr("x", function(d,i){
			if(d.name=="Timeline" || d.name=="Summary"){
				return rectWidth/2-pressW/2;
			}
			else{
				return rectWidth/6-pressW/4;
			}
		})
		.attr("y", function(d){
			if(d.name=="Timeline" || d.name=="Summary"){
				return rectHeight/2-pressW/2;
			}else{
				return specialHeight/4-pressW/4;
			}
		})
		.attr("width", function(d){
			if(d.name=="Timeline" || d.name=="Summary"){
				return pressW;
			}
			else{
				return pressW/2;
			}
		})
		.attr("height", function(d){
			if(d.name=="Timeline" || d.name=="Summary"){
				return pressW;
			}
			else{
				return pressW/2;
			}
		})
		.attr("opacity", function(d){
			if(d.name=="Timeline" || d.name=="Summary"){
				return 1;
			}
			else{
				// return 0;
			}
		})
        .on("click", function(d,i){
        	console.log("image clicked");
        	// d3.select(this).each(moveToFront);
        	d3.selectAll("g.backRects")
        		.transition()
		      	.attr("transform", function(d, i) {  
		      		var x, y;
					// y = smallY-smallHeight-origStroke*2;
		      		if(d.name=="Timeline" || d.name=="Summary"){
			      		x = x3RectScale(i);
						y = topIcons; //smallY // specialHeight-10	
			      		return "translate(" + x + "," + (y) + ")";
			      	} else{
			      		x = x3RectScale(i);
						y = bottomIcons; //smallY // specialHeight-10	 
			      		return "translate(" + x + "," + (y) + ")";			      		
			      	}		      			
		   //    			x=center-smallWidth/2-origStroke;
		   //    			return "translate(" + x + "," + y + ")"; 
		   //    		}
		   //    		if(d.name=="Summary"){
		   //    			x=center+smallWidth/2-origStroke;;
		   //    			return "translate(" + x + "," + y + ")"; 
		   //    		}else{
			   //    		x = x3RectScale(i);
						// y = smallY; //smallY // specialHeight-10	
			   //    		return "translate(" + x + "," + (y) + ")"; 		      			
		      		// }
		      	})

        	d3.selectAll("#capt")
        		.transition()
        		.attr("x", rectWidth/6-pressW/4)
        		.attr("y", specialHeight/4-pressW/4)
        		.attr("width", pressW/2)
        		.attr("height", pressW/2)
        		.attr("opacity",1);
        	clicked = true;
        	if(clicked){
		    	d3.selectAll("#name").transition().attr("opacity",0);
		    	d3.selectAll("#textDescrip").attr("opacity",0);
        	}

        	var whichName;
        	var whichSide;
	    	d3.select(this)
        		.attr("stroke-width", function(d,i){
        			whichName = d.name;
        			whichSide = d.side;
        			console.log(whichSide);
        			prevName.push(whichName);
        			index++;      			
        			return 0;
        		})
			d3.selectAll("#rectangle")
        		.transition()
        		.attr("opacity",1)
        		.attr("width", smallWidth)
        		.attr("height", smallHeight) 
        	d3.selectAll("#rectangle"+"."+whichName)
        		.attr("stroke-width", function(d,i){
    				return origStroke*2;
        		})

						// d3.selectAll("#rectangle").transition()
			   //      		.attr("stroke-width", function(d,i){
			   //      			if(d.side==whichSide || d.side==3){
				  //       			return origStroke*2;
			   //      			}
			   //      		})  
        		// .transition()
        		// .attr("width", rectWidth/2)
			if(index>1&&whichName==prevName[index-1]){
				clickedAgain = true;
				console.log(whichName+clickedAgain+prevName[index-1])
			}
        	unClicked = 1;
        	// console.log(unClicked+"unClicked")
        	makeShow(whichName);
			console.log(d);
        })

    	textIcon
	        .on("mouseover", function(d,i){
	        	if(unClicked ==0 && (d.name=="Timeline" || d.name=="Summary")){
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
		      	if (d.name=="Timeline" || d.name=="Summary"){
					return d.descrip;
				} else{}
			})
          .call(wrap, rectWidth-20);


    theseRects
        .on("click", function(d,i){
        	console.log("rect clicked")
        	d3.selectAll("g.backRects")
        		.transition()
		      	.attr("transform", function(d, i) {  
		      		var x, y;
					// y = smallY-smallHeight-origStroke*2;
		   //    		if(d.name=="Timeline"){
		   //    			x=center-smallWidth/2-origStroke;
		   //    			return "translate(" + x + "," + y + ")"; 
		   //    		}
		   //    		if(d.name=="Summary"){
		   //    			x=center+smallWidth/2+origStroke;
		   //    			return "translate(" + x + "," + y + ")"; 
		   //    		}else{
			   //    		x = x3RectScale(i);
						// y = smallY; //smallY // specialHeight-10	
			   //    		return "translate(" + x + "," + (y) + ")"; 		      			
		      		// }
		      		if(d.name=="Timeline" || d.name=="Summary"){
			      		x = x3RectScale(i);
						y = topIcons; //smallY // specialHeight-10	
			      		return "translate(" + x + "," + (y) + ")";
			      	} else{
			      		x = x3RectScale(i);
						y = bottomIcons; //smallY // specialHeight-10	
			      		return "translate(" + x + "," + (y) + ")";			      		
			      	}	
		      	})

			d3.selectAll("#rectangle")
        		.transition()
				.attr("opacity",1)
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

        	var whichName, whichSide;
	    	d3.select(this)
        		// .attr("stroke-width", origStroke*2)
        		.attr("stroke-width",function(d,i){
        			whichName = d.name;
        			whichSide = d.side;
        			console.log(whichSide)
        			prevName.push(whichName);
        			index++;
        			return origStroke*2;
        		})
			// d3.selectAll("#rectangle")
			// 	// .transition()
   //      		.attr("stroke-width", function(d,i){
   //      			if(d.side==whichSide || d.side==3){
	  //       			return origStroke*2;
   //      			}
   //      		})  
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
	        	if(unClicked ==0 && (d.name=="Timeline" || d.name=="Summary")){
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
	$('image#capt').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				var dis = this.__data__;
		  		// var url1 = dis.name;//+"?token="+token;
				// console.log(dis);
				// var deferit = $.Deferred();
				// deferit
				//   .done(func1)
				// deferit.resolve();
				// function func1(){
				// 	$.get(url1, function(capt){
				// 		captionDoc = capt;
				// 	})
				// }
					return dis.name;
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



	// $.getScript('staticData.js');
	// setUpHoverbox();
}

var handsShow = false;
var buttonShow = false;

function makeShow(whichName){
	var hoverData = whichName;
	console.log(hoverData+"hover data")	
	if(hoverData == "Timeline"){
		$("g.axis").show();
	}
	if(hoverData=="Body"){
		numClicked+=2;
		d3.selectAll(".graphImage").transition().attr("opacity",1);
		revealFaces();
		showingHands();
		if(numClicked==4){
			moveDown();
		}
		console.log(numClicked+"numClicked")
	}
	if(hoverData=="Phases"){
		revealPhases();
	}
	if(hoverData=="Button"){
		revealButton();
	}
	if(hoverData=="Documentation"){
		revealDoc();
		revealPhotos();
		// overview.transition().attr("height",timelineImgHeight)
		// showingPhotos();
	}
	if(hoverData=="Kit"){
		numClicked+=2;
		d3.selectAll(".kitlabels").transition().attr("opacity",1)
		$("g#arduinoPath").show();
		$("g#arduinoRect").show();
		if(numClicked==4){
			moveDown();
		}
		console.log(numClicked+"numClicked")
	}
	if(hoverData == "Summary"){
		$("g.statsRects").show()
	}
	if(hoverData=="Links"){
		$("#plot").show();
	}
	// for (i=0; i<prevName.length; i++){
		// if((prevName[i]=="Body")&&(prevName[i-1]=="Kit")){
		// var ready = false;	
		// if(numClicked==4){
		// 	revealFaces();
		// 	showingHands();
		// 	d3.selectAll(".graphImage")
		// 		.transition()
		// 		.attr("opacity",1)
		// 		.each("end", function(){
		// 			// callMinis();	
		// 			ready=true;				
		// 		})
		// 	if(ready){
		// 		callMinis();
		// 	}
		// }
	// }
}
function moveDown(){
	callMinis();
}
function callMinis(){
	miniOne();
	miniTwo();
	miniThree();
	miniFour();	
}

function miniOne(){
	var durTrans = 500;
// #1
//to transition the hand paths
	yBottom = belowIcons*2;
	yTop = lineHY;

 	yActivePath 
		.range([yBottom, yTop]); 
//hand1
 	lineActive1 
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle")
  	pathActive1
  		.transition().duration(durTrans)  
  		.attr("d", lineActive1);
//hand2
 	lineActive2
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle")
  	pathActive2
  		.transition().duration(durTrans)  
  		.attr("d", lineActive2);
//hand3
 	lineActive3
		.y(function(d, i) { return yActivePath(d); })
		.interpolate("bundle")
  	pathActive3
  		.transition().duration(durTrans)  
  		.attr("d", lineActive3);
	
	d3.selectAll("circle.graphImage").transition().attr("cy",yBottom);
	d3.selectAll("line.graphImage").transition().attr("y1",yBottom);
	d3.selectAll("#hands.graphImage").transition().attr("y",yBottom);
	d3.selectAll(".graphImage").transition().attr("opacity",1);
	revealFaces();
	showingHands();
}
function unshowBody(){
	d3.selectAll(".graphImage").transition().attr("opacity",0);
	hideFaces(); //dereveal
	hideHands(); //hide
	expandKit();
}

function hideFaces(){
	timeX.range([leftMargin, leftMargin]);

	$(".faceTitle").hide();

	d3.selectAll(".faceLine")
	    .attr("x1", timeX(startTime))
	    .attr("x2", timeX(endTime))

	d3.selectAll(".pathLine")
		.transition()
	    .attr("x1", timeX(startTime))
	    .attr("x2", timeX(endTime))
	    .attr("opacity",0)
	    .attr("y1", faceY)
	    .attr("y2", faceY);

	d3.selectAll(".facerect")	
		.transition()
		.attr("fill", "none")
		.attr("x", function(d){
			return timeX(d.time);
		})
}

function miniTwo(){
// #2
//TO TRANSITION THE FACES
// faceY=yTop+2*maxTotal*faceRadius;
	faceY=yBottom-2*maxTotal*faceRadius;
	d3.selectAll(".facerect")	
		.transition()
	    .attr("y", function(d,i){
	    	return faceY-(d.num*faceRadius);
	    })
	d3.selectAll("#face.graphImage").transition().attr("y",faceY-iconW);

	var faceHeight = 2*maxTotal*faceRadius;
	d3.selectAll(".faceLine")
		.transition()
	    .attr("y1", yBottom-faceHeight)
	    .attr("y2", yBottom-faceHeight);
}
function expandBody(){
	d3.selectAll(".graphImage").transition().attr("opacity",1);
	revealFaces();
	showingHands();
	// faceY=yBottom-2*maxTotal*faceRadius;
	// d3.selectAll(".facerect")	
	// 	.transition()
	//     .attr("y", function(d,i){
	//     	return faceY-(d.num*faceRadius);
	//     })
	// d3.selectAll("#face.graphImage").transition().attr("y",faceY-iconW);

	// var faceHeight = 2*maxTotal*faceRadius;
	// d3.selectAll(".faceLine")
	// 	.transition()
	//     .attr("y1", yBottom-faceHeight)
	//     .attr("y2", yBottom-faceHeight);	
}
function expandKit(){
	faceY = lineHY;
	yHPath.range([faceY, belowIcons]);

	//CHANGE THE Y PLACEMENT ACCORDINGLY
		d3.selectAll("circle.hardware")
			.transition().attr("cy", faceY-radiusKey)
		d3.selectAll("circle.software")
			.transition().attr("cy", faceY-(radiusKey*5))
		d3.selectAll("text.hardware")
			.transition().attr("y", faceY)
		d3.selectAll("text.software")
			.transition().attr("y", faceY-(radiusKey*4))

		d3.selectAll(".pathLine")
			.transition()
		    .attr("y1", faceY)
		    .attr("y2", faceY);

	lineH = d3.svg.area()
			.x(function(d, i) { 
				if(d==undefined){ console.log("no") }
					else{
			       	return timeXTrue(parseInt(d.key));      			
					}
			})
			.y0(faceY)
			.y1(function(d, i) { 
				if(d==undefined){return 0;}
				if(d.total<0){ return 0}
					else{
						return yHPath(d.values[0].total); 
					}
			})
			.interpolate("linear");
	pathH
		.transition().attr("class","timepathH")
		.attr("d", lineH);

	ySPath.range([faceY, belowIcons]);
	lineS = d3.svg.area()
			.x(function(d, i) { 
				if(d==undefined){ console.log("no") }
					else{
			       	return timeXTrue(parseInt(d.key));      			
					}
			})
			.y0(faceY)
			.y1(function(d, i) { 
				if(d==undefined){return 0;}
				if(d.total<0){ return 0}
					else{
						return ySPath(d.values[0].total); 
					}
			})
			.interpolate("linear");
	pathS
		.transition().attr("class","timepathS")
		.attr("d", lineS);	
}
var unshowKit;
unshowKit = function(){
	d3.selectAll(".kitlabels").transition().attr("opacity",0)
	$("g#arduinoPath").hide();
	$("g#arduinoRect").hide();
	expandBody();
}

function miniThree(){
	// #3
	//for the arduino paths
	faceY=yBottom-4*maxTotal*faceRadius;

	yHPath.range([faceY, belowIcons]);

	//CHANGE THE Y PLACEMENT ACCORDINGLY
		d3.selectAll("circle.hardware")
			.transition().attr("cy", faceY-radiusKey)
		d3.selectAll("circle.software")
			.transition().attr("cy", faceY-(radiusKey*5))
		d3.selectAll("text.hardware")
			.transition().attr("y", faceY)
		d3.selectAll("text.software")
			.transition().attr("y", faceY-(radiusKey*4))

		d3.selectAll(".pathLine")
			.transition()
		    .attr("y1", faceY)
		    .attr("y2", faceY);

	lineH = d3.svg.area()
			.x(function(d, i) { 
				if(d==undefined){ console.log("no") }
					else{
			       	return timeXTrue(parseInt(d.key));      			
					}
			})
			.y0(faceY)
			.y1(function(d, i) { 
				if(d==undefined){return 0;}
				if(d.total<0){ return 0}
					else{
						return yHPath(d.values[0].total); 
					}
			})
			.interpolate("linear");
	pathH
		.transition().attr("class","timepathH")
		.attr("d", lineH);

	ySPath.range([faceY, belowIcons]);
	lineS = d3.svg.area()
			.x(function(d, i) { 
				if(d==undefined){ console.log("no") }
					else{
			       	return timeXTrue(parseInt(d.key));      			
					}
			})
			.y0(faceY)
			.y1(function(d, i) { 
				if(d==undefined){return 0;}
				if(d.total<0){ return 0}
					else{
						return ySPath(d.values[0].total); 
					}
			})
			.interpolate("linear");
	pathS
		.transition().attr("class","timepathS")
		.attr("d", lineS);	
}
function miniFour(){
// #4?
//to transition the logs
	// var lineHY = h/4;
	yOther
	    .rangePoints([topMarg, lineHY/2]);

	d3.selectAll(".iconsHS").transition().attr("y", function(d, i) {
		return yOther(d)-7
    })
	d3.selectAll(".timeText").transition().attr("y", function(d, i) {
        return yOther(d)+5;
    })
	d3.selectAll("#ardRectz").transition().attr("y", function(d, i) {
		if(d.mod=="M" || d.mod=="B"){
            return yOther(d.name);
		}
    })
	d3.selectAll(".logCC").transition()
			.attr("y1", topMarg) 
		    .attr("y2", lineHY/2) 	
}

var moveToFront = function() { 
    this.parentNode.appendChild(this); 
}



	// if(hoverData=="Hands"){
	// 	// $("g.axis").show();
	// 	showingHands();
	// 	showingPhotos();
	// }
	// if(hoverData=="Faces"){
		// $("g.axis").show();
		// revealFaces();
	// }
