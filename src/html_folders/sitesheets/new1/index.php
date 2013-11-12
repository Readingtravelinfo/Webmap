<?php
//Relative path to this file
$dirpath = "./";
$folder = opendir($dirpath);

$siteref = $_SERVER["REQUEST_URI"];
$siteref = substr($siteref ,0, strlen($siteref)-1);
$siteref = substr($siteref, strrpos($folder,"/")+1);
$siteref = substr($siteref,11);

$file_types = array("jpg", "JPG", "PNG", "png", "DOC", "doc", "PDF", "pdf", "DWF", "dwf", "DXF", "dxf", "SHP", "shp", "DOCX", "docx", "XLS", "xls", "XLSM", "xlsm", "XLSX", "xlsx", "vso");
$filet_names = array("Image File","Image File","Image File","Image File","MS Office 2003 or below","MS Office 2003 or below","PDF","PDF","AutoCAD","AutoCAD","AutoCAD","AutoCAD","GIS","GIS","MS Office 2007 or greater", "MS Office 2007 or greater","MS Office 2003 or below","MS Office 2003 or below","MS Office 2007 or greater","MS Office 2007 or greater","MS Office 2007 or greater","MS Office 2007 or greater", "VISO");
$index = array();
 
print "
<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"
    \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">

<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">
<head><title>Site Information for Site " . strtoupper($siteref) . "</title>
<!-- Ext resources -->
<script src=\"../../apps/ext/adapter/ext/ext-base.js\"></script>
<script src=\"../../apps/ext/ext-all-debug.js\"></script> 
<link rel=\"stylesheet\" type=\"text/css\" href=\"../../apps/ext/resources/css/ext-custom.css\"></link>
<script src=\"../../apps/secit/secit.js\"></script> <!--Important, this must be in this order-->
<link href=\"../../apps/jquery/css/cupertino/jquery-ui-1.10.3.custom.css\" rel=\"stylesheet\">
<script src=\"../../apps/jquery/jquery-1.9.1.js\"></script>
<script src=\"../../apps/jquery/jquery-ui-1.10.3.custom.js\"></script>
<style type=\"text/css\">
        .auto-width-tab-strip ul.x-tab-strip {
            width: auto;
        }
    </style>
<script>

var tabs, tabH;
var filesTabH, notesTabH, siteSummaryH, siteRMSH, siteDH, siteUTCH, pUpgradeH, hUpgradeH;
Ext.onReady(function () {
    tabs = new Ext.TabPanel({
		renderTo: container,
		activeTab: 0,
		autoHeight: true,
		deferredRender: false,
		items: [{
			title: 'Files',
			id: 'filesTab',
			html: ''
		},{
			title: 'Notes',
			id: 'notesTab',
			html: ''
		},{
		    title: 'Site Summary',
			id: 'siteSummary',
			html: ''
		}],
	});
	
});

//Declare the server returned variables here
var item = [];
var itemT = [];
var fullPath = [];
";

//Loop through the images in the directory
$itemt = array();
while ($file = readdir ($folder)) {
  if(in_array(substr(strtolower($file), strrpos($file,".") + 1),$file_types))
	{                       
		$items[] = $file; 
		print "item.push('" . $file . "');
		";
		for($i-0;$i<count($filet_names);$i++){
			if(substr(strtolower($file), strrpos($file,".") + 1)==$file_types[$i]){
				array_push($itemt, $filet_names[$i]);
				print "itemT.push('" . $filet_names[$i] . "');
				";
			}
		}
	}
}

$filepath = array();
for($i=0; $i<sizeof($items); $i++) {
	array_push($filepath, "'" . $dirpath . "/" . $items[$i] . "'");
	print "fullPath.push('" . $dirpath . "/" . $items[$i] . "');
	";
}
	
print "
var siteRef = '" . $siteref . "';
</script>
<script src=\"../../apps/site/site_scripts2.js\"></script>
<link href=\"../../apps/site/rainbow.css\" rel=\"stylesheet\">
</head>
<body onload=\"runSetup()\">
<!--<div id=\"site_basics\" style=\"position: relative; height:300px\"></div>
<div id=\"container\" style=\"position: relative; height:500px\"></div>
<div id=\"site_controls\"><div>-->
<table align=\"left\" width=\"100%\" id=\"dataTable\" cellspacing=\"1\" class=\"mainS0\">
  <tr>
    <td colspan=\"2\" valign=\"top\" id=\"site_basics\" name=\"site_basics\"></td>
  </tr>
  <tr>
    <td colspan=\"2\" valign=\"top\" id=\"site_content\" name=\"site_content\"><div id=\"container\" class=\"auto-width-tab-strip\"></div></td>
    <td align=\"center\" valign=\"top\" width=\"48%\" bgcolor=\"#FFFFFF\" id=\"site_A\" name=\"site_A\" style=\"display:none\"></td>
    <td align=\"center\" valign=\"top\" width=\"48%\" bgcolor=\"#FFFFFF\" id=\"site_B\" name=\"site_B\" style=\"display:none\"></td>
  </tr>
  <tr>
    <td colspan=\"2\" valign=\"top\" id=\"site_controls\" height=\"40\" name=\"site_controls\"></td>
  </tr>
</table>
<input type='hidden' id='username' name='username' value='' />
<iframe style=\"visibility: hidden\" src=\"blank.html\" name=\"loader\" width=\"1px\" height=\"1px\" id=\"loader\" onload=\"loginScript(1);\" />
</body>
</html>
"; 
closedir($folder);
?>