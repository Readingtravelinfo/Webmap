<?php
//Relative path to yout image directory
$dirpath = "../../sitesheets";
$folders = scandir($dirpath);
$type = $_GET['type'];
$filterby = $_GET['filterby'];
$filterval = $_GET['filterval'];
if ($filterval == ""){
	$filterby = "no filter";
}
if ($type == 1){
	$filtFold = [];
	if($filterby=='ref'){
		for($i=0;$i<count($folders);$i++) {
			if(strtolower($folders[$i])== strtolower($filterval)){
				array_push($filtFold,$folders[$i]);
			}
		}
	} else {
		$filtFold = $folders;
	}

	for($i=0;$i<count($filtFold);$i++) {
		if($i==0){
			print $filtFold[$i];
		} else {
			print "|" . $filtFold[$i];
		}
	}
} else {
	// attempt a connection
	include '../functions/housekeeping.php';
	
	if($filterby=='otu'){
		$qstr = "select * from jt_sitelookup where otu_ref = '" . strtoupper($filterval) . "' order by site_ref ASC;";
	} else {
		$qstr = "select * from jt_sitelookup order by site_ref ASC;";
	}
	
	$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
	$res = pg_query($dbconn, $qstr) or die('Query failed: ' . pg_last_error());
	
	$loops = pg_num_rows($res);
	for($i=0;$i<$loops;$i++){
		if($i==0){
			print pg_fetch_result($res,$i,1) . "-" . pg_fetch_result($res,$i,2);
		} else {
			print "|" . pg_fetch_result($res,$i,1) . "-" . pg_fetch_result($res,$i,2);
		}
	}
}
?>