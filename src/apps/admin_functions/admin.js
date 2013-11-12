/*Global variable configuration*/
var conLayers = [];
var conLayersT = [];
var conTables = [];
var conTablesT = [];
var oR = []; //objectReference array
var i, i2, i3; 

/*Create the blank row strings for each of the tables*/
var pUsers = '<tr><td id="pUr£c1" class="ed"></td><td><a onclick("moveRow(\"up\",\"pUr£c1\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"pUr£\")")>&#x25BC;</a></td></tr>';
var pBase = '<tr><td id="bMr£c1" class="ed"></td><td id="bMr£c2" class="ed"></td><td><a onclick("moveRow(\"up\",\"bMr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"bMr£\")")>&#x25BC;</a></td></tr>';
var pFExclusion = '<tr><td id="fEr£c1" class="ed"></td><td><a onclick("moveRow(\"up\",\"fEr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"fEr£\")")>&#x25BC;</a></td></tr>';
var pPredef = '<tr><td id="pDmr£c1" class="ed"></td><td id="pDmr£c2" class="ed"></td><td><a onclick("moveRow(\"up\",\"pDmr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"pDmr£\")")>&#x25BC;</a></td></tr>';
var pStyle = '<tr><td id="sCr£c1"><select id="sCsel"></select></td><td id="sCr£c2" class="ed"></td><td id="sCr£c3" class="ed"></td><td><a onclick("moveRow(\"up\",\"sCr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"sCr£\")")>&#x25BC;</a></td></tr>';
var pLayer = '<tr><td><a onclick("moveRow(\"up\",\"pLr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"pLr£\")")>&#x25BC;</a></td><td id="pLr£c1" class="ed"></td><td id="pLr£c2" class="ed"></td><td id="pLr£c3" class="ed"></td><td id="pLr£c4"><select id="pLbool1-£"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr£c5"><select id="pLbool2-£"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr£c6" class="ed"></td><td id="pLr£c7"><select id="pLbool3-£"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr£c8" class="ed"></td><td id="pLr£c9" class="ed"></td><td id="pLr£c10"><select id="pLbool4-£"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr£c11"><select id="pLbool5-£"><option value="True">True</option><option value="False">False</option></select></td><td id="pLr£c12" class="ed"></td></tr>';
var pPopHov = '<tr><td id="pUhr£c1"></td><td id="pUhr£c2"><select id="pUhbool1-£"><option value="True">True</option><option value="False">False</option></select></td><td id="pUhr£c3" class="ed"></td><td id="pUhr£c4" class="ed"></td><td id="pUhr£c5" class="ed"></td><td id="pUhr£c6" class="ed"></td><td id="pUhr£c7" class="ed"></td><td id="pUhr£c8" class="ed"></td></tr>';
var pZoom = '<tr><td id="pZr£c1"></td><td id="pZr£c2"><select id="pZbool1-£"><option value="True">True</option><option value="False">False</option></select></td><td id="pZr£c3" class="ed"></td><td id="pZr£c4"><select id="pZbool2-£"><option value="True">True</option><option value="False">False</option></select></td><td id="pZr£c5" class="ed"></td><td id="pZr£c6" class="ed"></td></tr>';
var pWFS = '<tr><td id="pWFSr£c1"></td><td id="pWFSr£c2" class="ed"></td><td id="pWFSr£c3" class="ed"></td><td id="pWFSr£c4" class="ed"></td><td id="pWFSr£c5" class="ed"></td><td id="pWFSr£c6" class="ed"></td><td id="pWFSr£c7" class="ed"></td><td id="pWFSr£c8" class="ed"></td><td id="pWFSr£c9" class="ed"></td></tr>';
var pLookup = '<tr><td id="tLr£c1" class="ed"></td><td id="tLr£c2" class="ed"></td><td id="tLr£c3" class="ed"></td><td id="tLr£c4" class="ed"></td><td><a onclick("moveRow(\"up\",\"tLr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tLr£\")")>&#x25BC;</a></td></tr>';
var pOption = '<tr><td id="tOr£c1" class="ed"></td><td id="tOr£c2" class="ed"></td><td id="tOr£c3" class="ed"></td><td id="tOr£c4" class="ed"></td><td><a onclick("moveRow(\"up\",\"tOr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tOr£\")")>&#x25BC;</a></td></tr>';
var pStatus = '<tr><td id="tSr£c1" class="ed"></td><td id="tSr£c2"><select id="pSbool1-£"><option value="True">True</option><option value="False">False</option></select></td><td id="tSr£c3" class="ed"></td><td id="tSr£c4"><select id="tSsel"></select></td><td id="tSr£c5" class="ed"></td><td><a onclick("moveRow(\"up\",\"tSr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tSr£\")")>&#x25BC;</a></td></tr>';
var pOTable = '<tr><td><a onclick("moveRow(\"up\",\"oTr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"oTr£\")")>&#x25BC;</a></td><td id="oTr£c1" class="ed"></td><td id="oTr£c2"><select id="oTbool1-£"><option value="True">True</option><option value="False">False</option></select></td><td id="oTr£c3" class="ed"></td><td id="oTr£c4" class="ed"></td><td id="oTr£c5" class="ed"></td><td id="oTr£c6" class="ed"></td><td id="oTr£c7" class="ed"></td><td id="oTr£c8" class="ed"></td></tr>';
var pExclusion = '<tr><td id="tEr£c1" class="ed"></td><td id="tEr£c2"><select id="tEsel"></select></td><td><a onclick("moveRow(\"up\",\"tEr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tEr£\")")>&#x25BC;</a></td></tr>';
var pDiscol = '<tr><td id="dCr£c1" class="ed"></td><td id="dCr£c2"><select id="dCsel"></select></td><td><a onclick("moveRow(\"up\",\"dCr£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"dCr£\")")>&#x25BC;</a></td></tr>';
var pLoops = '<tr><td id="tLor£c1"><select id="tLosel"></select></td><td id="tLor£c2" class="ed"></td><td><a onclick("moveRow(\"up\",\"tLor£\")")>&#x25B2;</a> <a onclick("moveRow(\"down\",\"tLor£\")")>&#x25BC;</a></td></tr>';

//Column Function arrays
var pBaseA = [
	"eC.mL.basemaps[*].mapURL", 
	"eC.mL.basemaps[*].mapTitle"
];

var pLayerA = [
	"eC.mL.overlays[*].overlayAddress", 
	"eC.mL.overlays[*].overlayPath", 
	"eC.mL.overlays[*].overlayTitle", 
	"eC.mL.overlays[*].overlayDILS", 
	"eC.mL.overlays[*].onasdefault", 
	"eC.mL.overlays[*].overlaySRS", 
	"eC.mL.overlays[*].overlayDOME", 
	"eC.mL.overlays[*].overlayDDtitle", 
	"eC.mL.overlays[*].overlaySTYLES", 
	"eC.mL.overlays[*].overlayCache", 
	"eC.mL.overlays[*].overlayTRAN", 
	"eC.mL.overlays[*].overlayENV", 
	"eC.mL.overlays[*].overlayPopup", 
	"eC.mL.overlays[*].overlayPopupTemp", 
	"eC.mL.overlays[*].overlayPopupWidth", 
	"eC.mL.overlays[*].overlayPopupHeight", 
	"eC.mL.overlays[*].overlayHoverTemp", 
	"eC.mL.overlays[*].overlayHoverWidth", 
	"eC.mL.overlays[*].overlayHoverHeight", 
	"eC.mL.overlays[*].overlayZoom", 
	"eC.mL.overlays[*].overlayZoomLevel", 
	"eC.mL.overlays[*].overlayZoomSelF", 
	"eC.mL.overlays[*].overlayZoomRepT", 
	"eC.mL.overlays[*].overlayZoomRepF"
];

var pWFSA = [
	"eC.mL.wfs[*].overlayType", 
	"eC.mL.wfs[*].overlayTable", 
	"eC.mL.wfs[*].overlayfeatureType", 
	"eC.mL.wfs[*].overlayPath", 
	"eC.mL.wfs[*].overlayDILS", 
	"eC.mL.wfs[*].overlaySRS", 
	"eC.mL.wfs[*].overlayfeatureNS", 
	"eC.mL.wfs[*].overlaygeometryName", 
	"eC.mL.wfs[*].overlayTitle.0"
];

var pTableA = [
	"eC.tD.table[*].tableName", 
	"eC.tD.table[*].tableGeom", 
	"eC.tD.table[*].tableTitle", 
	"eC.tD.table[*].selStyle", 
	"eC.tD.table[*].recNo", 
	"eC.tD.table[*].lower", 
	"eC.tD.table[*].order_by", 
	"eC.tD.table[*].geom_field"
];

var tLoopA = [
	"eC.tD.tloops[*].tableName", 
	"eC.tD.tloops[*].tableCondition"
];

var pLookupA = [
	"eC.tD.lookup[*].targetCol", 
	"eC.tD.lookup[*].targetTable", 
	"eC.tD.lookup[*].replaceCol", 
	"eC.tD.lookup[*].replaceTable"
];

var pStatusA = [
	"eC.tD.status[*].statusValue", 
	"eC.tD.status[*].statusAvail", 
	"eC.tD.status[*].statusText", 
	"eC.tD.status[*].statusTable", 
	"eC.tD.status[*].statusField"
];

var pExclusionA = [
	"eC.tD.exclusions[*].exclusion", 
	"eC.tD.exclusions[*].exclusionT"
];

var pDiscolA = [
	"eC.tD.discols[*].option", 
	"eC.tD.discols[*].optionT"
];

var pFExclusionA = [
	"eC.oS.funcEx[*].functionEx"
];

var pPredefA = [
	"eC.oS.pdm[*].option"
];
		
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
var eC;
function pageSetup(){
	//Variable definitions
	var fH, fF;
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
		ft = "Map Configuration Form for " + eC.configuredMap;
		$('#pageHeader').html(ft);
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
	fH += "<span class='optH'>Active tool:</span><span class='opt'><input type='text' id='aT' value='3' /></span><br />";
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
			eC.mD.appTitle["0"], 
			eC.mD.projectPath["0"], 
			eC.mD.proj["0"], 
			eC.mD.projMap["0"], 
			eC.mD.reproject["0"], 
			eC.mD.projMap2["0"], 
			eC.mD.wfsedits["0"], 
			eC.mD.wmsbase["0"], 
			eC.mD.popupPan["0"], 
			eC.mD.popupDefault["0"], 
			eC.mD.attribute["0"], 
			eC.mD.edits["0"], 
			eC.mD.active_table["0"], 
			eC.mD.ddFull["0"], 
			eC.mD.photoscroll["0"], 
			eC.mD.photoscrollpath["0"], 
			eC.mD.licence["0"], 
			eC.mD.Gog["0"], 
			eC.mD.legendtree["0"], 
			eC.mD.selectlegendtree["0"],
			"eC.tB.actionType[1]", 
			"eC.tB.actionTitle[1]", 
			"eC.tB.actionArr:[1]", 
			"eC.tB.actionCls[1]", 
			"eC.tB.actionGroup[1]", 
			"eC.tB.actionText[1]", 
			"eC.tB.actionHandler[1]", 
			"eC.tB.toolIn[1]",
			"eC.mL.basemaps[*2*]",
			"eC.mL.basemaps[*].mapURL", 
			"eC.mL.basemaps[*].mapTitle",
			"eC.mL.overlays[*24*]",
			"eC.mL.overlays[*].overlayAddress", 
			"eC.mL.overlays[*].overlayPath", 
			"eC.mL.overlays[*].overlayTitle", 
			"eC.mL.overlays[*].overlayDILS", 
			"eC.mL.overlays[*].onasdefault", 
			"eC.mL.overlays[*].overlaySRS", 
			"eC.mL.overlays[*].overlayDOME", 
			"eC.mL.overlays[*].overlayDDtitle", 
			"eC.mL.overlays[*].overlaySTYLES", 
			"eC.mL.overlays[*].overlayCache", 
			"eC.mL.overlays[*].overlayTRAN", 
			"eC.mL.overlays[*].overlayENV", 
			"eC.mL.overlays[*].overlayPopup", 
			"eC.mL.overlays[*].overlayPopupTemp", 
			"eC.mL.overlays[*].overlayPopupWidth", 
			"eC.mL.overlays[*].overlayPopupHeight", 
			"eC.mL.overlays[*].overlayHoverTemp", 
			"eC.mL.overlays[*].overlayHoverWidth", 
			"eC.mL.overlays[*].overlayHoverHeight", 
			"eC.mL.overlays[*].overlayZoom", 
			"eC.mL.overlays[*].overlayZoomLevel", 
			"eC.mL.overlays[*].overlayZoomSelF", 
			"eC.mL.overlays[*].overlayZoomRepT", 
			"eC.mL.overlays[*].overlayZoomRepF", 
			"eC.mL.wfs[*9*]",
			"eC.mL.wfs[*].overlayType", 
			"eC.mL.wfs[*].overlayTable", 
			"eC.mL.wfs[*].overlayfeatureType", 
			"eC.mL.wfs[*].overlayPath", 
			"eC.mL.wfs[*].overlayDILS", 
			"eC.mL.wfs[*].overlaySRS", 
			"eC.mL.wfs[*].overlayfeatureNS", 
			"eC.mL.wfs[*].overlaygeometryName", 
			"eC.mL.wfs[*].overlayTitle[\"0\"]",
			"eC.tD.table[*8*]",
			"eC.tD.table[*].tableName", 
			"eC.tD.table[*].tableGeom", 
			"eC.tD.table[*].tableTitle", 
			"eC.tD.table[*].selStyle", 
			"eC.tD.table[*].recNo", 
			"eC.tD.table[*].lower", 
			"eC.tD.table[*].order_by", 
			"eC.tD.table[*].geom_field",
			"eC.tD.tloops[*2*]",
			"eC.tD.tloops[*].tableName", 
			"eC.tD.tloops[*].tableCondition",
			"eC.tD.lookup[*4*]",
			"eC.tD.lookup[*].targetCol", 
			"eC.tD.lookup[*].targetTable", 
			"eC.tD.lookup[*].replaceCol", 
			"eC.tD.lookup[*].replaceTable",
			"eC.tD.options.oList1", 
			"eC.tD.options.oList2",
			"eC.tD.status[*5*]",
			"eC.tD.status[*].statusValue", 
			"eC.tD.status[*].statusAvail", 
			"eC.tD.status[*].statusText", 
			"eC.tD.status[*].statusTable", 
			"eC.tD.status[*].statusField",
			"eC.tD.exclusions[*2*]",
			"eC.tD.exclusions[*].exclusion", 
			"eC.tD.exclusions[*].exclusionT",
			"eC.tD.discols[*2*]",
			"eC.tD.discols[*].option", 
			"eC.tD.discols[*].optionT",
			"eC.oS.styles", 
			"eC.oS.funcEx[*1*]",
			"eC.oS.funcEx[*].functionEx",
			"eC.oS.pdm[*1*]",
			"eC.oS.pdm[*].option"
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
			//
			"-",
			"-",			
			//"legendT*", 
			//"legendT*",
			"-", 
			"tooltypes('eC.tB.actionTitle','type')", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"tooltypes('eC.tB.toolIn','active')",
			"addLine('eC.mL.basemaps','pBase',2)",
			"-", 
			"-", 
			"addLine('eC.mL.overlays','pLayer',24)",
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"-", 
			"addLine('eC.mL.wfs','pWFS',9)",
			"-", 
			"-",
			"-",
			"-",
			"-",
			"-",
			"-",
			"-",
			"-",
			"addLine('eC.tD.table','pTable',8)",
			"-",
			"-",
			"-",
			"-",
			"-",
			"-",
			"-",
			"-",
			"addLine('eC.tD.tloops','pLoop',2)",
			"-",
			"-",
			"addLine('eC.tD.lookup','pLookup',4)",
			"-",
			"-",
			"-",
			"-",
			//Issue with object creation for these lines; commented out until able to resolve
			//"addLine('eC.tD.options.oList1','pOList1',2)", 
			//"-",
			"-",
			//"addLine('eC.tD.options.oList1','pOList2',2)", 
			//"-",
			"-",
			"addLine('eC.tD.status','pStatus',5)",
			"-",
			"-",
			"-",
			"-",
			"-",
			"addLine('eC.tD.exclusions','pExclusion',2)",
			"-",
			"-",
			"addLine('eC.tD.discols','pDiscol',2)",
			"-",
			"-",
			//
			"-",
			//"eC.oS.styles", 
			"addLine('eC.oS.funcEx','pFExclusion',1)",
			"-",
			"addLine('eC.oS.pdm','pPredef',1)",
			"-"
		]};
		
		//Loop through the object and run the required functions
		var callLen = oR.R.length;
		var rA, hA, hO, selOpt;
		for(i=0;i<callLen;i++){
			rA = oR.R;
			hA = oR.H;
			if(hA[i].indexOf("(")!==-1){
				//This is a function run
				
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
						} else {
							hO.value = rA[i];
						}
					}
				}
			} //If it is a '-' then we ignore it
		}
	}
}
/*This function adds a new row to any table*/
function addRow(table, currRow){
	//First we pickup the specified table
	var updateTab = '#'+ table + ' tr:last';
	var TabNo = '#' + table + ' tr';
	TabNo = $(TabNo).length;
	
	//We then add a new row to the table in form style
	$(updateTab).after(window[table].replace(/£/g,TabNo));
	
	//Set up the layer selects
	layerHandle();
	
	//Set up the table selects
	tableHandle();
	
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
					
					tableHandle(value, $(this).attr("id"));
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

function layerHandle(val, id){
	var handle = ['pUhsel', 'pZsel', 'pWFSsel', 'sCsel'];
	var handleP1 = ['pUhr', 'pZr', 'pWFSr', 'sCr'];
	if (typeof id!=='undefined'){
		id = id.substring(3);
	}
	var tableHandle = ['#pPopHov tr', '#pZoom tr', '#pWFS tr', '#pStyle tr'];
	var handleType = ['v','v','v','s'];
	var tdHandle, v, t, layerSelHTML, TabNo, id2;
	for (i=0;i<handle.length;i++){
		TabNo = $(tableHandle[i]).length;
		id2 = handleP1[i] + id;
		for (i2=0;i2<TabNo;i2++){
			if(i2!==0){
				if(handleType[i]==='s'){
					tdHandle = handleP1[i] + i2 + 'c1';
					layerSelHTML = '<select id="' + handle[i] + '">';
					if (conLayers.length===0){
						layerSelHTML += '<option value"">Please Add Layers First</option>'; 
					} else {
						selOpt = document.getElementById(handle[i]).options.selectedIndex;
						if(selOpt===-1){
							v = "";
							t = "";
						} else {
							sv = document.getElementById(handle[i]).options[selOpt].value;
							st = document.getElementById(handle[i]).options[selOpt].text;
							if (st==='Please Add Layers First' || st===''){
								v = "";
								t = "";
							} else {
								v = sv;
								t = st;
							}
						}
						for(i3=0;i3<conLayers.length;i3++){
							if(conLayers[i3]!=='Click to edit' || conLayers[i3]!=='Save'){
								//Add this option
								if (conLayers[i3]===v){
									layerSelHTML += '<option value"' + v + '" selected="selected">' + t + '</option>';
								} else {
									layerSelHTML += '<option value"' + conLayers[i3] + '">' + conLayersT[i3] + '</option>'; 
								}
							}
						}
					}
					layerSelHTML += '</select>';
					document.getElementById(tdHandle).innerHTML = layerSelHTML; 
				} else {
					if (typeof val!=='undefined'){
						tdHandle = handleP1[i] + i2 + 'c1';
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

function tableHandle(val, id){
	var thandle = ['tSsel', 'tEsel', 'dCsel', 'tLosel'];
	var thandleP1 = ['tSr', 'tEr', 'dCr', 'tLor'];
	var thandleP2 = ['c4','c2','c2','c1'];
	if (typeof id!=='undefined'){
		id = id.substring(3);
	}
	var tableHandle = ['#pStatus tr', '#pExclusion tr', '#pDiscol tr', '#pLoops tr'];
	var thandleType = ['s','s','s','s'];
	var ttdHandle, v, t, tableSelHTML, TabNo, id2;
	for (i=0;i<thandle.length;i++){
		TabNo = $(tableHandle[i]).length;
		id2 = thandleP1[i] + id;
		for (i2=0;i2<TabNo;i2++){
			if(i2!==0){
				if(thandleType[i]==='s'){
					ttdHandle = thandleP1[i] + i2 + thandleP2[i];
					tableSelHTML = '<select id="' + thandle[i] + '">';
					if (conTables.length===0){
						tableSelHTML += '<option value"">Please Add Tables First</option>'; 
					} else {
						selOpt = document.getElementById(thandle[i]).options.selectedIndex;
						if(selOpt===-1){
							v = "";
							t = "";
						} else {
							sv = document.getElementById(thandle[i]).options[selOpt].value;
							st = document.getElementById(thandle[i]).options[selOpt].text;
							if (st==='Please Add Tables First' || st===''){
								v = "";
								t = "";
							} else {
								v = sv;
								t = st;
							}
						}
						for(i3=0;i3<conTables.length;i3++){
							if(conTables[i3]!=='Click to edit' || conTables[i3]!=='Save'){
								//Add this option
								if (conTables[i3]===v){
									tableSelHTML += '<option value"' + v + '" selected="selected">' + t + '</option>';
								} else {
									tableSelHTML += '<option value"' + conTables[i3] + '">' + conTablesT[i3] + '</option>'; 
								}
							}
						}
					}
					tableSelHTML += '</select>';
					document.getElementById(ttdHandle).innerHTML = tableSelHTML; 
				} else {
					if (typeof val!=='undefined'){
						ttdHandle = handleP1[i] + i2 + 'c1';
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
	var oXML, tmpNo, tmpArr, tmpVal, tmpID, Gog;
	oXML = '<?xml version="1.["0"" standalone="yes" ?>';	 
	oXML += '<settings>';
	oXML += '  <!--  Access to this application is limited to the following users-->';  
	oXML += '  <userArray>';
	oXML += '    <!--  Array -->'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pUsers tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				tmpVal = $(this).text();
				oXML += '    <option>' + tmpVal + '<option>';
			}
		})
	});
	oXML += '  </userArray>';
	oXML += '  <other>';
	oXML += '    <!--  Other settings -->';
	oXML += '    <appTitle>' + $('#mT').val() + '</appTitle>'; 
	oXML += '    <projectPath>' + $('#rURL').val() + '</projectPath>';
	if($('#rF').val()!==''){
		oXML += '    <reproject>Yes</reproject>'; 
	} else {
		oXML += '    <reproject>No</reproject>'; 
	}
	oXML += '    <proj>' + $('#mP').find(":selected").val() + '</proj>'; 
	oXML += '    <projMap>EPSG:' + $('#mP').find(":selected").val() + '</projMap>'; 
	oXML += '    <projMap2>' + $('#rF').val() + '</projMap2>';  
	oXML += '    <popupPan>' + $('#pMoP').find(":selected").val() + '</popupPan>'; 
	oXML += '    <ddFull>' + $('#fDd').find(":selected").val() + '</ddFull>';
	oXML += '    <popupDefault>' + $('#pD').find(":selected").val() + '</popupDefault>';
	if($('#legendT').find(":selected").val()==='standard'){
		oXML += '    <legendtree>False</legendtree>'; 
		oXML += '    <selectlegendtree>False</selectlegendtree>';
	} else if ($('#legendT').find(":selected").val()==='selectL'){
		oXML += '    <legendtree>True</legendtree>'; 
		oXML += '    <selectlegendtree>False</selectlegendtree>';
	} else {
		oXML += '    <legendtree>False</legendtree>'; 
		oXML += '    <selectlegendtree>True</selectlegendtree>';
	}
	oXML += '    <wfsedits>' + $('#rURLwfs').val() + '</wfsedits>'; 
	oXML += '    <wmsbase>' + $('#rURLwms').val() + '</wmsbase>'; 
	oXML += '    <photoscroll>' + $('#pC').find(":selected").val() + '</photoscroll>';
	oXML += '    <photoscrollpath>' + $('#pCf').val() + '</photoscrollpath>';
	oXML += '    <active_table>' + $('#aT').val() + '</active_table>';
	oXML += '    <attribute>' + $('#iAt').find(":selected").val() + '</attribute>';
	oXML += '    <edits>' + $('#iEt').find(":selected").val() + '</edits>';
	/*Google maps style would be:
	False
	False
	False
	True
	False
	2*/
	if($('#iAt').find(":selected").val()==='False' && $('#iPbS').find(":selected").val()==='False' && $('#iSt').find(":selected").val()==='False' && $('#iMt').find(":selected").val()==='True' && $('#iEt').find(":selected").val()==='False' && $('#aT').val()===2){
		oXML += '    <Gog>1</Gog>';
		Gog = 1;
	} else {
		oXML += '    <Gog>0</Gog>';
		Gog = 0;
	}
	oXML += '    <licence>' + $('#lS').val() + '</licence>'; 
	oXML += '  </other>';
	oXML += '  <!-- This section defines the toolbar -->';
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
	var actionType =['<option>Button</option>', '<option>-</option>', '<option>Button</option>', '<option>-</option>', '<option>Button</option>', '<option>Button</option>', '<option>Button</option>', '<option>-</option>', '<option>Button</option>', '<option>-</option>', '<option>Button</option>', '<option>-</option>', '<option>Button</option>'];
	var actionTitle =['<option>Table</option>', '<option>-</option>', '<option>Info</option>', '<option>-</option>', '<option>Pan</option>', '<option>Select</option>', '<option>Zoom</option>', '<option>-</option>', '<option>Measure</option>', '<option>-</option>', '<option>Edit</option>', '<option>-</option>', '<option>?</option>'];
	var actionArr =['<option></option>', '<option>-</option>', '<option></option>', '<option>-</option>', '<option></option>', '<option></option>', '<option></option>', '<option>-</option>', '<option></option>', '<option>-</option>', '<option></option>', '<option>-</option>', '<option></option>'];
	var actionCls =['<option></option>', '<option>-</option>', '<option>webgid-mapaction-info</option>', '<option>-</option>', '<option>webgis-mapaction-pan</option>', '<option></option>', '<option></option>', '<option>-</option>', '<option>webgis-mapaction-mline</option>', '<option>-</option>', '<option></option>', '<option>-</option>', '<option></option>'];
	var actionGroup =['<option></option>', '<option>-</option>', '<option></option>', '<option>-</option>', '<option>map-action</option>', '<option>map-action</option>', '<option>map-action</option>', '<option>-</option>', '<option>map-action</option>', '<option>-</option>', '<option></option>', '<option>-</option>', '<option></option>'];
	var actionText =['<option>Attributes Table</option>', '<option>-</option>', '<option>Enable Popup Bubbles</option>', '<option>-</option>', '<option>Move the Map</option>', '<option>Select a Feature</option>', '<option>Zoom to an Area</option>', '<option>-</option>', '<option>Measure</option>', '<option>-</option>', '<option>Editing Tools</option>', '<option>-</option>', '<option>?</option>'];
	var actionHandler =['<option>tableload();</option>', '<option>-</option>', '<option>handleInfo();</option>', '<option>-</option>', '<option>navSwitch();</option>', '<option>selectTog(\'Select a Feature\', \'map-action\');</option>', '<option>zoomConSwitch();</option>', '<option>-</option>', '<option>MeasurementSwitch();</option>', '<option>-</option>', '<option>edMOst();</option>', '<option>-</option>', '<option>loadManual();</option>'];
	var toolIn =['<option>4-', '<option>3-', '<option>5-', '<option>3-', '<option>4-', '<option>4-', '<option>4-', '<option>3-', '<option>4-', '<option>3-', '<option>4-', '<option>3-', '<option>4-'];
	//Finally; construct the XML
	oXML += '  <toolbar>';
	oXML += '    <actionType>';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionType[i];
		}
	}
	oXML += '    </actionType>';
	oXML += '    <actionTitle>';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionTitle[i];
		}
	}
	oXML += '    </actionTitle>';
	oXML += '    <actionArr>';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionArr[i];
		}
	}
	oXML += '    </actionArr>';
	oXML += '    <actionCls>';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionCls[i];
		}
	}
	oXML += '    </actionCls>';
	oXML += '    <actionGroup>';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionGroup[i];
		}
	}
	oXML += '    </actionGroup>';
	oXML += '    <actionText>';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionText[i];
		}
	}
	oXML += '    </actionText>';
	oXML += '    <actionHandler>';
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			oXML += '      ' + actionHandler[i];
		}
	}
	oXML += '    </actionHandler>';
	oXML += '    <toolIn>';
	var toolCount = 0;
	for(i=0;i<tool.length;i++){
		if(tool[i]===1 || tool[i]===2){
			if (tool[i]===1){
				toolCount = toolCount + 1;
			}
			if (toolCount===$('#aT').val()){
				oXML += '      ' + toolIn[i] + '1</option>';
			} else {
				oXML += '      ' + toolIn[i] + '0</option>';
			}
		}
	}
	oXML += '    </toolIn>';
	oXML += '  </toolbar>';
	oXML += '  <!-- Other options start here -->';
	oXML += '  <basemaps>';
	oXML += '    <map>';
	//Pickup the number of rows in the user table
	tmpArr = $('#pBase tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <mapURL>' + tmpVal + '</mapURL>';
				} else if (tmpID.indexOf("c2")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <mapTitle>' + tmpVal + '</mapTitle>';
				}
			}
		})
	});
	oXML += '    </map>';
	oXML += '  </basemaps>';
	oXML += '  <!--  Overlays in this map [The order specified is important] -->'; 
	oXML += '  <wms>';
	//Pickup the number of rows in the user table
	var tmpTitles = [];
	tmpArr = $('#pLayer tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		//This is a new row
		oXML += '    <overlay>';
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <overlayAddress>' + tmpVal + '</overlayAddress>';
				} else if (tmpID.indexOf("c2")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayPath>' + tmpVal + '</overlayPath>';
				} else if (tmpID.indexOf("c3")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayTitle>' + tmpVal + '</overlayTitle>';
					tmpTitles.push(tmpVal);
				} else if (tmpID.indexOf("c4")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayDILS>' + tmpVal + '</overlayDILS>';
				} else if (tmpID.indexOf("c5")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <onasdefault>' + tmpVal + '</onasdefault>';
				} else if (tmpID.indexOf("c6")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlaySRS>' + tmpVal + '</overlaySRS>';
				} else if (tmpID.indexOf("c7")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayDOME>' + tmpVal + '</overlayDOME>';
				} else if (tmpID.indexOf("c8")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayDDtitle>' + tmpVal + '</overlayDDtitle>';
				} else if (tmpID.indexOf("c9")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlaySTYLES>' + tmpVal + '</overlaySTYLES>';
				} else if (tmpID.indexOf("c10")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayCache>' + tmpVal + '</overlayCache>';
				} else if (tmpID.indexOf("c11")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayTRAN>' + tmpVal + '</overlayTRAN>';
				} else if (tmpID.indexOf("c12")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayENV>' + tmpVal + '</overlayENV>';
				}
			}
		})
		oXML += '      <overlayBuffer>1</overlayBuffer>';
		oXML += '    </overlay>';
	});
	//Pickup the number of rows in the user table
	tmpArr = $('#pPopHov tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		//This is a new row
		oXML += '    <overlay2>';
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <overlayPopup>' + tmpVal + '</overlayPopup>';
				} else if (tmpID.indexOf("c3")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayPopupTemp>' + tmpVal + '</overlayPopupTemp>';
				} else if (tmpID.indexOf("c4")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayPopupWidth>' + tmpVal + '</overlayPopupWidth>';
				} else if (tmpID.indexOf("c5")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayPopupHeight>' + tmpVal + '</overlayPopupHeight>';
				} else if (tmpID.indexOf("c6")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayHoverTemp>' + tmpVal + '</overlayHoverTemp>';
				} else if (tmpID.indexOf("c7")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayHoverWidth>' + tmpVal + '</overlayHoverWidth>';
				} else if (tmpID.indexOf("c8")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayHoverHeight>' + tmpVal + '</overlayHoverHeight>';
				} 
			}
		})
		oXML += '    </overlay2>';
	});
	//Pickup the number of rows in the user table
	tmpArr = $('#pZoom tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		//This is a new row
		oXML += '    <overlay3>';
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <overlayZoom>' + tmpVal + '</overlayZoom>';
				} else if (tmpID.indexOf("c3")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayZoomLevel>' + tmpVal + '</overlayZoomLevel>';
				} else if (tmpID.indexOf("c4")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayZoomSelF>' + tmpVal + '</overlayZoomSelF>';
				} else if (tmpID.indexOf("c5")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayZoomRepT>' + tmpVal + '</overlayZoomRepT>';
				} else if (tmpID.indexOf("c6")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayZoomRepF>' + tmpVal + '</overlayZoomRepF>';
				} 
			}
		})
		oXML += '    </overlay3>';
	}); 
	oXML += '  </wms>';
	oXML += '  <!--  WFS Overlays in this map [The order specified should match the WMS] -->'; 
	oXML += '  <wfs>';
	//Pickup the number of rows in the user table
	tmpArr = $('#pWFS tr');
	tmpNo = tmpArr.length;
	i = 0;
	tmpArr.each(function() {
		//This is a new row
		oXML += '    <overlay>';
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <overlayType>' + tmpVal + '</overlayType>';
				} else if (tmpID.indexOf("c3")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayTable>' + tmpVal + '</overlayTable>';
				} else if (tmpID.indexOf("c4")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayfeatureType>' + tmpVal + '</overlayfeatureType>';
				} else if (tmpID.indexOf("c5")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayPath>' + tmpVal + '</overlayPath>';
				} else if (tmpID.indexOf("c6")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayDILS>' + tmpVal + '</overlayDILS>';
				} else if (tmpID.indexOf("c7")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlaySRS>' + tmpVal + '</overlaySRS>';
				} else if (tmpID.indexOf("c8")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlayfeatureNS>' + tmpVal + '</overlayfeatureNS>';
				} else if (tmpID.indexOf("c9")!==-1) {
					tmpVal = $(this).text();
					oXML += '      <overlaygeometryName>' + tmpVal + '</overlaygeometryName>';
				} 
			}
		})
		oXML += '      <overlayTitle>' + tmpTitles[i] + '</overlayTitle>'; 
		oXML += '    </overlay>';
		i = i + 1;
	});
	oXML += '  </wfs>';
	oXML += '  <!--  Style Dropdown -->'; 
	oXML += '  <styles>';
	oXML += '    <style />'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pStyle tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <style>' + tmpVal + '</style>';
				} 
			}
		})
	});
	oXML += '  </styles>';
	oXML += '  <styleTitles>';
	oXML += '    <sTitle>Default Style</sTitle>'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pStyle tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).text();
					oXML += '      <sTitle>' + tmpVal + '</sTitle>';
				} 
			}
		})
	});
	oXML += '  </styleTitles>';
	oXML += '  <!--  Which overlay where the first is overlay0 and the second overlay1 etc -->'; 
	oXML += '  <defaultStyle>overlay0|</defaultStyle>'; 
	oXML += '  <styleLayer>';
	oXML += '    <sLayer>overlay0</sLayer>'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pStyle tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <sLayer>' + tmpVal + '</sLayer>';
				} 
			}
		})
	});
	oXML += '  </styleLayer>';
	oXML += '  <!--  General Table Settings -->'; 
	oXML += '  <lookups>';
	oXML += '    <!--  Lookup means from one table to another (i.e. S = Saved in another table) -->'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pLookup tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <targetCol>' + tmpVal + '</targetCol>';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <targetTable>' + tmpVal + '</targetTable>';
				} else if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).text();
					oXML += '      <replaceCol>' + tmpVal + '</replaceCol>';
				} else if (tmpID.indexOf("c4")!==-1){
					tmpVal = $(this).text();
					oXML += '      <replaceTable>' + tmpVal + '</replaceTable>';
				} 
			}
		})
	});
	oXML += '  </lookups>';
	oXML += '  <optionsList>';
	oXML += '    <!--  Option lists create a list of options without a lookup -->'; 
	oXML += '    <oList1>';
	//Pickup the number of rows in the user table
	tmpArr = $('#pOption tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '        <optionsListOp>' + tmpVal + '</optionsListOp>';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '        <optionListNo>' + tmpVal + '</optionListNo>';
				}
			}
		})
	});
	oXML += '    </oList1>';
	oXML += '    <oList2>';
	tmpArr = $('#pOption tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).text();
					if (tmpVal!==''){
						oXML += '        <optionsListCol>' + tmpVal + '</optionsListCol>';
					}
				} else if (tmpID.indexOf("c4")!==-1){
					tmpVal = $(this).text();
					if (tmpVal!==''){
						oXML += '        <optionsListColLoop>' + tmpVal + '</optionsListColLoop>';
					}
				}
			}
		})
	});
	oXML += '    </oList2>';
	oXML += '  </optionsList>';
	oXML += '  <status>';
	//Pickup the number of rows in the user table
	tmpArr = $('#pStatus tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <statusValue>' + tmpVal + '</statusValue>';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <statusAvail>' + tmpVal + '</statusAvail>';
				} else if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).text();
					oXML += '      <statusText>' + tmpVal + '</statusText>';
				} else if (tmpID.indexOf("c4")!==-1){
					tmpVal = $(this).text();
					oXML += '      <statusTable>' + tmpVal + '</statusTable>';
				} else if (tmpID.indexOf("c5")!==-1){
					tmpVal = $(this).text();
					oXML += '      <statusField>' + tmpVal + '</statusField>';
				} 
			}
		})
	});
	oXML += '  </status>';
	oXML += '  <exclusions>';
	oXML += '    <!--  Columns to exclude from the view table -->'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pExclusion tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <exclusion>' + tmpVal + '</exclusion>';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <exclusionT>' + tmpVal + '</exclusionT>';
				} 
			}
		})
	});
	oXML += '  </exclusions>';
	oXML += '  <disable>';
	//Pickup the number of rows in the user table
	tmpArr = $('#pDiscol tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <option>' + tmpVal + '</option>';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <optionT>' + tmpVal + '</optionT>';
				} 
			}
		})
	});
	oXML += '  </disable>';
	oXML += '  <tableLoops>';
	//Pickup the number of rows in the user table
	tmpArr = $('#pLoops tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <tableName>' + tmpVal + '</tableName>';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <tableCondition>' + tmpVal + '</tableCondition>';
				} 
			}
		})
	});
	oXML += '  </tableLoops>';
	oXML += '  <!--  Tables to include -->'; 
	oXML += '  <table>';
	oXML += '    <!--  Loops of a single table -->'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pOTable tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <tableName>' + tmpVal + '</tableName>';
				} else if (tmpID.indexOf("c2")!==-1){
					tmpVal = $(this).text();
					oXML += '      <tableGeom>' + tmpVal + '</tableGeom>';
				} else if (tmpID.indexOf("c3")!==-1){
					tmpVal = $(this).text();
					oXML += '      <tableTitle>' + tmpVal + '</tableTitle>';
				} else if (tmpID.indexOf("c4")!==-1){
					tmpVal = $(this).text();
					oXML += '      <selStyle>' + tmpVal + '</selStyle>';
				} else if (tmpID.indexOf("c5")!==-1){
					tmpVal = $(this).text();
					oXML += '      <recNo>' + tmpVal + '</recNo>';
				} else if (tmpID.indexOf("c6")!==-1){
					tmpVal = $(this).text();
					oXML += '      <lower>' + tmpVal + '</lower>';
				} else if (tmpID.indexOf("c7")!==-1){
					tmpVal = $(this).text();
					oXML += '      <order_by>' + tmpVal + '</order_by>';
				} else if (tmpID.indexOf("c8")!==-1){
					tmpVal = $(this).text();
					oXML += '      <geom_field>' + tmpVal + '</geom_field>';
				} 
			}
		})
	});
	oXML += '  </table>';
	oXML += '  <functions>';
	oXML += '    <!--  Functions to exclude -->'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pFExclusion tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <functionEx>' + tmpVal + '</functionEx>';
				} 
			}
		})
	});
	oXML += '  </functions>';
	oXML += '  <!--  This set of entries is for predefined maps (pdm) -->'; 
	oXML += '  <pdmArr>';
	oXML += '    <!--  Array -->'; 
	oXML += '    <option>Default</option>'; 
	//Pickup the number of rows in the user table
	tmpArr = $('#pPredef tr');
	tmpNo = tmpArr.length;
	tmpArr.each(function() {
		$('td', this).each(function(){
			tmpID = $(this).attr('id');
			if (typeof tmpID !=='undefined'){
				if (tmpID.indexOf("c1")!==-1){
					tmpVal = $(this).text();
					oXML += '      <option>' + tmpVal + '</option>';
				} 
			}
		})
	});
	oXML += '  </pdmArr>';
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
	oXML += '  <pdmFilter>';
	oXML += '    <!--  Array -->'; 
	oXML += '    <option />'; 
	for(i=0;i<tmpVal.length;i++){
		oXML += '    <option>' + tmpVal[i].replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</option>';
	}
	oXML += '  </pdmFilter>';
	oXML += '  <pdmUFilter>';
	oXML += '    <!--  Array -->'; 
	oXML += '    <option />'; 
	for(i=0;i<tmpVal.length;i++){
		tmpVal[i] = tmpVal[i].replace(/|==|/g, "&#165;Equal&#165;to&#165;");
		tmpVal[i] = tmpVal[i].replace(/|>=|/g, "&#165;Greater&#165;than&#165;or&#165;equal&#165;to&#165;");
		tmpVal[i] = tmpVal[i].replace(/|<=|/g, "&#165;Less&#165;than&#165;or&#165;equal&#165;to&#165;");
		tmpVal[i] = tmpVal[i].replace(/|<>|/g, "&#165;Not&#165;equal&#165;");
		tmpVal[i] = tmpVal[i].replace(/|>|/g, "&#165;Greater&#165;than&#165;");
		tmpVal[i] = tmpVal[i].replace(/|<|/g, "&#165;Less&#165;than&#165;");
		tmpVal[i] = tmpVal[i].replace(/|..|/g, "&#165;Between&#165;");
		oXML += '    <option>' + tmpVal[i] + '</option>';
	}
	oXML += '  </pdmUFilter>';
	oXML += '</settings>';
	tmpURL = "../../apps/admin_functions/configsetter.php";
	$.post(tmpURL, {xml: oXML, loc: locStr})
		.done(function() {
			alert( "Config File Created, to return to the admin page you need to type admin.html in the map URL");
	});
}