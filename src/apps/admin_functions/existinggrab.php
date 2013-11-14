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
	$map_definition = [
		"configuredMap" => $_POST['loc']
	];
	array_push($map_definition, $config);
	echo json_encode($map_definition);

	//This file has also been constructed to provide the API for the web Configuration files

	/*RBC GIS Server - Map Configuration API
	  Developed by PBA on Behalf of RBC
	  
	  First Version November 2013 - Author Paul Wittle
	  Add change log here...
	  
	  Configuration storage is as XML file stored in map application folder on the server
	  
	  General Notes:
		Unless specified all boolean questions should be answered as 'True' or 'False' with care
		to ensure that the case is correct; these records are marked (bool)
	  
	  *********Basic map definitions********* 
	  //Primarily stored under the other category this section includes titles and basic layout choices
		Application Title
		$config->other->projectPath //Relative URL; add this to https://geo.reading-travelinfo.co.uk to get the map address
		//We define the map projection in two forms; as an integer and also as a text string
		$config->other->proj  //Integer where British National Grid (OSGB) would be 27700 and WGS 84 would be 4326
		$config->other->projMap //Text string with prefix of EPSG:
		//Although other projections can be used for reprojecting (if they are available by default in OpenLayers); the maps should be defined
		//in OSGB where possible as the bulk of the scripting is set up with this assumption and bounding boxes are set up on this basis.
		//If the map is to be reprojected this should be defined by specifying a reproject from variable as follows:
		$config->other->reproject //Specify 'Yes' or 'No'
		$config->other->projMap2 //Reproject from as text string with prefix of EPSG:
		//Please note; maps can not mix layers from different workspaces as this would cause issues when editing.
		$config->other->wfsedits //This defines the relative URL to the GeoServer WFS engine used for editing the layers in this map
		$config->other->wmsbase //This defines the relative URL to the GeoServer WMS engine
		//The next values relate to the interactions with the OpenLayers map itself
		$config->other->popupPan //Should the map pan to a feature when loading a popup? (bool)
		$config->other->popupDefault //Should the popups be enabled when the map loads? (bool)
		//The next values relate to the map window and which panels should be included around the map
		$config->other->attribute //Include attributes table button? (bool)
		$config->other->edits		//Include edit button? (bool)
		$config->other->active_table //Defines which table should be used when editing (although the user will be given option to override
		$config->other->ddFull //Provide full data download options in panel which includes shapefile and CSV? (bool)
		$config->other->photoscroll //Include a photo scroller button? (bool)
		$config->other->photoscrollpath //The photo scroller scans for all images in a directory; this value provides the relative URL
		$config->other->licence //Include a licence statement
		$config->other->Gog //Declare this as a map with default popups and limited buttons
		//The next options define the legend type through a combination of the following two values
		$config->other->legendtree //If this is 'True' it is possible to switch layers on and off; if false a separate layer tree 
													//will be provided (bool)
		$config->other->selectlegendtree //If this is 'True' the legend will allow selection of individual items within the legend (bool)
	  
	    $config->userArray //Defines the permitted users for this map

	  *********Toolbar definitions*********
	  //This next variable defines the toolbar arrays (all are stored as <option> tags within each array)

		//The action type array states if a button in the toolbar should be:
		//  a button (which calls a function)
		//  an action (which calls an OpenLayers Control
		//  a spacer (defined as '-')
		$config->toolbar->actionType 
		
		//This array states the short title for each action
		$config->toolbar->actionTitle
		
		//Defines the OpenLayer Controls for actions to call
		$config->toolbar->actionArr 
		
		//Define the icon to display on each button as a CSS class
		$config->toolbar->actionCls 
		
		//Defines groups of buttons, where buttons share a group they will disable others in the group when activated
		$config->toolbar->actionGroup
		
		//Defines the text to display on each button
		$config->toolbar->actionText 
		
		//Defines the function names for buttons to call
		$config->toolbar->actionHandler 
		
		//Integer definition of each button where:
		//0 = not on this map,  1 = tool available,  3 = a spacer, 4 a handler button and 5 a handler button with toggle
		//This is followed by a - and either 0 or 1 where 1 indicates that this is the active tool
		$config->toolbar->toolIn
	  
	  *********Map Layer definitions********* 
	  //This section defines the map layers and records the base maps, overlays and associated wfs layers separately 

		//Base maps
		$config->basemaps->map as $opt
			//Each definition within the config XML is stored within a <map> tag and consists of two fields; 
			//the layer name (GeoServer) and the user friendly title to display in the legend
			$opt->mapURL //Defines the base map from the available layer groups in GeoServer
			$opt->mapTitle //Defines a user friendly name for this base map
				
		//The overlay definition is one of the more complex definitions for each map; there are many component parts
		//linked with the various triggers and tools which can be configured. The WFS defintions are in effect part of
		//the overlay definition as every overlay has an associated WFS layer which can be used when selecting or querying 
		//each layer.

		//The overlay definition is stored within 3 overlay definitions which are contained within a central <wms> tag
		$config->wms->overlay as $opt
			$opt->overlayAddress //This provides the layer name in GeoServer (i.e. RBC:trafficsites)
			$opt->overlayPath //This provides the relative URL to the layer allowing display across workspaces (but not editing)
			$opt->overlayTitle //This is the user friendly layer name to show in the legend
			$opt->overlayDILS //Display In Layer Switcher? (bool)
			$opt->onasdefault //Should this layer be displayed when the map loads? (bool)
			$opt->overlaySRS //Defines the layers projection as an integer (i.e. OSGB would be 27700)
			$opt->overlayDOME //Display Outside Maximum Extent? (bool)
			$opt->overlayDDtitle //This is the user friendly layer name to display in the data downloads tab
			$opt->overlaySTYLES //Defines whether this layer should be displayed in an alternative style from the default
			$opt->overlayCache //Should OpenLayers cache this layer? (bool)
			$opt->overlayTRAN //Should this layer have transparency? (bool)
			$opt->overlayENV //Defines Environment Variables; these allow GeoServer to render styles differently depending on zoom level
		}	
		//The next set of options are stored in the <overlay2> tag (seperate table on config webpage)
		//These options relate to the popup bubbles and hover settings
		$config->wms->overlay2 as $opt
			$opt->overlayPopup //This defines the layer to which the popup settings apply (i.e. overlay0)
			$opt->overlayPopupTemp //This provides a relative URL to the txt file which defines the template for this popup
			$opt->overlayPopupWidth //Defines the popup width
			$opt->overlayPopupHeight //Defines the popup height
			$opt->overlayHoverTemp //This provides a relative URL to the txt file which defines the template for this hover
			$opt->overlayHoverWidth //Defines the hover width
			$opt->overlayHoverHeight //Defines the hover height
		}
		//The next set of options are stored in the <overlay3> tag (seperate table on config webpage)
		//These options relate to the zoom on click settings (if provided)
		$config->wms->overlay3 as $opt
			$opt->overlayZoom //Should the map zoom on selection? (bool)
			//If enabled, should it zoom to a fixed zoom level?
			$opt->overlayZoomLevel //If so, the zoom level (integer) is provided here
			//If enabled, should it highlight other records based on a field?
			$opt->overlayZoomSelF //Defines field of selection to search by
			$opt->overlayZoomRepT //Defines the table to search
			$opt->overlayZoomRepF //Defines the field within the other table to search
		}
	
		//WFS definitions here

		//The WFS definition is linked via a 1-2-1 relationship with the overlay definitions and allows features to be selected
		//as WMS is effectively an imagemap but WFS contains each individual geometry. This is costly in terms of polygons and is
		//more effecient to show an image of a polygon than download the actual geometry. That said, when editing the geometry is 
		//required and the WFS layer allows you to pull a single polygon at a time into the editable layers. 
		$config->wfs->overlay as $opt
			$opt->overlayType //Defines the type of overlay as we can only edit Postgis tables 
			$opt->overlayTable //Defines the Postgis table associated with the WFS layer
			$opt->overlayfeatureType //Defines the layer name of the GeoServer layer (i.e. trafficsites)
			$opt->overlayPath //Defines the relative path to the WFS layer
			$opt->overlayDILS //Display In Layer Switcher? (bool)
			$opt->overlaySRS //Defines the projection of the WFS layer
			$opt->overlayfeatureNS //Defines the GeoServer Namespace (v. important for WFS editing)
			$opt->overlaygeometryName //Defines the field which contains the geometry field (postGIS)
			$opt->overlayTitle //Defines the wfs layer name (i.e. wfs0)
		}
  
	  *********Table definitions*********
	  //Table definitions are split into a number of arrays; first of which is the actual table definitions then other definitions such as lookups
	  
		//Table definition array is stored in the <table> tag
		$config->table as $opt
			$opt->tableName //Name of the table in the Postgres database (lower case with no spaces)
			$opt->tableGeom //Does the table have a geometry field? (bool)
			$opt->tableTitle //User friendly name to display (can have capitals and spaces)
			$opt->selStyle //Default selection style for this table ('view' or 'view-edit')
			$opt->recNo //Defines the number of records per page to display
			$opt->lower //Defines which record should the table display from
			$opt->order_by //Defines which field the table should be ordered by
			$opt->geom_field //Defines the geometry field
		}
		//The next array defines table loops; this actually conflicts with the table definition and overrides it so that if table loops 
		//exist the attributes table will show loops of a single table and ignore the other table definitions. This is a limitation of the
		//system but has been designed with specific uses in mind where you may want a table split into seperate tables based on a field or status

		//The loops are stored in the <tableLoops> tag - This is relatively speaking defunct as you can create table 'views' in postgres then simply
		//use the table method above to achieve the same result with better options for querying later. However, the basic scripting remains should 
		//a use be found.
		$config->tableLoops as $opt
			$opt->tableName //Name for the table to display 
			$opt->tableCondition //Query definition to apply 	
		}
		//It is assumed that the field names are the same with regard to the match so targetCol would exist in both tables
		//Therefore if the targetCol was status and replaceCol was statusText the SQL statement would be:
		//targetTable.status = replaceTable.statusText where targetTable.status = replaceTable.status 
		
		//Although it should be noted that this is not an actual SQL operation but simply allows you to show user friendly text
		//in place of status options which may be simple numbers for example (0 = New, 1 = Checked, 2 = Accepted)
		
		//Lookups are defined in the <lookups> tag
		$config->lookups as $opt
			$opt->targetCol //Defines the column in the target table which contains the value to replace
			$opt->targetTable //Defines the target table (Postgres)
			$opt->replaceCol //Defines the column in the lookup table which contains replacement value
			$opt->replaceTable //Defines the replacement table (Postgres)
		}
		//The options allow the user to define a select box on a field and define the options provided within the box
		//The options are stored in the <optionsList> tag and contains two seperate lists
		$config->optionsList->oList1 as $opt
			$opt->optionsListOp //Defines each option to appear in a list
			$opt->optionListNo //Provides the list number (you can have many)
		}
		$config->optionsList->oList2 as $opt
			$opt->optionsListCol //Defines the field name that the list applies to 
			$opt->optionsListColLoop //Defines the list number that references the options list number	
		}
		//The status options are a special case and effectively a slightly more complicated version of the option lists above
		//In this case we are adding the ability to display a status which is defined elsewhere so that the status can be shown (if present)
		//but can not be set but the user in this application (it is disabled)
		
		//These options are stored in the <status> tag
		$config->status as $opt
			$opt->statusValue //Defines the value to add to the select option (may differ to the displayed text)
			$opt->statusAvail //Defines whether this status should be enabled? (bool)
			$opt->statusText //Defines the actual text to display in the select option
			$opt->statusTable //Defines the table to which this option list applies
			$opt->statusField //Defines the field within the table (default is recstatus but you can override that here)
		}
		//This option allows you to exclude fields from the attributes table. This is important if you have polygons as the geometry field would be
		//huge; as default it is recommended that the geometry field is excluded
		
		//This list is stored in the <exclusions> tag
		$config->exclusions as $opt)
			$opt->exclusion //Defines the field name to exclude
			$opt->exclusionT //Defines which table the field name is in
		}
		//In some cases you may which to display a field but not permit editing; this may be a field which is automatically filled in via a trigger
		//function in the Postgres database (gid) or perhaps by the OpenLayers editing tools (i.e. mod_by and mod_date)
		
		//These options are stored in the <disable> tag
		$config->disable as $opt
			$opt->option //Defines the field name to disable
			$opt->optionT //Defines the table which contains the field
		}
	  
	  *********Specific Tool definitions*********
	  //This section defines a few specific tools such as predefined maps, function exclusions and other miscellaneous functions
	  
		//The first section in the tools area relates to the style selector tool; this provides a dropdown option which enables the user 
		//to change the style of a layer between styles available in GeoServer. Styles are stored as SLD in GeoServer and each style has
		//a name which GeoServer will recognise. The method of storage for this is a bit older with each of the three elements in it's own
		//tag.
		
		//Tag one is <style>
			$opt->styles //Defines the name of the SLD style in GeoServer
		
		//Tag two is <sTitle>
			$opt->styleTitles //Defines the user friendly name to display in the dropdown options
		
		//Tag three is <sLayer>
			$opt->styleLayer //Defines the layer to apply this style to (i.e. overlay0)

		//The second of the tool options defines the functions to exclude from this map and is a simple tag <functions> with one value list
		$config->functions as $opt
			$opt->functionEx //Defines the function to exclude
		}
		//The third of the tool options is pre-defined maps. There is a simpler syntax used to describe these maps on the config webpage and this
		//is then converted into some more complex strings for use as CQL and OpenLayers Filters. The values below represent the more complex versions
		//and as was the case with the style selections each of the options is stored in a seperate tag. 

		//Tag one is <pdmArr>
			$config->pdmArr->option //Defines the name for the pre-defined map

		//Tag two is <pdmFilter>
			$config->pdmFilter->option //Defines the OpenLayers Filter version but converts <> to encoded version to avoid XML errors

		//Tag three is <pdmUFilter>
			$config->pdmUFilter->option //Defines the CQL Filter version
		*/
}
?>