<?php
// attempt a connection
include 'housekeeping.php';
$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());

$listid = $_GET['listid'];

if ($listid == 'NA'){
	//This function simply returns the listid of the selected workType
	$workType = $_GET['workType'];
	
	$query = "SELECT listid FROM jt_workstype WHERE workstype = " . $workType . ";";
	$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
	
	//We simply return the first value, there shouls only be one here
	print pg_fetch_result($res,$i,0);
} elseif ($listid == 'NA2') {
	//This function returns the current status value
	$table = $_GET['table'];
	$gid = $_GET['gid'];
	
	$query = "SELECT worksstatus FROM " . pg_escape_string($table) . " WHERE gid = " . $gid . ";";
	$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
	
	//We simply return the first value, there shouls only be one here
	print pg_fetch_result($res,$i,0);
} elseif ($listid == 'NA3') {
	//This function returns the current status value
	$table = $_GET['table'];
	$gid = $_GET['gid'];
	
	$query = "SELECT icon FROM " . pg_escape_string($table) . " WHERE gid = " . $gid . ";";
	$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
	
	//We simply return the first value, there shouls only be one here
	print pg_fetch_result($res,$i,0);
} elseif (substr($listid,0,4) == 'NA-L') {
	//This function returns the icon options
	$listid = substr($listid,4,strlen($listid)-4); //Remove the text at the start and grab the listid
	$query = "SELECT icon FROM jt_worksicon WHERE listid = " . $listid . " ORDER BY sortid ASC;";
	$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
	$tabRows = pg_num_rows($res);
	for ($i=0;$i<$tabRows;$i++){
		if ($i==0){
			print pg_fetch_result($res,$i,0);
		} else {
			print "|" . pg_fetch_result($res,$i,0);
		}
	}
} else {
	//This function returns the status options
	$query = "SELECT worksstatus FROM jt_worksstatus WHERE listid = " . $listid . " ORDER BY sortid ASC;";
	$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
	$tabRows = pg_num_rows($res);
	for ($i=0;$i<$tabRows;$i++){
		if ($i==0){
			print pg_fetch_result($res,$i,0);
		} else {
			print "|" . pg_fetch_result($res,$i,0);
		}
	}
}
?>