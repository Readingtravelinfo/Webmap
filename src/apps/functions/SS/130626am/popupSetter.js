function templateReader(layer){
	//OK, now we need to read in the template file
	var Dpath3;
	if (Dpath.search("https://64") == -1) {
		Dpath3 = "https://geo.reading-travelinfo.co.uk";
	} else {
		Dpath3 = "https://64.5.1.218";
	}
	sURL = Ppath + overlayPopupTemp[layer];	
	sURL = Dpath3 + sURL;
	
	$.get(sURL, function(data) {
		var tmpTmplStr = "templateTextTemp" + layer;
		window[tmpTmplStr] = data;
	})
	.fail(function(){alert("Error reading the popup template for layer " + layer + " , please contact the GIS server team!");});
}

function popupHTML(features) {
    //This function allows a user to define the popup window using standard html
    //Where a value should be added from the attributes this should be denoted
    //as $[attribute.name]
	
	//The popup template to be used can be defined in the function call
	//var sURL = "../popuptemplate.txt";

    //There are three basic attribute types features, fieldnames & fieldvalues.
    //In all cases the name should be the field name you wish to display.
    //An example of each:
    //
    //   features.fid will return the layer name and gid value.
    //   fieldnames.all will return a list of all the field names (note - case sensitive).
    //   fieldvalues.recType would return the value of recType.
    //
    //It is worth noting that as you are using standard html there is not a real
    //need to use the fieldnames option but I have scripted all as a special
    //case.
    //
    //The html template must be stored in plain text in the functions folder
    //and called popuptemplate.txt.
    //
    //The bubble type / colour is determined by the
    //<link rel="stylesheet" type="text/css" href="../../../apps/ext/resources/css/ext-custom.css"></link>
    //<link rel="stylesheet" type="text/css" href="../../../apps/GeoExt/resources/css/custom_popup.css"></link>
    //values in the main html declarations. This script only determines the content.

    //Need to add substring of value functionality
    //	var spliter = lTitle.indexOf('.');
	//	var fid = lTitle.substr(spliter,((lTitle.length - spliter)-1));
	//	lTitle = lTitle.substr(0,spliter);
	var htmlText2 = "";
	var templateText = "";
    var fieldnames, fieldvalues;
	
	var searchType, searchFor, replaceVal, replaceTerm, fieldvalue;
	htmlText = "";
	var fi;
	//We need a framework to deal with multiple records per click
	for (fi=0;fi<features.length; fi++){
		//Get the layername from the fid value
		var currentLayer = features[fi].fid;
		currentLayer = currentLayer.substr(0,currentLayer.indexOf("."));
		var diamOpts = 0;
		//The wfs feature type field contains the layername so lets work out which layer we are displaying
		for (i=0;i<wfsFT.length;i++){
			if (wfsFT[i]==currentLayer){
				diamOpts = i;
			}
		}
		sURL = Ppath + overlayPopupTemp[diamOpts];	
		
		//Next we need to sort out special characters 
		var tmpTmplStr = "templateTextTemp" + diamOpts;
		templateText = window[tmpTmplStr];
		templateText = templateText.replace(/["]/g,"\\\"");

		//The next job is to scan through and pick up the values we need to pull
		//from the arrays; we will store these in an array.
		var searchStr = "$[";
		var startIndex = 0, searchStrLen = searchStr.length;
		var index, indices = [];
		while ((index = templateText.indexOf(searchStr, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}
		//We now have an index array of all the $[ matches, next we need the loop through
		//this array, locate the corresponding ] and then cut the variable references
		//out.
		var inputVars = new Array();
		var stopat;
		for (i=0;i<indices.length;i++){
			stopat = templateText.indexOf("]",indices[i]);
			inputVars.push(templateText.substring((indices[i]+2),(stopat)));
		}
		
		//fieldnames = new Array();
		//fieldvalues = new Array();
		
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
		
			//Now we loop through the array and find the relevant values, replacing
			//the code values in the html template as we go.
			for (i=0;i<inputVars.length;i++){
				stopat = inputVars[i].indexOf(".");
				searchType = inputVars[i].substring(0,(stopat-1));
				searchFor = inputVars[i].substring((stopat+1));
				if (searchType == "features") {
					//This is a features request, probably looking for the fid value
					replaceVal = features[i].window[searchFor];

					//Lets replace the instance
					replaceTerm = "$[" + inputVars[i] + "]";
					templateText = templateText.replace(replaceTerm,replaceVal);
				} else if (searchType == "fieldnames") {
					//This is a fieldnames request
					if (searchFor == "all") {
						//This is the special case
						replaceVal = "<ol>";
						for (j=0;j<fieldnames.length;j++){
							replaceVal += "<li>";
							replaceVal += fieldnames[j];
							replaceVal += "</li>";
						}
						replaceVal += "</ol>";

						//Lets replace the instance
						replaceTerm = "$[" + inputVars[i] + "]";
						templateText = templateText.replace(replaceTerm,replaceVal);
					} else {
						for (j=0;j<fieldnames.length;j++){
							if(fieldnames[j] == searchFor) {
								//This is the value to get
								replaceVal = fieldnames[j];

								//Lets replace the instance
								replaceTerm = "$[" + inputVars[i] + "]";
								templateText = templateText.replace(replaceTerm,replaceVal);
							}
						}
					}
				} else {
					//This is a fieldvalues (default)
					replaceTerm = new RegExp("\\$\\[" + inputVars[i] + "\\]","g");
					for (j=0;j<fieldnames.length;j++){
						if(fieldnames[j] == searchFor) {
							//This is the value to get
							replaceVal = fieldvalues[j];
							
							//Lets replace the instance
							templateText = templateText.replace(replaceTerm,replaceVal);
						} 
					}
					//OK, did we manage to replace the term?
					replaceTerm = "$[" + inputVars[i] + "]";
					if (templateText.indexOf(replaceTerm)!=-1){
						//We found it, the value must be null
						replaceVal = " - ";
						
						//Lets replace the instance
						replaceTerm = new RegExp("\\$\\[" + inputVars[i] + "\\]","g");
						templateText = templateText.replace(replaceTerm,replaceVal);
					}
				}
			}
			//Open a popup and set the width and height categories
			htmlText2 = "<html><head><title>Project Details</title></head><body>";
			htmlText2 += "<div style=width:"+popwidth[diamOpts]+";height:"+popheight[diamOpts]+";overflow:auto;>";
			htmlText2 += templateText;
			htmlText2 += "</body></html>";

			htmlText = htmlText2;
		} else {
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
		
			//Now we loop through the array and find the relevant values, replacing
			//the code values in the html template as we go.
			for (i=0;i<inputVars.length;i++){
				stopat = inputVars[i].indexOf(".");
				searchType = inputVars[i].substring(0,(stopat-1));
				searchFor = inputVars[i].substring((stopat+1));
				if (searchType == "features") {
					//This is a features request, probably looking for the fid value
					replaceVal = features[i].window[searchFor];

					//Lets replace the instance
					replaceTerm = "$[" + inputVars[i] + "]";
					templateText = templateText.replace(replaceTerm,replaceVal);
				} else if (searchType == "fieldnames") {
					//This is a fieldnames request
					if (searchFor == "all") {
						//This is the special case
						replaceVal = "<ol>";
						for (j=0;j<fieldnames.length;j++){
							replaceVal += "<li>";
							replaceVal += fieldnames[j];
							replaceVal += "</li>";
						}
						replaceVal += "</ol>";

						//Lets replace the instance
						replaceTerm = "$[" + inputVars[i] + "]";
						templateText = templateText.replace(replaceTerm,replaceVal);
					} else {
						for (j=0;j<fieldnames.length;j++){
							if(fieldnames[j] == searchFor) {
								//This is the value to get
								replaceVal = fieldnames[j];

								//Lets replace the instance
								replaceTerm = "$[" + inputVars[i] + "]";
								templateText = templateText.replace(replaceTerm,replaceVal);
							}
						}
					}
				} else {
					//This is a fieldvalues (default)
					replaceTerm = new RegExp("\\$\\[" + inputVars[i] + "\\]","g");
					for (j=0;j<fieldnames.length;j++){
						if(fieldnames[j] == searchFor) {
							//This is the value to get
							replaceVal = fieldvalues[j];
							
							//Lets replace the instance
							templateText = templateText.replace(replaceTerm,replaceVal);
						} 
					}
					//OK, did we manage to replace the term?
					replaceTerm = "$[" + inputVars[i] + "]";
					if (templateText.indexOf(replaceTerm)!=-1){
						//We found it, the value must be null
						replaceVal = " - ";
						
						//Lets replace the instance
						replaceTerm = new RegExp("\\$\\[" + inputVars[i] + "\\]","g");
						templateText = templateText.replace(replaceTerm,replaceVal);
					}
				}
			}
			
			//We have multiple popups so lets enclose the html
			if (fi==0) {
				//The first record
				//Open a popup and set the width and height categories
				htmlText2 = "<html><head><title>Project Details</title></head><body>";
				htmlText2 += "<div style=width:"+popwidth[diamOpts]+";height:"+popheight[diamOpts]+";overflow:auto;>";
				htmlText2 += "<div id='pop"+popid+"' style='display:block'>";
				htmlText2 += templateText;
				htmlText2 += "<br /><table width='100%'><tr><td align='left'></td><td align='right'><img src='../../../apps/img/arrow_right.png' onclick='popupSet(\"forward\","+popid+")'/></td></tr></table></div>";
			} else if (fi==(features.length-1)) {
				//The last record
				htmlText2 += "<div id='pop"+popid+"' style='display:none'>";
				htmlText2 += templateText;
				htmlText2 += "<br /><table width='100%'><tr><td align='left'><img src='../../../apps/img/arrow_left.png' onclick='popupSet(\"backward\","+popid+")'/></td><td align='right'></td></tr></table></div>";
				htmlText2 += "</body></html>";
			} else {
				//One in the middle
				htmlText2 += "<div id='pop"+popid+"' style='display:none'>";
				htmlText2 += templateText;
				htmlText2 += "<br /><table width='100%'><tr><td align='left'><img src='../../../apps/img/arrow_left.png' onclick='popupSet(\"backward\","+popid+")'/></td><td align='right'><img src='../../../apps/img/arrow_right.png' onclick='popupSet(\"forward\","+popid+")'/></td></tr></table></div>";
			}
			popid = popid + 1;
			htmlText = htmlText2;
		}
	}
	
	//The template text may have the term ~Dpath~ in it. This needs to be replaced with the relative 
	//link to the website and we do this now.
	if (Dpath.search("https://64") == -1) {
		replaceVal  = "https://geo.reading-travelinfo.co.uk";
	} else {
		replaceVal  = "https://64.5.1.218";
	}
	var pattern = "~Dpath~";
    replaceTerm = new RegExp(pattern, "g");
	htmlText = htmlText.replace(replaceTerm,replaceVal);
	
	//We may also have file path references which will be marked ~FP~ followed by the filepath with forward slashes
	//This are local filepaths only
	
	//***Disabled due to browser security restrictions***
	
	/*replaceVal = 'file:///\\\\rockgeos\\';
	var pattern = "~FP~";
    replaceTerm = new RegExp(pattern, "g");
	htmlText = htmlText.replace(replaceTerm,replaceVal);
	replaceVal = '\\';
	var pattern = "~";
    replaceTerm = new RegExp(pattern, "g");
	htmlText = htmlText.replace(replaceTerm,replaceVal);*/

    //now we return the popups html back to the main function, we are done!
    return htmlText;
}

function popupSet(dirPop,idNo){
	var tempPopRef;
	if (dirPop == "forward") {
		tempPopRef = "pop" + idNo;
		document.getElementById(tempPopRef).style.display = 'none';
		idNo = idNo + 1;
		tempPopRef = "pop" + idNo;
		document.getElementById(tempPopRef).style.display = 'block';
	} else {
		tempPopRef = "pop" + idNo;
		document.getElementById(tempPopRef).style.display = 'none';
		idNo = idNo - 1;
		tempPopRef = "pop" + idNo;
		document.getElementById(tempPopRef).style.display = 'block';
	}
}

//Hover files go below

function templateHoverReader(layer){
	//OK, now we need to read in the template file
	var Dpath3;
	if (Dpath.search("https://64") == -1) {
		Dpath3 = "https://geo.reading-travelinfo.co.uk";
	} else {
		Dpath3 = "https://64.5.1.218";
	}
	sURL = Ppath + overlayHover[layer];	
	sURL = Dpath3 + sURL;
	
	$.get(sURL, function(data) {
		var tmpTmplStr = "templateHoverTextTemp" + layer;
		window[tmpTmplStr] = data;
	})
	.fail(function(){alert("Error reading the hover template for layer " + layer + " , please contact the GIS server team!");});
}

function hoverHTML(features) {
    //This function allows a user to define the hover window using standard html
    //Where a value should be added from the attributes this should be denoted
    //as $[attribute.name]
	
	//The hover template to be used can be defined in the function call
	//var sURL = "../hovertemplate.txt";

	var htmlText2 = "";
	var templateText = "";
    var fieldnames, fieldvalues;
	
	var searchType, searchFor, replaceVal, replaceTerm, fieldvalue;
	htmlText = "";
	var fi;
	//We need a framework to deal with multiple records per click
	for (fi=0;fi<features.length; fi++){
		//Get the layername from the fid value
		var currentLayer = features[fi].fid;
		currentLayer = currentLayer.substr(0,currentLayer.indexOf("."));
		var diamOpts = 0;
		//The wfs feature type field contains the layername so lets work out which layer we are displaying
		for (i=0;i<wfsFT.length;i++){
			if (wfsFT[i]==currentLayer){
				diamOpts = i;
			}
		}
		sURL = Ppath + overlayHover[diamOpts];	
		
		//Next we need to sort out special characters 
		var tmpTmplStr = "templateHoverTextTemp" + diamOpts;
		templateText = window[tmpTmplStr];
		templateText = templateText.replace(/["]/g,"\\\"");

		//The next job is to scan through and pick up the values we need to pull
		//from the arrays; we will store these in an array.
		var searchStr = "$[";
		var startIndex = 0, searchStrLen = searchStr.length;
		var index, indices = [];
		while ((index = templateText.indexOf(searchStr, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}
		//We now have an index array of all the $[ matches, next we need the loop through
		//this array, locate the corresponding ] and then cut the variable references
		//out.
		var inputVars = new Array();
		var stopat;
		for (i=0;i<indices.length;i++){
			stopat = templateText.indexOf("]",indices[i]);
			inputVars.push(templateText.substring((indices[i]+2),(stopat)));
		}
		
		//fieldnames = new Array();
		//fieldvalues = new Array();
		
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
		
			//Now we loop through the array and find the relevant values, replacing
			//the code values in the html template as we go.
			for (i=0;i<inputVars.length;i++){
				stopat = inputVars[i].indexOf(".");
				searchType = inputVars[i].substring(0,(stopat-1));
				searchFor = inputVars[i].substring((stopat+1));
				if (searchType == "features") {
					//This is a features request, probably looking for the fid value
					replaceVal = features[i].window[searchFor];

					//Lets replace the instance
					replaceTerm = "$[" + inputVars[i] + "]";
					templateText = templateText.replace(replaceTerm,replaceVal);
				} else if (searchType == "fieldnames") {
					//This is a fieldnames request
					if (searchFor == "all") {
						//This is the special case
						replaceVal = "<ol>";
						for (j=0;j<fieldnames.length;j++){
							replaceVal += "<li>";
							replaceVal += fieldnames[j];
							replaceVal += "</li>";
						}
						replaceVal += "</ol>";

						//Lets replace the instance
						replaceTerm = "$[" + inputVars[i] + "]";
						templateText = templateText.replace(replaceTerm,replaceVal);
					} else {
						for (j=0;j<fieldnames.length;j++){
							if(fieldnames[j] == searchFor) {
								//This is the value to get
								replaceVal = fieldnames[j];

								//Lets replace the instance
								replaceTerm = "$[" + inputVars[i] + "]";
								templateText = templateText.replace(replaceTerm,replaceVal);
							}
						}
					}
				} else {
					//This is a fieldvalues (default)
					replaceTerm = new RegExp("\\$\\[" + inputVars[i] + "\\]","g");
					for (j=0;j<fieldnames.length;j++){
						if(fieldnames[j] == searchFor) {
							//This is the value to get
							replaceVal = fieldvalues[j];
							
							//Lets replace the instance
							templateText = templateText.replace(replaceTerm,replaceVal);
						} 
					}
					//OK, did we manage to replace the term?
					replaceTerm = "$[" + inputVars[i] + "]";
					if (templateText.indexOf(replaceTerm)!=-1){
						//We found it, the value must be null
						replaceVal = " - ";
						
						//Lets replace the instance
						replaceTerm = new RegExp("\\$\\[" + inputVars[i] + "\\]","g");
						templateText = templateText.replace(replaceTerm,replaceVal);
					}
				}
			}
			//Open a hover and set the width and height categories
			htmlText2 = "<html><head></head><body>";
			htmlText2 += "<div>";
			htmlText2 += templateText;
			htmlText2 += "</body></html>";

			htmlText = htmlText2;
		} else {
			var hoverid = 0;
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
		
			//Now we loop through the array and find the relevant values, replacing
			//the code values in the html template as we go.
			for (i=0;i<inputVars.length;i++){
				stopat = inputVars[i].indexOf(".");
				searchType = inputVars[i].substring(0,(stopat-1));
				searchFor = inputVars[i].substring((stopat+1));
				if (searchType == "features") {
					//This is a features request, probably looking for the fid value
					replaceVal = features[i].window[searchFor];

					//Lets replace the instance
					replaceTerm = "$[" + inputVars[i] + "]";
					templateText = templateText.replace(replaceTerm,replaceVal);
				} else if (searchType == "fieldnames") {
					//This is a fieldnames request
					if (searchFor == "all") {
						//This is the special case
						replaceVal = "<ol>";
						for (j=0;j<fieldnames.length;j++){
							replaceVal += "<li>";
							replaceVal += fieldnames[j];
							replaceVal += "</li>";
						}
						replaceVal += "</ol>";

						//Lets replace the instance
						replaceTerm = "$[" + inputVars[i] + "]";
						templateText = templateText.replace(replaceTerm,replaceVal);
					} else {
						for (j=0;j<fieldnames.length;j++){
							if(fieldnames[j] == searchFor) {
								//This is the value to get
								replaceVal = fieldnames[j];

								//Lets replace the instance
								replaceTerm = "$[" + inputVars[i] + "]";
								templateText = templateText.replace(replaceTerm,replaceVal);
							}
						}
					}
				} else {
					//This is a fieldvalues (default)
					replaceTerm = new RegExp("\\$\\[" + inputVars[i] + "\\]","g");
					for (j=0;j<fieldnames.length;j++){
						if(fieldnames[j] == searchFor) {
							//This is the value to get
							replaceVal = fieldvalues[j];
							
							//Lets replace the instance
							templateText = templateText.replace(replaceTerm,replaceVal);
						} 
					}
					//OK, did we manage to replace the term?
					replaceTerm = "$[" + inputVars[i] + "]";
					if (templateText.indexOf(replaceTerm)!=-1){
						//We found it, the value must be null
						replaceVal = " - ";
						
						//Lets replace the instance
						replaceTerm = new RegExp("\\$\\[" + inputVars[i] + "\\]","g");
						templateText = templateText.replace(replaceTerm,replaceVal);
					}
				}
			}
			
			//We have multiple hovers so lets enclose the html
			if (fi==0) {
				//The first record
				//Open a hover and set the width and height categories
				htmlText2 = "<html><head><title>Project Details</title></head><body>";
				htmlText2 += "<div>";
				htmlText2 += "<div id='hover"+hoverid+"' style='display:block;'>";
				htmlText2 += templateText;
				//htmlText2 += "<br /><table width='100%'><tr><td align='left'></td><td align='right'><img src='../../../apps/img/arrow_right.png' onclick='hoverSet(\"forward\","+hoverid+")'/></td></tr></table></div>";
				htmlText2 += "</div>";
			} else if (fi==(features.length-1)) {
				//The last record
				htmlText2 += "<div id='hover"+hoverid+"' style='display:block;'>";
				htmlText2 += templateText;
				//htmlText2 += "<br /><table width='100%'><tr><td align='left'><img src='../../../apps/img/arrow_left.png' onclick='hoverSet(\"backward\","+hoverid+")'/></td><td align='right'></td></tr></table></div>";
				htmlText2 += "</div></div></body></html>";
			} else {
				//One in the middle
				htmlText2 += "<div id='hover"+hoverid+"' style='display:block;'>";
				htmlText2 += templateText;
				htmlText2 += "</div>";
				//htmlText2 += "<br /><table width='100%'><tr><td align='left'><img src='../../../apps/img/arrow_left.png' onclick='hoverSet(\"backward\","+hoverid+")'/></td><td align='right'><img src='../../../apps/img/arrow_right.png' onclick='hoverSet(\"forward\","+hoverid+")'/></td></tr></table></div>";
			}
			hoverid = hoverid + 1;
			htmlText = htmlText2;
		}
	}
	
	//The template text may have the term ~Dpath~ in it. This needs to be replaced with the relative 
	//link to the website and we do this now.
	if (Dpath.search("https://64") == -1) {
		replaceVal  = "https://geo.reading-travelinfo.co.uk";
	} else {
		replaceVal  = "https://64.5.1.218";
	}
	var pattern = "~Dpath~";
    replaceTerm = new RegExp(pattern, "g");
	htmlText = htmlText.replace(replaceTerm,replaceVal);
	
	//We may also have file path references which will be marked ~FP~ followed by the filepath with forward slashes
	//This are local filepaths only
	
	//***Disabled due to browser security restrictions***
	
	/*replaceVal = 'file:///\\\\rockgeos\\';
	var pattern = "~FP~";
    replaceTerm = new RegExp(pattern, "g");
	htmlText = htmlText.replace(replaceTerm,replaceVal);
	replaceVal = '\\';
	var pattern = "~";
    replaceTerm = new RegExp(pattern, "g");
	htmlText = htmlText.replace(replaceTerm,replaceVal);*/

    //now we return the hovers html back to the main function, we are done!
    return htmlText;
}

function hoverSet(dirhover,idNo){
	var temphoverRef;
	if (dirhover == "forward") {
		temphoverRef = "hover" + idNo;
		document.getElementById(temphoverRef).style.display = 'none';
		idNo = idNo + 1;
		temphoverRef = "hover" + idNo;
		document.getElementById(temphoverRef).style.display = 'block';
	} else {
		temphoverRef = "hover" + idNo;
		document.getElementById(temphoverRef).style.display = 'none';
		idNo = idNo - 1;
		temphoverRef = "hover" + idNo;
		document.getElementById(temphoverRef).style.display = 'block';
	}
}