<?php
$imageURLStr = $_GET['imageURLStr'];

//Relative path to yout image directory
$dirpath = "../../" . $imageURLStr;

//Website URL to that same image directory
$projectPath = $_SERVER['HTTP_REFERER'];
if (substr($projectPath, 0, 9)=="https://g") {
	//External address 
	$projectPath = substr($projectPath,36);
} else {
	//Internal address
	$projectPath = substr($projectPath,18);
}

$dirURL = $projectPath . $imageURLStr;

$folder = opendir($dirpath);
$pic_types = array("jpg", "jpeg", "JPG", "PNG", "png", "TIF", "tif");
$alttag = "";
$websiteurl= "";
$caption = "";
$index = array();
 
//Loop through the images in the directory
while ($file = readdir ($folder)) {
  if(in_array(substr(strtolower($file), strrpos($file,".") + 1),$pic_types))
	  {                       
	  $items[] = $file;   
	}
}
//each time it loads it shuffles the images
shuffle($items);
for($i=0; $i<sizeof($items); $i++) {
  $picpath = $dirpath . "/" . $items[$i];
  $exif = exif_read_data($picpath, 'EXIF');
  $alttag = $exif['Title']; //alt tag
  $websiteurl= $exif['Subject']; //website url
  $caption = $exif['Comments']; //caption
 
//Build the html code based on the metadata
  $imageArray .= $picpath . "|";
	 
  $alttag = "";
  $websiteurl= "";
  $caption = "";
  $varimages =  $varimages . "";
 }
closedir($folder);
 
print $imageArray;
?>