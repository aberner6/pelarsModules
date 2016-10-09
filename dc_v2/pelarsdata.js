/// PELARS url and authentication
var pelarstoken = 0;
var pelarsprefix = "http://pelars.sssup.it/pelars"
var pelarsemail = "d.paiva@ciid.dk";
var pelarspswd = "pelars123!";
var dataaccess;
var thisSession = 0;

/// returns the value of the parameter sname passed in the session
function getLocationParam ( sname )
{
var params = location.search.substr(location.search.indexOf("?")+1);
var sval = "";
params = params.split("&");
  // split param and value into individual pieces
  for (var i=0; i<params.length; i++)
     {
       temp = params[i].split("=");
       if ( [temp[0]] == sname ) { sval = temp[1]; }
     }
return sval;
}

function pelars_authenticate(fx)
{
	console.log("pelars_authenticate")
	var q = getLocationParam("source")
	if(q)
		pelarsprefix = q;
	q = getLocationParam("local")
	if(q == "1")
	{
		pelarsprefix = "http://127.0.0.1:8002"
		console.log("pelarslocalmode to 8002 local")
	}
	console.log("requesting to " + pelarsprefix)

	return jQuery.ajax({
		timeout : 1000,
		type : "POST",
		url : pelarsprefix + "/password?user=" + pelarsemail + "&pwd=" + pelarspswd,
		async: false,
		crossDomain: true
	}).done(function (jqXHR)
		{
			var jsres = jqXHR;
			pelarstoken = jsres["token"];
			console.log("LOGIN OK " + status + pelarstoken)
			return pelarstoken;
		}
	).fail(
		function(jqXHR, status) {
			console.log("LOGIN ERROR" +jqXHR + status)
		}
	)
}

function pelars_getSnapshot(session,time,fx)
{
	return $.getJSONSync(pelarsprefix + "/snapshot/"+session+"/"+time+"?token="+pelarstoken,fx)
}

function pelars_getMultimedia(session,media,fx)
{
	console.log("pelars_getMultimedia " + media + " " + pelarstoken)
	return $.getJSONSync(pelarsprefix + "/multimedia/"+session+"/"+media+"?token="+pelarstoken,fx)
}

function pelars_getMultimedias(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/multimedia/"+session+"?token="+pelarstoken,fx)
}

function pelars_getContent(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/content/"+session+"?token="+pelarstoken,fx)
}

function pelars_getPost(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/content/"+session+"?token="+pelarstoken,fx)
}

function pelars_getPhases(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/phase/"+session+"?token="+pelarstoken,fx)
}

function pelars_getData(session,fx)
{
	return $.getJSONSync(pelarsprefix + "/data/"+session+"?token="+pelarstoken,fx)
}

function pelars_getToken(fx)
{
	return pelars_authenticate(fx);
}

function pelars_getLastSession(next,fx)
{
	return $.getJSONSync(pelarsprefix + "/session?token="+pelarstoken,fx)
		.done(function(json1) {
			return parseInt(json1[json1.length-1].session);
		}
	)
}

function pelars_init()
{

	/// this is bad, use with care instead of the async get
	$.getJSONSync = function (url,fx)
	{
		jQuery.ajax({
			timeout : 2000,
			dataType: "json",
			type : "GET",
			crossDomain: true,
			url : url,
			async: false,
			success : function(result) { 
				fx(result)
			}
		});		
	}

	pelars_authenticate()
	thisSession = getLocationParam("session") || "offline";



	// TODO here the offline mode from session
	if(thisSession == "offline")
	{
		console.log("offline")
		dataaccess = {
			getToken: function () {} ,
			getData: function (session,fx) { $.getJSONSync("data/data1.json",fx); },
			getContent: function (session,fx) { $.getJSONSync("data/postSession.json",fx); },
			getContextContent: function (session,fx) { $.getJSONSync("data/content.json",fx); },
			getMultimedias: function (session,fx) { $.getJSONSync("data/multimedia.json",fx); },
			getPhases: function (session,fx) { $.getJSONSync("data/phaseData.json",fx); },
			getLastSession: function () { return 1593 },
			getSnapshot(session,time,fx) { $.getJSONSync("data/button1.json",fx); },
		}

		thisSession = 1593
	}
	else
	{
		dataaccess = {
			getToken: pelars_getToken ,
			getData: function (session,fx) { pelars_getData(session,fx) },
			getContent: function (session,fx) { pelars_getContent(session,fx) },
			getContextContent: function (session,fx) { $.getJSONSync("data/content.json",fx); },
			getPhases: function (session,fx) { pelars_getPhases(session,fx) },
			getSnapshot(session,time,fx) { pelars_getSnapshot(session,time,fx); },
			getLastSession: function () { return pelars_getLastSession() },
			getMultimedias: function (session,fx) { pelars_getMultimedias(session,fx) },
			getMultimedia: function (session,id,fx) { pelars_getMultimedia(session,id,fx) }
		}		
	}
	dataaccess.getToken()
	if(thisSession == "last")
		thisSession = dataaccess.getLastSession()

	dataaccess.session = thisSession
}
