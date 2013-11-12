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
var pUtab, hUtab, firstFind;
var oturef = "X";
var otucount = 0;
var SiteType = "";
var SiteTypeI = 0;
var currRow = 1;
function runSetup(){
	var fieldName;
	//First we need to resize the table to fit
	document.getElementById('site_basics').height = (((winH-80)/4)*1);
	document.getElementById('site_A').height = (((winH-80)/4)*3);
	document.getElementById('site_A').height = (((winH-80)/4)*3);
	
	//Now we need to get the information from the database - table = trafficsites
	var queryScript = "../../apps/site/site_grabber.php?site_ref=" + siteRef.toUpperCase() + "&tabname=trafficsites_view&refF=site_ref&qtype=fname";
	$.get(queryScript, function(data) {
		var queryRes = data;
		var fnames = queryRes.split(',');
		//Deal with comma fix
		for(cf=0;cf<fnames.length;cf++){
			fnames[cf] = fnames[cf].replace(/##/g, ",");
		}
		
		queryScript = "../../apps/site/site_grabber.php?site_ref=" + siteRef.toUpperCase() + "&tabname=trafficsites_view&refF=site_ref&qtype=fres";
		$.get(queryScript, function(data) {
			var queryRes2 = data;
			var fvalues = queryRes2.split(',');
			//Deal with comma fix
			for(cf=0;cf<fvalues.length;cf++){
				fvalues[cf] = fvalues[cf].replace(/##/g, ",");
			}
			
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
				//Deal with comma fix
				for(cf=0;cf<fnames2.length;cf++){
					fnames2[cf] = fnames2[cf].replace(/##/g, ",");
				}
			
				queryScript = "../../apps/site/site_grabber.php?site_ref=" + oturef + "&tabname=utcreferences_view&refF=oturef&qtype=fres";
				$.get(queryScript, function(data) {
					var queryRes4 = data;
					fvalues2 = queryRes4.split(',');
					//Deal with comma fix
					for(cf=0;cf<fvalues2.length;cf++){
						fvalues2[cf] = fvalues2[cf].replace(/##/g, ",");
					}
					
					uniqueNames = [];
					$.each(fnames2, function(i, el){
						if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
					});
					rows = fvalues2.length / uniqueNames.length;
					var array2i = 1 - 1;
		
					//OK, at this point we should now have this table loaded as two variables fnames and fvalues
					for (i=0;i<fnames2.length;i++){
						fnames2[i] = fnames2[i].replace(/"/g, "").replace("[", "").replace("]", "");
						fvalues2[i] = fvalues2[i].replace(/"/g, "").replace("[", "").replace("]", "");
					}
					
					//Set up the top box of the three
					var topBox = "";
					topBox += "<table width=\"100%\" cellspacing=\"15\"><tr><td width=\"20%\">Site Type: <br /><input type='text' size='25' value='";
					i = 0;
					var signalT = "";
					var rmsSite = false;
					var utcSite = false;
					var checkF = 0;
					var pedS = false;
					var juncS = false;
					do {
						if (fnames[i]=='rms'){
							if (fvalues[i]=='t'){
								signalT = 'RMS';
								rmsSite = true;
							} else {
								signalT = 'UTC';
								utcSite = true;
							}
						}
						if (fnames[i]=='trafficsignal'){ 
							if (fvalues[i]=='YES'){
								juncS = true;
								if (checkF == 0){
									signalT += ' signals'; 
									checkF = checkF + 1;
								} else {
									signalT += ' & signals'; 
									checkF = checkF + 1;
								}
							}
						}
						
						if (fnames[i]=='pedcrossing'){ 
							if (fvalues[i]=='YES'){
								pedS = true;
								if (checkF == 0){
									signalT += ' ped signals'; 
									checkF = checkF + 1;
								} else {
									signalT += ' & ped signals';
									checkF = checkF + 1;									
								}
							}
						}
						i = i + 1;
					} while (i < fnames.length)
					if (checkF == 0){
						signalT += ' other site';
					}
					SiteType = signalT;
					if (checkF > 1){
						//Both Types
						SiteTypeI = 1; //Still just a junction but with ped facilities
					} else if (checkF == 0){
						//Other site
						SiteTypeI = 0;
					} else {
						if (juncS == true && pedS == true){
							//Both Types
							SiteTypeI = 1; //Still just a junction but with ped facilities
						} else if (juncS == false && pedS == false){
							//Other site
							SiteTypeI = 0;
						} else if (juncS == true){
							//Signals
							SiteTypeI = 1;
						} else {
							//Ped site
							SiteTypeI = 2;
						}
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
					topBox += "<td width=\"60%\" colspan=\"3\" class=\"pageS" + SiteTypeI + "\"><h2>Site Information for Site " + siteRef.toUpperCase() + "</h2></td>";
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

					//Set up the associated files tab
					var assocFiles = "<div id='tab1'><u>Links to Associated Files</u><br /><table width='100%'><tr><td width='50%'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='photopath'){
							if (fvalues[i].substring(1,1)=="#"){
								assocFiles += "None Available at this site";
							} else {
								assocFiles += "<a href='../../rbc/trafficsites/photos/" + siteRef + "' target='_blank'>Link to Associated Photos</a><br />";
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					assocFiles += "<span id='fileRes1'></span>";
					assocFiles += "</td><td width='50%'>";
					if (oturef!="X") {
						assocFiles += "<a href='http://64.5.0.58/utc/html_dbas.exe/otuequip?site=";
						assocFiles += oturef;
						assocFiles += "' target='_blank'>Link to UTC Database Pages</a><br />";
					}
					assocFiles += "<span id='fileRes2'></span>";
					assocFiles += "</td></tr></table></div>";
					
					//Write the results to the tab
					Ext.getCmp('filesTab').update(assocFiles);
					queryScript = "../../apps/site/file_grabber2.php?oturef=" + oturef + "&siteref=" + siteRef + "&rms=1";
					$.get(queryScript, function(data) {
						document.getElementById('fileRes1').innerHTML = data;
					});
					queryScript = "../../apps/site/file_grabber2.php?oturef=" + oturef + "&siteref=" + siteRef + "&rms=0";
					$.get(queryScript, function(data) {
						document.getElementById('fileRes2').innerHTML = data;
					});
					
					//Set up the notes tab
					var notesTabSt = "<div id='tab2'><u>Notes:</u> <br />";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='notes'){
							notesTabSt += decodeURIComponent(fvalues[i]);
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					notesTabSt += "</div>";
					//Write the notes to the tab
					Ext.getCmp('notesTab').update(notesTabSt);
					
					//Next we set up the site summary tab
					var summaryStr = "<div id='tab3'>";
					summaryStr += "<table width=\"100%\" cellspacing=\"15\" class=\"leftbox" + SiteTypeI + "\">";
					summaryStr += "<tr><td colspan='3' class='leftbox" + SiteTypeI + "'><h3>Full Site Details <a href='../../rbc/trafficsites' target='_self'>(Return to map of sites)</a></h3></td></tr>";
					summaryStr += "<tr><td class='leftbox" + SiteTypeI + "'>Number of OTU References: <input type='text' size='10' value='";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='otucount'){
							summaryStr += fvalues[i];
							otucount = fvalues[i];
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "' /></td>";
					summaryStr += "<td class='leftbox" + SiteTypeI + "' width='33%'> Site is currently ";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='active'){
							if (fvalues[i]=='t'){
								summaryStr += 'Active';
							} else if (fvalues[i]=='f') {
								summaryStr += 'Not Active';
							} else {
								summaryStr += 'Unknown';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='leftbox" + SiteTypeI + "' width='33%'>";
					var tp, ma;
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='tallpole'){
							if (fvalues[i]=='YES'){
								tp = 1;
							} else {
								tp = 0;
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='mastarm'){
							if (fvalues[i]=='YES'){
								ma = 1;
							} else {
								ma = 0;
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					if(tp==1 && ma==1){
						summaryStr += " This site has at least one mast arm and tall pole";
					} else if (tp==1){
						summaryStr += " This site has at least one tall pole";
					} else if (ma==1){
						summaryStr += " This site has at least one mast arm";
					} else {
						summaryStr += "";
					}
					summaryStr += "</td></tr>";
					summaryStr += "<tr><td colspan='3' class='leftbox" + SiteTypeI + "'>Site Type: <input type='text' size='100' value='";
					summaryStr += SiteType;
					summaryStr += "' /></td></tr>";
					summaryStr += "<tr><td colspan='3' class='leftbox" + SiteTypeI + "'><table width=100%><tr><td colspan=5 class='featureBox" + SiteTypeI + "'><b><u>Site Facilities</b></u></td></tr>";
					summaryStr += "<tr><th class='featureBox" + SiteTypeI + "'><b>Group</b></th><th class='featureBox" + SiteTypeI + "'><b>Equipment</b></th><th class='featureBox" + SiteTypeI + "'><b>Available at Site?</b></th><th class='featureBox" + SiteTypeI + "'><b>Coms Line*</b></th><th class='featureBox" + SiteTypeI + "'><b>Status</b></th></tr>";
					
					//Add facilities table below
					
					//Table Row
					summaryStr += "<tr><td class='featureBox" + SiteTypeI + "' rowspan='5'>Communications Type</td>";
					summaryStr += "<td class='featureBox" + SiteTypeI + "'>BT Broadband</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='broadband'){
							if (fvalues[i]=='YES'){
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='btipline'){
							if (fvalues[i]=='null'){
								summaryStr += '';
							} else {
								summaryStr += fvalues[i];
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><td class='featureBox" + SiteTypeI + "'>WiMax Broadband</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='wimax'){
							if (fvalues[i]=='YES'){
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='wimaxip'){
							if (fvalues[i]=='null'){
								summaryStr += '';
							} else {
								summaryStr += fvalues[i];
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><td class='featureBox" + SiteTypeI + "'>Linked Coms</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='linkcom'){
							if (fvalues[i]=='YES'){
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='comlinks'){
							if (fvalues[i]=='null'){
								summaryStr += '';
							} else {
								summaryStr += fvalues[i].replace(/\\/g,""); //This repairs any hyperlinks which will be otherwise broken by the \ symbol
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><td class='featureBox" + SiteTypeI + "'>Private Line</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='privateline'){
							if (fvalues[i]=='YES'){
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='btpwline'){
							if (fvalues[i]=='null'){
								summaryStr += '';
							} else {
								summaryStr += fvalues[i];
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><td class='featureBox" + SiteTypeI + "'>PSTN</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='pstn'){
							if (fvalues[i]=='YES'){
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='pstnline'){
							if (fvalues[i]=='null'){
								summaryStr += '';
							} else {
								summaryStr += fvalues[i];
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td>";
					
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "' rowspan='2'>Junction Control</td>";
					
					summaryStr += "<td class='featureBox" + SiteTypeI + "'>MOVA</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='mova'){
							if (fvalues[i]=='t'){
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='f') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"greyText\">?</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>SCOOT</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					do {
						if (fnames[i]=='scoot'){
							if (fvalues[i]=='t'){
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='f') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"greyText\">?</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					
					summaryStr += "</tr>";
					//Table Row End
					//Table Row
					summaryStr += "<tr><td class='featureBox" + SiteTypeI + "' rowspan='6'>Signal Types</td>";
					
					summaryStr += "<td class='featureBox" + SiteTypeI + "'>Junction Control</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'trafficsignal';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Nearside Ped Control</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'ped_near';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Farside Ped Control</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'ped_far';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Near Side Ped/Cycle Control (Toucan)</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'toucan_near';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Far Side Ped/Cycle Control (Toucan)</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'toucan_far';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Cycle Stage at Signals</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'cyclestage';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					
					summaryStr += "</tr>";
					//Table Row End
					
					//Table Row
					summaryStr += "<tr><td class='featureBox" + SiteTypeI + "' rowspan='4'>Bus Enforcement</td>";
					
					summaryStr += "<td class='featureBox" + SiteTypeI + "'>Bus Stage at Signals</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'busstage';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Bus Priority</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'buspriority';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Bus Gate</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'busgate';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>BLE Camera</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'blecam';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					
					summaryStr += "</tr>";
					//Table Row End
					//Table Row
					summaryStr += "<tr><td class='featureBox" + SiteTypeI + "' rowspan='2'>Journey Time Facilities</td>";
					
					summaryStr += "<td class='featureBox" + SiteTypeI + "'>ANPR</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'anpr';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Bluetooth</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'bluetooth';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					
					summaryStr += "</tr>";
					//Table Row End
					//Table Row
					summaryStr += "<tr><td class='featureBox" + SiteTypeI + "' rowspan='4'>Additional Equipment</td>";
					
					summaryStr += "<td class='featureBox" + SiteTypeI + "'>VMS</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'vms';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>CCTV</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'cctv';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Environmental Monitoring</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'emote';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					summaryStr += "</tr><tr><td class='featureBox" + SiteTypeI + "'>Count Site</td><td class='featureBox" + SiteTypeI + "'>";
					loopSt = 0;
					i = 0;
					fieldName = 'countsite';
					do {
						if (fnames[i]==fieldName){
							if (fvalues[i]=='YES') {
								summaryStr += '<span class=\"greenText\">Yes</span>';
							} else if (fvalues[i]=='NO') {
								summaryStr += '<span class=\"greyText\">No</span>';
							} else {
								summaryStr += '<span class=\"orangeText\">Planned</span>';
							}
							loopSt = 1;
						}
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					summaryStr += "</td><td class='featureBox" + SiteTypeI + "'></td><td class='featureBox" + SiteTypeI + "'></td>";
					
					summaryStr += "</tr>";
					//Table Row End
					
					//Wrap the table
					summaryStr += "</table></td></tr>";
					summaryStr += "<tr><td colspan='3'>*Coms Line included to show which equipment shares a communications line and a link is provided if the equipment is linked to another site; click the link to view the other site. <br />All equipment listed for this site will share a common power supply.</td></tr>";
					summaryStr += "</table>";
					
					//Write the summary tab
					Ext.getCmp('siteSummary').update(summaryStr);
					
					//OK, now we set up the content tabs
					if (rmsSite){
						//This is an RMS site
						
						//Next we set up the content for this tab
						var rmsTable = "";
						rmsTable += "<table width=\"100%\" cellspacing=\"15\" class=\"rightbox" + SiteTypeI + "\">";
						
						rmsTable += "<tr><td class='rightbox" + SiteTypeI + "' colspan='4'><h3>RMS Site Details <a href='../../rbc/trafficsites' target='_self' title='This takes you to the manager rather than viewer'>(Return to map of sites)</a></h3></td></tr>";
						
						rmsTable += "<tr><td class='rightbox" + SiteTypeI + "'>OMU: <input type='text' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='omuref'){
								rmsTable += fvalues[i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						rmsTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Coms Line: <input type='text' size='18' value='";
						firstFind = 0;
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='btipline' && (fvalues[i].length > 0 && fvalues[i]!=='null')){
								rmsTable += 'Broadband: ' + fvalues[i];
								firstFind = 1;
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='pstn' && (fvalues[i].length > 0 && fvalues[i]!=='null')){
								if(firstFind == 0){
									rmsTable += 'PSTN: ' + fvalues[i];
									firstFind = 1;
								} else {
									rmsTable += ' | PSTN: ' + fvalues[i];
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='wimaxip' && (fvalues[i].length > 0 && fvalues[i]!=='null')){
								if(firstFind == 0){
									rmsTable += 'WiMax: ' + fvalues[i];
									firstFind = 1;
								} else {
									rmsTable += ' | WiMax: ' + fvalues[i];
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='btpwline' && (fvalues[i].length > 0 && fvalues[i]!=='null')){
								if(firstFind == 0){
									rmsTable += 'Private Line: ' + fvalues[i];
									firstFind = 1;
								} else {
									rmsTable += ' | Private Line: ' + fvalues[i];
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						if(firstFind==0){
							rmsTable += 'No Information';
						}
						rmsTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Coms Type: <input type='text' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='coms_text'){
								rmsTable += fvalues[i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						rmsTable += "' /></td><td class='rightbox" + SiteTypeI + "' colspan='2'>OMU Type: <input type='text' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='omu_type'){
								rmsTable += fvalues[i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)";";
						rmsTable += "' /></td></tr>";
						
						rmsTable += "<tr><td class='rightbox" + SiteTypeI + "'>";
						rmsTable += "Pre - timed Calls <input type='text' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='pretimedcalls'){
								if (fvalues[i]=='t'){
									rmsTable += 'Yes';
								} else if (fvalues[i]=='f') {
									rmsTable += 'No';
								} else {
									rmsTable += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						rmsTable += "' /></td><td class='rightbox" + SiteTypeI + "'>";
						rmsTable += "Speed Discrimination: <input type='text' id='speed_descrimination' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='speed_descrimination'){
								if (fvalues[i]=='t'){
									rmsTable += 'Yes';
								} else if (fvalues[i]=='f') {
									rmsTable += 'No';
								} else {
									rmsTable += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						rmsTable += "' /></td><td class='rightbox" + SiteTypeI + "'>";
						rmsTable += "Speed Assessment: <input type='text' id='speed_assessment' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='speed_assessment'){
								if (fvalues[i]=='t'){
									rmsTable += 'Yes';
								} else if (fvalues[i]=='f') {
									rmsTable += 'No';
								} else {
									rmsTable += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						rmsTable += "' /></td><td class='rightbox" + SiteTypeI + "'>";
						rmsTable += "VA: <input type='text' id='system_dloop' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='system_dloop'){
								if (fvalues[i]=='t'){
									rmsTable += 'Yes';
								} else if (fvalues[i]=='f') {
									rmsTable += 'No';
								} else {
									rmsTable += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						rmsTable += "' /></td></tr>";
						
						rmsTable += "<tr><td class='rightbox" + SiteTypeI + "' colspan='4'><table class='featureBox" + SiteTypeI + "' width=100%'>";
						rmsTable += "<tr><th class='featureBox" + SiteTypeI + "'></th><th class='featureBox" + SiteTypeI + "'>Firmware</th><th class='featureBox" + SiteTypeI + "'>Issue</th></tr>";
						rmsTable += "<tr><th class='featureBox" + SiteTypeI + "'>OMU</th><td class='featureBox" + SiteTypeI + "'><input type='text' id='omu_firmwareno' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='omu_firmwareno'){
								rmsTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rmsTable += "' /></td><td class='featureBox" + SiteTypeI + "'><input type='text' id='omu_firmware_issue' size='10' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='omu_firmware_issue'){
								if (fvalues2[array2i + i]=='t'){
									rmsTable += 'Yes';
								} else if (fvalues2[array2i + i]=='f') {
									rmsTable += 'No';
								} else {
									rmsTable += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						rmsTable += "' /></td></tr>";
						rmsTable += "</table></td></tr>";
						
						rmsTable += "</table>";
						
						//Write the tab
						tabs.add({
							title: 'RMS Site Details',
							id: 'siteRMS',
							html: rmsTable
						});
					} 
					
					if (SiteTypeI == 0){
						//This is an other site type
						
						//Next we set up the content for this tab
						var tabTable = "";
						tabTable += "<table width=\"100%\" cellspacing=\"15\" class=\"rightbox" + SiteTypeI + "\">";
						tabTable += "<tr><td class='rightbox" + SiteTypeI + "'>";
						tabTable += "</td></tr>";
						tabTable += "";
						
						tabTable += "</table>";
						
						//Write the tab
						tabs.add({
							title: 'Site Details',
							id: 'siteD',
							html: tabTable
						});
					} 

					if (utcSite) {
						//This is a UTC site
						
						//Next we set up the content for this tab
						var utcTable = "";
						utcTable += "<table width=\"100%\" cellspacing=\"15\" class=\"rightbox" + SiteTypeI + "\">";
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "' colspan='5'><h3>UTC Details <a href='../../rbc/utcdata' target='_self' title='This takes you to the manager rather than viewer'>(Return to map of UTC sites)</a></h3></td></tr>";
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "'>OTU: <input type='text' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='oturef'){
								utcTable += fvalues[i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Coms Line: <input type='text' size='18' value='";
						firstFind = 0;
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='btipline' && (fvalues[i].length > 0 && fvalues[i]!=='null')){
								utcTable += 'Broadband: ' + fvalues[i];
								firstFind = 1;
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='pstnline' && (fvalues[i].length > 0 && fvalues[i]!=='null')){
								if(firstFind == 0){
									utcTable += 'PSTN: ' + fvalues[i];
									firstFind = 1;
								} else {
									utcTable += ' | PSTN: ' + fvalues[i];
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='wimaxip' && (fvalues[i].length > 0 && fvalues[i]!=='null')){
								if(firstFind == 0){
									utcTable += 'WiMax: ' + fvalues[i];
									firstFind = 1;
								} else {
									utcTable += ' | WiMax: ' + fvalues[i];
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='btpwline' && (fvalues[i].length > 0 && fvalues[i]!=='null')){
								if(firstFind == 0){
									utcTable += 'Private Line: ' + fvalues[i];
									firstFind = 1;
								} else {
									utcTable += ' | Private Line: ' + fvalues[i];
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						if(firstFind==0){
							utcTable += 'No Information';
						}
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "' colspan='3'>Coms Type: <input type='text' size='60' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames[i]=='coms_text'){
								utcTable += fvalues[i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < fnames.length)
						utcTable += "' /></td></tr>";
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "' colspan='5'>";
						
						utcTable += "<table class='featureBox" + SiteTypeI + "' width=100%'>";
						utcTable += "<tr><th class='featureBox" + SiteTypeI + "'></th><th class='featureBox" + SiteTypeI + "'>Firmware</th><th class='featureBox" + SiteTypeI + "'>Issue</th></tr>";
						utcTable += "<tr><th class='featureBox" + SiteTypeI + "'>OTU</th><td class='featureBox" + SiteTypeI + "'><input type='text' id='firmwareno' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='firmwareno'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='featureBox" + SiteTypeI + "'><input type='text' id='firmware_issue' size='10' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='firmware_issue'){
								if (fvalues2[array2i + i]=='t'){
									utcTable += 'Yes';
								} else if (fvalues2[array2i + i]=='f') {
									utcTable += 'No';
								} else {
									utcTable += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td></tr>";
						utcTable += "</table></td></tr>";
						
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "' colspan='5' width='100%'><u>UTC Reference Details</u><br />";
						
						//We will show the first record with buttons which allow the user to scroll between the records
						utcTable += "<table width='100%'><tr>";
						utcTable += "<td><span id='leftB' style='visibility: hidden; text-align:left;' onclick='runControl(0)'><img src='../../apps/img/arrow_left.png' /></span></td>";
						utcTable += "<td width='80%' style='text-align: center' colspan='3'>Description: <input type='text' id='reference_description' size='60' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='reference_description'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td>";
						if (otucount>1){
							utcTable += "<td><span id='rightB' style='visibility: visible; text-align:right;' onclick='runControl(1)'><img src='../../apps/img/arrow_right.png' /></span></td>";
						} else {
							utcTable += "<td><span id='rightB' style='visibility: hidden; text-align:right;' onclick='runControl(1)'><img src='../../apps/img/arrow_right.png' /></span></td>";
						}
						utcTable += "</tr></table>";
						utcTable += "</td></tr>";
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "'>SCN: <input type='text' id='scnref' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='scnref'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Supplier: <input type='text' id='supplier' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='supplier'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Controller Type: <input type='text' id='controllertype' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='controllertype'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td>";
						utcTable += "<td class='rightbox" + SiteTypeI + "'>Lamp Type: <input type='text' id='elv' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='elv'){
								if (fvalues2[array2i + i]=='t'){
									utcTable += 'ELV';
								} else if (fvalues2[array2i + i]=='f') {
									utcTable += 'LV';
								} else {
									utcTable += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Base Sealed? <input type='text' id='base_sealed' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='base_sealed'){
								if (fvalues2[array2i + i]=='t'){
									utcTable += 'Yes';
								} else if (fvalues2[array2i + i]=='f') {
									utcTable += 'No';
								} else {
									utcTable += 'Unknown';
								}
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td></tr>";
						
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "'>Installed: <input type='text' id='install_date' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='install_date'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Serial No.: <input type='text' id='serialno' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='serialno'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Config No.: <input type='text' id='configno' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='configno'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>MIB: <input type='text' id='itemcondition' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mib'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Item Condition: <input type='text' id='itemcondition' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='itemcondition'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td></tr>";
						
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "' colspan='5'><b>Site Location: </b>";
						utcTable += "Easting: <input type='text' id='easting' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='easting'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' />     Northing: <input type='text' id='northing' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='northing'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' />  <input type='button' value='Copy to Site Coordinates' onclick='updateCoords()' /></td></tr>";
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "'>MOVA Dataset: <input type='text' id='mova_dataset' size='25' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mova_dataset'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td>";
						utcTable += "<td class='rightbox" + SiteTypeI + "'>LIN: <input type='text' id='mova_lin' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mova_lin'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td>";
						utcTable += "<td class='rightbox" + SiteTypeI + "'>LIF: <input type='text' id='mova_lif' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mova_lif'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td>";
						utcTable += "<td class='rightbox" + SiteTypeI + "'>Checksum1: <input type='text' id='mova_checksum1' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mova_checksum1'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td>";
						utcTable += "<td class='rightbox" + SiteTypeI + "'>Checksum2: <input type='text' id='mova_checksum2' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mova_checksum2'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td></tr>";
						utcTable += "<tr><td class='rightbox" + SiteTypeI + "' colspan='2'>Status: <input type='text' id='recstatus' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='recstatus'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "'>Modified By: <input type='text' id='mod_by' size='18' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mod_by'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td><td class='rightbox" + SiteTypeI + "' colspan='2'>Modified On: <input type='text' id='mod_date' size='30' value='";
						loopSt = 0;
						i = 0;
						do {
							if (fnames2[array2i + i]=='mod_date'){
								utcTable += fvalues2[array2i + i];
								loopSt = 1;
							}
							i = i + 1;
						} while (loopSt == 0 && i < uniqueNames.length)
						utcTable += "' /></td></tr>";
						
						utcTable += "</table></div>";
						
						//Write the tab
						tabs.add({
							title: 'UTC Site Details',
							id: 'siteUTC',
							html: utcTable
						});
					}
					
					createUpgradesTab();
				})
				.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
			})
			.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
		})
		.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
	})
	.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
}

function createUpgradesTab(){
	//Obtain planned upgrade details
	var queryScript = "../../apps/site/site_grabber.php?site_ref=" + siteRef.toUpperCase() + "&tabname=siteworks&refF=siteref&qtype=fname";
	$.get(queryScript, function(data) {
		var queryRes = data;
		var fnames = queryRes.split(',');
		//Deal with comma fix
		for(cf=0;cf<fnames.length;cf++){
			fnames[cf] = fnames[cf].replace(/##/g, ",");
		}
		
		queryScript = "../../apps/site/site_grabber.php?site_ref=" + siteRef.toUpperCase() + "&tabname=siteworks&refF=siteref&qtype=fres";
		$.get(queryScript, function(data) {
			var queryRes2 = data;
			var fvalues = queryRes2.split(',');
			//Deal with comma fix
			for(cf=0;cf<fvalues.length;cf++){
				fvalues[cf] = fvalues[cf].replace(/##/g, ",");
			}
			
			//OK, at this point we should now have this table loaded as two variables fnames and fvalues
			for (i=0;i<fnames.length;i++){
				fnames[i] = fnames[i].replace(/"/g, "").replace("[", "").replace("]", "");
				fvalues[i] = fvalues[i].replace(/"/g, "").replace("[", "").replace("]", "").replace(/\\\//g, "/");
			}
			
			//How many upgrades must we find
			i = 0;
			var upgrades = 0;
			do {
				if (fnames[i]=='gid'){
					upgrades = upgrades + 1;
				}
				i = i + 1;
			} while (i < fnames.length)
						
			//Prepare the content
			var pUpgrade = "";
			pUpgrade += "<div id='pUpgradeContent'><table width='100%'><tr><td class='leftbox" + SiteTypeI + "' colspan='3'><h3>Planned Upgrades</h3></td><td class='leftbox" + SiteTypeI + "'><a href='../../rbc/tableedits/index.html?table=siteworks&order=gid&geomF=other_geom&title=Blah&geo=No&lookup=targetCol^worksstatus~workstype^replaceCol^worksstatus~workstype^replaceTable^jt_worksstatus~jt_workstype^targetList^1~-&tabF=siteref^eq^%60" + siteRef.toUpperCase() + "%60'>Edit Upgrades for this site</a></td></tr>";
			
			var itNo = 0;
			var loopStart, loopGo;
			do {
				loopStart = itNo * (fnames.length / upgrades);
				
				//Exclude if complete
				loopSt = 0;
				i = 0;
				loopGo = loopStart;
				var skipR = '';
				do {
					if (fnames[loopGo]=='worksstatus'){
						skipR = fvalues[loopGo];
						loopSt = 1;
					}
					loopGo = loopGo + 1;
					i = i + 1;
				} while (loopSt == 0 && i < fnames.length)
				if (skipR!=='Completed / Installed' && skipR!=='Cancelled'){
					//Set up the header div's
					if (itNo == 0){
						pUpgrade += "<tr><td class='leftbox" + SiteTypeI + "' colspan='4' id='row" + itNo + "'>";
						pUpgrade += "<div id='rowHeader'><span id='row" + itNo + "on' style='display:inline'><img src='../../apps/img/more.gif' width='11' height='11' onclick='loadRow(" + itNo + ", 1)' /></span><span id='row" + itNo + "off' style='display:none'><img src='../../apps/img/less.gif' width='11' height='11' onclick='loadRow(" + itNo + ", 2)' /></span><span style='margin-left:5px'>";
							loopSt = 0;
							i = 0;
							loopGo = loopStart;
							do {
								if (fnames[loopGo]=='workstype'){
									pUpgrade += fvalues[loopGo];
									loopSt = 1;
								}
								loopGo = loopGo + 1;
								i = i + 1;
							} while (loopSt == 0 && i < fnames.length)
							loopSt = 0;
							i = 0;
							loopGo = loopStart;
							do {
								if (fnames[loopGo]=='worksref'){
									pUpgrade += " (" + fvalues[loopGo] + ")";
									loopSt = 1;
								}
								loopGo = loopGo + 1;
								i = i + 1;
							} while (loopSt == 0 && i < fnames.length)
						pUpgrade += "</span></div><div id='rowData" + itNo + "' style='display: none'>"
					} else if (itNo != 0){
						pUpgrade += "</div></td></tr>";
						pUpgrade += "<tr><td class='leftbox" + SiteTypeI + "' colspan='4' id='row" + itNo + "'>";
						pUpgrade += "<div id='rowHeader'><span id='row" + itNo + "on' style='display:inline'><img src='../../apps/img/more.gif' width='11' height='11' onclick='loadRow(" + itNo + ", 1)' /></span><span id='row" + itNo + "off' style='display:none'><img src='../../apps/img/less.gif' width='11' height='11' onclick='loadRow(" + itNo + ", 2)' /></span><span style='margin-left:5px'>";
							loopSt = 0;
							i = 0;
							loopGo = loopStart;
							do {
								if (fnames[loopGo]=='workstype'){
									pUpgrade += fvalues[loopGo];
									loopSt = 1;
								}
								loopGo = loopGo + 1;
								i = i + 1;
							} while (loopSt == 0 && i < fnames.length)
							loopSt = 0;
							i = 0;
							loopGo = loopStart;
							do {
								if (fnames[loopGo]=='worksref'){
									pUpgrade += " (" + fvalues[loopGo] + ")";
									loopSt = 1;
								}
								loopGo = loopGo + 1;
								i = i + 1;
							} while (loopSt == 0 && i < fnames.length)
						pUpgrade += "</span></div><div id='rowData" + itNo + "' style='display: none'>"
					} 
					
					//Now we populate the div
					pUpgrade += "<p style='margin-left:25px'>";
					pUpgrade += "<b><i>";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='workstitle'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "</i></b><br />";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='worksdesc'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "<br /><b><u>Site Details</u></b><br />Site Reference: ";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='siteref'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					var OTUref = "";
					do {
						if (fnames[loopGo]=='oturef' && fvalues[loopGo]!='null'){
							OTUref = fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					if (OTUref != ""){
						pUpgrade += ", OTU: " + OTUref;
					}
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					var OMUref = "";
					do {
						if (fnames[loopGo]=='omuref' && fvalues[loopGo]!='null'){
							OMUref = fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					if (OMUref != ""){
						pUpgrade += ", OMU: " + OTUref;
					}
					pUpgrade += "<br />Programmed Start Date: ";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='startdate'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += ", Programmed End Date: ";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='enddate'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "<br /><b>Workstream: </b>";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='workstream'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "<br /><b>Current Status: </b>";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='worksstatus'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "<br /><b><u>Contacts</u></b></p><table style='margin-left:25px;'><tr><th style='padding:5px;'></th><th style='padding:5px;'><b>Name</b></th><th style='padding:5px;'><b>Details</b></th></tr><tr><th style='padding:5px;'><b>Primary Contact:</b></th><td style='padding:5px;'>";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='primary_contact'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "</td><td style='padding:5px;'>";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='primary_contact_details'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "</td></tr><tr><th style='padding:5px;'><b>Secondary Contact:</b></th><td style='padding:5px;'>";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='secondary_contact'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "</td><td style='padding:5px;'>";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='secondary_contact_details'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "</td></tr></table>";
					pUpgrade += "<p style='margin-left:25px'>";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					var linkSRC = "";
					do {
						if (fnames[loopGo]=='external_link' && fvalues[loopGo]!='null'){
							linkSRC = fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					if (linkSRC != ""){
						pUpgrade += "<br /><a href='" + linkSRC;
						pUpgrade += "' target='_blank'>External Link</a>";
					}
					pUpgrade += "<br />Last Update on: ";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='mod_date'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += " by ";
					loopSt = 0;
					i = 0;
					loopGo = loopStart;
					do {
						if (fnames[loopGo]=='mod_by'){
							pUpgrade += fvalues[loopGo];
							loopSt = 1;
						}
						loopGo = loopGo + 1;
						i = i + 1;
					} while (loopSt == 0 && i < fnames.length)
					pUpgrade += "</p>";
				}
				
				itNo = itNo + 1;
			} while (itNo < upgrades);
			pUpgrade += "</div></td></tr>";
			pUpgrade += "</table></div>";
			pUtab = new Ext.Panel ({
				title: 'Planned Upgrades',
				id: 'pUpgrade',
				html: pUpgrade
			})
				
			//Write the tab
			tabs.add(pUtab);
			
			//Obtain upgrade history details
			var queryScript = "../../apps/site/site_grabber.php?site_ref=" + siteRef.toUpperCase() + "&tabname=siteworks_history&refF=siteref&qtype=fname&sortby=bkgid";
			$.get(queryScript, function(data) {
				var queryRes = data;
				var fnames2 = queryRes.split(',');
				//Deal with comma fix
				for(cf=0;cf<fnames2.length;cf++){
					fnames2[cf] = fnames2[cf].replace(/##/g, ",");
				}
				
				queryScript = "../../apps/site/site_grabber.php?site_ref=" + siteRef.toUpperCase() + "&tabname=siteworks_history&refF=siteref&qtype=fres&sortby=bkgid";
				$.get(queryScript, function(data) {
					var queryRes2 = data;
					var fvalues2 = queryRes2.split(',');
					//Deal with comma fix
					for(cf=0;cf<fvalues2.length;cf++){
						fvalues2[cf] = fvalues2[cf].replace(/##/g, ",");
					}
					
					//OK, at this point we should now have this table loaded as two variables fnames and fvalues
					for (i=0;i<fnames2.length;i++){
						fnames2[i] = fnames2[i].replace(/"/g, "").replace("[", "").replace("]", "");
						fvalues2[i] = fvalues2[i].replace(/"/g, "").replace("[", "").replace("]", "").replace(/\\\//g, "/");
					}
					
					//How many upgrades must we find
					i = 0;
					var upgrades2 = 0;
					do {
						if (fnames2[i]=='gid'){
							upgrades2 = upgrades + 1;
						}
						i = i + 1;
					} while (i < fnames2.length)
					
					if(upgrades>0 || upgrades2>0){
						itNo = 0;
						var recordArr = [];
						var a = [];
						var b = [];
						var c = [];
						var d = [];
						var e = [];
						var f = [];
						var g = [];
						var aStr, bStr, cStr, dStr, eStr, fStr;
						do {
							loopStart = itNo * (fnames2.length / upgrades2);
							aStr = '';
							bStr = '';
							cStr = '';
							dStr = '';
							eStr = '';
							fStr = '';
							i = 0;
							loopGo = loopStart;
							if (upgrades2>0){
								do {
									//Loop through this set of fields and pickup the values of interest
									if (fnames2[loopGo]=='worksstatus'){
										a.push(fvalues2[loopGo]);
										aStr = 'y';
									}
									if (fnames2[loopGo]=='worksref'){
										b.push(fvalues2[loopGo]);
										bStr = 'y';
									}
									if (fnames2[loopGo]=='workstype'){
										c.push(fvalues2[loopGo]);
										cStr = 'y';
									}
									if (fnames2[loopGo]=='worksdesc'){
										d.push(fvalues2[loopGo]);
										dStr = 'y';
									}
									if (fnames2[loopGo]=='mod_by'){
										e.push(fvalues2[loopGo]);
										eStr = 'y';
									}
									if (fnames2[loopGo]=='mod_date'){
										f.push(fvalues2[loopGo]);
										fStr = 'y';
									}
									loopGo = loopGo + 1;
									i = i + 1;
								} while (i < (fnames2.length / upgrades2))
							
								//If any of these have not been found by now it must be null, lets record -
								if (aStr==''){
									a.push(' - ');
								}
								if (bStr==''){
									b.push(' - ');
								}
								if (cStr==''){
									c.push(' - ');
								}
								if (dStr==''){
									d.push(' - ');
								}
								if (eStr==''){
									e.push(' - ');
								}
								if (fStr==''){
									f.push(' - ');
								}
								g.push('historical');	
							}
							itNo = itNo + 1;
						} while (itNo < upgrades2);
						
						//We also need to get the current status!
						itNo = 0;
						do {
							loopStart = itNo * (fnames.length / upgrades);
							aStr = '';
							bStr = '';
							cStr = '';
							dStr = '';
							eStr = '';
							fStr = '';
							loopGo = loopStart;
							i = 0;
							do {
								//Loop through this set of fields and pickup the values of interest
								if (fnames[loopGo]=='worksstatus'){
									a.push(fvalues[loopGo]);
									aStr = 'y';
								}
								if (fnames[loopGo]=='worksref'){
									b.push(fvalues[loopGo]);
									bStr = 'y';
								}
								if (fnames[loopGo]=='workstype'){
									c.push(fvalues[loopGo]);
									cStr = 'y';
								}
								if (fnames[loopGo]=='worksdesc'){
									d.push(fvalues[loopGo]);
									dStr = 'y';
								}
								if (fnames[loopGo]=='mod_by'){
									e.push(fvalues[loopGo]);
									eStr = 'y';
								}
								if (fnames[loopGo]=='mod_date'){
									f.push(fvalues[loopGo]);
									fStr = 'y';
								}
								loopGo = loopGo + 1;
								i = i + 1;
							} while (i < (fnames.length / upgrades))
						
							//If any of these have not been found by now it must be null, lets record -
							if (aStr==''){
								a.push(' - ');
							}
							if (bStr==''){
								b.push(' - ');
							}
							if (cStr==''){
								c.push(' - ');
							}
							if (dStr==''){
								d.push(' - ');
							}
							if (eStr==''){
								e.push(' - ');
							}
							if (fStr==''){
								f.push(' - ');
							}
							g.push('current');	
							itNo = itNo + 1;
						} while (itNo < upgrades);
						
						//Push the arrays into the container array
						recordArr.push(a);
						recordArr.push(b);
						recordArr.push(c);
						recordArr.push(d);
						recordArr.push(e);
						recordArr.push(f);
						recordArr.push(g);
						
						//alert(recordArr.toSource());
						
						//OK we have now created an array for this site which is neat and we need to work out how many independant 
						//projects there are (as there may be multiple updates for each project
						var uniqueIDs = [];
						var tmpuniqueID;
						for(i=0;i<recordArr[1].length;i++){
							i3 = 0;
							tmpuniqueID = recordArr[1][i] + "-" + recordArr[2][i];
							for(i2=0;i2<uniqueIDs.length;i2++){
								if (tmpuniqueID===uniqueIDs[i2]){
									i3 = 1;
								}
							}
							//If we didn't match it then it must be new, lets push it
							if(i3==0){
								uniqueIDs.push(tmpuniqueID);
							}
						}
						
						//Right, we now have an array of project ID's and each of these will be a table entry
						//We also have all the historical records in our array of arrays, at this point we are ready to create the tab
						//Prepare the content
						var hUpgrade = "";
						
						var StatusGot;
						var StatusGotA = [];
						for(i=0;i<uniqueIDs.length;i++){
							StatusGot = '';
							if(i==0){
								//First time
								hUpgrade += "<div id='hUpgradeContent'><table width='100%'><tr><td class='leftbox" + SiteTypeI + "rowspan='4'><h3>Upgrade History</h3></td></tr>";
							} 
								
							hUpgrade += "<tr><td class='leftbox" + SiteTypeI + "' colspan='4' id='row" + itNo + "'>";
							hUpgrade += "<div id='rowHeader" + i + "' class='noissue'><span id='rowHisHead" + i + "on' style='display:inline'><img src='../../apps/img/more.gif' width='11' height='11' onclick='loadRow(\"rowHist" + i + "\", 1)' /></span><span id='rowHisHead" + i + "off' style='display:none'><img src='../../apps/img/less.gif' width='11' height='11' onclick='loadRow(\"rowHist" + i + "\", 2)' /></span><span style='margin-left:5px'>";
							//Add a title for this row
							i3 = 0;
							i2 = 0;
							do {
								tmpuniqueID = recordArr[1][i2] + "-" + recordArr[2][i2];
								if (tmpuniqueID===uniqueIDs[i]){
									hUpgrade += recordArr[2][i2] + " (" + recordArr[1][i2] + ")";
									i3 = 1;
								}
								i2 = i2 + 1;
							} while (i3 == 0 && i2 < recordArr[2].length)
							//Now for the hidden content
							hUpgrade += "</span></div><div id='rowHist" + i + "' style='display: none'>"
							hUpgrade += "<table width=100%><tr><th>Status:</th><th>Notes:</th><th>Update By:</th><th>Date:</th></tr>";
							
							//So we are looking for changes to the status or notes, this means we must record the previous run
							var stat1 = ''; 
							var note1 = '';
							var dateV, dateStr, dateStrA;
							
							for (i4=0;i4<recordArr[0].length;i4++){
								tmpuniqueID = recordArr[1][i4] + "-" + recordArr[2][i4];
								if (tmpuniqueID===uniqueIDs[i]){
									if(recordArr[6][i4]==='current'){
										//Convert the date
										dateStr = recordArr[5][i4];
										dateStrA = dateStr.split(" ");
										dateStrA[0] = dateStrA[0].split("-");
										dateStrA[1] = dateStrA[1].split(":");
										dateStrA[1][2] = dateStrA[1][2].split("+");
										dateV = new Date(dateStrA[0][0],dateStrA[0][1]-1,dateStrA[0][2],dateStrA[1][0],dateStrA[1][1],dateStrA[1][2][0]);
										
										//This is a new record to write away
										hUpgrade += "<tr class='currTR'><td class='currTD'>" + recordArr[0][i4] + "</td><td class='currTD'>" + recordArr[3][i4] + "</td>";
										hUpgrade += "<td class='currTD'>" + recordArr[4][i4] + "</td><td class='currTD'>" + dateV.toDateString() + "  " + dateV.toTimeString() + "</td></tr>";
										
										//We add the current records to the end of the array so the next loop should be the next record; blank the variables.
										stat1 = '';
										note1 = '';
										StatusGot = 'Y';
									} else {
										if(stat1!==recordArr[0][i4] || note1 !==recordArr[3][i4]){
											//Convert the date
											try {
												dateStr = recordArr[5][i4];
												dateStrA = dateStr.split(" ");
												dateStrA[0] = dateStrA[0].split("-");
												dateStrA[1] = dateStrA[1].split(":");
												dateStrA[1][2] = dateStrA[1][2].split("+");
												dateV = new Date(dateStrA[0][0],dateStrA[0][1]-1,dateStrA[0][2],dateStrA[1][0],dateStrA[1][1],dateStrA[1][2][0]);
											
												//This is a new record to write away
												hUpgrade += "<tr><td>" + recordArr[0][i4] + "</td><td>" + recordArr[3][i4] + "</td>";
												hUpgrade += "<td>" + recordArr[4][i4] + "</td><td>" + dateV.toDateString() + "  " + dateV.toTimeString() + "</td></tr>";
											} catch(err) {
												hUpgrade += "<tr><td>" + recordArr[0][i4] + "</td><td>" + recordArr[3][i4] + "</td>";
												hUpgrade += "<td>" + recordArr[4][i4] + "</td><td>Date error in database</td></tr>";
											}
										
											//Record the particulars for the next loop
											stat1 = recordArr[0][i4];
											note1 = recordArr[3][i4];
										}
									}
								}
							}
							
							hUpgrade += "</table></div></td></tr>";
							if (StatusGot !== 'Y'){
								StatusGotA.push("rowHeader" + i);
							}	
						}
					} else {
						var hUpgrade = "";
						hUpgrade += "<div id='hUpgradeContent'><table width='100%'><tr><td class='leftbox" + SiteTypeI + "rowspan='4'><h3>Upgrade History</h3></td></tr>";
						hUpgrade += "<tr><td class='leftbox" + SiteTypeI + "rowspan='4'>There are currently no records</td></tr>";
					}							
					hUpgrade += "</table></div>";
					
					//Change the class for issue div's
					var tmpObjDiv;
					if (typeof StatusGotA != 'undefined'){
						for(i=0;i<StatusGotA.length;i++){
							hUpgrade = hUpgrade.replace("<div id='" + StatusGotA[i] + "' class='noissue'>","<div id='" + StatusGotA[i] + "' class='issue'>");
						}
					}
					
					hUtab = new Ext.Panel ({
						title: 'Upgrade History',
						id: 'hUpgrade',
						html: hUpgrade
					})
						
					//Write the tab
					tabs.add(hUtab);
					
				})
				.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
			})
			.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
		})
		.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
	})
	.fail(function(){alert("An Error has occurred when attempting to retrieve data from the database, some data may be missing");});
}

var divH2 = 0;
function loadRow(itNo, type){
	var elementName = "";
	if (divH2 == 0){
		//We pickup the panel height with nothing expanded and store it in a global variable
		divH2 = tabs.getHeight();
	}
	
	//OK, this functions is called from two tabs and the history tab sends a itNo which starts rowHist
	var tabH = isNaN(itNo) ? "rowHisHead" : "row";
	var tabD = isNaN(itNo) ? "rowHist" : "rowData";
	var tabN = isNaN(itNo) ? "hUtab" : "pUtab";
	if (tabH !== 'row'){
		itNo = itNo.replace('rowHist','');
	}
	
	//Are we expanding or collapsing a record?
	if (type == 1){
		//Expand
		elementName = tabD + itNo;
		document.getElementById(elementName).style.display = 'block';
		var divH = document.getElementById(elementName).offsetHeight;
		//Set the new height
		window[tabN].setHeight(divH + divH2 + 5);
		tabs.doLayout();
		elementName = tabH + itNo + 'on';
		document.getElementById(elementName).style.display = 'none';
		elementName = tabH + itNo + 'off';
		document.getElementById(elementName).style.display = 'inline';
	} else {
		elementName = tabD + itNo;
		document.getElementById(elementName).style.display = 'none';
		elementName = tabH + itNo + 'on';
		document.getElementById(elementName).style.display = 'inline';
		elementName = tabH + itNo + 'off';
		document.getElementById(elementName).style.display = 'none';
		//Go back to the original height
		window[tabN].setHeight(divH2);
		tabs.doLayout();
	}
}

var divH3 = 0;
function loadRow2(itNo, type){
	var elementName = "";
	if (divH3 == 0){
		//We pickup the panel height with nothing expanded and store it in a global variable
		divH3 = tabs.getHeight();
	}
	//Are we expanding or collapsing a record?
	if (type == 1){
		//Expand
		elementName = 'rowDataH' + itNo;
		document.getElementById(elementName).style.display = 'block';
		var divH = document.getElementById(elementName).offsetHeight;
		//Set the new height
		hUtab.setHeight(divH + divH2 + 5);
		tabs.doLayout();
		elementName = 'rowH' + itNo + 'on';
		document.getElementById(elementName).style.display = 'none';
		elementName = 'rowH' + itNo + 'off';
		document.getElementById(elementName).style.display = 'inline';
	} else {
		elementName = 'rowDataH' + itNo;
		document.getElementById(elementName).style.display = 'none';
		elementName = 'rowH' + itNo + 'on';
		document.getElementById(elementName).style.display = 'inline';
		elementName = 'rowH' + itNo + 'off';
		document.getElementById(elementName).style.display = 'none';
		//Go back to the original height
		hUtab.setHeight(divH2);
		tabs.doLayout();
	}
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