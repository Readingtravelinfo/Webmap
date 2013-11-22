<?php
$location = 'D:\\webserver\\rbc_internet\\' . $_POST['loc'];
$file = $location . 'users.xml';

//Get the permitted user array for this page
$xml = simplexml_load_file($file);
echo json_encode($xml->user);

?>