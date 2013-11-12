<?php 
// attempt a connection
include '../../apps/functions/housekeeping.php';
ini_set('error_reporting', E_ALL & ~E_NOTICE);  //Stop logging notices for this script
$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());

$table = 'trafficsites';
$gidVal = $_GET['gid'];
$easting = $_GET['easting'];
$northing = $_GET['northing'];
$mod_by = $_GET['mod_by'];

//At this point we need to save a copy to the backup table
//Download the existing record
$query = 'SELECT * FROM ' . pg_escape_identifier($table) . ' WHERE gid = ' . $gidVal . ';';
$bk = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());

//Save it to the backup table
//Generate the refStr from the previous query
$bkcolNo = pg_num_fields($bk);
$j = 0;
while ($b < $bkcolNo) {
	$type = pg_field_type($bk, $b);
	$valStr = pg_fetch_result($bk, 0, $b);
	if ($valStr=='') {
		$valStr = "NULL";
	}
	
	if ($b==0) {
		$refStr2 = pg_field_name($bk, $b);
		if ($type == 'bool') {
			if ($valStr == 'NULL') {
				$refStr3 = "" . $valStr . "";
			} else {
				$refStr3 = "'" . $valStr . "'";
			}
		} elseif ($type=='geometry') {
			$refStr3 = "'" . $valStr . "'";
		} elseif (is_numeric(strpos($type, "int"))) {
			$refStr3 = $valStr;
		} elseif (is_numeric(strpos($type, "float"))) {
			$refStr3 = $valStr;
		} elseif (is_numeric(strpos($type, "double"))) {
			$refStr3 = $valStr;
		} elseif (is_numeric(strpos($type, "serial"))) {
			$refStr3 = $valStr;
		} else {
			if ($valStr == 'NULL') {
				$refStr3 = "" . $valStr . "";
			} else {
				$refStr3 = "'" . $valStr . "'";
			}
		}
	} else {
		$refStr2 .= "," . pg_field_name($bk, $b);
		if ($type == 'bool') {
			if ($valStr == 'NULL') {
				$refStr3 .= "," . $valStr . "";
			} else {
				$refStr3 .= ",'" . $valStr . "'";
			}
		} elseif ($type=='geometry') {
			$refStr3 .= ",'" . $valStr . "'";
		} elseif (is_numeric(strpos($type, "int"))) {
			$refStr3 .= "," . $valStr;
		} elseif (is_numeric(strpos($type, "float"))) {
			$refStr3 .= "," . $valStr;
		} elseif (is_numeric(strpos($type, "double"))) {
			$refStr3 .= "," . $valStr;
		} elseif (is_numeric(strpos($type, "serial"))) {
			$refStr3 .= "," . $valStr;
		} else {
			if ($valStr == 'NULL') {
				$refStr3 .= "," . $valStr . "";
			} else {
				$refStr3 .= ",'" . $valStr . "'";
			}
		}
	}
	$b = $b + 1;
}

if (strpos($table, ";") === false && strpos($table, "'") === false && strpos($table, "\"") === false) {
	$dynqstr2 = "INSERT INTO bk_" . $table . " (" . $refStr2 . ") VALUES (" . $refStr3 . ");";
} else {
	$dynqstr2 = "Delibrate fail, you may not have a ; or \" or ' in a table name";
}
//Run the query
$errorlog = "";
$bk2 = pg_query($dbconn, $dynqstr2) or $errorlog = pg_last_error();
pg_free_result($bk);
pg_free_result($bk2);

if($errorlog == ""){
	//OK, this should mean that the backup was successful, now we must construct and run the update command
	$queryStr = "UPDATE " . pg_escape_identifier($table) . " SET the_geom = ST_GeomFromText('POINT(" . $easting . " " . $northing . ")', 27700), mod_by = '" . $mod_by . "', mod_date = now() WHERE gid = " . $gidVal . ";";
	$res = pg_query($dbconn, $queryStr) or $errorlog = pg_last_error();
	
	if ($errorlog!=""){
		print "Update Failed";
	} else {
		print "OK";
	}
} else {
	print "Backup Failed";
}

?>