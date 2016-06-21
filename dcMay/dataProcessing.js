var thisSession = 0;
var token = 0;

var h = $("#container").height();
var w = $("#container").width()-55;

//FIDGETING
var leftMargin = 20;
var rightMargin = 35;

var timeX = d3.scale.linear()
	.range([leftMargin, w-rightMargin]);

// 1. get token
// 2. get session number
// 3. get data and create first idea of starttime/endtime
// 4. get multimedia data and get phases
// 5. use phase data to confirm starttime/endtime
// 6. show phases
// 7. parse button
// 8. ready for arduino data 
// 9. show button presses
// 

$(document).ready(function() {
	getToken(); //returns the token
	var getSesh = setInterval(function(){  //returns the session
		getSession(token);
		if(thisSession>0){
			console.log(thisSession);
			getData(thisSession, token);
			clearInterval(getSesh);	
		}
	}, 3000);
	var getNext = setInterval(function(){
		if(startFirst>0 && endFirst>startFirst){
			getMulti(thisSession, token);
			getPhases(thisSession, token);
			clearInterval(getNext);
			//   .done(mobileImages(thisSession, token))
		}
	});
})

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
//this is all the data but we have to double check timing w/ phases
var firstData; 
var startFirst, endFirst;
// IF START TIME OF overall session IS DIFFERENT THAN START TIME OF phase data...
function getData(thisSession, token){
	$.getJSON("http://pelars.sssup.it:8080/pelars/data/"+thisSession+"?token="+token,function(json){
		startFirst = json[0].time; //for all of the data, this is the supposed start
		endFirst = json[json.length-1].time; //for all of the data, this is the supposed end
		firstData = json; //this is the overall set of data
		//first we have to check start and end times with the phases
		console.log(new Date(startFirst)+"startFirst");
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
	drawButton(button1, button2);

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
}
var topMargin = 100;
var timeSVGH = h/2;
var svgMain, timeSVG;
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
var thunderSpace = .5;
var ideaSpace = -.25;
var iconW = 15;
var butY = timeSVGH/2+iconW/2+21;
var butLineY1 = butY+4;
var butLineY2 = timeSVGH;
var btnImgW = 200;
var btnImgH = btnImgW*1.3;
var thunder, lightbulb;
function drawButton(button1, button2){
	console.log("drawing")
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
			var thisIndex = i;

			console.log(thisIndex)
		    lightbulb = timeSVG.selectAll(".clip-circ"+thisIndex)
                .data(btnImg1[thisIndex]) 
                .attr("id","clip-circ")
                .attr("x", timeX(thisTime)-btnImgW/2)
            lightbulb
                .enter()
                .append("image")
                .attr("class", "clip-circ"+thisIndex)
                .attr("id","clip-circ")
                .attr("x", timeX(thisTime)-btnImgW/2)
				.attr("y", butY)
        		.attr("width", btnImgW)
        		.attr("height", btnImgH)
                .attr("xlink:href", function(d, i) {
                	// if(d.time>=thisTime && d.time<=thisTime+40){
                		// console.log(d.time + "yes time");
	                	if(d.view=="workspace"){
	                		return d.data;
	                	} else {
	                		return btnImg1[thisIndex][0].data; //d.data;
	                	}
                	// } else{
                		// console.log(d.time+"no time")
                	// }
                });
			lightbulb.exit();
		});
	var iconLine1 = timeSVG.selectAll(".button1L")	
		.data(button1)
		iconLine1.enter()
		.append("line")
		.attr("class","button1L")
		.attr("x1", function(d){
			return timeX(d.time)+iconW/2+ideaSpace;
		})
		.attr("x2", function(d){
			return timeX(d.time)+iconW/2+ideaSpace;
		})
		.attr("y1", butLineY1)
		.attr("y2", butLineY2)
		.attr("stroke","grey");

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
			var thisIndex = i;

			console.log(thisIndex)
		    thunder = timeSVG.selectAll(".clip-circ"+thisIndex)
                .data(btnImg2[thisIndex]) //btnImg2[thisIndex].data or take off data 
                .attr("id","clip-circ")
                .attr("x", timeX(thisTime)-btnImgW/2)
            thunder
                .enter()
                .append("image")
                .attr("class", "clip-circ"+thisIndex)
                .attr("id","clip-circ")
                .attr("x", timeX(thisTime)-btnImgW/2)
				.attr("y", butY)
        		.attr("width", btnImgW)
        		.attr("height", btnImgH)
                .attr("xlink:href", function(d, i) {
                	if(d.time>=thisTime && d.time<=thisTime+40){
                		console.log(d.time + "yes time");
	                	if(d.view=="workspace"){
	                		return d.data;
	                	} else {
	                		return btnImg2[thisIndex][0].data; //d.data;
	                	}
                	} else{
                		console.log(d.time+"no time")
                	}
                });
			thunder.exit();
		});
	var iconLine2 = timeSVG.selectAll(".button2L")	
		.data(button2)
		iconLine2.enter()
		.append("line")
		.attr("class","button2L")
		.attr("x1", function(d){
			return timeX(d.time)+iconW/2+thunderSpace;
		})
		.attr("x2", function(d){
			return timeX(d.time)+iconW/2+thunderSpace;
		})
		.attr("y1", butLineY1)
		.attr("y2", butLineY2)
		.attr("stroke","grey");
}

function parsePhotos(multiData){
	console.log(multiData.length+"multiData length - photos");
}

function showPhases(phasesJSON){
	parseButton(firstData);
	console.log(phasesJSON.length+"phasesJSON length");
	ready(firstData)
}
function ready(firstData){
	console.log(firstData.length+"firstData length");
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