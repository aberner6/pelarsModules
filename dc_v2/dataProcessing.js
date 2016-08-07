// $.ajaxSetup({
// 	async: false
// });

var thisSession = 0;
var token = 0;


//in UI
var h = $("#container").height();
var w = $("#container").width()-55;
//FIDGETING
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
//in UI



//data tools
var nested_data;

// 1. get token
// 2. get session number
// 3. get data and create first idea of starttime/endtime
// 4. get multimedia data and get phases
// 5. use phase data to confirm starttime/endtime
// 6. show phases
// 7. parse button
// 8. ready for arduino data 
// 9. show button presses

//arduino data stream
var listComponents = ["BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger","Note", "Random", "PONG", "SimonSays"];
var inputs=["BTN","POT","TMP","ACR","COL","ROT","LDR"]
var outputs=["LED","PEZ", "RGB"]
var programming = ["NOTE", "Random", "PONG", "SimonSays","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger"]
var hardware = ["BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB"]
var moduleTypes = ["B","CC","BM","M","L"];
var interactionTypes = ["inputs","outputs","programming","games"];

//unique arduino elements
var uniqueHards;
var uniqueSofts;
var bothHS;
// var uniqueManips;
var hardNames = [];
var softNames = [];
var hardwareOnly = [];
var softwareOnly = [];
// var manipNames = []; //not using this
var diffSoftHard;
var totalComps = [];
var	hardUseComp = [];
var	softUseComp = [];
var colorText = "black";

//data stream types
var types = ["hand","ide","particle","face"];

//link diagram variables
// var totalLinks; //which one is right?
var totalLinks = [];
var linkData;
var force;
var newguy = [];
var onlyalpha = [];
var links = [];
var nodes = {};
var newData = [];

//face data stream
var maxFaces;
var faceNum = [];
var faceRadius = 5;
var maxRadius = faceRadius*4;
var radiusMin = 5;
var spaceFactor = radiusMin;
var yspace = radiusMin*2.5;

//hand data stream
var theseTotals = []; //to gather all the hand data
var one = []; //one hand
var two = []; //two hand
var three = []; //third hand
//hand data soft speed
var softS1 = [];
var softS2 = [];
var softS3 = [];


//nesting data
var nest_again;
var ideData;
var ide_nest, ide_nest2;
var timeX2 = d3.scale.linear();
var maxtime = [];
var whatTime = [];	


//x and y scales
var yOther = d3.scale.ordinal()
var xPath;
var timeX = d3.scale.linear()
	.range([leftMargin, w-rightMargin]);
var timeX2 = d3.scale.linear();
var y = d3.scale.ordinal()
    .domain(interactionTypes)
    .rangePoints([h/2, (h/2)+yspace*3]);
//color scales
var colorScale = d3.scale.ordinal()
    .domain(moduleTypes)
    .range(d3.scale.category20c().range());

var handColor = d3.scale.ordinal()
    .domain([0,20])
    .range(d3.scale.category20c().range());
var faceColor = d3.scale.ordinal()
    .domain([0,5])
    .range(d3.scale.category10().range());

//timing
//this is all the data but we have to double check timing w/ phases
var firstData; 
var startFirst, endFirst;
var startTime, endTime;
//timing
var thisSession;
//timing
var startMin, endMin, totalTime;

//in UI
//colors
var hardwareColor = "#15989C";
var softwareColor = "#B19B80";
//in UI

//phase data stream
var obsReflect = [];
var obsDoc = [];
var obsPlan = [];
var phaseData = [];
var planStart, planEnd;
var obs = [];

//hand calculations
var activeOne = [];
var activeTwo = [];
var activeThree = [];

//don't think in use
// var x=d3.scale.linear().range([cmargin,cwidth-cmargin]);
// var y=d3.scale.linear().range([cheight-cmargin,cmargin]);
// var o=d3.scale.linear().domain([0,300000]).range([.5,1]);
// var fx=d3.scale.linear().range([cmargin,cwidth-cmargin]);
// var fy=d3.scale.linear().range([cheight-cmargin,cmargin]);




$(document).ready(function() {
	getToken(); //returns the token
	getSession(token);
	var getSesh = setInterval(function(){  //returns the session
		if(thisSession>0){
			console.log(thisSession);
			getData(thisSession, token);
			clearInterval(getSesh);	
		} else{
			getSession(token);
		}
	}, 4000);
	var getNext = setInterval(function(){
		console.log("one")
		if(startFirst>0 && endFirst>startFirst){
			getMulti(thisSession, token);
			getPhases(thisSession, token);
			clearInterval(getNext);
			//   .done(mobileImages(thisSession, token))
		}
	},6000); //500
	var processNest = setInterval(function(){
		console.log("two")
		if(startTime>0 && endTime>startTime && nested_data.length>0){
			sendNestedData(nested_data);
			clearInterval(processNest);
		}
	},8000); //600
})
//in UI
setSVG();
function setSVG(){
	svgMain = d3.select("#container").append("svg")
		.attr("width",w+55).attr("height",h+topMargin)
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.attr("class","mainSVG") 
	timeSVG = svgMain
		.append("g")
		.attr("class","timelineSVG")
		.attr("width", w)
		.attr("height", timeSVGH)  
		.style("margin-top","1px");
}
//in UI
function getToken(){
	token = pelars_authenticate();
}
function getSession(token){
	console.log(token+"token");
	$.getJSON("http://pelars.sssup.it:8080/pelars/session?token="+token,function(json1){
		thisSession = parseInt(1371);//parseInt(json1[json1.length-1].session);
		//1320
	})
}

// IF START TIME OF overall session IS DIFFERENT THAN START TIME OF phase data...
function getData(thisSession, token){
	$.getJSON("http://pelars.sssup.it:8080/pelars/data/"+thisSession+"?token="+token,function(json){
		startFirst = json[0].time; //for all of the data, this is the supposed start
		endFirst = json[json.length-1].time; //for all of the data, this is the supposed end
		firstData = json; //this is the overall set of data
		data = json;
		//first we have to check start and end times with the phases
		console.log(new Date(startFirst)+"startFirst");
	// })
//NEXT STEPS
	nested_data = d3.nest()
	.key(function(d) { return d.type; })
	.key(function(d){ return d.num; })
	.entries(data);

	nested_face = d3.nest()
		.key(function(d) { return d.type; })
		.entries(data);
})
}
var tempData = [];
var multiData = [];
function getMulti(thisSession,token){
	$.getJSON("http://pelars.sssup.it:8080/pelars/multimedia/"+thisSession+"?token="+token,function(multiJSON){
		tempData.push(multiJSON); 
		multiData.push(tempData[0]);
		parsePhotos(multiData);
	})	
}

var mobileData = [];
function mobileImages(thisSession,token){
	$.getJSON("http://pelars.sssup.it:8080/pelars/multimedia/"+thisSession+"/mobile?token="+token,function(mobileJSON){
		mobileData.push(mobileJSON);
		console.log(mobileData+"mobile data");
	})
}
var phaseData;
function getPhases(thisSession,token){
	$.getJSON("http://pelars.sssup.it:8080/pelars/phase/"+thisSession+"?token="+token,function(phasesJSON){
		phaseData = phasesJSON;
		if(phasesJSON[0].phase=="setup"&&phasesJSON.length==1){
			startTime = startFirst;
			endTime = endFirst;	
			console.log(new Date(startTime)+"setup only?");
			console.log(new Date(endTime)+"setup only?");
			timeX.domain([startTime, endTime]);
		}
		else{
			if(phasesJSON[0].start<startFirst){
				startTime = phasesJSON[0].start;		
				console.log(new Date(startTime)+"phases start time")	
			} else{
				startTime = startFirst;			
			}
			if(phasesJSON[phasesJSON.length-1].end>phasesJSON[phasesJSON.length-2].end){
				endPhase = phasesJSON[phasesJSON.length-1].end;
			} 		
			else{
				endPhase = phasesJSON[phasesJSON.length-2].end;
			}
			if(endPhase>endFirst){
				endTime = endPhase;
				console.log(new Date(endTime)+"phases end time")
			} else{
				endTime = endFirst;
			}
			timeX.domain([startTime, endTime]);
			showPhases(phasesJSON)
		}
	})
}
function sendNestedData(){
	if (typeof nested_data !== "undefined"){
	console.log(nested_data)
	for(i=0; i<nested_data.length; i++){
		// console.log(nested_data[i])
		if(nested_data[i].key==types[3]){
			goFace(nested_face[i]); //FACE
		}
		if(nested_data[i].key==types[1]){
			goIDE(nested_data[i].values); //IDE					
		}
	}
	for(i=0; i<nested_data.length; i++){
		if(nested_data[i].key==types[0]){ //HAND
			goHands(nested_data[i]);
		}
	}	
}
}

//button stuff
var particleOnly = [];
var button1 = [];
var button2 = [];
var btnImg1 = [];
var btnImg2 = [];
//these were switched from b1 to b2
function parseButton(incomingData){ 
	particleOnly = incomingData.filter(function(n){ 
		return n.type == "particle" || n.type == "button"; 
	}); 
	console.log(particleOnly.length + "button press data")
	button1 = particleOnly.filter(function(n){ 
		return n.data == "b2" && n.data!=undefined;
	}); 
	console.log(button1.length + "button 1")
	button2 = particleOnly.filter(function(n){ 
		return n.data == "b1" && n.data!=undefined;
	}); 
	console.log(button2.length + "button 2")

	for(i=0; i<button1.length; i++){
		$.getJSON("http://pelars.sssup.it/pelars/snapshot/"+thisSession+"/"+(button1[i].time/1000000000000)+"E12"+"?token="+token, function(json){
			btnImg1.push(json);
		})
	}

	for(i=0; i<button2.length; i++){
		$.getJSON("http://pelars.sssup.it/pelars/snapshot/"+thisSession+"/"+(button2[i].time/1000000000000)+"E12"+"?token="+token, function(json){
			btnImg2.push(json);
		})
	}

	var getImage = setInterval(function(){  //returns the session		
		if(btnImg1.length>0 && btnImg2.length>0){
			console.log(btnImg1.length+"btn/img1 length")
			drawButton(button1, button2, btnImg1, btnImg2);
			clearInterval(getImage);	
		}
	}, 1000);
}

var thunderSpace = .5;
var ideaSpace = -.25;
// var iconW = 15;
var butY = timeSVGH/2+iconW/2+21;
var butLineY1 = butY+4;
var butLineY2 = timeSVGH;
var btnImgW = 200;
var btnImgH = btnImgW*1.3;
var thunder, lightbulb;
var timeMargin = 200;
var btnNest1;
var btnNest2;
function drawButton(button1, button2, img1, img2){
	console.log("draw button")
	console.log(img1)
	btnNest1 = d3.nest()
		.key(function(d) { 
			return d[0].time; 
		})
		.sortKeys(d3.ascending)
		.entries(btnImg1);

	btnNest2 = d3.nest()
		.key(function(d) { 
			return d[0].time; 
		})
		.sortKeys(d3.ascending)
		.entries(btnImg2);

	var iconBut1 = timeSVG.selectAll(".button1")	
		.data(button1)
		iconBut1.enter()
		.append("image")
		.attr("class","button1")
		.attr("xlink:href", "assets/icons/idea.png")
		.attr("x", function(d){
			return timeX(d.time);
		})
		.attr("y", butY)
		.attr("width",iconW)
		.attr("height",iconW)
		.on("click", function(d,i){
			var thisData = d3.select(this);
			var thisTime = thisData[0][0].__data__.time;
			console.log(thisTime+"thisTIME")
			var lIndex = i;

			console.log(lIndex)
		    lightbulb = timeSVG.selectAll(".clip-circ"+lIndex+"l")
                .data(btnNest1[lIndex].values[0]) 
                //btnNest1[lIndex].values[0]
                .attr("id","clip-circ")
                .attr("x", timeX(thisTime)-btnImgW/2)
            lightbulb
                .enter()
                .append("image")
                .attr("class", "clip-circ"+lIndex+"l")
                .attr("id","clip-circ")
                .attr("x", timeX(thisTime)-btnImgW/2)
				.attr("y", butY)
        		.attr("width", btnImgW)
        		.attr("height", btnImgH)
                .attr("xlink:href", function(d, i) {
                	// if(d.time>=thisTime && d.time<=thisTime+timeMargin){
	                	if(d.view=="workspace"){
	                		console.log(d.view)
	                		return d.data;
	                	} else {
	                		return (btnNest1[lIndex].values[0][0].data) 
	                	}
                });
			lightbulb.exit();
			d3.selectAll(".button1").each(moveToFront);
		});
	// var iconLine1 = timeSVG.selectAll(".button1L")	
	// 	.data(button1)
	// 	iconLine1.enter()
	// 	.append("line")
	// 	.attr("class","button1L")
	// 	.attr("x1", function(d){
	// 		return timeX(d.time)+iconW/2+ideaSpace;
	// 	})
	// 	.attr("x2", function(d){
	// 		return timeX(d.time)+iconW/2+ideaSpace;
	// 	})
	// 	.attr("y1", butLineY1)
	// 	.attr("y2", butLineY2)
	// 	.attr("stroke","grey");

	var iconBut2 = timeSVG.selectAll(".button2")	
		.data(button2)
		iconBut2.enter()
		.append("image")
		.attr("class","button2")
		.attr("xlink:href", "assets/icons/thunder.png") //just checking now put back to thunder
		.attr("x", function(d){
			return timeX(d.time);
		})
		.attr("y", butY)
		.attr("width",iconW)
		.attr("height",iconW)
		.on("click", function(d,i){
			var thisData = d3.select(this);
			var thisTime = thisData[0][0].__data__.time;
			console.log(thisTime+"thisTIME")
			var tIndex = i;

			console.log(tIndex)
		    thunder = timeSVG.selectAll(".clip-circ"+tIndex+"t")
                .data(btnNest2[tIndex].values[0]) //btnImg2[thisIndex].data 
                .attr("x", timeX(thisTime)-btnImgW/2)
            thunder
                .enter()
                .append("image")
                .attr("class", "clip-circ"+tIndex+"t")
                .attr("id","clip-circ")
                .attr("x", timeX(thisTime)-btnImgW/2)
				.attr("y", butY)
        		.attr("width", btnImgW)
        		.attr("height", btnImgH)
                .attr("xlink:href", function(d, i) {
	                	if(d.view=="workspace"){
	                		console.log(d.view)
	                		return d.data;
	                	} else {
	                		return btnNest2[tIndex].values[0][0].data//btnImg2[tIndex][0].data; 
	                	}
                });
			thunder.exit();
			d3.selectAll(".button2").each(moveToFront);
		});
	// var iconLine2 = timeSVG.selectAll(".button2L")	
	// 	.data(button2)
	// 	iconLine2.enter()
	// 	.append("line")
	// 	.attr("class","button2L")
	// 	.attr("x1", function(d){
	// 		return timeX(d.time)+iconW/2+thunderSpace;
	// 	})
	// 	.attr("x2", function(d){
	// 		return timeX(d.time)+iconW/2+thunderSpace;
	// 	})
	// 	.attr("y1", butLineY1)
	// 	.attr("y2", butLineY2)
	// 	.attr("stroke","grey");
}

var autoImg = [];
var imgData = [];
var docuImg = [];
var docuNote = [];
var researcherCaptions = [];
var studentCaptions = [];
var researcherNote = [];
function parsePhotos(multiData){
	imgData = multiData;
	var captionsText = [];
	console.log(multiData.length+"multiData length - photos");
		for(i=0; i<imgData[0].length; i++){
			if(imgData[0][i].creator=="client" && imgData[0][i].type=="image" && imgData[0][i].view=="workspace"){
				autoImg.push(imgData[0][i]);
			}
			if(imgData[0][i].creator=="observer" && imgData[0][i].type=="text"){
				researcherNote.push(imgData[0][i]);
			}
			if(imgData[0][i].creator=="student" && imgData[0][i].type=="text"){
				docuNote.push(imgData[0][i])
			}
			if(imgData[0][i].creator=="student" && imgData[0][i].type=="image"){
				docuImg.push(imgData[0][i]);
			}
		}
	function processURL(){
		for(i=0; i<researcherNote.length; i++){
			var url1 = researcherNote[i].data+"?token="+token;
			$.get(url1, function(caption){
				researcherCaptions.push(caption)
			})
		}
		for(i=0; i<docuNote.length; i++){
			var url1 = docuNote[i].data+"?token="+token;
			$.get(url1, function(caption){
				studentCaptions.push(caption)
			})
		}
	}
	var urlProcessing = setInterval(function(){  //returns the session		
		if(autoImg.length>0 && researcherNote.length>0 && docuImg.length>0 && docuNote.length>0){
			console.log(docuImg.length+"docuImg length")
			processURL();
			clearInterval(urlProcessing);	
		}
	}, 1000);
	var imageProcessing = setInterval(function(){  //returns the session		
		if(researcherCaptions.length>0 && studentCaptions.length>0){
			console.log(researcherCaptions.length+"researcherCaptions length")
			showPhotos();
			clearInterval(imageProcessing);	
		}
	}, 3000);	
}

function showPhotos(){
    var timelineImgWidth = 60; //(w/imgData[0].length)*6;
    var timelineImgHeight = timelineImgWidth*1.3;
    var timelineImgY = timeSVGH/2+iconW+25;
	var timelineThunderY = timeSVGH/2+iconW/2+21;
	var timelineBottomY = timeSVGH;
	var bigImgWidth = 8*40; 
	var bigImgHeight = 6*40; 
	var caption;
	var captionDoc;
//autoImg = system images
//researcherNote = just caption
//docuImg = student taken documents = image + caption
	var overview;
	overview = timeSVG.selectAll(".clip-rect")
	    .data(autoImg) 
	    .attr("x", function(d, i) {
			return timeX(d.time)+8;
	    })
	overview
	    .enter()
	    .append("image")
	    .attr("class", "clip-rect")
	    .attr("x", function(d, i) {
			return timeX(d.time)+8;
	    })
		.attr("y", timelineBottomY) 
		.attr("width", timelineImgWidth)
		.attr("height", timelineImgHeight)
	    .attr("xlink:href", function(d, i) {
			return d.data;                    	                       		
	    })
	    .on("click", function(d,i){
			d3.select(this).each(moveToFront);
	    	d3.select(this)
	    		.transition()
	    		.duration(500)
	    		.attr("width",bigImgWidth)
	    		.attr("height",bigImgHeight)
	    		.transition()
	    		.delay(1000)
	    		.attr("width", timelineImgWidth)
	    		.attr("height", timelineImgHeight)   
	    })    
//mobile image data back up?

	var resNote;
	resNote = timeSVG.selectAll(".commentIcon")
		.data(researcherNote) //when moused over this yields text
	resNote.enter()
		.append("image")
		.attr("class","commentIcon")
		.attr("xlink:href", "assets/pencil.png") //just checking now put back to thunder
		.attr("x", function(d){
			return timeX(d.time);
		})
		.attr("y", timelineBottomY)
		.attr("width",iconW)
		.attr("height",iconW);

	var studDoc;
	studDoc = timeSVG.selectAll(".camIcon")
		.data(docuImg);
	studDoc.enter()
		.append("image")
		.attr("class","camIcon")
		.attr("xlink:href", "assets/camera.png") //just checking now put back to thunder
		.attr("x", function(d){
			return timeX(d.time);
		})
		.attr("y", timelineThunderY/4)
		.attr("width",iconW)
		.attr("height",iconW);	

	$('.camIcon').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				var dis = this.__data__;
		  		var url1 = dis.data+"?token="+token;
				console.log(dis);
				var deferit = $.Deferred();
				deferit
				  .done(func1)
				deferit.resolve();
				function func1(){
					$.get(url1, function(capt){
						captionDoc = capt;
					})
				}
					return captionDoc;
			}
	});


	$('.commentIcon').tipsy({ 
			gravity: 'nw', 
			html: true, 
			title: function() {
				var dis = this.__data__;
		  		var url1 = dis.data+"?token="+token;
				console.log(dis);
				var deferit = $.Deferred();
				deferit
				  .done(func1)
				deferit.resolve();
				function func1(){
					$.get(url1, function(capt){
						caption = capt;
					})
				}
					return caption;
				// return caption.responseText;
			}
	});
//BUTTON PRESSES                      
// console.log("d.properties"+d.properties)
// updateHoverbox(d.properties, "path");
}

function goFace(faceData){
	var minTotal, maxTotal;
	var thisMany = [];
	maxTotal = 4;

	var yOffset = h/2;
	var mini = 4;
	var heightPanel = 100;
	var yPath = d3.scale.linear()
	  .domain([0, maxTotal])
	  .range([timeSVGH/2, 0]);

  	lineFace = d3.svg.line()
      .x(function(d, i) { return timeX(d.time); })
      .y(function(d, i) { return yPath(d.num); })
      .interpolate("cardinal")


	var faceColor = "#AB47BC"

	rectFace = timeSVG.append("g").attr("class","facerect").selectAll(".facerect")
	    .data(faceData.values)
	  	.enter().append("rect")
	    .attr("class", "facerect")
	    .attr("x", function(d){
	    	faceNum.push(d.num);
	    	return timeX(d.time)
	    })
	    .attr("y", function(d,i){
	    	return timeSVGH/2-d.num*faceRadius;
	    })
	    .attr("height", function(d,i){
	    	return 2*(d.num*faceRadius);
	    })
	    .attr("width",2)
	    .attr("fill", faceColor)
	    .attr("opacity",.6)
		.attr("stroke","none")
	maxFaces = d3.max(faceNum);
	lineFace = timeSVG.append("g").attr("class","backline").selectAll(".backline")
	    .data(d3.range(1))
	  	.enter().append("line")
	    .attr("class", "backline")
	    .attr("x1", timeX(startTime))
	    .attr("x2", timeX(startTime)+timeX(endTime)-timeX(startTime))
	    .attr("y1", timeSVGH/2-maxFaces*faceRadius+2*(maxFaces*faceRadius))
	    .attr("y2", timeSVGH/2-maxFaces*faceRadius+2*(maxFaces*faceRadius))
	    .attr("fill", "none")
		.attr("stroke","grey")
		.attr("stroke-dasharray",1)
}
function goIDE(ideData){

}
function goHands(handData){

}


function showIDE(){
	yOther
	    .rangePoints([topMarg, forceheight-topMarg/2-iconW/2]);

	timeX2.domain([startTime, endTime]).range([forcewidth/4, forcewidth]);
}


function showPhases(phasesJSON){
	parseButton(firstData);
	console.log(phasesJSON.length+"phasesJSON length");
	ready(firstData)
}
function ready(firstData){
	console.log(firstData.length+"firstData length");
}
function unique(obj) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
            return a - b
        });
        var str = '';
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    return uniques;
}

// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
    	// console.log(actual.time.sort(d3.ascending))
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

var moveToFront = function() { 
    this.parentNode.appendChild(this); 
}
function pelars_authenticate(){
	var email = "d.paiva@ciid.dk";
	var pswd = "pelars123!";
	var jsres;
	var res = "";
	jQuery.ajax({
		timeout : 1000,
		type : "POST",
		url : "http://pelars.sssup.it:8080/pelars/password?user=" + email + "&pwd=" + pswd,
		async: false,
		success : function(jqXHR, status, result){
		jsres = jqXHR;
		res = jsres["token"];
		},
		error : function(jqXHR, status) {
			console.log("error"+jqXHR)
			res = 0; }
	});
	return res;
}