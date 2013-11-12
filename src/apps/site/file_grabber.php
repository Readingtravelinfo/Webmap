<?php
$projectPath = $_SERVER['HTTP_REFERER'];
if (substr($projectPath, 0, 9)=="https://g") {
	//External address 
	$projectPath = substr($projectPath,0,36);
} else {
	//Internal address
	$projectPath = substr($projectPath,0,18);
}

$file_types = array("jpg", "jpeg", "png", "tif", "pdf", "doc", "docx", "xls", "xlsx", "xlsm", "shp", "dwg", "dxf", "vsd");
$type_names = array("Image", "Image", "Image", "Image", "Adobe", "Office 2003", "Office 2007+", "Office 2003", "Office 2007+", "Office 2007+", "GIS", "AutoCAD", "AutoCAD", "Viso");

$site = $_GET['siteref'];
$otu = $_GET['oturef'];
$RMS = $_GET['rms'];

//Relative path to yout image directory
$dirpath1 = $projectPath . "/utcdata/publicsites/" . $otu;
$relpath1 = "../../../../ReadingUTC/publicsites/" . $otu;
$dirpath2 = $projectPath . "/sitesheetsview/" . $site;
$relpath2 = "../../sitesheetsview/" . $site;

$itemTypes1 = array();
$itemTypes2 = array();
//OK, we need to check both folders but ignore the OTU folder if this is an RMS site
if ($otu != "X" && $RMS == 0){
	//This is not an RMS site so check the OTU folder
	$folder1 = opendir($relpath1);
	
	//Loop through the files in the directory
	while ($file = readdir ($folder1)) {
		if(in_array(substr(strtolower($file), strrpos($file,".") + 1),$file_types)){                       
			$items1[] = $file;  
			array_push($itemTypes1,$type_names[array_search(substr(strtolower($file), strrpos($file,".") + 1),$file_types)]);
		}
		//special case for *.8 files need to be wild after the 8
		$fullExt = substr(strtolower($file), strrpos($file,".") + 1);
		$leftOne = substr($fullExt,0,1);
		if($leftOne=="8"){ 
			$items1[] = $file;  
			array_push($itemTypes1,".8");
		}
	}
	
	//List UTC Site Drawings
	$found = 0;
	$i = 0;
	while ($i < count($items1)) {
		if (strpos(strtolower($items1[$i]),"drawing")!=false) {
			if ($found==0){
				print "<b><i>OTU Drawings</i></b><br />";
			}
			print "<a href='" . $dirpath1 . "/" . $items1[$i] . "' target='_blank'>" . $items1[$i] . "</a><br />";
			$found = 1;
		}
		$i = $i + 1;
	}
	
	//List UTC Site Office
	$found = 0;
	$i = 0;
	while ($i < count($items1)) {
		if ($itemTypes1[$i]=="Office 2003" || $itemTypes1[$i]=="Office 2007+") {
			if ($found==0){
				print "<b><i>OTU Documents</i></b><br />";
			}
			print "<a href='" . $dirpath1 . "/" . $items1[$i] . "' target='_blank'>" . $items1[$i] . "</a><br />";
			$found = 1;
		}
		$i = $i + 1;
	}
	
	//List UTC Site Other
	$found = 0;
	$i = 0;
	while ($i < count($items1)) {
		if ($itemTypes1[$i]!="Office 2003" && $itemTypes1[$i]!="Office 2007+" && strpos(strtolower($items1[$i]),"drawing")==false) {
			if ($found==0){
				print "<b><i>Other OTU Documents</i></b><br />";
			}
			print "<a href='" . $dirpath1 . "/" . $items1[$i] . "' target='_blank'>" . $items1[$i] . "</a><br />";
			$found = 1;
		}
		$i = $i + 1;
	}
} 

if ($RMS == 1){
	//Loop through the images in the directory
	$folder2 = opendir($relpath2);
	while ($file = readdir ($folder2)) {
		if(in_array(substr(strtolower($file), strrpos($file,".") + 1),$file_types)){                       
			$items2[] = $file; 
			array_push($itemTypes2,$type_names[array_search(substr(strtolower($file), strrpos($file,".") + 1),$file_types)]);	  
		}
		//special case for *.8 files need to be wild after the 8
		$fullExt = substr(strtolower($file), strrpos($file,".") + 1);
		$leftOne = substr($fullExt,0,1);
		if($leftOne=="8"){ 
			$items2[] = $file;  
			array_push($itemTypes2,".8");
		}
	}
	
	//List Site Files
	$found = 0;
	$i = 0;
	while ($i < count($items2)) {
		if (strpos(strtolower($items2[$i]),"drawing")==false) {
			if ($found==0){
				print "<b><i>Site Files</i></b><br />";
			}
			print "<a href='" . $dirpath2 . "/" . $items2[$i] . "' target='_blank'>" . $items2[$i] . "</a><br />";
			$found = 1;
		}
		$i = $i + 1;
	}
	
	//List Site Drawings
	$found = 0;
	$i = 0;
	while ($i < count($items2)) {
		if (strpos(strtolower($items2[$i]),"drawing")!=false) {
			if ($found==0){
				print "<b><i>Site Drawings</i></b><br />";
			}
			print "<a href='" . $dirpath2 . "/" . $items2[$i] . "' target='_blank'>" . $items2[$i] . "</a><br />";
			$found = 1;
		}
		$i = $i + 1;
	}
}
?>