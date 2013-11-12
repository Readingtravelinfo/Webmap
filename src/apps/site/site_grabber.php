<?php 
// attempt a connection
include '../../apps/functions/housekeeping.php';
ini_set('error_reporting', E_ALL & ~E_NOTICE);  //Stop logging notices for this script
$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());

$site = $_GET['site_ref'];
$refF = $_GET['refF'];
$table = $_GET['tabname'];
$qtype = $_GET['qtype'];
$sortby = $_GET['sortby'];
if ($sortby!=null && $sortby!=''){
	$queryStr = "SELECT * FROM " . pg_escape_identifier($table) . " WHERE " . $refF . " = '" . $site . "' ORDER BY " . pg_escape_identifier($sortby) . " ASC";
} else {
	$queryStr = "SELECT * FROM " . pg_escape_identifier($table) . " WHERE " . $refF . " = '" . $site . "'";
}
$res = pg_query($dbconn, $queryStr) or die('Query failed: ' . pg_last_error());
$colNo = pg_num_fields($res);
$rowNo = pg_num_rows($res);

$return_array = array();
//Loop through the returned record and output javascript variables
for ($i=0;$i<$rowNo;$i++){
	for ($i2=0;$i2<$colNo;$i2++){
		if ($qtype=='fname'){
			array_push($return_array,str_replace(",", "##", pg_field_name($res,$i2)));
		} else {
			array_push($return_array,str_replace(",", "##", pg_fetch_result($res,$i,$i2)));
		}
	}
}
echo json_encode($return_array);

pg_free_result($res);
pg_close($dbconn);
?>