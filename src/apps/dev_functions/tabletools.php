<?php
// attempt a connection
include '../../apps/dev_functions/housekeeping.php';
ini_set('error_reporting', E_ALL & ~E_NOTICE);  //Stop logging notices for this script

// Variable read in from config.xml file
if (strpos($_SERVER['HTTP_REFERER'],"index.html?") != -1){
	$projectPath = substr($_SERVER['HTTP_REFERER'],0,strpos($_SERVER['HTTP_REFERER'],"index.html?")-1) . '/config.xml';
	print "var projectPath = '" . substr($_SERVER['HTTP_REFERER'],0,strpos($_SERVER['HTTP_REFERER'],"index.html?")-1) . "/';
	";
} else {
	$projectPath = $_SERVER['HTTP_REFERER'] . 'config.xml';
	print "var projectPath = '" . $_SERVER['HTTP_REFERER'] . "';
	";
}

if (substr($projectPath, 0, 9)=="https://g") {
	//External address 
	$projectPath = substr($projectPath,36);
} else {
	//Internal address
	$projectPath = substr($projectPath,18);
}
$projectPath = "../.." . $projectPath;
if (file_exists($projectPath)) {
    $xml = simplexml_load_file($projectPath);
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
print ");
";
print " 
var appTitle = '" . $xml->other->appTitle . "';
";
print "
Proj4js.defs[\"EPSG:27700\"] = \"+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs\";
Proj4js.defs[\"EPSG:4326\"] = \"+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs\";

var tableArray = [];
var tableTitles = [];
var tableGeomEdit = [];
var loadEdits = '" . $xml->other->edits . "';
var Ppath = '" . $xml->other->projectPath . "';
";

//We may have variable status fields here so we need to read the variable status table into a javascript array
//However, to save memory space we will only set up the variable here but get the values laters as an ajax call.
print "var vStatusVals = [];
";

print "fieldNamesMaster = [];
fieldRange =[];
";

//Define the dev_functions
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

?>