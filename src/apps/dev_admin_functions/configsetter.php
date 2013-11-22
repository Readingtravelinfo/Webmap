<?php
//Create or replace the config.xml file in the relevant directory (assuming Javascript string is valid XML)
$xmlString = $_POST['xml'];
$location = 'D:\\webserver\\rbc_internet\\' . $_POST['loc'];
$filename = $location . 'config.xml';
file_put_contents($filename, $xmlString);

//Next we copy the required files to the folder
$source1 = 'D:\\webserver\\rbc_internet\\RBC\\dev\\index.html'; //Please note, this value is different for dev version
$source2 = 'D:\\webserver\\rbc_internet\\RBC\\set\\blank.html';
copy($source1, $location . 'index.html');
copy($source2, $location . 'blank.html');
?>