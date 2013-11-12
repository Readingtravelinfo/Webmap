<?php
// attempt a connection
include 'housekeeping.php';

//Pick up the posted value
$table = $_GET['table'];
$function = $_GET['function'];
$filter = $_GET['filter'];
$recNo = $_GET['recNo'];
$lower = $_GET['lower'];
$status = $_GET['status'];
$gid = $_GET['gid'];
$sid = $_GET['sid'];
$mod_by = $_GET['mod_by'];
$projMap = $_GET['geom'];

//Forward on if a special table
$table = $table;
$sid = $sid;

//Set res to be filled with the records from the main table.
$query = "SELECT * FROM " . pg_escape_identifier($table) . ";";
$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
$colNo = pg_num_fields($res);

//Query
if ($projMap == "27700"){
	$projMap = "osgb";
} else {
	$projMap = "wgs";
}
$pointTab = "uepoint" . $projMap; 
$query1 = "SELECT gid, the_geom, ST_AsText(the_geom) as the_geometry, editrec, sid FROM " . pg_escape_identifier($pointTab) . " WHERE sid=" . pg_escape_literal($sid) . ";";
$res1 = pg_query($dbconn, $query1) or die('Query failed: ' . pg_last_error());
$lineTab = "ueline" . $projMap;
$query = "SELECT gid, the_geom, ST_AsText(the_geom) as the_geometry, editrec, sid FROM " . pg_escape_identifier($lineTab) . " WHERE sid=" . pg_escape_literal($sid) . ";";
$res2 = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
$polygonTab = "uepolygon" . $projMap;
$query = "SELECT gid, the_geom, ST_AsText(the_geom) as the_geometry, editrec, sid FROM " . pg_escape_identifier($polygonTab) . " WHERE sid=" . pg_escape_literal($sid) . ";";
$res3 = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
$spolygonTab = "uespolygon" . $projMap;
$query = "SELECT gid, the_geom, ST_AsText(the_geom) as the_geometry, editrec, sid FROM " . pg_escape_identifier($spolygonTab) . " WHERE sid=" . pg_escape_literal($sid) . ";";
$res4 = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());

//Now we need to work out which of these has records and store the relavant details into javascript variables.
$pointsNo = pg_num_rows($res1);
$linesNo = pg_num_rows($res2);
$polygonsNo = pg_num_rows($res3);
$spolygonsNo = pg_num_rows($res4);
$totalIt = $pointsNo + $linesNo + $polygonsNo + $spolygonsNo;
$resNo = pg_num_rows($res);

//How many rows / columns?
$colNo1 = pg_num_fields($res1);

//We pick the records from the temporary tables using the sid then check if a record is editing or new based on the
//editrec field. If this is an edit then this field will contain a gid otherwise it will be ''. 

//Loop through each temporary table and pick up the geometries and create the javascript arrays 
print "
var gidArray = [];
var geomArray = [];
var geometryArray = [];
var geomTarray = [];
var tmpgidA = [];
var tmptableA = [];
";
for ($i=0;$i<$colNo;$i++){
	print "col" . pg_field_name($res,$i) . " = [];
	";
	if(pg_field_name($res,$i)=='gid') {
		$gidInt = $i;
	}
}

for ($i=0;$i<$pointsNo;$i++){
	$j = 0;
	while ($j < $colNo1) {
		if (pg_field_name($res1,$j)=='editrec'){
			if (pg_fetch_result($res1,$i,$j)>0){
				//There is a gid provided - this is an edit
				print "gidArray.push(" . pg_fetch_result($res1,$i,$j) . ");
				";
				for ($i2=0;$i2<$resNo;$i2++){
					if (pg_fetch_result($res,$i2,$gidInt)==pg_fetch_result($res1,$i,$j)) {
						for ($i3=0;$i3<$colNo;$i3++){
							$fieldNam = pg_field_name($res,$i3);
							print "col" . $fieldNam . ".push('" . pg_fetch_result($res,$i2,$i3) . "');
							";
						}
					}
				}
			} else {
				//There is no gid - this is an insert
				print "gidArray.push('');
				";
				for ($i3=0;$i3<$colNo;$i3++){
					$fieldNam = pg_field_name($res,$i3);
					print "col" . $fieldNam . ".push('');
					";
				}
			}
		} elseif (pg_field_name($res1,$j)=='gid') {
			//This is the tmpgid
			print "tmpgidA.push('" . pg_fetch_result($res1,$i,$j) . "');";
		} elseif (pg_field_name($res1,$j)=='the_geom') {
			print "geomArray.push('" . pg_fetch_result($res1,$i,$j) . "');
			";
		} elseif (pg_field_name($res1,$j)=='the_geometry') {
			print "geometryArray.push('" . pg_fetch_result($res1,$i,$j) . "');
			geomTarray.push('Point');
			";
		}
		$j = $j + 1;
	}
	print "tmptableA.push('" . $pointTab . "');";
}

for ($i=0;$i<$linesNo;$i++){
	$j = 0;
	while ($j < $colNo1) {
		if (pg_field_name($res2,$j)=='editrec'){
			if (pg_fetch_result($res2,$i,$j)>0){
				//There is a gid provided - this is an edit
				print "gidArray.push(" . pg_fetch_result($res2,$i,$j) . ");
				";
				for ($i2=0;$i2<$resNo;$i2++){
					if (pg_fetch_result($res,$i2,$gidInt)==pg_fetch_result($res2,$i,$j)) {
						for ($i3=0;$i3<$colNo;$i3++){
							$fieldNam = pg_field_name($res,$i3);
							print "col" . $fieldNam . ".push('" . pg_fetch_result($res,$i2,$i3) . "');
							";
						}
					}
				}
			} else {
				//There is no gid - this is an insert
				print "gidArray.push('');
				";
				for ($i3=0;$i3<$colNo;$i3++){
					$fieldNam = pg_field_name($res,$i3);
					print "col" . $fieldNam . ".push('');
					";
				}
			}
		} elseif (pg_field_name($res2,$j)=='gid') {
			//This is the tmpgid
			print "tmpgidA.push('" . pg_fetch_result($res2,$i,$j) . "');";
		} elseif (pg_field_name($res2,$j)=='the_geom') {
			print "geomArray.push('" . pg_fetch_result($res2,$i,$j) . "');
			geomTarray.push('Line');
			";
		} elseif (pg_field_name($res1,$j)=='the_geometry') {
			print "geometryArray.push('" . pg_fetch_result($res2,$i,$j) . "');
			";
		}
		$j = $j + 1;
	}
	print "tmptableA.push('" . $lineTab . "');";
}

for ($i=0;$i<$polygonsNo;$i++){
	$j = 0;
	while ($j < $colNo1) {
		if (pg_field_name($res3,$j)=='editrec'){
			if (pg_fetch_result($res3,$i,$j)>0){
				//There is a gid provided - this is an edit
				print "gidArray.push(" . pg_fetch_result($res3,$i,$j) . ");
				";
				for ($i2=0;$i2<$resNo;$i2++){
					if (pg_fetch_result($res,$i2,$gidInt)==pg_fetch_result($res3,$i,$j)) {
						for ($i3=0;$i3<$colNo;$i3++){
							$fieldNam = pg_field_name($res,$i3);
							print "col" . $fieldNam . ".push('" . pg_fetch_result($res,$i2,$i3) . "');
							";
						}
					}
				}
			} else {
				//There is no gid - this is an insert
				print "gidArray.push('');
				";
				for ($i3=0;$i3<$colNo;$i3++){
					$fieldNam = pg_field_name($res,$i3);
					print "col" . $fieldNam . ".push('');
					";
				}
			}
		} elseif (pg_field_name($res3,$j)=='gid') {
			//This is the tmpgid
			print "tmpgidA.push('" . pg_fetch_result($res3,$i,$j) . "');";
		} elseif (pg_field_name($res3,$j)=='the_geom') {
			print "geomArray.push('" . pg_fetch_result($res3,$i,$j) . "');
			geomTarray.push('Polygon');
			";
		} elseif (pg_field_name($res1,$j)=='the_geometry') {
			print "geometryArray.push('" . pg_fetch_result($res3,$i,$j) . "');
			";
		}
		$j = $j + 1;
	}
	print "tmptableA.push('" . $polygonTab . "');";
}

for ($i=0;$i<$spolygonsNo;$i++){
	$j = 0;
	while ($j < $colNo1) {
		if (pg_field_name($res4,$j)=='editrec'){
			if (pg_fetch_result($res4,$i,$j)>0){
				//There is a gid provided - this is an edit
				print "gidArray.push(" . pg_fetch_result($res4,$i,$j) . ");
				";
				for ($i2=0;$i2<$resNo;$i2++){
					if (pg_fetch_result($res,$i2,$gidInt)==pg_fetch_result($res4,$i,$j)) {
						for ($i3=0;$i3<$colNo;$i3++){
							$fieldNam = pg_field_name($res,$i3);
							print "col" . $fieldNam . ".push('" . pg_fetch_result($res,$i2,$i3) . "');
							";
						}
					}
				}
			} else {
				//There is no gid - this is an insert
				print "gidArray.push('');
				";
				for ($i3=0;$i3<$colNo;$i3++){
					$fieldNam = pg_field_name($res,$i3);
					print "col" . $fieldNam . ".push('');
					";
				}
			}
		} elseif (pg_field_name($res4,$j)=='gid') {
			//This is the tmpgid
			print "tmpgidA.push('" . pg_fetch_result($res4,$i,$j) . "');";
		} elseif (pg_field_name($res4,$j)=='the_geom') {
			print "geomArray.push('" . pg_fetch_result($res4,$i,$j) . "');
			geomTarray.push('sPolygon');
			";
		} elseif (pg_field_name($res1,$j)=='the_geometry') {
			print "geometryArray.push('" . pg_fetch_result($res4,$i,$j) . "');
			";
		}
		$j = $j + 1;
	}
	print "tmptableA.push('" . $spolygonTab . "');";
}

// Free resultset
pg_free_result($res);
pg_free_result($res1);
pg_free_result($res2);
pg_free_result($res3);
pg_free_result($res4);

// Closing connection
pg_close($dbconn);

print "var tempTval = '1';
var tempTableVal = '" . $table . "';
document.getElementById('blankDiv').innerHTML = '<img src=\"../../apps/functions/blank.jpg\" onload=\"geomEditForm(tempTval,tempTableVal)\" />'";
?>