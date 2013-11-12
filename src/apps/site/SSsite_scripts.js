//Pickup the browser size
var winW = 630, winH = 460;
if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}

var username;
function checkFrame(){
	username = document.getElementById('username').value;
}

var i, loopSt, fnames2, fvalues2, uniqueNames, rows;
var oturef = "X";
var otucount = 0;
var SiteType = "";
var SiteTypeI = 0;
var currRow = 1;
function runSetup(){
	//First we need to resize the table to fit
	document.getElementById('site_basics').height = (((winH-80)/4)*1);
	document.getElementById('site_A').height = (((winH-80)/4)*3);
	document.getElementById('site_A').height = (((winH-80)/4)*3);
	
	//Now we need to get the information from the database - table = trafficsites
	var queryScript = "../../apps/site/site_grabber.php?site_ref=" + siteRef.toUpperCase() + "&tabname=trafficsites_view&refF=site_ref&qtype=fname";
	$.get(queryScript, function(data) {
		var queryRes = data;
		var fnames = queryRes.split(',');
		
		queryScript = "../../apps/site/site_grabber.php?site_ref=" + siteRef.toUpperCase() + "&tabname=trafficsites_view&refF=site_ref&qtype=fres";
		$.get(queryScript, function(data) {
			var queryRes2 = data;
			var fvalues = queryRes2.split(',');
			
			//OK we need to pick up the associated OTU References for this site
			for (i=0;i<fnames.length;i++){
				fnames[i] = fnames[i].replace(/"/g, "").replace("[", "").replace("]", "");
				fvalues[i] = fvalues[i].replace(/"/g, "").replace("[", "").replace("]", "");
			}
			for(i=0;i<fnames.length;i++){
				if(fnames[i]=="oturef"){
					oturef = fvalues[i];
				}
			}
			
			queryScript = "../../apps/site/site_grabber.php?site_ref=" + oturef + "&tabname=utcreferences_view&refF=oturef&qtype=fname";
			$.get(queryScript, function(data) {
				var queryRes3 = data;
				fnames2 = queryRes3.split(',');
			
				queryScript = "../../apps/site/site_grabber.php?site_ref=" + oturef + "&tabname=utcreferences_view&refF=oturef&qtype=fres";
				$.get(queryScript, function(data) {
					var queryRes4 = data;
					fvalues2 = queryRes4.split(',');
					
					uniqueNames = [];
					$.each(fnames2, function(i, el){
						if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
					});
					rows = fvalues2.length / uniqueNames.length;
					var array2i = 1 - 1;
		
					//OK, at this poin we should now have this table loaded as two variables fnames and fvalues
					for (i=0;i<fnames2.length;i++){
						fnames2[i] = fnames2[i].replace(/"/g, "").replace("[", "").replace("]", "");
						fvalues2[i] = fvalues2[i].replace(/"/g, "").replace("[", "").replace("]", "");
					}
					
					//Set up the top box of the three
					var topBox = "";
					topBox += "<table width=\"100%\" cellspacing=\"15\"><tr><td width=\"20%\">Site Type: <br /><input type='text' size='25' value='";
					i = 0;
					var signalT = "";
					var pedT = "";
					do {
						if (fnames[i]=='trafficsignal'){ 
							if (signalT == "" && fvalues[i]=='t'){
								signalT = 'UTC';
							} else if (signalT != "" && fvalues[i]=='t') {
								signalT = 'UTC + ' + signalT;
							}
						}
						if (fnames[i]=='trafficsignalrms'){ 
							if (signalT == "" && fvalues[i]=='t'){
								signalT = 'RMS';
							} else if (signalT != "" && fvalues[i]=='t') {
								signalT = signalT + ' + RMS';
							}
						}
						if (fnames[i]=='pedcrossing'){ 
							if (pedT == "" && fvalues[i]=='t'){
								pedT = 'UTC';
							} else if (pedT != "" && fvalues[i]=='t') {
								pedT = 'UTC + ' + pedT;
							}
						}
						if (fnames[i]=='pedcrossingrms'){ 
							if (pedT == "" && fvalues[i]=='t'){
								pedT = 'RMS';
							} else if (pedT != "" && fvalues[i]=='t') {
								pedT = pedT + ' + RMS';
							}
						}
						i = i + 1;
					} while (i < fnames.length)
					if (signalT != "" && pedT != ""){
						SiteType = signalT + " Junction with " + pedT + " Ped Facilities";
						SiteTypeI = 3;
					} else if (signalT == "" && pedT != "") {
						SiteType = pedT + " Ped Facilities";
						SiteTypeI = 2;
					} else if (signalT != "" && pedT == "") {
						SiteType = signalT + " Junction";
						SiteTypeI = 1;
					} else if (signalT == "" && pedT == "") {
						SiteType = "Unknown";
						SiteTypeI = 0;
					}
					document.getElementById('dataTable').className = "mainS" + SiteTypeI;
					topBox += SiteType;
					topBox += "' /><br />Status: <input type='text' size='20' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='recstatus'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' /></td>";
					topBox += "<td width=\"60%\" colspan=\"3\" class=\"pageS" + SiteTypeI + "\"><h2>Site Information for Site " + siteRef + "</h2></td>";
					topBox += "<td width=\"20%\">Last Update: <br /><input type='text' size='25' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='mod_by'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' /><br /><input type='text' size='25' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='mod_date'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' /></td></tr>";
					topBox += "<tr><td width=\"16.5%\">";
					topBox += "<input type='hidden' id='gidVal' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='gid'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' />";
					topBox += "Site Ref: <input type='text' size='18' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='site_ref'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' /></td>";
					topBox += "<td width=\"25%\">Address: <input type='text' size='50' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='site_name'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' /></td>";
					topBox += "<td width=\"16.5%\">Postcode: <input type='text' size='18' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='postcode'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' /></td>";
					topBox += "<td width=\"16.5%\">Easting: <input type='text' size='18' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='easting'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' /></td>";
					topBox += "<td width=\"16.5%\">Northing: <input type='text' size='18' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='northing'){
							topBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					topBox += "' /></td></tr>";
					
					document.getElementById('site_basics').innerHTML = topBox;
					
					//Set up the left box
					var leftBox = "";
					leftBox += "<table width=\"100%\" cellspacing=\"15\" class=\"leftbox" + SiteTypeI + "\">";
					leftBox += "<tr><td colspan='4' class='leftbox" + SiteTypeI + "'><h3>Full Site Details <a href='../../rbc/trafficsites' target='_self'>(Return to map of sites)</a></h3></td></tr>";
					leftBox += "<tr><td class='leftbox" + SiteTypeI + "' width='25%'>OTU: <input type='text' size='18' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='oturef'){
							leftBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "' /></td><td class='leftbox" + SiteTypeI + "' width='25%'>Pre - timed Calls <input type='text' size='18' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='pretimedcalls'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += 'Unknown';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "' /></td>";
					leftBox += "</td><td class='leftbox" + SiteTypeI + "' colspan='2' width='25%'> Site is currently ";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='active'){
							if (fvalues[i]=='t'){
								leftBox += 'Active';
							} else if (fvalues[i]=='f') {
								leftBox += 'Not Active';
							} else {
								leftBox += 'Unknown';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td></tr>";
					leftBox += "<tr><td class='leftbox" + SiteTypeI + "'>Outstation Information Status: <input type='text' size='30' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='coms_status'){
							leftBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "' /></td><td class='leftbox" + SiteTypeI + "'>BT Line Reference: <input type='text' size='18' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='btnumber'){
							leftBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "' /></td><td class='leftbox" + SiteTypeI + "'>OTU and Coms Type: <input type='text' size='30' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='otu_coms_type'){
							leftBox += fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "' /></td><td class='leftbox" + SiteTypeI + "'>Number of OTU References: <input type='text' size='10' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='otucount'){
							leftBox += fvalues[i];
							otucount = fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "' /></td></tr>";
					leftBox += "<tr><td class='leftbox" + SiteTypeI + "' colspan='4'><table width='100%'><tr><th colspan='11' class='featureBox" + SiteTypeI + "'>Site Features</th></tr><tr><th class='featureBox" + SiteTypeI + "'></th><th class='featureBox" + SiteTypeI + "'>MOVA</th><th class='featureBox" + SiteTypeI + "'>Traffic Signals</th><th class='featureBox" + SiteTypeI + "'>Controlled Pedestrian Crossing</th><th class='featureBox" + SiteTypeI + "'>Bus Gate</th><th class='featureBox" + SiteTypeI + "'>VMS</th><th class='featureBox" + SiteTypeI + "'>ANPR</th><th class='featureBox" + SiteTypeI + "'>Bluetooth</th><th class='featureBox" + SiteTypeI + "'>CCTV</th><th class='featureBox" + SiteTypeI + "'>Count Site</th></tr><tr>";
					leftBox += "<th class='featureBox" + SiteTypeI + "'>UTC</th><td class='featureBox" + SiteTypeI + "' rowspan='2'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='mova'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='trafficsignal'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='pedcrossing'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='busgate'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='vms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='anpr'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='bluetooth'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='cctv'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='countsite'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td></tr><tr>";
					leftBox += "<th class='featureBox" + SiteTypeI + "'>RMS</th>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='trafficsignalrms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='pedcrossingrms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='busgaterms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='vmsrms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='anprrms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='bluetoothrms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='cctvrms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td>";
					leftBox += "<td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='countsiterms'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td></tr></table></td></tr>";
					leftBox += "<tr><td class='leftbox" + SiteTypeI + "' width='25%'>SCOOT: <input type='text' id='speed_descrimination' size='18' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='scoot'){
							if (fvalues[i]=='t'){
								leftBox += 'Yes';
							} else if (fvalues[i]=='f') {
								leftBox += 'No';
							} else {
								leftBox += '?';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "' /></td><td class='leftbox" + SiteTypeI + "' width='25%'>Speed Discrimination: <input type='text' id='speed_descrimination' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='speed_descrimination'){
								if (fvalues[i]=='t'){
									leftBox += 'Yes';
								} else if (fvalues[i]=='f') {
									leftBox += 'No';
								} else {
									leftBox += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						leftBox += "' /></td><td class='leftbox" + SiteTypeI + "' width='25%'>Speed Assessment: <input type='text' id='speed_assessment' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='speed_assessment'){
								if (fvalues[i]=='t'){
									leftBox += 'Yes';
								} else if (fvalues[i]=='f') {
									leftBox += 'No';
								} else {
									leftBox += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						leftBox += "' /></td><td class='leftbox" + SiteTypeI + "' width='25%'>System DLoop: <input type='text' id='system_dloop' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='system_dloop'){
								if (fvalues[i]=='t'){
									leftBox += 'Yes';
								} else if (fvalues[i]=='f') {
									leftBox += 'No';
								} else {
									leftBox += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						leftBox += "' /></td></tr>";
					leftBox += "<tr><td class='leftbox" + SiteTypeI + "' colspan='4'><u>Links to Associated Files</u><br /><table width='100%'><tr><td width='50%'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='photopath'){
							if (fvalues[i].substring(1,1)=="#"){
								leftBox += "None Available at this site";
							} else {
								leftBox += "<a href='../../rbc/trafficsites/photos/" + siteRef + "' target='_blank'>Link to Associated Photos</a><br />";
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "<span id='fileRes1'></span>";
					queryScript = "../../apps/site/file_grabber.php?oturef=" + oturef + "&siteref=" + siteRef + "&rms=1";
					$.get(queryScript, function(data) {
						document.getElementById('fileRes1').innerHTML = data;
					});
					leftBox += "</td><td width='50%'>";
					if (oturef!="X") {
						leftBox += "<a href='http://64.5.0.58/utc/html_dbas.exe/otuequip?site=";
						leftBox += oturef;
						leftBox += "' target='_blank'>Link to UTC Database Pages</a><br />";
					}
					leftBox += "<span id='fileRes2'></span>";
					queryScript = "../../apps/site/file_grabber.php?oturef=" + oturef + "&siteref=" + siteRef + "&rms=0";
					$.get(queryScript, function(data) {
						document.getElementById('fileRes2').innerHTML = data;
					});
					leftBox += "</td></tr></table>";
					leftBox += "</td></tr>";
					leftBox += "<tr><td class='leftbox" + SiteTypeI + "' colspan='4'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='notes'){
							leftBox += "<u>Notes:</u> <br />" + decodeURIComponent(fvalues[i]);
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					leftBox += "</td></tr>";
					leftBox += "</table>";
					
					document.getElementById('site_A').innerHTML = leftBox;
					
					//Set up the right box
					var rightBox = "";
					rightBox += "<table width=\"100%\" cellspacing=\"15\" class=\"rightbox" + SiteTypeI + "\">";
					rightBox += "<tr><td colspan='4' class='rightbox" + SiteTypeI + "'><h3>UTC Reference Details <a href='../../rbc/utcdata' target='_self' title='This takes you to the manager rather than viewer'>(Return to map of UTC sites)</a></h3></td></tr>";
					if (oturef=="X"){
						//There is no UTC controller
						rightBox += "<tr><td colspan='4'>This site is not UTC controlled.</td></tr>";
					} else {
						//We will show the first record with buttons which allow the user to scroll between the records
						rightBox += "<tr><td colspan='4' class='rightbox" + SiteTypeI + "' width='100%'>";
						rightBox += "<table width='100%'><tr>";
						rightBox += "<td><span id='leftB' style='visibility: hidden; text-align:left;' onclick='runControl(0)'><img src='../../apps/img/arrow_left.png' /></span></td>";
						rightBox += "<td width='80%' style='text-align: center'>Description: <input type='text' id='reference_description' size='60' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='reference_description'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td>";
						if (otucount>1){
							rightBox += "<td><span id='rightB' style='visibility: visible; text-align:right;' onclick='runControl(1)'><img src='../../apps/img/arrow_right.png' /></span></td>";
						} else {
							rightBox += "<td><span id='rightB' style='visibility: hidden; text-align:right;' onclick='runControl(1)'><img src='../../apps/img/arrow_right.png' /></span></td>";
						}
						rightBox += "</tr></table>";
						rightBox += "</td></tr>";
						rightBox += "<tr><td class='rightbox" + SiteTypeI + "' width='25%'>SCN: <input type='text' id='scnref' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='scnref'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='rightbox" + SiteTypeI + "' width='25%'>Supplier: <input type='text' id='supplier' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='supplier'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='rightbox" + SiteTypeI + "' width='25%'>Controller Type: <input type='text' id='controllertype' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='controllertype'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td>";
						rightBox += "<td class='rightbox" + SiteTypeI + "' width='25%'>ELV: <input type='text' id='elv' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='elv'){
								if (fvalues2[array2i + i]=='t'){
									rightBox += 'Yes';
								} else if (fvalues2[array2i + i]=='f') {
									rightBox += 'No';
								} else {
									rightBox += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td></tr>";
						rightBox += "<tr><td class='rightbox" + SiteTypeI + "' width='25%'>Installed: <input type='text' id='install_date' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='install_date'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='rightbox" + SiteTypeI + "' width='25%'>Serial No.: <input type='text' id='serialno' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='serialno'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='rightbox" + SiteTypeI + "' width='25%'>Config No.: <input type='text' id='configno' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='configno'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='rightbox" + SiteTypeI + "' width='25%'>Base Sealed? <input type='text' id='base_sealed' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='base_sealed'){
								if (fvalues2[array2i + i]=='t'){
									rightBox += 'Yes';
								} else if (fvalues2[array2i + i]=='f') {
									rightBox += 'No';
								} else {
									rightBox += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td></tr>";
						rightBox += "<tr><td class='rightbox" + SiteTypeI + "' colspan='4'>Item Condition: <input type='text' id='itemcondition' size='60' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='itemcondition'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td></tr>";
						rightBox += "<tr><td class='rightbox" + SiteTypeI + "' colspan='4'><table class='featureBox" + SiteTypeI + "' width=100%'>";
						rightBox += "<tr><th class='featureBox" + SiteTypeI + "'></th><th class='featureBox" + SiteTypeI + "'>Firmware</th><th class='featureBox" + SiteTypeI + "'>Issue</th></tr>";
						rightBox += "<tr><th class='featureBox" + SiteTypeI + "'>OMU</th><td class='featureBox" + SiteTypeI + "'><input type='text' id='omu_firmwareno' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='omu_firmwareno'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='featureBox" + SiteTypeI + "'><input type='text' id='omu_firmware_issue' size='10' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='omu_firmware_issue'){
								if (fvalues2[array2i + i]=='t'){
									rightBox += 'Yes';
								} else if (fvalues2[array2i + i]=='f') {
									rightBox += 'No';
								} else {
									rightBox += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td></tr>";
						rightBox += "<tr><th class='featureBox" + SiteTypeI + "'>OTU</th><td class='featureBox" + SiteTypeI + "'><input type='text' id='firmwareno' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='firmwareno'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='featureBox" + SiteTypeI + "'><input type='text' id='firmware_issue' size='10' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='firmware_issue'){
								if (fvalues2[array2i + i]=='t'){
									rightBox += 'Yes';
								} else if (fvalues2[array2i + i]=='f') {
									rightBox += 'No';
								} else {
									rightBox += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td></tr>";
						rightBox += "</table></td></tr>";
						rightBox += "<tr><td class='rightbox" + SiteTypeI + "' colspan='4'><b>Site Location: </b>";
						rightBox += "Easting: <input type='text' id='easting' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='easting'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' />     Northing: <input type='text' id='northing' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='northing'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' />  <input type='button' value='Copy to Site Coordinates' onclick='updateCoords()' /></td></tr>";
						rightBox += "<tr><td class='rightbox" + SiteTypeI + "' colspan='2'>MOVA Dataset: <input type='text' id='mova_dataset' size='25' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mova_dataset'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td>";
						rightBox += "<td class='rightbox" + SiteTypeI + "' width='25%'>Checksum1: <input type='text' id='mova_checksum1' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mova_checksum1'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td>";
						rightBox += "<td class='rightbox" + SiteTypeI + "' width='25%'>Checksum2: <input type='text' id='mova_checksum2' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mova_checksum2'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td></tr>";
						rightBox += "<tr><td class='rightbox" + SiteTypeI + "' width='25%'>Status: <input type='text' id='recstatus' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='recstatus'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='rightbox" + SiteTypeI + "' width='25%'>Modified By: <input type='text' id='mod_by' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mod_by'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td><td class='rightbox" + SiteTypeI + "' colspan='2'>Modified On: <input type='text' id='mod_date' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mod_date'){
								rightBox += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rightBox += "' /></td></tr>";
						rightBox += "</table>";
					}
					
					document.getElementById('site_B').innerHTML = rightBox;
				})
			})
		})
		.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
	})
	.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
}

function runControl(controlStr){
	var idRef;
	var idArray = ['recstatus','reference_description','easting','northing','mod_date','mod_by','scnref','supplier','controllertype','install_date','itemcondition','serialno','configno','base_sealed','firmwareno','firmware_issue','omu_firmwareno','omu_firmware_issue','elv','mova_dataset','mova_checksum1','mova_checksum2'];
	var idTArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1,0,0,0];
	
	//This function contains a number of functions as cases and allows the user to interact with the table
	if (controlStr==0) {
		//This is a back function
		var i, i2, i3, i4, el;
		currRow = currRow - 1;
		if (currRow < rows){
			//Not last row - add back forward button
			document.getElementById('rightB').style.visibility = 'visible';
		}
		if (currRow == 1) {
			//Back to the first row - remove the back button
			document.getElementById('leftB').style.visibility = 'hidden';
		}
		i2 = (currRow * uniqueNames.length) - uniqueNames.length;
		for (i=0;i<uniqueNames.length;i++){
			idRef = fnames2[i2];
			//Check this field is used?
			i3 = 0;
			i4 = 0;
			while (i3 == 0 && i4 < idArray.length) {
				if (idRef == idArray[i4]){
					valT = idTArray[i4];
					i3 = 1;
				}
				i4 = i4 + 1;
			}
			
			if (i3 != 0){
				//i3 is not zero so we are using this field
				if (valT == 1) {
					if (fvalues2[i2]=='t'){
						document.getElementById(idRef).value =  'Yes';
					} else if (fvalues2[i2]=='f') {
						document.getElementById(idRef).value =  'No';
					} else {
						document.getElementById(idRef).value =  'Unknown';
					}
				} else {
					document.getElementById(idRef).value = fvalues2[i2];
				}
			}
			i2 = i2 + 1;
		}
	} else if (controlStr==1){
		//This is a forward function
		var i, i2, i3, i4, el;
		if (currRow == 1){
			//First row - add back button
			document.getElementById('leftB').style.visibility = 'visible';
		}
		currRow = currRow + 1;
		if (currRow >= rows){
			//This is the last record so lets hide the forward arrow
			document.getElementById('rightB').style.visibility = 'hidden';
		}
		i2 = (currRow * uniqueNames.length) - uniqueNames.length;
		for (i=0;i<uniqueNames.length;i++){
			idRef = fnames2[i2];
			//Check this field is used?
			i3 = 0;
			i4 = 0;
			while (i3 == 0 && i4 < idArray.length) {
				if (idRef == idArray[i4]){
					valT = idTArray[i4];
					i3 = 1;
				}
				i4 = i4 + 1;
			}
			
			if (i3 != 0){
				//i3 is not zero so we are using this field
				if (valT == 1) {
					if (fvalues2[i2]=='t'){
						document.getElementById(idRef).value =  'Yes';
					} else if (fvalues2[i2]=='f') {
						document.getElementById(idRef).value =  'No';
					} else {
						document.getElementById(idRef).value =  'Unknown';
					}
				} else {
					document.getElementById(idRef).value = fvalues2[i2];
				}
			}
			i2 = i2 + 1;
		}
	}
}

function updateCoords(){
	var gid, easting, northing, mod_by, result, updaterStr;
	gid = document.getElementById('gidVal').value;
	easting = document.getElementById('easting').value;
	northing = document.getElementById('northing').value;
	mod_by = document.getElementById('username').value;
	updaterStr = "../../apps/site/trafficsites_update.php?gid=" + gid + "&easting=" + easting + "&northing=" + northing + "&mod_by=" + mod_by;
	if (mod_by!="RBC" && mod_by!="PBA"){
		$.get(updaterStr, function(data) {
			if (data=="OK"){
				alert("Update Successful");
				location.reload();
			} else {
				alert("ERROR - Email the following to your support team: " + data.toSource());
			}
		});
	} else {
		alert("Current user is not authorised to update the database");
	}
}