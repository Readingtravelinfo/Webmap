/*
Please note, you can use the line 

debugger;

If you need to debug a script in firebug without alerts
*/

//Global variables
var i, i2, centrePanel, mapPanel, tbarVar, legendPanel, tableport, viewport, photoscroller, photoscroller2, pslow, pshigh, hoverpopup;
var photoArray, tree, tableURL, accordion, fieldNames, currGID, currGID2, tableWidth;
var east1, east1b, east2, east3, east4, east5, east6, wfsH;
var recNo, lower, filter, tempOverlay, filterStrategy, filterStrategy2;
var mapMini, map3, format, controls, controls2, controls3, markers, selectM, extent, runOnce, session_id, mousePos, hover, selection, pshtml;
var BMapMini, BMapMini2, geomOL, pointLayer, lineLayer, polygonLayer, simplePolygonLayer, selectedRow;
var htmlText, dir, colNo, maxCol, toolbarItems, actions, actionArr, groupIn, actionText, actionGroup;
var zoomLev, Curvefactor, Scalefactor, curve, curPower1, curPower, Distfactor, SetNo, currLev, splitSize; //Curve variables
var nav, zoomCon, zoomCon2, selectCtrl, measureline, measurepolygon, draw1, draw2, draw3, draw4, save;
var ET, ET2, ET3, ET4, edit_reshape1, edit_drag1, edit_resize1, edit_rotate1, del1, edit_reshape2, edit_drag2, edit_resize2, edit_rotate2, del2, edit_reshape3, edit_drag3, edit_resize3, edit_rotate3, del3;
var edit_reshape4, edit_drag4, edit_resize4, edit_rotate4, del4, edit_reshape, edit_drag, edit_resize, edit_rotate, del, edit_select, edit_select_no;
var ETpoint, ETpath, ETpolygon, ETbox, draw;
var doPopup, doZoom, doSelect;
var copywriteTxt, copywriteTxt2;
var poiSaveStrategy, linSaveStrategy, polSaveStrategy, sPolSaveStrategy;
var firsttime, geoLoc, legendHTML, styleObj, tmpON, tmpON2, tmpON3;
var stickyvalue = 0;
var popid = 0;
var pixel;
var photoactive = false;
var locationShift = 0;
var infoSwitch = [];
var wfsselectControl;
var colsortsTitle = [];
var colsorts = [];
ET = 1;  //Default is pointLayer
ET2 = 1; //Default is point
ET3 = 0; //Default is none
ET4 = 0; //Default is select without edit
tableWidth = '1000px'; //Default value gets overiden later
currGID = ''; //Default is that there is no selected record
geoLoc = false; //Turn geolocation on/off
format = 'image/png';
var filter_1_1 = new OpenLayers.Format.Filter({version: "1.1.0"});
var xml = new OpenLayers.Format.XML();

// handler for the OpenLayers.Request.GET function which parses the SLD
var SLDformat = new OpenLayers.Format.SLD({multipleSymbolizers: true});
var rootNode, jsonStringReady;
var jsonString = '';
var jQueryStore = {};
jsonStringReady = 0;
function setupSLD(jQuery1, tmpWFSname2, tmpWFSname3, call){
	if (call==1) {
		i = jQuery1.length-1;
		while (i>=0){
			if (overlayDILS[i]==true){
				var overlaySetName = tmpWFSname2[i];
				var overlayAddress2 = tmpWFSname3[i];
				var data1 = OpenLayers.Request.GET({
					url: jQuery1[i],
					async: false
				});
				data1 = $.parseJSON(data1.responseText);
				var sldName = data1.layer.defaultStyle.name;
				var jQuery2 = Dpath + "rest/styles/" + sldName + ".sld";
				var sld = OpenLayers.Request.GET({
					url: jQuery2,
					async: false
				});
				jQueryStore[jQuery2] = {
					location: [],
					nodeStore: {}
				}; //Store this jQuery for reference later
				sld = SLDformat.read(sld.responseText);
				sld = sld.namedLayers;
				sld = sld[sldName];
				sld = sld.userStyles[0].rules;
				for (i3=0;i3<sld.length;i3++){
					jQueryStore[jQuery2].location.push(styleArray.length);
					styleArray.push(overlaySetName);
					styleFilter.push(sld[i3].filter); //Used in next call which sets up the filters
					styleText.push(sld[i3].title);
					//NB - spaces at the end of a style name will stop the icons loading!
					styleImage.push(Dpath + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + overlayAddress2 + '&RULE=' + sld[i3].name);
					styleNum.push(i);
					styleLName.push(overlayTitle[i]);
				}
			}
			i = i - 1;
		}
	} else if (call==2){
		//Generate the menu from the style arrays
		//This is a new version which removes the reliance on EXTjs which is difficult to fully control

		//Firstly we need to create a menu object which will then later define the HTML and interactions
		var tmpSObj, currentOL, Tmpfilter, currState;
		styleObj = {
			layers: []
		};
		i2 = -1;
		currentOL = "";
		var nH;
		for (i=0;i<styleArray.length;i++){
			if (styleArray[i]!=currentOL){
				//This is a new layer
				i2 = i2 + 1;
				currentOL = styleArray[i];
				currState = false;
				for(nH=0;nH<onasdefault.length;nH++){
					if(wfsArray[nH] == currentOL){
						if(onasdefault[nH]=='True'){
							currState = true;
						} else {
							currState = false;
						}
					}
				}
				tmpSObj = {
					"checked": currState,
					text: styleLName[i],
					"expanded":true,
					"layer":currentOL,
					"ftype":"layerSwitch",
					"fproperty":"",
					"fvalue":"",
					nodes: []
				};
				styleObj.layers.push(tmpSObj);
				
				//Add the first child node for the latest layer
				Tmpfilter = styleFilter[i];
				if(Tmpfilter===null){
					tmpSObj = {
						text: styleText[i],
						"checked": currState,
						"disabled": true,
						"icon": styleImage[i],
						"layer":currentOL,
						"ffilter":"",
						"ftype":"disabled",
						"fproperty":"",
						"fvalue":""
					};
				} else {
					if(typeof Tmpfilter.filters != 'undefined'){
						//This is a more complex filter, not based on a single field
						tmpSObj = {
							text: styleText[i],
							"checked": currState,
							"icon": styleImage[i],
							"layer":currentOL,
							"ffilter":Tmpfilter.filters,
							"ftype":"Complex",
							"fproperty":"",
							"fvalue":""
						};
					} else {
						tmpSObj = {
							text: styleText[i],
							"checked": currState,
							"icon": styleImage[i],
							"layer":currentOL,
							"ffilter":"",
							"ftype":Tmpfilter.type,
							"fproperty":Tmpfilter.property,
							"fvalue":Tmpfilter.value
						};
					}
				}
				styleObj.layers[i2].nodes.push(tmpSObj);
			} else {
				//This will be a child node for the latest layer
				Tmpfilter = styleFilter[i];
				if(Tmpfilter===null){
					tmpSObj = {
						text: styleText[i],
						"checked": currState,
						"disabled": true,
						"icon": styleImage[i],
						"layer":currentOL,
						"ffilter":"",
						"ftype":"disabled",
						"fproperty":"",
						"fvalue":""
					};
				} else {
					if(typeof Tmpfilter.filters != 'undefined'){
						//This is a more complex filter, not based on a single field
						tmpSObj = {
							text: styleText[i],
							"checked": currState,
							"icon": styleImage[i],
							"layer":currentOL,
							"ffilter":Tmpfilter.filters,
							"ftype":"Complex",
							"fproperty":"",
							"fvalue":""
						};
					} else {
						tmpSObj = {
							text: styleText[i],
							"checked": currState,
							"icon": styleImage[i],
							"layer":currentOL,
							"ffilter":"",
							"ftype":Tmpfilter.type,
							"fproperty":Tmpfilter.property,
							"fvalue":Tmpfilter.value
						};
					}
				}
				styleObj.layers[i2].nodes.push(tmpSObj);
			}
		}
		//alert(styleObj.toSource());

		//The object created contains all the information required to generate the lengend
		legendHTML = '<div id="theLegend">';
		for(i=0;i<styleObj.layers.length;i++){
			//Get the layer number from the array
			layername = styleObj.layers[i].layer;
			layernumber = layername.replace("wfs","");
			layernumber = parseInt(layernumber);

			//Wrap the layer
			if(i===0){
				legendHTML += '<div id="layer' + layernumber + '" class="legendLayer">';
			} else {
				legendHTML += '</div><div id="layer' + layernumber + '" class="legendLayer">';
			}

			//Is this a layer without children?
			if (typeof styleObj.layers[i].nodes[1] === 'undefined'){
				//This is a layer without children, we show a normal legend for this layer
				//Provide a layer info div
				legendHTML += '<div id="layerTitle' + layernumber + '" class="legendTitle">';
				legendHTML += '<img src="../../apps/img/sspace.png" />';
				if(styleObj.layers[i].checked == true){
					legendHTML += '<input class="legendCheck" type="checkbox" checked="" id="layerCheck' + layernumber + '" onclick="legendHandler(' + layernumber + ')"><img src="../../apps/img/sspace.png" />';
				} else {
					legendHTML += '<input class="legendCheck" type="checkbox" id="layerCheck' + layernumber + '" onclick="legendHandler(' + layernumber + ')"><img src="../../apps/img/sspace.png" />';
				}
				legendHTML += styleObj.layers[i].text + '</div>';

				//Set the legend
				var tmpURL = Dpath + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + tmpWFSname3[layernumber];
				legendHTML += '<div id="layer' + layernumber + 'node' + i2 + '" class="legendImage"><img src="' + tmpURL + '" /></div>';
			} else {
				//Provide a layer info div
				legendHTML += '<div id="layerTitle' + layernumber + '" class="legendTitle">';
				//alert(styleObj.layers[i].checked);
				if(styleObj.layers[i].checked == true){
					legendHTML += '<span id="cross' + layernumber + '"><img src="../../apps/img/less.gif" onclick="legendCollapse(' + layernumber + ', \'less\')" /></span><img src="../../apps/img/sspace.png" />';
					legendHTML += '<input class="legendCheck" type="checkbox" checked="" id="layerCheck' + layernumber + '" onclick="legendHandler(' + layernumber + ')"><img src="../../apps/img/sspace.png" />';
				} else {
					legendHTML += '<span id="cross' + layernumber + '"><img src="../../apps/img/more.gif" onclick="legendCollapse(' + layernumber + ', \'more\')" /></span><img src="../../apps/img/sspace.png" />';
					legendHTML += '<input class="legendCheck" type="checkbox" id="layerCheck' + layernumber + '" onclick="legendHandler(' + layernumber + ')"><img src="../../apps/img/sspace.png" />';
				}
				legendHTML += styleObj.layers[i].text + '</div>';

				//Loop through the child nodes and add the relevant nodes
				for(i2=0;i2<styleObj.layers[i].nodes.length;i2++){
					if(styleObj.layers[i].checked == true){
						legendHTML += '<div id="layer' + layernumber + 'node' + i2 + '" class="legendNodeShow">';
					} else {
						legendHTML += '<div id="layer' + layernumber + 'node' + i2 + '" class="legendNodeHide">';
					}
					if(i2+1==styleObj.layers[i].nodes.length){
						legendHTML += '<img src="../../apps/img/respace.png" style="block" />';
					} else {
						legendHTML += '<img src="../../apps/img/rspace.png" style="block"  />';
					}
					if(styleObj.layers[i].nodes[i2].checked == true){
						legendHTML += '<input class="legendCheck" type="checkbox" checked="" id="layerCheck' + layernumber + 'node' + i2 + '" onclick="legendHandler(\'' + layernumber + '-' + i2 + '\')"><img src="../../apps/img/sspace.png" />';
					} else {
						legendHTML += '<input class="legendCheck" type="checkbox" id="layerCheck' + layernumber + 'node' + i2 + '" onclick="legendHandler(\'' + layernumber + '-' + i2 + '\')"><img src="../../apps/img/sspace.png" />';
					}
					legendHTML += '<img src="' + styleObj.layers[i].nodes[i2].icon + '" /><img src="../../apps/img/sspace.png" />';
					legendHTML += styleObj.layers[i].nodes[i2].text;
					legendHTML += '</div>';
				}
			}
		}
		legendHTML += '</div>';
		jsonStringReady = 1;
	} else if (call==3){
		//OK, this call is a request to alter an existing record because the style has changed

		//Look for an existing jQuery Store
		if(typeof jQueryStore[jQuery1] !== 'undefined'){
			//We have a previously loaded style


		} else {
			//OK this is a new record
			var overlaySetName = tmpWFSname2;
			var overlayAddress2 = tmpWFSname3;
			i = -1;
			for(i2=0;i2<overlayAddress.length;i2++){
				if (overlayAddress[i2]===overlayAddress2){
					i = i2;
				}
			}

			if(i!==-1){
				var sldName = jQuery1;
				var jQuery2 = Dpath+ "rest/styles/"+ sldName + ".sld";
				var sld = OpenLayers.Request.GET({
					url: jQuery2,
					async: false
				});
				jQueryStore[jQuery2] = {
					location: [],
					nodeStore: {}
				}; //Store this jQuery for reference later
				sld = SLDformat.read(sld.responseText);
				sld = sld.namedLayers;
				sld = sld[sldName];
				sld = sld.userStyles[0].rules;
				//alert(sld.toSource());
				for (i3=0;i3<sld.length;i3++){
					jQueryStore[jQuery2].location.push(styleArray.length);
					styleArray.push(overlaySetName);
					styleFilter.push(sld[i3].filter); //Used in next call which sets up the filters
					styleText.push(sld[i3].title);
					//NB - spaces at the end of a style name will stop the icons loading!
					styleImage.push(Dpath + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&style=' + sldName + '&LAYER=' + overlayAddress2 + '&RULE=' + sld[i3].name);
					styleNum.push(i);
					styleLName.push(overlayTitle[i]);
				}
			}

			//Backup the existing objects

			var wfsRef = overlaySetName.replace("overlay","wfs");
			var layernum = -1;
			for (i=0;i<styleObj.layers.length;i++){
				if(styleObj.layers[i].layer===wfsRef){
					layernum = i;
				}
			}
			if(layernum!==-1){
				jQueryStore[jQuery2].nodeStore = styleObj.layers[layernum];

				//Create the objects for this new style here
				currentOL = wfsRef;
				layernumber = wfsRef.replace("wfs","");
				layernumber = parseInt(layernumber);
				currState = styleObj.layers[layernum].checked;
				tmpSObj = {
					"checked": currState,
					text: styleObj.layers[layernum].text,
					"expanded":true,
					"layer":currentOL,
					"ftype":"layerSwitch",
					"fproperty":"",
					"fvalue":"",
					nodes: []
				}

				//Add the child nodes to this tempObject
				for (i=0;i<jQueryStore[jQuery2].location.length;i++){
					var i2 = jQueryStore[jQuery2].location[i];
					Tmpfilter = styleFilter[i2];
					if(Tmpfilter===null){
						tmpSObj.nodes.push({
							text: styleText[i2],
							"checked": currState,
							"disabled": true,
							"icon": styleImage[i2],
							"layer":currentOL,
							"ffilter":"",
							"ftype":"disabled",
							"fproperty":"",
							"fvalue":""
						});
					} else {
						if(typeof Tmpfilter.filters != 'undefined'){
							//This is a more complex filter, not based on a single field
							tmpSObj.nodes.push({
								text: styleText[i2],
								"checked": currState,
								"icon": styleImage[i2],
								"layer":currentOL,
								"ffilter":Tmpfilter.filters,
								"ftype":"Complex",
								"fproperty":"",
								"fvalue":""
							});
						} else {
							tmpSObj.nodes.push({
								text: styleText[i2],
								"checked": currState,
								"icon": styleImage[i2],
								"layer":currentOL,
								"ffilter":"",
								"ftype":Tmpfilter.type,
								"fproperty":Tmpfilter.property,
								"fvalue":Tmpfilter.value
							});
						}
					}
				}

				//Replace the currently active object
				styleObj.layers[layernum] = tmpSObj;
				//alert(styleObj.layers[layernum].toSource());
			}
		}

		//Set up the new HTML for this layer
		var legendEntry = '';
		//Is this a layer without children?
		if (typeof styleObj.layers[layernum].nodes[0] === 'undefined'){
			//This is a layer without children, we show a normal legend for this layer
			//Provide a layer info div
			legendEntry += '<div id="layerTitle' + layernumber + '" class="legendTitle">';
			legendEntry += '<img src="../../apps/img/sspace.png" />';
			if(styleObj.layers[layernum].checked == true){
				legendEntry += '<input class="legendCheck" type="checkbox" checked="" id="layerCheck' + layernumber + '" onclick="legendHandler(' + layernumber + ')"><img src="../../apps/img/sspace.png" />';
			} else {
				legendEntry += '<input class="legendCheck" type="checkbox" id="layerCheck' + layernumber + '" onclick="legendHandler(' + layernumber + ')"><img src="../../apps/img/sspace.png" />';
			}
			legendEntry += styleObj.layers[layernum].text + '</div>';

			//Set the legend
			var tmpURL = Dpath + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + tmpWFSname3[layernumber];
			legendEntry += '<div id="layer' + layernumber + 'node' + i2 + '" class="legendImage"><img src="' + tmpURL + '" /></div>';
		} else {
			//Provide a layer info div
			legendEntry += '<div id="layerTitle' + layernumber + '" class="legendTitle">';
			//alert(styleObj.layers[layernum].checked);
			if(styleObj.layers[layernum].checked == true){
				legendEntry += '<span id="cross' + layernumber + '"><img src="../../apps/img/less.gif" onclick="legendCollapse(' + layernumber + ', \'less\')" /></span><img src="../../apps/img/sspace.png" />';
				legendEntry += '<input class="legendCheck" type="checkbox" checked="" id="layerCheck' + layernumber + '" onclick="legendHandler(' + layernumber + ')"><img src="../../apps/img/sspace.png" />';
			} else {
				legendEntry += '<span id="cross' + layernumber + '"><img src="../../apps/img/more.gif" onclick="legendCollapse(' + layernumber + ', \'more\')" /></span><img src="../../apps/img/sspace.png" />';
				legendEntry += '<input class="legendCheck" type="checkbox" id="layerCheck' + layernumber + '" onclick="legendHandler(' + layernumber + ')"><img src="../../apps/img/sspace.png" />';
			}
			legendEntry += styleObj.layers[layernum].text + '</div>';

			//Loop through the child nodes and add the relevant nodes
			for(i2=0;i2<styleObj.layers[layernum].nodes.length;i2++){
				if(styleObj.layers[layernum].checked == true){
					legendEntry += '<div id="layer' + layernumber + 'node' + i2 + '" class="legendNodeShow">';
				} else {
					legendEntry += '<div id="layer' + layernumber + 'node' + i2 + '" class="legendNodeHide">';
				}
				if(i2+1==styleObj.layers[layernum].nodes.length){
					legendEntry += '<img src="../../apps/img/respace.png" style="block" />';
				} else {
					legendEntry += '<img src="../../apps/img/rspace.png" style="block"  />';
				}
				if(styleObj.layers[layernum].nodes[i2].checked == true){
					legendEntry += '<input class="legendCheck" type="checkbox" checked="" id="layerCheck' + layernumber + 'node' + i2 + '" onclick="legendHandler(\'' + layernumber + '-' + i2 + '\')"><img src="../../apps/img/sspace.png" />';
				} else {
					legendEntry += '<input class="legendCheck" type="checkbox" id="layerCheck' + layernumber + 'node' + i2 + '" onclick="legendHandler(\'' + layernumber + '-' + i2 + '\')"><img src="../../apps/img/sspace.png" />';
				}
				legendEntry += '<img src="' + styleObj.layers[layernum].nodes[i2].icon + '" /><img src="../../apps/img/sspace.png" />';
				legendEntry += styleObj.layers[layernum].nodes[i2].text;
				legendEntry += '</div>';
			}
		}

		//Finally we replace the actual HTML
		document.getElementById('layer' + layernumber).innerHTML = legendEntry;
	}
}

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
var zip;
function dd() {
	var parts, part1, part2, part3, part4;
	//This is the download script

	//Get the values
	part1 = document.getElementById('ddp1').value; //This is the workspace name i.e. RBC:trafficsites
	var layerRef = part1.substring(0,part1.indexOf("]"));
	layerRef = parseInt(layerRef.substring(1),10);
	part1 = part1.substring(part1.indexOf("]")+1);
	part2 = document.getElementById('ddp2').value; //This is the output format
	part3 = '';
	part4 = '/apps/functions/sirdownloadalot.php'; //We use this URL to process KML
	var cqlStr;
	if (typeof window["wfs" + layerRef].filter != 'undefined'){
		if (window["wfs" + layerRef].filter != null){
			cqlStr = window["wfs" + layerRef].filter;
		} else {
			cqlStr = '';
		}
	} else {
		cqlStr = '';
	}

	if (part2 == "&outputFormat=shape-zip"){
		if(isIE === false){
			xmlStr = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">';
			xmlStr += '  <ows:Identifier>vec:Query</ows:Identifier>';
			xmlStr += '  <wps:DataInputs>';
			xmlStr += '	<wps:Input>';
			xmlStr += '	  <ows:Identifier>features</ows:Identifier>';
			xmlStr += '	  <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">';
			xmlStr += '		<wps:Body>';
			xmlStr += '		  <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:RBC="https://geo.reading-travelinfo.co.uk/rbc">';
			xmlStr += '			<wfs:Query typeName="' + part1 + '"/>';
			xmlStr += '		  </wfs:GetFeature>';
			xmlStr += '		</wps:Body>';
			xmlStr += '	  </wps:Reference>';
			xmlStr += '	</wps:Input>';
			if (cqlStr != ''){
				xmlStr += '	<wps:Input>';
				xmlStr += '	  <ows:Identifier>filter</ows:Identifier>';
				xmlStr += '	  <wps:Data>';
				xmlStr += '		<wps:ComplexData mimeType="text/plain; subtype=cql"><![CDATA[' + cqlStr + ']]></wps:ComplexData>';
				xmlStr += '	  </wps:Data>';
				xmlStr += '	</wps:Input>';
			}
			xmlStr += '  </wps:DataInputs>';
			xmlStr += '  <wps:ResponseForm>';
			xmlStr += '	<wps:RawDataOutput mimeType="application/zip">';
			xmlStr += '	  <ows:Identifier>result</ows:Identifier>';
			xmlStr += '	</wps:RawDataOutput>';
			xmlStr += '  </wps:ResponseForm>';
			xmlStr += '</wps:Execute>';

			document.getElementById('ddupdate').innerHTML = 'Preparing your download...please wait';

			var oReq = new XMLHttpRequest();
			oReq.open("POST", Dpath + 'wps', true);
			oReq.setRequestHeader("Content-Type", "text/xml;charset=utf-8");
			oReq.responseType = "arraybuffer";
			oReq.onload = function(e) {
				var arraybuffer = oReq.response; // not responseText
				zip = new JSZip(arraybuffer);
				document.getElementById('ddupdate').innerHTML = '<a href="#" id="data_uri">Download File</a>';
				document.getElementById('data_uri').href = "data:application/zip;base64," + zip.generate();
			}
			oReq.send(xmlStr);
		} else {
			document.getElementById('ddupdate').innerHTML = 'Shapefile downloads are not available in Internet Explorer<br /> Please use Chrome or Firefox.';
		}
	} else if (part2 == "&outputFormat=CSV") {
		if(isIE === false){
			xmlStr = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">';
			xmlStr += '  <ows:Identifier>vec:Query</ows:Identifier>';
			xmlStr += '  <wps:DataInputs>';
			xmlStr += '	<wps:Input>';
			xmlStr += '	  <ows:Identifier>features</ows:Identifier>';
			xmlStr += '	  <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">';
			xmlStr += '		<wps:Body>';
			xmlStr += '		  <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:RBC="https://geo.reading-travelinfo.co.uk/rbc">';
			xmlStr += '			<wfs:Query typeName="' + part1 + '"/>';
			xmlStr += '		  </wfs:GetFeature>';
			xmlStr += '		</wps:Body>';
			xmlStr += '	  </wps:Reference>';
			xmlStr += '	</wps:Input>';
			if (cqlStr != ''){
				xmlStr += '	<wps:Input>';
				xmlStr += '	  <ows:Identifier>filter</ows:Identifier>';
				xmlStr += '	  <wps:Data>';
				xmlStr += '		<wps:ComplexData mimeType="text/plain; subtype=cql"><![CDATA[' + cqlStr + ']]></wps:ComplexData>';
				xmlStr += '	  </wps:Data>';
				xmlStr += '	</wps:Input>';
			}
			xmlStr += '  </wps:DataInputs>';
			xmlStr += '  <wps:ResponseForm>';
			xmlStr += '	<wps:RawDataOutput mimeType="application/wfs-collection-1.1">';
			xmlStr += '	  <ows:Identifier>result</ows:Identifier>';
			xmlStr += '	</wps:RawDataOutput>';
			xmlStr += '  </wps:ResponseForm>';
			xmlStr += '</wps:Execute>';

			document.getElementById('ddupdate').innerHTML = 'Preparing your download...please wait';

			var oReq = new XMLHttpRequest();
			oReq.open("POST", Dpath + 'wps', true);
			oReq.setRequestHeader("Content-Type", "text/xml;charset=utf-8");
			oReq.onload = function(e) {
				var tmpResText = oReq.responseText.substring(oReq.responseText.indexOf('>')+1);
				tmpResText = tmpResText.replace(/<feature:/g,"<");
				tmpResText = tmpResText.replace(/<\/feature:/g,"</");
				tmpResText = tmpResText.replace(/<gml:/g,"<");
				tmpResText = tmpResText.replace(/<\/gml:/g,"</");
				tmpResText = tmpResText.replace(/<wfs:/g,"<");
				tmpResText = tmpResText.replace(/<\/wfs:/g,"</");
				tmpResText = tmpResText.replace(' xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows" xmlns:wfs="http://www.opengis.net/wfs" xmlns:feature="https://geo.reading-travelinfo.co.uk/rbc"','');
				tmpResText = tmpResText.replace(/gml:/g,"");

				var exportedXMLdoc = tmpResText;
				if (window.DOMParser){
					parser=new DOMParser();
					exportedXML=parser.parseFromString(tmpResText,"text/xml");
				} else {
					// Internet Explorer
					exportedXML=new ActiveXObject("Microsoft.XMLDOM");
					exportedXML.async=false;
					exportedXML.loadXML(tmpResText);
				}

				//In order to pass the xmlDOM we need to know the fieldnames in this layer
				url = Dpath + "wfs?request=DescribeFeatureType&typeName=" + part1 + "&outputFormat=application/json";
				$.get(url,function(data){
					var fielDRefa = [];
					data = JSON.stringify(data);
					var jsonRes = data.split("name\":");
					for(i=0;i<jsonRes.length;i++){
						if(i!=0){
							//Assuming that the fields are not in the first row
							var tmpStrP = jsonRes[i].substring(1);
							tmpStrP = tmpStrP.substring(0,tmpStrP.indexOf('"'));
							fielDRefa.push(tmpStrP);
						}
					}

					//Now we right away a CSV file by parsing through the XML
					var tmpFN, CSVstr;
					var exF = [];
					var exL = exportedXML.getElementsByTagName("featureMember").length;
					CSVstr = '';
					for (i=0;i<exL;i++){
						if(i==0){
							//First time round we need to load the exF's
							for(i2=0;i2<fielDRefa.length;i2++){
								//Pickup the XML entity for this field
								tmpFN = fielDRefa[i2];
								exF.push(exportedXML.getElementsByTagName(tmpFN));
								if(i2!=0){
									CSVstr += ",";
								}
								CSVstr += fielDRefa[i2];
							}
							CSVstr += "\n";
						}

						//Now we need to write the CSV lines
						for(i2=0;i2<fielDRefa.length;i2++){
							if(i2!=0){
								CSVstr += ",";
							}
							if (typeof exF[i2][i]!='undefined'){
								if (typeof exF[i2][i].childNodes[0]!='undefined'){
									if (exF[i2][i].childNodes[0].nodeValue!=null){
										if (exF[i2][i].childNodes[0].nodeValue.indexOf('"')==-1){
											CSVstr += exF[i2][i].childNodes[0].nodeValue;
										} else {
											CSVstr += exF[i2][i].childNodes[0].nodeValue;
										}
									} else {
										CSVstr += "null";
									}
								} else {
									CSVstr += "null";
								}
							} else {
								CSVstr += "null";
							}
						}
						CSVstr += "\n";
					}
					//Record the values and submit
					document.getElementById('sdalval').value = CSVstr;
					document.getElementById('sdalval2').value = 'Data_Download.csv';
					document.getElementById('sdalval3').value = 'application/CSV';
					document.getElementById('sirdownloadalotform').submit();

					//Clear the form fields to avoid errors
					document.getElementById('sdalval').value = '';
					document.getElementById('sdalval2').value = '';
					document.getElementById('sdalval3').value = '';

					//Free the memory of the arrays
					exF = [];
					CSVstr = '';
				});
			}
			oReq.send(xmlStr);
		} else {
			document.getElementById('ddupdate').innerHTML = 'CSV downloads are not available in Internet Explorer<br /> Please use Chrome or Firefox.';
		}
	} else if (part2 == "&outputFormat=KML") {
		document.getElementById('ddupdate').innerHTML = 'Preparing your download...please wait';

		var kmlStr = "&format_options=kmattr:true;legend:false;kmscore:100;kmltitle:Data_Download&mode=download"; //Can't add a legend as this would password protect the file
		if (cqlStr != ''){
			kmlStr += "&CQL_FILTER=" + cqlStr;
		}
		var kmlPath = Dpath + "wms/kml?layers=" + part1 + kmlStr;

		$.post(kmlPath,function(data){
			//Need an Internet Explorer Fix here
			if (typeof window.XMLSerializer != "undefined") {
				objString = (new window.XMLSerializer()).serializeToString(data);
			} else {
				objString = data.xml;
			}

			document.getElementById('sdalval').value = objString;
			document.getElementById('sdalval2').value = "Data_Download.kml";
			document.getElementById('sdalval3').value = 'application/vnd.google-earth.kml+xml';
			document.getElementById('ddupdate').innerHTML = '<a href="' + kmlPath + '" target="_blank">Link for Manual Download</a>';
			document.getElementById('sirdownloadalotform').submit();

		});
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
var MeasureIsOn = false;
var zoomIsOn = false;
function MeasurementSwitch(type){
	//Check for active zoomBox in simple map, this must be switched off
	if (typeof type=='undefined' && MeasureIsOn == false){
		for(key in controls2) {
			if (key === 'zoomBox'){
				var control = controls2[key];
				control.deactivate();
			}
		}
	} else if (typeof type=='undefined' && MeasureIsOn == true){
		if (zoomIsOn == true){
			for(key in controls2) {
				if (key === 'zoomBox'){
					var control = controls2[key];
					control.activate();
				}
			}
		}
	}
	if (typeof type!='undefined'){
		if(type=='off'){
			//This is off only call
			if(MeasureIsOn !== false){
				east1.expand();
			}
			measureOn('off');
			document.getElementById('MeasureO').checked = true;
			MeasureIsOn = false;
		} else if ('off2') {
			//This is off only call without switching tab
			measureOn('off');
			document.getElementById('MeasureO').checked = true;
			MeasureIsOn = false;
		}
	} else {
		if (MeasureIsOn==false) {
			east5.expand();
			document.getElementById('MeasureL').checked = true;
			measureOn('measureline');
			MeasureIsOn = true;
		} else {
			east1.expand();
			measureOn('off');
			document.getElementById('MeasureO').checked = true;
			MeasureIsOn = false;
		}
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
	//If the user has clicked a layer then we filter the info tools which will fire
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

function layerLinks(event){
	var tmpName, t1, t2, t3;
	if (event.property == 'visibility'){
		tmpName = event.layer.name;
		for (i=0;i<overlayTitle.length;i++){
			if(overlayTitle[i]==tmpName){
				//OK we now have a WMS layer and we should find the corresponding WFS layer and apply the same visibility change
				t1 = "overlay" + i;
				t2 = "wfs" + i;
				t3 = window[t1].visibility;
				if (window[t2].visibility!=t3){
					window[t2].visibility=t3;
				}
			}
		}
	}
}

var readingCompare = new OpenLayers.Bounds(461727, 167680, 482353, 179244);
function setZoomSizes(event) {
	//Change base map if bounding box for Reading is broken
	var newBounds = map.calculateBounds(this.getCenter(), this.getResolution());
	if(readingCompare.containsBounds(newBounds)!==true){
		//alert(map.baseLayer.name);
		if(map.baseLayer.name!=='OpenStreetMap'){
			map.setBaseLayer(bbOSM);
			document.getElementById('copyrightTxt').innerHTML = copywriteTxt2;
		} //Note, if already there, do nothing
	} else {
		if(map.baseLayer.name==='OpenStreetMap'){
			map.setBaseLayer(bmap0); //Default back to the first base map
			document.getElementById('copyrightTxt').innerHTML = copywriteTxt;
		} //Note, if already there, do nothing
	}

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
	var bounds;
	if (projMap != "EPSG:27700"){
		bounds = new OpenLayers.Bounds(
			0, 0 ,800000, 1300000
		).transform(new OpenLayers.Projection("EPSG:27700"),new OpenLayers.Projection(projMap));
	} else {
		bounds = new OpenLayers.Bounds(
			0, 0 ,800000, 1300000
		);
	}
	// Reading only bounds 461952, 167208, 480155, 179442

	//Set up the map

	var options = {
		maxExtent: bounds,
		numZoomLevels: 20,
		resolutions: [2800,1400,700,350,175,84,42,21,11.2,5.6,2.8,1.4,0.7,0.35,0.14,0.07], //This is what GeoServer tilecache uses for its resolution.
		projection: projMap,
		units: 'm',
		//center: new OpenLayers.LonLat(471975, 173030),
		controls: [new OpenLayers.Control.PanZoomBar()],//, new OpenLayers.Control.Navigation()],
		eventListeners: {
			'moveend': setZoomSizes
		}
	};

	if (reproject == 'Yes'){
		options.projection = Proj4js.defs[projMap];
		options.displayProjection = Proj4js.defs[projMapb];
	}

	map = new OpenLayers.Map(options);
	map.events.register("changelayer", map, layerLinks);

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
			} else if (userArray[i]=='RBC'){
				okint = 1; //RBC maps are available to all users
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
			var Dpath2;
			for (i=0;i<(basemaps.length);i++){ //The last basemap is the editmap base
				Dpath2 = Dpath+SpathBASE;
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
			var offonvalue;
			//Define the WMS overlays
			for (i=0;i<overlayArray.length;i++){
				if (onasdefault[i] == "True") {
					offonvalue = true;
				} else {
					offonvalue = false;
				}
				Dpath2 = Dpath+overlayPath[i];
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
						displayInLayerSwitcher: overlayDILS[i],
						//Using tileOptions to cope with long URLs (will automatically post if the URL is too long)
						tileOptions: {maxGetUrlLength: 2048}
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
						displayInLayerSwitcher: overlayDILS[i],
						//Using tileOptions to cope with long URLs (will automatically post if the URL is too long)
						tileOptions: {maxGetUrlLength: 2048}
					});
				}
			}

			//We need to define any zooom to click events on the matching WFS layer

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

			var HoverStyle = {
				strokeColor: "#00008B",
				fillColor: "#4169E1",
				strokeOpacity: 0.85,
				fillOpacity: 0.85,
				pointRadius: 5,
				strokeWidth: 2
			};
			var HoverSty = OpenLayers.Util.applyDefaults(HoverStyle, OpenLayers.Feature.Vector.style["default"]);

			var selStyle = {
				strokeColor: "#006400",
				fillColor: "#32CD32",
				strokeOpacity: 0.85,
				fillOpacity: 0.85,
				pointRadius: 5,
				strokeWidth: 2
			};
			var selSty = OpenLayers.Util.applyDefaults(selStyle, OpenLayers.Feature.Vector.style["default"]);

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

			var hosm = new OpenLayers.StyleMap({
				'default': HoverSty,
				'vertex': vertexStyle,
				'select': select
			});

			var selsm = new OpenLayers.StyleMap({
				'default': selSty,
				'vertex': vertexStyle,
				'select': select
			});

			poiSaveStrategy = new OpenLayers.Strategy.Save({auto: true});
			linSaveStrategy = new OpenLayers.Strategy.Save({auto: true});
			polSaveStrategy = new OpenLayers.Strategy.Save({auto: true});
			sPolSaveStrategy = new OpenLayers.Strategy.Save({auto: true});

			// allow testing of specific renderers via "?renderer=Canvas", etc
            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

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
			var inline_projection = new OpenLayers.Projection(projMap);
			if (projMap == "EPSG:4326"){
				tempType = 'uepointwgs';
			} else {
				tempType = 'uepointosgb';
			}
			pointLayer = new OpenLayers.Layer.Vector("Point Layer", {
				strategies: [new OpenLayers.Strategy.BBOX(), poiSaveStrategy],
				displayInLayerSwitcher: false,
				projection: inline_projection,
				protocol: new OpenLayers.Protocol.WFS({
					version: "1.1.0",
					url: Dpath2,
					srsName : projMap,
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
				projection: inline_projection,
				protocol: new OpenLayers.Protocol.WFS({
					version: "1.1.0",
					url: Dpath2,
					srsName : projMap,
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
				projection: inline_projection,
				protocol: new OpenLayers.Protocol.WFS({
					version: "1.1.0",
					url: Dpath2,
					srsName : projMap,
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
				projection: inline_projection,
				protocol: new OpenLayers.Protocol.WFS({
					version: "1.1.0",
					url: Dpath2,
					srsName : projMap,
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
			var jQuery1 = [];
			var tmpWFSname2 = [];
			var tmpWFSname3 = [];
			var tmpWFSnameCon = '';
			for (i=0;i<overlayArray.length;i++){
				if (onasdefault[i] == "True") {
					offonvalue = true;
				} else {
					offonvalue = false;
				}
				tmpWFSname = "wfs" + i;
				if (wfsGeom[i] == 0 || wfsGeom[i] ==''){
					//There is no geometry field specified
					window[tmpWFSname] = new OpenLayers.Layer.Vector(wfsTitle[i], {
						renderers: renderer,
						strategies: [new OpenLayers.Strategy.BBOX()],
						displayInLayerSwitcher: wfsDILS[i],
						projection: new OpenLayers.Projection(wfsSRS[i]),
						visibility: offonvalue,
						protocol: new OpenLayers.Protocol.WFS({
							version: "1.1.0",
							url: Dpath+wfsPath[i],
							srsName : new OpenLayers.Projection(wfsSRS[i]),
							featureNS :  wfsNS[i],
							featureType: wfsFT[i],
							maxFeatures: 0
							//extractAttributes: true
						}),
						styleMap: sm,
						filter:	null
					});
				} else {
					window[tmpWFSname] = new OpenLayers.Layer.Vector(wfsTitle[i], {
						renderers: renderer,
						strategies: [new OpenLayers.Strategy.BBOX()],
						displayInLayerSwitcher: wfsDILS[i],
						projection: new OpenLayers.Projection(wfsSRS[i]),
						visibility: offonvalue,
						protocol: new OpenLayers.Protocol.WFS({
							version: "1.1.0",
							url: Dpath+wfsPath[i],
							srsName : new OpenLayers.Projection(wfsSRS[i]),
							featureNS :  wfsNS[i],
							featureType: wfsFT[i],
							geometryName: wfsGeom[i],
							maxFeatures: 0
							//extractAttributes: true
						}),
						styleMap: sm,
						filter:	null
					});
				}
				if (fullselectlegendtree==true) {
					jQuery1.push(Dpath+ "rest/layers/"+ wfsFT[i] + ".json");
					tmpWFSname2.push(tmpWFSname);
					tmpWFSname3.push(overlayAddress[i]);
				}
			}

			if (fullselectlegendtree==true) {
				setupSLD(jQuery1, tmpWFSname2, tmpWFSname3,1);
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
					edMO(3,0,'JQ-NONE');
					//Turn off the polygon select handler as required
					toolName = "edit_select";
					window[toolName].deactivate();
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
					edMO(3,0,'JQ-NONE');
					//Turn off the polygon select handler as required
					toolName = "edit_select";
					window[toolName].deactivate();
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
					edMO(3,0,'JQ-NONE');
					//Turn off the polygon select handler as required
					toolName = "edit_select";
					window[toolName].deactivate();
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
					edMO(3,0,'JQ-NONE');
					//Turn off the polygon select handler as required
					toolName = "edit_select";
					window[toolName].deactivate();
				}
			});

			// //////////////////////////////////
			// Map controls definitions
			// //////////////////////////////////

			//nav = new OpenLayers.Control.Navigation();
			//map.addControl(nav);
			var report = function(event) {
                OpenLayers.Console.log(event.type, event.feature.id);
            };

			//This determines the layers we can query
			var wfsLayers = [];
			var wmsLayers = [];
			for (i=0;i<wfsArray.length;i++){
				if (onasdefault[i] == "True"){
					wfsLayers.push(window[wfsArray[i]]);
					wmsLayers.push(window[wfsArray[i].replace("wfs","overlay")]);
				}
			}

			//zoomCon = new OpenLayers.Control.Button({trigger: zoomConSwitch});
			//zoomCon2 = new OpenLayers.Control.ZoomBox({alwaysZoom:true});
			//map.addControl(zoomCon2);
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

			//**
			edit_select = new OpenLayers.Control.SelectFeature([polygonLayer, simplePolygonLayer]);

			//We are adding the tools associated with moving the map, selecting a feature and zoomTo to the 2nd control group
			controls2 = {
				nav: new OpenLayers.Control.Navigation(),
				zoomBox: new OpenLayers.Control.ZoomBox({alwaysZoom:true})
			}

			//Define the selection and hover layers
			filterStrategy = new OpenLayers.Strategy.Filter({filter: new OpenLayers.Filter.Comparison({type:'>', property:'gid', value:0})});
			selection = new OpenLayers.Layer.Vector("Selection", {
				strategies: [filterStrategy],
				displayInLayerSwitcher: false,
				projection: inline_projection,
				styleMap: selsm
			})

			//Set up the layer for hover.
			filterStrategy2 = new OpenLayers.Strategy.Filter({filter: new OpenLayers.Filter.Comparison({type:'>', property:'gid', value:0})});
			hover = new OpenLayers.Layer.Vector("Hover", {
				//strategies: [filterStrategy2],
				displayInLayerSwitcher: false,
				projection: inline_projection,
				styleMap: hosm
			});

			//We have a slight problem, to reduce the load times we are now
			//limiting the WFS features permitted; this prevents selections from working
			//using WFS so use getFeature to pull back the feature prior to selection

			//Setup a select tool for each layer
			for (i=0;i<wfsPath.length;i++){
				tmpON = "sH" + i;
				window[tmpON] = new OpenLayers.Control.GetFeature({
					protocol: new OpenLayers.Protocol.WFS({
						version: "1.1.0",
						url: Dpath+wfsPath[i],
						srsName : new OpenLayers.Projection(wfsSRS[i]),
						featureNS :  wfsNS[i],
						featureType: wfsFT[i],
						maxFeatures: 100
					}),
					hover: true,
					box: false,
					multiple: true,
					clickout: true,
					click: true,
					multipleKey: "shiftKey",
					toggleKey: "ctrlKey"
				});
				window[tmpON].events.register("featureselected", this, function(e) {
					selectHandle(e);
				});
				window[tmpON].events.register("featureunselected", this, function(e) {
					selectHandleOff(e);
				});
				window[tmpON].events.register("hoverfeature", this, function(e) {
					hoverHandle(e);
				});
				
				map.addControl(window[tmpON]);
				window[tmpON].activate();
				window[tmpON].deactivate();
			}

			controls3 = {
				//Highlighter functions
				highlight: new OpenLayers.Control.SelectFeature(
					wfsLayers,
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary"
					}
				),
				highlight1: new OpenLayers.Control.SelectFeature(
					pointLayer,
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary"
					}
				),
				highlight2: new OpenLayers.Control.SelectFeature(
					lineLayer,
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary"
					}
				),
				highlight3: new OpenLayers.Control.SelectFeature(
					polygonLayer,
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary"
					}
				),
				highlight4: new OpenLayers.Control.SelectFeature(
					simplePolygonLayer,
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary"
					}
				)
			};
			
			//Setup a highlight tool for each layer
			
			/*for (i=0;i<wfsPath.length;i++){
				tmpON = "highlightwfs" + i;
				tmpON2 = "wfs" + i;
				window[tmpON] = new OpenLayers.Control.SelectFeature(
					window[tmpON2],
					{
						hover: true,
						highlightOnly: true,
						renderIntent: "temporary"
					}
				);
			}*/

			var layer = new OpenLayers.Layer.Vector("VLayer");
			for (i=0;i<overlayArray.length;i++){
				tmpWFSname = "wfs" + i;
				window[tmpWFSname].events.register("featureselected", layer, transferit);
			}

			var key;
            for(key in controls) {
                map.addControl(controls[key]);
            }
			//The events below deal with polygon edits but do they have an impact on selection tools?
			polygonLayer.events.on({
				'featureselected': selectEditHandle
			});
			simplePolygonLayer.events.on({
				'featureselected': selectEditHandle
			});
			map.addControl(edit_select);

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

			//Other controls

			//Mouse Position
			if (projMapb!=""){
				mousePos = new OpenLayers.Control.MousePosition({
					autoActivate: true,
					prefix: "Current Position (" + projMapb + "): ",
					separator: ", ",
					numDigits: 5,
					displayProjection: new OpenLayers.Projection(projMapb)
				});
			} else {
				mousePos = new OpenLayers.Control.MousePosition({
					autoActivate: true,
					prefix: "Current Position (" + projMap + "): ",
					separator: ", ",
					numDigits: 5
				});
			}
			map.addControl(mousePos);

			//Linear Measurement Tool
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

			//Area measurement tool
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

			//Basic navigation tool
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
			var bmapstr;
			for (i=0;i<(basemaps.length-1);i++){ //The last basemap is the editmap base
				bmapstr = 'bmap' + i;
				window[bmapstr] = window[basemaps[i]];
				map.addLayer(window[bmapstr]);
			}

			OpenLayers.DOTS_PER_INCH = 90.7142367; //This is what GeoServer tilecache uses for its DPI.

			bbOSM = new OpenLayers.Layer.TMS(
				"OpenStreetMap",
				"http://www.osmgb.org.uk/ogc/tms27700/",
				{layername: "OSM-GB:__all__", transitionEffect: "resize", type: "png"}
			);
			bbOSM.displayInLayerSwitcher = false;

			map.addLayer(bbOSM);
			map.setCenter([471975, 173030], 8);

			//Add the overlays, wfs and info controls
			doPopup = [];
			doHover = [];
			doZoom = [];
			doSelect = [];
			doAny = [];
			doAny2 = [];
			doAnyS= '';
			for (i=0;i<overlayArray.length;i++){
				map.addLayer(window[overlayArray[i]]);
				tmpWFSname = "wfs" + i;
				map.addLayer(window[tmpWFSname]);

				//OK so we can not load all the WFS elements because of the download times. This means that a zoom to
				//record request needs to be handled using WMS getFeatureInfo
				//if (overlayPopup[i]=='True') {
					// ////////////////////////////////
					// GetFeatureInfo Control
					// ////////////////////////////////
					//var info;
					Dpath2 = Dpath+overlayPath[i];
					var varname = "info" + i;
					var varname2 = "locationShift" + i;
					window[varname2] = 0;
					var itNo = i;
					var fixEmpty;
					var tmpWdth;
					if (overlayPopup[i]=='True' || overlayPopup[i]=='TRUE' || overlayPopup=='Yes' || overlayPopup=='YES'){
						doPopup.push(true);
						doAnyS = 'Y';
					} else {
						doPopup.push(false);
					}
					if (overlayHover[i]!=''){
						doHover.push(true);
						doAny2.push('Y');
					} else {
						doHover.push(false);
						doAny2.push('N');
					}
					if (overlayZoom[i]=='True' || overlayZoom[i]=='TRUE' || overlayZoom=='Yes' || overlayZoom=='YES'){
						doZoom.push(true);
						doAnyS = 'Y';
					} else {
						doZoom.push(false);
					}
					if (overlayZoomSelF[i] != ''){
						doSelect.push(true);
						doAnyS = 'Y';
					} else {
						doSelect.push(false);
					}
					if (doAnyS == 'Y'){
						doAny.push("Y");
					} else {
						doAny.push("N");
					}

					//Set up the Hover text event
					hoverpopup = new OpenLayers.Popup("chicken",
								null,
								new OpenLayers.Size(200,25),
								'',
								false
							);
					map.addPopup(hoverpopup);
					hoverpopup.setBackgroundColor('#BBD1E8');
					hoverpopup.setOpacity(0.6);
					hoverpopup.toggle();
					var varname = "hover" + i;
					window[varname] = new OpenLayers.Control.WMSGetFeatureInfo({
						url: Dpath2,
						title: 'Identify features by clicking',
						displayClass: 'olControlGetFeatureInfo',
						type: OpenLayers.Control.TYPE_TOGGLE,
						queryVisible: true,
						vendorParams: { 'CQL_FILTER':null },
						hover: true,
						layers: [window[overlayArray[i]]],
						format: new OpenLayers.Format.GML(),   // Used to parse the feature info response
						infoFormat: 'application/vnd.ogc.gml', // Used to require the GML format to the WMS server
						eventListeners: {
							getfeatureinfo: function(event) {
								var tmpX, tmpY, tmpRef, tmpH, tmpHW, tmpHH, tmpLay;

								//Now for the control
								if (typeof event.features[0] != 'undefined'){
									var currentLayerV = event.features[0].fid;
									currentLayerV = currentLayerV.substr(0,currentLayerV.indexOf("."));
									var diamOpts = 0;
									//The wfs feature type field contains the layername so lets work out which layer we are displaying
									for (i=0;i<wfsFT.length;i++){
										if (wfsFT[i]==currentLayerV){
											diamOpts = i;
										}
									}
									//Should we pass data to the photo scroller?
									if (photoscroll==true && photoactive == true){
										var features = event.features;
										//The field defining the photo path is stored in photoscrollpath
										var fi;
										//We need a framework to deal with multiple records per click
										for (fi=0;fi<features.length; fi++){
											if (features.length==1) {
												//Get the feature data and fieldnames array for this record
												fieldvalues = [];
												fieldnames = [];
												for(fieldvalue in features[fi].data){
													if (features[fi].data.hasOwnProperty(fieldvalue)){
														fieldnames.push(fieldvalue);
														if (features[fi].data[fieldvalue]!=null){
															fieldvalues.push(features[fi].data[fieldvalue].replace(/%2C/g,','));
														} else {
															fieldvalues.push('');
														}
													}
												}

												for(i=0;i<fieldnames.length;i++){
													if (fieldnames[i]==photoscrollpath){
														photoscrollsetter('', fieldvalues[i]);
													}
												}
											} else {
												//For now the photoscroller will just show the first match
												//Get the feature data and fieldnames array for this record
												if (fi==0){
													fieldvalues = [];
													fieldnames = [];
													for(fieldvalue in features[fi].data){
														if (features[fi].data.hasOwnProperty(fieldvalue)){
															fieldnames.push(fieldvalue);
															if (features[fi].data[fieldvalue]!=null){
																fieldvalues.push(features[fi].data[fieldvalue].replace(/%2C/g,','));
															} else {
																fieldvalues.push('');
															}
														}
													}

													for(i=0;i<fieldnames.length;i++){
														if (fieldnames[i]==photoscrollpath){
															photoscrollsetter('', fieldvalues[i]);
														}
													}
												}
											}
										}
									}
									//The layer number is now stored in diamOpts
									if (doHover[diamOpts]==true){
										var features = event.features;
										if (features.length != 0 ) { //Prevent hover where there is no result
											// ///////////////////////////////////////////////////////////
											// We can use the parsed response formatting a proper HTML
											// ///////////////////////////////////////////////////////////
											//This is now handled by an external function
											htmlText = hoverHTML(event.features);  //Need to work this out how do you add the overlayPopup[] value here!!!

											// ///////////////////////////////////////////////////////////
											// Now using an OpenLayers popup for the hover windows as this is easier to resize
											// ///////////////////////////////////////////////////////////
											var pixelpos = event.xy;
											//Shifting the box slightly to allow click
											pixelpos.x = pixelpos.x + 5;
											pixelpos.y = pixelpos.y + 5;
											pixelpos = map.getLonLatFromPixel(pixelpos);
											hoverpopup.setContentHTML(htmlText);
											hoverpopup.updateSize();
											hoverpopup.lonlat = pixelpos;
											hoverpopup.updatePosition();
											hoverpopup.show();
										}
									}
								} else {
									//Close old hover
									hoverpopup.hide();
								}
							}
						}
					});
					map.addControl(window[varname]);
					if (doAny2[i]=="Y" || photoscroll == true) {
						window[varname].activate();
						document.getElementById('photoscroller').style.visibility = 'hidden';
					}

					var varname = "info" + i;
					//Set up the WMSGetFeatureInfo Click events
					window[varname] = new OpenLayers.Control.WMSGetFeatureInfo({
						url: Dpath2,
						title: 'Identify features by clicking',
						displayClass: 'olControlGetFeatureInfo',
						type: OpenLayers.Control.TYPE_TOGGLE,
						queryVisible: true,
						layers: [window[overlayArray[i]]],
						vendorParams: { 'CQL_FILTER':null },
						format: new OpenLayers.Format.GML(),   // Used to parse the feature info response
						infoFormat: 'application/vnd.ogc.gml', // Used to require the GML format to the WMS server
						eventListeners: {
							getfeatureinfo: function(event) {
								var tmpX, tmpY, tmpRef, tmpZL, tmpSF, tmpSV, tmpST, tmpLay;

								//Now for the control
								if (typeof event.features[0] != 'undefined'){
									var currentLayerV = event.features[0].fid;
									currentLayerV = currentLayerV.substr(0,currentLayerV.indexOf("."));
									var diamOpts = 0;
									//The wfs feature type field contains the layername so lets work out which layer we are displaying
									for (i=0;i<wfsFT.length;i++){
										if (wfsFT[i]==currentLayerV){
											diamOpts = i;
										}
									}
									//The layer number is now stored in diamOpts
									tmpZL = parseInt(overlayZoomLevel[diamOpts]);
									tmpSF = overlayZoomSelF[diamOpts];
									tmpRT = overlayZoomRepT[diamOpts];
									tmpRF = overlayZoomRepF[diamOpts];

									if (doZoom[diamOpts] == true && doSelect[diamOpts] == false){
										tmpX = map.getLonLatFromPixel(event.xy).lon;
										tmpY = map.getLonLatFromPixel(event.xy).lat;

										map.setCenter(new OpenLayers.LonLat(tmpX, tmpY), tmpZL);
									}

									if (doZoom[diamOpts] == true && doSelect[diamOpts] == true) {
										var features = event.features;
										if (features.length != 0 ) {
											//OK how many features do with have?
											if (features.length == 1){
												//One feature is what we are looking for
												var fieldvalues = [];
												var fieldnames = [];
												for(fieldvalue in features[0].data){
													if (features[0].data.hasOwnProperty(fieldvalue)){
														fieldnames.push(fieldvalue);
														if (features[0].data[fieldvalue]!=null){
															fieldvalues.push(features[0].data[fieldvalue].replace(/%2C/g,','));
														} else {
															fieldvalues.push('');
														}
													}
												}
												for (i2=0;i2<fieldnames.length;i2++){
													if (fieldnames[i2]==tmpSF){
														//This is the search field so we pickup the search value
														tmpSV = fieldvalues[i2];
													}
												}
												//Now we need to search the target layer using the search term
												var diamOpts2 = 0;
												var tmpPath;
												//Because we are adding a temporary layer we must first check for an existing one
												for (i2=0;i2<wfsFT.length;i2++){
													if (tmpRT==wfsFT[i2]){
														tmpLay = overlayTitle[i2] + " (Selected)";
														tmpPath = Dpath+overlayPath[i2];
														if (typeof tempOverlay == 'undefined'){
															tempOverlay = new OpenLayers.Layer.WMS(tmpLay, tmpPath, {
																LAYERS: overlayAddress[i2],
																srs: overlaySRS[i2],
																STYLES: '',
																format: 'image/png',
																transparent: true,
																tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
															}, {
																displayOutsideMaxExtent: true,
																visibility: true,
																isBaseLayer: false,
																// exclude this layer from layer container nodes
																displayInLayerSwitcher: true,
																//Using tileOptions to cope with long URLs (will automatically post if the URL is too long)
																tileOptions: {maxGetUrlLength: 2048}
															});
														} else {
															map.removeLayer(tempOverlay);
															tempOverlay = null;
															tempOverlay = new OpenLayers.Layer.WMS(tmpLay, tmpPath, {
																LAYERS: overlayAddress[i2],
																srs: overlaySRS[i2],
																STYLES: '',
																format: 'image/png',
																transparent: true,
																tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
															}, {
																displayOutsideMaxExtent: true,
																visibility: true,
																isBaseLayer: false,
																// exclude this layer from layer container nodes
																displayInLayerSwitcher: true,
																//Using tileOptions to cope with long URLs (will automatically post if the URL is too long)
																tileOptions: {maxGetUrlLength: 2048}
															});
														}
														diamOpts2 = i2;
													}
												}
												var tmpFilterObj = new OpenLayers.Filter.Comparison({
													property: tmpRF,
													type: '==',
													value: tmpSV
												});
												try {
													var filterStr = xml.write(filter_1_1.write(tmpFilterObj));
												} catch (err) {
													alert(err.message);
												}

												//OK we now have a duplicate layer of the search layer with only the required values
												//Next we set an alternative style, add it to the map

												var jQueryURL = Dpath+ "rest/layers/"+ wfsFT[diamOpts2] + ".json";
												var data1 = OpenLayers.Request.GET({
													url: jQueryURL,
													async: false
												});
												data1 = $.parseJSON(data1.responseText);
												var sldName = data1.layer.defaultStyle.name;
												sldName = sldName + "S";

												//Now we load the 'S' version of that style
												map.addLayer(tempOverlay);
												tempOverlay.mergeNewParams({
													styles: sldName,
													filter: filterStr
												});
												tempOverlay.redraw();
											} else {
												//Multiple features, we need to give the user the choice or select all

											}
										}
									}

									if (doPopup[diamOpts] == true  && popupDefault == true){
										currentLayerV = "popup" + diamOpts;
										if (!window[currentLayerV]){
											//No popup here
											fixEmpty = 0;
											window[varname2] = 0;
										} else {
											window[currentLayerV].close(); //Closes open popups
											window[varname2] = 0;
										}

										var features = event.features;
										if (features.length != 0 ) { //Prevent popups where there is no result
											// ///////////////////////////////////////////////////////////
											// We can use the parsed response formatting a proper HTML
											// ///////////////////////////////////////////////////////////
											//This is now handled by an external function
											htmlText = popupHTML(event.features);  //Need to work this out how do you add the overlayPopup[] value here!!!
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
											tmpWdth = popwidth[diamOpts];
											if (tmpWdth.indexOf("px")!=-1){
												tmpWdth = tmpWdth.substr(0,tmpWdth.indexOf("px"));
											}
											tmpWdth = parseInt(tmpWdth) +35;
											window[currentLayerV] = new GeoExt.Popup({
												title: '',
												autoScroll: true,
												location: pixel,
												anchorPosition: 'bottom-left',
												panIn: popupPan,
												map: map,
												width: tmpWdth,
												defaults: {
													layout: 'fit',
													autoScroll: true,
													autoHeight: true,
													autoWidth: false,
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
											window[currentLayerV].hide();
											window[currentLayerV].add(config);
											window[currentLayerV].show();
										}
									}
								}
							}
						}
					});
					map.addControl(window[varname]);
					if (doAny[i]=="Y") {
						window[varname].activate();
					}
			}
			//Add the editing layers
			map.addLayer(pointLayer);
			map.addLayer(lineLayer);
			map.addLayer(polygonLayer);
			map.addLayer(simplePolygonLayer);
			map.addLayer(hover);
			map.addLayer(selection);
			//Add the geolocator
			if (geolocationlayer.features.length != 0) {
				map.addLayer(geolocationlayer);
			}

			//Define the mapPanel
			tbarVar = new Ext.Toolbar({
				enableOverflow: true,
				items: [toolbarItems]});
			mapPanel = new GeoExt.MapPanel({
				region: 'center',
				layout: 'fit',
				height:(winH-68),
				width: (winW-210), //Width minus the east or west panel width
				map: map,
				stateId: "map",
				tbar: tbarVar,
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

			//Is there a photo scroller?
			pshtml = "<table id=\"carousel\" class=\"carousel\" style=\"background-color: #FFFFFF; width:"+(winW-302)+"px; height:"+((winH-118)*0.2)+"px; overflow: hidden\" ><tr><td colspan='10' style='background-color: #D9E7F8; text-align:left; height:18px' id='pcarST'></td></tr><tr><td id=\"bb\" style=\"text-align:left;\" onclick=\"photoscrollsetter('bb')\" ><img src=\"../../apps/img/bb-grey.png\" id=\"pcar0BB\" /></td><td class=\"carouselcell\"><img src=\"../../apps/img/blncimg.png\" onclick=\"photoscrollsetter('click', 1)\" id=\"pcar1\" /></td><td class=\"carouselcell\"><img src=\"../../apps/img/blncimg.png\" onclick=\"photoscrollsetter('click', 2)\" id=\"pcar2\" /></td><td class=\"carouselcell\"><img src=\"../../apps/img/blncimg.png\" onclick=\"photoscrollsetter('click', 3)\" id=\"pcar3\" /></td><td class=\"carouselcell\"><img src=\"../../apps/img/blncimg.png\" onclick=\"photoscrollsetter('click', 4)\" id=\"pcar4\" /></td><td class=\"carouselcell\"><img src=\"../../apps/img/blncimg.png\" onclick=\"photoscrollsetter('click', 5)\" id=\"pcar5\" /></td><td class=\"carouselcell\"><img src=\"../../apps/img/blncimg.png\" onclick=\"photoscrollsetter('click', 6)\" id=\"pcar6\" /></td><td class=\"carouselcell\"><img src=\"../../apps/img/blncimg.png\" onclick=\"photoscrollsetter('click', 7)\" id=\"pcar7\" /></td><td class=\"carouselcell\"><img src=\"../../apps/img/blncimg.png\" onclick=\"photoscrollsetter('click', 8)\" id=\"pcar8\" /></td><td id=\"fb\" style=\"text-align:right;\"><img src=\"../../apps/img/fb-grey.png\" id=\"pcar0FB\" onclick=\"photoscrollsetter('fb')\" /></td></tr></table>";
			if (photoscroll==true) {
				document.getElementById('photoscroller').style.position = 'absolute';
				document.getElementById('photoscroller').style.bottom = '55px';
				document.getElementById('photoscroller').style.left = '40px';
				document.getElementById('photoscroller').style.width = (winW-300)+'px';
				document.getElementById('photoscroller').style.height = ((winH-118)*0.2)+2+'px';
				document.getElementById('photoscroller').style.zIndex = 1100;
				document.getElementById('photoscroller').style.border = "thin solid #A9A9A9";
				document.getElementById('photoscroller').innerHTML = pshtml;
			}

			//Legend
			// give the record of the 1st layer a legendURL, which will cause
			// UrlLegend instead of WMSLegend to be used
			var layerRec0 = mapPanel.layers.getAt(0);

			// store the layer that we will modify in toggleVis()
			var layerRec1 = mapPanel.layers.getAt(1);
			if (fullselectlegendtree==true) {
				//Fully selectable Legend Tree
				tree = new Ext.tree.TreePanel({
					animate:true,
					width: 150,
					region: 'west',
					enableDD: false,
					autoScroll: true,
					useArrows: true,
					containerScroll: true,
					listeners: {
						//click: treehandle,
						checkchange: function(node){
							legendHandler(node);
						}
					},
					lines: false
				});

				/*rootNode = new Ext.tree.AsyncTreeNode({
					text: 'Layers',
					draggable:false,
					expanded: true,
					expandable: true,
					id: '_treeRoot',
					rootVisible: true
				});*/
				setupSLD('', '', overlayAddress, 2);
				if (jsonStringReady==1){
					//rootNode.children = jsonString;
					jsonStringReady=2; //Flag as done
				}
				//rootNode.expandChildNodes();
				//tree.setRootNode(rootNode);

				east1 = new Ext.Panel({
					title: "Layers",
					layout: 'fit',
					html: legendHTML
					//items: [tree]
				});
				east1.setAutoScroll('auto');

			} else if (legendtree == false) {
				//Create a Legend
				legendPanel = new GeoExt.LegendPanel({
					useScaleParameter : false,
					defaults: {
						labelCls: 'mylabel',
						style: 'padding:5px',
						baseParams: {
							LEGEND_OPTIONS: 'forceLabels:on;fontSize:12;',
							WIDTH: 20, HEIGHT: 20 //, SCALE: 0.5 not able to use scale in this case
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
				east1 = new Ext.Panel({
					title: 'Legend',
					layout: 'fit',
					items: [legendPanel]
				});
				east1.setAutoScroll('auto');
				east1b = new Ext.Panel({
					title: "Layers",
					layout: 'fit',
					items: [tree]
				});
				east1b.setAutoScroll('auto');
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
				east1 = new Ext.Panel({
					title: "Layers",
					layout: 'fit',
					items: [tree]
				});
				east1.setAutoScroll('auto');
			}

			//This defines the filter section
			var oTitle = [];
			var oName = [];
			var fmhtml = "<h2>Filter Map</h2>";
			fmhtml += "<p>Please use this tool to filter the map</p>";
			fmhtml += "<b>Please Select a Layer to Filter:</b><br />";
			fmhtml += "<select id='fm1' name='fm1' style='width: 210px' onchange='filterSetup(this.value);'><option selected='selected' value='1'>Please Select a Layer</option>";
			var layerNam, oL;
			for (i=0;i<mapPanel.layers.data.length;i++){
				if(typeof mapPanel.layers.getAt(i).data.layer.params!='undefined'){
					//If this exists we are most probably looking at a WMS - Carry on
					if(mapPanel.layers.getAt(i).data.layer.options.isBaseLayer == false) {
						//This is not a raster / base map - Carry on
						layerNam = mapPanel.layers.getAt(i).data.layer.params.LAYERS;
						for (oL=0;oL<overlayArray.length;oL++){
							if(overlayAddress[oL]==layerNam){
								oTitle.push(overlayTitle[oL]);
								oName.push(layerNam);
							}
						}
					}
				}
			}
			i = oTitle.length-1;
			while (i>=0){
				fmhtml += "<option value='" + oName[i] + "'>" + oTitle[i] + "</option>";
				i = i - 1;
			}
			//OK now lets add the table options
			if (tableArray.length!=0){
				fmhtml += "<option value='table' disabled='disabled'>Filter Whole Tables</option>";
				i2=0;
				skip = 0;
				for (i=0;i<tableArray.length;i++){
					if (typeof tableTitles[i2]!='undefined'){
						if (skip == 0){
							fmhtml += "<option value='~T~" + tableArray[i] + "'>" + tableTitles[i2] + "</option>";
						}
						if (tableArray[i].indexOf("_view") != -1){
							//This is a view so the next entry in the tableArray should be the associated table that we must skip here add zero
							skip = 1;
						} else {
							//Not a view so only one entry in the tableArray add one
							i2 = i2 + 1;
							skip = 0;
						}
					}
				}
			}
			fmhtml += "</select><br />";
			fmhtml += "<div id='filterDiv'></div>";

			east2 = new Ext.Panel({
				title: 'Filter Map',
				layout: 'fit',
				html: fmhtml
			});
			east2.setAutoScroll('auto');

			//This defines the predefined filter section
			var pdmhtml = "<h2>Set Maps</h2>";
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

			east3 = new Ext.Panel({
				title: "Predefined Filters",
				layout: 'fit',
				html: pdmhtml
			});
			east3.setAutoScroll('auto');

			var ddhtml = "<h2>Data Downloads</h2><p>Please use the following dropdown box to select a layer from the current map to download.</p>";
			ddhtml += "<table><tr height=30><td><select id='ddp1' name='ddp1'><option selected='selected' value='1'>Please Select a Layer</option>";
			for (i=0;i<overlayAddress.length;i++){
				if (overlayDDtitle[i]!=''){
					var workS = overlayAddress[i].substr(0, overlayAddress[i].indexOf(":"));
					ddhtml += "<option value='[" + i + "]" + overlayAddress[i] + "'>" + overlayDDtitle[i] + "</option>";
				}
			}
			ddhtml += "</select></td></tr><tr height=30><td><select id='ddp2' name='ddp2'><option selected='selected' value='1'>Format</option>";
			if (ddFull == true) {
				ddhtml += "<option value='&outputFormat=CSV'>CSV</option>";
				ddhtml += "<option value='&outputFormat=shape-zip'>Shapefile</option>";
				ddhtml += "<option value='&outputFormat=KML'>Google KML</option>";
			} else {
				ddhtml += "<option value='&outputFormat=KML'>Google KML</option>";
			}
			ddhtml += "</select></td></tr></table><br />";
			ddhtml += "<input type='button' value='Generate File' onclick='dd()' />";
			ddhtml += "<br /><span id='ddupdate'></span>";
			east4 = new Ext.Panel({
				title: "Data Downloads",
				layout: 'fit',
				html: ddhtml
			});
			east4.setAutoScroll('auto');
			var mthtml = "<h2>Measure Tools</h2>";
			mthtml += "<form id='mto'>Measure length <input type=\"radio\" name=\"Measure\" id=\"MeasureL\" onclick=\"measureOn('measureline')\"><br />";
			mthtml += "Measure area <input type=\"radio\" name=\"Measure\" id=\"MeasureA\" onclick=\"measureOn('measurepolygon')\"><input type=\"radio\" style=\"display:none\" name=\"Measure\" id=\"MeasureO\">";
			mthtml += "</form><br /><div id=\"output\"></div>";
			east5 = new Ext.Panel({
				title: "Measurement Results",
				layout: 'fit',
				html: mthtml
			});

			var eohtml = "";
			eohtml += "<h3>Edit Mode</h3>";
			eohtml += "<img src=\"../../apps/img/edit/point-d3.png\" onmouseover=\"rollover(this, 'type')\" onmouseout=\"rollover(this, 'type')\" onclick=\"edMO(2,1,this)\" />";
			eohtml += "<img src=\"../../apps/img/edit/line-d1.png\" onmouseover=\"rollover(this, 'type')\" onmouseout=\"rollover(this, 'type')\" onclick=\"edMO(2,2,this)\" />";
			eohtml += "<img src=\"../../apps/img/edit/shape-d1.png\" onmouseover=\"rollover(this, 'type')\" onmouseout=\"rollover(this, 'type')\" onclick=\"edMO(2,4,this)\" /><br /><span id=\"polyshape\"></span><br />";
			eohtml += "<h3>Table Selection</h3>";
			eohtml += "<select id='eo1' name='eo1' onchange='changeActTable(this.value)'>";
			for (i=0;i<tableArray.length;i++){
                if (tableGeomEdit[i] == 'Yes' || tableGeomEdit[i] == 'YES' || tableGeomEdit[i] == 'True' || tableGeomEdit[i] == 'TRUE' ) {
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
			eohtml += "<h3>Drawing Tools<img src=\"../../apps/img/edit/sticky-c1.png\" onmouseover=\"rollover(this, 'sticky')\" onmouseout=\"rollover(this, 'sticky')\" onclick=\"thissticks(this)\" /></h3>";
			eohtml += "<img src=\"../../apps/img/edit/none-a3.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(3,0,this)\" /><br />";
			eohtml += "<img src=\"../../apps/img/edit/add-a1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(3,1,this)\" /><br />";
			eohtml += "<img src=\"../../apps/img/edit/existing-a1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(3,2,this)\" /><br />";
			eohtml += "";
			eohtml += "<div id=\"shapeoptions\" style=\"display:none;visibility:hidden;\">";
			eohtml += "<b>Create Geometric Shape</b><br />";
			eohtml += "<div id=\"shapesides\" style=\"display:none;visibility:hidden;\">Number of Sides: <input name=\"sides\" id=\"sideNoInput\" value=\"\" size=\"5\" /><br />";
			eohtml += "Irregular Shape? <input type=\"checkbox\" name=\"ireg\" onchange=\"edMO(2,9);\" /><br />";
			eohtml += "<img src=\"../../apps/img/edit/update_geom-a1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(2,10)\" /></div><br />";
			eohtml += "</div>";
			eohtml += "<h3>Editing Tools</h3>";
			eohtml += "<img src=\"../../apps/img/edit/move-b1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(3,4,this)\" /><br />";
			eohtml += "<img src=\"../../apps/img/edit/edit-b1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(3,5,this)\" /><br />";
			eohtml += "<img src=\"../../apps/img/edit/rotate-b1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(3,6,this)\" /><br />";
			eohtml += "<img src=\"../../apps/img/edit/resize-b1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(3,7,this)\" /><br />";
			eohtml += "<img src=\"../../apps/img/edit/delete-b1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"edMO(3,8,this)\" /><br /><br />";
			eohtml += "";
			eohtml += "<img src=\"../../apps/img/edit/save-b1.png\" onmouseover=\"rollover(this, 'roll')\" onmouseout=\"rollover(this, 'roll')\" onclick=\"saveEdits()\" />";
			//eohtml += "</div></div></div>";

			east6 = new Ext.Panel({
				title: "Editing Options",
				layout: 'fit',
				html: eohtml,
				bodyCfg : { cls:'x-panel-body no-x-scroll'}
			});
			east6.setAutoScroll('auto');

			/*EXT layout using accordion layout */
			if (loadEdits == 'True' || loadEdits == 'TRUE' || loadEdits == 'Yes' || loadEdits == 'YES') {
				if (legendtree == false && fullselectlegendtree==false) {
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
				if (legendtree == false && fullselectlegendtree==false) {
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
			tableWidth = winW-210;
			if (table != ""){
				tableport = new Ext.Panel({
					layout: 'fit',
					height:(winH-88),
					width: tableWidth, //Width minus the east or west panel width
					region: 'center',
					split: true,
					collapsible: true,
					collapsed: true, //set this to true if the table is secondary
					title: 'Attributes Table',
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

				centrePanel = new Ext.Panel({
					region:'center',
					margins:'0 0 0 0',
					split:true,
					width: (winW-210), //Width minus the east or west panel width
					layout:'accordion',
					items: [mapPanel, tableport]
				});

				if (photoscroll==true) {
					photoscrollsetter('setup');
				}
				if (loadAttributes == "True" || loadAttributes == 'TRUE' || loadAttributes == 'Yes' || loadAttributes == 'YES') {
					viewport = new Ext.Panel({ //Viewport would fill the full screen so I'm using a panel
						renderTo: 'h_first',
						height: winH-68,  //Trouble is that we need to specify a height.
						layout:'border',
						items:[accordion, centrePanel]
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
			tableWidth = winW-230; //This removes some extra to account for table padding.
		}
	}
	dir = "";
	colNo = "";
	colNo = "";
	//treelegendSetter(tree);
	if (table != ""){
		updateTable(tableHTML);
	}
	navSwitch();

	//Set up the info switch
	infoSwitch = [];
	for (i=0;i<wfsArray.length;i++){
		if (window["info" + i].active==true){
			infoSwitch.push("info" + i);
		}
	}

	//We apply the default filter as standard
	pdmF(0);
}

var psStart = 0;
function photoscrollsetter(firetype, imageURL){
	//This function sets up the photoscroller and resizes the image files
	//It also handles when an image is clicked

	//Is this a first setup or a map click?
	if (firetype=='setup'){
		//This is the first setup so we simple resize the stock images
		var cellW1, cellW2, tabW1, tabW2, cellH;
		cellH = 95;
		cellW1 = ($('table.carousel td').eq(1).outerWidth() / 3);
		cellW2 = $('table.carousel td').eq(2).outerWidth();
		tabW1 = document.getElementById('carousel').style.width;
		tabW1 = tabW1.substr(0,tabW1.indexOf("px"));
		tabW2 = (2*cellW1) + (8*cellW2);
		//This loop prevents the table width being exceeded by the images
		while (tabW2 > tabW1) {
			cellW1 = cellW1;
			cellW2 = cellW2 - 1;
			tabW2 = (2*cellW1) + (8*cellW2);
		}

		//Apply the calculated widths to the images
		document.getElementById('pcar0BB').width = cellW1;
		document.getElementById('pcar0BB').height = cellH;
		document.getElementById('pcar0FB').width = cellW1;
		document.getElementById('pcar0FB').height = cellH;
		document.getElementById('pcar1').width = cellW2;
		document.getElementById('pcar1').height = cellH;
		document.getElementById('pcar2').width = cellW2;
		document.getElementById('pcar2').height = cellH;
		document.getElementById('pcar3').width = cellW2;
		document.getElementById('pcar3').height = cellH;
		document.getElementById('pcar4').width = cellW2;
		document.getElementById('pcar4').height = cellH;
		document.getElementById('pcar5').width = cellW2;
		document.getElementById('pcar5').height = cellH;
		document.getElementById('pcar6').width = cellW2;
		document.getElementById('pcar6').height = cellH;
		document.getElementById('pcar7').width = cellW2;
		document.getElementById('pcar7').height = cellH;
		document.getElementById('pcar8').width = cellW2;
		document.getElementById('pcar8').height = cellH;
	} else if (firetype=='click'){
		//This means the user has selected an image and we are going to open the image full size in a new window
		var psNum = imageURL;
		var psText;
		psText = "pcar" + psNum;
		psText = document.getElementById(psText).src;
		window.open(psText,'Image');
	} else if (firetype=='fb'){
		//Moving the scroller to the right
		if (psStart==1){
			var psNum = 1;
			var psText;
			pslow = pslow + 1;
			pshigh = pshigh + 1;
			for(i=0;i<photoArray.length;i++){
				if(i>=pslow && i<= pshigh){
					psText = "pcar" + psNum;
					document.getElementById(psText).src = photoArray[i];
					psNum = psNum + 1;
				}
				if((photoArray.length-1)>pshigh){
					document.getElementById('pcar0FB').src = '../../apps/img/fb.png';
				} else {
					document.getElementById('pcar0FB').src = '../../apps/img/fb-grey.png';
				}
				if(pslow>0){
					document.getElementById('pcar0BB').src = '../../apps/img/bb.png';
				} else {
					document.getElementById('pcar0BB').src = '../../apps/img/bb-grey.png';
				}
			}
		}
	} else if (firetype=='bb'){
		//Moving the scroller to the left
		if (psStart==1){
			var psNum = 1;
			var psText;
			pslow = pslow - 1;
			pshigh = pshigh - 1;
			for(i=0;i<photoArray.length;i++){
				if(i>=pslow && i<= pshigh){
					psText = "pcar" + psNum;
					document.getElementById(psText).src = photoArray[i];
					psNum = psNum + 1;
				}
				if((photoArray.length-1)>pshigh){
					document.getElementById('pcar0FB').src = '../../apps/img/fb.png';
				} else {
					document.getElementById('pcar0FB').src = '../../apps/img/fb-grey.png';
				}
				if(pslow>0){
					document.getElementById('pcar0BB').src = '../../apps/img/bb.png';
				} else {
					document.getElementById('pcar0BB').src = '../../apps/img/bb-grey.png';
				}
			}
		}
	} else {
		//This is a map click, we need to load the images in in the scroller
		if(imageURL.substring(0,1)=="#"){
			//There are no images so we should blank out the scroller
			document.getElementById('pcar0BB').src = '../../apps/img/bb-grey.png';

			document.getElementById('pcar1').src = "../../apps/img/blncimg.png";
			document.getElementById('pcar2').src = "../../apps/img/blncimg.png";
			document.getElementById('pcar3').src = "../../apps/img/blncimg.png";
			document.getElementById('pcar4').src = "../../apps/img/blncimg.png";
			document.getElementById('pcar5').src = "../../apps/img/blncimg.png";
			document.getElementById('pcar6').src = "../../apps/img/blncimg.png";
			document.getElementById('pcar7').src = "../../apps/img/blncimg.png";
			document.getElementById('pcar8').src = "../../apps/img/blncimg.png";

			document.getElementById('pcar0FB').src = '../../apps/img/fb-grey.png';
			//Set the title
			document.getElementById('pcarST').innerHTML = "No images available for " + imageURL;
		} else {
			//We use the hash to indicate that there is no link on a point so the link will not be equal to hash if this script is to run
			$.get("../../apps/functions/photocarousel.php", {imageURLStr: imageURL}, function(data){
				photoArray = data.split('|');
				var psNum = 1;
				var psText;
				pslow = 0;
				pshigh = 7;
				for(i=0;i<photoArray.length;i++){
					if(i>=pslow && i<= pshigh){
						psText = "pcar" + psNum;
						document.getElementById(psText).src = photoArray[i];
						psNum = psNum + 1;
						psStart = 1;
					}
					if((photoArray.length-1)>pshigh){
						document.getElementById('pcar0FB').src = '../../apps/img/fb.png';
					} else {
						document.getElementById('pcar0FB').src = '../../apps/img/fb-grey.png';
					}
					if(pslow>0){
						document.getElementById('pcar0BB').src = '../../apps/img/bb.png';
					} else {
						document.getElementById('pcar0BB').src = '../../apps/img/bb-grey.png';
					}
				}
				//Set the title
				document.getElementById('pcarST').innerHTML = photoArray[0].substr(1,photoArray[0].lastIndexOf('/')-1);
			});
		}
	}
}

function treelegendSetter(tree){
	if (fullselectlegendtree==true) {
		//Define the WMS overlays
		for (i=0;i<overlayArray.length;i++){
			if (onasdefault[i] == "True") {
				var tmpLayerName = "wfs" + i;
				for(i2=0;i2<rootNode.attributes.children.length;i2++){
					if (rootNode.attributes.children[i2].layer==tmpLayerName && rootNode.attributes.children[i2].ftype=='layerSwitch'){
						var record = tree.getRootNode().findChild('id',rootNode.attributes.children[i2].id,true);
						tree.getSelectionModel().select(record).getUI().toggleCheck(true);
					}
				}
			}
		}
	}
}

var selectOn = 'N';
function selectTog(conOn, groupN){
	//Check for active select tool
	selectOn = 'N';
	for (i=0;i<wfsArray.length;i++){
		tmpON2 = "sH" + i;
		if (window[tmpON2].active === true){
			selectOn = 'Y';
		}
	}
	if (selectOn === 'Y'){
		//Deactivate the active tool
		edtoggleControl2('select', 'select');
		toolName = "highlight";
	} else {
		//Set the active tool
		edtoggleControl2('select', 'select');
		toolName = "highlight";
	}
}

function handleInfo(){
	//We are now using this variable as the switch
	if (popupDefault==true){
		popupDefault = false;
	} else {
		popupDefault = true;
	}
}

//****Find it
function selectEditHandle(){
	//We need to determine the polygon type and enable the correct tool
	var toolTog;
	if(edit_select_no===4){
		toolTog = 'edit_drag';
	} else if (edit_select_no===5) {
		toolTog = 'edit_reshape';
	} else if (edit_select_no===6) {
		toolTog = 'edit_rotate';
	} else if (edit_select_no===7) {
		toolTog = 'edit_resize';
	} else if (edit_select_no===8) {
		toolTog = 'del';
	}
	if(simplePolygonLayer.selectedFeatures.length>0){
		toolTog += '4';
		controls[toolTog].activate();
	} else if (polygonLayer.selectedFeatures.length>0) {
		toolTog += '3';
		controls[toolTog].activate();
	}//If neither are selected then don't bother
}

function selectHandle(feature){
	//The selection tool will only ever allow for a single selection at present as the table
	//filter is based solely on a gid filter (singular). Therefore we will simply clear the
	//layer before we start.
	selection.removeAllFeatures();
	
	var currFID, currTAB, oTAB, tmpLayF;

	if (feature!='none'){
		//OK, is this a single record or a multiple selection?
		if (existingToedit == 'Y'){
			//This is a special function that switches an existing record to editable
			hover.removeAllFeatures();
			transferit(feature);
		} else {
			//This is just a selection function. Features are added to the selection layer
			if (typeof feature.features != 'undefined'){
				alert("multiple features");
			} else {
				feature = feature.feature;
			}

			//Next we undertake the selection
			//feature = selection.features[0];
			selection.removeAllFeatures();
			selection.addFeatures(feature);
			selection.refresh({force: true});
			if (typeof feature.data.gid == 'undefined'){
				currGID = feature.attributes.gid;
			} else {
				currGID = feature.data.gid;
			}
			//The FID contains the layer name
			if (typeof feature.fid !== 'undefined'){
				currFID = feature.fid;
				currFID = currFID.split(".");
				currTAB = -1;
				//Pickup the overlay table name
				for(i=0;i<overlayTable.length;i++){
					if("RBC:"+currFID[0]===overlayAddress[i] || "Client:"+currFID[0]===overlayAddress[i]){
						//This is the overlay and the table is
						oTAB = overlayTable[i];
						for(i2=0;i2<tableArray.length;i2++){
							//Which table does this represent?
							if(tableArray[i2]===oTAB){
								//i2 is now the table number
								currTAB = i2;
							}
						}
					}
				}
			}
			if(currTAB!==-1){
				//We are recording the currGID in the gidLookupToRow array so we can find the row number in the .php files
				gidLookupToRow[currTAB] = parseInt(currGID);
				document.getElementById('currGID').value = currGID;
				document.getElementById('currGIDdone').value = parseInt(document.getElementById('lowerS').value);
			} else {
				//If not, we will update the first layer
				lowers[0] = 0;
				document.getElementById('currGID').value = currGID;
				document.getElementById('currGIDdone').value = parseInt(document.getElementById('lowerS').value);
			}
		}
	} else {
		//If this is a none command we are removing the selection
		for (i=0;i<gidLookupToRow.length;i++){
			gidLookupToRow[i] = '';
		}
		document.getElementById('currGID').value = "";
	}
}

function hoverHandle(features){
	if(typeof features!=='undefined'){
		//Add the feature only if it matches the strategy
		hover.removeAllFeatures();
		hover.addFeatures([features.feature]);
		hover.refresh({force: true});
	}
}

function selectHandleOff(feature){
	if (typeof feature.features != 'undefined'){
		alert("multiple features");
	} else {
		feature = feature.feature;
		selection.removeFeatures(feature);
	}
	currGID = '';
	document.getElementById('currGID').value = currGID;
	document.getElementById('lowerS').value = parseInt(document.getElementById('currGIDdone').value);
}

function handleTog(conOn, groupN, menuN){
	//This function updates the text in toolbar.
	if (conOn!=''){
		document.getElementById('footer').innerHTML = 'Currently Active Tool: ' + conOn;
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

    tableHTML = "../../apps/functions/results.php?tableWidth=" + tableWidth + "&table=" + table + "&function=add";

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
	
	//We need to pass the full lowers and recNos variables, we construct a string to pass
	for (i=0;i<recNos.length;i++){
		if(i===0){
			recNo = recNos[i];
		} else {
			recNo += "|" + recNos[i];
		}
	}
	for (i=0;i<lowers.length;i++){
		if(i===0){
			lower = lowers[i];
		} else {
			lower += "|" + lowers[i];
		}
	}

	//OK, there may be a sort so we need to pick this up
	var sortstr = "&sortstr=no";
	if (colsortsTitle.length!==0){
		for (i=0;i<colsortsTitle.length;i++){
			if(i===0){
				sortstr = "&sortstr=";
			} else {
				sortstr += "^";
			}
			sortstr += colsortsTitle[i] + "|" + colsorts[i];
		}
	}

	if (typeof tableSwap != 'undefined'){
		table = tableSwap;
	}

	for(i=0;i<tableHasView.length;i++){
		if (tableArray[i]==table){
			if (tableHasView[i]=='Y'){
				//This indicates that we should be querying a _view rather than the actual table, the view name is the next from the Table Array
				table = table + "_view";
			}
		}
	}

	if (override != 'override'){
		tableHTML = "../../apps/functions/results.php?tableWidth=" + tableWidth + "&table=" + table + "&function=" + document.getElementById('functionS').value + sortstr;

		tableHTML = tableHTML + "&recNo=" + recNo + "&lower=" + lower;
		//Create the rest of the GET string

		//Add a selected row where appropriate
		if (currGID!==''){
			currGID2 = document.getElementById('currGID').value;
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
					if(table.indexOf("_view") == -1){
						defineFieldNames(table);
					} else {
						defineFieldNames(table.substring(1,table.indexOf("_view")));
					}
					var headID = document.getElementsByTagName("head")[0];
					var newScript = document.createElement('script');
					newScript.type = 'text/javascript';
					var tmpLoc = tableHTML.indexOf("?");
					var textStr = "../../apps/functions/dynamite.php" + tableHTML.substr(tmpLoc); //This removes the results.php section of the other URL
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
	//Check for special edit style view 
	tableNo = -1; 
	var ti;
	for (ti=0;ti<tableArray.length;ti++){
		if (table===tableArray[ti]){
			tableNo = ti;
		}
	}
	if (tableSelectStyle[tableNo]==='view-edit'){
		if (tableHTML.indexOf('currGID')!==-1 && document.getElementById('currGID').value !== ''){
			//We have a selection, lets check the table variables
			if (tableHTML.indexOf("function=view")!==-1){ 
				//We didn't find the view-edit option
				currGID2 = "function=view-edit&selMode=view-edit&gid=" + currGID2;
				tableHTML = tableHTML.replace("function=view", currGID2);
			} //If it is found there is an issue and we do nothing!
		} else {
			if (tableHTML.indexOf("function=view")!==-1){ 
				//We didn't find the view-edit option
				currGID2 = "function=view&selMode=view-edit";
				tableHTML = tableHTML.replace("function=view", currGID2);
			} //If it is found there is an issue and we do nothing!
		}
	} else {
		//Ensure that the default Selection Mode is sent to server side scripting
		currGID2 = "function=view&selMode=view";
		tableHTML = tableHTML.replace("function=view", currGID2);
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
	if(window[overlayRef] == null){
	  return;
	}

	window[overlayRef].mergeNewParams({
		styles: styleRef
	});

	//OK, we have changed style but if there is a selectable legend we need to do some work now
	if (fullselectlegendtree==true) {
		jQuery1 = styleRef;
		overlayRef = overlayRef.replace("overlay","");
		overlayRef = parseInt(overlayRef);
		tmpWFSname2 = 'wfs' + overlayRef;
		tmpWFSname3 = overlayAddress[overlayRef];
		setupSLD(jQuery1, tmpWFSname2, tmpWFSname3, 3);
	}
}

function navSwitch(){
	edtoggleControl2("nav",'');
}

function zoomConSwitch(){
	edtoggleControl2("zoomBox",'');
}
