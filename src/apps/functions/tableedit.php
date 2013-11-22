<?php
// attempt a connection
include '../../apps/functions/housekeeping.php';
ini_set('error_reporting', E_ALL & ~E_NOTICE);  //Stop logging notices for this script

// Variable read in from config.xml file
if (strpos($_SERVER['HTTP_REFERER'],"index.html?") != -1){
	$projectPath = substr($_SERVER['HTTP_REFERER'],0,strpos($_SERVER['HTTP_REFERER'],"index.html?")-1) . '/config.xml';
} else {
	$projectPath = $_SERVER['HTTP_REFERER'] . 'config.xml';
}
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

//Pick up the posted value
$table = $_POST['table'];
$function = $_POST['function'];
$filter = $_POST['filter'];
$recNo = $_POST['recNo'];
$lower = $_POST['lower'];
$status = $_POST['status'];
$gid = $_POST['gid'];
$sid = $_POST['sid'];
$selMode = $_POST['selMode'];
$mod_by = $_POST['mod_by'];
$tabFilter = '';
$tabFilter = $_POST['tabF'];
$projMap = $_POST['geom'];
if (is_numeric($_POST['currGID'])) {
	$currGID = intval($_POST['currGID']); //Force this to be a number
} else {
	$currGID = -1;
}
$popF = explode("^", $_POST['popF']);
$prepopF = array();
$prepopV = array();
$i=0;
foreach ($popF as $item){
	//This should be specified as pairs, fieldname then default pre-populate value
	if ($i==0){
		array_push($prepopF,$item);
	} else {
		array_push($prepopV,$item);
	}
	
	if ($i == 0){
		$i = 1;
	} else {
		$i = 0;
	}	
}

//Set up the width values
//One value should be passed
$tableWidth = $_POST['tableWidth'];
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
$targetList = array();
$replaceCol = array();
$replaceTable = array();
$statusList = array();

$lookups = '';
$lookups = $_POST['lookup'];
if ($lookups !==''){
	$lookups = explode("^", $lookups);
	$lookupStatus='';
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
				//Check for a Works Status
				if ($opt2 == 'worksstatus') {
					$lookupStatus='worksstatus';
				}
				array_push($$currCat, $opt2);
			}
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
	  
//There is a second list for status as this may be a special case
//Was it done automatically?
$statusValueno = count($statusValue);
if ($statusValueno == 0){
	//Not done automatically so we will lookup from the config
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
}

//Columns to exclude from the view table
$exclusion = array();
$exclusionA = explode("^", $_POST['excl']);
foreach ($exclusionA as $opt){
	array_push($exclusion, $opt);
}
$exclusionT = array();

//foreach ($xml->exclusions->exclusion as $opt) {
//	array_push($exclusion, $opt);
//}
foreach ($exclusion as $opt) {
	array_push($exclusionT, $table);
}
$exclusionno = count($exclusion);

//Columns to grey out
$disa = array(); 
$disaT = array();
foreach ($xml->disable->option as $opt) {
	array_push($disa, $opt);
	array_push($disaT, $table);
}
//foreach ($xml->disable->optionT as $opt) {
	
//}
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

//Check for multiple tables  **No Multiple Tables Here**
$multiTableName = array();
//foreach ($xml->table->tableName as $opt) {
	array_push($multiTableName, $table);
//}
$tableGeomEdit = array();
//foreach ($xml->table->tableGeom as $opt) {
    array_push($tableGeomEdit, 'No');
//}

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

//functions to exclude
$functionEx = array();
foreach ($xml->functions->functionEx as $opt) {
	array_push($functionEx, $opt);
}
$functionExno = count($functionEx);

//Other settings
//$default_ex = $xml->other->default_ex;
$geom_field = $xml->other->geom_field;
$proj = intval($xml->other->proj);
$maxCol = 0; //We no longer use this value

//We may now have multiple lower and recNo values to we are calculating an array splitting the values at each |
$recNos = array();
$lowers = array();
$order_bys = array();
foreach ($xml->table as $opt){
	array_push($recNos, $opt->recNo);
	array_push($lowers, $opt->lower);
	array_push($order_bys, $opt->order_by);
}
if($multiTable === 0){
	//Single table so first records
	$recNo = $recNos[0];
	$lower = $lowers[0];
}

$nofilter = 0;
$filterLen = strlen($filter);
$quoteIt = 0;
//Check for a filter
if ($filterLen>1) {
    //Translate the filter
    //$filter = str_replace("`"," ",$filter); //We are replacing the spaces to help with compatibility
    $opTranslator = array('Equal','Not`equal','Greater`than`or`equal','Less`than`or`equal','Greater`than','Less`than','LIKE','BETWEEN');
    $opTranslator2 = array('=','<>','>=','<=','>','<',' LIKE ', ' BETWEEN ');
    $opTranslatorno = count($opTranslator);
    for ($ot=0;$ot<$opTranslatorno;$ot++){
        if (strstr($filter,$opTranslator[$ot])){
            $filter = str_replace($opTranslator[$ot],$opTranslator2[$ot],$filter);
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
			$query2 = 'SELECT ST_AsText(the_geom) as the_geometry FROM ' . $qtable . ' WHERE gid=' . $gid;
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
		//Insert a submit buttom
		print "<tr><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"update\")' value='Update Row' /></td><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"reset\")' value='Cancel' /></td>";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		}

		//This section draws a map window on the right so we know which record we are editing
		print "<td></td><td rowspan='";
		print $colNo + 1;
		//print "' style='vertical-align: top'><div id='EditMap' class='EditMap' style='width: " . $miniMapWidth . "px; height: " . ($miniMapWidth * 0.75) . "px; border: 1px solid gray;' /></td></tr>\n";
		print "' style='vertical-align: top'><div id='EditMap' class='EditMap' style='width: " . $miniMapWidth . "px; height: " . ($miniMapWidth * 0.75) . "px;' /></td></tr>\n";

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
			for ($e=0;$e<$disno;$e++){
				if (pg_field_name($res,$j)==$disa[$e]){
					$dis = 1;
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
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",1)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
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
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",1)' />";
					}
					print "</td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",1)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
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
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",1)' />";
					}
					print "</td></tr>\n";
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
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",1)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
						print "<option value='Select'>Please Select an Option</option>";
						//Get the lookup list
						for ($s=0;$s<count($optionListLink);$s++){
							if ($optionsListColLoop[$s]==$OLN){
								$OLL = $optionListLink[$s];
							}
						}
						
						//Prepare the options
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if ($optionListID[$s]==$OLL || $OLL == "-"){
									if (trim($optionsListOp[$s])==$formValue) {
										print "<option disabled='disabled'  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
									} else {
										print "<option disabled='disabled'  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
									}
								}
							}
						}
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",1)' />";
					}
					print "</td></tr>\n";
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
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",0)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
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
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",0)' />";
					}
					print "</td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",0)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
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
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",0)' />";
					}
					print "</td></tr>\n";
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
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",0)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
						print "<option value='Select'>Please Select an Option</option>";
						//Get the lookup list
						for ($s=0;$s<count($optionListLink);$s++){
							if ($optionsListColLoop[$s]==$OLN){
								$OLL = $optionListLink[$s];
							}
						}
						
						//Prepare the options
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if ($optionListID[$s]==$OLL || $OLL == "-"){
									if (trim($optionsListOp[$s])==$formValue) {
										print "<option  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
									} else {
										print "<option  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
									}
								}
							}
						}
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",0)' />";
					}
					print "</td></tr>\n";
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
		//Insert a submit buttom
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
			//print "<img src=\"../../apps/functions/blank.jpg\" onload='editMap(\"" . pg_fetch_result($res2,0,0) . "\")' />\n";
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
		//Insert a submit buttom
		print "<tr><td>";
		if (count($prepopF)==0){
			print"<input type='button' onclick='gedCall(\"" . $qtable . "\", \"insert\",0,0,0)' value='Insert Row' />";
		} else {
			print"<input type='button' onclick='gedCall(\"" . $qtable . "\", \"insert\",0,0,1)' value='Insert Row' />";
		}
		print"</td><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"reset\")' value='Cancel' /></td>
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
			for ($e=0;$e<$disno;$e++){
				if (pg_field_name($res,$j)==$disa[$e]){
					$dis = 1;
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
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",1)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							print "<option disabled='disabled'  value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
						}
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",1)' />";
					}
					print "</td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",1)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							print "<option disabled='disabled'  value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
						}
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",1)' />";
					}
					print "</td></tr>\n";
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
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",1)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						//Get the lookup list
						for ($s=0;$s<count($optionListLink);$s++){
							if ($optionsListColLoop[$s]==$OLN){
								$OLL = $optionListLink[$s];
							}
						}
						
						//Prepare the options
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if ($optionListID[$s]==$OLL || $OLL == "-"){
									print "<option disabled='disabled'  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								}
							}
						}
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",1)' />";
					}
					print "</td></tr>\n";
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
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",0)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							print "<option value='" . ${$arrA}[$s] . "'>" . ${$arrA}[$s] . " (" . ${$arrB}[$s] . ")</option>";
						}
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",0)' />";
					}
					print "</td></tr>\n";
				} elseif ($sel==2){
					//Lookup List
					print "<td colspan='2' class='EditValue'>
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",0)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						for ($s=0;$s<$$lookupCountA;$s++){
							$arrA = 'lookupArrayCol' . $arrRef;
							$arrB = 'lookupArrayRes' . $arrRef;

							print "<option value='" . ${$arrB}[$s] . "'>" . ${$arrB}[$s] . " (" . ${$arrA}[$s] . ")</option>";
						}
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",0)' />";
					}
					print "</td></tr>\n";
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
					";
					if($fnarray[$j]=='workstype'){
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "' onchange='updateVariableStatusCall(\"S" . $fnarray[$j] . "\",0)'>";
					} else {
						print "<select style='width: " . $formWidth . "px' id='S" . $fnarray[$j] . "' name='S" . $fnarray[$j] . "'>";
					}
						print "<option value='Select' selected='selected'>Please Select an Option</option>";
						//Get the lookup list
						for ($s=0;$s<count($optionListLink);$s++){
							if ($optionsListColLoop[$s]==$OLN){
								$OLL = $optionListLink[$s];
							}
						}
						
						//Prepare the options
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if ($optionListID[$s]==$OLL || $OLL == "-"){
									print "<option  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
								}
							}
						}
					print "</select>";
					if ($fnarray[$j] == 'worksstatus'){
						print "<img src='../../apps/functions/blank.jpg' style='display:none' onLoad='updateVariableStatusCall(\"Sworkstype\",0)' />";
					}
					print "</td></tr>\n";
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
					//OK we may be pre-populating (which currently only works here).
					$skip = 0;
					for($p=0;$p<count($prepopF);$p++){
						if($prepopF[$p]==$fnarray[$j]){
							print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='" . $prepopV[$p] . "' /></td></tr>\n";
							$skip = 1;
						}
					}
					if ($skip == 0){
						print "<td colspan='2' class='EditValue'><input type='textbox' size='" . $inputSize . "' id='C" . $fnarray[$j] . "' name='C" . $fnarray[$j] . "' value='' /></td></tr>\n";
					}
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
		
		//Insert a submit buttom
		print "<tr><td><input type='hidden' id='Itable' name='Itable' value='" . $table . "' /><input type='hidden' id='Iproj' name='Iproj' value='" . $proj . "' />";
		if (count($prepopF)==0){
			print"<input type='button' onclick='gedCall(\"" . $qtable . "\", \"insert\",0,0,0)' value='Insert Row' />";
		} else {
			print"<input type='button' onclick='gedCall(\"" . $qtable . "\", \"insert\",0,0,1)' value='Insert Row' />";
		}
		print"</td><td><input type='button' onclick='gedCall(\"" . $qtable . "\", \"reset\")' value='Cancel' /></td>
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

			//open a connection to the database server
			$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
			
			//How many records are in this table?
			if ($tabFilter == "") {
				if ($nofilter == 1) {
					if ($tableLooper == 0 && $multiTable == 0){
						$query = 'SELECT gid, mod_by FROM ' . $table . ' ORDER BY gid ASC ;';
					} elseif ($multiTable == 0) {
						$query = 'SELECT gid, mod_by FROM ' . $table . ' WHERE ' . $tableLoops[$tb]  . ' ORDER BY gid ASC ;';
					} else {
						$table = $multiTableName[$tb];
						$query = 'SELECT gid, mod_by FROM ' . $table . ' ORDER BY gid ASC ;';
					}
				} else {
					$query = 'SELECT gid, mod_by FROM ' . $table . ' WHERE ' . $filter  . ' ORDER BY gid ASC;';
				}
			} else {
				$query = 'SELECT * FROM ' . $table . ' WHERE ' . $tabFilter . ' ORDER BY gid ASC;';
			}
			$res = pg_query($dbconn, $query) or header( print "<img src=\"../../apps/functions/blank.jpg\" onLoad=\"resetView('" . $table . "', " . $recNos[$tb] . ", " . $lowers[$tb] . ", 0)\" />");
			$tabRows = pg_num_rows($res);
			
			//Generate a GID array
			$gidArray = array();
			$mod_byArray = array();
			$currGID2 = -1;
			for ($i=0;$i<$tabRows;$i++){
				array_push($gidArray, pg_fetch_result($res,$i,0));
				array_push($mod_byArray, pg_fetch_result($res,$i,1));
			}
			// Free resultset
			pg_free_result($res);
			
			if ($tabFilter ==''){
				if ($nofilter == 0) {
					$query = 'SELECT * FROM ' . $table . ' WHERE ' . $filter . ' ORDER BY gid ASC limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
				} else {
					// Query
					if ($tableLooper == 0){
						$query = 'SELECT * FROM ' . $table . ' ORDER BY gid ASC limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
					} else {
						$query = 'SELECT * FROM ' . $table . ' WHERE ' . $tableLoops[$tb] . ' ORDER BY gid ASC limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
					}
				}
			} else {
				$query = 'SELECT * FROM ' . $table . ' WHERE ' . $tabFilter . ' ORDER BY gid ASC limit ' . $recNos[$tb] . ' offset ' . $lowers[$tb] . ';';
			}
			$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());

			//How many rows / columns?
			$rowNo = pg_num_rows($res);
			$colNo = pg_num_fields($res);
			$colNo2 = $colNo;
			
			//We may have a special case where we need to work out listid numbers
			$gidF = '';
			$workstypeF = '';
			$VstatusList = [];
			if ($lookupStatus != ''){
				//Which columns are we using
				for($i=0;$i<$colNo;$i++){
					if (pg_field_name($res, $i)=='gid'){
						$gidF = $i;
					} elseif (pg_field_name($res, $i)=='workstype'){
						$workstypeF = $i;
					}
				}
				
				//Get the listid lookup
				$tmpQ = "Select workstype, listid from jt_workstype;";
				$tmpRes = pg_query($dbconn, $tmpQ) or die('Query failed: ' . pg_last_error());
				$tmpRowNo = pg_num_rows($tmpRes);
				
				//We now want to create an array with all the work type listid's but we want the key to be the gid (which is unique)
				for($i=0;$i<$rowNo;$i++){
					//We need to lookup the list ID from the workstype
					$workstypeId = 1; //Default listid in case of failure to find a match for this row
					for($i2=0;$i2<$tmpRowNo;$i2++){
						if (pg_fetch_result($tmpRes,$i2,0) == pg_fetch_result($res,$i,$workstypeF)){
							$workstypeId = pg_fetch_result($tmpRes,$i2,1); //Pickup the listid
						}
					}
					//Push the value into the associative array
					$VstatusList[pg_fetch_result($res,$i,$gidF)] = $workstypeId;
				}
				
				//Lets create the listid array here
				$tmpQ2 = "select worksstatus, listid from jt_worksstatus ORDER BY sortid ASC;";
				$tmpRes2 = pg_query($dbconn, $tmpQ2) or die('Query failed: ' . pg_last_error());
				$tmpRowNo2 = pg_num_rows($tmpRes2);
				
				$statusValA = [];
				$listIDValA = [];
				for($i=0;$i<$tmpRowNo;$i++){
					array_push($statusValA, pg_fetch_result($tmpRes2,$i,0));
					array_push($listIDValA, pg_fetch_result($tmpRes2,$i,1));
				}				
			}
			
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
			print "<table bgcolor='#C0C0C0' width='100%'><tr>
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
				if ($xml->other->photoscroll == "True") {
					print "</td><td>
						<input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" />
					";
				}
				print "</td><td>
				";
					//<input type=\"button\" value=\"Add a Filter\" onclick=\"tableFilter('" . $table . "')\" /> Currently removed as the scripting required is too great
				print "</td><td>
				";
					//<input type=\"button\" value=\"Return to Map\" onclick=\"return2Map('collapse', '" . $table . "')\" />"; No Return functions here
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
						print "<th id=\"T" . $tb . "col" . $ex2 . "\" width=\"0\" class=\"showItTab\" style=\"padding:5px; font-weight:bold;\">";
					} else {
						print "<th id=\"T" . $tb . "col" . $ex2 . "\" width=\"0\" class=\"showItTab\" style=\"padding:5px; font-weight:bold;\">";
					}
					print pg_field_name($res,$j);
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
				if (count($statusValue) == 0){
					//We need to not display the status option if there are no options
					$tmFun = 1;
				}
				if ($tmFun == 0){
					print "<select id='rec_stat". $gidArray[$lowers[$tb] + $i] . "' name='rec_stat". $gidArray[$lowers[$tb] + $i] . "' onclick='changeSbutt(\"statusSpan" . $i . "-" . $tb ."\")'>";
					
					if ($lookupStatus == ''){
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
					} else {
						//OK, this is a variable status and we need to work out the options here?
						$rowGID = $gidArray[$lowers[$tb] + $i];
						$rowListID = $VstatusList[$rowGID];
						
						//Loop through the options and add as required
						for ($slist=0;$slist<count($listIDValA);$slist++){
							if ($listIDValA[$slist] == $rowListID){
								//This is a status to include
								if (trim($CurrStatus)==$statusValA[$slist]){
									print "<option selected='selected' value='" . $statusValA[$slist] . "'>" . $statusValA[$slist] . "</option>";
								} else {
									print "<option value='" . $statusValA[$slist] . "'>" . $statusValA[$slist] . "</option>";
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
				print "<td headers=\"T" . $tb . "colH1\" style=\"height:100px; max-height:100px; padding:5px;\">
					<input type='button' id='backBut" . $tb . "' name='backBut" . $tb . "' value='<<' onclick='dynaScriptToggleCols(\"back\", " . $colNo . ", " . $maxCol . ", " . $tb . ")'  />
				</td>";
				
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

						print pg_fetch_result($res,$i,$j);

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
				print "<td headers=\"T" . $tb . "colH2\" style=\"height:100px; max-height:100px; padding:5px;\">
					<input type='button' id='forBut" . $tb . "' name='forBut" . $tb . "' value='>>' onclick='dynaScriptToggleCols(\"forward\", " . $colNo . ", " . $maxCol . ", " . $tb . ")' />
				</td>
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
		//Insert a submit buttom
		print "<tr><td></td><td><div id='geomPrev' style='display:inline; visibility:hidden;'><input type='button' onclick='geomEditForm(\"b\",\"" . $table . "\")' value='Previous Edit' />          |          </div><div id='geomNext' style='display:inline;visibility:visible;'><input type='button' onclick='geomEditForm(\"f\",\"" . $table . "\")' value='Next Edit' /></div><div id='geomSave' style='display:inline;visibility:hidden;'><input type='button' value='Save Edits' onclick='geomEditForm(\"s\",\"" . $table . "\")' /></div>          |          <input type='button' onclick='geomEditForm(\"cancel\")' value='Delete Edit' /></td>";
		if ($xml->other->photoscroll == "True") {
			print "<td><input type=\"button\" value=\"Show Photos\" onclick=\"photoswitch()\" /></td>
			";
		}
		
		//This section draws a map window on the right so we know which record we are editing
		print "<td rowspan='";
		print $colNo + 1;
		//print "' style='vertical-align: top'><div id='geomEditMap' class='geomEditMap' style='width: " . $miniMapWidth . "px; height: " . ($miniMapWidth * 0.75) . "px; border: 1px solid gray;' /></td></tr>\n";
		print "' style='vertical-align: top'><div id='geomEditMap' class='geomEditMap' style='width: " . $miniMapWidth . "px; height: " . ($miniMapWidth * 0.75) . "px;' /></td></tr>\n";

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
			for ($e=0;$e<$disno;$e++){
				if (pg_field_name($res,$j)==$disa[$e]){
					$dis = 1;
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
						//Get the lookup list
						for ($s=0;$s<count($optionListLink);$s++){
							if ($optionsListColLoop[$s]==$OLN){
								$OLL = $optionListLink[$s];
							}
						}
						
						//Prepare the options
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if ($optionListID[$s]==$OLL || $OLL == "-"){
									if (trim($optionsListOp[$s])==$formValue) {
										print "<option disabled='disabled'  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
									} else {
										print "<option disabled='disabled'  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
									}
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
						//Get the lookup list
						for ($s=0;$s<count($optionListLink);$s++){
							if ($optionsListColLoop[$s]==$OLN){
								$OLL = $optionListLink[$s];
							}
						}
						
						//Prepare the options
						for ($s=0;$s<$optionsListIt;$s++){
							if ($optionListNo[$s]==$OLN){
								if ($optionListID[$s]==$OLL || $OLL == "-"){
									if (trim($optionsListOp[$s])==$formValue) {
										print "<option  selected='selected' value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
									} else {
										print "<option  value='" . $optionsListOp[$s] . "'>" . $optionsListOp[$s] . "</option>";
									}
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
		//Insert a submit buttom
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
