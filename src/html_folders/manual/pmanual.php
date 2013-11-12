<?php 

// Variable read in from config.xml file
$manID = $_GET['manID'];
if (file_exists($manID)) {
    $xml = simplexml_load_file($manID);
}

$refID = $_GET['refID'];

print $xml->$refID;

?>