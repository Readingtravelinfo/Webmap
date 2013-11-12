<?php
$location = 'D:\\webserver\\rbc_internet\\' . $_POST['loc'];
$file = $location . 'config.xml';

if(!file_exists($file)){
	  $map_definition = [
		"configuredMap" => ''
	  ];
	  echo json_encode($map_definition);
} else {
	//This loads the xml config into a vaiable which we can then read
	$config = simplexml_load_file($file);

	//We need to populate the form with the existing values but we will do this using Javascript
	//So at this point we are simply looking to create a well formed javascript object

	//This file has also been constructed to provide the API for the web Configuration files

	/*RBC GIS Server - Map Configuration API
	  Developed by PBA on Behalf of RBC
	  
	  First Version November 2013 - Author Paul Wittle
	  Add change log here...
	  
	  Configuration storage is as XML file stored in map application folder on the server
	  
	  General Notes:
		Unless specified all boolean questions should be answered as 'True' or 'False' with care
		to ensure that the case is correct; these records are marked (bool)
	*/
	  
	  /* *********Basic map definitions********* */
	  //Primarily stored under the other category this section includes titles and basic layout choices
	  $mD = [
		"appTitle" => $config->other->appTitle,  //Application Title
		"projectPath" => $config->other->projectPath,  //Relative URL; add this to https://geo.reading-travelinfo.co.uk to get the map address
		//We define the map projection in two forms; as an integer and also as a text string
		"proj" => $config->other->proj,  //Integer where British National Grid (OSGB) would be 27700 and WGS 84 would be 4326
		"projMap" => $config->other->projMap, //Text string with prefix of EPSG:
		//Although other projections can be used for reprojecting (if they are available by default in OpenLayers); the maps should be defined
		//in OSGB where possible as the bulk of the scripting is set up with this assumption and bounding boxes are set up on this basis.
		//If the map is to be reprojected this should be defined by specifying a reproject from variable as follows:
		"reproject" => $config->other->reproject, //Specify 'Yes' or 'No'
		"projMap2" => $config->other->projMap2, //Reproject from as text string with prefix of EPSG:
		//Please note; maps can not mix layers from different workspaces as this would cause issues when editing.
		"wfsedits" => $config->other->wfsedits, //This defines the relative URL to the GeoServer WFS engine used for editing the layers in this map
		"wmsbase" => $config->other->wmsbase, //This defines the relative URL to the GeoServer WMS engine
		//The next values relate to the interactions with the OpenLayers map itself
		"popupPan" => $config->other->popupPan, //Should the map pan to a feature when loading a popup? (bool)
		"popupDefault" => $config->other->popupDefault, //Should the popups be enabled when the map loads? (bool)
		//The next values relate to the map window and which panels should be included around the map
		"attribute" => $config->other->attribute, //Include attributes table button? (bool)
		"edits" => $config->other->edits, //Include edit button? (bool)
		"active_table" => $config->other->active_table, //Defines which table should be used when editing (although the user will be given option to override
		"ddFull" => $config->other->ddFull, //Provide full data download options in panel which includes shapefile and CSV? (bool)
		"photoscroll" => $config->other->photoscroll, //Include a photo scroller button? (bool)
		"photoscrollpath" => $config->other->photoscrollpath, //The photo scroller scans for all images in a directory; this value provides the relative URL
		"licence" => $config->other->licence, //Include a licence statement
		"Gog" => $config->other->Gog, //Declare this as a map with default popups and limited buttons
		//The next options define the legend type through a combination of the following two values
		"legendtree" => $config->other->legendtree, //If this is 'True' it is possible to switch layers on and off; if false a separate layer tree 
													//will be provided (bool)
		"selectlegendtree" => $config->other->selectlegendtree //If this is 'True' the legend will allow selection of individual items within the legend (bool)
	  ];

	  /* *********Toolbar definitions********* */
	  //This next variable defines the toolbar arrays (all are stored as <option> tags within each array)
		//Define the physical array first
		$tB = [
			"actionType" => [],
			"actionTitle" => [],
			"actionArr" => [],
			"actionCls" => [],
			"actionGroup" => [],
			"actionText" => [],
			"actionHandler" => [],
			"toolIn" => []  
		];
		//Push the values for each key
		//The action type array states if a button in the toolbar should be:
		//  a button (which calls a function)
		//  an action (which calls an OpenLayers Control
		//  a spacer (defined as '-')
		$i = 1;
		foreach($config->toolbar->actionType->option as $opt){
			$optText = "Option" . $i - 1;
			$tB["actionType"][$$optText] = $opt;
			$i = $i + 1;
		}
		//This array states the short title for each action
		$i = 1;
		foreach($config->toolbar->actionTitle->option as $opt){
			$optText = "Option" . $i - 1;
			$tB["actionTitle"][$$optText] = $opt;
			$i = $i + 1;
		}
		//Defines the OpenLayer Controls for actions to call
		$i = 1;
		foreach($config->toolbar->actionArr->option as $opt){
			$optText = "Option" . $i - 1;
			$tB["actionTitle"][$$optText] = $opt;
			$i = $i + 1;
		}
		//Define the icon to display on each button as a CSS class
		$i = 1;
		foreach($config->toolbar->actionCls->option as $opt){
			$optText = "Option" . $i - 1;
			$tB["actionCls"][$$optText] = $opt;
			$i = $i + 1;
		}
		//Defines groups of buttons, where buttons share a group they will disable others in the group when activated
		$i = 1;
		foreach($config->toolbar->actionGroup->option as $opt){
			$optText = "Option" . $i - 1;
			$tB["actionGroup"][$$optText] = $opt;
			$i = $i + 1;
		}
		//Defines the text to display on each button
		$i = 1;
		foreach($config->toolbar->actionText->option as $opt){
			$optText = "Option" . $i - 1;
			$tB["actionText"][$$optText] = $opt;
			$i = $i + 1;
		}
		//Defines the function names for buttons to call
		$i = 1;
		foreach($config->toolbar->actionHandler->option as $opt){
			$optText = "Option" . $i - 1;
			$tB["actionHandler"][$$optText] = $opt;
			$i = $i + 1;
		}
		//Integer definition of each button where:
		//0 = not on this map,  1 = tool available,  3 = a spacer, 4 a handler button and 5 a handler button with toggle
		//This is followed by a - and either 0 or 1 where 1 indicates that this is the active tool
		$i = 1;
		foreach($config->toolbar->toolIn->option as $opt){
			$optText = "Option" . $i - 1;
			$tB["toolIn"][$$optText] = $opt;
			$i = $i + 1;
		}
	  
	  /* *********Map Layer definitions********* */
	  //This section defines the map layers and records the base maps, overlays and associated wfs layers separately 
		$mL = [
			"basemaps" => [], //Base map definitions here
			"overlays" => [], //Overlay definitions here
			"wfs" => []
		];
		
		//Base maps
		$i = 1;
		foreach($config->basemaps->map as $opt){
			//Each definition within the config XML is stored within a <map> tag and consists of two fields; 
			//the layer name (GeoServer) and the user friendly title to display in the legend
			$optText = "map" . $i - 1;
			$mL["basemaps"][$$optText]["mapURL"] = $opt->mapURL; //Defines the base map from the available layer groups in GeoServer
			$mL["basemaps"][$$optText]["mapTitle"] = $opt->mapTitle; //Defines a user friendly name for this base map
		}
				
		//The overlay definition is one of the more complex definitions for each map; there are many component parts
		//linked with the various triggers and tools which can be configured. The WFS defintions are in effect part of
		//the overlay definition as every overlay has an associated WFS layer which can be used when selecting or querying 
		//each layer.

		//The overlay definition is stored within 3 overlay definitions which are contained within a central <wms> tag
		$i = 1;
		foreach($config->wms->overlay as $opt){
			$optText = "wms" . $i - 1;
			$mL["overlays"][$$optText]["overlayAddress"] = $opt->overlayAddress; //This provides the layer name in GeoServer (i.e. RBC:trafficsites)
			$mL["overlays"][$$optText]["overlayPath"] = $opt->overlayPath; //This provides the relative URL to the layer allowing display across workspaces (but not editing)
			$mL["overlays"][$$optText]["overlayTitle"] = $opt->overlayTitle; //This is the user friendly layer name to show in the legend
			$mL["overlays"][$$optText]["overlayDILS"] = $opt->overlayDILS; //Display In Layer Switcher? (bool)
			$mL["overlays"][$$optText]["onasdefault"] = $opt->onasdefault; //Should this layer be displayed when the map loads? (bool)
			$mL["overlays"][$$optText]["overlaySRS"] = $opt->overlaySRS; //Defines the layers projection as an integer (i.e. OSGB would be 27700)
			$mL["overlays"][$$optText]["overlayDOME"] = $opt->overlayDOME; //Display Outside Maximum Extent? (bool)
			$mL["overlays"][$$optText]["overlayDDtitle"] = $opt->overlayDDtitle; //This is the user friendly layer name to display in the data downloads tab
			$mL["overlays"][$$optText]["overlaySTYLES"] = $opt->overlaySTYLES; //Defines whether this layer should be displayed in an alternative style from the default
			$mL["overlays"][$$optText]["overlayCache"] = $opt->overlayCache; //Should OpenLayers cache this layer? (bool)
			$mL["overlays"][$$optText]["overlayTRAN"] = $opt->overlayTRAN; //Should this layer have transparency? (bool)
			$mL["overlays"][$$optText]["overlayENV"] = $opt->overlayENV; //Defines Environment Variables; these allow GeoServer to render styles differently depending on zoom level
		}	
		//The next set of options are stored in the <overlay2> tag (seperate table on config webpage)
		//These options relate to the popup bubbles and hover settings
		$i = 1;
		foreach($config->wms->overlay2 as $opt){
			$optText = "wms" . $i - 1;
			$mL["overlays"][$$optText]["overlayPopup"] = $opt->overlayPopup; //This defines the layer to which the popup settings apply (i.e. overlay0)
			$mL["overlays"][$$optText]["overlayPopupTemp"] = $opt->overlayPopupTemp; //This provides a relative URL to the txt file which defines the template for this popup
			$mL["overlays"][$$optText]["overlayPopupWidth"] = $opt->overlayPopupWidth; //Defines the popup width
			$mL["overlays"][$$optText]["overlayPopupHeight"] = $opt->overlayPopupHeight; //Defines the popup height
			$mL["overlays"][$$optText]["overlayHoverTemp"] = $opt->overlayHoverTemp; //This provides a relative URL to the txt file which defines the template for this hover
			$mL["overlays"][$$optText]["overlayHoverWidth"] = $opt->overlayHoverWidth; //Defines the hover width
			$mL["overlays"][$$optText]["overlayHoverHeight"] = $opt->overlayHoverHeight; //Defines the hover height
		}
		//The next set of options are stored in the <overlay3> tag (seperate table on config webpage)
		//These options relate to the zoom on click settings (if provided)
		$i = 1;
		foreach($config->wms->overlay3 as $opt){
			$optText = "wms" . $i - 1;
			$mL["overlays"][$$optText]["overlayZoom"] = $opt->overlayZoom; //Should the map zoom on selection? (bool)
			//If enabled, should it zoom to a fixed zoom level?
			$mL["overlays"][$$optText]["overlayZoomLevel"] = $opt->overlayZoomLevel; //If so, the zoom level (integer) is provided here
			//If enabled, should it highlight other records based on a field?
			$mL["overlays"][$$optText]["overlayZoomSelF"] = $opt->overlayZoomSelF; //Defines field of selection to search by
			$mL["overlays"][$$optText]["overlayZoomRepT"] = $opt->overlayZoomRepT; //Defines the table to search
			$mL["overlays"][$$optText]["overlayZoomRepF"] = $opt->overlayZoomRepF; //Defines the field within the other table to search
		}
	
		//WFS definitions here

		//The WFS definition is linked via a 1-2-1 relationship with the overlay definitions and allows features to be selected
		//as WMS is effectively an imagemap but WFS contains each individual geometry. This is costly in terms of polygons and is
		//more effecient to show an image of a polygon than download the actual geometry. That said, when editing the geometry is 
		//required and the WFS layer allows you to pull a single polygon at a time into the editable layers. 
		$i = 1;
		foreach($config->wfs->overlay as $opt){
			$optText = "wfs" . $i - 1;
			$mL["wfs"][$$optText]["overlayType"] = $opt->overlayType; //Defines the type of overlay as we can only edit Postgis tables 
			$mL["wfs"][$$optText]["overlayTable"] = $opt->overlayTable; //Defines the Postgis table associated with the WFS layer
			$mL["wfs"][$$optText]["overlayfeatureType"] = $opt->overlayfeatureType; //Defines the layer name of the GeoServer layer (i.e. trafficsites)
			$mL["wfs"][$$optText]["overlayPath"] = $opt->overlayPath; //Defines the relative path to the WFS layer
			$mL["wfs"][$$optText]["overlayDILS"] = $opt->overlayDILS; //Display In Layer Switcher? (bool)
			$mL["wfs"][$$optText]["overlaySRS"] = $opt->overlaySRS; //Defines the projection of the WFS layer
			$mL["wfs"][$$optText]["overlayfeatureNS"] = $opt->overlayfeatureNS; //Defines the GeoServer Namespace (v. important for WFS editing)
			$mL["wfs"][$$optText]["overlaygeometryName"] = $opt->overlaygeometryName; //Defines the field which contains the geometry field (postGIS)
			$mL["wfs"][$$optText]["overlayTitle"] = $opt->overlayTitle; //Defines the wfs layer name (i.e. wfs0)
		}
  
	  /* *********Table definitions********* */
	  //Table definitions are split into a number of arrays; first of which is the actual table definitions then other definitions such as lookups
	  $tD = [
		"table" => [],
		"tloops" => [],
		"lookup" => [],
		"options" => [
			"oList1" => [],
			"oList2" => []
		],
		"status" => [],
		"exclusions" => [],
		"discols" => []
	  ];
		
		//Table definition array comes first stored in the <table> tag
		$i = 1;
		foreach($config->table as $opt){
			$optText = "table" . $i - 1;
			$tD["table"][$$optText]["tableName"] = $opt->tableName; //Name of the table in the Postgres database (lower case with no spaces)
			$tD["table"][$$optText]["tableGeom"] = $opt->tableGeom; //Does the table have a geometry field? (bool)
			$tD["table"][$$optText]["tableTitle"] = $opt->tableTitle; //User friendly name to display (can have capitals and spaces)
			$tD["table"][$$optText]["selStyle"] = $opt->selStyle; //Default selection style for this table ('view' or 'view-edit')
			$tD["table"][$$optText]["recNo"] = $opt->recNo; //Defines the number of records per page to display
			$tD["table"][$$optText]["lower"] = $opt->lower; //Defines which record should the table display from
			$tD["table"][$$optText]["order_by"] = $opt->order_by; //Defines which field the table should be ordered by
			$tD["table"][$$optText]["geom_field"] = $opt->geom_field; //Defines the geometry field
		}
		//The next array defines table loops; this actually conflicts with the table definition and overrides it so that if table loops 
		//exist the attributes table will show loops of a single table and ignore the other table definitions. This is a limitation of the
		//system but has been designed with specific uses in mind where you may want a table split into seperate tables based on a field or status

		//The loops are stored in the <tableLoops> tag - This is relatively speaking defunct as you can create table 'views' in postgres then simply
		//use the table method above to achieve the same result with better options for querying later. However, the basic scripting remains should 
		//a use be found.
		$i = 1;
		foreach($config->tableLoops as $opt){
			$optText = "loop" . $i - 1;
			$tD["tloops"][$$optText]["tableName"] = $opt->tableName; //Name for the table to display 
			$tD["tloops"][$$optText]["tableCondition"] = $opt->tableCondition; //Query definition to apply 	
		}
		//It is assumed that the field names are the same with regard to the match so targetCol would exist in both tables
		//Therefore if the targetCol was status and replaceCol was statusText the SQL statement would be:
		//targetTable.status = replaceTable.statusText where targetTable.status = replaceTable.status 
		
		//Although it should be noted that this is not an actual SQL operation but simply allows you to show user friendly text
		//in place of status options which may be simple numbers for example (0 = New, 1 = Checked, 2 = Accepted)
		
		//Lookups are defined in the <lookups> tag
		$i = 1;
		foreach($config->lookups as $opt){
			$optText = "lookup" . $i - 1;
			$tD["lookup"][$$optText]["targetCol"] = $opt->targetCol; //Defines the column in the target table which contains the value to replace
			$tD["lookup"][$$optText]["targetTable"] = $opt->targetTable; //Defines the target table (Postgres)
			$tD["lookup"][$$optText]["replaceCol"] = $opt->replaceCol; //Defines the column in the lookup table which contains replacement value
			$tD["lookup"][$$optText]["replaceTable"] = $opt->replaceTable; //Defines the replacement table (Postgres)
		}
		//The options allow the user to define a select box on a field and define the options provided within the box
		//The options are stored in the <optionsList> tag and contains two seperate lists
		$i = 1;
		foreach($config->optionsList->oList1 as $opt){
			$optText = "option" . $i - 1;
			$tD["options"]["oList1"][$$optText]["optionsListOp"] = $opt->optionsListOp; //Defines each option to appear in a list
			$tD["options"]["oList1"][$$optText]["optionListNo"] = $opt->optionListNo; //Provides the list number (you can have many)
		}
		$i = 1;
		foreach($config->optionsList->oList2 as $opt){
			$optText = "option" . $i - 1;
			$tD["options"]["oList2"][$$optText]["optionsListCol"] = $opt->optionsListCol; //Defines the field name that the list applies to 
			$tD["options"]["oList2"][$$optText]["optionsListColLoop"] = $opt->optionsListColLoop; //Defines the list number that references the options list number	
		}
		//The status options are a special case and effectively a slightly more complicated version of the option lists above
		//In this case we are adding the ability to display a status which is defined elsewhere so that the status can be shown (if present)
		//but can not be set but the user in this application (it is disabled)
		
		//These options are stored in the <status> tag
		$i = 1;
		foreach($config->status as $opt){
			$optText = "status" . $i - 1;
			$tD["status"][$$optText]["statusValue"] = $opt->statusValue; //Defines the value to add to the select option (may differ to the displayed text)
			$tD["status"][$$optText]["statusAvail"] = $opt->statusAvail; //Defines whether this status should be enabled? (bool)
			$tD["status"][$$optText]["statusText"] = $opt->statusText; //Defines the actual text to display in the select option
			$tD["status"][$$optText]["statusTable"] = $opt->statusTable; //Defines the table to which this option list applies
			$tD["status"][$$optText]["statusField"] = $opt->statusField; //Defines the field within the table (default is recstatus but you can override that here)
		}
		//This option allows you to exclude fields from the attributes table. This is important if you have polygons as the geometry field would be
		//huge; as default it is recommended that the geometry field is excluded
		
		//This list is stored in the <exclusions> tag
		$i = 1;
		foreach($config->exclusions as $opt){
			$optText = "exclusion" . $i - 1;
			$tD["exclusions"][$$optText]["exclusion"] = $opt->exclusion; //Defines the field name to exclude
			$tD["exclusions"][$$optText]["exclusionT"] = $opt->exclusionT; //Defines which table the field name is in
		}
		//In some cases you may which to display a field but not permit editing; this may be a field which is automatically filled in via a trigger
		//function in the Postgres database (gid) or perhaps by the OpenLayers editing tools (i.e. mod_by and mod_date)
		
		//These options are stored in the <disable> tag
		$i = 1;
		foreach($config->disable as $opt){
			$optText = "discol" . $i - 1;
			$tD["discols"][$$optText]["option"] = $opt->option; //Defines the field name to disable
			$tD["discols"][$$optText]["optionT"] = $opt->optionT; //Defines the table which contains the field
		}
	  
	  /* *********Specific Tool definitions********* */
	  //This section defines a few specific tools such as predefined maps, function exclusions and other miscellaneous functions
	  $oS = [
		"styles" => [],
		"funcEx" => [],
		"pdm" => []
	  ];
		//The first section in the tools area relates to the style selector tool; this provides a dropdown option which enables the user 
		//to change the style of a layer between styles available in GeoServer. Styles are stored as SLD in GeoServer and each style has
		//a name which GeoServer will recognise. The method of storage for this is a bit older with each of the three elements in it's own
		//tag.
		$i = 1;
		foreach($config->style as $opt){
			$optText = "styles" . $i - 1;
			//Tag one is <style>
			$oS["styles"][$$optText]["styles"] = $opt->styles; //Defines the name of the SLD style in GeoServer
		}
		$i = 1;
		foreach($config->sTitle as $opt){
			$optText = "styleTitles" . $i - 1;
			//Tag two is <sTitle>
			$oS["styles"][$$optText]["styleTitles"] = $opt->styleTitles; //Defines the user friendly name to display in the dropdown options
		}
		$i = 1;
		foreach($config->sLayer as $opt){
			$optText = "styleLayer" . $i - 1;
			//Tag three is <sLayer>
			$oS["styles"][$$optText]["styleLayer"] = $opt->styleLayer; //Defines the layer to apply this style to (i.e. overlay0)
		}

		//The second of the tool options defines the functions to exclude from this map and is a simple tag <functions> with one value list
		$i = 1;
		foreach($config->functions as $opt){
			$optText = "functionEx" . $i - 1;
			$oS["funcEx"][$$optText]["functionEx"] = $opt->functionEx; //Defines the function to exclude
		}
		//The third of the tool options is pre-defined maps. There is a simpler syntax used to describe these maps on the config webpage and this
		//is then converted into some more complex strings for use as CQL and OpenLayers Filters. The values below represent the more complex versions
		//and as was the case with the style selections each of the options is stored in a seperate tag. 
		$i = 1;
		foreach($config->pdmArr->option as $opt){
			$optText = "pdmArr" . $i - 1;
			//Tag one is <pdmArr>
			$oS["pdm"][$$optText]["option"] = $opt; //Defines the name for the pre-defined map
		}
		$i = 1;
		foreach($config->pdmFilter->option as $opt){
			$optText = "pdmFilter" . $i - 1;
			//Tag two is <pdmFilter>
			$oS["pdm"][$$optText]["option"] = $opt; //Defines the OpenLayers Filter version but converts <> to encoded version to avoid XML errors
		}
		$i = 1;
		foreach($config->pdmUFilter->option as $opt){
			$optText = "pdmUFilter" . $i - 1;
			//Tag three is <pdmUFilter>
			$oS["pdm"][$$optText]["option"] = $opt; //Defines the CQL Filter version
		}
		
	  $map_definition = [
		"configuredMap" => $_POST['loc'],
		"mD" => $mD,
		"tB" => $tB,
		"mL" => $mL,
		"tD" => $tD,
		"oS" => $oS
	  ];
	  echo json_encode($map_definition);
}
?>