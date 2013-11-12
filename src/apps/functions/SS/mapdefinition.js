//Global variables
var i, i2, mapPanel, legendPanel, tableport, viewport, tree, tableURL, accordion, fieldNames, currGID;
var recNo, lower, filter;
var mapMini, format, controls, controls2, controls3, markers, selectM, extent, runOnce, session_id;
var BMapMini, geomOL, pointLayer, lineLayer, polygonLayer, simplePolygonLayer, popup, selectedRow;
var htmlText, dir, colNo, maxCol, toolbarItems, actions, actionArr, groupIn, actionText, actionGroup;
var zoomLev, Curvefactor, Scalefactor, curve, curPower1, curPower, Distfactor, SetNo, currLev, splitSize; //Curve variables
var nav, zoomCon, selectCtrl, measureline, measurepolygon, draw1, draw2, draw3, draw4, save;
var ET, ET2, ET3, ET4, edit_reshape1, edit_drag1, edit_resize1, edit_rotate1, del1, edit_reshape2, edit_drag2, edit_resize2, edit_rotate2, del2, edit_reshape3, edit_drag3, edit_resize3, edit_rotate3, del3;
var edit_reshape4, edit_drag4, edit_resize4, edit_rotate4, del4, edit_reshape, edit_drag, edit_resize, edit_rotate, del;
var ETpoint, ETpath, ETpolygon, ETbox, draw;
var poiSaveStrategy, linSaveStrategy, polSaveStrategy, sPolSaveStrategy;
var firsttime, geoLoc;
var stickyvalue = 0;
var popid = 0;
var pixel;
var locationShift = 0;
ET = 1;  //Default is pointLayer
ET2 = 1; //Default is point
ET3 = 0; //Default is none
ET4 = 0; //Default is select without edit
currGID = ''; //Default is that there is no selected record
geoLoc = false; //Turn geolocation on/off
format = 'image/png';
var filter_1_1 = new OpenLayers.Format.Filter({version: "1.1.0"});
var xml = new OpenLayers.Format.XML();

//Pickup the browser size
var winW = 630, winH = 460;
if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}

// //////////////////////////
// Layer Download Script
// //////////////////////////
function dd() {
	var part1, part2, url;
	part1 = document.getElementById('ddp1').value;
	part2 = document.getElementById('ddp2').value;

	if (part1 == 1 || part2 == 1){
		alert('Please specify a layer and output format');
	} else {
		if (part2 == '&outputFormat=KML'){
			part1 = part1.substring(part1.indexOf("&typeName=")+10);  //This gives the layer name
			url = Dpath + "wms/kml?layers=" + part1;
			window.open(url,'_blank');
		} else {
			url = part1 + part2;
			//alert(url);
			window.open(url,'_blank');
		}
	}
}

// //////////////////////////
// Delete Feature Control
// //////////////////////////
var DeleteFeature;
function SetDeleteFeature() {
	DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
		initialize: function(layer, options) {
			OpenLayers.Control.prototype.initialize.apply(this, [options]);
			this.layer = layer;
			this.handler = new OpenLayers.Handler.Feature(
				this, layer, {click: this.clickFeature}
			);
		},
		clickFeature: function(feature) {
			// if feature doesn't have a fid, destroy it
			if(feature.fid == undefined) {
				this.layer.destroyFeatures([feature]);
			} else {
				feature.state = OpenLayers.State.DELETE;
				this.layer.events.triggerEvent("afterfeaturemodified",
											   {feature: feature});
				feature.renderIntent = "select";
				this.layer.drawFeature(feature);
			}
		},
		setMap: function(map) {
			this.handler.setMap(map);
			OpenLayers.Control.prototype.setMap.apply(this, arguments);
		},
		CLASS_NAME: "OpenLayers.Control.DeleteFeature"
	});
}

// //////////////////////////
// Measure Feature Controller
// //////////////////////////
function MeasurementSwitch(){
	if (gog==true){
		accordion.items.itemAt(4).expand();
	} else {
		accordion.items.itemAt(5).expand();
	}
}

function handleMeasurements(event) {
	var geometry = event.geometry;
	var units = event.units;
	var order = event.order;
	var measure = event.measure;
	var element = document.getElementById('output');
	var out = "";
	if(order == 1) {
		out += "<h3>The line you measured is " + measure.toFixed(3) + " " + units + " long</h3>";
	} else {
		out += "<h3>The area you measured is " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup></h3>";
	}
	element.innerHTML = out;
}

function measureOn(tool){
	if (tool=="measureline"){
		measureline.activate();
		measurepolygon.deactivate();
	} else if(tool=="off") {
		measurepolygon.deactivate();
		measureline.deactivate();
	} else {
		measurepolygon.activate();
		measureline.deactivate();
	}
}

function treehandle(layername,Firetype, nodesel){
	//OK, so we are interacting with the layer tree here
	//If the user has click a layer then we filter the info tools which will fire
	//However if the user has checked a layer we are interested in the state of the corresponding WFS layer.

	//First we need to know which layer this is
	var layerNumber = "";
	var tmpControl, tmpControl2;
	for (i=0;i<overlayTitle.length;i++){
		if (overlayTitle[i]==layername) {
			layerNumber = i;
		}
	}

	//If the layerNumber is not "" (i.e. not found) then we look for the next process
	if (layerNumber != ""){
		if (Firetype == "DblClick") {
			//DblClick indicates that we should restore all the info controls
			for (i=0;i<overlayTitle.length;i++){
				tmpControl = "info" + i;
				tmpControl2 = "overlay" + i;
				window[tmpControl].layers = [window[tmpControl2]];
			}
			//We also need to recheck the option

		} else if (Firetype == "Click") {
			//This is about info tools, loop through the tools and turn off/on
			for (i=0;i<overlayTitle.length;i++){
				tmpControl = "info" + i;
				tmpControl2 = "overlay" + i;
				if (i == layerNumber) {
					window[tmpControl].layers = [window[tmpControl2]];
				} else {
					window[tmpControl].layers = [];
				}
			}
		}

		if (Firetype == "Check") {
			//This is about WFS layers
			//Is the selected layer in the selection / highlighting functions
			var inSelArr1 = "No";
			var inSelArr2 = "No";
			var inSelArr3 = "No";
			var inSelArr4 = "No";
			for (i=0;i<controls3.highlight.layers.length;i++){
				if (controls3.highlight.layers[i].name==layername){
					inSelArr1 = "Yes";
				}
			}
			for (i=0;i<controls2.sC.layers.length;i++){
				if (controls2.sC.layers[i].name==layername){
					inSelArr2 = "Yes";
				}
			}
			for (i=0;i<controls2.sH.layers.length;i++){
				if (controls2.sH.layers[i].name==layername){
					inSelArr3 = "Yes";
				}
			}
			for (i=0;i<controls2.sCF.layers.length;i++){
				if (controls2.sCF.layers[i].name==layername){
					inSelArr4 = "Yes";
				}
			}

			for (i=0;i<overlayTitle.length;i++){
				if (i == layerNumber) {
					tmpControl2 = "overlay" + i;
					if (window[tmpControl2].visibility == true) {
						//The layer is now switched on so lets turn on the WFS
						tmpControl = "wfs" + i;
						window[tmpControl].visibility = true;
						if (inSelArr1 == "No") {
							//Add it back
							controls3.highlight.layers.push(window[tmpControl2]);
						}
						if (inSelArr2 == "No") {
							//Add it back
							controls2.sC.layers.push(window[tmpControl2]);
						}
						if (inSelArr3 == "No") {
							//Add it back
							controls2.sH.layers.push(window[tmpControl2]);
						}
						if (inSelArr4 == "No") {
							//Add it back
							controls2.sCF.layers.push(window[tmpControl2]);
						}
					} else {
						//The layer is now switched off so lets turn off the WFS
						tmpControl = "wfs" + i;
						window[tmpControl].visibility = false;
						if (inSelArr1 == "Yes"){
							//Remove it
							for (i2=0;i2<controls3.highlight.layers.length;i2++){
								if (controls3.highlight.layers[i2].name==layername){
									controls3.highlight.layers.splice(i2,1);
								}
							}
						}
						if (inSelArr2 == "Yes") {
							//Add it back
							for (i2=0;i2<controls2.sC.layers.length;i2++){
								if (controls2.sC.layers[i2].name==layername){
									controls2.sC.layers.splice(i2,1);
								}
							}
						}
						if (inSelArr3 == "Yes") {
							//Add it back
							for (i2=0;i2<controls2.sH.layers.length;i2++){
								if (controls2.sH.layers[i2].name==layername){
									controls2.sH.layers.splice(i2,1);
								}
							}
						}
						if (inSelArr4 == "Yes") {
							//Add it back
							for (i2=0;i2<controls2.sCF.layers.length;i2++){
								if (controls2.sCF.layers[i2].name==layername){
									controls2.sCF.layers.splice(i2,1);
								}
							}
						}
					}
				}
			}
		}
	}
}

function tableload(){
	tableHTML = document.getElementById('urlS').value;
	document.getElementById('functionS').value = "view";
	updateTable(tableHTML);
	tableport.expand();
}

function sessionStop() {
	Session.RemoveAll();
	Session.Remove("SessionVar");
}

function setZoomSizes(event) {
	//Changes the scalefactor when a zoom event occurs (settings are defined elsewhere).
	if (map.getZoom() != zoomLev) {
		var tempParam;
		zoomLev = map.getZoom();  //Current zoom level
		curPower = Scalefactor * curPower1;
		curPower = curPower * zoomLev;
		curPower = Math.pow(2.71828183, curPower);
		currLev = curve * curPower;  //This calculates the size of 1m based on the calculated curve (number is natural log)
		if (currLev < SetNo) {
			currLev = 1;  //This calculates the size of 1m based on the calculated curve (number is natural log)
			splitSize = Distfactor;  //This is the amount to add per set
		} else {
			splitSize = ((currLev * Distfactor) / SetNo);  //This is the amount to add per set
		}
		tempParam = 'Size:' + currLev + ';splitSize:' + splitSize;

		for (i=0;i<overlayArray.length;i++){
			if (overlayENVswitch[i]==1){
				window[overlayArray[i]].mergeNewParams({'env': tempParam});
			}
		}
	}
}

function loadmap() {
	Dpath = document.URL;
	var pos, pos2, pos3, urlT;
	//Sort out the URL path (local vrs remote)
	pos = Dpath.indexOf("/", 9);
	pos2 = pos + 1;
	pos3 = Dpath.indexOf("/", pos2);
	urlT = Dpath.substring(pos2,pos3); //This contains the URL type i.e. rbc or client
	Dpath = Dpath.substr(0,10); //This gives the URL upto the third 
	if (Dpath.search("https://64") == -1) {
		Dpath = "https://geo.reading-travelinfo.co.uk/geoserver/";
	} else {
		Dpath = "https://64.5.1.218/geoserver/";
	}

	// Create map
	if (projMap != "EPSG:27700"){
		var bounds = new OpenLayers.Bounds(
			461952, 167208, 480155, 179442
		).transform(new OpenLayers.Projection("EPSG:27700"),new OpenLayers.Projection(projMap));
	} else {
		var bounds = new OpenLayers.Bounds(
			461952, 167208, 480155, 179442
		)
	}

	//Set up the map
	var options = {
		maxExtent: bounds,
		maxResolution: 500,
		numZoomLevels: 20,
		projection: projMap,
		units: 'm',
		controls: [new OpenLayers.Control.PanZoomBar()],
		eventListeners: {
			'moveend': setZoomSizes
		}
	};
	
	map.maxExtent = bounds;
	map.maxResolution = 500;
	map.numZoomLevels = 20;
	map.projection = projMap;
	map.units = 'm';
	map.events.register("moveend", map , setZoomSizes);

	var textStr;
	//If we still don't have a username then there is a problem - don't load the map!
	console.log(usertext);
	if (usertext==="") {
		document.getElementById('username').value = usertext;
		textStr = "<h3 align='center'>Log on Error</h3><p align='center'>If you believe this username should have access to this content please contact the GIS server management team.</p>";
		document.getElementById("h_first").innerHTML = textStr;
	} else {
		//Check if the user is permitted to use this page
		document.getElementById('username').value = usertext;
		var okint = 0;
		for (i=0;i<userArray.length;i++){
			if (userArray[i]==usertext) {
				okint = 1;
			}
		}
		if (okint == 0) {
			textStr = "<h3 align=\"center\">Log on Error</h3><p align=\"center\">User ";
			textStr += usertext;
			textStr += " is not authorised to view this content. <br /> If you have logged in as the wrong user you may log out using the button below and refresh the page to try again.</p><br /> <p align=\"center\"><input type='button' value='Logout' onclick='logItOut()' /></p><br /><p align=\"center\">If you believe this username should have access to this content please contact the GIS server management team.</p>";
			document.getElementById("h_first").innerHTML = textStr;
		} else {
			
			//Geolocation tools
			var geolocate = new OpenLayers.Control.Geolocate({
				bind: false,
				geolocationOptions: {
					enableHighAccuracy: true,
					maximumAge: 0,
					timeout: 7000
				}
			});
			
			//Register an event to add location if available
			firsttime = 0;
			var geolocationlayer = new OpenLayers.Layer.Vector('Current Location');
			geolocate.events.register("locationupdated",geolocate,function(e) {
				geolocationlayer.removeAllFeatures();

				geolocationlayer.addFeatures([
					new OpenLayers.Feature.Vector(
						e.point,
						{},
						{
							graphicName: 'cross',
							strokeColor: '#f00',
							strokeWidth: 2,
							fillOpacity: 0,
							pointRadius: 10
						}
					)
				]);
				if (firsttime == 0){
					map.setCenter(e.point);
					firsttime = 1;
				}
			});
			geolocate.watch = true;
			if (geoLoc == true){
				map.addControl(geolocate);
				geolocate.activate();
			}
			
			//Define the WMS layers
			for (i=0;i<(basemaps.length);i++){ //The last basemap is the editmap base
				var Dpath2 = Dpath+SpathBASE;
				window[basemaps[i]] = new OpenLayers.Layer.WMS(basemapTitle[i], Dpath2, {
					LAYERS: basemapURL[i],
					STYLES: '',
					format: format,
					tiled: true,
					tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
				}, {
					buffer: 0,
					displayOutsideMaxExtent: true,
					isBaseLayer: true,
					// exclude this layer from layer container nodes
					displayInLayerSwitcher: false
				});
			}
			//Variable formatting here, calculate a scalefactor
			zoomLev = 5;  //Current zoom level
			Curvefactor = 0.02;  //This defines the curve
			Scalefactor = 0.8;  //This defines the variation of the curve
			curve = 422076.7722;  //Change this number if your curve is different
			curve = Curvefactor * curve;  //calculates the curve
			curPower1 = -0.694065089;  //Change this number if your curve power is different
			curPower = Scalefactor * curPower1;
			curPower = curPower * zoomLev;
			curPower = Math.pow(2.71828183, curPower);
			currLev = curve * curPower;  //This calculates the size of 1m based on the calculated curve (number is natural log)
			Distfactor = 0.1;  //This calculates a % of the current curve level to use between the groups
			SetNo = 2;  //This divides the % into the number of groups
			if (currLev < SetNo) {  //It is important that we don't go below 1, limiting to the SetNo is sensible
				currLev = 1;  //This calculates the size of 1m based on the calculated curve (number is natural log)
				splitSize = Distfactor;  //This is the amount to add per set
			} else {
				splitSize = ((currLev * Distfactor) / SetNo);  //This is the amount to add per set
			}
			
			//Which layers are visible
			var offonarray = onasdefault.split("|"); 
			var offonvalue;
			//Define the WMS overlays
			for (i=0;i<overlayArray.length;i++){
				if (offonarray[i] == "true") {
					offonvalue = true;
				} else {
					offonvalue = false;
				}
				var Dpath2 = Dpath+overlayPath[i];
				if (overlayENVswitch[i]==1){
					window[overlayArray[i]] = new OpenLayers.Layer.WMS(overlayTitle[i], Dpath2, {
						LAYERS: overlayAddress[i],
						srs: overlaySRS[i],
						STYLES: overlaySTYLES[i],
						format: format,
						transparent: overlayTRAN[i],
						tiled: overlayCache[i],
						env: 'Size:' + currLev + ';splitSize:' + splitSize,
						tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
					}, {
						buffer: overlayBuffer[i],
						displayOutsideMaxExtent: overlayDOME[i],
						visibility: offonvalue,
						isBaseLayer: false,
						// exclude this layer from layer container nodes
						displayInLayerSwitcher: overlayDILS[i]
					});
				} else {
					window[overlayArray[i]] = new OpenLayers.Layer.WMS(overlayTitle[i], Dpath2, {
						LAYERS: overlayAddress[i],
						srs: overlaySRS[i],
						STYLES: overlaySTYLES[i],
						format: 'image/png',
						transparent: overlayTRAN[i],
						tiled: overlayCache[i],
						tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
					}, {
						buffer: overlayBuffer[i],
						displayOutsideMaxExtent: overlayDOME[i],
						visibility: offonvalue,
						isBaseLayer: false,
						// exclude this layer from layer container nodes
						displayInLayerSwitcher: overlayDILS[i]
					});
				}
			}
			
			// ////////////////////////////////////////////////////
			// Map Control are managed throught GeoExt
			// Action (ExtJs.Button with an associated operation)
			// ////////////////////////////////////////////////////
			chkSession();
			
			//We create an array of tools first
			var phpVarSession = sessionStarter();
			session_id2 = phpVarSession[0];
			if (session_id==''){
				session_id = session_id2;
			}
			
			setSessionC();

			// ///////////////////////////////////////////////////////
			// Default style, in this case invisible (see the 
			// opacity parameters).
			// ///////////////////////////////////////////////////////
			var defStyle = {
				strokeColor: "yellow", 
				strokeOpacity: 0,
				fillOpacity: 0,
				strokeWidth: 1
			};
			var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);
			
			var EditStyle = {
				strokeColor: "#FF6600",
				fillColor: "#FFCC66",				
				strokeOpacity: 0.85,
				fillOpacity: 0.85,
				pointRadius: 5,
				strokeWidth: 2
			};
			var EditSty = OpenLayers.Util.applyDefaults(EditStyle, OpenLayers.Feature.Vector.style["default"]);
			
			// //////////////////////////////////////////////////////////
			// Vertex style, to allow custom theme for the 
			// editing controls. It is necessary in order to visualize 
			// correctly the edit controls symbols (RESHAPE, DRAG, ROTATE) 
			// in the map when a feature is selected.
			// //////////////////////////////////////////////////////////
			var vertexStyle = {
				strokeColor: "#ff0000",
				fillColor: "#ff0000",
				strokeOpacity: 1,
				strokeWidth: 2,
				pointRadius: 3,
				graphicName: "cross"
			};

			// ////////////////////////////////////////
			// Select style, the style used when a 
			// feature is selected.
			// ////////////////////////////////////////
			var select = {
				strokeColor: "blue", 
				strokeOpacity: 0.5,
				fillOpacity: 0.5,
				fillColor: "blue"
			};
			
			// ////////////////////////////////////
			// StyleMap definition, the style to 
			// use for the Vector layers. 
			// His Rules are: 
			//		- default 
			//		- vertex
			//		- select
			// ////////////////////////////////////
			var sm = new OpenLayers.StyleMap({
				'default': sty,
				'vertex': vertexStyle,
				'select': select
			});
			
			var edsm = new OpenLayers.StyleMap({
				'default': EditSty,
				'vertex': vertexStyle,
				'select': select
			});
			
			poiSaveStrategy = new OpenLayers.Strategy.Save({auto: true});
			linSaveStrategy = new OpenLayers.Strategy.Save({auto: true});
			polSaveStrategy = new OpenLayers.Strategy.Save({auto: true});
			sPolSaveStrategy = new OpenLayers.Strategy.Save({auto: true});
			
			// /////////////////////////////////////////////////////////////////////////////////////////////
			// A strategy that commits newly created or modified features.
			// By default the strategy waits for a call to save before persisting changes.
			// By configuring the strategy with the auto option, changes can be saved automatically.
			// We can not edit SQL views or multiple geometries to instead we will edit temporary layers
			// Then pass the geometry to postgres script
			// /////////////////////////////////////////////////////////////////////////////////////////////
			
			//  Set up the temporary layers to contain the geometries
			//Define the WFS edit layers
			var tempType, tempNS;
			//This is always the same url as the edit layers are stored under client
			Dpath2 = Dpath+SpathwWFS;
			if (SpathwWFS.substr(0,3) == "RBC"){
				tempNS = "https://geo.reading-travelinfo.co.uk/rbc";
			} else {
				tempNS = "https://geo.reading-travelinfo.co.uk/client";
			}
			if (projMap == "EPSG:4326"){
				tempType = 'uepointwgs';
			} else {
				tempType = 'uepointosgb';
			}
			pointLayer = new OpenLayers.Layer.Vector("Point Layer", {
				strategies: [new OpenLayers.Strategy.BBOX(), poiSaveStrategy],  
				displayInLayerSwitcher: false,
				projection: new OpenLayers.Projection("EPSG:27700"),
				protocol: new OpenLayers.Protocol.WFS({
					version: "1.1.0",
					url: Dpath2,
					srsName : "EPSG:27700",
					featureNS :  tempNS,
					featureType: tempType,
					geometryName: "the_geom",
					extractAttributes: true
				}),
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "sid",
					value: session_id
				}),
				styleMap: edsm
			});
			
			if (projMap == "EPSG:4326"){
				tempType = 'uelinewgs';
			} else {
				tempType = 'uelineosgb';
			}
            lineLayer = new OpenLayers.Layer.Vector("Line Layer", {
				strategies: [new OpenLayers.Strategy.BBOX(), linSaveStrategy],  
				displayInLayerSwitcher: false,
				projection: new OpenLayers.Projection("EPSG:27700"),
				protocol: new OpenLayers.Protocol.WFS({
					version: "1.1.0",
					url: Dpath2,
					srsName : "EPSG:27700",
					featureNS :  tempNS,
					featureType: tempType,
					geometryName: "the_geom",
					extractAttributes: true
				}),
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "sid",
					value: session_id
				}),
				styleMap: edsm
			});
			
			if (projMap == "EPSG:4326"){
				tempType = 'uepolygonwgs';
			} else {
				tempType = 'uepolygonosgb';
			}
            polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer", {
				strategies: [new OpenLayers.Strategy.BBOX(), polSaveStrategy],  
				displayInLayerSwitcher: false,
				projection: new OpenLayers.Projection("EPSG:27700"),
				protocol: new OpenLayers.Protocol.WFS({
					version: "1.1.0",
					url: Dpath2,
					srsName : "EPSG:27700",
					featureNS :  tempNS,
					featureType: tempType,
					geometryName: "the_geom",
					extractAttributes: true
				}),
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "sid",
					value: session_id
				}),
				styleMap: edsm
			});
			
			if (projMap == "EPSG:4326"){
				tempType = 'uespolygonwgs';
			} else {
				tempType = 'uespolygonosgb';
			}
            simplePolygonLayer = new OpenLayers.Layer.Vector("Shapes Layer", {
				strategies: [new OpenLayers.Strategy.BBOX(), sPolSaveStrategy],  
				displayInLayerSwitcher: false,
				projection: new OpenLayers.Projection("EPSG:27700"),
				protocol: new OpenLayers.Protocol.WFS({
					version: "1.1.0",
					url: Dpath2,
					srsName : "EPSG:27700",
					featureNS :  tempNS,
					featureType: tempType,
					geometryName: "the_geom",
					extractAttributes: true
				}),
				filter: new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "sid",
					value: session_id
				}),
				styleMap: edsm
			});
			
			// ///////////////////////////////////////////////////////////////////
			// Define the overlay as a Vector layers loaded by the WFS service
			// WARNING!! Ensure the URL and NameSpace (NS) are correct.
			// ///////////////////////////////////////////////////////////////////
				
			//Define the wfs overlay layers
			var tmpWFSname;
			for (i=0;i<overlayArray.length;i++){
				tmpWFSname = "wfs" + i;
				window[tmpWFSname] = new OpenLayers.Layer.Vector(wfsTitle[i], {
					strategies: [new OpenLayers.Strategy.BBOX()],
					displayInLayerSwitcher: wfsDILS[i],
					projection: new OpenLayers.Projection(wfsSRS[i]),
					protocol: new OpenLayers.Protocol.WFS({
						version: "1.1.0",
						url: Dpath+wfsPath[i],
						srsName : wfsSRS[i],
						featureNS :  wfsNS[i],
						featureType: wfsFT[i],
						geometryName: wfsGeom[i],
						extractAttributes: true
					}),
					styleMap: sm,
					filter:	null				
				});
			}

			// /////////////////////////////////////////////////////////
			// Trigger these events after a feature is drawn.
			// /////////////////////////////////////////////////////////
			
			//The function run by the start event is:
			//this.events.triggerEvent("start", {features:features});
			//therefore the feature is passed to the registered event below
			poiSaveStrategy.events.register('start', pointLayer, function(features){
				var cDT = new Date();
				
				//Get timezone
				var TZ = cDT.toUTCString(); 
				TZ = TZ.substring(TZ.length-3);
				
				//Pad the numbers below 10
				var MDT = cDT.getMonth()+1;
				if (MDT < 10) {
					MDT = '0' + MDT;
				} 
				var DDT = cDT.getDate();
				if (DDT < 10) {
					DDT = '0' + DDT;
				}
				var HDT = cDT.getHours();
				if (HDT < 10) {
					HDT = '0' + HDT;
				}
				var MmDT = cDT.getMinutes();
				if (MmDT < 10) {
					MmDT = '0' + MmDT;
				}
				var SDT = cDT.getSeconds();
				if (SDT < 10) {
					SDT = '0' + SDT;
				}
				
				//Create a postgres safe datetimestamp
				var currentDT = cDT.getFullYear() + '-' + MDT + '-' + DDT + 'T' + HDT + ':' + MmDT + ':' + SDT + TZ;
				var f = features.features;
				for(i=0, size = f.length; i<size; i++){
					if(f[i]){
						f[i].attributes["sid"] = session_id; 
						f[i].attributes["savedatetime"] = currentDT;
					}
				}
				if (stickyvalue == 0){
					edMO(3,0);
				}
			});

			linSaveStrategy.events.register("start", lineLayer, function(features){
				var cDT = new Date();
				
				//Get timezone
				var TZ = cDT.toUTCString(); 
				TZ = TZ.substring(TZ.length-3);
				
				//Pad the numbers below 10
				var MDT = cDT.getMonth()+1;
				if (MDT < 10) {
					MDT = '0' + MDT;
				} 
				var DDT = cDT.getDate();
				if (DDT < 10) {
					DDT = '0' + DDT;
				}
				var HDT = cDT.getHours();
				if (HDT < 10) {
					HDT = '0' + HDT;
				}
				var MmDT = cDT.getMinutes();
				if (MmDT < 10) {
					MmDT = '0' + MmDT;
				}
				var SDT = cDT.getSeconds();
				if (SDT < 10) {
					SDT = '0' + SDT;
				}
				
				//Create a postgres safe datetimestamp
				var currentDT = cDT.getFullYear() + '-' + MDT + '-' + DDT + 'T' + HDT + ':' + MmDT + ':' + SDT + TZ;
				var f = features.features;
				for(i=0, size = f.length; i<size; i++){
					if(f[i]){
						f[i].attributes["sid"] = session_id; 
						f[i].attributes["savedatetime"] = currentDT;
					}
				}
				if (stickyvalue == 0){
					edMO(3,0);
				}
			});
			
			polSaveStrategy.events.register("start", polygonLayer, function(features){
				var cDT = new Date();
				
				//Get timezone
				var TZ = cDT.toUTCString(); 
				TZ = TZ.substring(TZ.length-3);
				
				//Pad the numbers below 10
				var MDT = cDT.getMonth()+1;
				if (MDT < 10) {
					MDT = '0' + MDT;
				} 
				var DDT = cDT.getDate();
				if (DDT < 10) {
					DDT = '0' + DDT;
				}
				var HDT = cDT.getHours();
				if (HDT < 10) {
					HDT = '0' + HDT;
				}
				var MmDT = cDT.getMinutes();
				if (MmDT < 10) {
					MmDT = '0' + MmDT;
				}
				var SDT = cDT.getSeconds();
				if (SDT < 10) {
					SDT = '0' + SDT;
				}
				
				//Create a postgres safe datetimestamp
				var currentDT = cDT.getFullYear() + '-' + MDT + '-' + DDT + 'T' + HDT + ':' + MmDT + ':' + SDT + TZ;
				var f = features.features;
				for(i=0, size = f.length; i<size; i++){
					if(f[i]){
						f[i].attributes["sid"] = session_id; 
						f[i].attributes["savedatetime"] = currentDT;
					}
				}
				if (stickyvalue == 0){
					edMO(3,0);
				}
			});
			
			sPolSaveStrategy.events.register("start", simplePolygonLayer, function(features){
				var cDT = new Date();
				
				//Get timezone
				var TZ = cDT.toUTCString(); 
				TZ = TZ.substring(TZ.length-3);
				
				//Pad the numbers below 10
				var MDT = cDT.getMonth()+1;
				if (MDT < 10) {
					MDT = '0' + MDT;
				} 
				var DDT = cDT.getDate();
				if (DDT < 10) {
					DDT = '0' + DDT;
				}
				var HDT = cDT.getHours();
				if (HDT < 10) {
					HDT = '0' + HDT;
				}
				var MmDT = cDT.getMinutes();
				if (MmDT < 10) {
					MmDT = '0' + MmDT;
				}
				var SDT = cDT.getSeconds();
				if (SDT < 10) {
					SDT = '0' + SDT;
				}
				
				//Create a postgres safe datetimestamp
				var currentDT = cDT.getFullYear() + '-' + MDT + '-' + DDT + 'T' + HDT + ':' + MmDT + ':' + SDT + TZ;
				var f = features.features;
				for(i=0, size = f.length; i<size; i++){
					if(f[i]){
						f[i].attributes["sid"] = session_id; 
						f[i].attributes["savedatetime"] = currentDT;
					}
				}
				if (stickyvalue == 0){
					edMO(3,0);
				}
			});

			// //////////////////////////////////
			// Map controls definitions
			// //////////////////////////////////
			
			nav = new OpenLayers.Control.Navigation();
			var report = function(event) {
                OpenLayers.Console.log(event.type, event.feature.id);
            };
			
			zoomCon = new OpenLayers.Control.ZoomBox({alwaysZoom:true});
			SetDeleteFeature();
			//These are the real handlers
			controls = { 
				draw1: new OpenLayers.Control.DrawFeature(
					pointLayer, OpenLayers.Handler.Point,
					{
						title: "Draw Feature",
						displayClass: "olControlDrawFeaturePoint",
						multi: false
					}
				),
				
				draw2: new OpenLayers.Control.DrawFeature(
					lineLayer, OpenLayers.Handler.Path,
					{
						title: "Draw Feature",
						displayClass: "olControlDrawFeatureLine",
						multi: false
					}
				),
				
				draw3: new OpenLayers.Control.DrawFeature(
					polygonLayer, OpenLayers.Handler.Polygon,
					{
						title: "Draw Feature",
						displayClass: "olControlDrawFeaturePolygon",
						multi: true
					}
				),
				
				draw4: new OpenLayers.Control.DrawFeature(
					simplePolygonLayer, OpenLayers.Handler.RegularPolygon, 
					{
						handlerOptions: {
							sides: 4,
							irregular: true
						},
						title: "Draw Feature",
						displayClass: "olControlDrawFeaturePolygon",
						multi: true
					}
				),
			
				//Now for the edit tools
				// ******************
				
				// ----------------------
				edit_reshape1: new OpenLayers.Control.ModifyFeature(pointLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeature",
					mode:  OpenLayers.Control.ModifyFeature.RESHAPE,
					vertexRenderIntent: "vertex"
				}),
				
				edit_resize1: new OpenLayers.Control.ModifyFeature(pointLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.RESIZE,
					vertexRenderIntent: "vertex"
				}),
				
				edit_drag1: new OpenLayers.Control.ModifyFeature(pointLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.DRAG,
					vertexRenderIntent: "vertex"
				}),
				
				edit_rotate1: new OpenLayers.Control.ModifyFeature(pointLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.ROTATE,
					vertexRenderIntent: "vertex"
				}),
				
				del1: new DeleteFeature(pointLayer, {title: "Delete Feature"}),
				
				// ----------------------
				edit_reshape2: new OpenLayers.Control.ModifyFeature(lineLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeature",
					mode:  OpenLayers.Control.ModifyFeature.RESHAPE,
					vertexRenderIntent: "vertex"
				}),
				
				edit_resize2: new OpenLayers.Control.ModifyFeature(lineLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.RESIZE,
					vertexRenderIntent: "vertex"
				}),
				
				edit_drag2: new OpenLayers.Control.ModifyFeature(lineLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.DRAG,
					vertexRenderIntent: "vertex"
				}),
				
				edit_rotate2: new OpenLayers.Control.ModifyFeature(lineLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.ROTATE,
					vertexRenderIntent: "vertex"
				}),

				del2: new DeleteFeature(lineLayer, {title: "Delete Feature"}),
				
				// ----------------------
				edit_reshape3: new OpenLayers.Control.ModifyFeature(polygonLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeature",
					mode:  OpenLayers.Control.ModifyFeature.RESHAPE,
					vertexRenderIntent: "vertex"
				}),
				
				edit_resize3: new OpenLayers.Control.ModifyFeature(polygonLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.RESIZE,
					vertexRenderIntent: "vertex"
				}),
				
				edit_drag3: new OpenLayers.Control.ModifyFeature(polygonLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.DRAG,
					vertexRenderIntent: "vertex"
				}),
				
				edit_rotate3: new OpenLayers.Control.ModifyFeature(polygonLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.ROTATE,
					vertexRenderIntent: "vertex"
				}),

				del3: new DeleteFeature(polygonLayer, {title: "Delete Feature"}),
				
				// ----------------------
				edit_reshape4: new OpenLayers.Control.ModifyFeature(simplePolygonLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeature",
					mode:  OpenLayers.Control.ModifyFeature.RESHAPE,
					vertexRenderIntent: "vertex"
				}),
				
				edit_resize4: new OpenLayers.Control.ModifyFeature(simplePolygonLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.RESIZE,
					vertexRenderIntent: "vertex"
				}),
				
				edit_drag4: new OpenLayers.Control.ModifyFeature(simplePolygonLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.DRAG,
					vertexRenderIntent: "vertex"
				}),
				
				edit_rotate4: new OpenLayers.Control.ModifyFeature(simplePolygonLayer, {
					title: "Modify Feature",
					displayClass: "olControlModifyFeatureDrag",
					mode:  OpenLayers.Control.ModifyFeature.ROTATE,
					vertexRenderIntent: "vertex"
				}),

				del4: new DeleteFeature(simplePolygonLayer, {title: "Delete Feature"})
				// ******************
			};
			
			var wfsLayers = [];
			for (i=0;i<overlayArray.length;i++){
				tmpWFSname = "wfs" + i;
				wfsLayers.push(window[tmpWFSname]);
			}
			controls2 = {
				// Custom select tools		
				sC: new OpenLayers.Control.SelectFeature(
					wfsLayers, 
					{clickout: true}
				),
				
				//Highlighter needs to be activated first or the select will not work. 
				sH: new OpenLayers.Control.SelectFeature(
					wfsLayers, 
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary",
						eventListeners: {
							beforefeaturehighlighted: report,
							featurehighlighted: report,
							featureunhighlighted: report
						}
					}
				),
				
				sCF: new OpenLayers.Control.SelectFeature(
					wfsLayers, 
					{
						clickout: true,
						onSelect: selectHandle,
						onUnselect: selectHandleOff
					}
				)
			};
			
			var layer = new OpenLayers.Layer.Vector("VLayer");
			for (i=0;i<overlayArray.length;i++){
				tmpWFSname = "wfs" + i;
				window[tmpWFSname].events.register("featureselected", layer, tranferit);
			}
				
			controls3 = {
				//Highlighter functions
				highlight: new OpenLayers.Control.SelectFeature(
					wfsLayers, 
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary",
						eventListeners: {
							beforefeaturehighlighted: report,
							featurehighlighted: report,
							featureunhighlighted: report
						}
					}
				),
				
				highlight1: new OpenLayers.Control.SelectFeature(
					pointLayer, 
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary",
						eventListeners: {
							beforefeaturehighlighted: report,
							featurehighlighted: report,
							featureunhighlighted: report
						}
					}
				),
				
				highlight2: new OpenLayers.Control.SelectFeature(
					lineLayer, 
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary",
						eventListeners: {
							beforefeaturehighlighted: report,
							featurehighlighted: report,
							featureunhighlighted: report
						}
					}
				),
				
				highlight3: new OpenLayers.Control.SelectFeature(
					polygonLayer, 
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary",
						eventListeners: {
							beforefeaturehighlighted: report,
							featurehighlighted: report,
							featureunhighlighted: report
						}
					}
				),
				
				highlight4: new OpenLayers.Control.SelectFeature(
					simplePolygonLayer, 
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary",
						eventListeners: {
							beforefeaturehighlighted: report,
							featurehighlighted: report,
							featureunhighlighted: report
						}
					}
				)
				
			};
            
			var key;
            for(key in controls) {
                map.addControl(controls[key]);
            }
			
			for(key in controls2) {
                map.addControl(controls2[key]);
            }
			
			for(key in controls3) {
                map.addControl(controls3[key]);
            }

			// fancy measurement tools
            var sketchSymbolizers = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#333333"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    strokeDashstyle: "dash"
                },
                "Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    fillColor: "white",
                    fillOpacity: 0.3
                }
            };
            var style = new OpenLayers.Style();
            style.addRules([
                new OpenLayers.Rule({symbolizer: sketchSymbolizers})
            ]);
            var styleMap = new OpenLayers.StyleMap({"default": style});
            
            // allow testing of specific renderers via "?renderer=Canvas", etc
            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

			measureline = new OpenLayers.Control.Measure(
			OpenLayers.Handler.Path, {
				persist: true,
				handlerOptions: {
					layerOptions: {
						renderers: renderer,
						styleMap: styleMap
					}
				},
				eventListeners: {
					measure: handleMeasurements,
					measurepartial: handleMeasurements
				}
			});
			
			measurepolygon = new OpenLayers.Control.Measure(
			OpenLayers.Handler.Polygon, {
				persist: true,
				handlerOptions: {
					layerOptions: {
						renderers: renderer,
						styleMap: styleMap
					}
				},
				eventListeners: {
					measure: handleMeasurements,
					measurepartial: handleMeasurements
				}
			});
			
			selectCtrl = new OpenLayers.Control.Navigation();
			
			//-!!!!!!!!!!!!!!!!!!!!!!!!!!
			
			//We create an array of tools first
			var phpVarInput = defineTools(map, GeoExt, Ext);
			toolbarItems = phpVarInput[0];
			actions = phpVarInput[1];
			actionArr = phpVarInput[2];
			groupIn = phpVarInput[3]; 
			actionText = phpVarInput[4]; 
			actionGroup = phpVarInput[5]; 
			
			//Define the map itself
			for (i=0;i<(basemaps.length-1);i++){ //The last basemap is the editmap base
				map.addLayer(window[basemaps[i]]);
			}
	
			//Add the overlays, wfs and info controls
			for (i=0;i<overlayArray.length;i++){
				map.addLayer(window[overlayArray[i]]);
				tmpWFSname = "wfs" + i;
				map.addLayer(window[tmpWFSname]);
				if (overlayPopup[i]=='True') {
					// ////////////////////////////////
					// GetFeatureInfo Control
					// ////////////////////////////////
					//var info;
					Dpath2 = Dpath+overlayPath[i];
					var varname = "info" + i;
					var varname2 = "locationShift" + i;
					window[varname2] = 0;
					var itNo = i;
					window[varname] = new OpenLayers.Control.WMSGetFeatureInfo({
						url: Dpath2,
						title: 'Identify features by clicking',
						displayClass: 'olControlGetFeatureInfo',
						type: OpenLayers.Control.TYPE_TOGGLE,
						queryVisible: true,
						layers: [window[overlayArray[i]]],
						format: new OpenLayers.Format.GML(),   // Used to parse the feature info response
						infoFormat: 'application/vnd.ogc.gml', // Used to require the GML format to the WMS server
						eventListeners: {
							getfeatureinfo: function(event) { 
								if (!popup){
									//No popup here
								} else {
									popup.close(); //Closes open popups	
									window[varname2] = 0;								   
								}

								var features = event.features;
								if (features.length != 0 ) { //Prevent popups where there is no result
									// ///////////////////////////////////////////////////////////
									// We can use the parsed response formatting a proper HTML
									// ///////////////////////////////////////////////////////////
									//This is now handled by an external function
									popupHTML(event.features);  //Need to work this out how do you add the overlayPopup[] value here!!!
									//Currently set for the first record.

									// /////////////////////////////////////////////////////////////
									// And then render the formatted output inside a GeoExt Popup
									// /////////////////////////////////////////////////////////////
									//Set up the popup with tab
									if (window[varname2] == 0){
										var varname3 = "locationE" + i;
										pixel = new OpenLayers.Pixel(event.xy['x'],event.xy['y']+56);
										locationShift = locationShift + 1;
										window[varname2] = 1;
									}
									popup = new GeoExt.Popup({
										title: '',
										autoScroll: true,
										location: pixel,
										anchorPosition: 'bottom-left',
										panIn: popupPan,
										map: map,
										defaults: {
											layout: 'fit',
											autoScroll: true,
											autoHeight: true,
											autoWidth: true,
											collapsible: false,
											maximizable: false
										}
									});
									
									var config = [];
									if (htmlText) {
										config.push({
											bodyStyle: 'padding:10px; background-color:#FFFFFF',
											html: htmlText
										});
									}
									popup.hide();
									popup.add(config);
									popup.show();
								}
							}
						}
					});
					map.addControl(window[varname]);
					if (popupDefault=="True") {
						window[varname].activate();
					}
				} else {
					var varname = "info" + i;
					window[varname] = false;
				}
			}
			//Add the editing layers
			map.addLayer(pointLayer);
			map.addLayer(lineLayer);
			map.addLayer(polygonLayer);
			map.addLayer(simplePolygonLayer);
			//Add the geolocator
			if (geolocationlayer.features.length != 0) {
				map.addLayer(geolocationlayer);		
			} 
			
			//Define the mapPanel
			mapPanel = new GeoExt.MapPanel({
				region: 'center', 
				layout: 'fit',
				height:(winH-68),
				width: (winW-210), //Width minus the east or west panel width
				map: map,
				stateId: "map",
				tbar: new Ext.Toolbar({
					enableOverflow: true,
					items: [toolbarItems]}),
				getState: function() {
					var state = GeoExt.MapPanel.prototype.getState.apply(this);
					state.width = this.getSize().width;
					state.height = this.getSize().height;
					return state;
				},
				applyState: function(state) {
					GeoExt.MapPanel.prototype.applyState.apply(this, arguments);
					this.width = state.width;
					this.height = state.height;
				},
				zoom: zoomLev,
				title: 'Map Window'
			});
			
			runOnce = 0;
			
			//Legend
			// give the record of the 1st layer a legendURL, which will cause
			// UrlLegend instead of WMSLegend to be used
			var layerRec0 = mapPanel.layers.getAt(0);

			// store the layer that we will modify in toggleVis()
			var layerRec1 = mapPanel.layers.getAt(1);
			
			if (legendtree == false) {
				//Create a Legend
				legendPanel = new GeoExt.LegendPanel({
					defaults: {
						labelCls: 'mylabel',
						style: 'padding:5px',
						baseParams: {
							LEGEND_OPTIONS: 'forceLabels:on;fontSize:12;',
							WIDTH: 20, HEIGHT: 20, SCALE: 0.5
						}
					},
					bodyStyle: 'padding:5px',
					autoScroll: true
				});
			
				//Layer Tree
				tree = new Ext.tree.TreePanel({
					root: new GeoExt.tree.LayerContainer({
						text: 'Map Layers',
						layerStore: mapPanel.layers,
						leaf: false,
						expanded: true
					}),
					enableDD: true
				});
				//If we are using Legend View
				var east1 = new Ext.Panel({
					title: 'Legend',
					layout: 'fit',
					items: [legendPanel]
				});
				var east1b = new Ext.Panel({
					title: "Layers",
					layout: 'fit',
					items: [tree]
				});
			} else {
				//We are using a legendtree instead of a standard tree
				// custom layer node UI class
				var LayerNodeUI = Ext.extend(
					GeoExt.tree.LayerNodeUI,
					new GeoExt.tree.TreeNodeUIEventMixin()
				);
				
				tree = new Ext.tree.TreePanel({
					title: "Layers",
					width: 250,
					autoScroll: true,
					enableDD: true,
					// apply the tree node component plugin to layer nodes
					plugins: [{
						ptype: "gx_treenodecomponent"
					}],
					loader: {
						applyLoader: false,
						uiProviders: {
							"custom_ui": LayerNodeUI
						}
					},
					root: {
						nodeType: "gx_layercontainer",
						loader: {
							baseAttrs: {
								uiProvider: "custom_ui"
							},
							createNode: function(attr) {
								// add a WMS legend to each node created
								attr.component = {
									xtype: "gx_wmslegend",
									layerRecord: mapPanel.layers.getByLayer(attr.layer),
									showTitle: false,
									// custom class for css positioning
									// see tree-legend.html
									cls: "legend"
								};
								return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
							}
						}
					},
					listeners: {
						click: function(attr) {
							treehandle(attr.text, "Click", attr.id);
						},
						checkchange: function(attr) {
							treehandle(attr.text, "Check", attr.id);
						},
						dblclick: function(attr) {
							treehandle(attr.text, "DblClick", attr.id);
						}
					},
					rootVisible: false,
					lines: false
				});
				var east1 = new Ext.Panel({
					title: "Layers",
					layout: 'fit',
					items: [tree]
				});
			}

			//This defines the filter section
			var oTitle = '';
			var fmhtml = "<h2>Filter Map</h2>";
			fmhtml += "<p>Please use this tool to filter the map</p>";
			fmhtml += "<b>Please Select a Layer to Filter:</b><br />";
			fmhtml += "<select id='fm1' name='fm1' style='width: 210px' onchange='filterSetup(this.value)'><option selected='selected' value='1'>Please Select a Layer</option>";
			for (i=0;i<mapPanel.layers.data.length;i++){
				if(typeof mapPanel.layers.getAt(i).data.layer.params!='undefined'){
					//If this exists we are most probably looking at a WMS - Carry on
					if(mapPanel.layers.getAt(i).data.layer.options.isBaseLayer == false) {
						//This is not a raster / base map - Carry on 
						var layerNam = mapPanel.layers.getAt(i).data.layer.params.LAYERS;
						for (var oL=0;oL<overlayArray.length;oL++){
							if(overlayAddress[oL]==layerNam){
								oTitle = overlayTitle[oL];
							}
						}
						fmhtml += "<option value='" + layerNam + "'>" + oTitle + "</option>";
					}
				}
			}
			fmhtml += "</select><br />";
			fmhtml += "<div id='filterDiv'></div>";
			
			var east2 = new Ext.Panel({
				title: 'Filter Map',
				layout: 'fit',
				html: fmhtml
			});
			
			//This defines the predefined filter section
			var pdmhtml = "<h2>Predefined Filters</h2><p>Please use the following options to choose between some predefined filters or use the 'Filters' panel to add your own.</p>";
			pdmhtml += "<br /><form id='pdm'>";
			for(i=0;i<pdmArr.length;i++){
				if (i==0){
					//By default the first predefined map is the current map
					pdmhtml += "<input type='radio' name='pdmOp' checked='checked' id='pdm0' onclick='pdmF(0)'>No Filter<br />";
				} else {
					//Here we put the rest
					pdmhtml += "<input type='radio' name='pdmOp' id='pdm"+i+"' onclick='pdmF("+i+")'>"+pdmArr[i]+"<br />";
				}
			}
			pdmhtml += "</form>";
			
			var east3 = new Ext.Panel({
				title: "Predefined Filters",
				layout: 'fit',
				html: pdmhtml
			});
			
			var ddhtml = "<h2>Data Downloads</h2><p>Please use the following dropdown box to select a layer from the current map to download.</p>";
			ddhtml += "<table><tr height=30><td><select id='ddp1' name='ddp1'><option selected='selected' value='1'>Please Select a Layer</option>";
			for (i=0;i<mapPanel.layers.data.length;i++){
				if(typeof mapPanel.layers.getAt(i).data.layer.params!='undefined'){
					//If this exists we are most probably looking at a WMS - Carry on
					if(mapPanel.layers.getAt(i).data.layer.options.isBaseLayer == false) {
						//This is not a raster / base map - Carry on 
						var layerNam = mapPanel.layers.getAt(i).data.layer.params.LAYERS;
						var workS = layerNam.substr(0, layerNam.indexOf(":"));
						ddhtml += "<option value='" + Dpath + workS + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerNam + "'>" + layerNam + "</option>";
					}
				}
			}
			ddhtml += "</select></td></tr><tr height=30><td><select id='ddp2' name='ddp2'><option selected='selected' value='1'>Format</option>";
			if (gog == false) {
				ddhtml += "<option value='&outputFormat=CSV'>CSV</option>";
				ddhtml += "<option value='&outputFormat=shape-zip'>Shapefile</option>";
				ddhtml += "<option value='&outputFormat=KML'>Google KML</option>";
			} else {
				ddhtml += "<option value='&outputFormat=KML'>Google KML</option>";
			}
			ddhtml += "</select></td></tr></table><br />";
			ddhtml += "<input type='button' value='Download File' onclick='dd()' />";
			var east4 = new Ext.Panel({
				title: "Data Downloads",
				layout: 'fit',
				html: ddhtml
			});
			var mthtml = "<h2>Measure Tools</h2>";
			mthtml += "<form id='mto'>Measure length <input type=\"radio\" name=\"Measure\" id=\"MeasureL\" onclick=\"measureOn('measureline')\"><br />";
			mthtml += "Measure area <input type=\"radio\" name=\"Measure\" id=\"MeasureA\" onclick=\"measureOn('measurepolygon')\"><br />";
			mthtml += "Turn Off <input type=\"radio\" name=\"Measure\" id=\"MeasureO\" onclick=\"measureOn('off')\"></form><br /><div id=\"output\"></div>";
			var east5 = new Ext.Panel({
				title: "Measurement Results",
				layout: 'fit',
				html: mthtml
			});

			var eohtml = "<b><u>Adding New Features</u></b><br />";
			eohtml += "<b>Mode: </b> <br />";
			eohtml += "<img src=\"../../apps/functions/drawingtypes1.png\" width=\"200\" height=\"52\" id=\"edMOimg\" alt=\"Edit Types\" usemap=\"#editmap\" /><br /><br />";
			eohtml += "";
			eohtml += "<map name=\"editmap\">";
			eohtml += "  <area shape=\"circle\" coords=\"25,25,20\" alt=\"Point\" onmouseover=\"edMO(1,1)\" onclick=\"edMO(2,1)\" onmouseout=\"edMO(2,0)\">";
			eohtml += "  <area shape=\"circle\" coords=\"65,25,20\" alt=\"Line\" onmouseover=\"edMO(1,2)\" onclick=\"edMO(2,2)\" onmouseout=\"edMO(2,0)\">";
			eohtml += "  <area shape=\"circle\" coords=\"120,25,20\" alt=\"Polygon\" onmouseover=\"edMO(1,3)\" onclick=\"edMO(2,3)\" onmouseout=\"edMO(2,0)\">";
			eohtml += "  <area shape=\"circle\" coords=\"170,25,20\" alt=\"Shape\" onmouseover=\"edMO(1,4)\" onclick=\"edMO(2,4)\" onmouseout=\"edMO(2,0)\">";
			eohtml += "</map>";
			eohtml += "";
			eohtml += "<div id=\"currentMode\"><b><font size=\"6\" color=\"#000080\">Point</font></b></div><br /><br />";
			eohtml += "";
			eohtml += "<b>Table to Edit: </b><br />";
			eohtml += "<select id='eo1' name='eo1' onchange='changeActTable(this.value)'>";
			for (i=0;i<tableArray.length;i++){
                if (tableGeomEdit[i] == 'Yes') {
    				if (tableArray[i] == table) {
    					//This is the currently selected option
    					eohtml += "<option selected='selected' value='" + tableArray[i] + "'>" + tableTitles[i] + "</option>";
    				} else {
    					//Other options
    					eohtml += "<option value='" + tableArray[i] + "'>" + tableTitles[i] + "</option>";
    				}
                }
			}
			eohtml += "</select><br />";
			eohtml += "<b>Function: </b> <input type=\"button\" id=\"stickymode\" value=\"Sticky Mode On\" onclick=\"thissticks()\" /><br />";
			eohtml += "<input type=\"radio\" name=\"edfunc\" value=\"none\" checked=\"checked\" onclick=\"edMO(3,0)\" />None<br />";
			eohtml += "<input type=\"radio\" name=\"edfunc\" value=\"add\" onclick=\"edMO(3,1)\" />Add Feature<br /><br />";
			eohtml += "";
			eohtml += "<div id=\"shapeoptions\" style=\"display:none;visibility:hidden;\">";
			eohtml += "<b>Extra Options: </b><br />";
			eohtml += "<div id=\"shapesides\" style=\"display:none;visibility:hidden;\">Number of Sides: <input name=\"sides\" id=\"sideNoInput\" value=\"3\" size=\"5\" onkeyup=\"edMO(2, 10);\" /><br /></div>";
			eohtml += "Irregular Shape? <input type=\"checkbox\" name=\"ireg\" checked=\"checked\" onchange=\"edMO(2, 9);\" />  <br /><br />";
			eohtml += "</div>";
			eohtml += "";
			eohtml += "<b><u>Edit Tools</u></b><br />";
			eohtml += "<input type=\"radio\" name=\"edfunc\" value=\"selEx\" onclick=\"edMO(3,2)\" />Switch feature to editable Layer<br />";
			eohtml += "";
			eohtml += "<b>Tools: </b><br />";
			eohtml += "<input type=\"radio\" name=\"edfunc\" value=\"move\" onclick=\"edMO(3,4)\" />Move Feature<br />";
			eohtml += "<input type=\"radio\" name=\"edfunc\" value=\"edit\" onclick=\"edMO(3,5)\" />Edit Feature<br />";
			eohtml += "<input type=\"radio\" name=\"edfunc\" value=\"rotate\" onclick=\"edMO(3,6)\" />Rotate Feature<br />";
			eohtml += "<input type=\"radio\" name=\"edfunc\" value=\"resize\" onclick=\"edMO(3,7)\" />Resize Feature<br />";
			eohtml += "<input type=\"radio\" name=\"edfunc\" value=\"del\" onclick=\"edMO(3,8)\" />Delete Feature<br /><br />";
			eohtml += "";
			eohtml += "<input type=\"button\" name=\"save\" value=\"Save Edits\" onclick=\"saveEdits()\" />";
			//eohtml += "</div></div></div>";

			var east6 = new Ext.Panel({
				title: "Editing Options",
				layout: 'fit',
				html: eohtml,
				bodyCfg : { cls:'x-panel-body no-x-scroll'}
			});
			east6.setAutoScroll('auto');
			
			/*EXT layout using accordion layout */
			if (loadEdits == 'True' || loadEdits == 'TRUE' || loadEdits == 'Yes' || loadEdits == 'YES') {
				if (legendtree == false) {
					accordion = new Ext.Panel({
						region:'east',
						margins:'5 0 5 5',
						split:true,
						width: 210,
						layout:'accordion',
						items: [east1, east1b, east2, east3, east4, east5, east6]
					});
				} else {
					accordion = new Ext.Panel({
						region:'east',
						margins:'5 0 5 5',
						split:true,
						width: 210,
						layout:'accordion',
						items: [east1, east2, east3, east4, east5, east6]
					});
				}
			} else {
				if (legendtree == false) {
					accordion = new Ext.Panel({
						region:'east',
						margins:'5 0 5 5',
						split:true,
						width: 210,
						layout:'accordion',
						items: [east1, east1b, east2, east3, east4, east5]
					});
				} else {
					accordion = new Ext.Panel({
						region:'east',
						margins:'5 0 5 5',
						split:true,
						width: 210,
						layout:'accordion',
						items: [east1, east2, east3, east4, east5]
					});
				}
			}
			
			if (table != ""){
				tableport = new Ext.Panel({
					region: 'south', 
					split: true,
					height: winH-88,
					collapsible: true,
					collapsed: true, //set this to true if the table is secondary
					title: 'Attributes Table',
					layout:'card',
					activeItem: 0, // index or id
					items: [{
						id: 'Attributes Query',
						style: 'background-color: #fff',
						html: ''
					}],
					listeners: {
						resize: function() {
							tableport.setPosition(0,28);
						}
					},
					margins: '0 0 0 0',
					bodyCfg : { cls:'x-panel-body no-x-scroll'}
				});
				
				if (loadAttributes == "True" || loadAttributes == 'TRUE' || loadAttributes == 'Yes' || loadAttributes == 'YES') {
					viewport = new Ext.Panel({ //Viewport would fill the full screen so I'm using a panel
						renderTo: 'h_first',
						height: winH-68,  //Trouble is that we need to specify a height.
						layout:'border',
						items:[accordion, mapPanel, tableport]
					});
				} else {
					viewport = new Ext.Panel({ //Viewport would fill the full screen so I'm using a panel
						renderTo: 'h_first',
						height: winH-68,  //Trouble is that we need to specify a height.
						layout:'border',
						items:[accordion, mapPanel]
					});
				}
			} else {
				viewport = new Ext.Panel({ //Viewport would fill the full screen so I'm using a panel
					renderTo: 'h_first',
					height: winH-68,  //Trouble is that we need to specify a height.
					layout:'border',
					items:[accordion, mapPanel]
				});
			}
		}
	}
	dir = "";
	colNo = "";
	colNo = "";
	if (table != ""){
		updateTable(tableHTML);
	}
}

function selectTog(conOn, groupN){
	handleTog(conOn, groupN);
	edtoggleControl2('sCF');
	for(key in controls2) {
		var control = controls2[key];
	}
}

function handleInfo(){
	popid = 0;
	for (i=0;i<overlayNo;i++){
		//Loop through the overlays and check if it has a popup
		if (overlayPopup[i]=='True'){
			//This overlay has a popup therefore we should decide whether or not to activate the popup
			var varname = "info" + i;
			if (window[varname].active == null) {
				//The tool is currently null
				window[varname].activate();
			} else if (window[varname].active === false) {
				//The tool is inactive, activate it
				window[varname].activate();
			} else {
				//The tool is active, deactivate it
				window[varname].deactivate();
			}
		}
	}
}

function selectHandle(feature){
	currGID = feature.data.gid;
	document.getElementById('currGID').value = currGID;
	document.getElementById('currGIDdone').value = parseInt(document.getElementById('lowerS').value);
	for (i=0;i<gidLookupToRow.length;i++){
		if (gidLookupToRow[i]==currGID){
			if (document.getElementById('filterS').value!=''){
				document.getElementById('lower2S').value = i;
			} else {
				document.getElementById('lowerS').value = i;
			}
		}
	}
}

function selectHandleOff(){
	currGID = '';
	parseInt(document.getElementById('currGID').value) = currGID;
	document.getElementById('lowerS').value = parseInt(document.getElementById('currGIDdone').value);
}

function handleTog(conOn, groupN, menuN){
	//This function was written to handle the edit buttons in the toolbar but now this is handled in the edMO() function. This is just a text update script.
	var onlyOncePlease = 0;
	if (conOn!=''){
		for (i=0; i< actionText.length; i++){
			if (actionText[i]!='' && actionText[i]!='-' && actionText[i]!='->'){
				if(actionText[i]==conOn  && actionGroup[i]==groupN){
					//Call the function which switches off the edit tools
					if (onlyOncePlease == 0) {
						edMO(3,100);
						onlyOncePlease = 1;
					}
					accordion.items.itemAt(0).expand();
					document.getElementById('footer').innerHTML = 'Currently Active Tool: ' + actionText[i];
				}
			}
				
			if(groupN=='none') {
				//This is an edit tool
				document.getElementById('footer').innerHTML = 'Currently Active Tool: ' + conOn;
			}
		}
	}
}

function changeGeomType(){
	var editTArr = ['draw1', 'edit_reshape1', 'edit_drag1', 'edit_resize1', 'edit_rotate1', 'del1', 'draw2', 'edit_reshape2', 'edit_drag2', 'edit_resize2', 'edit_rotate2', 'del2', 'draw3', 'edit_reshape3', 'edit_drag3', 'edit_resize3', 'edit_rotate3', 'del3', 'draw4', 'edit_reshape4', 'edit_drag4', 'edit_resize4', 'edit_rotate4', 'del4'];
	var thereCanBeOnlyOne = 0;
	for (i=0; i<editTArr.length; i++){
		if (window[editTArr[i]].active == true && thereCanBeOnlyOne == 0){
			//This edit tool is currently active lets deactivate and then activate the correct one
			window[editTArr[i]].deactivate();
			var tool = editTArr[i].substring(0,editTArr[i].length-1);
			var actionStr = tool+ET;
			window[actionStr].activate();
			thereCanBeOnlyOne = 1;
			for(i2=0; i2<actionArr.length; i2++) {
				if (actionArr[i2]==tool) {
					if (ET==1){
						document.getElementById('footer').innerHTML = 'Currently Active Tool: ' + actionText[i2] + ' Point';
					} else if (ET==2) {
						document.getElementById('footer').innerHTML = 'Currently Active Tool: ' + actionText[i2] + ' Line';
					} else if (ET==3) {
						document.getElementById('footer').innerHTML = 'Currently Active Tool: ' + actionText[i2] + ' Polygon';
					} else {
						document.getElementById('footer').innerHTML = 'Currently Active Tool: ' + actionText[i2] + ' Box/Shape';
					}
				}
			}
		}
	}
}

function insertRow(tableHTML){
    var xhr = false;
	if (window.ActiveXObject){
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		xhr = new XMLHttpRequest();
	}
	table = tableHTML;
	//The recNo and lower values are now array variable so we need to split up the arrays however for now we simply pass it to the php file
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	lower2 = document.getElementById('lower2S').value;

    tableHTML = "../../apps/functions/results.php?table=" + table + "&function=add";

    xhr.open("GET",tableHTML,true); // Insert a reference of the php page you wanna get instead of yourpage.php
	xhr.send(null);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			if (!document.getElementById('Attributes Query')) {
				document.location.reload();
			} else {
				document.getElementById('Attributes Query').innerHTML = xhr.responseText;
				document.getElementById('urlS').value = tableHTML;
			}
		} else {
			if (xhr.status != 200){
				alert ('Request Failed' + xhr.status);
			}
		}
	};
}

function updateTable(tableHTML, override, tableSwap){
	var xhr = false;
	if (window.ActiveXObject){
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		xhr = new XMLHttpRequest();
	}

	//The recNo and lower values are now array variable so we need to split up the arrays however for now we simply pass it to the php file
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	lower2 = document.getElementById('lower2S').value;
	
	if (typeof tableSwap != 'undefined'){
		table = tableSwap;
	}

	if (override != 'override'){
		tableHTML = "../../apps/functions/results.php?table=" + table + "&function=" + document.getElementById('functionS').value;

		//Add recNo and lower
		if (document.getElementById('filterS').value!=''){
			tableHTML = tableHTML + "&recNo=" + recNo + "&lower=" + lower2; //Need to temporarily override the lower if there is a filter
		} else {
			tableHTML = tableHTML + "&recNo=" + recNo + "&lower=" + lower;
		}

		//Add a selected row where appropriate
		if (currGID!=''){
			tableHTML = tableHTML + "&currGID=" + document.getElementById('currGID').value;
		}

		//Add a filter if present
		if (document.getElementById('filterS').value!=''){
			tableHTML = tableHTML + "&filter=" + document.getElementById('filterS').value;
		}
		document.getElementById('urlS').value = tableHTML;
	}
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			if (!document.getElementById('Attributes Query')) {
				if(loadAttributes==true || loadAttributes=="True" || loadAttributes=="true" || loadAttributes=="Yes" || loadAttributes=="yes"){
					document.location.reload();
				} else {
					document.getElementById('searchHandler').innerHTML = xhr.responseText;
				}
			} else {
				document.getElementById('Attributes Query').innerHTML = xhr.responseText;

				if (tableHTML.indexOf("function=geomsave")!=-1) {
					defineFieldNames(table);
					var headID = document.getElementsByTagName("head")[0];
					var newScript = document.createElement('script');
					newScript.type = 'text/javascript';
					var textStr = "../../apps/functions/dynamite.php" + tableHTML.substr(32); //This removes the results.php section of the other URL
					newScript.src = textStr;
					headID.appendChild(newScript);
					//CHECK THIS
				} else {
					document.getElementById('urlS').value = tableHTML;
				}
			}
		} else {
			if (typeof xhr.status != "undefined" && typeof xhr.status != "unknown") {
				if (xhr.status != 200 && xhr.status != 0){
					alert ('Request Failed' + xhr.status);
				}
			}
		}
	}
	xhr.open("GET",tableHTML,true); // Insert a reference of the php page you wanna get instead of yourpage.php
	xhr.send(null);
}

function checkFrame() {
	var finduser, stopuser, icontent, icontentChk;
	document.getElementById('header').innerHTML = "<span style='font-weight: bold;'>"+appTitle+"</span><span style='font-size: small;color: #000000;position:absolute;right:0px;'>Logged in as: "+usertext+" <input type='button' value='Logout' onclick='logItOut()' /></span>";
}

Ext.onReady(function(){
	//Set the page titles
	var loginDetails;
	loginScript();
	document.title = appTitle;
});

function setSessionC() {
	//The session ID may be new or old but we reset the cookie to ensure the expiry is always 30 minutes
	var exdate=new Date();
	exdate.setTime(exdate.getTime()+(30*60*1000)); //This is the decimal for 30 minutes (i.e. 1 = 24 hours)
	var exdate2=new Date();
	exdate2.setTime(exdate2.getTime()+(60*60*1000)); //This is the decimal for 60 minutes (i.e. 1 = 24 hours)
	var cookieText = "RBCG1SCOOKIE=" + session_id + "; expires=" + exdate.toGMTString() + "; path=/";			
	document.cookie=cookieText;
	//The second cookie allows me to warn the user that their changes were or almost were lost due to inactivity
	var cookieText = "RBCG3SCOOKIE=" + exdate2.getTime() + "; expires=" + exdate2.toGMTString() + "; path=/";			
	document.cookie=cookieText;
}

function chkSession() {
	//Check for a session id stored in a cookie
	session_id='';
	session_timer='';
	var session_present = 1;
	var nameEQ = "RBCG1SCOOKIE=";
	var ca = document.cookie.split(';');
	for(i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {c = c.substring(1,c.length);}
		if (c.indexOf(nameEQ) == 0) {
			session_id = c.substring(nameEQ.length,c.length);
		}
	}
	var nameEQ = "RBCG2SCOOKIE=";
	var ca = document.cookie.split(';');
	for(i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {c = c.substring(1,c.length);}
		if (c.indexOf(nameEQ) == 0) {
			var session_timer = c.substring(nameEQ.length,c.length);
		}
	}
	if (session_id=='' && session_timer!='') {
		//Your session timed out, sorry!
		alert('Your edit session has not been used for 30 minutes and therefore has timed out.\n Your edits have been lost, please save your work more frequently!');
	} else if (session_timer!='') {
		//Check how long is left, if 10 minutes or less, warn the user
		var currentDate = new Date();
		var timepassed = session_timer - currentDate.getTime();
		timepassed = ((timepassed /1000)/60);
		if (timepassed >= 20){
			alert('Warning! It has been longer than 20 minutes since your last edit.\n Your session will time out after 30 minutes of inactivity so please be sure to save regularly');
		}
	}
}

function setStyle(inStr){
	var overlayRef, styleRef, loc;
	loc = inStr.indexOf('|');
	overlayRef = inStr.substr(0,loc);
	styleRef = inStr.substr(loc+1);
						
	// we may be switching style on setup
	if(window[overlayRef] == null)
	  return;
	  
	window[overlayRef].mergeNewParams({
		styles: styleRef
	});
}
