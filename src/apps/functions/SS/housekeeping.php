<?php

//database access information
//require_once("DB.php");
$host = "127.0.0.1";
$user = "postgres";
$pass = "PwutmC29bR0CK";
$db = "postgis";
$port = "5432";
$schema = "public";
$table = 'cycleracks';
$conn_string = "host=" . $host . " dbname=" . $db ." user=" . $user . " password=" . $pass . " port=" . $port;

//open a connection to the database server
$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());

?>
