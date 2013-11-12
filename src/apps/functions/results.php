<?php
// attempt a connection
include '../../apps/functions/housekeeping.php';
ini_set('error_reporting', E_ALL & ~E_NOTICE);  //Stop logging notices for this script

// Variable read in from config.xml file
$projectPath = $_SERVER['HTTP_REFERER'] . 'config.xml';
if (substr($projectPath, 0, 9)=="https://g") {
	//External address 
	$projectPath = substr($projectPath,36);
} else {
	//Internal address
	$projectPath = substr($projectPath,18);
}
$projectPath = "../.." . $projectPath;
if (file_exists($projectPath)) {
    $xml = simplexml_load_file($projectPath);
}

//Set up the width values
//One value should be passed
$tableWidth = $_GET['tableWidth'];
//The title blocks are 150px and this needs to be discounted from the tablewidth
$editTabWidth = $tableWidth - 250; //Added extra 100 reduction for padding
//Take the amount remaining and then divide by four
//we will use one quarter for the minimap and the rest for the form fields
$miniMapWidth = $editTabWidth / 4;
$formWidth = ($editTabWidth / 4) * 3;
//input size;  1 unit = 6px; 1 cols unit = 8px;
$inputSize = ($formWidth / 6);
$colsSize = ($formWidth / 8);

//Lookup means from one table to another (i.e. S = Saved in another table)
$loadEdits = (string)$xml->other->edits;
if ($loadEdits =="True") {
	$loadEdits = true;
} else {
	$loadEdits = false;
}
$targetCol = array(); 
$targetTable = array();
$replaceCol = array();
$replaceTable = array();
foreach ($xml->lookups->targetCol as $opt) {
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
}
$lookupColno = count($targetCol);

//Option lists create a list of options without a lookup
$optionsListOp = array();
$optionListNo = array();
$optionsListCol = array();
$optionsListColLoop = array();
foreach ($xml->optionsList->optionsListOp as $opt) {
	array_push($optionsListOp, $opt);
}
foreach ($xml->optionsList->optionListNo as $opt) {
	array_push($optionListNo, intval($opt));
}
$optionsListCol = array();
foreach ($xml->optionsList->optionsListCol as $opt) {
	array_push($optionsListCol, $opt);
}
$optionsListColLoop = array();
foreach ($xml->optionsList->optionsListColLoop as $opt) {
	array_push($optionsListColLoop, intval($opt));
}
$optionsListColIt = count($optionsListCol);
$optionsListIt = count($optionsListOp);

//There is a second list for status as this may be a special case
$statusValue = array();
$statusAvail = array();
$statusText = array();
$statusTable = array();
$statusField = array();

foreach ($xml->status->statusValue as $opt){
	array_push($statusValue, $opt);
}
foreach ($xml->status->statusAvail as $opt){
	if ($opt = "True") {
		array_push($statusAvail, 1);
	} else {
		array_push($statusAvail, 0);
	}
}
foreach ($xml->status->statusText as $opt){
	array_push($statusText, $opt);
}
foreach ($xml->status->statusTable as $opt){
	array_push($statusTable, $opt);
}
foreach ($xml->status->statusField as $opt){
	array_push($statusField, $opt);
}
$statusValueno = count($statusValue);

//Columns to exclude from the view table
$exclusion = array();
$exclusionT = array();
foreach ($xml->exclusions->exclusion as $opt) {
	array_push($exclusion, $opt);
}
foreach ($xml->exclusions->exclusionT as $opt) {
	array_push($exclusionT, $opt);
}
$exclusionno = count($exclusion);

//Columns to grey out
$disa = array(); 
$disaT = array();
foreach ($xml->disable->option as $opt) {
	array_push($disa, $opt);
}
foreach ($xml->disable->optionT as $opt) {
	array_push($disaT, $opt);
}
$disno = count($disa);

//Tables to treat as special - Currently disabled as an option
$specialTables = array();
//foreach ($xml->special->specialTables->option as $opt) {
//	array_push($specialTables, $opt);
//}
$specialno = count($specialTables);

//Table loops for a single table to include
$tableLoops = array();
foreach ($xml->tableLoops->tableCondition as $opt) {
	array_push($tableLoops, $opt);
}
$tableTitles = array();
foreach ($xml->tableLoops->tableName as $opt) {
	array_push($tableTitles, $opt);
}

if (count($tableLoops) == 0){
	$tableLooper = 0;
} else {
	//We have multiple loops of a single table
	$tableLooper = 1;
	$tableLoopsno = count($tableLoops);
}

//Check for multiple tables
$multiTableName = array();
foreach ($xml->table->tableName as $opt) {
	array_push($multiTableName, $opt);
}
$tableGeomEdit = array();
foreach ($xml->table->tableGeom as $opt) {
    array_push($tableGeomEdit, $opt);
}

//Do we have a sort string?
$sortstr = $_GET['sortstr'];
if ($sortstr !== "no"){
	//Sort out the sort into a valid SQL per table
	$sortrows = explode("^", $sortstr); //This breaks up the string
	//Each string is now in the form T0-field|direction and the sort order is defined by placement within the array
	for($i=0;$i<count($sortrows);$i++){
		//We loop through the array, first task is to post the rows per table
		$sortrow = explode("-", $sortrows[$i]);
		if (!$$sortrow[0]){
			$$sortrow[0] = $sortrow[1];
		} else {
			$$sortrow[0] .= "^" . $sortrow[1];
		}
	}
	
	//OK, we now have an array for each table with a sort on it in the form field|direction^field|direction...etc
	//Lets test for each table and make the SQL if present
	for($i=0;$i<count($multiTableName);$i++){
		$tabRef = "T" . $i;
		$tmpStr = "";
		if(isset($$tabRef)){
			//We have a sort
			$tmpVals = explode("^", $$tabRef);
			if (is_array($tmpVals)){
				for ($i2=0;$i2<count($tmpVals);$i2++){
					if($i2===0){
						$tmpStr .= " ORDER BY ";
					} else {
						$tmpStr .= ", ";
					}
					$tmpVals2 = explode("|", $tmpVals[$i2]);
					$tmpStr .= $tmpVals2[0] . " " . $tmpVals2[1];
				}
			} else {
				$tmpVals = explode("|", $$tabRef);
				$tmpStr = " ORDER BY " . $tmpVals[0] . " " . $tmpVals[1];
			}
			$$tabRef = $tmpStr;
		} else {
			//No sort for this table
			$$tabRef = "no";
		}
	}
}

//This is only designed to handle a single case; I have chosen multiple tables to take priority over a single table queried
//that means this loop will overwrite the one above if true.
if (count($multiTableName) == 1 && $tableLooper == 0){
	//This means we have a single table, nothing fancy
	$multiTable = 0;
} elseif (count($multiTableName) > 1) {
	//OK, we have multiple tables so we set up the multi-table version and scrap the tableLooper regardless
	$tableLooper = 0;
	$multiTable = 1;
	$tableLoopsno = count($multiTableName);
}

//Functions to exclude
$functionEx = array();
foreach ($xml->functions->functionEx as $opt) {
	array_push($functionEx, $opt);
}
$functionExno = count($functionEx);

//Other settings
//$default_ex = $xml->other->default_ex;
$order_by = $xml->other->order_by;
$proj = intval($xml->other->proj);
$maxCol = 0; //We no longer use this value

//Pick up the posted value
$table = $_GET['table'];
$function = $_GET['function'];
$filter = $_GET['filter'];
$geom_field = $_GET['geomF'];
$recNo = $_GET['recNo'];
$lower = $_GET['lower'];
$status = $_GET['status'];
$gid = $_GET['gid'];
$sid = $_GET['sid'];
$selMode = $_GET['selMode'];
$mod_by = $_GET['mod_by'];
$projMap = $_GET['geom'];
if (is_numeric($_GET['currGID'])) {
	$currGID = intval($_GET['currGID']); //Force this to be a number
} else {
	$currGID = -1;
}

//If Geometry field name is empty we need to pick up the value from the config
if($geom_field==''){
	$geom_names = array();
	foreach ($xml->wfs->overlay as $opt){
		array_push($geom_names, $opt->overlaygeometryName);
	}
	$table_names = array();
	foreach ($xml->wms->overlay as $opt){
		array_push($table_names, $opt->overlayTable);
	}
	$table_less_view = str_replace("_view","",$table);
	for ($i=0;$i<count($table_names);$i++){
		if ($table_names[$i]==$table or $table_names[$i]==$table_less_view){
			$geom_field = $geom_names[$i];
		}
	}
}

//Get the recNo and lower or set default
if (empty($recNo) || $recNo == '' || $recNo == 'NaN') {
    $recNo = $xml->other->recNo;
}
if (empty($lower) || $lower == '' || $lower == 'NaN') {
    $lower = $xml->other->lower;
}

//We may now have multiple lower and recNo values to we are calculating an array splitting the values at each |
$recNos = array();
$lowers = array();
if ($tableLoopsno == 0) {
	array_push($recNos, $recNo);
	array_push($lowers, $lower);
} else {
	$nextIt1 = 0;
	$nextIt2 = 0;
	for ($ti=0;$ti<$tableLoopsno;$ti++){
		//recNo
		if ($nextIt1 > 0){
			//We need to skip over the previous |
			$nextIt1 = $nextIt1 + 1;
		}
		$nextIt3 = strpos($recNo,"|",$nextIt1);
		$nextItLen1 = $nextIt3 - $nextIt1;
		if ($nextIt3 != "") {
			array_push($recNos, intval(substr($recNo,$nextIt1,$nextItLen1)));
		} else {
			array_push($recNos, intval(substr($recNo,$nextIt1)));
		}
		$nextIt1 = $nextIt3;
		
		//Now for lower
		if ($nextIt2 > 0){
			//We need to skip over the previous |
			$nextIt2 = $nextIt2 + 1;
		}
		$nextIt4 = strpos($lower,"|",$nextIt2);
		$nextItLen2 = $nextIt4 - $nextIt2;
		if ($nextIt3 != "") {
			array_push($lowers, intval(substr($lower,$nextIt2,$nextItLen2)));
		} else {
			array_push($lowers, intval(substr($lower,$nextIt2)));
		}
		$nextIt2 = $nextIt4;
	}
}

$nofilter = 0;
$filterLen = strlen($filter);
$quoteIt = 0;
//Check for a filter
if ($filterLen>1) {
    //Translate the filter
    $opTranslator = array('Equal¥to','Not¥equal','Greater¥than¥or¥equal¥to','Less¥than¥or¥equal¥to','Greater¥than','Less¥than','LIKE','BETWEEN');
	$opTranslatorOther = array('Equal','Greater¥than¥or¥equal','Less¥than¥or¥equal');
    $opTranslator2 = array('=','<>','>=','<=','>','<',' LIKE ', ' BETWEEN ');
    $opTranslatorno = count($opTranslator);
	$opTranslatorno2 = count($opTranslatorOther);
    for ($ot=0;$ot<$opTranslatorno;$ot++){
        if (strstr($filter,$opTranslator[$ot])){
            $filter = str_replace($opTranslator[$ot],$opTranslator2[$ot],$filter);
		}
	}
	//Second loop for any options still left
	for ($ot=0;$ot<$opTranslatorno2;$ot++){
        if (strstr($filter,$opTranslatorOther[$ot])){
			$filter = str_replace($opTranslatorOther[$ot],$opTranslator2[$ot],$filter);
		}
	}
	 $filter = str_replace('not','and not',$filter);
	
	//Set up the arrays of each section
	$faInum = array();
	$faInam = array();
	$faIop = array();
	$faIVal1 = array();
	$faIVal2 = array();
	$faIOp2 = array();
	//Split the string based on ¥ 
	$filterA = explode("¥", $filter); 
			
	$curArray = 2; //Field number scripting not used
	$skips = 0;
	for ($faI=0;$faI<count($filterA);$faI++){
		if ($skips==0){
			if ($curArray==1){
				//pickup a field number
				array_push($faInum, intval($filterA[$faI]));
				$curArray = $curArray + 1;
			} elseif ($curArray==2) {
				//pickup a field name
				array_push($faInam, $filterA[$faI]);
				$curArray = $curArray + 1;
			} elseif ($curArray==3) {
				//pickup the field operator
				array_push($faIop, $filterA[$faI]);
				//OK is it a between?
				if ($filterA[$faI]==' BETWEEN '){
					array_push($faIVal1,$filterA[$faI+1]);
					array_push($faIVal2,$filterA[$faI+2]);
					$skips = 2; //We skip two more loops
				} else {
					array_push($faIVal1,$filterA[$faI+1]);
					array_push($faIVal2,'');
					$skips = 1; //We skip one more loop
				}
				$curArray = $curArray + 1;
			} elseif ($curArray==4) {
				//If there is another filter we need to process it here
				array_push($faIOp2, $filterA[$faI]);
				$curArray = 2; //Set up for the next filter
			}
		} else {
			$skips = $skips - 1;
		}
	}
	
	//OK the full filter is now safely passed into sensible arrays; next to put together a filter string
	for ($faIB=0;$faIB<count($faInam);$faIB++){
		if ($faIB>0){
			//This is a second (or more) filter
			$filter2 .= " " . $faIOp2[$faIB-1] . " ";
			//First we need to deal with any LIKE commands need to convert the * to a %
			if ($faIop[$faIB]==' LIKE '){
				$faIVal1[$faIB] = str_replace("*","%",$faIVal1[$faIB]);
			}
			//Then we construct the search
			if ($faIop[$faIB]==' BETWEEN '){
				$filter2 .= "(" . $faInam[$faIB] . " " . $faIop[$faIB] . " " . (is_numeric($faIVal1[$faIB]) ? $faIVal1[$faIB] : "'" . $faIVal1[$faIB] . "'" ) . " and " . (is_numeric($faIVal2[$faIB]) ? $faIVal2[$faIB] : "'" . $faIVal2[$faIB] . "'" ) . ")";
			} else {
				$filter2 .= "(" . $faInam[$faIB] . " " . $faIop[$faIB] . " " . (is_numeric($faIVal1[$faIB]) ? $faIVal1[$faIB] : "'" . $faIVal1[$faIB] . "'" ) . ")";
			}
		} else {
			//Set up the first filter
			//First we need to deal with any LIKE commands need to convert the * to a %
			if ($faIop[$faIB]==' LIKE '){
				$faIVal1[$faIB] = str_replace("*","%",$faIVal1[$faIB]);
			}
			//Then we construct the search
			if ($faIop[$faIB]==' BETWEEN '){
				$filter2 = "(" . $faInam[$faIB] . " " . $faIop[$faIB] . " " . (is_numeric($faIVal1[$faIB]) ? $faIVal1[$faIB] : "'" . $faIVal1[$faIB] . "'" ) . " and " . (is_numeric($faIVal2[$faIB]) ? $faIVal2[$faIB] : "'" . $faIVal2[$faIB] . "'" ) . ")";
			} else {
				$filter2 = "(" . $faInam[$faIB] . " " . $faIop[$faIB] . " " . (is_numeric($faIVal1[$faIB]) ? $faIVal1[$faIB] : "'" . $faIVal1[$faIB] . "'" ) . ")";
			}
		}
	}
	//Reconstruct the filter
	$filter = $filter2;
	//Remove any remaining ¥ characters
	$filter = str_replace("¥"," ",$filter);
	//echo $filter . "<br />";
	//Store the filter
	array_push($tableLoops,$filter);
    array_push($tableTitles,'Normal Records (Filtered)');
} else {
    $nofilter = 1;
} 
//This is now outputing the content of a div

//Is this a banned function?
for ($fe=0;$fe<$functionExno;$fe++) {
	if ($functionEx[$fe] == $function) {
		print "This function is not permitted on this table";
		$function = 'view';
	}
}

//Generate Lookup Arrays
for ($l=0;$l<$lookupColno;$l++) {
	//open a connection to the database server
	$dbconnL = pg_connect($conn_string) or die('connection failed' . pg_last_error());
	// Query
	$tableL = $replaceTable[$l];
	$queryL = 'SELECT ' . $targetCol[$l] . ',' . $replaceCol[$l] . ' FROM ' . $tableL;
	$resL = pg_query($dbconnL, $queryL) or die('Query failed: ' . pg_last_error());

	$rowNoL = pg_num_rows($resL);
	$lookupArrayA = 'lookupArrayCol' . $l;
	$lookupArrayB = 'lookupArrayRes' . $l;
	$$lookupArrayA = array();
	$$lookupArrayB = array();
	for ($la=0;$la<$rowNoL;$la++) {
		${$lookupArrayA}[$la] = pg_fetch_result($resL,$la,0);
		${$lookupArrayB}[$la] = pg_fetch_result($resL,$la,1);
	}
	$lookupCountA = 'lookupCount' . $l;
	$$lookupCountA = count($$lookupArrayA);

	// Free resultset
	pg_free_result($resL);
	// Closing connection
	pg_close($dbconnL);
}

//Calculate exclusions
$exclusionAll = array();
$n = 0;
for ($e=0;$e<$exclusionno;$e++){
	if ($exclusionT[$e]==$table){
		$exclusionAll[$n] = $exclusion[$e];
		$n = $n + 1;
	}
	$exclusionAllno = count($exclusionAll);
}

switch($function):
	Case 'edit':
        //Forward on if a special table
        $table = pg_escape_string($table);
		for ($i=0;$i<count($tableGeomEdit);$i++){
			if ($tableGeomEdit[$i]=="True" || $tableGeomEdit[$i]=="Yes"){
				$tableGeomEditVal = 'Yes';
			} else {
				$tableGeomEditVal = 'No';
			}
		}
        $gid = pg_escape_string($gid);
        for ($i=0;$i<$specialno;$i++){
            if ($table==$specialTables[$i]){
                print "<img src=\"../../apps/functions/blank.jpg\" onLoad=\"specialT('" . $table . "','edit','" . $gid . "')\" />";
            }
        }
        
        if (is_numeric($gid)) {
        } else {
            $gid = 0;
        }
        //open a connection to the database server
		$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
		// Deal with views Query
		if(strrpos($table, "_view")!=false){
			$qtable = substr($table,0,strrpos($table, "_view"));
		} else {
			$qtable = $table;
		}
		// Query
		$query = 'SELECT * FROM ' . $qtable . ' WHERE gid=' . $gid;
		$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
		
		if($tableGeomEditVal=='Yes'){
			$query2 = 'SELECT ST_AsText(' . $geom_field .') as the_geometry FROM ' . $qtable . ' WHERE gid=' . $gid;
			$res2 = pg_query($dbconn, $query2) or die('Query failed: ' . pg_last_error());
		}
		$meta = array_values(pg_meta_data($dbconn, $qtable));
		
		//How many rows / columns?
		$colNo = pg_num_fields($res);
		$j = 0;
		$j2 = 0;
		while ($j < $colNo) {
			//Build the name and type arrays
			if ($j2 == 0) {
				$fnarray = array($j=> pg_field_name($res, $j));
				$ftcarray = array($j=> $meta[$j][3]);
				$ftarray = array($j=> pg_field_type($res, $j));
			} else {
				$fnarray[$j] = pg_field_name($res, $j);
				$ftcarray[$j] = $meta[$j][3];
				$ftarray[$j] = pg_field_type($res, $j);
			}
			$j2 = 1;
			$j = $j + 1;
		}

		//This is the information div
		print "<form id=\"EditForm\" enctype=\"multipart/form-data\">\n
		<div id='EditInfo'>
		";

		print "<table style='table-layout: fixed;'>\n";
		//Insert a submit button
		print "<tr><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"update\")' value='Update Row' /></td><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"reset\")' value='Cancel' /></td>";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		}

		//This section draws a map window on the right so we know which record we are editing
		print "<td></td><td rowspan='";
		print $colNo + 1;
		print "' style='vertical-align: top'><div id='EditMap' class='EditMap' style='width: " . $miniMapWidth . "px; height: " . ($miniMapWidth * 0.75) . "px; border: 1px solid gray;' /></td></tr>\n";

		$j = 0;
		while ($j < $colNo) {
			//Look for exclusions
			$ex = 0;
			for ($e=0;$e<$exclusionAllno;$e++){
				if (pg_field_name($res,$j)==$exclusionAll[$e]){
					$ex = 1;
				}
			}
			//Look for grey fields
			$dis = 0;
			if (substr($table,0,2)=='jt'){
				if (pg_field_name($res,$j)=='gid'){
					$dis = 1;
				}
			} else {
				for ($e=0;$e<$disno;$e++){
					if (pg_field_name($res,$j)==$disa[$e]){
						$dis = 1;
					}
				}
			}
			//Look for lookup fields and options
			//First, is this an excluded table?
			$notnow = array();
			for ($s=0;$s<$lookupColno;$s++){
				if ($table == $lookupTab[$s]){
					$notnow[$s] = 1;
				} else {
					$notnow[$s] = 0;
				}
			}
			$sel = 0;
			for ($s=0;$s<$lookupColno;$s++){
				if ($notnow[$s]==0 and $fnarray[$j]==$lookupCol[$s]) {
					$sel = 1;
					$arrRef = $s;
				} elseif ($notnow[$s]==0 and $fnarray[$j]==$lookupRes[$s]){
					$sel = 2;
					$arrRef = $s;
				}
			}
			$lookupCountA = 'lookupCount' . $arrRef;
			for($s=0;$s<$optionsListColIt;$s++){
				if ($notnow[$s]==0 and $fnarray[$j]==$optionsListCol[$s]) {
					$sel = 3;
					$OLN = $optionsListColLoop[$s]; //Get the loop number
				}
			}

			//Pickup the value
			$formValue = trim(pg_fetch_result($res,0,$j));
			/*So; we are ready to output an edit form. We need to set out the concept here
			There are 5 general types:
				H = Hidden
				S = Select Options
				T = Free Text
				N = Numerical 
				O = Option / boolean
				C = character
			
			These are defined based on the html form elements required to capture the data
			and it is important later when saving the values
			
			The id for each field is of the type 'general type' + 'field name' 
			for example recstatus might be a select list, this would give an id of 'Srecstatus'.
			*/
			
			//Output the form
			if ($ex==1){
				print "<input type='hidden' id='H" . $fnarray[$j] . "' name='H" . $fnarray[$j] . "' value='" . $formValue . "' />";
			} elseif ($dis==1) {
				//Disabled Fields (grey)
				if ($meta[$j]['not null']==1){
					print "<tr><td class='EditHeader'><b><i>" . $fnarray[$j] . "</b></i></td>";
				} else {
					print "<tr><td class='EditHeader'>" . $fnarray[$j] . "</td>";
				}
				if ($sel==1){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrA}[$s])==$formValue) {
								print "<option disabled='disabled'  selected='selected' value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							} else {
								print "<option disabled='disabled'  value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrB}[$s])==$formValue) {
								print "<option disabled='disabled'  selected='selected' value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							} else {
								print "<option disabled='disabled'  value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($fnarray[$j] == 'recstatus') {
					//This is a status column and there may be lookup of values
					if ($statusValueno > 0) {
						print "<td colspan='2' class='EditValue'>
						<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($sv=0;$sv<$statusValueno;$sv++){
							if (trim($statusTable[$sv])==$table ) {
								//This checks that the status value applies to the current table
								if (trim($statusValue[$sv])==trim($formValue)) {
									//No second loop here, it is all disabled!
									print "<option disabled='disabled' selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
								} else {
									print "<option disabled='disabled'  value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
								}
							}
						}
						print "</select>
						</td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="time") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="date") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					} else {
					//Anything else
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					}
				} elseif ($sel==3) {
					//Option List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if (trim($optionsListOp[$s])==$formValue) {
									print "<option disabled='disabled'  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								} else {
									print "<option disabled='disabled'  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								}
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($ftarray[$j]=="text") {
					//Normal Text
					print "<td colspan='2' class='EditValue'><textarea class='disabled' readonly='readonly' rows='5' cols='" . $colsSize . "' id='T" . $fnarray[$j] . "' name='T" . $fnarray[$j] . "'>" . $formValue . "</textarea></td><td></td></tr>\n";
				} elseif ($ftarray[$j]=="bool") {
					//Booleans (yes/no)
					if ($formValue=='t') {
						print "<td colspan='2' class='EditValue'><input type='checkbox' checked='checked' class='disabled' readonly='readonly' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td><td></td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='checkbox' class='disabled' readonly='readonly' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td><td></td></tr>\n";
					}
				} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="time") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="date") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				} else {
					//Anything else
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				}
			} else {
				//Enabled fields
				if ($meta[$j]['not null']==1){
					print "<tr><td class='EditHeader'><font color='red'><b><i>" . $fnarray[$j] . "</b></i></font></td>";
				} else {
					print "<tr><td class='EditHeader'>" . $fnarray[$j] . "</td>";
				}
				if ($sel==1){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrA}[$s])==$formValue) {
								print "<option selected='selected' value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							} else {
								print "<option value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrB}[$s])==$formValue) {
								print "<option selected='selected' value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							} else {
								print "<option value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($fnarray[$j] == 'recstatus') {
					//This is a status column and there may be lookup of values
					if ($statusValueno > 0) {
						print "<td colspan='2' class='EditValue'>
						<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($sv=0;$sv<$statusValueno;$sv++){
							if (trim($statusTable[$sv])==$table) {
								//This checks that the status value applies to the current table
								if ($statusAvail[$sv] == 1) {
									if (trim($statusValue[$sv])==trim($formValue)) {
										print "<option selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									} else {
										print "<option value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									}
								} else {
									if (trim($statusValue[$sv])==trim($formValue)) {
										print "<option disabled='disabled' selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									} else {
										print "<option disabled='disabled' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									}
								}
							}
						}
						print "</select>
						</td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a number</font></td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="time") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a timestamp (yyyy-mm-dd hh:mm:ss<a href='#' alt='You may need to add the timezone'>*</a>)</font></td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="date") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a date (yyyy-mm-dd)</font></td><td></td></tr>\n";
					} else {
					//Anything else
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					}
				} elseif ($sel==3) {
					//Option List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if (trim($optionsListOp[$s])==$formValue) {
									print "<option  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								} else {
									print "<option  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								}
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($ftarray[$j]=="text") {
					//Normal Text
					print "<td colspan='2' class='EditValue'><textarea  rows='5' cols='" . $colsSize . "' id='T" . $fnarray[$j] . "' name='T" . $fnarray[$j] . "'>" . $formValue . "</textarea></td><td></td></tr>\n";
				} elseif ($ftarray[$j]=="bool") {
					//Booleans (yes/no)
					if ($formValue=='t'){
						print "<td colspan='2' class='EditValue'><input type='checkbox' checked='checked' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td><td></td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='checkbox' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td><td></td></tr>\n";
					}
				} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a number</font></td><td></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="time") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a timestamp (yyyy-mm-dd hh:mm:ss<a href='#' alt='You may need to add the timezone'>*</a>)</font></td><td></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="date") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a date (yyyy-mm-dd)</font></td><td></td></tr>\n";
				} else {
					//Anything else
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				}
			}
			$j = $j + 1;
		}
		//Insert a submit button
		print "<tr><td><input type='hidden' id='Itable' name='Itable' value='" . $qtable . "' /><input type='hidden' id='Iproj' name='Iproj' value='" . $proj . "' /><input type='button' onclick='gedCall(\"" . $qtable . "\", \"update\")' value='Update Row' /></td><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"reset\")' value='Cancel' /></td>
		";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		} else {
			print "<td></td>";
		}
		print "<td></td></tr>\n";
		print "</table>\n";
		if ($tableGeomEditVal=='Yes'){
			print "<img src=\"../../apps/functions/blank.jpg\" onload='editMap(\"" . pg_fetch_result($res2,0,0) . "\")' />\n";
		}
		print "</div>";

		// Free resultset
		pg_free_result($res);
		if ($tableGeomEditVal=='Yes'){
			pg_free_result($res2);
		}

		// Closing connection
		pg_close($dbconn);
		break;
	Case 'view-edit':
        //Forward on if a special table
        $table = pg_escape_string($table);
		for ($i=0;$i<count($tableGeomEdit);$i++){
			if ($tableGeomEdit[$i]=="True" || $tableGeomEdit[$i]=="Yes"){
				$tableGeomEditVal = 'Yes';
			} else {
				$tableGeomEditVal = 'No';
			}
		}
        $gid = pg_escape_string($gid);
        for ($i=0;$i<$specialno;$i++){
            if ($table==$specialTables[$i]){
                print "<img src=\"../../apps/functions/blank.jpg\" onLoad=\"specialT('" . $table . "','edit','" . $gid . "')\" />";
            }
        }
        
        if (is_numeric($gid)) {
        } else {
            $gid = 0;
        }
        //open a connection to the database server
		$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
		// Deal with views Query
		if(strrpos($table, "_view")!=false){
			$qtable = substr($table,0,strrpos($table, "_view"));
		} else {
			$qtable = $table;
		}
		// Query
		$query = 'SELECT * FROM ' . $qtable . ' WHERE gid=' . $gid;
		$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
		
		if($tableGeomEditVal=='Yes'){
			$query2 = 'SELECT ST_AsText(' . $geom_field .') as the_geometry FROM ' . $qtable . ' WHERE gid=' . $gid;
			$res2 = pg_query($dbconn, $query2) or die('Query failed: ' . pg_last_error());
		}
		$meta = array_values(pg_meta_data($dbconn, $qtable));
		
		//How many rows / columns?
		$colNo = pg_num_fields($res);
		$j = 0;
		$j2 = 0;
		while ($j < $colNo) {
			//Build the name and type arrays
			if ($j2 == 0) {
				$fnarray = array($j=> pg_field_name($res, $j));
				$ftcarray = array($j=> $meta[$j][3]);
				$ftarray = array($j=> pg_field_type($res, $j));
			} else {
				$fnarray[$j] = pg_field_name($res, $j);
				$ftcarray[$j] = $meta[$j][3];
				$ftarray[$j] = pg_field_type($res, $j);
			}
			$j2 = 1;
			$j = $j + 1;
		}

		//This is the information div
		print "<form id=\"EditForm\" enctype=\"multipart/form-data\">\n
		<div id='EditInfo'>
		";

		print "<table style='table-layout: fixed;'>\n";
		//Insert a submit button
		print "<tr><td><input type=\"button\" onclick=\"updateRow('" . $table . "'," . $gid . ")\" value=\"Edit This Record\" /></td><td><input type='button' onclick='viewswitch(\"" . $table . "\", \"view\")' value='Table View' /><input type=\"button\" value=\"Return to Map\" onclick=\"return2Map('collapse', '" . $table . "')\" />";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		}

		//This section draws a map window on the right so we know which record we are editing
		print "<td></td><td rowspan='";
		print $colNo + 1;
		print "' style='vertical-align: top'><div id='EditMap' class='EditMap' style='width: " . $miniMapWidth . "px; height: " . ($miniMapWidth * 0.75) . "px; border: 1px solid gray;' /></td></tr>\n";

		$j = 0;
		while ($j < $colNo) {
			//Look for exclusions
			$ex = 0;
			for ($e=0;$e<$exclusionAllno;$e++){
				if (pg_field_name($res,$j)==$exclusionAll[$e]){
					$ex = 1;
				}
			}
			//All fields are disabled in this case as this is to view data only
			//Look for grey fields
			$dis = 1;
			
			//Look for lookup fields and options
			//First, is this an excluded table?
			$notnow = array();
			for ($s=0;$s<$lookupColno;$s++){
				if ($table == $lookupTab[$s]){
					$notnow[$s] = 1;
				} else {
					$notnow[$s] = 0;
				}
			}
			$sel = 0;
			for ($s=0;$s<$lookupColno;$s++){
				if ($notnow[$s]==0 and $fnarray[$j]==$lookupCol[$s]) {
					$sel = 1;
					$arrRef = $s;
				} elseif ($notnow[$s]==0 and $fnarray[$j]==$lookupRes[$s]){
					$sel = 2;
					$arrRef = $s;
				}
			}
			$lookupCountA = 'lookupCount' . $arrRef;
			for($s=0;$s<$optionsListColIt;$s++){
				if ($notnow[$s]==0 and $fnarray[$j]==$optionsListCol[$s]) {
					$sel = 3;
					$OLN = $optionsListColLoop[$s]; //Get the loop number
				}
			}

			//Pickup the value
			$formValue = trim(pg_fetch_result($res,0,$j));
			/*So; we are ready to output an edit form. We need to set out the concept here
			There are 5 general types:
				H = Hidden
				S = Select Options
				T = Free Text
				N = Numerical 
				O = Option / boolean
				C = character
			
			These are defined based on the html form elements required to capture the data
			and it is important later when saving the values
			
			The id for each field is of the type 'general type' + 'field name' 
			for example recstatus might be a select list, this would give an id of 'Srecstatus'.
			*/
			
			//Output the form
			if ($ex==1){
				print "<input type='hidden' id='H" . $fnarray[$j] . "' name='H" . $fnarray[$j] . "' value='" . $formValue . "' />";
			} elseif ($dis==1) {
				//Disabled Fields (grey)
				if ($meta[$j]['not null']==1){
					print "<tr><td class='EditHeader'><b><i>" . $fnarray[$j] . "</b></i></td>";
				} else {
					print "<tr><td class='EditHeader'>" . $fnarray[$j] . "</td>";
				}
				if ($sel==1){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrA}[$s])==$formValue) {
								print "<option disabled='disabled'  selected='selected' value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							} else {
								print "<option disabled='disabled'  value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrB}[$s])==$formValue) {
								print "<option disabled='disabled'  selected='selected' value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							} else {
								print "<option disabled='disabled'  value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($fnarray[$j] == 'recstatus') {
					//This is a status column and there may be lookup of values
					if ($statusValueno > 0) {
						print "<td colspan='2' class='EditValue'>
						<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($sv=0;$sv<$statusValueno;$sv++){
							if (trim($statusTable[$sv])==$table ) {
								//This checks that the status value applies to the current table
								if (trim($statusValue[$sv])==trim($formValue)) {
									//No second loop here, it is all disabled!
									print "<option disabled='disabled' selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
								} else {
									print "<option disabled='disabled'  value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
								}
							}
						}
						print "</select>
						</td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="time") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="date") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					} else {
					//Anything else
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					}
				} elseif ($sel==3) {
					//Option List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if (trim($optionsListOp[$s])==$formValue) {
									print "<option disabled='disabled'  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								} else {
									print "<option disabled='disabled'  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								}
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($ftarray[$j]=="text") {
					//Normal Text
					print "<td colspan='2' class='EditValue'><textarea class='disabled' readonly='readonly' rows='5' cols='" . $colsSize . "' id='T" . $fnarray[$j] . "' name='T" . $fnarray[$j] . "'>" . $formValue . "</textarea></td><td></td></tr>\n";
				} elseif ($ftarray[$j]=="bool") {
					//Booleans (yes/no)
					if ($formValue=='t') {
						print "<td colspan='2' class='EditValue'><input type='checkbox' checked='checked' class='disabled' readonly='readonly' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td><td></td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='checkbox' class='disabled' readonly='readonly' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td><td></td></tr>\n";
					}
				} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="time") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="date") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				} else {
					//Anything else
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				}
			} else {
				//Enabled fields
				if ($meta[$j]['not null']==1){
					print "<tr><td class='EditHeader'><font color='red'><b><i>" . $fnarray[$j] . "</b></i></font></td>";
				} else {
					print "<tr><td class='EditHeader'>" . $fnarray[$j] . "</td>";
				}
				if ($sel==1){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrA}[$s])==$formValue) {
								print "<option selected='selected' value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							} else {
								print "<option value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrB}[$s])==$formValue) {
								print "<option selected='selected' value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							} else {
								print "<option value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($fnarray[$j] == 'recstatus') {
					//This is a status column and there may be lookup of values
					if ($statusValueno > 0) {
						print "<td colspan='2' class='EditValue'>
						<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($sv=0;$sv<$statusValueno;$sv++){
							if (trim($statusTable[$sv])==$table) {
								//This checks that the status value applies to the current table
								if ($statusAvail[$sv] == 1) {
									if (trim($statusValue[$sv])==trim($formValue)) {
										print "<option selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									} else {
										print "<option value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									}
								} else {
									if (trim($statusValue[$sv])==trim($formValue)) {
										print "<option disabled='disabled' selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									} else {
										print "<option disabled='disabled' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									}
								}
							}
						}
						print "</select>
						</td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a number</font></td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="time") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a timestamp (yyyy-mm-dd hh:mm:ss<a href='#' alt='You may need to add the timezone'>*</a>)</font></td><td></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="date") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a date (yyyy-mm-dd)</font></td><td></td></tr>\n";
					} else {
					//Anything else
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
					}
				} elseif ($sel==3) {
					//Option List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if (trim($optionsListOp[$s])==$formValue) {
									print "<option  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								} else {
									print "<option  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								}
							}
						}
					print "</select>
					</td><td></td></tr>\n";
				} elseif ($ftarray[$j]=="text") {
					//Normal Text
					print "<td colspan='2' class='EditValue'><textarea  rows='5' cols='" . $colsSize . "' id='T" . $fnarray[$j] . "' name='T" . $fnarray[$j] . "'>" . $formValue . "</textarea></td><td></td></tr>\n";
				} elseif ($ftarray[$j]=="bool") {
					//Booleans (yes/no)
					if ($formValue=='t'){
						print "<td colspan='2' class='EditValue'><input type='checkbox' checked='checked' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td><td></td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='checkbox' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td><td></td></tr>\n";
					}
				} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a number</font></td><td></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="time") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a timestamp (yyyy-mm-dd hh:mm:ss<a href='#' alt='You may need to add the timezone'>*</a>)</font></td><td></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="date") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a date (yyyy-mm-dd)</font></td><td></td></tr>\n";
				} else {
					//Anything else
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td><td></td></tr>\n";
				}
			}
			$j = $j + 1;
		}
		//Insert a submit button
		print "<tr><td><input type=\"button\" onclick=\"updateRow('" . $table . "'," . $gid . ")\" value=\"Edit This Record\" /></td><td><input type='button' onclick='viewswitch(\"" . $table . "\", \"view\")' value='Table View' /><input type=\"button\" value=\"Return to Map\" onclick=\"return2Map('collapse', '" . $table . "')\" />";
		print "<input type='hidden' id='Itable' name='Itable' value='" . $qtable . "' /><input type='hidden' id='Iproj' name='Iproj' value='" . $proj . "' /></td>
		";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		} else {
			print "<td></td>";
		}
		print "<td></td></tr>\n";
		print "</table>\n";
		if ($tableGeomEditVal=='Yes'){
			print "<img src=\"../../apps/functions/blank.jpg\" onload='editMap(\"" . pg_fetch_result($res2,0,0) . "\")' />\n";
		}
		print "</div>";

		// Free resultset
		pg_free_result($res);
		if ($tableGeomEditVal=='Yes'){
			pg_free_result($res2);
		}

		// Closing connection
		pg_close($dbconn);
		break;
	Case 'add':
		
        //Forward on if a special table
        $table = pg_escape_string($table);
        for ($i=0;$i<$specialno;$i++){
            if ($table==$specialTables[$i]){
                print "<img src=\"../../apps/functions/blank.jpg\" onLoad=\"specialT('" . $table . "','Add','*')\" />";
            }
        }

		//open a connection to the database server
		$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
		// Deal with views Query
		if(strrpos($table, "_view")!=false){
			$qtable = substr($table,0,strrpos($table, "_view"));
		} else {
			$qtable = $table;
		}
		// Query
		$query = 'SELECT * FROM ' . $qtable ;
		$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
		$meta = array_values(pg_meta_data($dbconn, $table));
		
		//How many rows / columns?
		$colNo = pg_num_fields($res);
		$j = 0;
		$j2 = 0;
		while ($j < $colNo) {
			//Look for exclusions
			$ex = 0;
			for ($e=0;$e<$exclusionAllno;$e++){
				if (pg_field_name($res,$j)==$exclusionAll[$e]){
					$ex = 1;
				}
			}
			if ($ex==1){
				$j = $j + 1;
			} else {
			}
			
			if ($j2 == 0) {
				//Build the name and type arrays
				$fnarray = array($j=> pg_field_name($res, $j)); 
				$ftcarray = array($j=> $meta[$j][3]);
				$ftarray = array($j=> pg_field_type($res, $j));
			} else {
				$fnarray[$j] = pg_field_name($res, $j);
				$ftcarray[$j] = $meta[$j][3];
				$ftarray[$j] = pg_field_type($res, $j);
			}
			$j2 = 1;
			$j = $j + 1;
		}

		//This is the information div
		print "<form id=\"EditForm\" enctype=\"multipart/form-data\">\n
		<div id='EditInfo'>\n";

		print "<table style='table-layout: fixed;'>\n";
		//Insert a submit button
		print "<tr><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"insert\")' value='Insert Row' /></td><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"reset\")' value='Cancel' /></td>
		";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		}
		print "</tr>\n";
		
		$j = 0;
		while ($j < $colNo) {
			//Look for exclusions
			$ex = 0;
			for ($e=0;$e<$exclusionAllno;$e++){
				if (pg_field_name($res,$j)==$exclusionAll[$e]){
					$ex = 1;
				}
			}
			//Look for grey fields
			$dis = 0;
			if (substr($table,0,2)=='jt'){
				if (pg_field_name($res,$j)=='gid'){
					$dis = 1;
				}
			} else {
				for ($e=0;$e<$disno;$e++){
					if (pg_field_name($res,$j)==$disa[$e]){
						$dis = 1;
					}
				}
			}
			//Look for lookup fields and options
			//First, is this an excluded table?
			$notnow = array();
			for ($s=0;$s<$lookupColno;$s++){
				if ($table == $lookupTab[$s]){
					$notnow[$s] = 1;
				} else {
					$notnow[$s] = 0;
				}
			}
			$sel = 0;
			for ($s=0;$s<$lookupColno;$s++){
				if ($notnow[$s]==0 and $fnarray[$j]==$lookupCol[$s]) {
					$sel = 1;
					$arrRef = $s;
				} elseif ($notnow[$s]==0 and $fnarray[$j]==$lookupRes[$s]){
					$sel = 2;
					$arrRef = $s;
				}
			}
			$lookupCountA = 'lookupCount' . $arrRef;
			for($s=0;$s<$optionsListColIt;$s++){
				if ($notnow[$s]==0 and $fnarray[$j]==$optionsListCol[$s]) {
					$sel = 3;
					$OLN = $optionsListColLoop[$s]; //Get the loop number
				}
			}

			//Pickup the value
			$formValue = trim(pg_fetch_result($res,0,$j));
			/*So; we are ready to output an edit form. We need to set out the concept here
			There are 5 general types:
				H = Hidden
				S = Select Options
				T = Free Text
				N = Numerical 
				O = Option / boolean
				C = character
			
			These are defined based on the html form elements required to capture the data
			and it is important later when saving the values
			
			The id for each field is of the type 'general type' + 'field name' 
			for example recstatus might be a select list, this would give an id of 'Srecstatus'.
			*/
			
			//Output the form
			if ($ex==1){
				print "<input type='hidden' id='H" . $fnarray[$j] . "' name='H" . $fnarray[$j] . "' value='' />";
			} elseif ($dis==1) {
				//Disabled Fields (grey)
				if ($meta[$j]['not null']==1){
					print "<tr><td class='EditHeader'><b><i>" . $fnarray[$j] . "</b></i></td>";
				} else {
					print "<tr><td class='EditHeader'>" . $fnarray[$j] . "</td>";
				}
				if ($sel==1){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							print "<option disabled='disabled'  value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
						}
					print "</select>
					</td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							print "<option disabled='disabled'  value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
						}
					print "</select>
					</td></tr>\n";
				} elseif ($fnarray[$j] == 'recstatus') {
					//This is a status column and there may be lookup of values
					if ($statusValueno > 0) {
						print "<td colspan='2' class='EditValue'>
						<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($sv=0;$sv<$statusValueno;$sv++){
							if (trim($statusTable[$sv])==$table) {
								//This checks that the status value applies to the current table
								print "<option disabled='disabled'  value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
							}
						}
						print "</select>
						</td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /></td></tr>\n";
					}
				} elseif ($sel==3) {
					//Option List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								print "<option disabled='disabled'  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
							}
						}
					print "</select>
					</td></tr>\n";
				} elseif ($ftarray[$j]=="text") {
					//Normal Text
					print "<td colspan='2' class='EditValue'><textarea class='disabled' readonly='readonly' rows='5' cols='" . $colsSize . "' id='T" . $fnarray[$j] . "' name='T" . $fnarray[$j] . "'></textarea></td></tr>\n";
				} elseif ($ftarray[$j]=="bool") {
					//Booleans (yes/no)
					if ($formValue=='t') {
						print "<td colspan='2' class='EditValue'><input type='checkbox' checked='checked' class='disabled' readonly='readonly' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='checkbox' class='disabled' readonly='readonly' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td></tr>\n";
					}
				} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="time") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="date") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /></td></tr>\n";
				} else {
					//Anything else
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /></td></tr>\n";
				}
			} else {
				//Enabled fields
				if ($meta[$j]['not null']==1){
					print "<tr><td class='EditHeader'><font color='red'><b><i>" . $fnarray[$j] . "</b></i></font></td>";
				} else {
					print "<tr><td class='EditHeader'>" . $fnarray[$j] . "</td>";
				}
				if ($sel==1){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							print "<option value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
						}
					print "</select>
					</td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							print "<option value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
						}
					print "</select>
					</td></tr>\n";
				} elseif ($fnarray[$j] == 'recstatus') {
					//This is a status column and there may be lookup of values
					if ($statusValueno > 0) {
						print "<td colspan='2' class='EditValue'>
						<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($sv=0;$sv<$statusValueno;$sv++){
							if (trim($statusTable[$sv])==$table) {
								//This checks that the status value applies to the current table
								if ($statusAvail[$sv] == 1) {
									print "<option value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
								} else {
									print "<option disabled='disabled' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
								}
							}
						}
						print "</select>
						</td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /></td></tr>\n";
					}
				} elseif ($sel==3) {
					//Option List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								print "<option  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
							}
						}
					print "</select>
					</td></tr>\n";
				} elseif ($ftarray[$j]=="text") {
					//Normal Text
					print "<td colspan='2' class='EditValue'><textarea  rows='5' cols='" . $colsSize . "' id='T" . $fnarray[$j] . "' name='T" . $fnarray[$j] . "'></textarea></td></tr>\n";
				} elseif ($ftarray[$j]=="bool") {
					//Booleans (yes/no)
					if ($formValue=='t'){
						print "<td colspan='2' class='EditValue'><input type='checkbox' checked='checked' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='checkbox' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td></tr>\n";
					}
				} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /><font color='grey'>Please add a number</font></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="time") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /><font color='grey'>Please add a timestamp (yyyy-mm-dd hh:mm:ss<a href='#' alt='You may need to add the timezone'>*</a>)</font></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="date") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /><font color='grey'>Please add a date (yyyy-mm-dd)</font></td></tr>\n";
				} else {
					//Anything else
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /></td></tr>\n";
				}
			}
			$j = $j + 1;
		}
		// Deal with views Query
		if(strrpos($table, "_view")!=false){
			$qtable = substr($table,0,strrpos($table, "_view"));
		} else {
			$qtable = $table;
		}
		
		//Insert a submit button
		print "<tr><td><input type='hidden' id='Itable' name='Itable' value='" . $table . "' /><input type='hidden' id='Iproj' name='Iproj' value='" . $proj . "' /><input type='button' onclick='gedCall(\"" . $qtable . "\", \"insert\")' value='Insert Row' /></td><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"reset\")' value='Cancel' /></td>
		";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		}
		print "</tr>\n";
		print "</table>\n";

		print "</div>\n";

		break;
	Case 'view':
		for ($i=0;$i<$specialno;$i++){
            if ($table==$specialTables[$i]){
                print "<img src=\"../../apps/functions/blank.jpg\" onLoad=\"specialT('" . $table . "','view','" . $gid . "')\" />";
            }
        }

		//This sets the lowerS and recNoS values
		print "<img src=\"../../apps/functions/blank.jpg\" onLoad=\"lowerSet( '" . $recNo . "', '" . $lower . "')\" />";
		$colNoStr = "";
		
		if ($nofilter != 1) {
			$tableLoopsno = 1; //There is a filter so we only do one loop
		}
		if ($tableLoopsno==0){
			$tableLoopsno=1; //We need to do at least one loop
		}
		for ($tb=0;$tb<($tableLoopsno);$tb++) {
			//Sort variable 
			$tabRef = "T" . $tb;
			if($$tabRef==='no'){
				$sort = ' ORDER BY gid ASC';
			} else {
				$sort = $$tabRef;
			}

			//open a connection to the database server
			$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
			
			//How many records are in this table?
			if ($nofilter == 1) {
				if ($tableLooper == 0 && $multiTable == 0){
					$query = 'SELECT gid, mod_by FROM ' . $table . $sort . ' ;';
				} elseif ($multiTable == 0) {
					$query = 'SELECT gid, mod_by FROM ' . $table . ' WHERE ' . $tableLoops[$tb]  . $sort . ' ;';
				} else {
					$table = $multiTableName[$tb];
					$query = 'SELECT gid, mod_by FROM ' . $table . $sort . ' ;';
				}
			} else {
				$query = 'SELECT gid, mod_by FROM ' . $table . ' WHERE ' . $filter  . $sort . ';';
			}
			
			if (!$filter) {
				$res = pg_query($dbconn, $query) or header( print "<img src=\"../../apps/functions/blank.jpg\" onLoad=\"resetView('" . $table . "', " . $recNos[$tb] . ", " . $lowers[$tb] . ", 0)\" />");
			} else {
				$res = pg_query($dbconn, $query);
				
				//If it didn't work, was it because of the filter? Is so, is the layer filter not applicable? (User filter is last)
				if (!$res) {
					//Find the last filter
					$findLast = strrpos($filter, "and (") + 4;
					$filter = substr($filter,$findLast);
					$query = 'SELECT * FROM ' . $table . ' WHERE ' . $filter . $sort . ' limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
					$res = pg_query($dbconn, $query);
				}
				
				//If it still didn't work then we simply remove the filter from the table
				if (!$res) {
					$query = 'SELECT * FROM ' . $table . $sort . ' limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
					$res = pg_query($dbconn, $query) or header( print "<img src=\"../../apps/functions/blank.jpg\" onLoad=\"resetView('" . $table . "', " . $recNos[$tb] . ", " . $lowers[$tb] . ", 0)\" />");
				} 
			}

			$tabRows = pg_num_rows($res);
			//Generate a GID array
			$gidArray = array();
			$mod_byArray = array();
			$currGID2 = -1;
			$htmlString = "[-99,";
			for ($i=0;$i<$tabRows;$i++){
				array_push($gidArray, pg_fetch_result($res,$i,0));
				array_push($mod_byArray, pg_fetch_result($res,$i,1));
				$htmlString .= pg_fetch_result($res,$i,0) . ",";
			}
			$htmlString .= "]";
			// Free resultset
			pg_free_result($res);
			
			print "<input type='hidden' id='gidArray' value='" . $htmlString . "' />";
			
			if ($nofilter == 0) {
				$query = 'SELECT * FROM ' . $table . ' WHERE ' . $filter . $sort . ' limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
			} else {
				// Query
				if ($tableLooper == 0){
					$query = 'SELECT * FROM ' . $table . $sort . ' limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
				} else {
					$query = 'SELECT * FROM ' . $table . ' WHERE ' . $tableLoops[$tb] . $sort . ' limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
				}
			}
			$res = pg_query($dbconn, $query);
			//If it didn't work here then perhaps the layer filter doesn't apply? The user filter is second filter
			if (!$res) {
				//Find the last filter
				$findLast = strrpos($filter, "and (") + 4;
				$filter = substr($filter,$findLast);
				$query = 'SELECT * FROM ' . $table . ' WHERE ' . $filter . $sort . ' limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
				$res = pg_query($dbconn, $query);
			}
			//If it still didn't work then we simply remove the filter from the table
			if (!$res) {
				$query = 'SELECT * FROM ' . $table . $sort . ' limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
				$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
			} 

			//How many rows / columns?
			$rowNo = pg_num_rows($res);
			$colNo = pg_num_fields($res);
			$colNo2 = $colNo;
			
			if ($rowNo == 0 ){
				//Don't need titles for tables with no records
			} else {
				if ($nofilter != 1) {
					print "<h3>" . $table . "</h3>";
				} else {
					print "<h3>" . $tableTitles[$tb] . "</h3>";
				}
			}

			//We need to set up the filter tools here
			print "<table class=\"topRow\"><tr>
			<td rowspan='2'>";
			if ($lowers[$tb] == 0) {
				print "<input type='button' disabled='disabled' value='<<' />";
			} else {
				if ($currGID != -1 && $currGIDdone != -1) {
					print "<input type='button' onclick='backrecset(\"" . $table . "\", " . $tb . ")' value='<<' />";
				} else {
					print "<input type='button' onclick='backrecset(\"" . $table . "\", " . $tb . ")' value='<<' />";
				}
			}
			print "</td>		
			<th align=\"left\"></th>
			<td rowspan='2'>";
			if (($lowers[$tb] + $recNos[$tb]) >= $tabRows) {
				print "<input type='button' disabled='disabled' value='>>' />";
			} else {
				if ($currGID != -1 && $currGIDdone != -1) {
					print "<input type='button' onclick='nextrecset(\"" . $table . "\", " . $tb . ")' value='>>' />";
				} else {
					print "<input type='button' onclick='nextrecset(\"" . $table . "\", " . $tb . ")' value='>>' />";
				}
			}
			print "</td></tr><tr>
			<td id=\"query_generator" . $tb . "\">";
			//This creates the top grey bar with buttons
			print "
				<table width=\"100%\"><tr>
				<td>
						Number of Records to Display in the Table below:  
						<select onchange='recNochange(\"" . $tb . "\",this.value)'>" . intval($recNos[$tb]);
						$mlval = 5;
						for ($ml=0;$ml<=9;$ml++) {
							if ($mlval == intval($recNos[$tb])) {
								print "<option selected='selected' value='" . $mlval . "'>" . $mlval . "</option>";
							} else {
								print "<option value='" . $mlval . "'>" . $mlval . "</option>";
							}
							$mlval = $mlval + 5;
						};
						print "</select>
				";
				print "<span id='T" . $tb . "sortbut'></span>";
				if ($xml->other->photoscroll == "True") {
					print "</td><td>
						<input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" />
					";
				}
				print "</td><td>
					<input type=\"button\" value=\"Add a Filter\" onclick=\"tableFilter('" . $table . "')\" />
				</td><td>
					";
					if($selMode === 'view') {
						print "<span id='selMode'>Selection Mode: Table <input type='button' onclick='viewswitch(\"" . $table . "\", \"view-edit\")' value='Switch Selection Mode' />";
					} else {	
						print "<span id='selMode'>Selection Mode: Record <input type='button' onclick='viewswitch(\"" . $table . "\", \"view\")' value='Switch Selection Mode' />";
					}
					print "</span>
					<input type=\"button\" value=\"Return to Map\" onclick=\"return2Map('collapse', '" . $table . "')\" />";
					if ($tableGeomEdit[$tb] == 'No'){
							print "<input type=\"button\" onclick=\"insertRow('" . $table . "')\" value=\"Add New Row\" />";
					}
                    print "
				</td><td>
					";
					if ($nofilter != 1) {
						print "<span id=\"RFbutton" . $tb . "\" class=\"showIt\"><input type=\"button\" value=\"Remove Filter\" onclick=\"removeFilter('" . $table . "', " . $tb . ")\" /></span>";
					} else {
						print "<span id=\"RFbutton" . $tb . "\" class=\"hideIt\"><input type=\"button\" value=\"Remove Filter\" onclick=\"removeFilter('" . $table . "', " . $tb . ")\" /></span>";
					}
				print "</td></tr></table>
			";
			
			print "</td>
			</tr><tr>
			<td align=\"center\" colspan=\"5\">";
				if (empty($recNos[$tb])) {
					print "Currently showing a custom query";
				} else {
					print "Currently showing records " . $lowers[$tb] . " to " . ($lowers[$tb] + $recNos[$tb]) . " of " . $tabRows;
				}
			print "</td></tr></table>";
			
			
			//OK we need to create an attributes table but we want the scrolling buttons to be constant so we will split this out into three 
			//sections. 
			//print "<table id='mainRow' class='mainRow' style='width:100%; max-width:" . $tableWidth . "; table-layout: fixed; display: block; overflow-x: auto;'>
			
			//This loop runs the headers
			$j = 0;
			$jF = 0;
			$hideNow = 0;
			$ex2 = 0;
			
			//The first table contains the controls and back button 
			print "<table id='mainRow' class='mainRow' style='table-layout: fixed;'>
			<tbody style='display: inline-block; overflow: hidden; max-width: " . ($tableWidth - 30) . "px;'>
			";
			
			//First we create the header row
			print "<tr class='header'>
				<th style='width:140px; max-width:140px; height: 16px; padding: 5px; overflow: auto;'>Controls</th>
				<th id=\"T" . $tb . "colH1\" class=\"showItTab\" style=\"padding:5px;font-weight:bold;\">
			";
			do {
				$jF = $j;

				//Look for exclusions
				$ex = 0;
				for ($e=0;$e<$exclusionAllno;$e++){
					if (pg_field_name($res,$j)==$exclusionAll[$e]){
						$ex = 1;
					}
				}
				$colNo2 = $colNo2 - $ex;
				if ($ex==1){
					$j = $j + 1;
				} else {
					if ($hideNow == 0) {
						print "<th id=\"T" . $tb . "col" . $ex2 . "\" width=\"0\" class=\"showItTab\" style=\"padding:5px; font-weight:bold;\"><span style='white-space:nowrap;'>";
					} else {
						print "<th id=\"T" . $tb . "col" . $ex2 . "\" width=\"0\" class=\"showItTab\" style=\"padding:5px; font-weight:bold;\"><span style='white-space:nowrap;'>";
					}
					$tmpcolName = pg_field_name($res,$j);
					print $tmpcolName;
					//Add the sorting images here
					$sortCheck = explode(",", $$tabRef);
					if(is_array($sortCheck)){
						$sortImg = "";
						for($si=0;$si<count($sortCheck);$si++){
							if(strpos($sortCheck[$si], $tmpcolName)){
								if(strpos($sortCheck[$si], "ASC")){
									$sortImg = "../../apps/img/sort-asc.png";
								} else {
									$sortImg = "../../apps/img/sort-dsc.png";
								}
							} 
						}
						if ($sortImg === "") {
							$sortImg = "../../apps/img/no-sort.png";
						}
					} else {
						//May be a single sort or none
						if(strpos($sortCheck, $tmpcolName)){
							if(strpos($sortCheck, "ASC")){
								$sortImg = "../../apps/img/sort-asc.png";
							} else {
								$sortImg = "../../apps/img/sort-dsc.png";
							}
						} else {
							$sortImg = "../../apps/img/no-sort.png";
						}
					}
					print "<img id=\"imgT" . $tb . "-" . $tmpcolName . "\" src=\"" . $sortImg . "\" onclick=\"sortcol('T" . $tb . "-" . $tmpcolName . "')\"/></span>";
					print "</th>";
					$j = $j + 1;
					$ex2 = $ex2 + 1;
				}

				//This enforces the maximum columns  - Not used
				//if ($j > $maxCol){
				//	$hideNow = 1;
				//}
			} while ($j < $colNo);
			print "<th id=\"T" . $tb . "colH2\" class=\"showItTab\" style=\"height: 16px; padding:5px;font-weight:bold;\"></th>
			</tr>";
			
			//Then we create the data section
			for ($i=0;$i<$rowNo;$i++){
				
				//We need to pickup the status value
				for ($sf=0;$sf<$colNo;$sf++){
					if (pg_field_name($res,$sf)==$statusField[$tb] ) {
						$CurrStatus = pg_fetch_result($res,$i,$sf);
					}
				}
				
				if ($currGID == $gidArray[$lower + $i]){
					print "<tr class='selectedRow'>";
				} else {
					print "<tr class='mainRow'>";
				}
				
				//Some buttons go at the front of each row
				print "<td style='width: 150px; max-width: 150px; overflow: auto;'>";

				//Is this a banned function?
				$tmFun = 0;
				if ($loadEdits != true) {
					$tmFun = 1;
				}
				for ($fe=0;$fe<$functionExno;$fe++) {
					if ($functionEx[$fe] == 'updateStatus') {
						$tmFun = 1;
					}
				}
				if ($tmFun == 0){
					print "<select id='rec_stat". $gidArray[$lowers[$tb] + $i] . "' name='rec_stat". $gidArray[$lowers[$tb] + $i] . "' onclick='changeSbutt(\"statusSpan" . $i . "-" . $tb ."\")'>";

					$sd = 0;
					for ($sv=0;$sv<$statusValueno;$sv++){
						if (trim($statusTable[$sv])==trim($table)) {
							//This checks that the status value applies to the current table
							if ($statusAvail[$sv]==1){
								if ($sv==($statusValueno-1)) {
									if($sd == 0) {
										print "<option selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . "</option>";
									} else {
										print "<option value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . "</option>";
									}
								} elseif ($statusValue[$sv]==trim($CurrStatus)) {
									print "<option selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . "</option>";
									$sd = 1;
								} else {
									print "<option value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . "</option>";
								}
							} else{
								if ($sv==($statusValueno-1)) {
									if($sd == 0) {
										print "<option selected='selected' disabled='disabled' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . "</option>";
									} else {
										print "<option disabled='disabled' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . "</option>";
									}
								} elseif ($statusValue[$sv]==trim($CurrStatus)) {
									print "<option selected='selected' disabled='disabled' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . "</option>";
									$sd = 1;
								} else {
									print "<option disabled='disabled' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . "</option>";
								}
							}
						}
					}
					$callerrow = "rec_stat". $gidArray[$lowers[$tb] + $i];
					// Deal with views Query
					if(strrpos($table, "_view")!=false){
						$qtable = substr($table,0,strrpos($table, "_view"));
					} else {
						$qtable = $table;
					}
					// Query
					print "</select><br />
					<span id=\"statusSpan" . $i . "-" . $tb . "\" class=\"hideIt\"><input type=\"button\" onclick=\"gedCall('" . $qtable . "', 'supdate', '" . $gidArray[$lowers[$tb] + $i] . "', '" . $callerrow . "')\" value=\"Change Status\" /><br /></span>";
				}
				//Is this a banned function?
				$tmFun = 0;
				if ($loadEdits != true) {
					$tmFun = 1;
				}
				for ($fe=0;$fe<$functionExno;$fe++) {
					if ($functionEx[$fe] == 'deleteRow') {
						$tmFun = 1;
					}
				}
				if ($tmFun == 0){
					print "<input type=\"button\" onclick=\"gedCall('" . $qtable . "', 'drop', '" . $gidArray[$lowers[$tb] + $i] . "')\" value=\"Delete Row\" /><br />";
				}

				//Is this a banned function?
				$tmFun = 0;
				if ($loadEdits != true) {
					$tmFun = 1;
				}
				for ($fe=0;$fe<$functionExno;$fe++) {
					if ($functionEx[$fe] == 'updateRow') {
						$tmFun = 1;
					}
				}
				if ($tmFun == 0){
					print "<input type=\"button\" onclick=\"updateRow('" . $table . "','" . $gidArray[$lowers[$tb] + $i] . "')\" value=\"Update Row\" /></td>";
				}

				//We are now having scrolling tables rather than wrapped tables
				print "<td headers=\"T" . $tb . "colH1\" style=\"height:100px; max-height:100px; padding:5px;\" class=\"T" . $tb . "back-dis\" onmouseover=\"dynaScriptToggleCols('back', " . $colNo . ", " . $maxCol . ", " . $tb . ")\" onclick=\"dynaScriptToggleCols('back', " . $colNo . ", " . $maxCol . ", " . $tb . ")\"></td>";
				
				//This works out the number of excluded columns
				$ex = 0;
				for ($e=0;$e<$exclusionAllno;$e++){
					if (pg_field_name($res,$j)==$exclusionAll[$e]){
						$ex = $ex + 1;
					}
				}

				//This loop deals with the data
				$j = 0;
				$hideNow = 0;
				$ex2 = 0;
				do {
					//Look for exclusions
					$ex = 0;
					for ($e=0;$e<$exclusionAllno;$e++){
						if (pg_field_name($res,$j)==$exclusionAll[$e]){
							$ex = 1;
						}
					}

					if ($ex==1){
						$j = $j + 1;
					} else {
						if ($hideNow == 0) {
							// This is a standard record in the table
							print "<td headers=\"T" . $tb . "col" . $ex2 . "\" style=\"height:100px; max-height:100px; padding:5px;\">";
						} else {
							// This is hidden?
							print "<td headers=\"T" . $tb . "col" . $ex2 . "\" style=\"height:100px; max-height:100px; padding:5px;\">";
						}

						if (pg_field_name($res,$j)=='gid') {
							$gid = pg_fetch_result($res,$i,$j);
						}

						if (pg_field_name($res,$j)==$statusField[$tb]) {
							for ($sv=0;$sv<$statusValueno;$sv++){
								if ($statusValue[$sv]==trim(pg_fetch_result($res,$i,$j))){
									print $statusText[$sv];
								}
							}
						} else {
							print pg_fetch_result($res,$i,$j);
						}

						print "</td>";
						$j = $j + 1;
						$ex2 = $ex2 + 1;
					}
					//This enforces the maximum columns - not used
					//if ($j > $maxCol){
					//	$hideNow = 1;
					//}
				} while ($j < $colNo);
			
				//Finally we add the forward buttons
				print "<td headers=\"T" . $tb . "colH2\" style=\"height:100px; max-height:100px; padding:5px;\" class=\"T" . $tb . "forward\" onmouseover=\"dynaScriptToggleCols('forward', " . $colNo . ", " . $maxCol . ", " . $tb . ")\" onclick=\"dynaScriptToggleCols('forward', " . $colNo . ", " . $maxCol . ", " . $tb . ")\"></td>
				</tr>
				";
			}
			print "</tbody></table>
			\n";

			// Free resultset
			pg_free_result($res);

			// Closing connection
			pg_close($dbconn);
			if ($tb == 0){
				$colNoStr = $colNo2;
			} else {
				$colNoStr .= '|' . $colNo2;
			}
		}
		print "<img src='../../apps/functions/blank.jpg' onload=\"dynaToggleCols(" . $tableLoopsno . ", '" .  $colNoStr . "')\" />
		";
		break;

	case 'geomsave':
		//Please note, dynamite.php will fire once this form has loaded to populate the records
		//Set res to be filled with the records from the main table.
		$query = "SELECT * FROM " . $table . ";";
		$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
		$meta = array_values(pg_meta_data($dbconn, $table));
		
		//How many rows / columns?
		$colNo = pg_num_fields($res);
			
		//Now we set up a special edit form that 
		$j = 0;
		$j2 = 0;
		while ($j < $colNo) {
			//Look for exclusions
			$ex = 0;
			for ($e=0;$e<$exclusionAllno;$e++){
                //we only disable fields in this version for compatibility
			}
			if ($ex==1){
				$j = $j + 1;
			} else {
			}
			
			if ($j2 == 0) {
				//Build the name and type arrays
				$fnarray = array($j=> pg_field_name($res, $j)); 
				$ftcarray = array($j=> $meta[$j][3]);
				$ftarray = array($j=> pg_field_type($res, $j));
			} else {
				$fnarray[$j] = pg_field_name($res, $j);
				$ftcarray[$j] = $meta[$j][3];
				$ftarray[$j] = pg_field_type($res, $j);
			}
			$j2 = 1;
			$j = $j + 1;
		}

		//This is the information div
		print "<form id=\"GeomEditForm\" enctype=\"multipart/form-data\">\n
		<div id='EditInfo'>\n";

		print "<table style='table-layout: fixed;'>\n";
		//Insert a submit button
		print "<tr><td></td><td colspan='2'><div id='geomPrev' style='display:inline; visibility:hidden;'><input type='button' onclick='geomEditForm(\"b\",\"" . $table . "\")' value='Previous Edit' />          |          </div><div id='geomNext' style='display:inline;visibility:visible;'><input type='button' onclick='geomEditForm(\"f\",\"" . $table . "\")' value='Next Edit' /></div><div id='geomSave' style='display:inline;visibility:hidden;'><input type='button' value='Save Edits' onclick='geomEditForm(\"s\",\"" . $table . "\")' /></div>          |          <input type='button' onclick='geomEditForm(\"cancel\")' value='Delete Edit' /></td>";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		}
		
		//This section draws a map window on the right so we know which record we are editing
		print "<td rowspan='";
		print $colNo + 1;
		print "' style='vertical-align: top'><div id='geomEditMap' class='geomEditMap' style='width: " . $miniMapWidth . "px; height: " . ($miniMapWidth * 0.75) . "px; border: 1px solid gray;' /></td></tr>\n";

		$j = 0;
		while ($j < $colNo) {
			//Look for exclusions
			$ex = 0;
			for ($e=0;$e<$exclusionAllno;$e++){
				if (pg_field_name($res,$j)==$exclusionAll[$e]){
					$ex = 1;
				}
			}
			//Look for grey fields
			$dis = 0;
			if (substr($table,0,2)=='jt'){
				if (pg_field_name($res,$j)=='gid'){
					$dis = 1;
				}
			} else {
				for ($e=0;$e<$disno;$e++){
					if (pg_field_name($res,$j)==$disa[$e]){
						$dis = 1;
					}
				}
			}
			//Look for lookup fields and options
			//First, is this an excluded table?
			$notnow = array();
			for ($s=0;$s<$lookupColno;$s++){
				if ($table == $lookupTab[$s]){
					$notnow[$s] = 1;
				} else {
					$notnow[$s] = 0;
				}
			}
			$sel = 0;
			for ($s=0;$s<$lookupColno;$s++){
				if ($notnow[$s]==0 and $fnarray[$j]==$lookupCol[$s]) {
					$sel = 1;
					$arrRef = $s;
				} elseif ($notnow[$s]==0 and $fnarray[$j]==$lookupRes[$s]){
					$sel = 2;
					$arrRef = $s;
				}
			}
			$lookupCountA = 'lookupCount' . $arrRef;
			for($s=0;$s<$optionsListColIt;$s++){
				if ($notnow[$s]==0 and $fnarray[$j]==$optionsListCol[$s]) {
					$sel = 3;
					$OLN = $optionsListColLoop[$s]; //Get the loop number 
				}
			}

			//Pickup the value
			$formValue = trim(pg_fetch_result($res,0,$j));
			/*So; we are ready to output an edit form. We need to set out the concept here
			There are 5 general types:
				H = Hidden
				S = Select Options
				T = Free Text
				O = Option / boolean
				C = character
			
			These are defined based on the html form elements required to capture the data
			and it is important later when saving the values
			
			The id for each field is of the type 'general type' + 'field name' 
			for example recstatus might be a select list, this would give an id of 'Srecstatus'.
			*/
			
			//Output the form
			if ($ex==1){
				print "<input type='hidden' id='H" . $fnarray[$j] . "' name='H" . $fnarray[$j] . "' value='" . $formValue . "' />";
			} elseif ($dis==1) {
				//Disabled Fields (grey)
				if ($meta[$j]['not null']==1){
					print "<tr><td class='EditHeader'><b><i>" . $fnarray[$j] . "</b></i></td>";
				} else {
					print "<tr><td class='EditHeader'>" . $fnarray[$j] . "</td>";
				}
				if ($sel==1){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrA}[$s])==$formValue) {
								print "<option disabled='disabled'  selected='selected' value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							} else {
								print "<option disabled='disabled'  value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							}
						}
					print "</select>
					</td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrB}[$s])==$formValue) {
								print "<option disabled='disabled'  selected='selected' value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							} else {
								print "<option disabled='disabled'  value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							}
						}
					print "</select>
					</td></tr>\n";
				} elseif ($fnarray[$j] == 'recstatus') {
					//This is a status column and there may be lookup of values
					if ($statusValueno > 0) {
						print "<td colspan='2' class='EditValue'>
						<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($sv=0;$sv<$statusValueno;$sv++){
							if (trim($statusTable[$sv])==$table) {
								//This checks that the status value applies to the current table
								if (trim($statusValue[$sv])==$formValue) {
									//No second loop here, it is all disabled!
									print "<option disabled='disabled' selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
								} else {
									print "<option disabled='disabled'  value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
								}
							}
						}
						print "</select>
						</td></tr>\n";
					} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="time") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="date") {
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
					} else {
						//Anything else
						print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
					}
				} elseif ($sel==3) {
					//Option List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if (trim($optionsListOp[$s])==$formValue) {
									print "<option disabled='disabled'  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								} else {
									print "<option disabled='disabled'  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								}
							}
						}
					print "</select>
					</td></tr>\n";
				} elseif ($ftarray[$j]=="text") {
					//Normal Text
					print "<td colspan='2' class='EditValue'><textarea class='disabled' readonly='readonly' rows='5' cols='" . $colsSize . "' id='T" . $fnarray[$j] . "' name='T" . $fnarray[$j] . "'>" . $formValue . "</textarea></td></tr>\n";
				} elseif ($ftarray[$j]=="bool") {
					//Booleans (yes/no)
					if ($formValue=='t') {
						print "<td colspan='2' class='EditValue'><input type='checkbox' checked='checked' class='disabled' readonly='readonly' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='checkbox' class='disabled' readonly='readonly' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td></tr>\n";
					}
				} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="time") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="date") {
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
				} else {
					//Anything else
					print "<td colspan='2' class='EditValue'><input type='textbox' class='disabled' readonly='readonly' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
				}
			} else {
				//Enabled fields
				if ($meta[$j]['not null']==1){
					print "<tr><td class='EditHeader'><font color='red'><b><i>" . $fnarray[$j] . "</b></i></font></td>";
				} else {
					print "<tr><td class='EditHeader'>" . $fnarray[$j] . "</td>";
				}
				if ($sel==1){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrA}[$s])==$formValue) {
								print "<option selected='selected' value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							} else {
								print "<option value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
							}
						}
					print "</select>
					</td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							if (trim(${$arrB}[$s])==$formValue) {
								print "<option selected='selected' value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							} else {
								print "<option value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
							}
						}
					print "</select>
					</td></tr>\n";
				} elseif ($fnarray[$j] == 'recstatus') {
					//This is a status column and there may be lookup of values
					if ($statusValueno > 0) {
						print "<td colspan='2' class='EditValue'>
						<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($sv=0;$sv<$statusValueno;$sv++){
							//if (trim($statusTable[$sv])==trim($multiTableName[$tb])) { We don't need this any more as the multiTable is recorded in the $table variable if applicable
							if (trim($statusTable[$sv])==trim($table)) {
								//This checks that the status value applies to the current table
								if ($statusAvail[$sv] == 1) {
									if (trim($statusValue[$sv])==$formValue) {
										print "<option selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									} else {
										print "<option value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									}
								} else {
									if (trim($statusValue[$sv])==$formValue) {
										print "<option disabled='disabled' selected='selected' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									} else {
										print "<option disabled='disabled' value='" . $statusValue[$sv] . "'>" . $statusText[$sv] . " (" . $statusValue[$sv] . ")</option>";
									}
								}
							}
						}
						print "</select>
						</td></tr>\n";
					} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a number</font></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="time") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a timestamp (yyyy-mm-dd hh:mm:ss<a href='#' alt='You may need to add the timezone'>*</a>)</font></td></tr>\n";
					} elseif (substr($ftarray[$j],0,4)=="date") {
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a date (yyyy-mm-dd)</font></td></tr>\n";
					} else {
						//Anything else
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
					}
				} elseif ($sel==3) {
					//Option List	
					print "<td colspan='2' class='EditValue'>
					<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
						print "<option value='Select'>Please Select an Option</option>";
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if (trim($optionsListOp[$s])==$formValue) {
									print "<option  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								} else {
									print "<option  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								}
							}
						}
					print "</select>
					</td></tr>\n";
				} elseif ($ftarray[$j]=="text") {
					//Normal Text
					print "<td colspan='2' class='EditValue'><textarea  rows='5' cols='" . $colsSize . "' id='T" . $fnarray[$j] . "' name='T" . $fnarray[$j] . "'>" . $formValue . "</textarea></td></tr>\n";
				} elseif ($ftarray[$j]=="bool") {
					//Booleans (yes/no)
					if ($formValue=='t'){
						print "<td colspan='2' class='EditValue'><input type='checkbox' checked='checked' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td></tr>\n";
					} else {
						print "<td colspan='2' class='EditValue'><input type='checkbox' id='O" . $fnarray[$j] . "' name='O" . $fnarray[$j] . "' value='" . $fnarray[$j] . "' /></td></tr>\n";
					}
				} elseif (substr($ftarray[$j],0,3)=="int" || substr($ftarray[$j],0,5)=="float" || $ftarray[$j] == "numeric") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a number</font></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="time") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a timestamp (yyyy-mm-dd hh:mm:ss<a href='#' alt='You may need to add the timezone'>*</a>)</font></td></tr>\n";
				} elseif (substr($ftarray[$j],0,4)=="date") {
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . ($inputSize * 0.75) . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /><font color='grey'>Please add a date (yyyy-mm-dd)</font></td></tr>\n";
				} else {
					//Anything else
					print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $formValue . "' /></td></tr>\n";
				}
			}
			$j = $j + 1;
		}
		//Insert a submit button
		print "<tr><td><input type='hidden' id='tmpgid' value='' /><input type='hidden' id='tmptable' value='' /><input type='hidden' id='Itable' name='Itable' value='" . $table . "' /><input type='hidden' id='Iproj' name='Iproj' value='" . $proj . "' /></td><td><div id='geomPrev2' style='display:inline; visibility:hidden;'><input type='button' onclick='geomEditForm(\"b\",\"" . $table . "\")' value='Previous Edit' />          |          </div><div id='geomNext2' style='display:inline;visibility:visible;'><input type='button' onclick='geomEditForm(\"f\",\"" . $table . "\")' value='Next Edit' /></div><div id='geomSave2' style='display:inline;visibility:hidden;'><input type='button' value='Save Edits' onclick='geomEditForm(\"s\",\"" . $table . "\")' /></div>          |          <input type='button' onclick='geomEditForm(\"cancel\",\"" . $table . "\")' value='Delete Edit' /></td>
		";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		}
		print "</tr>\n";
		print "</table>\n";

		print "</div>\n";
		print "<div id='blankDiv'></div>";

		// Closing connection
		pg_free_result($res);
		pg_close($dbconn);
		break;
	case 'blank':
		print "<div id='holdscreen'><img src='../../apps/functions/loader.gif' /><br />
		 <b><font size='3' color='#000080'>Please wait...</font></b>
		<input type='hidden' id='Itable' name='Itable' value='" . $table . "' /><input type='hidden' id='Iproj' name='Iproj' value='" . $proj . "' /></div>";
		break;
	default:
		print "<img src='../../apps/functions/blank.jpg' onload=\"resetView('" . $table . "', " . $recNos[0] . ", " . $lowers[0] . ", 0)\" />";
		break;
endswitch;

print "<input type='hidden' id='dir' name='dir' value='forward' />
<input type='hidden' id='maxCol' name='maxCol' value='" . $maxCol . "' /><input type='hidden' id='ColEx' name='ColEx' value='" . count($exclusionAll) . "' /><input type='hidden' id='filterCk' name='filterCk' value='" . $filter . "' />
";

// Free resultset
pg_free_result($res);

// Closing connection
pg_close($dbconn);

?>
