<?php
$ip = $_SERVER['REMOTE_ADDR'];
//internal addresses
if (substr($ip, 0, 7) == "64.5.1.") {
	$urlLink = "https://64.5.1.218/";
} else {
	//any other IP addresses
	$urlLink = "https://geo.reading-travelinfo.co.uk/";
}
 
print "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"
    \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">

<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">

<head>
  <title>Reading Borough Council Mapping</title>
  <script type=\"text/javascript\" src=\"../apps/secit/secit.js\"></script> <!--Important, this must be in this order-->
  <script>
	function tabEd(){
		var urlStr;
		var tabedsel = document.getElementById('tabed');
		var tabedval = tabedsel[tabedsel.selectedIndex].value;
		if(tabedval!==1){
			//We need to generate a URL and update to the correct page
			if (tabedval==='siteworks'){
				urlStr = '"; 
				print $urlLink;
				print "rbc/tableedits/index.html?table=' + tabedval + '&order=gid&geomF=other_geom&title=Blah&lookup=0&geo=No&lookup=targetCol^worksstatus~workstype~icon^replaceCol^worksstatus~workstype~icon^replaceTable^jt_worksstatus~jt_workstype~jt_worksicon^targetList^1~-';
			} else {
				urlStr = '"; 
				print $urlLink;
				print "rbc/tableedits/index.html?table=' + tabedval + '&order=gid&geomF=other_geom&title=Blah&lookup=0&geo=No&tabF=0';
			}
			document.location = urlStr;
		}
	}
  </script>
</head>

<body>
<h3>Welcome to the Reading Borough Council Transport Team Mapping Portal</h3>
<b><i><font color=\"#800000\">WARNING! This area of the site is for RBC staff only and you will need to log in view the layers.</font></i></b>
<p>If you are a contractor working for RBC please speak with a member of the transport team regarding access to this area and you will be provided with a username and password should your request be accepted.</p>
<p>There are also a number of layers available as Open Data, more information on these layers will be added in due course</p>
<h4>Open Layer Applications</h4>
<ul type=\"square\">
  <li><a href=\""; 
  print $urlLink;
  print "cycling\" title=\"Cycle Stands\">Cycle Stands Viewer</a></li>
</ul>
<h4>GeoServer Manager</h4>
<p>Please use this link to manage the GeoServer layers; you will need an administrator login to manage layers. <br />
<a href=\"";  
  print $urlLink;
  print "geoserver/web\" target=\"_blank\" title=\"Log In\">Please click here to log in</a></p>
<h4>Maps</h4>
<p><u><b>Viewer Maps</b></u>
<ul type=\"circle\">
  <li><a href=\"";  
  print $urlLink;
  print "rbc/utcviewer\" title=\"UTC Data Viewer\">UTC Data Viewer</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/trafficsitesviewer\" title=\"Traffic Sites\">Traffic Sites Viewer</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/broadbandviewer\" title=\"Broadband Upgrade Viewer\">Broadband Upgrade Viewer</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/parkmapviewer\" title=\"Parkmap Viewer (TRO data)\">ParkMap Viewer</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/publictransport\" title=\"Bus Stop and Display Viewer\">Bus Stop and Display Viewer</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/ptpprogress\" title=\"PTP Progress Map\">Residential PTP Progress Viewer</a></li>
</ul>
*Items listed above are accessible to all RBC staff using the RBC login<br /><br />

<u><b>Manager Maps</b></u>
<ul type=\"circle\">
  <li><a href=\"";  
  print $urlLink;
  print "rbc/utcdata\" title=\"UTC Data Manager\">UTC Data Manager</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/trafficsites\" title=\"Traffic Sites\">Traffic Sites Manager</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/siteupgrades\" title=\"Traffic Site Upgrades\">Traffic Site Upgrades Manager</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/cycling\" title=\"Cycle Stands\">Cycle Stand Manager</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/parkmap\" title=\"Parkmap Manager (TRO data)\">ParkMap Manager</a></li>
  <li><a href=\"";  
  print $urlLink;
  print "rbc/parkingstart\" title=\"Parking Enforcement Manager\">Parking Enforcement Manager</a></li>
</ul>
*Items listed above require you to have a permitted username</p>

<h4>Table Editor</h4>
<p>The following options to select a lookup table to edit: <br />
<select id='tabed' name='tabed' style='width: 204px'>
	<option value='1' selected='selected'>Please select a table</option>
	<option value='jt_worksstatus'>jt_worksstatus</option>
	<option value='jt_workstype'>jt_workstype</option>
	<option value='jt_worksicon'>jt_worksicon</option>
	<option value='jt_sitelookup'>jt_sitelookup</option>
</select><br />
<input type='button' onclick='tabEd()' value='Open Table' />
  
</body>
</html>
"; 

?>