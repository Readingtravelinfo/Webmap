<?php
// attempt a connection
include 'housekeeping.php';

$geom = $_GET["geomStr"];

//Grab the geometry as text
$tmpQ = "INSERT INTO geomcalcs (gid, the_geom) VALUES (DEFAULT, " . $geom . ") RETURNING gid;";
$dbconn2 = pg_connect($conn_string) or die('connection 2 failed' . pg_last_error());
$tmpQ2 = pg_query($dbconn2, $tmpQ) or $result = pg_last_error();
$gid1 = pg_fetch_result($tmpQ2,0,0);
$tmpQ = "SELECT the_geom FROM geomcalcs WHERE gid = " . $gid1 . ";";
$tmpQ3 = pg_query($dbconn2, $tmpQ) or $result = pg_last_error();
print pg_fetch_result($tmpQ3,0,0);
$tmpQ = "DELETE FROM geomcalcs WHERE gid = " . $gid1 . ";";
$tmpQ3 = pg_query($dbconn2, $tmpQ) or $result = pg_last_error();

?>