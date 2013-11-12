<?php
// attempt a connection
include 'housekeeping.php';
$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());

$table = $_GET['table'];
$fun = $_GET['fun'];
$i2 = 0;
if ($table != '' && $fun == 1) {
	//Get the fieldlist 
	// Deal with views Query
	if(strrpos($table, "_view")!=false){
		// Query
		$query = "SELECT * FROM " . pg_escape_identifier($table) . ";";
		$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
		$colNo = pg_num_fields($res);
		
		//Set up column arrays for this table
		for ($i=0;$i<$colNo;$i++){
			print "var col" . $i2 . pg_field_name($res,$i) . " = [];
			fieldNamesMaster.push('" . pg_field_name($res,$i) . "');
			fieldRange.push('" . $i2 . "');
			";
		}
		$i2 = $i2 + 1;
		// Free resultset
		pg_free_result($res);
		
		// 2nd Query
		$query = "SELECT * FROM " . pg_escape_identifier(substr($table,0,strrpos($table, "_view"))) . ";";
		$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
		$colNo = pg_num_fields($res);
		
		//Set up column arrays for this table
		for ($i=0;$i<$colNo;$i++){
			print "var col" . $i2 . pg_field_name($res,$i) . " = [];
			fieldNamesMaster.push('" . pg_field_name($res,$i) . "');
			fieldRange.push('" . $i2 . "');
			";
		}
		$i2 = $i2 + 1;
		// Free resultset
		pg_free_result($res);
	} else {
		// Query
		$query = "SELECT * FROM " . pg_escape_identifier($table) . ";";
		$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
		$colNo = pg_num_fields($res);
		
		//Set up column arrays for this table
		for ($i=0;$i<$colNo;$i++){
			print "var col" . $i2 . pg_field_name($res,$i) . " = [];
			fieldNamesMaster.push('" . pg_field_name($res,$i) . "');
			fieldRange.push('" . $i2 . "');
			";
		}
		$i2 = $i2 + 1;
		// Free resultset
		pg_free_result($res);
	}
}

if ($table != '' && $fun == 2) {
//Define the gid array
	$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
	print "var gidLookupToRow = [";
	$query1 = 'SELECT gid, mod_by FROM ' . pg_escape_identifier($table) . ' ORDER BY gid ASC ;';
	$res1 = pg_query($dbconn, $query1) or die('Query failed: ' . pg_last_error());
	$tabRows = pg_num_rows($res1);
	for ($i=0;$i<$tabRows;$i++){
		if ($i==0){
			print pg_fetch_result($res1,$i,0);
		} else {
			print ", " . pg_fetch_result($res1,$i,0);
		}
	}
	print "]; //gid lookup to row number
	";
	
	// Free resultset
	pg_free_result($res1);
	pg_close($dbconn);
}

if ($table != '' && $fun == 3) {
	//Lookup means from one table to another (i.e. S = Saved in another table)

	$targetCol = array(); 
	$targetTable = array();
	$targetList = array();
	$replaceCol = array();
	$replaceTable = array();
	$statusList = array();

	$lookups = explode("^", $_GET['lookup']);
	foreach($lookups as $opt1){
		if(strpos($opt1,"~") == ""){
			//This is a category 
			$currCat = $opt1;
			//Next loop should be the list
		} else {
			//This is the category list
			//explode the list
			$catList = explode("~", $opt1);
			//Process the list
			foreach($catList as $opt2){
				array_push($$currCat, $opt2);
			}
		}
	}
	$lookupColno = count($targetCol);

	//This should now have populated 3 out of four lookups, lets to the missing one now
	for ($i=0;$i<$lookupColno;$i++){
		array_push($targetTable, $table);
	}
	/*foreach ($xml->lookups->targetCol as $opt) {
		array_push($targetCol, $opt);
	}
	foreach ($xml->lookups->targetTable as $opt) {
		array_push($targetTable, $opt);
	}
	foreach ($xml->lookups->replaceCol as $opt) {
		array_push($replaceCol, $opt);
	}
	foreach ($xml->lookups->replaceTable as $opt) {
		array_push($replaceTable, $opt);
	}*/

	//In this version, the lookup above generates an options list
	$optionsListOp = array();
	$optionListNo = array();
	$optionListID = array();
	$optionsListCol = array();
	$optionsListColLoop = array();
	$optionListLink = array();
	//First we add any user added lists
	foreach ($xml->optionsList->optionsListOp as $opt) {
		array_push($optionsListOp, $opt);
		array_push($optionListID, "-");
	}
	foreach ($xml->optionsList->optionListNo as $opt) {
		array_push($optionListNo, intval($opt));
	}
	foreach ($xml->optionsList->optionsListCol as $opt) {
		array_push($optionsListCol, $opt);
		array_push($optionListLink, "-");
	}
	foreach ($xml->optionsList->optionsListColLoop as $opt) {
		array_push($optionsListColLoop, intval($opt));
	}
	//How many lists did the user add because our automatic lookups are built on top of these
	$optionsListColIt = count($optionsListCol);

	//Automatic lookups
	$statusValue = array();
	$statusAvail = array();
	$statusText = array();
	$statusTable = array();
	$statusField = array();

	//First we get the replacement values
	$i3 = 0;
	foreach ($replaceTable as $replaceTab){
		$qstr = "Select * from " . pg_escape_string($replaceTab) . ";";
		$resTmp = pg_query($dbconn, $qstr) or die('Query failed: ' . pg_last_error());
		$colNoTmp = pg_num_fields($resTmp);
		
		$sortIDexists = "No";
		for ($i2=0;$i2<$colNoTmp;$i2++){
			if (pg_field_name($resTmp, $i2)=="sortid"){
				$sortIDexists = "Yes";
			}
		}
		
		if ($sortIDexists == "Yes"){
			pg_free_result($resTmp);
			$qstr = "Select * from " . pg_escape_string($replaceTab) . " ORDER BY sortid ASC ;";
			$resTmp = pg_query($dbconn, $qstr) or die('Query failed: ' . pg_last_error());
			$colNoTmp = pg_num_fields($resTmp);
		}
		$rowNoTmp = pg_num_rows($resTmp);
		
		//OK now we need to gather the lookup lists from the tables
		//Which field is it?
		for ($i2=0;$i2<$colNoTmp;$i2++){
			if (pg_field_name($resTmp, $i2)==trim($replaceCol[$i3])){
				$ftype = pg_field_type($resTmp, $i2);
				$colNum = $i2;
			}
		}
		
		//Is there a listid field?
		for ($i2=0;$i2<$colNoTmp;$i2++){
			if (pg_field_name($resTmp, $i2)=="listid"){
				$listIDnum = $i2;
			} else {
				//No list ID
				$listID = '-';
			}
		}
		
		//What number are we recording?
		$optionsListColIt = $optionsListColIt + 1;
		
		//OK, now we get the values
		for ($i=0;$i<$rowNoTmp;$i++){
			array_push($optionsListOp, pg_fetch_result($resTmp,$i,$colNum));
			array_push($optionListID, pg_fetch_result($resTmp,$i,$listIDnum));
			array_push($optionListNo, $optionsListColIt);
			if ($statusList[$i3] != "-" && pg_fetch_result($resTmp,$i,$listIDnum) == $targetList[$i3]){
				array_push($statusValue, pg_fetch_result($resTmp,$i,$colNum));
				array_push($statusAvail, 1);
				array_push($statusText, pg_fetch_result($resTmp,$i,$colNum));
				array_push($statusTable, $table);
				array_push($statusField, $targetCol[$i3]);
			}
		}
		
		//Next we record away the list definition
		array_push($optionsListCol, $targetCol[$i3]);
		array_push($optionsListColLoop, $optionsListColIt);
		array_push($optionListLink, $targetList[$i3]);
		
		//Up the $i3 for the next loop
		$i3 = $i3 + 1;
		pg_free_result($resTmp);
	}

	//These should be equal but this if is included to prevent errors (some lists may not show)
	if ($optionsListColIt != count($optionsListCol)) {
		$optionsListColIt = count($optionsListCol);
	}
	$optionsListIt = count($optionsListOp);
		  
	if (count($statusField)>0){
		print "statusField = ['" . $statusField[0] . "']";
	} else {
		print "statusField = ['']";
	}
}
?>