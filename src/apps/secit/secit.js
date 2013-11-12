var xmlhttp, urlT;
Ext.BLANK_IMAGE_URL = '../../apps/secit/s.gif'; 
var projectPath;

Dpath = document.URL;
var pos;
var pos, pos2, pos3, urlT;

//Sort out the URL path (local vrs remote)
pos = Dpath.indexOf("/", 9);
pos2 = pos + 1;
pos3 = Dpath.indexOf("/", pos2);
urlT = Dpath.substring(pos2,pos3); //This contains the URL type i.e. rbc or client
Dpath = Dpath.substr(0,pos); //This gives the URL upto the third 

//Detect internet explorer
var rv = -1; // Return value assumes failure.
var isIE = false; 
if (!navigator) {
} else {
	if (navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
		if (re.exec(ua) != null) {
			rv = parseFloat( RegExp.$1 );
		}
		isIE = true;
	}
}

var usertext;
function loginScript(siteT) {
	//Pick up the URL type
	if (Dpath.search("https://64") == -1) {
		Dpath = "https://geo.reading-travelinfo.co.uk/geoserver/web";
	} else {
		Dpath = "https://64.5.1.218/geoserver/web";
	}

	//JQuery Check
	usertext = '';
	$.get(Dpath, {async:false}, function(data) {
		// data contains the HTML content of the page, so run your username extraction on it
		finduser = data.search('Logged in as');
		if (finduser!=-1){
			//logged in
			finduser = finduser + 12 + 7; //12 is the length of the search string and 7 is the buffer
			if (data.indexOf('SPAN',finduser) == -1){ //Another ie fix for case sensitivity
				stopuser = data.indexOf('span',finduser);
			} else {
				stopuser = data.indexOf('SPAN',finduser);
			}
			stopuser = stopuser -2; //2 is the buffer
			usertext = data.substr(finduser,(stopuser-finduser));
			if (usertext.search("DIV class=wrap") != -1) {
				//Oh dear...why are you using internet explorer!!! Lets reload and try again.
				document.location.reload();
			}
			if (siteT==1){
				document.getElementById('username').value = usertext;
				checkFrame();
			} else {
				checkFrame();
				loadmap();
			}
		} else {
			//Unsuccessful log in
			Dpath = document.URL;
			//Sort out the URL path (local vrs remote)
			var pos, pos2, pos3;
			pos = Dpath.indexOf("/", 9);
			pos2 = pos + 1;
			pos3 = Dpath.indexOf("/", pos2);
			urlT = Dpath.substring(pos2,pos3); //This contains the URL type i.e. rbc or client
			Dpath = Dpath.substr(0,pos); //This gives the URL upto the third /
			if (urlT.search("client") == -1) {
				//rbc logon
				if (Dpath.search("https://64") == -1) {
					Dpath = "https://geo.reading-travelinfo.co.uk/rbc/logon/index.html";
				} else {
					Dpath = "https://64.5.1.218/rbc/logon/index.html";
				}
			} else {
				//client logon
				if (Dpath.search("https://64") == -1) {
					Dpath = "https://geo.reading-travelinfo.co.uk/client/logon/index.html";
				} else {
					Dpath = "https://64.5.1.218/client/logon/index.html";
				}
			}
			var onward = window.location.href;
			onward = Dpath + "?onward=" + onward;
			parent.window.location = onward;
		}
	});
}

function logItOut(){
	//j_spring_security_logout
	usertext = null;
	$.get(Dpath + "j_spring_security_logout", {async:false});
	if (urlT.search("client") == -1) {
		//rbc logon
		if (Dpath.search("https://64") == -1) {
			Dpath = "https://geo.reading-travelinfo.co.uk/rbc/logon/index.html";
		} else {
			Dpath = "https://64.5.1.218/rbc/logon/index.html";
		}
	} else {
		//client logon
		if (Dpath.search("https://64") == -1) {
			Dpath = "https://geo.reading-travelinfo.co.uk/client/logon/index.html";
		} else {
			Dpath = "https://64.5.1.218/client/logon/index.html";
		}
	}
	var onward = window.location.href;
	onward = Dpath + "?onward=" + onward;
	parent.window.location = onward;
}