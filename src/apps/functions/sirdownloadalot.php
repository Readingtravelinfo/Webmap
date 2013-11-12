<?php

//Pick up the posted value
$fileInput = $_POST['sdalval'];
$fileName = $_POST['sdalval2'];
$fileType = $_POST['sdalval3'];

//Write as a Text/XML file
header('Content-type: ' . $fileType);
header("Content-Disposition: attachment; filename=" . $fileName);
echo $fileInput;
?>