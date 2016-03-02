//once this page is loaded it automatically loads several scripts
//that give you access to various visualizations

//auto loads faces.js
//which gives you access to show the faces - showFace()


//auto loads hardSoft.js
//processes the IDE based data
//allows you to show IDE based visualizations
// showIDEuse() is the mountains of hardware/software
// ideOverTime() is the small list of hw/sw components used over time
//you can also call makeRectPhases() but this goes on top of the timeline elements...;
//call showButton(); to overlay button data

//auto loads linkDiagram.js
//which allows you to showLinkDiagram()

//auto loads phasePie.js
//which allows you to call makePie();
//you can also call makeRectPhases() but this goes on top of the timeline elements...;


//auto loads handActivity.js
//which allows you to call showHands();

//auto loads button.js
//which allows you to call showButton();
// showButton(); but this is only relevant if called alongside other data pieces

//autoloads allTimeline.js
//which allows you to call showAllIDE which does a big timeline version
var topMarg = 10;
var textH = 30;
var iconW = 15;
var iconLMarg = 27;
var textL = 10;

var h = $("#container").height();
var w = $("#container").width()-55;
	
var types = ["hand","ide","particle","face"];
var hardwareColor = "#15989C";
var softwareColor = "#B19B80";

var endTime, startTime;
var thisSession;

var forcewidth = w/3-15;
var forceheight = h/3.5;

var ardSVG = d3.select("#network")
	.append("svg")
	.attr("width",forcewidth)
	.attr("height",forceheight)  
	.style("border","1px solid white") 
	.style("margin-top","1px")
var buttonSVG = d3.select("#ardinfo")
	.append("svg")
	.attr("width",forcewidth)
	.attr("height",forceheight)  
	.style("border","1px solid white") 
	.style("margin-top","1px");

/*var svgMain = d3.select("#container").append("svg").attr("width",w+55).attr("height",h)
	.attr("class","mainSVG")            
	.attr("transform", "translate(" + 0 + "," + 0 + ")"); */
//for arduino data
var yOther = d3.scale.ordinal()

//for link diagram
var force;

//for all time data
var timeFormat = d3.time.format("%H:%M");

//for all xaxis work
var timeX = d3.scale.linear();
var timeX2 = d3.scale.linear();

var xAxis = d3.svg.axis();
var xAxisScale = d3.time.scale()
    .domain([startTime, endTime])
    .range([10, w-40]);
    xAxis
        .scale(xAxisScale)
        .orient("top")
        .ticks(7)
        .tickPadding(1)
        .tickFormat(timeFormat);

//for general data
var nest_again;
//ide related data
var ideData;
var ide_nest, ide_nest2;
//button related data
var particleOnly = [];

//face data
var faceData, faceSummary;

//server access
var token;

//linkdiagram
var showLinkDiagram;
var newguy = [];
var links = [];
var nodes = {};
var listComponents = ["BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger","Note", "Random", "PONG", "SimonSays"];
var inputs=["BTN","POT","TMP","ACR","COL","ROT","LDR"]
var outputs=["LED","PEZ", "RGB"]
var programming = ["NOTE", "Random", "PONG", "SimonSays","IF", "Interval", "Fade", "Swap", "Map","MAP","MAPTOHIGHER", "Counter", "Trigger"]
var hardware = ["BTN","POT","TMP","ACR","COL","ROT","LDR","LED","PEZ", "RGB"]

var phaseArray = [];
var obsReflect = [];
var obsDoc = [];
var obsPlan = [];
var phaseData = [];
var planStart, planEnd;
var obs = [];

$(document).ready(function() {
	getSession();
})

function getSession(){
	token = pelars_authenticate();
	$.getJSON("http://pelars.sssup.it:8080/pelars/session?token="+token,function(json1){
			thisSession = parseInt(834);//parseInt(json1[json1.length-1].session); //
			console.log("session"+thisSession);
			getData(thisSession, token);
	})
}
var firstData;
var startFirst, endFirst;
// IF START TIME OF ONE IS LESS THAN START TIME OF OTHER, MAKE IT THAT
function getData(thisSession, token){
	console.log(thisSession);
	if(thisSession>0){
		$.getJSON("http://pelars.sssup.it:8080/pelars/data/"+thisSession+"?token="+token,function(json){
			startFirst = json[0].time;
			endFirst = json[json.length-1].time;

			firstData = json;
			getPhases(thisSession, token);
		})
	}
}
function getPhases(thisSession,token){
	$.getJSON("http://pelars.sssup.it:8080/pelars/phase/"+thisSession+"?token="+token,function(phasesJSON){
		if(phasesJSON[0].phase=="setup"&&phasesJSON.length==1){
			console.log("IN HERE")
			startTime = startFirst;
			endTime = endFirst;	
			timeX.domain([startTime, endTime]).range([10, w-50]);
		}
		else{
				if(phasesJSON[0].start<startFirst){
					startTime = phasesJSON[0].start;		
					console.log(startTime+"phases start")	
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
				} else{
					endTime = endFirst;
				}
			timeX.domain([startTime, endTime]).range([10, w-50]);
			showPhases(phasesJSON)
		}
		ready(firstData)
	})
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

function ready(data1) {
	data = (data1);

	var totalTime = endTime-startTime;

	for(i=0; i<data.length; i++){
		if(data[i].type == "particle"){
			particleOnly.push(data[i]);
		}
	}
	nested_data = d3.nest()
		.key(function(d) { return d.type; })
		.key(function(d){ return d.num; })
		.entries(data);

	nested_face = d3.nest()
		.key(function(d) { return d.type; })
		.entries(data);

	nest_again = d3.nest()
		.key(function(d) { return d.type; })
		.key(function(d){ return d.num; })
		.rollup(function(leaves) { 
			return { 
					"max_time": d3.max(leaves, function(d) {
						return parseFloat(d.time);
					}),
					"min_time": d3.min(leaves, function(d) {
						return parseFloat(d.time);
					}),
					"meanX": d3.mean(leaves, function(d) {
						return parseFloat(d.rx);
					}),
					"meanY": d3.mean(leaves, function(d) {
						return parseFloat(d.ry);
					}),
					"deviationX": d3.mean(leaves, function(d){ 
						return parseFloat(d.rx) 
					}),
					"deviationY": d3.mean(leaves, function(d){ 
						return parseFloat(d.ry) 
					})
				} 
			})
		.entries(data)


		if (typeof nested_data !== "undefined"){
			for(i=0; i<nested_data.length; i++){
				if(nested_data[i].key==types[3]){
					faceData = nested_face[i];
					faceSummary = nest_again[i].values;
					$.getScript("/pelarsModules/dataCard/faces.js", function(){
						goFace(faceData, faceSummary);
						console.log("ready to show face")
						//now you can call showFace();
						showFace();
					})
				}
				if(nested_data[i].key==types[1]){
					processIDE(nested_data[i].values, nest_again[i].values);					
				}
			}
			for(i=0; i<nested_data.length; i++){
				if(nested_data[i].key==types[0]){
					console.log("going hands")
					processHands(nested_data[i], nest_again[i].values);
				}
			}	
		}
	processButton(particleOnly);
};
function showPhases(phasesJSON) {
	phaseData = phasesJSON;
	var phaseNum = 0;
	for(i=1; i<phaseData.length; i++){ //change this
		if(phaseData[i].phase!=phaseData[i-1].phase){
			if(phaseData[i].phase=="obs_rate" || phaseData[i].phase=="setup"){}
				else{
					phaseNum+=1;
					obs[phaseNum]=({
						"num":phaseNum,
						"phase": phaseData[i].phase,
						"start": phaseData[i].start,
						"end": phaseData[i].end
					})
					if(phaseData[i].phase=="obs_plan"){
						obsPlan.push(phaseData[i])
					}
					if(phaseData[i].phase=="obs_document"){
						obsDoc.push(phaseData[i])
					}
					if(phaseData[i].phase=="obs_reflect"){
						obsReflect.push(phaseData[i])
					}
			}
		}	
	}

	var totalPlan, totalReflect, totalDoc;
	for(i=0; i<obsPlan.length; i++){ 
		totalPlan = obsPlan[obsPlan.length-1].end-obsPlan[0].start;
	}
	for(i=0; i<obsReflect.length; i++){ 
		totalReflect = obsReflect[obsReflect.length-1].end-obsReflect[0].start 
	}
	for(i=0; i<obsDoc.length; i++){ 
		totalDoc = obsDoc[obsDoc.length-1].end-obsDoc[0].start 
	}
	phaseArray.push(totalPlan, totalDoc, totalReflect);
	obs = cleanArray(obs);
	$.getScript("/pelarsModules/dataCard/phasePie.js", function(){
		console.log("phase data ready")
		//now you can call makePie();
		//now you can call makeRectPhases();
	})
}

//button stuff
var particleOnly = [];
var getthis = [];
var buttonData = [];
var button1 = [];
var button2 = [];
function processButton(incomingData){
	buttonData.push(incomingData);
	console.log(incomingData);
	for(i=0; i<buttonData[0].length; i++){
		getthis.push(buttonData[0][i].data);
		if(buttonData[0][i].data=="b2"){
			button2.push({
				"button": "button2",
				"time": buttonData[0][i].time
			});				
		}
		if(buttonData[0][i].data=="b1"){
			button1.push({
				"button": "button1",
				"time": buttonData[0][i].time
			});				
		}
	}
	button1 = button1.filter(function(n){ return n.button != undefined }); 
	button2 = button2.filter(function(n){ return n.button != undefined }); 

	var buttonTot;
	if(button2.length>button1.length){
		buttonTot = button2.length;
	}else{ 
		buttonTot = button1.length; 
	}
	$.getScript("/pelarsModules/dataCard/button.js", function(){
		console.log("ready to show button")
		//now you can call showButton();
		// showButton();
	})
}


var handData = [];
var summaryHands;
function processHands(incomingData, summary){	
	handData = incomingData;
	summaryHands = summary;
	$.getScript(/pelarsModules/dataCard/"handActivity.js", function(){
		console.log("ready to show hands")
		//now you can call showHands();
		// showHands();
	})
}

function processIDE(incomingD, summary){
	ideData = incomingD[0].values;
	sumIDE = summary;
	console.log("in IDE");
    var patt1 = /[A-Z]/gi; 

	for(i=0; i<ideData.length; i++){
		if(ideData[i].opt.match(patt1)!=null) {
			ideData[i].name= (ideData[i].opt.match(patt1).join().replace(/,/g, '')).toUpperCase();	
		}
		if(ideData[i].action_id.length>2){
			ideData[i].mod = ideData[i].action_id.substr(0, 2);
			ideData[i].oc = parseInt(ideData[i].action_id.substr(2, 2));
		}else{
			ideData[i].mod = ideData[i].action_id.substr(0, 1);
			ideData[i].oc = parseInt(ideData[i].action_id.substr(1, 1));
		}

		ideData[i].special_id = ideData[i].mod+ideData[i].opt;
		ideData[i].hour = (new Date(ideData[i].time)).getHours();
		ideData[i].minute = (new Date(ideData[i].time)).getMinutes();
	}
	ide_nest = d3.nest()
		.key(function(d) { 
			return d.time; 
		})
		.sortKeys(d3.ascending)
		.entries(ideData);

	ide_nest2 = d3.nest()
		.key(function(d) { 
			return d.special_id; 
		})		
		.entries(ideData);
	for(i=0; i<ide_nest2.length; i++){
		for(j=0; j<ide_nest2[i].values.length-1; j++){
			if(ide_nest2[i].values[j].oc==1 && ide_nest2[i].values[j+1].oc==-1){
				var secondguy = ide_nest2[i].values[j+1].time;
				ide_nest2[i].values[j].end = secondguy;
			} else{ 
			}
		}
	}
	$.getScript("/pelarsModules/dataCard/hardSoft.js", function(){
		ideDataCreation();
		console.log("ready to show IDE")
		//NOW YOU CAN CALL THE FOLLOWING FUNCTIONS
		// showIDEuse()
		// ideOverTime()
	});
	$.getScript("/pelarsModules/dataCard/allTimeline.js", function(){
		ideDataCreation();
		console.log("ready to show all timeline IDE")
		//NOW YOU CAN CALL THE FOLLOWING FUNCTIONS
		// showIDEuse()
		// ideOverTime()
	});
	processDataForLinks(ideData)
}
function processDataForLinks(ideData){
    links = ideData.filter(function(d) {
        return d.mod == "L";
    });
    for(i=0; i<links.length; i++){
        newguy.push(links[i].opt.split(" "));
        links[i].source = newguy[i][1];
        links[i].target = newguy[i][3];
    }
    for(i=0; i<links.length; i++){
        for(j=0; j<listComponents.length; j++){
            if (links[i].source.indexOf(listComponents[j]) > -1) {
                links[i].source = listComponents[j];
            }
            if (links[i].target.indexOf(listComponents[j]) > -1) {
                links[i].target = listComponents[j];
            }
        }
    }

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, mod:link.mod});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, mod:link.mod});
    });

    var linkdist = w/10;
    force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([forcewidth, forceheight-20])
        .linkDistance(linkdist)
        .charge(-100)

    console.log("ready to show link diagram")
    showLinkDiagram = function(){
    	console.log("show link diagram")
		$.getScript("/pelarsModules/dataCard/linkDiagram.js", function(){
		    makeLinkDiagram(links,force.nodes(), force.links());
		});
	}
}
// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
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