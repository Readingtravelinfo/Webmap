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
	var templateTextTemp = "";
    var fieldnames, fieldvalues;
	
	var searchType, searchFor, replaceVal, replaceTerm, fieldvalue;
	htmlText = "";
	//We need a framework to deal with multiple records per click
	for (var fi=0;fi<features.length; fi++){
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
			
		fieldnames = new Array();
		fieldvalues = new Array();

		//Populate the fieldnames array
		for (i=0;i<features.length;i++){
			for(var fieldname in features[i].attributes){
				fieldnames.push(fieldname);
			}
		}

		//OK, now we need to read in the template file

		//May need to enable these for some older browsers
		//var oRequest = new ActiveXObject("Msxml2.XMLHTTP");
		//var oRequest = new ActiveXObject("Microsoft.XMLHTTP");

		//Modern XMLHttpRequest to read text file
		var oRequest = new XMLHttpRequest();
		var pos = Dpath.indexOf('/geoserver');
		var Dpath3 = Dpath.substr(0,pos);
		sURL = Dpath3 + sURL;
		oRequest.open("GET",sURL,false);
		oRequest.setRequestHeader("User-Agent",navigator.userAgent);
		oRequest.send(null)

		if (oRequest.status==200) {
			templateTextTemp = oRequest.responseText;
		} else {
			alert("Error reading the popup template, please contact the GIS server team!");
			return false;
		}

		//Next we need to sort out special characters i.e. convert " to \"
		templateTextTemp = templateTextTemp.replace(/["]/g,"\\\"");

		//The next job is to scan through and pick up the values we need to pull
		//from the arrays; we will store these in an array.
		var searchStr = "$[";
		var startIndex = 0, searchStrLen = searchStr.length;
		var index, indices = [];
		while ((index = templateTextTemp.indexOf(searchStr, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}
		//We now have an index array of all the $[ matches, next we need the loop through
		//this array, locate the corresponding ] and then cut the variable references
		//out.
		var inputVars = new Array();
		var stopat;
		for (i=0;i<indices.length;i++){
			stopat = templateTextTemp.indexOf("]",indices[i]);
			inputVars.push(templateTextTemp.substring((indices[i]+2),(stopat)));
		}
	
		templateText = templateTextTemp;
		if (features.length==1) {
			//Get the feature data for this record
			fieldvalues = [];
			for(fieldvalue in features[fi].data){
				if (features[fi].data[fieldvalue]!=null){
					fieldvalues.push(features[fi].data[fieldvalue].replace(/%2C/g,','));
				} else {
					fieldvalues.push('');
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
			//Get the feature data for this record
			fieldvalues = [];
			for(fieldvalue in features[fi].data){
				if (features[fi].data[fieldvalue]!=null){
					fieldvalues.push(features[fi].data[fieldvalue].replace(/%2C/g,','));
				} else {
					fieldvalues.push('');
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