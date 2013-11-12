var currGID2;

$(document).ready(function () {
    jQueryReady = true;
	//OK, this is my page loading event and from here we can call the required functions as the page loads
	loginScript(1) //Check for login
});

var queryString, statusField;

var gidRunOK = 0;
function setGID(type){
	if (type==1){
		tableHTML = document.getElementById('urlS').value;
		document.getElementById('functionS').value = "view";
		updateTable(tableHTML);
		gidRunOK = 0;
	} else {
		//Not required for the table editing
		//Update the gidLookupToRow array here
		/*gidLookupToRow = [];
		gidLookupToRow = eval(document.getElementById('gidArray').value);
		gidLookupToRow.splice(0,1); 
						
		//Write away the row number
		for (i=0;i<gidLookupToRow.length;i++){
			if (gidLookupToRow[i]==currGID){
				if (document.getElementById('filterS').value!=''){
					document.getElementById('lower2S').value = i;
				} else {
					document.getElementById('lowerS').value = i;
				}
			}
		}*/
		gidRunOK = 1;
	}
}

function checkFrame() {
	var finduser, stopuser, icontent, icontentChk;
	document.getElementById('header').innerHTML = "<span style='font-weight: bold;'>"+appTitle+"</span><span style='font-size: small;color: #000000;position:absolute;right:0px;'>Logged in as: "+usertext+" <input type='button' value='Logout' onclick='logItOut()' /></span>";
	
	//OK, lets load the main function
	loadTable(usertext);
}

function updateVariableStatusCall(listRef, dis){
	//This function is designed to obtain the listid and pass it to the next function
	var workTypeSel = document.getElementById(listRef);
	var workType = workTypeSel.options[workTypeSel.selectedIndex].innerHTML
	workType = "'" + workType + "'";
	var servReq = "../../apps/functions/vstatus.php?listid=NA&workType=" + workType;
	$.get(servReq, function(data){
		var listid = data;
		if (listid != null && listid != ''){
			updateVariableStatus(listid, dis);
			updateVariableIcon(listid, dis);
		} //If null, this is not a variable status so do nothing
	});
}

function updateVariableStatus(listid, dis){
	var option;
	if (typeof listid != 'undefined'){
		var servReq = "../../apps/functions/vstatus.php?listid=" + listid;
		$.get(servReq, function(data){
			//This ajax request will obtain the list of available status fields and we need to to split it up then update the status drop down boxes
			var statArr = data.split("|");
			
			//Get the option lists as appropriate
			var editFselect = document.getElementById('Sworksstatus');
			//rowOptions = document.getElementById('rec_stat' + rowid); //Need to work this one out later as there are many select options
			
			//Clear the previous options
			var optionS;
			var loops = editFselect.length;
			for(i=0;i<loops;i++){
				editFselect.remove(0);
			}
			
			//Add the new options
			option=document.createElement("option");
			option.value="Please";
			option.text="Please Select an Option";
			if (dis==1){
				option.disabled='disabled'
			}
			editFselect.add(option,null);
			
			for(i=0;i<statArr.length;i++){
				option=document.createElement("option");
				option.value=statArr[i];
				option.text=statArr[i];
				if (dis==1){
					option.disabled='disabled'
				}
				editFselect.add(option,null);
			}
			
			//OK, is there a selected option?
			var gidVal = document.getElementById('Cgid').value;
			if (gidVal != null){
				//We need to get the record value from the server, one more post
				servReq = "../../apps/functions/vstatus.php?listid=NA2&table=" + table + "&gid=" + gidVal;
				$.get(servReq, function(data){
					//This should be the current value
					var currVal = data;
					var foundit = 0;
					//Loop through the options and look for a match
					loops = editFselect.length;
					for(i=0;i<loops;i++){
						if(editFselect.options[i].value==currVal){
							editFselect.selectedIndex = i;
							foundit = 1;
						}
					}
					//If no match then select the first option which should be Please Select...
					if (foundit == 0){
						editFselect.selectedIndex = 0;
					}
				});
			}
		});
	}
	//If the input value is undefined then the status fields are coming from the config.xml and not from a variable status lookup
}

function updateVariableIcon(listid, dis){
	var option;
	if (typeof listid != 'undefined'){
		var servReq = "../../apps/functions/vstatus.php?listid=NA-L" + listid;
		$.get(servReq, function(data){
			//This ajax request will obtain the list of available status fields and we need to to split it up then update the status drop down boxes
			var statArr = data.split("|");
			
			//Get the option lists as appropriate
			var editFselect = document.getElementById('Sicon');
			//rowOptions = document.getElementById('rec_stat' + rowid); //Need to work this one out later as there are many select options
			
			//Clear the previous options
			var optionS;
			var loops = editFselect.length;
			for(i=0;i<loops;i++){
				editFselect.remove(0);
			}
			
			//Add the new options
			option=document.createElement("option");
			option.value="Please";
			option.text="Please Select an Option";
			if (dis==1){
				option.disabled='disabled'
			}
			editFselect.add(option,null);
			
			for(i=0;i<statArr.length;i++){
				option=document.createElement("option");
				option.value=statArr[i];
				option.text=statArr[i];
				if (dis==1){
					option.disabled='disabled'
				}
				editFselect.add(option,null);
			}
			
			//OK, is there a selected option?
			var gidVal = document.getElementById('Cgid').value;
			if (gidVal != null){
				//We need to get the record value from the server, one more post
				servReq = "../../apps/functions/vstatus.php?listid=NA3&table=" + table + "&gid=" + gidVal;
				$.get(servReq, function(data){
					//This should be the current value
					var currVal = data;
					var foundit = 0;
					//Loop through the options and look for a match
					loops = editFselect.length;
					for(i=0;i<loops;i++){
						if(editFselect.options[i].value==currVal){
							editFselect.selectedIndex = i;
							foundit = 1;
						}
					}
					//If no match then select the first option which should be Please Select...
					if (foundit == 0){
						editFselect.selectedIndex = 0;
					}
				});
			}
		});
	}
	//If the input value is undefined then the status fields are coming from the config.xml and not from a variable status lookup
}

function resetView(table, recNo, lower, filter) {
	/*This is the only script that doesn't get the recNo, lower and filter from the document elements
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	filter = document.getElementById('filterS').value;*/
	
	document.getElementById('recnoS').value = recNo;
	document.getElementById('lowerS').value = lower;
	
	if (!filter) {
		document.getElementById('filterS').value = filter;
		updateTable();
	} else {
		document.getElementById('filterS').value = '';
		updateTable();
	}
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

$.urlParam = function(name){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results != null){
		return results[1] || 0;
	} else {
		return 0;
	}
}

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

var table, rowNo, lower, proj, orderBy, geomF, filter, tableWidth, functionT, lookup, viewport, tableport, tableHTML, tabFilter;
var backButtonArray0 = document.getElementsByName('backBut0');
var forButtonArray0 = document.getElementsByName('forBut0');
var exclusion = [];
var tableNo = 0;
function loadTable(usertext) {
	var textStr;
	//If we still don't have a username then there is a problem - don't load the map!
	if (usertext==="") {
		document.getElementById('username').value = usertext;
		textStr = "<h3 align='center'>Log on Error</h3><p align='center'>If you believe this username should have access to this content please contact the GIS server management team.</p>";
		document.getElementById("h_first").innerHTML = textStr;
	} else {
		//Check if the user is permitted to use this page
		document.getElementById('username').value = usertext;
		var okint = 0;
		for (i=0;i<userArray.length;i++){
			if (userArray[0]=="*"){
				//This means we are not limiting the page to a specific user
				okint = 1;
			} else {
				if (userArray[i]==usertext) {
					okint = 1;
				}
			}
		}
		if (okint == 0) {
			textStr = "<h3 align=\"center\">Log on Error</h3><p align=\"center\">User ";
			textStr += usertext;
			textStr += " is not authorised to view this content. <br /> If you have logged in as the wrong user you may log out using the button below and refresh the page to try again.</p><br /> <p align=\"center\"><input type='button' value='Logout' onclick='logItOut()' /></p><br /><p align=\"center\">If you believe this username should have access to this content please contact the GIS server management team.</p>";
			document.getElementById("h_first").innerHTML = textStr;
		} else {
			//OK, we are logged in and everything is ready to go; lets load the variables
			
			//This function works by storing some variables in the URL 
			table = decodeURIComponent($.urlParam('table')); 
			tableT = decodeURIComponent($.urlParam('title')); 
			tableG = decodeURIComponent($.urlParam('geo')); 
			rowNo = decodeURIComponent($.urlParam('rowno'));
			lower = decodeURIComponent($.urlParam('lower')); 
			proj = decodeURIComponent($.urlParam('proj'));
			orderBy = decodeURIComponent($.urlParam('order')); 
			geomF = decodeURIComponent($.urlParam('geomF')); 
			lookup = decodeURIComponent($.urlParam('lookup')); 
			site_ref = decodeURIComponent($.urlParam('site_ref')); 
			omu_ref = decodeURIComponent($.urlParam('omu_ref')); 
			otu_ref = decodeURIComponent($.urlParam('otu_ref')); 
			tabFilter = decodeURIComponent($.urlParam('tabF'));
			tabFilter = tabFilter.replace(/\^eq\^/g, " = ");
			tabFilter = tabFilter.replace(/`/g, "'");
			
			tableArray.push(table);
			tableTitles.push(tableT);
			tableGeomEdit.push(tableG);
						
			//Did we get the most important values?
			if (table == 0 || orderBy == 0 || geomF == 0){
				//Error, stop running
				alert("You need to specify some more information within the URL");
			} else {
				//Less important values may be swapped to defaults
				if (rowNo == 0){ 
					rowNo = 15;
				}
				document.getElementById('recnoS').value = rowNo;
				//lower default is zero
				document.getElementById('lowerS').value = lower;
				if (proj == 0){ 
					proj = 27700;
				}
				
				//OK, so we exclude geometry fields here, this is a table only editor and if we need to update geometry we do so on the map or look it up
				exclusion.push(geomF);
				
				//Do we need to exclude any other fields?
				
				//Continue to load the page
				$.get("../../apps/functions/tableset.php?table=" + table + "&fun=1", function(data){
					eval(data); //This is to cope with the fact we have no table definition at the start
					$.get("../../apps/functions/tableset.php?table=" + table + "&fun=3&lookup=" + lookup, function(data){
						eval(data); //This is to cope with the fact we have no table definition at the start
					
						//OK, lets load the table
						tableport = new Ext.Panel({
							layout: 'fit',
							height:(winH-88),
							width: winW, //Width minus the east or west panel width
							region: 'center', 
							split: true,
							collapsible: false,
							collapsed: false, //set this to true if the table is secondary
							title: 'Table Edits',
							activeItem: 0, // index or id
							items: [{
								id: 'Attributes Query',
								style: 'background-color: #fff',
								html: ''
							}],
							margins: '0 0 0 0',
							bodyCfg : { cls:'x-panel-body no-x-scroll'}
						});
						viewport = new Ext.Panel({ //Viewport would fill the full screen so I'm using a panel
							renderTo: 'h_first',
							height: winH-68,  //Trouble is that we need to specify a height.
							layout:'border',
							items:[tableport]
						});
						recNo = document.getElementById('recnoS').value;
						lower = document.getElementById('lowerS').value;
						filter = document.getElementById('filterS').value;
						tableWidth = winW;
						if (site_ref == 0 && omu_ref == 0 && otu_ref == 0){
							functionT = document.getElementById('functionS').value;
						} else {
							if (site_ref != 0){
								functionT = "add&popF=siteref^" + site_ref;
							} else if (omu_ref != 0){
								functionT = "add&popF=omuref^" + omu_ref;
							} else {
								functionT = "add&popF=oturef^" + otu_ref;
							}
						}
						
						if (filter.length == 0){
							queryString = "";
							tableHTML = "../../apps/functions/tableedit.php";
							queryString +="tableWidth=" + tableWidth + "&table=" + table + "&function=" + functionT  + "&recNo=" + recNo + "&lower=" + lower;
						} else {
							queryString = "";
							tableHTML = "../../apps/functions/tableedit.php";
							queryString +="tableWidth=" + tableWidth + "&table=" + table + "&function=" + functionT + "&recNo=" + recNo + "&lower=" + lower + "&filter=" + filter;
						}
						//Add lookups
						if (lookup!=0){
							queryString += "&lookup=" + lookup;
						}
						//Add table filter if applicable
						if (typeof tabFilter!='undefined'){
							if (tabFilter!=0){
								queryString += "&tabF=" + tabFilter;
							}
						}
						updateTable(tableHTML, 'override');
					});
				});
			}
		}
	}
}

function updateTable(tableHTML, override, tableSwap){
	var xhr = false;
	if (window.ActiveXObject){
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		xhr = new XMLHttpRequest();
	}

	//The recNo and lower values are now array variable so we need to split up the arrays however for now we simply pass it to the php file
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	lower2 = document.getElementById('lower2S').value;
	
	if (typeof tableSwap != 'undefined'){
		table = tableSwap;
	}
	
	if (override != 'override'){
		queryString = "";
		tableHTML = "../../apps/functions/tableedit.php";
		queryString += "tablewidth= " + tableWidth + "&table=" + table + "&function=" + document.getElementById('functionS').value

		//Add recNo and lower
		if (document.getElementById('filterS').value!=''){
			queryString += "&recNo=" + recNo + "&lower=" + lower2; //Need to temporarily override the lower if there is a filter
		} else {
			queryString += "&recNo=" + recNo + "&lower=" + lower;
		}

		//Add a selected row where appropriate
		if (currGID!=''){
			document.getElementById('currGID').value;
			queryString += "&currGID=" + document.getElementById('currGID').value;
		}

		//Add a filter if present
		if (document.getElementById('filterS').value!=''){
			queryString += "&filter=" + document.getElementById('filterS').value;
		}
		document.getElementById('urlS').value = tableHTML + "?" + queryString;
		
		//Add lookups
		if (lookup!=0){
			queryString += "&lookup=" + lookup;
		}
		
		//Add table filter if applicable
		if (typeof tabFilter!='undefined'){
			if (tabFilter!=0){
				queryString += "&tabF=" + tabFilter;
			}
		}
	}
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			if (!document.getElementById('Attributes Query')) {
				if(loadAttributes==true || loadAttributes=="True" || loadAttributes=="true" || loadAttributes=="Yes" || loadAttributes=="yes"){
					document.location.reload();
				} else {
					document.getElementById('searchHandler').innerHTML = xhr.responseText;
				}
			} else {
				document.getElementById('Attributes Query').innerHTML = xhr.responseText;

				if (tableHTML.indexOf("function=geomsave")!=-1) {
					if(table.indexOf("_view") == -1){
						defineFieldNames(table);
					} else {
						defineFieldNames(table.substring(1,table.indexOf("_view")));
					}
					var headID = document.getElementsByTagName("head")[0];
					var newScript = document.createElement('script');
					newScript.type = 'text/javascript';
					var tmpLoc = tableHTML.indexOf("?");
					var textStr = "../../apps/functions/dynamite.php" + tableHTML.substr(tmpLoc); //This removes the results.php section of the other URL
					newScript.src = textStr;
					headID.appendChild(newScript);
					//CHECK THIS
				} else {
					document.getElementById('urlS').value = tableHTML;
				}
			}
		} else {
			if (typeof xhr.status != "undefined" && typeof xhr.status != "unknown") {
				if (xhr.status != 200 && xhr.status != 0){
					alert ('Request Failed' + xhr.status);
				}
			}
		}
	}
	//Serialize the data
    for(var i = 0; i < exclusion.length; i++) {
		if (i==0){
			queryString += "&excl=" + exclusion[i];
		} else {
			queryString += "^" + exclusion[i];
		}
    }
	
	//Check for special edit style view 
	tableNo = -1; 
	var ti;
	for (ti=0;ti<tableArray.length;ti++){
		if (table===tableArray[ti]){
			tableNo = ti;
		}
	}
	if (tableSelectStyle[tableNo]==='view-edit'){
		if (tableHTML.indexOf('currGID')!==-1){
			//We have a selection, lets check the table variables
			if (tableHTML.indexOf("function=view")!==-1){ 
				//We didn't find the view-edit option
				currGID2 = "function=view-edit&selMode=view-edit&gid=" + currGID2;
				tableHTML = tableHTML.replace("function=view", currGID2);
			} //If it is found there is an issue and we do nothing!
		} else {
			if (tableHTML.indexOf("function=view")!==-1){ 
				//We didn't find the view-edit option
				currGID2 = "function=view&selMode=view-edit";
				tableHTML = tableHTML.replace("function=view", currGID2);
			} //If it is found there is an issue and we do nothing!
		}
	} else {
		//Ensure that the default Selection Mode is sent to server side scripting
		currGID2 = "function=view&selMode=view";
		tableHTML = tableHTML.replace("function=view", currGID2);
	}
	xhr.open("POST",tableHTML,true); // Insert a reference of the php page you wanna get instead of yourpage.php
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(queryString);
}

function insertRow(tableHTML){
    var xhr = false;
	if (window.ActiveXObject){
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		xhr = new XMLHttpRequest();
	}
	table = tableHTML;
	//The recNo and lower values are now array variable so we need to split up the arrays however for now we simply pass it to the php file
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	lower2 = document.getElementById('lower2S').value;
    tableHTML = "../../apps/functions/tableedit.php";
	queryString = "tableWidth=" + tableWidth + "&table=" + table + "&function=add";
	
	//Add lookups
	if (lookup!=0){
		queryString += "&lookup=" + lookup;
	}

    xhr.open("POST",tableHTML,true); // Insert a reference of the php page you wanna get instead of yourpage.php
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(queryString);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			if (!document.getElementById('Attributes Query')) {
				document.location.reload();
			} else {
				document.getElementById('Attributes Query').innerHTML = xhr.responseText;
				document.getElementById('urlS').value = tableHTML;
			}
		} else {
			if (xhr.status != 200){
				alert ('Request Failed' + xhr.status);
			}
		}
	};
}

var default_ex, iframeV, colRef;
var gidArray, geomArray, geomEdit;
geomEdit = -1;
function dynaToggleCols(tables, colNoStr) {
	var colref1, colref2, head1, overMax, indexRef, i, ArrRef, EndRef, stylerules;
	
	var refreshT = -1; //Always doing this on this script
	colRef = refreshT; //We need a full stylesheet refresh after an update; specify -1
	if (refreshT == -1) {
		document.getElementById('colNo').value = colNoStr;
	}
	
	//The iframe should now exist, lets define it for later; this variable is global.
	iframeV = document.getElementById('Attributes Query'); //This is now a DIV
	
	//Set these variables here
	dir = document.getElementById('dir').value;
	maxCol = document.getElementById('maxCol').value;
	
	//Pick up the colNo
	var tokensC = colNoStr.split('|');
	
	//Loop through all tables and call the refresh
	for (i=0;i<tables;i++){
		colNo = parseInt(tokensC[i]);
		SetUpToggleCols(dir, colNo, maxCol, i); 
	}
	if (refreshT == -1) {
		colRef = 0; //We have set up the table so now we reset this to zero
		refreshT = 0;
	}
}

function dynaScriptToggleCols(dir, colNo, maxCol, tableNo) {
	//Set these variables here
	document.getElementById('dir').value = dir;
	document.getElementById('maxCol').value = maxCol;
	
	//Pick up the colNo
	colNo = document.getElementById('colNo').value;
	var tokensC = colNo.split('|');
	colNo = parseInt(tokensC[tableNo]);
	
	SetUpToggleCols(dir, colNo, maxCol, tableNo); 
}

function updateRow(table, gid) {
	var fieldName;
	//This shows the hidden div so we need to pass some extra variables for the viewer on return
	
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	filter = document.getElementById('filterS').value;
	if (fieldName== 'Please Select Column') {
		updateTable();
	} else {
		if (filter.length > 0){
			queryString = "";
			tableHTML = "../../apps/functions/tableedit.php";
			queryString +="tableWidth=" + tableWidth + "&table=" + table + "&function=edit&gid=" + gid + "&recNo=" + recNo + "&lower=" + lower;
		} else {
			queryString = "";
			tableHTML = "../../apps/functions/tableedit.php";
			queryString +="tableWidth=" + tableWidth + "&table=" + table + "&function=edit&gid=" + gid + "&recNo=" + recNo + "&lower=" + lower + "&filter=" + filter;
		}
		//Add lookups
		if (lookup!=0){
			queryString += "&lookup=" + lookup;
		}
		//Add table filter if applicable
		if (typeof tabFilter!='undefined'){
			if (tabFilter!=0){
				queryString += "&tabF=" + tabFilter;
			}
		}
		updateTable(tableHTML, 'override');
	}
}

function lowerSet(recNo, lower){
	document.getElementById('recnoS').value = recNo;
	document.getElementById('lowerS').value = lower;
}

function backrecset(table, tableNo) {
	recNo = document.getElementById('recnoS').value;
	if (document.getElementById('filterS').value!=''){
		lower = document.getElementById('lower2S').value;
	} else {
		lower = document.getElementById('lowerS').value;
	}
	
	//We need to extract the correct lower value and then put it back together
	var tokensR = recNo.split('|');
	var tokensL = lower.split('|');
	tokensL[tableNo] = parseInt(tokensL[tableNo]) - parseInt(tokensR[tableNo]);
	
	recNo = "";
	lower = "";
	for (i=0;i<tokensL.length;i++){
		if (i==0){
			recNo += tokensR[i];
			lower += tokensL[i];
		} else {
			recNo += "|" + tokensR[i];
			lower += "|" + tokensL[i];
		}
	}
	if (document.getElementById('filterS').value!=''){
		document.getElementById('lower2S').value = lower;
	} else {
		document.getElementById('lowerS').value = lower;
	}
	updateTable();
}

function nextrecset(table, tableNo) {
	recNo = document.getElementById('recnoS').value;
	if (document.getElementById('filterS').value!=''){
		lower = document.getElementById('lower2S').value;
	} else {
		lower = document.getElementById('lowerS').value;
	}
	
	//We need to extract the correct lower value and then put it back together
	var tokensR = recNo.split('|');
	var tokensL = lower.split('|');
	tokensL[tableNo] = parseInt(tokensL[tableNo]) + parseInt(tokensR[tableNo]);
	
	recNo = "";
	lower = "";
	for (i=0;i<tokensL.length;i++){
		if (i==0){
			recNo += tokensR[i];
			lower += tokensL[i];
		} else {
			recNo += "|" + tokensR[i];
			lower += "|" + tokensL[i];
		}
	}
	if (document.getElementById('filterS').value!=''){
		document.getElementById('lower2S').value = lower;
	} else {
		document.getElementById('lowerS').value = lower;
	}
	updateTable();
}

function recNochange(tableNo, NEWrecNo) {
	//We need to extract the correct lower value and then put it back together
	recNo = document.getElementById('recnoS').value;
	var tokensR = recNo.split('|');
	tokensR[tableNo] = parseInt(NEWrecNo);
	
	recNo = "";
	lower = "";
	for (i=0;i<tokensR.length;i++){
		if (i==0){
			recNo += tokensR[i];
		} else {
			recNo += "|" + tokensR[i];
		}
	}
	document.getElementById('recnoS').value = recNo; //This is replaced
	
	updateTable();
} 

function gedCall(table2, funk, gid, callerrow,closeBack) {
	//Which table is this?
	for (i=0;i<tableArray.length;i++){
		if(table2 == tableArray[i]){
			var tableRef = i;
		}
	}

	//Is it valid?
	var eerr;
	var validF = validateForm();
	if (validF == false) {
		eerr = 1;
	}
	if (eerr != 1){
		if (funk == 'reset') {
			var checkSure = confirm("Are you sure you wish to cancel? All changes will be lost!");
			if (checkSure==true) {
				document.getElementById('functionS').value = "view";
				updateTable();
			}
		} else if (funk == 'reset-end') {
			document.getElementById('functionS').value = "view";
			updateTable();
		} else {
			
			defineFieldNames(table2);
	
			var i2, i3, insertType, queryStr, queryStr2, queryStr3, queryStr4, synNull, xhr3, phpURL, gidVal;
			xhr3 = false;
			if (window.ActiveXObject){
				xhr3 = new ActiveXObject("Microsoft.XMLHTTP");
			} else {
				xhr3 = new XMLHttpRequest();
			}
			
			var fieldNo = fieldNames.length;
			var tmpT = "";
			var tmpObj;
			var fieldVSingle = [];
			var fieldNSingle = [];
			//The first job is to pick up the user inputs from the edit forms
			if (funk != 'drop'){
				if (funk != 'supdate'){
					for (i=0;i<fieldNo;i++){
						tmpT = "H" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj != null) {
							// variable is defined
							fieldVSingle.push(tmpObj.value.replace(/&/g,'chr(38)'));
							fieldNSingle.push(fieldNames[i]);
						} else {
							tmpT = "S" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj != null) {
								// variable is defined
								fieldVSingle.push(tmpObj.value);
								fieldNSingle.push(fieldNames[i]);
							} else {
								tmpT = "T" + fieldNames[i];
								tmpObj = document.getElementById(tmpT);
								if (tmpObj != null) {
									// variable is defined
									fieldVSingle.push(tmpObj.value.replace(/&/g,'chr(38)'));
									fieldNSingle.push(fieldNames[i]);
								} else {
									tmpT = "O" + fieldNames[i];
									tmpObj = document.getElementById(tmpT);
									if (tmpObj != null) {
										// variable is defined
										if (tmpObj.checked == true) {
											fieldVSingle.push("on");
											fieldNSingle.push(fieldNames[i]);
										} else {
											fieldVSingle.push("off");
											fieldNSingle.push(fieldNames[i]);
										}
									} else {
										tmpT = "C" + fieldNames[i];
										tmpObj = document.getElementById(tmpT);
										if (tmpObj != null) {
											// variable is defined
											fieldVSingle.push(tmpObj.value.replace(/&/g,'chr(38)'));
											fieldNSingle.push(fieldNames[i]);
										}
									}
								}
							}
						}
						if (fieldNames[i]=='gid'){
							if (isNumber(tmpObj.value)) {
								gidVal = tmpObj.value;
							} else {
								gidVal = '';
							}
						}
					}
				}
			} else {
				//This is a drop command so we don't need all the searching through update fields
				gidVal = gid;
			}

			//Create a postgres safe datetimestamp
			var cDT = new Date();
			//Get timezone
			var TZ = cDT.toUTCString();
			TZ = TZ.substring(TZ.length-3);
			//Pad the numbers below 10
			var MDT = cDT.getMonth()+1;
			if (MDT < 10) {
				MDT = '0' + MDT;
			}
			var DDT = cDT.getDate();
			if (DDT < 10) {
				DDT = '0' + DDT;
			}
			var HDT = cDT.getHours();
			if (HDT < 10) {
				HDT = '0' + HDT;
			}
			var MmDT = cDT.getMinutes();
			if (MmDT < 10) {
				MmDT = '0' + MmDT;
			}
			var SDT = cDT.getSeconds();
			if (SDT < 10) {
				SDT = '0' + SDT;
			}
			var currentDT = cDT.getFullYear() + '-' + MDT + '-' + DDT + 'T' + HDT + ':' + MmDT + ':' + SDT + TZ;

			//Next we create a query
			//We will process each record using javascript then AJAX a php call
			var fieldLimit = 0;
			if (funk == 'insert') {
				queryStr4 = "qstr=INSERT";
			} else if (funk == 'update') {
				queryStr4 = "qstr=UPDATE";
			} else if (funk == 'supdate') {
				queryStr4 = "qstr=SUPDATE";
				fieldLimit = 1;
			} else if (funk == 'insert') {
				queryStr4 = "qstr=INSERT";
			} else if (funk == 'drop') {
				queryStr4 = "qstr=DROP";
			}
			//queryStr4 += "&table=" + table2;
			if (table2 == ''){
				queryStr4 += "&table='" + table + "'&";
			} else {
				queryStr4 += "&table='" + table2 + "'&";
			}
			var excludeIt;
			if (funk != 'drop'){
				i3 = 0;
				i4 = 0;
				i5 = 0;
				for (i2=0;i2<fieldNo;i2++){
					var excludedC = 0;
						for(e1=0;e1<exclusion.length;e1++){
							if(exclusion[e1]==fieldNames[i2]){
								excludedC = 1;
							}
						}
					if(excludedC==0){
						//Set the mod fields (these are automatic)
						if (fieldNSingle[i5] == 'mod_by' || fieldNSingle[i5] == 'mod_date') {
							if (fieldNSingle[i5] == 'mod_by'){
								queryStr2 = fieldNSingle[i5] + "=";
								queryStr3 = usertext;
								i3 = i3 + 1;
								i4 = i4 + 1;
							} else if (fieldNSingle[i5] == 'mod_date') {
								queryStr2 = fieldNSingle[i5] + "=";
								queryStr3 = currentDT;
								i3 = i3 + 1;
								i4 = i4 + 1;
							}
						} else {
							if (fieldLimit==1) {
								//We don't access the fieldNSingle array so we need to pickup mod_by and mod_date seperately
								if (fieldNames[i2] == 'gid' ){
									queryStr2 = fieldNames[i2] + "=";
									queryStr3 = gid;
									i3 = i3 + 1;
									i4 = i4 + 1;
								} else if (fieldNames[i2] == statusField[tableRef]) {
									queryStr2 = fieldNames[i2] + "=";
									queryStr3 = document.getElementById(callerrow).value;
									if (queryStr3 != true && queryStr3 != false){
										queryStr3 = queryStr3.replace(/,/g,"%2C");
									}
									i3 = i3 + 1;
									i4 = i4 + 1;
								} else if (fieldNames[i5] == 'mod_by'){
									queryStr2 = fieldNames[i5] + "=";
									queryStr3 = usertext;
									i3 = i3 + 1;
									i4 = i4 + 1;
								} else if (fieldNames[i5] == 'mod_date') {
									queryStr2 = fieldNames[i5] + "=";
									queryStr3 = currentDT;
									i3 = i3 + 1;
									i4 = i4 + 1;
								} else {
									//otherwise we exclude the field
									i3 = 0;
								}
							} else if (fieldLimit==0) {
								if (fieldVSingle[i5] == '' || fieldVSingle[i5] == 'Undefined' || fieldVSingle[i5] == '\n' || fieldVSingle[i5] == 'null'){
									queryStr2 = fieldNSingle[i5] + "=";
									queryStr3 = 'null';
									i3 = i3 + 1;
									i4 = i4 + 1;
								} else {
									queryStr2 = fieldNSingle[i5] + "=";
									queryStr3 = fieldVSingle[i5];
									if (queryStr3 != true && queryStr3 != false){
										queryStr3 = queryStr3.replace(/,/g,"%2C");
									}
									i3 = i3 + 1;
									i4 = i4 + 1;
								}
							}
						}
						if (i4==1 && i3!=0){
							queryStr4 += queryStr2 + "'" + queryStr3 + "'";
						} else if (i4>1 && i3!=0) {
							queryStr4 += "&" + queryStr2 + "'" + queryStr3 + "'";
						}
						i5 = i5 + 1;
					}
				}
			} else {
				queryStr4 += "gid=" + gidVal;
			}
			queryStr4 = encodeURI(queryStr4);
			//alert(queryStr4);

			//Now we run the function
			if(funk == 'drop') {
				var checkSure = confirm("Are you sure you wish to delete this row? It may not be possible to restore this data later!");
				//alert(queryStr4);
				if (checkSure==true) {
					phpURL = "../../apps/functions/multied.php";
					xhr3.open("POST",phpURL,true); // Insert a reference of the php page you wanna get instead of yourpage.php
					xhr3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhr3.send(queryStr4);

					//Report back on whether or not the edit was sucessful
					xhr3.onreadystatechange = function () {
						if (xhr3.readyState == 4 && xhr3.status == 200){
							respondT = xhr3.responseText;
							if (respondT != 'OK') {
								alert(respondT); //ERROR Message
							} else {
								//Successful save
								//Refresh the screen to previous use
								document.getElementById('functionS').value = "view";
								if (funk == 'drop') {
									document.getElementById('currGID').value = "";
								}
								updateTable();
							}
						} else {
							if (xhr3.status != 200){
								alert('Edit number ' + geomEdit + ' was skipped due to a query error!');
							}
						}
					}
				}
			} else {
				phpURL = "../../apps/functions/multied.php";
				//alert(queryStr4);
				xhr3.open("POST",phpURL,true); // Insert a reference of the php page you wanna get instead of yourpage.php
				xhr3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr3.send(queryStr4);

				//Report back on whether or not the edit was sucessful
				xhr3.onreadystatechange = function () {
					if (xhr3.readyState == 4 && xhr3.status == 200){
						respondT = xhr3.responseText;
						if (respondT != 'OK') {
							alert(respondT); //ERROR Message
						} else {
							//Successful save
							//Refresh the screen to previous use
							if (closeBack==0){
								document.getElementById('functionS').value = "view";
								if (funk == 'drop') {
									document.getElementById('currGID').value = "";
								}
								updateTable();
							} else {
								//We need to reload the table view
								gedCall(table, "reset-end")
							}
						}
					} else {
						if (xhr3.status != 200){
							alert('Edit number ' + geomEdit + ' was skipped due to a query error!');
						}
					}
				}
			}
		}
	}
}

function validateForm() {
	//Return true if the form validates
	var who;
	who = document.getElementById('username').value; 
	if (who == "" || who == 'UNKNOWN') {
		alert('We need more information about who you are!');
	} else {
		return true;
	}
}
