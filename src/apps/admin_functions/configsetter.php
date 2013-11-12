<?php
$doc = new DOMDocument();
$xmlString = $_POST['xml'];
$location = 'D:\\webserver\\rbc_internet\\' . $_POST['loc'];
$doc->loadXML($xmlString);
$doc->save($location . 'config.xml');

//Next we copy the required files to the folder
$source1 = 'D:\\webserver\\rbc_internet\\RBC\\set\\index.html';
$source2 = 'D:\\webserver\\rbc_internet\\RBC\\set\\blank.html';
copy($source1, $location . 'index.html');
copy($source2, $location . 'blank.html');
?>