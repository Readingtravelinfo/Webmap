/*Global variable configuration*/
var conLayers = [];
var conLayersT = [];
var conTables = [];
var conTablesT = [];
var oR = []; //objectReference array
var i, i2, i3, i4; 
var str = '';

/*Create the blank row strings for each of the tables*/
var pUsers = '<tr><td id="pUr`c1" class="ed"></td><td><a onclick("moveRow(\"up\",\"pUr`c1\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"pUr`\")")>&#x25BC;</a></td></tr>';
var pBase = '<tr><td id="bMr`c1" class="ed"></td><td id="bMr`c2" class="ed"></td><td><a onclick("moveRow(\"up\",\"bMr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"bMr`\")")>&#x25BC;</a></td></tr>';
var pFExclusion = '<tr><td id="fEr`c1" class="ed"></td><td><a onclick("moveRow(\"up\",\"fEr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"fEr`\")")>&#x25BC;</a></td></tr>';
var pPredef = '<tr><td id="pDmr`c1" class="ed"></td><td id="pDmr`c2" class="ed"></td><td><a onclick("moveRow(\"up\",\"pDmr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"pDmr`\")")>&#x25BC;</a></td></tr>';
var pStyle = '<tr><td id="sCr`c1"><select id="sCsel"></select></td><td id="sCr`c2" class="ed"></td><td id="sCr`c3" class="ed"></td><td><a onclick("moveRow(\"up\",\"sCr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"sCr`\")")>&#x25BC;</a></td></tr>';
var pLayer = '<tr><td><a onclick("moveRow(\"up\",\"pLr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"pLr`\")")>&#x25BC;</a></td><td id="pLr`c1" class="ed"></td><td id="pLr`c2" class="ed"></td><td id="pLr`c3" class="ed"></td><td id="pLr`c4"><select id="pLbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c5"><select id="pLbool2-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c6" class="ed"></td><td id="pLr`c7"><select id="pLbool3-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c8" class="ed"></td><td id="pLr`c9" class="ed"></td><td id="pLr`c10"><select id="pLbool4-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c11"><select id="pLbool5-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c12" class="ed"></td></tr>';
var pPopHov = '<tr><td id="pUhr`c1"></td><td id="pUhr`c2"><select id="pUhbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pUhr`c3" class="ed"></td><td id="pUhr`c4" class="ed"></td><td id="pUhr`c5" class="ed"></td><td id="pUhr`c6" class="ed"></td><td id="pUhr`c7" class="ed"></td><td id="pUhr`c8" class="ed"></td></tr>';
var pZoom = '<tr><td id="pZr`c1"></td><td id="pZr`c2"><select id="pZbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pZr`c3" class="ed"></td><td id="pZr`c4"><select id="pZbool2-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pZr`c5" class="ed"></td><td id="pZr`c6" class="ed"></td></tr>';
var pWFS = '<tr><td id="pWFSr`c1"></td><td id="pWFSr`c2" class="ed"></td><td id="pWFSr`c3" class="ed"></td><td id="pWFSr`c4" class="ed"></td><td id="pWFSr`c5" class="ed"></td><td id="pWFSr`c6" class="ed"></td><td id="pWFSr`c7" class="ed"></td><td id="pWFSr`c8" class="ed"></td><td id="pWFSr`c9" class="ed"></td></tr>';
var pLookup = '<tr><td id="tLr`c1" class="ed"></td><td id="tLr`c2" class="ed"></td><td id="tLr`c3" class="ed"></td><td id="tLr`c4" class="ed"></td><td><a onclick("moveRow(\"up\",\"tLr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tLr`\")")>&#x25BC;</a></td></tr>';
var pOption = '<tr><td id="tOr`c1" class="ed"></td><td id="tOr`c2" class="ed"></td><td id="tOr`c3" class="ed"></td><td id="tOr`c4" class="ed"></td><td><a onclick("moveRow(\"up\",\"tOr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tOr`\")")>&#x25BC;</a></td></tr>';
var pStatus = '<tr><td id="tSr`c1" class="ed"></td><td id="tSr`c2"><select id="pSbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="tSr`c3" class="ed"></td><td id="tSr`c4"><select id="tSsel"></select></td><td id="tSr`c5" class="ed"></td><td><a onclick("moveRow(\"up\",\"tSr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tSr`\")")>&#x25BC;</a></td></tr>';
var pOTable = '<tr><td><a onclick("moveRow(\"up\",\"oTr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"oTr`\")")>&#x25BC;</a></td><td id="oTr`c1" class="ed"></td><td id="oTr`c2"><select id="oTbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="oTr`c3" class="ed"></td><td id="oTr`c4" class="ed"></td><td id="oTr`c5" class="ed"></td><td id="oTr`c6" class="ed"></td><td id="oTr`c7" class="ed"></td><td id="oTr`c8" class="ed"></td></tr>';
var pExclusion = '<tr><td id="tEr`c1" class="ed"></td><td id="tEr`c2"><select id="tEsel"></select></td><td><a onclick("moveRow(\"up\",\"tEr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tEr`\")")>&#x25BC;</a></td></tr>';
var pDiscol = '<tr><td id="dCr`c1" class="ed"></td><td id="dCr`c2"><select id="dCsel"></select></td><td><a onclick("moveRow(\"up\",\"dCr`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"dCr`\")")>&#x25BC;</a></td></tr>';
var pLoops = '<tr><td id="tLor`c1"><select id="tLosel"></select></td><td id="tLor`c2" class="ed"></td><td><a onclick("moveRow(\"up\",\"tLor`\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tLor`\")")>&#x25BC;</a></td></tr>';
var pUsers = '<tr><td id="pUr`c1" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pUsers\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pUsers\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'pUr`c1\')" /></td></tr>';
var pBase = '<tr><td id="bMr`c1" class="ed"></td><td id="bMr`c2" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pBase\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pBase\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'bMr`c1\')" /></td></tr>';
var pFExclusion = '<tr><td id="fEr`c1" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pFExclusion\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pFExclusion\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'fEr`c1\')" /></td></tr>';
var pPredef = '<tr><td id="pDmr`c1" class="ed"></td><td id="pDmr`c2" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pPredef\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pPredef\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'pDmr`c1\')" /></td></tr>';
var pStyle = '<tr><td id="sCr`c1"><select id="sCsel-`"></select></td><td id="sCr`c2" class="ed"></td><td id="sCr`c3" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pStyle\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pStyle\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'sCr`c1\')" /></td></tr>';
var pLayer = '<tr><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pLayer\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pLayer\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'pLr`c1\')" /></td><td id="pLr`c1" class="ed"></td><td id="pLr`c2" class="ed"></td><td id="pLr`c3" class="ed"></td><td id="pLr`c4"><select id="pLbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c5"><select id="pLbool2-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c6" class="ed"></td><td id="pLr`c7"><select id="pLbool3-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c8" class="ed"></td><td id="pLr`c9" class="ed"></td><td id="pLr`c10"><select id="pLbool4-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c11"><select id="pLbool5-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr`c12" class="ed"></td></tr>';
var pPopHov = '<tr><td id="pUhr`c1"></td><td id="pUhr`c2"><select id="pUhbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pUhr`c3" class="ed"></td><td id="pUhr`c4" class="ed"></td><td id="pUhr`c5" class="ed"></td><td id="pUhr`c6" class="ed"></td><td id="pUhr`c7" class="ed"></td><td id="pUhr`c8" class="ed"></td></tr>';
var pZoom = '<tr><td id="pZr`c1"></td><td id="pZr`c2"><select id="pZbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pZr`c3" class="ed"></td><td id="pZr`c4"><select id="pZbool2-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pZr`c5" class="ed"></td><td id="pZr`c6" class="ed"></td></tr>';
var pWFS = '<tr><td id="pWFSr`c1"></td><td id="pWFSr`c2"><select id="pWFStype-`"><option value="Postgis">Postgis</option><option value="Shapefile">Shapefile</option><option value="Other">Other</option></select></td><td id="pWFSr`c3" class="ed"></td><td id="pWFSr`c4" class="ed"></td><td id="pWFSr`c5" class="ed"></td><td id="pWFSr`c6"><select id="pWFSbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="pWFSr`c7" class="ed"></td><td id="pWFSr`c8" class="ed"></td><td id="pWFSr`c9" class="ed"></td></tr>';
var pLookup = '<tr><td id="tLr`c1" class="ed"></td><td id="tLr`c2" class="ed"></td><td id="tLr`c3" class="ed"></td><td id="tLr`c4" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pLookup\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pLookup\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'tLr`c1\')" /></td></tr>';
var pOption = '<tr><td id="tOr`c1" class="ed"></td><td id="tOr`c2" class="ed"></td><td id="tOr`c3" class="ed"></td><td id="tOr`c4" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pOption\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pOption\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'tOr`c1\')" /></td></tr>';
var pStatus = '<tr><td id="tSr`c1" class="ed"></td><td id="tSr`c2"><select id="pSbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="tSr`c3" class="ed"></td><td id="tSr`c4"><select id="tSsel"></select></td><td id="tSr`c5" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pStatus\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pStatus\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'tSr`c1\')" /></td></tr>';
var pOTable = '<tr><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pOTable\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pOTable\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'oTr`c1\')" /></td><td id="oTr`c1" class="ed"></td><td id="oTr`c2"><select id="oTbool1-`"><option value="True">True</option><option value="False">False</option></select></td><td id="oTr`c3" class="ed"></td><td id="oTr`c4"><select id="oTview-`"><option value="view">Highlighted Row</option><option value="view-edit">Record View</option></select></td><td id="oTr`c5" class="ed"></td><td id="oTr`c6" class="ed"></td><td id="oTr`c7" class="ed"></td><td id="oTr`c8" class="ed"></td></tr>';
var pExclusion = '<tr><td id="tEr`c1" class="ed"></td><td id="tEr`c2"><select id="tEsel"></select></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pExclusion\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pExclusion\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'tEr`c1\')" /></td></tr>';
var pDiscol = '<tr><td id="dCr`c1" class="ed"></td><td id="dCr`c2"><select id="dCsel"></select></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pDiscol\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pDiscol\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'dCr`c1\')" /></td></tr>';
var pLoops = '<tr><td id="tLor`c1"><select id="tLosel"></select></td><td id="tLor`c2" class="ed"></td><td><img src="../../apps/img/sort-asc.png" onclick="moveRow(\'up\',\'pLoops\',\'r`c\')" /><img src="../../apps/img/sort-dsc.png" onclick="moveRow(\'down\',\'pLoops\',\'r`c\')" /><img src="../../apps/img/del.png" onclick="deleteRow(\'tLor`c1\')" /></td></tr>';

//Column Function arrays
var pUsersA, pBaseA, pLayerA, pWFSA, pOTableA, pLoopsA, pOptionA, pLookupA, pStatusA, pExclusionA, pDiscolA, pFExclusionA, pPredefA, pStyleA;
		
/*This function checks for a logged in user*/
function checkFrame() {
	var finduser, stopuser, icontent, icontentChk;
	document.getElementById('header').innerHTML = "<span style='font-weight: bold;'></span><span style='font-size: small;color: #000000;position:absolute;right:0px;'>Logged in as: "+usertext+" <input type='button' value='Logout' onclick='logItOut()' /></span><br />";
}

/*Setup function creates the configuration form and customises if this is an existing map*/
var tmpURL;
var locStr = window.location.href.replace("https://geo.reading-travelinfo.co.uk/","");
locStr = locStr.replace("https://64.5.1.218/","");
locStr = locStr.replace(/\//g,"\\");
locStr = locStr.replace("admin.html","");
var eC, popi, tmpS, fieldL, element, arrayN, userArray;
function pageSetup(){
	//Authenticate the user here
	
	//Load the permitted users here
	var loginDetails;
	tmpURL = "../../apps/admin_functions/users.php";
	var userArray2 = $.ajax({
		type: 'POST',
		url: tmpURL,
		data: {loc: locStr},
		async:false
	}).responseText;
	userArray2 = $.parseJSON(userArray2);
	userArray = [];
	var key;
	for (key in userArray2) {
		userArray.push(userArray2[key]);
	}
	
	//Now we call the authentication script
	loginScript(2);
}

function pageSetup2(){
	//Variable definitions
	var fH, fF, blankA, blankA2, e, textStr;
	
	//If we still don't have a username then there is a problem - don't load the map!
	var usertext = document.getElementById('username').value;
	if (usertext==="") {
		textStr = "<h3 align='center'>Log on Error</h3><p align='center'>If you believe this username should have access to this content please contact the GIS server management team.</p>";
		document.getElementById("configForm").innerHTML = textStr;
	} else {
		//Check if the user is permitted to use this page
		var okint = 0;
		for (i=0;i<userArray.length;i++){
			if (userArray[i]==usertext) {
				okint = 1;
			} else if (userArray[i]=='RBC'){
				okint = 1; //RBC maps are available to all users
			}
		}
		if (okint == 0) {
			textStr = "<h3 align=\"center\">Log on Error</h3><p align=\"center\">User ";
			textStr += usertext;
			textStr += " is not authorised to view this content. <br /> If you have logged in as the wrong user you may log out using the button below and refresh the page to try again.</p><br /> <p align=\"center\"><input type='button' value='Logout' onclick='logItOut()' /></p><br /><p align=\"center\">If you believe this username should have access to this content please contact the GIS server management team.</p>";
			document.getElementById("configForm").innerHTML = textStr;
		} else {
			tmpURL = "../../apps/admin_functions/existinggrab.php";
			eC = $.ajax({
				type: 'POST',
				url: tmpURL,
				data: {loc: locStr},
				async:false
			}).responseText;
			eC = $.parseJSON(eC);
			//alert(eC.toSource());
			//First we must find out if this is an already configured map
			if (eC.configuredMap===''){
				//This is a new form
				
				//Update the header section
				ft = "Map Configuration Form - Create a New Map <span class='saveB'><input type='button' onclick='saveConfig()' value='Save Configuration' /></span>";
				$('#pageHeader').html(ft);
				
			} else {
				//This is a configured map
				
				//Update the header section
				ft = "Map Configuration Form for " + eC.configuredMap + " <span class='saveB'><input type='button' onclick='saveConfig()' value='Save Configuration' /></span>";
				$('#pageHeader').html(ft);
				
				//Setup the column array references
				pUsersA = [
					cols = [
						"c1"
					],
					vals = [],
					ref = "pU"
				];
				fieldL = [
					"option"
				];
				element = 'userArray';
				arrayN = 'pUsersA';
				blankA = 'option'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pBaseA = [
					cols = [
						"c1",
						"c2"
					],
					vals = [],
					ref = "bM"
				];
				fieldL = [
					"mapURL",
					"mapTitle"
				];
				element = 'basemaps';
				var element2 = 'map'; //Extra element for this one
				arrayN = 'pBaseA';
				blankA = 'mapURL'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][element2][tmpS] === 'object'){
							for (var key in eC["0"][element][element2][tmpS]) {
								if(typeof eC["0"][element][element2][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][element2][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][element2][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][element2][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pLayerA = [
					cols = [
						"c1",
						"c2",
						"c3",
						"c4",
						"c5",
						"c6",
						"c7",
						"c8",
						"c9",
						"c10",
						"c11",
						"c12"
					],
					vals = [],
					ref = "pL"
				];
				fieldL = [
					"overlayAddress", 
					"overlayPath", 
					"overlayTitle", 
					"overlayDILS", 
					"onasdefault", 
					"overlaySRS", 
					"overlayDOME", 
					"overlayDDtitle", 
					"overlaySTYLES", 
					"overlayCache", 
					"overlayTRAN", 
					"overlayENV"
				];
				element = 'wms';
				element2 = 'overlay'; //Extra element for this one
				arrayN = 'pLayerA';
				blankA = 'overlayAddress'; //This field defines whether this is a valid record or not
				//This definition is a bit odd with duplicate keys, we need to rearrange the object here
				var oObj1 = {
					"overlayAddress": [], 
					"overlayPath": [], 
					"overlayTitle": [], 
					"overlayDILS": [], 
					"onasdefault": [], 
					"overlaySRS": [], 
					"overlayDOME": [], 
					"overlayBuffer": [],
					"overlayDDtitle": [], 
					"overlaySTYLES": [], 
					"overlayCache": [], 
					"overlayTRAN": [], 
					"overlayENV": []
				};
				var tmp1 = eC["0"][element][element2];
				for (var key in tmp1){
					if(key!=='remove'){
						for (var key2 in tmp1[key]){
							if(key2!=='remove'){
								oObj1[key2].push(tmp1[key][key2]);
							}
						}
					}
				}
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					//for each column
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						//We use a try as sometimes the element is not present if not defined and this would cause an error (which we will ignore)
						if(typeof oObj1[tmpS] === 'object'){
							for (var key in oObj1[tmpS]) {
								if(typeof oObj1[blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(oObj1[tmpS][key]); 
									}
								}
							}
						} else {
							//There is only one value but is it blank (indicating that we should ignore this value)
							if(typeof oObj1[blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(oObj1[tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pPopHovA = [
					cols = [
						"c1",
						"c2",
						"c3",
						"c4",
						"c5",
						"c6",
						"c7",
						"c8"
					],
					vals = [],
					ref = "pUh"
				];
				fieldL = [
					"*",
					"overlayPopup", 
					"overlayPopupTemp", 
					"overlayPopupWidth", 
					"overlayPopupHeight", 
					"overlayHoverTemp", 
					"overlayHoverWidth", 
					"overlayHoverHeight"
				];
				element = 'wms';
				element2 = 'overlay2'; //Extra element for this one
				arrayN = 'pPopHovA';
				blankA = 'overlayPopupTemp'; //This field defines whether this is a valid record or not
				blankA2 = 'overlayHoverTemp'; //This field defines whether this is a valid record or not
				//This definition is a bit odd with duplicate keys, we need to rearrange the object here
				var oObj = {
					"overlayPopup":[], 
					"overlayPopupTemp":[], 
					"overlayPopupWidth":[], 
					"overlayPopupHeight":[], 
					"overlayHoverTemp":[], 
					"overlayHoverWidth":[], 
					"overlayHoverHeight":[]
				};
				var tmp1 = eC["0"][element][element2];
				for (var key in tmp1){
					if(key!=='remove'){
						for (var key2 in tmp1[key]){
							if(key2!=='remove'){
								oObj[key2].push(tmp1[key][key2]);
							}
						}
					}
				}
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					//Logic to check for single value or array
					for(popi=0;popi<fieldL.length;popi++){
						//for each column
						window[arrayN][1].push([]);
						tmpS = fieldL[popi];
						try {
							if(tmpS==='*'){
								if(typeof oObj1["overlayAddress"] === 'object'){
									for (var key in oObj1["overlayAddress"]) {
										if(key!=='remove'){
											//Ignore last object (remove) as this is a function
											window[arrayN][1][popi].push(oObj1["overlayAddress"][key]);
										}
									}
								} else {
									window[arrayN][1][popi].push(oObj1["overlayAddress"]);
								}
							} else {
								//We use a try as sometimes the element is not present if not defined and this would cause an error (which we will ignore)
								if(typeof oObj[tmpS] === 'object'){
									for (var key in oObj[tmpS]) {
										if(typeof oObj[blankA][key]!=='undefined' && typeof oObj[blankA2][key]!=='undefined'){
											//This if means that if the blankA field is blank the row is ignored
											if(key!=='remove'){
												//Ignore last object (remove) as this is a function
												window[arrayN][1][popi].push(oObj[tmpS][key]); 
											}
										}
									}
								} else {
									//There is only one value but is it blank (indicating that we should ignore this value)
									if(typeof oObj[blankA]!=='undefined' && typeof oObj[blankA2]!=='undefined'){
										//This if means that if the blankA field is blank the row is ignored
										window[arrayN][1][popi].push(oObj[tmpS]);
									}
								}
							}
						} catch(error){
							e=error;
						}
					}
				}
				
				pZoomA = [
					cols = [
						"c1",
						"c2",
						"c3",
						"c4",
						"c5",
						"c6"
					],
					vals = [],
					ref = "pZ"
				];
				fieldL = [
					"*",
					"overlayZoom", 
					"overlayZoomLevel", 
					"overlayZoomSelF", 
					"overlayZoomRepT", 
					"overlayZoomRepF"
				];
				element = 'wms';
				element2 = 'overlay3'; //Extra element for this one
				arrayN = 'pZoomA';
				blankA = 'overlayZoomLevel'; //This field defines whether this is a valid record or not
				blankA2 = 'overlayZoomSelF'; //This field defines whether this is a valid record or not
				//This definition is a bit odd with duplicate keys, we need to rearrange the object here
				var oObj = {
					"overlayZoom":[], 
					"overlayZoomLevel":[], 
					"overlayZoomSelF":[], 
					"overlayZoomRepT":[], 
					"overlayZoomRepF":[]
				};
				var tmp1 = eC["0"][element][element2];
				for (var key in tmp1){
					if(key!=='remove'){
						for (var key2 in tmp1[key]){
							if(key2!=='remove'){
								oObj[key2].push(tmp1[key][key2]);
							}
						}
					}
				}
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					//for each column
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(tmpS==='*'){
							if(typeof oObj1["overlayAddress"] === 'object'){
								for (var key in oObj1["overlayAddress"]) {
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(oObj1["overlayAddress"][key]);
									}
								}
							} else {
								window[arrayN][1][popi].push(oObj1["overlayAddress"]);
							}
						} else {
							//We use a try as sometimes the element is not present if not defined and this would cause an error (which we will ignore)
							if(typeof oObj[tmpS] === 'object'){
								for (var key in oObj[tmpS]) {
									if(typeof oObj[blankA][key]!=='undefined' && typeof oObj[blankA2][key]!=='undefined'){
										//This if means that if the blankA field is blank the row is ignored
										if(key!=='remove'){
											//Ignore last object (remove) as this is a function
											window[arrayN][1][popi].push(oObj[tmpS][key]); 
										}
									}
								}
							} else {
								//There is only one value but is it blank (indicating that we should ignore this value)
								if(typeof oObj[blankA]!=='undefined' && typeof oObj[blankA2]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									window[arrayN][1][popi].push(oObj[tmpS]);
								}
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pWFSA = [
					cols = [
						"c1",
						"c2",
						"c3",
						"c4",
						"c5",
						"c6",
						"c7",
						"c8",
						"c9",
						"c10"
					],
					vals = [],
					ref = "pWFS"
				];
				fieldL = [
					"*",
					"overlayType", 
					"overlayTable", 
					"overlayfeatureType", 
					"overlayPath", 
					"overlayDILS", 
					"overlaySRS", 
					"overlayfeatureNS", 
					"overlaygeometryName", 
					"overlayTitle"
				];
				element = 'wfs';
				element2 = 'overlay'; //Extra element for this one
				arrayN = 'pWFSA';
				blankA = 'overlayTitle'; //This field defines whether this is a valid record or not
				//This definition is a bit odd with duplicate keys, we need to rearrange the object here
				var oObj = {
					"overlayType":[], 
					"overlayTable":[], 
					"overlayfeatureType":[], 
					"overlayPath":[], 
					"overlayDILS":[], 
					"overlaySRS":[], 
					"overlayfeatureNS":[], 
					"overlaygeometryName":[], 
					"overlayTitle":[]
				};
				var tmp = eC["0"][element][element2];
				for (var key in tmp){
					if(key!=='remove'){
						for (var key2 in tmp[key]){
							if(key2!=='remove'){
								oObj[key2].push(tmp[key][key2]);
							}
						}
					}
				}
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					//for each column
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(tmpS==='*'){
							if(typeof oObj1["overlayAddress"] === 'object'){
								for (var key in oObj1["overlayAddress"]) {
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(oObj1["overlayAddress"][key]);
									}
								}
							} else {
								window[arrayN][1][popi].push(oObj1["overlayAddress"]);
							}
						} else {
							//We use a try as sometimes the element is not present if not defined and this would cause an error (which we will ignore)
							if(typeof oObj[tmpS] === 'object'){
								for (var key in oObj[tmpS]) {
									if(typeof oObj[blankA][key]!=='undefined'){
										//This if means that if the blankA field is blank the row is ignored
										if(key!=='remove'){
											//Ignore last object (remove) as this is a function
											window[arrayN][1][popi].push(oObj[tmpS][key]); 
										}
									}
								}
							} else {
								//There is only one value but is it blank (indicating that we should ignore this value)
								if(typeof oObj[blankA]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									window[arrayN][1][popi].push(oObj[tmpS]);
								}
							}
						}
					} catch(error){
						e=error;
					}
				}

				pOTableA = [
					cols = [
						"c1",
						"c2",
						"c3",
						"c4",
						"c5",
						"c6",
						"c7",
						"c8"
					],
					vals = [],
					ref = "oT"
				];
				fieldL = [
					"tableName", 
					"tableGeom", 
					"tableTitle", 
					"selStyle", 
					"recNo", 
					"lower", 
					"order_by", 
					"geom_field"
				];
				element = 'table';
				arrayN = 'pOTableA';
				blankA = 'tableName'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pLoopsA = [
					cols = [
						"c1",
						"c2"
					],
					vals = [],
					ref = "tLo"
				];
				fieldL = [
					"tableName", 
					"tableCondition"
				];
				element = 'tableLoops';
				arrayN = 'pLoopsA';
				blankA = 'tableCondition'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pLookupA = [
					cols = [
						"c1",
						"c2",
						"c3",
						"c4"
					],
					vals = [],
					ref = "tL"
				];
				fieldL = [
					"targetCol", 
					"targetTable",
					"replaceCol",
					"replaceTable"
				];
				element = 'lookups';
				arrayN = 'pLookupA';
				blankA = 'targetCol'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pStatusA = [
					cols = [
						"c1",
						"c2",
						"c3",
						"c4",
						"c5"
					],
					vals = [],
					ref = "tS"
				];
				fieldL = [
					"statusValue", 
					"statusAvail",
					"statusText",
					"statusTable",
					"statusField"
				];
				element = 'status';
				arrayN = 'pStatusA';
				blankA = 'statusValue'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pExclusionA = [
					cols = [
						"c1",
						"c2"
					],
					vals = [],
					ref = "tE"
				];
				fieldL = [
					"exclusion", 
					"exclusionT"
				];
				element = 'exclusions';
				arrayN = 'pExclusionA';
				blankA = 'exclusions'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				pDiscolA = [
					cols = [
						"c1",
						"c2"
					],
					vals = [],
					ref = "dC"
				];
				fieldL = [
					"option", 
					"optionT"
				];
				element = 'disable';
				arrayN = 'pDiscolA';
				blankA = 'disable'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				//Special case as this table is populated by two arrays
				pOptionA = [
					cols = [
						"c1",
						"c2",
						"c3",
						"c4"
					],
					vals = [],
					ref = "tO"
				];
				//Get array 1
				fieldL = [
					"optionsListOp", 
					"optionListNo",
					"optionsListCol", 
					"optionsListColLoop"
				];
				element = 'optionsList';
				element2 = 'oList1'; //Extra element here
				var element3 = 'oList2'; //Extra element here
				arrayN = 'pOptionA';
				blankA = 'optionsListOp'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length-2;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][element2][tmpS] === 'object'){
							for (var key in eC["0"][element][element2][tmpS]) {
								if(typeof eC["0"][element][element2][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][element2][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][element2][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][element2][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				for(popi=1;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][element3][tmpS] === 'object'){
							for (var key in eC["0"][element][element3][tmpS]) {
								if(key!=='remove'){
									//Ignore last object (remove) as this is a function
									window[arrayN][1][popi].push(eC["0"][element][element3][tmpS][key]); 
								}
							}
						} else {
							window[arrayN][1][popi].push(eC["0"][element][element3][tmpS]);
						}
					} catch(error){
						e=error;
					}
				}
				
				pFExclusionA = [
					cols = [
						"c1"
					],
					vals = [],
					ref = "fE"
				];
				fieldL = [
					"functionEx"
				];
				element = 'functions';
				arrayN = 'pFExclusionA';
				blankA = 'functionEx'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				
				//This is a special case as we need to reconstruct the simpler syntax
				pStyleA = [
					cols = [
						"c1",
						"c2",
						"c3"
					],
					vals = [],
					ref = "sC"
				];
				//Get the first value 
				fieldL = [
					"sLayer"
				];
				element = 'styleLayer';
				arrayN = 'pStyleA';
				blankA = 'styleTitles'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(key!=='remove'){
									//Ignore last object (remove) as this is a function
									window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
								}
							}
						} else {
							window[arrayN][1][popi].push(eC["0"][element][tmpS]);
						}
					} catch(error){
						e=error;
					}
				}
				//Get the second value
				fieldL = [
					"style"
				];
				element = 'styles';
				arrayN = 'pStyleA';
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(key!=='remove'){
									//Ignore last object (remove) as this is a function
									window[arrayN][1][popi+1].push(eC["0"][element][tmpS][key]); 
								}
							}
						} else {
							window[arrayN][1][popi+1].push(eC["0"][element][tmpS]);
						}
					} catch(error){
						window[arrayN][1][popi+1].push('');
					}
				}
				//Get the third value
				fieldL = [
					"sTitle"
				];
				element = 'styleTitles';
				arrayN = 'pStyleA';
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi+2].push(eC["0"][element][tmpS][key]); 
									}
								} else {
									//This is an odd case where we need to null the other values which may already exist
									window[arrayN][1][popi].splice(window[arrayN][1][popi].length-1,1);
									window[arrayN][1][popi+1].splice(window[arrayN][1][popi].length-1,1);
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi+2].push(eC["0"][element][tmpS]);
							} else {
								//This is an odd case where we need to null the other values which may already exist
								window[arrayN][1][popi].splice(window[arrayN][1][popi].length-1,1);
								window[arrayN][1][popi+1].splice(window[arrayN][1][popi].length-1,1);
							}
						}
					} catch(error){
						window[arrayN][1][popi+2].push('');
					}
				}
				
				//This is a special case as we need to reconstruct the simpler syntax
				pPredefA = [
					cols = [
						"c1",
						"c2"
					],
					vals = [],
					ref = "pDm"
				];
				//Get the first value (this will be the predefined map title
				fieldL = [
					"option"
				];
				element = 'pdmArr';
				arrayN = 'pPredefA';
				blankA = 'option'; //This field defines whether this is a valid record or not
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(typeof eC["0"][element][blankA][key]!=='undefined'){
									//This if means that if the blankA field is blank the row is ignored
									if(key!=='remove'){
										//Ignore last object (remove) as this is a function
										window[arrayN][1][popi].push(eC["0"][element][tmpS][key]); 
									}
								}
							}
						} else {
							if(typeof eC["0"][element][blankA]!=='undefined'){
								//This if means that if the blankA field is blank the row is ignored
								window[arrayN][1][popi].push(eC["0"][element][tmpS]);
							}
						}
					} catch(error){
						e=error;
					}
				}
				//Get and manipulate the second value
				fieldL = [
					"option"
				];
				element = 'pdmFilter';
				arrayN = 'pPredefA';
				var filterFix;
				//Logic to check for single value or array
				for(popi=0;popi<fieldL.length;popi++){
					window[arrayN][1].push([]);
					tmpS = fieldL[popi];
					try {
						if(typeof eC["0"][element][tmpS] === 'object'){
							for (var key in eC["0"][element][tmpS]) {
								if(key!=='remove'){
									if(typeof eC["0"][element][tmpS][key] === 'object'){
										//This will be a blank
										window[arrayN][1][1].push('');
									} else {
										//Ignore last object (remove) as this is a function
										filterFix = eC["0"][element][tmpS][key].replace(/&lt;/g, "<").replace(/&gt;/g, ">");
										window[arrayN][1][1].push(filterFix); 
									}
								}
							}
						} else {
							filterFix = eC["0"][element][tmpS].replace(/&lt;/g, "<").replace(/&gt;/g, ">");
							window[arrayN][1][1].push(filterFix);
						}
					} catch(error){
						window[arrayN][1][1].push('');
					}
				}
			}
			
			/*In both situations we will set up the form as blank before filling it in with existing options*/
			//Set up the form here
			fH = "<form id='setupForm'>";
			//General map options
			fH += "<div class='Fgeneral'><h4>General Map Options</h4>";
			fH += "<span class='optH'>Map title:</span><span class='opt'><input type='text' id='mT' /></span><br />";
			fH += "<span class='optH'>Relative URL to the map:</span><span class='opt'><input type='text' id='rURL' /></span><br />";
			fH += "<span class='optH'>Map projection:</span><span class='opt'><select id='mP'><option value='27700' checked='checked'>27700 (OS National Grid)</option><option value='4326'>4326 (WGS 84 - Lat/Long)</option></select></span><br />";
			fH += "<span class='optH'>Reproject from:</span><span class='opt'><input type='text' id='rF' /></span><br />";
			fH += "<span class='optH'>Pan map on popup:</span><span class='opt'><select id='pMoP'><option value='True' checked='checked'>True</option><option value='False'>False</option></select></span><br />";
			fH += "<span class='optH'>Popup as default:</span><span class='opt'><select id='pD'><option value='True' checked='checked'>True</option><option value='False'>False</option></select></span><br />";
			fH += "<span class='optH'>What type of legend do you require:</span><span class='opt'><select id='legendT'><option value='standard' checked='checked'>Standard Legend</option><option value='selectL'>Selectable Layers</option><option value='selectS'>Selectable Styles</option></select></span><br />";
			fH += "<span class='optH'>Full data downloads:</span><span class='opt'><select id='fDd'><option value='True' checked='checked'>True</option><option value='False'>False</option></select></span><br />";
			fH += "<span class='optH'>Licence Statement:</span><span class='opt'><input type='text' size='100' id='lS' value='&#169; Crown Copyright 100019672 {Year} | &#169; Reading Borough Council {Year}'/></span><br />";
			fH += "<span class='optH'>Relative URL to the WFS editable layers:</span><span class='opt'><input type='text' id='rURLwfs' /></span><br />";
			fH += "<span class='optH'>Relative URL to the WMS base:</span><span class='opt'><input type='text' id='rURLwms' /></span><br />";
			fH += "<span class='optH'>Include a photo carousel:</span><span class='opt'><select id='pC'><option value='True'>True</option><option value='False' checked='checked'>False</option></select></span><br />";
			fH += "<span class='optH'>Carousel fieldname:</span><span class='opt'><input type='text' id='pCf' /></span><br />";
			fH += "</div>";
			//Toolbar options
			fH += "<div class='Ftoolbar'><h4>Toolbar Options</h4>";
			fH += "<span class='optH'>Include attributes table:</span><span class='opt'><select id='iAt'><option value='True'>True</option><option value='False' checked='checked'>False</option></select></span><br />";
			fH += "<span class='optH'>Include popup bubble switch:</span><span class='opt'><select id='iPbS'><option value='True'>True</option><option value='False' checked='checked'>False</option></select></span><br />";
			fH += "<span class='optH'>Include selection tool:</span><span class='opt'><select id='iSt'><option value='True'>True</option><option value='False' checked='checked'>False</option></select></span><br />";
			fH += "<span class='optH'>Include measurement tool:</span><span class='opt'><select id='iMt'><option value='True'>True</option><option value='False' checked='checked'>False</option></select></span><br />";
			fH += "<span class='optH'>Include editing tools:</span><span class='opt'><select id='iEt'><option value='True'>True</option><option value='False' checked='checked'>False</option></select></span><br />";
			fH += "<span class='optH'>Active Table (for Editing):</span><span class='opt'><input type='text' id='aT' /></span><br />";
			fH += "<span class='optH'>Active tool:</span><span class='opt'><input type='text' id='aTo' value='3' /></span><br />";
			fH += "</div>";
			//Start of Multiple Option Area
			//Overlays
			fH += "<div class='Foverlay'><h4>Layers</h4>";
			fH += "<table id='pLayer'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><tr><th><a onclick='addRow(\"pLayer\",\"pLr0\")'><span class='add'>+</span></a></th><th id='pLr0c1'>Layer Name</th><th id='pLr0c2'>Relative URL to WMS</th><th id='pLr0c3'>User Friendly Title</th><th id='pLr0c4'>Display in Layer Switcher</th><th id='pLr0c5'>Visible When Map Loads</th><th id='pLr0c6'>Projection</th><th id='pLr0c7'>Display Outside Maximum Extent</th><th id='pLr0c8'>User Friendly Title for Downloads</th><th id='pLr0c9'>Style Definition</th><th id='pLr0c10'>Cache Layer</th><th id='pLr0c11'>Transparent</th><th id='pLr0c12'>Environment Variable</th></tr></table>";
			fH += "</div>";
			//Popups and Hovers
			fH += "<div class='Fpophov'><h4>Popups and Hover</h4>";
			fH += "<table id='pPopHov'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><tr><th id='pUhr0c1'>Layer</th><th id='pUhr0c2'>Enable Popups</th><th id='pUhr0c3'>Relative URL to Popup Template</th><th id='pUhr0c4'>Popup Width</th><th id='pUhr0c5'>Popup Height</th><th id='pUhr0c6'>Relative URL to Hover Template</th><th id='pUhr0c7'>Hover Width</th><th id='pUhr0c8'>Hover Height</th></tr></table>";
			fH += "</div>";
			//Zoom on Click
			fH += "<div class='Fzoom'><h4>Zoom on Click Settings</h4>";
			fH += "<table id='pZoom'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><tr><th id='pZr0c1'>Layer</th><th id='pZr0c2'>Zoom on Click</th><th id='pZr0c3'>Zoom to Fixed Level</th><th id='pZr0c4'>Zoom to Selection Based On Field</th><th id='pZr0c5'>Table Containing Field</th><th id='pZr0c6'>Field Name</th></tr></table>";
			fH += "</div>";
			//WFS Settings
			fH += "<div class='Fwfs'><h4>WFS Settings</h4>";
			fH += "<table id='pWFS'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><tr><th id='pWFSr0c1'>Layer</th><th id='pWFSr0c2'>Layer Type</th><th id='pWFSr0c3'>Associated Database Table</th><th id='pWFSr0c4'>Associated WFS Layer Name</th><th id='pWFSr0c5'>Relative URL to WFS</th><th id='pWFSr0c6'>Display WFS in Layer Switcher</th><th id='pWFSr0c7'>Projection</th><th id='pWFSr0c8'>WFS Namespace</th><th id='pWFSr0c9'>Geometry Fieldname</th></tr></table>";
			fH += "</div>";
			//Table Options
			fH += "<div class='Ftable'><h4>Table Options</h4>";
			fH += "<table id='pOTable'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><tr><th><a onclick='addRow(\"pOTable\",\"oTr0\")'><span class='add'>+</span></a></th><th id='oTr0c1'>Table Name</th><th id='oTr0c2'>Is there a Geometry Field?</th><th id='oTr0c3'>User Friendly Name</th><th id='oTr0c4'>Selection Style</th><th id='oTr0c5'>Columns to Display</th><th id='oTr0c6'>Start at Row</th><th id='oTr0c7'>Order by Field</th><th id='oTr0c8'>Geometry Field</th></tr></table>";
			fH += "</div>";
			//Permitted Users
			fH += "<div class='Fusers'><h4>Permitted Users</h4>";
			fH += "<table id='pUsers'><col class='col1' /><col class='col2' /><tr><th id='pUr0c1'>Username</th><th><a onclick='addRow(\"pUsers\",\"pUr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Base Maps
			fH += "<div class='Fbase'><h4>Base Maps</h4>";
			fH += "<table id='pBase'><col class='col1' /><col class='col2' /><col class='col1' /><tr><th id='bMr0c1'>Layer</th><th id='bMr0c2'>User Friendly Name</th><th><a onclick='addRow(\"pBase\",\"bMr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Function Exclusion
			fH += "<div class='Ffexclusion'><h4>Function Exclusions</h4>";
			fH += "<table id='pFExclusion'><col class='col1' /><col class='col2' /><tr><th id='fEr0c1'>Function Name</th><th><a onclick='addRow(\"pFExclusion\",\"fEr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Predefined Maps
			fH += "<div class='Fpredef'><h4>Predefined Maps</h4>";
			fH += "<table id='pPredef'><col class='col1' /><col class='col2' /><col class='col1' /><tr><th id='pDmr0c1'>Option Title</th><th id='pDmr0c2'>Criteria String</th><th><a onclick='addRow(\"pPredef\",\"pDmr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Style Choices
			fH += "<div class='Fstyle'><h4>Style Choices</h4>";
			fH += "<table id='pStyle'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><tr><th id='sCr0c1'>Layer</th><th id='sCr0c2'>SLD Name</th><th id='sCr0c3'>User Friendly Name</th><th><a onclick='addRow(\"pStyle\",\"sCr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Lookup (from another table)
			fH += "<div class='Flookup'><h4>Lookups (from another table)</h4>";
			fH += "<table id='pLookup'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><tr><th id='tLr0c1'>Column to Replace</th><th id='tLr0c2'>From Table</th><th id='tLr0c3'>Replace with Column</th><th id='tLr0c4'>From Table</th><th><a onclick='addRow(\"pLookup\",\"tLr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Option Lists
			fH += "<div class='Foption'><h4>Option Lists</h4>";
			fH += "<table id='pOption'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><tr><th id='tOr0c1'>Options</th><th id='tOr0c2'>List Number</th><th id='tOr0c3'>Column Name</th><th id='tOr0c4'>List Number</th><th><a onclick='addRow(\"pOption\",\"tOr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Status Options
			fH += "<div class='Fstatus'><h4>Status Options</h4>";
			fH += "<table id='pStatus'><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><col class='col1' /><col class='col2' /><tr><th id='tSr0c1'>Status Value</th><th id='tSr0c2'>Available?</th><th id='tSr0c3'>User Friendly Text</th><th id='tSr0c4'>Table to which this applies</th><th id='tSr0c5'>Status Field Name</th><th><a onclick='addRow(\"pStatus\",\"tSr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Table Exclusions
			fH += "<div class='Ftexclusion'><h4>Table Exclusions</h4>";
			fH += "<table id='pExclusion'><col class='col1' /><col class='col2' /><col class='col1' /><tr><th id='tEr0c1'>Field Name</th><th id='tEr0c2'>Table Name</th><th><a onclick='addRow(\"pExclusion\",\"tEr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Table Disabled Columns
			fH += "<div class='Fdiscol'><h4>Table Disabled Columns</h4>";
			fH += "<table id='pDiscol'><col class='col1' /><col class='col2' /><col class='col1' /><tr><th id='dCr0c1'>Field Name</th><th id='dCr0c2'>Table Name</th><th><a onclick='addRow(\"pDiscol\",\"dCr0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			//Table Loops
			fH += "<div class='Floops'><h4>Table Loops</h4>";
			fH += "<table id='pLoops'><col class='col1' /><col class='col2' /><col class='col1' /><tr><th id='tLor0c1'>Table Name</th><th id='tLor0c2'>Condition</th><th><a onclick='addRow(\"pLoops\",\"tLor0\")'><span class='add'>+</span></a></th></tr></table>";
			fH += "</div>";
			fH += "</form>";
			$('#configForm').html(fH);
			
			//Setup the form footer
			fF = "Mapping tools designed by PBA LLP on Behalf of RBC <span class='saveB'><input type='button' onclick='saveConfig()' value='Save Configuration' /></span>";
			$('#pageFooter').html(fF);
			
			//OK, if this is an already configured map we need to load the options
			if (eC.configuredMap!==''){
				//This is a configured map
				
				//OK we need to sort out a lookup array to let us parse the config object into the corresponding html elements on the form as these are 
				//automatically generated id references based on the table in question.
				oR = {"R" : [
					//The R (Reference) section provides the key for each value
					eC["0"].other.appTitle, 
					eC["0"].other.projectPath, 
					eC["0"].other.proj, 
					eC["0"].other.projMap, 
					eC["0"].other.reproject, 
					eC["0"].other.projMap2, 
					eC["0"].other.wfsedits, 
					eC["0"].other.wmsbase, 
					eC["0"].other.popupPan, 
					eC["0"].other.popupDefault, 
					eC["0"].other.attribute, 
					eC["0"].other.edits, 
					eC["0"].other.active_table, 
					eC["0"].other.ddFull, 
					eC["0"].other.photoscroll, 
					eC["0"].other.photoscrollpath, 
					eC["0"].other.licence, 
					eC["0"].other.Gog, 
					eC["0"].other.legendtree, 
					eC["0"].other.selectlegendtree,
					"ec.mD.users[*1*]",
					"eC.tB.actionType[1]", 
					"eC.tB.actionTitle[1]", 
					"eC.tB.actionArr:[1]", 
					"eC.tB.actionCls[1]", 
					"eC.tB.actionGroup[1]", 
					"eC.tB.actionText[1]", 
					"eC.tB.actionHandler[1]", 
					"eC.tB.toolIn[1]",
					"eC.mL.basemaps[*2*]",
					"eC.mL.overlay[*12*]",
					"eC.mL.overlay2[*8*]",
					"eC.mL.overlay3[*5*]",
					"eC.mL.wfs[*9*]",
					"eC.tD.table[*8*]",
					"eC.tD.tableLoops[*2*]",
					"eC.tD.lookup[*4*]",
					"eC.tD.options.oList", 
					"eC.tD.status[*5*]",
					"eC.tD.exclusions[*2*]",
					"eC.tD.discols[*2*]",
					"eC.oS.styles", 
					"eC.oS.funcEx[*1*]",
					"eC.oS.pdm[*1*]",
				],
				"H" : [
					//The H array provides the documentID in terms of HTML for each R item
					//Where there is no field there will be a '-'
					//In some cases there will be an add line function - Where the number represents the number of columns
					"mT", 
					"rURL", 
					"mP", 
					"-", 
					"-", 
					"rF", 
					"rURLwfs", 
					"rURLwms", 
					"pMoP", 
					"pD", 
					"iAt", 
					"iEt", 
					"aT", 
					"fDd", 
					"pC", 
					"pCf", 
					"lS", 
					"-",
					"tooltypes|legendT|legend1",
					"tooltypes|legendT|legend2",
					"addLine|pUsers|1",
					"-", 
					"tooltypes|eC.tB.actionTitle|type", 
					"-", 
					"-", 
					"-", 
					"-", 
					"-", 
					"tooltypes|eC.tB.toolIn|active",
					"addLine|pBase|2",
					"addLine|pLayer|12",
					"addLine|pPopHov|8",
					"addLine|pZoom|5",
					"addLine|pWFS|9",
					"addLine|pOTable|8",
					"addLine|pLoops|2",
					"addLine|pLookup|4",
					"addLine|pOption|4", 
					"addLine|pStatus|5",
					"addLine|pExclusion|2",
					"addLine|pDiscol|2",
					"addLine|pStyle|3", 
					"addLine|pFExclusion|1",
					"addLine|pPredef|2"
				]};
				
				//Loop through the object and run the required functions
				var callLen = oR.R.length;
				var rA, hA, hO, selOpt, funcRef;
				for(i=0;i<callLen;i++){
					rA = oR.R;
					hA = oR.H;
					if(hA[i].indexOf("|")!==-1){
						//This is a function run
						funcRef = hA[i].split("|");
						if(funcRef[0]==='addLine'){
							//This function call has two inputs
							addLine(funcRef[1],parseInt(funcRef[2]));
						} else if (funcRef[0]==='tooltypes') {
							//This function call has two inputs
							tooltypes(funcRef[1],funcRef[2]);
						}
					} else if (hA[i]!=='-'){
						//This is a regular value update but is it an input or a select?
						hO = document.getElementById(hA[i]);
						if (hO !== null){
							if (hO.type === 'select-one'){
								//This is a select option so we need to work out which value to select
								selOpt = '';
								for(i2=0;i2<hO.options.length;i2++){
									if(hO.options[i2].value === rA[i]){
										selOpt = i2;
									}
								}
								if (selOpt!==''){
									hO.selectedIndex = selOpt;
								} //If we don't have a number by now then we failed to match any option in the select so we will leave it with the default value
							} else if (hO.type === 'text'){
								//This is a standard input text box so we can simply write in the value
								if (typeof rA[i] === 'undefined'){
									hO.value = '';
								} else if (typeof rA[i] === 'object'){
									hO.value = '';
								} else {
									hO.value = rA[i];
								}
							}
						}
					} //If it is a '-' then we ignore it
				}
			}
		}
	}
}

/*This function allows the user to move table rows up and down*/
function moveRow(dir, tdID, rowID){
	//Prepare the rowID
	rowID = rowID.replace("r","").replace("c","");
	rowID = parseInt(rowID);
	var jrefID = rowID + 1; //Because the nth child starts with a 1 base instead of zero 
	
	//We need to get the row in question
	var tr, moveID, tmpID, tmpID2, tmpTR, tmpI, tmpI2, tmpHTML;
	var tab = $('table#'+tdID +' tbody');
	var tabLen = tab.find('tr').length -1; //Removing a row from the length to account for the header line
	
	//Pickup the row we are moving
	tr = tab.find('tr:nth-child('+jrefID+')');
			
	//We need to adjust the id values for this to work
	moveID = new RegExp('r' + rowID + 'c','g');
	if(rowID===1){
		if(dir==='down'){
			//First we will temporarily break the refencing system in the row we are moving
			tmpHTML = tr.html();
			tmpHTML = tmpHTML.replace(moveID,"rTMPc");
			tr.html(tmpHTML);
			//Replace the ID's of the row above to be the original moving rows ID
			tmpI2 = rowID + 1;
			tmpID = new RegExp('r' + tmpI2 + 'c','g');
			tmpID2 = 'r' + rowID + 'c';
			tmpTR = tab.find('tr:nth-child('+(jrefID+1)+')'); //Pickup the row to modify
			tmpHTML = tmpTR.html();
			tmpHTML = tmpHTML.replace(tmpID,tmpID2);
			tmpTR.html(tmpHTML);
			//Finally we restore the moving row ID's but to the new ID number (which is now available)
			moveID = new RegExp('rTMPc','g');
			tmpHTML = tr.html();
			tmpHTML = tmpHTML.replace(moveID,"r" + tmpI2 + "c");
			tr.html(tmpHTML);
		} //Otherwise do nothing as this function will not fire
	} else if (rowID>1 && rowID<tabLen){
		//First we will temporarily break the refencing system in the row we are moving
		tmpHTML = tr.html();
		tmpHTML = tmpHTML.replace(moveID,"rTMPc");
		tr.html(tmpHTML);
		//Next we sort out all the other values we must fix in the table in order (depending on direction)
		if(dir==='up'){
			//Replace the ID's of the row above to be the original moving rows ID
			tmpI2 = rowID - 1;
			tmpID = new RegExp('r' + tmpI2 + 'c','g');
			tmpID2 = 'r' + rowID + 'c';
			tmpTR = tab.find('tr:nth-child('+(jrefID-1)+')'); //Pickup the row to modify
			tmpHTML = tmpTR.html();
			tmpHTML = tmpHTML.replace(tmpID,tmpID2);
			tmpTR.html(tmpHTML);
			//Finally we restore the moving row ID's but to the new ID number (which is now available)
			moveID = new RegExp('rTMPc','g');
			tmpHTML = tr.html();
			tmpHTML = tmpHTML.replace(moveID,"r" + tmpI2 + "c");
			tr.html(tmpHTML);
		} else {
			//Replace the ID's of the row above to be the original moving rows ID
			tmpI2 = rowID + 1;
			tmpID = new RegExp('r' + tmpI2 + 'c','g');
			tmpID2 = 'r' + rowID + 'c';
			tmpTR = tab.find('tr:nth-child('+(jrefID+1)+')'); //Pickup the row to modify
			tmpHTML = tmpTR.html();
			tmpHTML = tmpHTML.replace(tmpID,tmpID2);
			tmpTR.html(tmpHTML);
			//Finally we restore the moving row ID's but to the new ID number (which is now available)
			moveID = new RegExp('rTMPc','g');
			tmpHTML = tr.html();
			tmpHTML = tmpHTML.replace(moveID,"r" + tmpI2 + "c");
			tr.html(tmpHTML);
		}
	} else {
		if(dir==='up'){
			//First we will temporarily break the refencing system in the row we are moving
			tmpHTML = tr.html();
			tmpHTML = tmpHTML.replace(moveID,"rTMPc");
			tr.html(tmpHTML);
			//Replace the ID's of the row above to be the original moving rows ID
			tmpI2 = rowID - 1;
			tmpID = new RegExp('r' + tmpI2 + 'c','g');
			tmpID2 = 'r' + rowID + 'c';
			tmpTR = tab.find('tr:nth-child('+(jrefID-1)+')'); //Pickup the row to modify
			tmpHTML = tmpTR.html();
			tmpHTML = tmpHTML.replace(tmpID,tmpID2);
			tmpTR.html(tmpHTML);
			//Finally we restore the moving row ID's but to the new ID number (which is now available)
			moveID = new RegExp('rTMPc','g');
			tmpHTML = tr.html();
			tmpHTML = tmpHTML.replace(moveID,"r" + tmpI2 + "c");
			tr.html(tmpHTML);
		} //Otherwise do nothing as this function will not fire
	}
	
	//This section moves the physical row up and down
	if (dir==="up"){
		if (tr.prevAll().length > 1) {
			tr.insertBefore(tr.prev());
		}
	} else if (dir==='down') {
		if(tr.length > 0) {
			tr.insertAfter(tr.next());
		}
	}
}

/*This function allows us to remove a row from a table*/
function deleteRow(tdID){
	tdID = '#' + tdID;
	var tr = $(tdID).closest('tr');
	tr.fadeOut(400, function(){
		tr.remove();
	});
}

/*This function deals with values which require a line adding to a table first*/
var ai2, ai3, ai4;
function addLine(tabRef,colNo){
	//alert(tabRef);
	var runArray = window[tabRef + "A"];
	var colList = runArray[0];
	var objValA = runArray[1];
	var prefix = runArray[2];
	var tmpR, tmpI, tmpJQ, tmpJQo;
	if(colList.length>=1){
		for(ai2=0;ai2<objValA[0].length;ai2++){
			//Add a row
			tmpR = '#' + tabRef + ' tr';
			tmpI = $(tmpR).length;
			tmpR = prefix + 'r'+ tmpI;
			addRow(tabRef,tmpR);
			//Insert the column values
			for(ai3=0;ai3<colNo;ai3++){
				tmpI = ai2 + 1;
				tmpR = prefix + 'r' + tmpI + colList[ai3]
				hO = document.getElementById(tmpR);
				if (hO !== null){
					if (hO.innerHTML.indexOf('select') !== -1){
						//We need to identify the select id
						tmpR = '#' + tmpR + ' select';
						tmpJQ = $(tmpR);
						tmpJQo = tmpJQ.children();
						//This is a select option so we need to work out which value to select
						selOpt = '';
						ai4=0;
						//We loop through using JQuery syntax as this was our way of finding the select element (without knowing the id of the select itself)
						tmpJQo.each(function() {
							if(this.value===objValA[ai3][ai2]){
								selOpt = ai4;
							}
							ai4 = ai4 + 1;
						});
						if (selOpt!==''){
							tmpJQ.prop('selectedIndex', selOpt);
						} //If we don't have a number by now then we failed to match any option in the select so we will leave it with the default value
					} else if (hO.innerHTML === ''){
						//This is a standard table cell so we can simply write in the value
						if (typeof objValA[ai3][ai2] === 'undefined'){
							hO.innerHTML = '';
						} else if (typeof objValA[ai3][ai2] === 'object'){
							hO.innerHTML = '';
						} else {
							hO.innerHTML = objValA[ai3][ai2];
						}
					}
				}
				//Did we add a table?
				if(tabRef==='pOTable' &&  colList[ai3]==='c1'){
					//We just added a table so we need to run the table handler
					conTablesT.push(objValA[ai3][ai2]);
					conTables.push('overlay' + conTablesT.length-1);
					tableHandler(objValA[ai3][ai2], prefix + 'r' + tmpI + colList[ai3]);
				} else if (tabRef==='pLayer' &&  colList[ai3]==='c1') {
					//If we add a layer we need to add the layer to the selection options
					conLayersT.push(objValA[ai3][ai2]);
					conLayers.push('overlay' + conTablesT.length-1);
					layerHandle(objValA[ai3][ai2], prefix + 'r' + tmpI + colList[ai3]);
				}
			}
		}
		//If tabRef = pLayer; we just added a layer we should add the other rows but because the values are in the config file we don't need to, they will be added anyway
	}
}

/*This function determines form values which are based on an aggregation of XML fields*/
var legend1, legend2;
function tooltypes(objRef,rType){
	var hO, hOlen;
	if(rType==='legend1'){
		//This simply sets the legend1 value
		legend1 = eC["0"].other.legendtree;
	} else if (rType==='legend2') {
		//This sets the second legend variable and then runs the logic
		legend2 = eC["0"].other.selectlegendtree;
		//Run the logic
		hO = document.getElementById(objRef);
		if (legend1==='False'&&legend2==='True'){
			//Selectable Styles
			//This is a select option so we need to work out which value to select
			selOpt = '';
			for(i2=0;i2<hO.options.length;i2++){
				if(hO.options[i2].value === 'selectS'){
					selOpt = i2;
				}
			}
			if (selOpt!==''){
				hO.selectedIndex = selOpt;
			} //If we don't have a number by now then we failed to match any option in the select so we will leave it with the default value
		} else if (legend1==='True'&&legend2==='False') {
			//Selectable Layers
			//This is a select option so we need to work out which value to select
			selOpt = '';
			for(i2=0;i2<hO.options.length;i2++){
				if(hO.options[i2].value === 'selectL'){
					selOpt = i2;
				}
			}
			if (selOpt!==''){
				hO.selectedIndex = selOpt;
			} //If we don't have a number by now then we failed to match any option in the select so we will leave it with the default value
		} else {
			//Standard Legend
			//This is a select option so we need to work out which value to select
			selOpt = '';
			for(i2=0;i2<hO.options.length;i2++){
				if(hO.options[i2].value === 'standard'){
					selOpt = i2;
				}
			}
			if (selOpt!==''){
				hO.selectedIndex = selOpt;
			} //If we don't have a number by now then we failed to match any option in the select so we will leave it with the default value
		}
	} else if (rType==='type') {
		//We want to determine a number of True/False options using the toolbar array eC.tB.actionTitle
		//We have hardcoded the relevant references to we don't really use the inputs at this point
		hO = eC["0"].toolbar.actionTitle.option;
		hOlen = hO.length;
		//Loop through the array
		var attr = 0; 
		var pop = 0; 
		var sel = 0; 
		var meas = 0; 
		var edit = 0;
		for(i2=0;i2<hOlen;i2++){
			if(hO[i2]==='Table'){
				attr = 1;
			} else if(hO[i2]==='Info'){
				pop = 1;
			} else if(hO[i2]==='Select'){
				sel = 1;
			} else if(hO[i2]==='Measure'){
				meas = 1;
			} else if(hO[i2]==='Edit'){
				edit = 1;
			}
		}
		//Set the attributes table bool
		if(attr===0){
			//False
			document.getElementById('iAt').selectedIndex = 1;
		} else {
			//True
			document.getElementById('iAt').selectedIndex = 0;
		}
		//Set the popup bool
		if (pop===0) {
			//False
			document.getElementById('iPbS').selectedIndex = 1;
		} else {
			//True
			document.getElementById('iPbS').selectedIndex = 0;
		}
		//Set the selection bool
		if (sel===0) {
			//False
			document.getElementById('iSt').selectedIndex = 1;
		} else {
			//True
			document.getElementById('iSt').selectedIndex = 0;
		}
		//Set the measurement bool
		if (meas===0) {
			//False
			document.getElementById('iMt').selectedIndex = 1;
		} else {
			//True
			document.getElementById('iMt').selectedIndex = 0;
		}
		//Set the edit bool
		if (edit===0) {
			//False
			document.getElementById('iEt').selectedIndex = 1;
		} else {
			//True
			document.getElementById('iEt').selectedIndex = 0;
		}
	} else if (rType==='active') {
		//We loop through the tools array to find the number of the active tool
		hO = eC["0"].toolbar.toolIn.option;
		hOlen = hO.length;
		var actT = 0;
		var actD = 0;
		for(i2=0;i2<hOlen;i2++){
			if(hO[i2].indexOf("-1")===-1&&actD==0){
				if(hO[i2]!=='3-0'){
					//It is not a spacer so we add a tool to the counter variable
					actT = actT + 1;
				}
			} else if (hO[i2].indexOf("-1")!==-1&&actD==0) {
				//This is the active tool
				actD = actT + 1;
			}//This will no longer check; our work here is done
		}
		//Record the active tool number
		document.getElementById('aTo').value = actD;
	}
}

/*This function adds a new row to any table*/
function addRow(table, currRow){
	//First we pickup the specified table
	var updateTab = '#'+ table + ' tr:last';
	var TabNo = '#' + table + ' tr';
	TabNo = $(TabNo).length;
	
	//Is this the pPredef table and if so; is this the first row?
	if(table==='pPredef' && currRow==='pDmr0'){
		if(TabNo===1){
			//We need to add the default case as standard
			$(updateTab).after(window[table].replace(/`/g,TabNo));
			
			//Update the first record
			$('#pDmr1c1').text('Default');
		}
	}
	//Is this the pStyle table and if so; is this the first row?
	if(table==='pStyle' && currRow==='sCr0'){
		if(TabNo===1){
			//We need to add the default case as standard
			$(updateTab).after(window[table].replace(/`/g,TabNo));
			
			//Update the first record
			if($('#pLr1c1').length!==1){
				$('#sCr1c1').html('<select id="sCsel-1"><option value="overlay0" selected="selected">ERROR, Please add a layer first!</option></select>');
			} else {
				$('#sCr1c1').html('<select id="sCsel-1"><option value="overlay0" selected="selected">' + $('#pLr1c1').text() + '</option></select>');
			}
			$('#sCr1c2').text('');
			$('#sCr1c3').text('Default Style');
		}
	}
	//We may have added a row so we need to reset the row numbers here (no change should result in the same values)
	updateTab = '#'+ table + ' tr:last';
	TabNo = '#' + table + ' tr';
	TabNo = $(TabNo).length;
	
	//We then add a new row to the table in form style
	$(updateTab).after(window[table].replace(/`/g,TabNo));
	
	//Set up the layer selects
	layerHandle();
	
	//Set up the table selects
	tableHandler();
	
	//This jQuery allows editing of some table cells (where there is not a select option)
	$( "td.ed" ).hover(function() {
		$(this).editable(function(value, settings) { 
			if ($(this).attr("id").indexOf("pLr")!==-1&&$(this).attr("id").indexOf("c1")!==-1){
				var matched = 0;
				for(i=0;i<conLayers.length;i++){
					if (value===conLayers[i]){
						//We have a match
						matched = 1;
					}
				}
				if (matched!==1){
					//Must be new; add the value
					conLayersT.push(value);
					conLayers.push('overlay' + conLayersT.length-1);
					
					//We have added a layer to the list we need to add some lines automatically
					var layerRows = $('#pLayer tr').length;
					if ($('#pPopHov tr').length<layerRows){
						addRow('pPopHov');
					} 
					if ($('#pZoom tr').length<layerRows){
						addRow('pZoom');
					} 
					if ($('#pWFS tr').length<layerRows){
						addRow('pWFS');
					} 
					
					layerHandle(value, $(this).attr("id"));
				} //No need to do anything if matched
			} else if ($(this).attr("id").indexOf("oTr")!==-1&&$(this).attr("id").indexOf("c1")!==-1){
				var matched = 0;
				for(i=0;i<conTables.length;i++){
					if (value===conTables[i]){
						//We have a match
						matched = 1;
					}
				}
				if (matched!==1){
					//Must be new; add the value
					conTablesT.push(value);
					conTables.push('overlay' + conTablesT.length-1);
					
					tableHandler(value, $(this).attr("id"));
				} //No need to do anything if matched
			}
			//Return the value
			return(value);
		}, { 
			type    : 'textarea',
			submit  : 'Save',
		});
	});
}

var l1, l2, l3, l4, l5;
function layerHandle(val, id){
	var handle = ['pUhsel', 'pZsel', 'pWFSsel', 'sCsel'];
	var handleP1 = ['pUhr', 'pZr', 'pWFSr', 'sCr'];
	if (typeof id!=='undefined'){
		id = id.substring(3);
	}
	var tableHandle = ['#pPopHov tr', '#pZoom tr', '#pWFS tr', '#pStyle tr'];
	var handleType = ['v','v','v','s'];
	var tdHandle, v, t, layerSelHTML, TabNo, id2, selectId, selObj, selVal, tmpVal, selInd;
	for (l1=0;l1<handle.length;l1++){
		TabNo = $(tableHandle[l1]).length;
		id2 = handleP1[l1] + id;
		for (l2=0;l2<TabNo;l2++){
			if(l2!==0){
				if(handleType[l1]==='s'){
					//Loop through rows in Style Choice table
					l5 = 0;
					$('#pStyle tr').each(function() {
						if (l5!==0){
							//Pickup the existing select option and get the selected value
							selectId = handle[l1] + "-" + l5;
							selObj = $('#' + selectId);
							selVal = selObj.text()
							
							//Recreate the select based layers table
							layerSelHTML = '<select id="' + selectId + '">';
							for(l4=0;l4<($('#pLayer tr').length-1);l4++){
								tmpVal = $('#pLr'+(l4+1)+'c1').text();
								layerSelHTML += '<option value="overlay' + l4 + '">' + tmpVal + '</option>';
							}
							layerSelHTML += '</select>';
							tdHandle = handleP1[l1] + l5 + 'c1';
							tdHandle = $('#' + tdHandle);
							tdHandle.html(layerSelHTML);
							
							//Pickup the new select options loop through and reselect as required
							selObj = $('#' + selectId);
							selInd = '';
							l4 = 0;
							selObj.each(function() {
								if(this.text===selVal){
									selInd = l4;
								}
								l4 = l4 + 1;
							});
							if (selInd!==''){
								selObj.prop('selectedIndex', selInd);
							} //If we don't have a number by now then we failed to match any option in the select so we will leave it with the default value
						} //Skip over the header row
						l5 = l5 + 1;
					});
				} else {
					if (typeof val!=='undefined'){
						tdHandle = handleP1[l1] + l2 + 'c1';
						if (tdHandle===id2){
							layerSelHTML = val;
							document.getElementById(tdHandle).innerHTML = layerSelHTML; 
						}
					}
				}
			}//Miss the first row as this is the header row
		}
	}
}

var t1, t2, t3;
function tableHandler(val, id){
	var thandle = ['tSsel', 'tEsel', 'dCsel', 'tLosel'];
	var thandleP1 = ['tSr', 'tEr', 'dCr', 'tLor'];
	var thandleP2 = ['c4','c2','c2','c1'];
	if (typeof id!=='undefined'){
		id = id.substring(3);
	}
	var tableHandle = ['#pStatus tr', '#pExclusion tr', '#pDiscol tr', '#pLoops tr'];
	var thandleType = ['s','s','s','s'];
	var ttdHandle, v, t, tableSelHTML, TabNo, id2;
	for (t1=0;t1<thandle.length;t1++){
		TabNo = $(tableHandle[t1]).length;
		id2 = thandleP1[t1] + id;
		for (t2=0;t2<TabNo;t2++){
			if(t2!==0){
				if(thandleType[t1]==='s'){
					ttdHandle = thandleP1[t1] + t2 + thandleP2[t1];
					tableSelHTML = '<select id="' + thandle[t1] + '">';
					if (conTables.length===0){
						tableSelHTML += '<option value"">Please Add Tables First</option>'; 
					} else {
						selOpt = document.getElementById(thandle[t1]).options.selectedIndex;
						if(selOpt===-1){
							v = "";
							t = "";
						} else {
							sv = document.getElementById(thandle[t1]).options[selOpt].value;
							st = document.getElementById(thandle[t1]).options[selOpt].text;
							if (st==='Please Add Tables First' || st===''){
								v = "";
								t = "";
							} else {
								v = sv;
								t = st;
							}
						}
						for(t3=0;t3<conTables.length;t3++){
							if(conTables[t3]!=='Click to edit' || conTables[t3]!=='Save'){
								//Add this option
								if (conTables[t3]===v){
									tableSelHTML += '<option value"' + v + '" selected="selected">' + t + '</option>';
								} else {
									tableSelHTML += '<option value"' + conTables[t3] + '">' + conTablesT[t3] + '</option>'; 
								}
							}
						}
					}
					tableSelHTML += '</select>';
					document.getElementById(ttdHandle).innerHTML = tableSelHTML; 
				} else {
					if (typeof val!=='undefined'){
						ttdHandle = handleP1[t1] + t2 + 'c1';
						if (ttdHandle===id2){
							tableSelHTML = val;
							document.getElementById(ttdHandle).innerHTML = tableSelHTML; 
						}
					}
				}
			}//Miss the first row as this is the header row
		}
	}
}

function saveConfig(){
	var oXML, tmpNo, tmpArr, tmpVal, tmpID, Gog, hM;
	oXML = '<?xml version="1.0" standalone="yes" ?>\n';	 
	oXML += '<settings>\n';
	oXML += '  <!--  Access to this application is limited to the following users-->\n';  
	oXML += '  <userArray>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pUsers tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				tmpVal = $(this).text();
				oXML += '    <option>' + tmpVal + '</option>\n';
			}
		})
	});
	oXML += '  </userArray>\n';
	oXML += '  <other>\n';
	oXML += '    <!--  Other settings -->\n';
	oXML += '    <appTitle>' + $('#mT').val() + '</appTitle>\n'; 
	oXML += '    <projectPath>' + $('#rURL').val() + '</projectPath>\n';
	if($('#rF').val()!==''){
		oXML += '    <reproject>Yes</reproject>\n'; 
	} else {
		oXML += '    <reproject>No</reproject>\n'; 
	}
	oXML += '    <proj>' + $('#mP').find(":selected").val() + '</proj>\n'; 
	oXML += '    <projMap>EPSG:' + $('#mP').find(":selected").val() + '</projMap>\n'; 
	oXML += '    <projMap2>' + $('#rF').val() + '</projMap2>\n';  
	oXML += '    <popupPan>' + $('#pMoP').find(":selected").val() + '</popupPan>\n'; 
	oXML += '    <ddFull>' + $('#fDd').find(":selected").val() + '</ddFull>\n';
	oXML += '    <popupDefault>' + $('#pD').find(":selected").val() + '</popupDefault>\n';
	if($('#legendT').find(":selected").val()==='standard'){
		oXML += '    <legendtree>False</legendtree>\n'; 
		oXML += '    <selectlegendtree>False</selectlegendtree>\n';
	} else if ($('#legendT').find(":selected").val()==='selectL'){
		oXML += '    <legendtree>True</legendtree>\n'; 
		oXML += '    <selectlegendtree>False</selectlegendtree>\n';
	} else {
		oXML += '    <legendtree>False</legendtree>\n'; 
		oXML += '    <selectlegendtree>True</selectlegendtree>\n';
	}
	oXML += '    <wfsedits>' + $('#rURLwfs').val() + '</wfsedits>\n'; 
	oXML += '    <wmsbase>' + $('#rURLwms').val() + '</wmsbase>\n'; 
	oXML += '    <photoscroll>' + $('#pC').find(":selected").val() + '</photoscroll>\n';
	oXML += '    <photoscrollpath>' + $('#pCf').val() + '</photoscrollpath>\n';
	oXML += '    <active_table>' + $('#aT').val() + '</active_table>\n';
	oXML += '    <attribute>' + $('#iAt').find(":selected").val() + '</attribute>\n';
	oXML += '    <edits>' + $('#iEt').find(":selected").val() + '</edits>\n';
	/*Google maps style would be:
	False
	False
	False
	True
	False
	2*/
	if($('#iAt').find(":selected").val()==='False' && $('#iPbS').find(":selected").val()==='False' && $('#iSt').find(":selected").val()==='False' && $('#iMt').find(":selected").val()==='True' && $('#iEt').find(":selected").val()==='False' && $('#aT').val()===2){
		oXML += '    <Gog>1</Gog>\n';
		Gog = 1;
	} else {
		oXML += '    <Gog>0</Gog>\n';
		Gog = 0;
	}
	oXML += '    <licence>' + $('#lS').val() + '</licence>\n'; 
	oXML += '  </other>\n';
	oXML += '  <!-- This section defines the toolbar -->\n';
	//First we pickup the relevant options into an array
	var tool = [0,0,0,0,0,0,0,0,0,0,0,1,1];
	//Attributes
	if($('#iAt').find(":selected").val()==='True'){
		tool[0]=1;
		tool[1]=2;
	} 
	//Popup
	if($('#iPbS').find(":selected").val()==='True'){
		tool[2]=2;
		tool[3]=2;
	} 
	//Select
	if($('#iSt').find(":selected").val()==='True'){
		tool[4]=1;
		tool[5]=1;
		tool[6]=1;
	} else {
		tool[6]=1;
	}
	//Measure
	if($('#iMt').find(":selected").val()==='True'){
		tool[7]=2;
		tool[8]=1;
	} 
	//Edit
	if($('#iEt').find(":selected").val()==='True'){
		tool[9]=2;
		tool[10]=1;
	} 
	//Next define the arrays
	var actionType =['<option>Button</option>\n', '<option>-</option>\n', '<option>Button</option>\n', '<option>-</option>\n', '<option>Button</option>\n', '<option>Button</option>\n', '<option>Button</option>\n', '<option>-</option>\n', '<option>Button</option>\n', '<option>-</option>\n', '<option>Button</option>\n', '<option>-</option>\n', '<option>Button</option>\n'];
	var actionTitle =['<option>Table</option>\n', '<option>-</option>\n', '<option>Info</option>\n', '<option>-</option>\n', '<option>Pan</option>\n', '<option>Select</option>\n', '<option>Zoom</option>\n', '<option>-</option>\n', '<option>Measure</option>\n', '<option>-</option>\n', '<option>Edit</option>\n', '<option>-</option>\n', '<option>?</option>\n'];
	var actionArr =['<option></option>\n', '<option>-</option>\n', '<option></option>\n', '<option>-</option>\n', '<option></option>\n', '<option></option>\n', '<option></option>\n', '<option>-</option>\n', '<option></option>\n', '<option>-</option>\n', '<option></option>\n', '<option>-</option>\n', '<option></option>\n'];
	var actionCls =['<option></option>\n', '<option>-</option>\n', '<option>webgid-mapaction-info</option>\n', '<option>-</option>\n', '<option>webgis-mapaction-pan</option>\n', '<option></option>\n', '<option></option>\n', '<option>-</option>\n', '<option>webgis-mapaction-mline</option>\n', '<option>-</option>\n', '<option></option>\n', '<option>-</option>\n', '<option></option>\n'];
	var actionGroup =['<option></option>\n', '<option>-</option>\n', '<option></option>\n', '<option>-</option>\n', '<option>map-action</option>\n', '<option>map-action</option>\n', '<option>map-action</option>\n', '<option>-</option>\n', '<option>map-action</option>\n', '<option>-</option>\n', '<option></option>\n', '<option>-</option>\n', '<option></option>\n'];
	var actionText =['<option>Attributes Table</option>\n', '<option>-</option>\n', '<option>Enable Popup Bubbles</option>\n', '<option>-</option>\n', '<option>Move the Map</option>\n', '<option>Select a Feature</option>\n', '<option>Zoom to an Area</option>\n', '<option>-</option>\n', '<option>Measure</option>\n', '<option>-</option>\n', '<option>Editing Tools</option>\n', '<option>-</option>\n', '<option>?</option>\n'];
	var actionHandler =['<option>tableload();</option>\n', '<option>-</option>\n', '<option>handleInfo();</option>\n', '<option>-</option>\n', '<option>navSwitch();</option>\n', '<option>selectTog(\'Select a Feature\', \'map-action\');</option>\n', '<option>zoomConSwitch();</option>\n', '<option>-</option>\n', '<option>MeasurementSwitch();</option>\n', '<option>-</option>\n', '<option>edMOst();</option>\n', '<option>-</option>\n', '<option>loadManual();</option>\n'];
	var toolIn =['<option>4-', '<option>3-', '<option>5-', '<option>3-', '<option>4-', '<option>4-', '<option>4-', '<option>3-', '<option>4-', '<option>3-', '<option>4-', '<option>3-', '<option>4-'];
	//Finally; construct the XML
	oXML += '  <toolbar>\n';
	oXML += '    <actionType>\n';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionType[i];
		}
	}
	oXML += '    </actionType>\n';
	oXML += '    <actionTitle>\n';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionTitle[i];
		}
	}
	oXML += '    </actionTitle>\n';
	oXML += '    <actionArr>\n';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionArr[i];
		}
	}
	oXML += '    </actionArr>\n';
	oXML += '    <actionCls>\n';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionCls[i];
		}
	}
	oXML += '    </actionCls>\n';
	oXML += '    <actionGroup>\n';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionGroup[i];
		}
	}
	oXML += '    </actionGroup>\n';
	oXML += '    <actionText>\n';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionText[i];
		}
	}
	oXML += '    </actionText>\n';
	oXML += '    <actionHandler>\n';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionHandler[i];
		}
	}
	oXML += '    </actionHandler>\n';
	oXML += '    <toolIn>\n';
	var toolCount = 0;
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			if (tool[i]===1){
				toolCount = toolCount + 1;
				if (toolCount===parseInt($('#aTo').val())){
					oXML += '      ' + toolIn[i] + '1</option>\n';
				} else {
					oXML += '      ' + toolIn[i] + '0</option>\n';
				}
			} else {
				oXML += '      ' + toolIn[i] + '0</option>\n';
			}
		}
	}
	oXML += '    </toolIn>\n';
	oXML += '  </toolbar>\n';
	oXML += '  <!-- Other options start here -->\n';
	oXML += '  <basemaps>\n';
	oXML += '    <map>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pBase tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <mapURL>' + tmpVal + '</mapURL>\n';
				} else if (tmpID.indexOf("c2")!==-1) {
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <mapTitle>' + tmpVal + '</mapTitle>\n';
				}
			}
		})
	});
	oXML += '    </map>\n';
	oXML += '  </basemaps>\n';
	oXML += '  <!--  Overlays in this map [The order specified is important] -->\n'; 
	oXML += '  <wms>\n';
	//Pickup the number of rows in the user table
	var tmpTitles = [];
	tmpArr = $('#pLayer tr');
	tmpNo = tmpArr.length;
	hM = 0; //We need skip the header row
	tmpArr.each(function() {
		if(hM===0){
			hM = 1;
		} else {
			//This is a new row
			oXML += '    <overlay>\n';
			$('td', this).each(function(){
				tmpID = $(this).attr('id');
				if (typeof tmpID !=='undefined'){
					//First two have been moved to the end to avoid c10 + picking up under c1 or c20 under c2
					if (tmpID.indexOf("c3")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayTitle>' + tmpVal + '</overlayTitle>\n';
						tmpTitles.push(tmpVal);
					} else if (tmpID.indexOf("c4")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayDILS>' + tmpVal + '</overlayDILS>\n';
					} else if (tmpID.indexOf("c5")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <onasdefault>' + tmpVal + '</onasdefault>\n';
					} else if (tmpID.indexOf("c6")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlaySRS>' + tmpVal + '</overlaySRS>\n';
					} else if (tmpID.indexOf("c7")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayDOME>' + tmpVal + '</overlayDOME>\n';
					} else if (tmpID.indexOf("c8")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayDDtitle>' + tmpVal + '</overlayDDtitle>\n';
					} else if (tmpID.indexOf("c9")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlaySTYLES>' + tmpVal + '</overlaySTYLES>\n';
					} else if (tmpID.indexOf("c10")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayCache>' + tmpVal + '</overlayCache>\n';
					} else if (tmpID.indexOf("c11")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayTRAN>' + tmpVal + '</overlayTRAN>\n';
					} else if (tmpID.indexOf("c12")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayENV>' + tmpVal + '</overlayENV>\n';
					} else if (tmpID.indexOf("c1")!==-1){
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayAddress>' + tmpVal + '</overlayAddress>\n';
					} else if (tmpID.indexOf("c2")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayPath>' + tmpVal + '</overlayPath>\n';
					} 
				}
			})
			oXML += '      <overlayBuffer>1</overlayBuffer>\n';
			oXML += '    </overlay>\n';
		}
	});
	//Pickup the number of rows in the user table
	tmpArr = $('#pPopHov tr');
	tmpNo = tmpArr.length;
	hM = 0; //We need skip the header row
	tmpArr.each(function() {
		if(hM===0){
			hM = 1;
		} else {
			//This is a new row
			oXML += '    <overlay2>\n';
			$('td', this).each(function(){
				tmpID = $(this).attr('id');
				if (typeof tmpID !=='undefined'){
					if (tmpID.indexOf("c2")!==-1){
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayPopup>' + tmpVal + '</overlayPopup>\n';
					} else if (tmpID.indexOf("c3")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayPopupTemp>' + tmpVal + '</overlayPopupTemp>\n';
					} else if (tmpID.indexOf("c4")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayPopupWidth>' + tmpVal + '</overlayPopupWidth>\n';
					} else if (tmpID.indexOf("c5")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayPopupHeight>' + tmpVal + '</overlayPopupHeight>\n';
					} else if (tmpID.indexOf("c6")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayHoverTemp>' + tmpVal + '</overlayHoverTemp>\n';
					} else if (tmpID.indexOf("c7")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayHoverWidth>' + tmpVal + '</overlayHoverWidth>\n';
					} else if (tmpID.indexOf("c8")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayHoverHeight>' + tmpVal + '</overlayHoverHeight>\n';
					} 
				}
			})
			oXML += '    </overlay2>\n';
		}
	});
	//Pickup the number of rows in the user table
	tmpArr = $('#pZoom tr');
	tmpNo = tmpArr.length;
	hM = 0; //We need skip the header row
	tmpArr.each(function() {
		if(hM===0){
			hM = 1;
		} else {
			//This is a new row
			oXML += '    <overlay3>\n';
			$('td', this).each(function(){
				tmpID = $(this).attr('id');
				if (typeof tmpID !=='undefined'){
					if (tmpID.indexOf("c2")!==-1){
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayZoom>' + tmpVal + '</overlayZoom>\n';
					} else if (tmpID.indexOf("c3")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayZoomLevel>' + tmpVal + '</overlayZoomLevel>\n';
					} else if (tmpID.indexOf("c4")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayZoomSelF>' + tmpVal + '</overlayZoomSelF>\n';
					} else if (tmpID.indexOf("c5")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayZoomRepT>' + tmpVal + '</overlayZoomRepT>\n';
					} else if (tmpID.indexOf("c6")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayZoomRepF>' + tmpVal + '</overlayZoomRepF>\n';
					} 
				}
			})
			oXML += '    </overlay3>\n';
		}
	}); 
	oXML += '  </wms>\n';
	oXML += '  <!--  WFS Overlays in this map [The order specified should match the WMS] -->\n'; 
	oXML += '  <wfs>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pWFS tr');
	tmpNo = tmpArr.length;
	i = 0;
	hM = 0; //We need skip the header row
	tmpArr.each(function() {
		if(hM===0){
			hM = 1;
		} else {
			//This is a new row
			oXML += '    <overlay>\n';
			$('td', this).each(function(){
				tmpID = $(this).attr('id');
				if (typeof tmpID !=='undefined'){
					if (tmpID.indexOf("c2")!==-1){
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayType>' + tmpVal + '</overlayType>\n';
					} else if (tmpID.indexOf("c3")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayTable>' + tmpVal + '</overlayTable>\n';
					} else if (tmpID.indexOf("c4")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayfeatureType>' + tmpVal + '</overlayfeatureType>\n';
					} else if (tmpID.indexOf("c5")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayPath>' + tmpVal + '</overlayPath>\n';
					} else if (tmpID.indexOf("c6")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayDILS>' + tmpVal + '</overlayDILS>\n';
					} else if (tmpID.indexOf("c7")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlaySRS>' + tmpVal + '</overlaySRS>\n';
					} else if (tmpID.indexOf("c8")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlayfeatureNS>' + tmpVal + '</overlayfeatureNS>\n';
					} else if (tmpID.indexOf("c9")!==-1) {
						tmpVal = $(this).html();
						if(tmpVal.indexOf('select')!==-1){
							//This is a select option, get the value
							tmpVal = $(this).find('select').val();
						} else {
							tmpVal = $(this).text();
							if (tmpVal==='Click to edit'){
								tmpVal = '';
							}
						}
						oXML += '      <overlaygeometryName>' + tmpVal + '</overlaygeometryName>\n';
					} 
				}
			})
			oXML += '      <overlayTitle>' + tmpTitles[i] + '</overlayTitle>\n'; 
			oXML += '    </overlay>\n';
		}
		i = i + 1;
	});
	oXML += '  </wfs>\n';
	oXML += '  <!--  Style Dropdown -->\n'; 
	oXML += '  <styles>\n'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pStyle tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <style>' + tmpVal + '</style>\n';
				} 
			}
		})
	});
	oXML += '  </styles>\n';
	oXML += '  <styleTitles>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pStyle tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <sTitle>' + tmpVal + '</sTitle>\n';
				} 
			}
		})
	});
	oXML += '  </styleTitles>\n';
	oXML += '  <!--  Which overlay where the first is overlay0 and the second overlay1 etc -->\n'; 
	oXML += '  <defaultStyle>overlay0|</defaultStyle>\n'; 
	oXML += '  <styleLayer>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pStyle tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <sLayer>' + tmpVal + '</sLayer>\n';
				} 
			}
		})
	});
	oXML += '  </styleLayer>\n';
	oXML += '  <!--  General Table Settings -->\n'; 
	oXML += '  <lookups>\n';
	oXML += '    <!--  Lookup means from one table to another (i.e. S = Saved in another table) -->\n'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pLookup tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <targetCol>' + tmpVal + '</targetCol>\n';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <targetTable>' + tmpVal + '</targetTable>\n';
				} else if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <replaceCol>' + tmpVal + '</replaceCol>\n';
				} else if (tmpID.indexOf("c4")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <replaceTable>' + tmpVal + '</replaceTable>\n';
				} 
			}
		})
	});
	oXML += '  </lookups>\n';
	oXML += '  <optionsList>\n';
	oXML += '    <!--  Option lists create a list of options without a lookup -->\n'; 
	oXML += '    <oList1>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pOption tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '        <optionsListOp>' + tmpVal + '</optionsListOp>\n';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '        <optionListNo>' + tmpVal + '</optionListNo>\n';
				}
			}
		})
	});
	oXML += '    </oList1>\n';
	oXML += '    <oList2>\n';
	tmpArr = $('#pOption tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					if (tmpVal!==''){
						oXML += '        <optionsListCol>' + tmpVal + '</optionsListCol>\n';
					}
				} else if (tmpID.indexOf("c4")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					if (tmpVal!==''){
						oXML += '        <optionsListColLoop>' + tmpVal + '</optionsListColLoop>\n';
					}
				}
			}
		})
	});
	oXML += '    </oList2>\n';
	oXML += '  </optionsList>\n';
	oXML += '  <status>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pStatus tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <statusValue>' + tmpVal + '</statusValue>\n';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <statusAvail>' + tmpVal + '</statusAvail>\n';
				} else if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <statusText>' + tmpVal + '</statusText>\n';
				} else if (tmpID.indexOf("c4")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <statusTable>' + tmpVal + '</statusTable>\n';
				} else if (tmpID.indexOf("c5")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <statusField>' + tmpVal + '</statusField>\n';
				} 
			}
		})
	});
	oXML += '  </status>\n';
	oXML += '  <exclusions>\n';
	oXML += '    <!--  Columns to exclude from the view table -->\n'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pExclusion tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <exclusion>' + tmpVal + '</exclusion>\n';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <exclusionT>' + tmpVal + '</exclusionT>\n';
				} 
			}
		})
	});
	oXML += '  </exclusions>\n';
	oXML += '  <disable>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pDiscol tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <option>' + tmpVal + '</option>\n';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <optionT>' + tmpVal + '</optionT>\n';
				} 
			}
		})
	});
	oXML += '  </disable>\n';
	oXML += '  <tableLoops>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pLoops tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <tableName>' + tmpVal + '</tableName>\n';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <tableCondition>' + tmpVal + '</tableCondition>\n';
				} 
			}
		})
	});
	oXML += '  </tableLoops>\n';
	oXML += '  <!--  Tables to include -->\n'; 
	oXML += '  <table>\n';
	oXML += '    <!--  Loops of a single table -->\n'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pOTable tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <tableName>' + tmpVal + '</tableName>\n';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <tableGeom>' + tmpVal + '</tableGeom>\n';
				} else if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <tableTitle>' + tmpVal + '</tableTitle>\n';
				} else if (tmpID.indexOf("c4")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <selStyle>' + tmpVal + '</selStyle>\n';
				} else if (tmpID.indexOf("c5")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <recNo>' + tmpVal + '</recNo>\n';
				} else if (tmpID.indexOf("c6")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <lower>' + tmpVal + '</lower>\n';
				} else if (tmpID.indexOf("c7")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <order_by>' + tmpVal + '</order_by>\n';
				} else if (tmpID.indexOf("c8")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <geom_field>' + tmpVal + '</geom_field>\n';
				} 
			}
		})
	});
	oXML += '  </table>\n';
	oXML += '  <functions>\n';
	oXML += '    <!--  Functions to exclude -->\n'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pFExclusion tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <functionEx>' + tmpVal + '</functionEx>\n';
				} 
			}
		})
	});
	oXML += '  </functions>\n';
	oXML += '  <!--  This set of entries is for predefined maps (pdm) -->\n'; 
	oXML += '  <pdmArr>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pPredef tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).html();
					if(tmpVal.indexOf('select')!==-1){
						//This is a select option, get the value
						tmpVal = $(this).find('select').val();
					} else {
						tmpVal = $(this).text();
						if (tmpVal==='Click to edit'){
							tmpVal = '';
						}
					}
					oXML += '      <option>' + tmpVal + '</option>\n';
				} 
			}
		})
	});
	oXML += '  </pdmArr>\n';
	//Pickup the number of rows in the user table
	tmpArr = $('#pPredef tr');
	tmpNo = tmpArr.length;
	tmpVal = [];
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c2")!==-1){
					tmpVal.push($(this).text());
				} 
			}
		})
	});
	//Pre-defined maps are not so simple so we have loaded the values from the table into an array
	//We can then manipulate the array to create the required XML values as follows:
	oXML += '  <pdmFilter>\n';
	for(i=0;i<tmpVal.length;i++){
		oXML += '    <option>' + tmpVal[i].replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</option>\n';
	}
	oXML += '  </pdmFilter>\n';
	oXML += '  <pdmUFilter>\n';
	for(i=0;i<tmpVal.length;i++){
		try {
			if(tmpVal[i].indexOf('|==|')!==-1){tmpVal[i] = tmpVal[i].replace("|==|", "&#165;Equal&#165;to&#165;");}
			if(tmpVal[i].indexOf('|>=|')!==-1){tmpVal[i] = tmpVal[i].replace("|>=|", "&#165;Greater&#165;than&#165;or&#165;equal&#165;to&#165;");}
			if(tmpVal[i].indexOf('|<=|')!==-1){tmpVal[i] = tmpVal[i].replace("|<=|", "&#165;Less&#165;than&#165;or&#165;equal&#165;to&#165;");}
			if(tmpVal[i].indexOf('|<>|')!==-1){tmpVal[i] = tmpVal[i].replace("|<>|", "&#165;Not&#165;equal&#165;");}
			if(tmpVal[i].indexOf('|!=|')!==-1){tmpVal[i] = tmpVal[i].replace("|!=|", "&#165;Not&#165;equal&#165;");}
			if(tmpVal[i].indexOf('|>|')!==-1){tmpVal[i] = tmpVal[i].replace("|>|", "&#165;Greater&#165;than&#165;");}
			if(tmpVal[i].indexOf('|<|')!==-1){tmpVal[i] = tmpVal[i].replace("|<|", "&#165;Less&#165;than&#165;");}
			if(tmpVal[i].indexOf('|..|')!==-1){tmpVal[i] = tmpVal[i].replace("|..|", "&#165;Between&#165;");}
		} catch(error){
			tmpVal[i] = 'Out of Memory Issue!';
		}
		oXML += '    <option>' + tmpVal[i] + '</option>\n';
	}
	oXML += '  </pdmUFilter>\n';
	oXML += '</settings>';
	oXML = oXML.replace(/Click to edit/g,"");
	//alert(oXML);
	tmpURL = "../../apps/admin_functions/configsetter.php";
	$.post(tmpURL, {xml: oXML, loc: locStr})
		.done(function() {
			alert( "Config File Created, to return to the admin page you need to type admin.html in the map URL");
	});
}
