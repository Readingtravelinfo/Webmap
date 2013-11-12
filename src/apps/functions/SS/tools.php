<?php
// attempt a connection
include 'housekeeping.php';

// Variable read in
//----- In the future this should be read from XML input -----//
// Variable read in from config.xml file
$projectPath = $_SERVER['HTTP_REFERER'];
if (substr($projectPath, 0, 9)=="https://g") {
	//External address 
	$projectPath = substr($projectPath,36);
} else {
	//Internal address
	$projectPath = substr($projectPath,18);
}
if (substr($projectPath, strlen($projectPath)-4,strlen($projectPath))=="html") {
	$projectPath = substr($projectPath,0, strrpos($projectPath, "/")) . "/";
}
$projectPath = "../.." . $projectPath . 'config.xml';
if (file_exists($projectPath)) {
    $xml = simplexml_load_file($projectPath);
}

//We need to define the map as early as possible to ensure the actions are not void
print "
Proj4js.defs[\"EPSG:27700\"] = \"+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs\";
Proj4js.defs[\"EPSG:4326\"] = \"+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs\";
var reproject = '" . $xml->other->reproject . "';
var projMap = '" . $xml->other->projMap . "';
var projMapb = '" . $xml->other->projMap2 . "';
var projMap2 = " . $xml->other->proj . ";
var Ppath = '" . $xml->other->projectPath . "';
var loadEdits = '" . $xml->other->edits . "';
var loadAttributes = '" . $xml->other->attribute . "';
var popupDefault = '" . $xml->other->popupDefault . "';
var gog = false;
";
if ($xml->other->popupPan == "True") {
	print "var popupPan = true;
	";
} else {
	print "var popupPan = false;
	";
}
print "
var onasdefault = '" . $xml->other->onasdefault . "';
if (reproject == 'Yes'){
	var options = {
		controls: [new OpenLayers.Control.PanZoomBar()],
		projection: Proj4js.defs[projMap],
		displayProjection: Proj4js.defs[projMapb]
	};
} else {
	var options = {
		controls: [new OpenLayers.Control.PanZoomBar()]
	};
}
map = new OpenLayers.Map(options);

var Dpath;
Dpath = document.URL;
//Sort out the URL path (local vrs remote)
var pos;
pos = Dpath.indexOf('/', 9);
Dpath = Dpath.substr(0,pos);
if (Dpath.search('https://64') == -1) {
	Dpath = 'https://geo.reading-travelinfo.co.uk/geoserver/';
} else {
	Dpath = 'https://64.5.1.218/geoserver/';
}
";

$table = $xml->other->active_table;
$statusValue = array();
$statusAvail = array();
$statusText = array();
$statusTable = array();
$statusField = array();
print "var statusValue = [];
var statusAvail = [];
var statusText = [];
var statusTable = [];
var statusField = [];
";
foreach ($xml->status->statusValue as $opt){
	array_push($statusValue, $opt);
	print "statusValue.push('" . $opt . "');
	";
}
foreach ($xml->status->statusAvail as $opt){
	if ($opt = "True") {
		array_push($statusAvail, 1);
		print "statusAvail.push(1);
		";
	} else {
		array_push($statusAvail, 0);
		print "statusAvail.push(0);
		";
	}
}
foreach ($xml->status->statusText as $opt){
	array_push($statusText, $opt);
	print "statusText.push('" . $opt . "');
	";
}
foreach ($xml->status->statusTable as $opt){
	array_push($statusTable, $opt);
	print "statusTable.push('" . $opt . "');
	";
}
foreach ($xml->status->statusField as $opt){
	array_push($statusField, $opt);
	print "statusField.push('" . $opt . "');
	";
}

print " 
var appTitle = '" . $xml->other->appTitle . "';
";
if ($xml->other->legendtree == "True") {
	print "var legendtree = true;
	";
} else {
	print "var legendtree = false;
	";
}

//Here we pickup the base maps
print "
var basemaps = [];
var basemapURL = [];
var basemapTitle = [];
";
$i = 0;
foreach ($xml->basemaps->map as $opt) {
	print "var bmap" . $i . ";
	basemaps.push('bmap" . $i . "');
	basemapURL.push('" . $opt->mapURL . "');
	basemapTitle.push('" . $opt->mapTitle . "');
	";
	if ($i==0){
		//Pickup the first map, we will use this as the edit map base
		print "var MiniMap;
		";
		$firstMap = "'MiniMap'";
		$firstMapURL = "'" . $opt->mapURL . "'";
	}
	$i = $i + 1;
}
//Set up the editmap base
print "basemaps.push(" . $firstMap . ");
basemapURL.push(" . $firstMapURL . ");
basemapTitle.push('MiniMap');
";

//Here we pickup the overlays
print "
var overlayArray = [];
var overlayURL = [];
var overlayAddress = [];
var overlayPath = [];
var overlayTitle = [];
var overlayDILS = [];
var overlaySRS = [];
var overlayDOME = [];
var overlayBuffer = [];
var overlaySTYLES = [];
var overlayTRAN = [];
var overlayENV = [];
var overlayPopup = [];
var overlayENVswitch = [];
var overlayPopup = [];
var overlayPopupTemp = [];
var overlayCache = [];
var overlayTable = [];
var popwidth = [];
var popheight = [];
";
$i = 0;
foreach ($xml->wms->overlay as $opt) {
	print "overlayArray.push('overlay" . $i . "');
	var overlay" . $i . ";
	var info" . $i . ";
	overlayURL.push('" . $opt->overlayURL . "');
	overlayAddress.push('" . $opt->overlayAddress . "');
	overlayPath.push('" . $opt->overlayPath . "');
	overlayTitle.push('" . $opt->overlayTitle . "');
	"; 
	if ($opt->overlayDILS = "True") {
		print "overlayDILS.push(true);
		";
	} else {
		print "overlayDILS.push(false);
		";
	}
	print "
	overlaySRS.push('" . $opt->overlaySRS . "');
	"; 
	if ($opt->overlayDOME = "True") {
		print "overlayDOME.push(true);
		";
	} else {
		print "overlayDOME.push(false);
		";
	}
	print "
	overlayBuffer.push(" . $opt->overlayBuffer . ");
	overlaySTYLES.push('" . $opt->overlaySTYLES . "');
	"; 
	if ($opt->overlayTRAN = "True") {
		print "overlayTRAN.push(true);
		";
	} else {
		print "overlayTRAN.push(false);
		";
	}
	print "
	overlayENV.push(\"" . $opt->overlayENV . "\");
	overlayCache.push(\"" . $opt->overlayCache . "\");
	overlayTable.push(\"" . $opt->overlayTable . "\");
	";
	if ($opt->overlayENV == ""){
		//There is not a ENV switch for this layer
		print "overlayENVswitch.push(0);
		";
	} else {
		//There is a ENV switch for this layer
		print "overlayENVswitch.push(1);
		";
	}
	print "overlayPopup.push('" . $opt->overlayPopup . "');
	overlayPopupTemp.push('" . $opt->overlayPopupTemp . "');
	popwidth.push(\"" . $opt->overlayPopupWidth . "\");
	popheight.push(\"" . $opt->overlayPopupHeight . "\");
	";
	$i = $i + 1;
}
print "
var SpathwWFS = '" . $xml->other->wfsedits . "';
var SpathBASE = '" . $xml->other->wmsbase . "';
var wfsFT = [];
var wfsPath = [];
var wfsTitle = [];
var wfsDILS = [];
var wfsSRS = [];
var wfsNS = [];
var wfsGeom = [];
var wfsArray = [];
";
$i = 0;
foreach ($xml->wfs->overlay as $opt){
	print "var wfs" . $i . ";
	wfsArray.push('wfs" . $i . "');
	wfsFT.push('" . $opt->overlayfeatureType . "');
	wfsPath.push('" . $opt->overlayPath . "');
	wfsTitle.push('" . $opt->overlayTitle . "');
	";
	if ($opt->overlayDILS == "True") {
		print "wfsDILS.push(true);
		";
	} else {
		print "wfsDILS.push(false);
		";
	}
	print "
	wfsSRS.push('" . $opt->overlaySRS . "');
	wfsNS.push('" . $opt->overlayfeatureNS . "');
	wfsGeom.push('" . $opt->overlaygeometryName . "');
	";
	$i = $i + 1;
}
print "var overlayNo = overlayArray.length;
";

//Carry on with other variables
$actionType = array();
foreach ($xml->toolbar->actionType->option as $opt) {
	array_push($actionType, $opt);
}
$actionTitle = array();
foreach ($xml->toolbar->actionTitle->option as $opt) {
	array_push($actionTitle, $opt);
}
$actionArr = array();
foreach ($xml->toolbar->actionArr->option as $opt) {
	array_push($actionArr, $opt);
}
$actionCls = array();
foreach ($xml->toolbar->actionCls ->option as $opt) {
	array_push($actionCls , $opt);
}
$actionGroup = array();
foreach ($xml->toolbar->actionGroup->option as $opt) {
	array_push($actionGroup, $opt);
}
$actionText = array();
foreach ($xml->toolbar->actionText->option as $opt) {
	array_push($actionText, $opt);
}
$actionHandler = array();
foreach ($xml->toolbar->actionHandler->option as $opt) {
	array_push($actionHandler, $opt);
}
$toolIn = array(); //Where 0 = not on this map,  1 = tool available,  2 = Active tool,  3 = a spacer and 4 a handler button
$toolAct = array(); //Where 1 = Active
$groupIn = array(); //Used for multiple toolbars but currently only one
$exText = array(); //Used for multiple toolbars but currently only one
foreach ($xml->toolbar->toolIn->option as $opt) {
	array_push($toolAct, intval(substr($opt,strlen($opt)-1)));
	array_push($toolIn, intval(substr($opt,0,1)));
	array_push($groupIn, 1);
	array_push($exText, 0);
}
$menuNames = array();
/*foreach ($xml->toolbar->menuNames->option as $opt) {
	array_push($menuNames, $opt);
} disabled at present */

//These are global variables read in from the config.xml
print 'var tableHTML = "";
var table = "' . $xml->other->active_table . '";
var tableArray = [];
var tableTitles = [];
var tableGeomEdit = [];
';
foreach ($xml->table->tableName as $opt) {
	print "tableArray.push('" . $opt . "');
	";
}
foreach ($xml->table->tableTitle as $opt) {
	print "tableTitles.push('" . $opt . "');
	";
}
foreach ($xml->table->tableGeom as $opt) {
    print "tableGeomEdit.push('" . $opt . "');
    ";
}
print '
var userArray = new Array(';
$i = 0;
foreach ($xml->userArray->option as $opt) {
	if ($i==0) {
		print '"' . $opt . '"';
	} else {
		print ',"' . $opt . '"';
	}
	$i++;
}
print ');
var pdmArr = [';
$i = 0;
foreach ($xml->pdmArr->option as $opt) {
	if ($i==0) {
		print '"' . $opt . '"';
	} else {
		print ',"' . $opt . '"';
	}
	$i++;
}
print '];  //Filter Text
var pdmFilter = [';
$i = 0;
foreach ($xml->pdmFilter->option as $opt) {
	//We need to look for special cases here
	$failsafe = 1;
	$opt3 = $opt;
	while (strpos($opt3,"SPECIALY(")!=false && $failsafe < 10){
		//We have a special case for the year
		$curYear = date('Y');
		$int1 = strpos($opt3,"SPECIALY(");
		$int2 = strpos($opt3,")",$int1);
		$part1 = substr($opt3,0,$int1);
		$part2 = intval(substr($opt3,$int1+9,$int2));
		$part3 = substr($opt3,$int2+1);
		$opt2 = $part1 . ($curYear + $part2) . $part3;
		$opt3 = $opt2;
		$failsafe = $failsafe + 1;
	}
	$failsafe = 1;
	while (strpos($opt3,"SPECIALM(")!=false && $failsafe < 10){
		//We have a special case for the month
		$curYear = date('Y');
		$curMonth = date('m');
		$int1 = strpos($opt3,"SPECIALM(");
		$int2 = strpos($opt3,")",$int1);
		$part1 = substr($opt3,0,$int1);
		$part2 = intval(substr($opt3,$int1+9,$int2));
		$part3 = substr($opt3,$int2+1);
		if (($curMonth + $part2)>12){
			$resMonth = 1;
			$resYear = $curYear + 1;
		} elseif (($curMonth + $part2)<1){
			$resMonth = 12;
			$resYear = $curYear - 1;
		} else {
			$resMonth = $curMonth + $part2;
			$resYear = $curYear;
		}
		if ($resMonth < 10) {
			$opt2 = $part1 . $resYear . "-0" . $resMonth . "-01" . $part3;
		} else {
			$opt2 = $part1 . $resYear . "-" . $resMonth . "-01" . $part3;
		}
		$opt3 = $opt2;
		$failsafe = $failsafe + 1;
	}
	if ($i==0) {
		print '"' . $opt2 . '"';
	} else {
		print ',"' . $opt2 . '"';
	}
	$i++;
}
print '];  //CQL filter 
var pdmUFilter = [';
$i = 0;
foreach ($xml->pdmUFilter->option as $opt) {
	//We need to look for special cases here
	$failsafe = 1;
	$opt3 = $opt;
	while (strpos($opt3,"SPECIALY(")!=false && $failsafe < 10){
		//We have a special case for the year
		$curYear = date('Y');
		$int1 = strpos($opt3,"SPECIALY(");
		$int2 = strpos($opt3,")",$int1);
		$part1 = substr($opt3,0,$int1);
		$part2 = intval(substr($opt3,$int1+9,$int2));
		$part3 = substr($opt3,$int2+1);
		$opt2 = $part1 . ($curYear + $part2) . $part3;
		$opt3 = $opt2;
		$failsafe = $failsafe + 1;
	}
	$failsafe = 1;
	while (strpos($opt3,"SPECIALM(")!=false && $failsafe < 10) {
		//We have a special case for the month
		$curYear = date('Y');
		$curMonth = date('m');
		$int1 = strpos($opt3,"SPECIALM(");
		$int2 = strpos($opt3,")",$int1);
		$part1 = substr($opt3,0,$int1);
		$part2 = intval(substr($opt3,$int1+9,$int2));
		$part3 = substr($opt3,$int2+1);
		if (($curMonth + $part2)>12){
			$resMonth = 1;
			$resYear = $curYear + 1;
		} elseif (($curMonth + $part2)<1){
			$resMonth = 12;
			$resYear = $curYear - 1;
		} else {
			$resMonth = $curMonth + $part2;
			$resYear = $curYear;
		}
		if ($resMonth < 10) {
			$opt2 = $part1 . $resYear . "-0" . $resMonth . "-01" . $part3;
		} else {
			$opt2 = $part1 . $resYear . "-" . $resMonth . "-01" . $part3;
		}
		$opt3 = $opt2;
		$failsafe = $failsafe + 1;
	}
	if ($i==0) {
		print '"' . $opt2 . '"';
	} else {
		print ',"' . $opt2 . '"';
	}
	$i++;
}
print '];  //URL filter
';

print "fieldNamesMaster = [];
fieldRange =[];
";
$i2 = 0;
foreach ($xml->table->tableName as $opt) {
	//Get the fieldlist 
	$query = "SELECT * FROM " . pg_escape_identifier($opt) . ";";
	$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
	$colNo = pg_num_fields($res);
	
	//Set up column arrays for this table
	for ($i=0;$i<$colNo;$i++){
		print "var col" . $i2 . pg_field_name($res,$i) . " = [];
		fieldNamesMaster.push('" . pg_field_name($res,$i) . "');
		fieldRange.push('" . $i2 . "');
		";
	}
	$i2 = $i2 + 1;
	// Free resultset
	pg_free_result($res);
}

//Define the gid array
if ($table != '') {
	$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
	print "var gidLookupToRow = [";
	$query1 = 'SELECT gid, mod_by FROM ' . pg_escape_identifier($table) . ' ORDER BY gid ASC ;';
	$res1 = pg_query($dbconn, $query1) or die('Query failed: ' . pg_last_error());
	$tabRows = pg_num_rows($res1);
	for ($i=0;$i<$tabRows;$i++){
		if ($i==0){
			print pg_fetch_result($res1,$i,0);
		} else {
			print ", " . pg_fetch_result($res1,$i,0);
		}
	}
	print "]; //gid lookup to row number
	";
	
	//Define the functions
	print "var fieldNames = [];
	function defineFieldNames(tableRef) {
		for (i=0;i<tableArray.length;i++){
			if(tableRef == tableArray[i]){
				var tableRef = i;
			}
		}
		fieldNames = [];
		for (i=0;i<fieldNamesMaster.length;i++){
			if (fieldRange[i]==tableRef){
				fieldNames.push(fieldNamesMaster[i]);
			}
		}
	}";
	// Free resultset
	pg_free_result($res1);
	pg_close($dbconn);
}

print "function defineTools(map, GeoExt, Ext) {
var copywriteTxt = '" . $xml->other->licence . "';
var todayString = new Date();
var yearString = todayString.getFullYear();
copywriteTxt = copywriteTxt.replace(/{Year}/g, yearString);
document.getElementById('copyrightTxt').innerHTML = copywriteTxt;
	
var actions, toolbarItems, action, tmpStr, actionArr, groupIn, actionText, actionGroup;
toolbarItems = [];
actions = [];
";

print "actionArr = [];\n";
for ($i=0;$i<count($actionArr);$i++){
	print "actionArr.push('" . $actionArr[$i] . "');\n";
}
print "groupIn = [];\n";
for ($i=0;$i<count($groupIn);$i++){
	print "groupIn.push('" . $groupIn[$i] . "');\n";
}
print "actionText = [];\n";
for ($i=0;$i<count($actionText);$i++){
	print "actionText.push('" . $actionText[$i] . "');\n";
}
print "actionGroup = [];\n";
for ($i=0;$i<count($actionGroup);$i++){
	print "actionGroup.push('" . $actionGroup[$i] . "');\n";
}

$styleList = [];
$styleTitle = [];
$styleLayer = [];
foreach ($xml->styleOptions->SLD as $opt) {
	array_push($styleList, $opt);
}
foreach ($xml->styleOptions->styleTitle as $opt) {
	array_push($styleTitle, $opt);
}
foreach ($xml->styleOptions->styleLayer as $opt) {
	array_push($styleLayer, $opt);
}
//Generate style options if available
if (count($styleList) > 0){
	print "var action = { 
		xtype     : 'combo',
		id        : 'styleCombo',
		width     : 300,
		store     : new Ext.data.SimpleStore({
            fields: ['optionTxt','name'],
            data: [";
		for ($i=0;$i<count($styleList);$i++){
			if ($i==0){
				print "['" . $styleLayer[$i] . "|" . $styleList[$i] . "','" . $styleTitle[$i] . "']"; 
			} else {
				print ",
				['" . $styleLayer[$i] . "|" . $styleList[$i] . "','" . $styleTitle[$i] . "']";
			}
		}
		print "]
		}),
		displayField: 'name',
		valueField: 'optionTxt',
		selectOnFocus: true,
        mode: 'local',
        typeAhead: true,
        editable: false,
        triggerAction: 'all',
		value: '" . $xml->defaultStyle . "',
		listeners: 
			{ select: { fn:function(combo, value)
					{
						setStyle(this.value);
					}
				}  
			}
	};
	actions.push(action);
	";
}

//Generate the actions
for ($i=0;$i<count($actionArr);$i++){
	if ($toolIn[$i] == 3) {
		$action = "action = '-';";
	} elseif ($toolIn[$i] == 4){
		$action = "action = new Ext.Button({
			text: '" . $actionText[$i] . "',
		";
		if ($actionGroup[$i]!='') {
			$action .= "enableToggle: true,
			toggleGroup: '" . $actionGroup[$i] . "',
			";
		} else {
			$action .= "enableToggle: false,
			";
		}
		if ($actionCls[$i] != ''){
			$action .= "iconCls: '" . $actionCls[$i] . "', 
			";
		}
		$action .= "	handler: function() {" . $actionHandler[$i] . "}
		});";
	} elseif ($toolIn[$i] == 5) {
		$action = "action = new Ext.Button({
			text: '" . $actionText[$i] . "',
		";
		$action .= "enableToggle: true,
		";
		if ($actionGroup[$i]!='') {
			$action .=  "toggleGroup: '" . $actionGroup[$i] . "',
			";
		} 
		$action .= "	handler: function() {" . $actionHandler[$i] . "}
		});";
	} elseif ($toolIn[$i] > 0) {
		if ($actionType[$i] == 'Action') {
			$action = "action = new GeoExt.Action({";
		} elseif ($actionType[$i] == 'Button') {
			$action = "action = new Ext.Button({";
		}
		$action .= "control: " . $actionArr[$i] . ", 
			map: map, 
			";
		if ($actionHandler[$i]!=''){
			$action .= "handler: function() {" . $actionHandler[$i] . "},
			";
		}
		if ($actionGroup[$i]!=''){
			$action .= "	allowDepress: false,
			";
		} else {
			if ($actionTitle[$i]=='Save'){
				$action .= "	allowDepress: false,
				";
			} else {
				$action .= "	allowDepress: true,
				";
			}
		}
			$action .= "// button options
			";
		if ($actionGroup[$i]!=''){
			$action .= "toggleGroup: '" . $actionGroup[$i] . "',
			";
		}
		if ($toolAct[$i] == 1) {
			$action .= "pressed: true, 
			";
		} else {
			$action .= "pressed: false, 
			";
		}
		if ($actionTitle[$i]=='Save'){
			$action .= "enableToggle: false,
			";
		} else {
			$action .= "enableToggle: true,
			";
		}
		if ($actionCls[$i] != ''){
			$action .= "iconCls: '" . $actionCls[$i] . "', 
			";
		}
		$action .= "tooltip: '" . $actionText[$i] . "', 
			// check item options
			";
		if ($actionGroup[$i]!=''){
			if ($groupIn[$i]>1){
				$action .= "listeners: {click: function(){handleTog('" . $actionText[$i] . "', '" . $actionGroup[$i] . "','" . $menuNames[$groupIn[$i]] . "');}},
				";
			} else {
				$action .= "listeners: {click: function(){handleTog('" . $actionText[$i] . "', '" . $actionGroup[$i] . "');}},
				";
			}
		}
		if ($exText[$i]==0){	
			$action .= "text: '" . $actionText[$i] . "', 
			";
		}
		if ($actionGroup[$i]!=''){
			$action .= "group: '" . $actionGroup[$i] . "', 
			";
		}
		if ($toolAct[$i] == 1) {
			$action .= "checked: true";
			print "document.getElementById('footer').innerHTML = 'Currently Active Tool: " . $actionText[$i] . "';
			";
		} else {
			$action .= "checked: false";
		}
		$action .= "
		});";
	} 
	$action .= "\n		
	actions.push(action);\n";
	print $action;
}
if ($xml->other->Gog == 1) {
	$action = "action = new GeoExt.Action({control: nav, 
	map: map, 
	checked: true
	});";
	$action .= "\n		
	actions.push(action);\n";
	print $action;
	print "document.getElementById('footer').innerHTML = 'Currently Active Tool: Move the Map';
	gog = true;
	";
}

$action = "action = new GeoExt.Action({control: measureline,
map: map,
checked: false
});
\n
actions.push(action);\n";
print $action;
$action = "action = new GeoExt.Action({control: measurepolygon,
map: map,
checked: false
});
\n
actions.push(action);\n";
print $action;

print "toolbarItems = [];
toolbarItems.push('->');
";
//Generate the Toolbar
$menuS = 0;
for ($i=0;$i<count($actionArr);$i++){
	if ($groupIn[$i] == 1 && $menuS == 0) {
		$toolbar .= "toolbarItems.push(actions[" . $i . "]);\n";
	} else {
		if ($menuS == 0){
			//This is the start of a menu
			$toolbar .= "toolbarItems.push({
				text: '" . $menuNames[$groupIn[$i]] . "', 
				id: '" . $menuNames[$groupIn[$i]] . "',
				menu: new Ext.menu.Menu({
					items: [
						new Ext.menu.CheckItem(actions[" . $i . "]), 
						";
			$menuS = 1;
		} else {
			if ($groupIn[$i+1] == 1){
				//This is the end of a menu
				$toolbar .= "		new Ext.menu.CheckItem(actions[" . $i . "])
						]
					})
				});\n";
				$menuS = 0;
			} else {
				//Normal menu item
				$toolbar .= "		new Ext.menu.CheckItem(actions[" . $i . "]),
				";
			}
		}
	}
}
print $toolbar;	
print "
return [toolbarItems, actions, actionArr, groupIn, actionText, actionGroup];
}

function sessionStarter() {
";
session_start();
print "
var session_id2 = '" . session_id() . "';";
print "
return [session_id2];
}
";
?>