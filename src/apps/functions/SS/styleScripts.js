colRef = -1; //Zero is the default but -1 indicates the page is just loading

var stylesheet = document.styleSheets[3]; //This should be the istyles.css
var stylesheetTool = {			
	addRule: function(selector, rule, rules, target) {
	 return isIE
		? target.addRule(selector, rule, rules.length)
		: target.insertRule(selector + "{" + rule + "}", rules.length);
	}
};

function SetUpToggleCols(dir, colNo, maxCol, tableNo) {
	var colref1, colref2, head1, overMax, indexRef, i, ArrRef, EndRef, stylerules, fieldSelector1, fieldSelector2, ieFix;
	var objVal = {};
	var ruleArr = []; //We are using this array to store the locations of each CSS rule in the file, we will use this later to delete and insert new rules
	var ruleName = [];  //This array contains the names
	
	var ieSyntax1, ieSyntax2;
	ieSyntax1 = false;
	ieSyntax2 = false;
	if (isIE) {
		if (rv < 9) {
			ieSyntax1 = true;
		} else {
			ieSyntax2 = true;
		}
	}
	if (colNo != 'NaN'){
		//All the other browser
		stylerules = isIE ? stylesheet.rules : stylesheet.cssRules;
		
		//Lets create a map of the CSS file
		for (i=0;i<=stylerules.length; i++){ 
			ruleName.push(stylerules[i]);
		}
		if (colRef === -1) {
			//First time set up
			objVal = document.getElementById('T' + tableNo + 'colH1');
			objVal.className="hideIt";
			indexRef = stylerules.length;
			stylesheetTool.addRule('td[headers~=T' + tableNo + 'colH1]', 'display:none; width:10px;',stylerules , stylesheet);
			ruleArr.push(indexRef);

			overMax = 0;
			for (i=0;i<(colNo);i++){
				head1 = 'td[headers~=T' + tableNo + 'col' + i + ']';
				if (overMax >= maxCol) {
					objVal = document.getElementById('T' + tableNo + 'col' + i);
					objVal.className="hideIt";
					indexRef = stylerules.length;
					stylesheetTool.addRule(head1, 'display:none;',stylerules , stylesheet);
					ruleArr.push(indexRef);
				} else {
					objVal = document.getElementById('T' + tableNo + 'col' + i);
					objVal.className="showItTab";
					indexRef = stylerules.length;
					stylesheetTool.addRule(head1, 'display:table-cell;',stylerules , stylesheet);
					ruleArr.push(indexRef);
				}
				overMax = overMax + 1;
			}
			
			objVal = document.getElementById('T' + tableNo + 'colH2');
			objVal.className="showItTab";
			indexRef = stylerules.length;
			stylesheetTool.addRule('td[headers~=T' + tableNo + 'colH2]', 'display:table-cell; width:10px;',stylerules , stylesheet);
			ruleArr.push(indexRef);
		} else {
			EndRef = (2 * colNo) + 1; //This is the number of array units to add to reach the first of the H2 CSS elements
			if (dir == 'back') {
				if (colRef != 0) {
					//Move back by one column
					colref1 = colRef - 1; //ColRef is the first column so this is the column before the current first column
					colref2 = (colRef + maxCol); //ColRef + maxCol gives the last current column
					
					document.getElementById('T' + tableNo + "col" + colref1).className="showItTab";
					document.getElementById('T' + tableNo + "col" + colref2).className="hideIt";
					for(i=0;i<(ruleName.length-1);i++){
						if (ieSyntax1) {
							ieFix = 'TD[headers~=T' + tableNo + 'col' + colref1 + ']';
						} else if (ieSyntax2) {
							ieFix = 'td[headers~=T' + tableNo + 'col' + colref1 + ']';
						} else {
							ieFix = 'td[headers~="T' + tableNo + 'col' + colref1 + '"]';
						}
						if(ruleName[i].selectorText == ieFix){
							try {
								stylerules[i].style.display = "table-cell";
							}
							catch (e) {
								stylerules[i].style.display = "block";
							}
						}
						if (ieSyntax1) {
							ieFix = 'TD[headers~=T' + tableNo + 'col' + colref2 + ']';
						} else if (ieSyntax2) {
							ieFix = 'td[headers~=T' + tableNo + 'col' + colref2 + ']';
						} else {
							ieFix = 'td[headers~="T' + tableNo + 'col' + colref2 + '"]';
						}
						if (ruleName[i].selectorText == ieFix) {
							stylerules[i].style.display = 'none';
						}
					}
					
					//Reset the back/forward columns as appopriate
					if (colRef == 1) { //Then we will be at zero next which is time to hide the back button
						fieldSelector = 'T' + tableNo + 'colH1';
						document.getElementById(fieldSelector).className="hideIt";
						for(i=0;i<(ruleName.length-1);i++){
							if (ieSyntax1) {
								ieFix = 'TD[headers~=T' + tableNo + 'colH1]';
							} else if (ieSyntax2) {
								ieFix = 'td[headers~=T' + tableNo + 'colH1]';
							} else {
								ieFix = 'td[headers~="T' + tableNo + 'colH1"]';
							}
							if(ruleName[i].selectorText == ieFix){
								stylerules[i].style.display = 'none';
							} 
						}
					} else {
						fieldSelector = 'T' + tableNo + 'colH1';
						document.getElementById(fieldSelector).className="showItTab";
						for(i=0;i<(ruleName.length-1);i++){
							if (ieSyntax1) {
								ieFix = 'TD[headers~=T' + tableNo + 'colH1]';
							} else if (ieSyntax2) {
								ieFix = 'td[headers~=T' + tableNo + 'colH1]';
							} else {
								ieFix = 'td[headers~="T' + tableNo + 'colH1"]';
							}
							if(ruleName[i].selectorText == ieFix){
								try {
									stylerules[i].style.display = "table-cell";
								}
								catch (e) {
									stylerules[i].style.display = "block";
								}
							} 
						}
					}
					if (colref2 <= (colNo-1)) { //Minus one on the colNo here as the scripted columns start at zero 
						fieldSelector = 'T' + tableNo + 'colH2';
						document.getElementById(fieldSelector).className="showItTab";
						for(i=0;i<(ruleName.length-1);i++){
							if (ieSyntax1) {
								ieFix = 'TD[headers~=T' + tableNo + 'colH2]';
							} else if (ieSyntax2) {
								ieFix = 'td[headers~=T' + tableNo + 'colH2]';
							} else {
								ieFix = 'td[headers~="T' + tableNo + 'colH2"]';
							}
							if(ruleName[i].selectorText == ieFix){
								try {
									stylerules[i].style.display = "table-cell";
								}
								catch (e) {
									stylerules[i].style.display = "block";
								}
							} 
						}
					}
							
					colRef = colRef - 1;
				}
				//If else, Do Nothing, we are already at the start
			} else {
				if ((colRef + maxCol) != (colNo-1)) {
					//Move forward by one column
					colref1 = colRef; //ColRef is the first column
					colref2 = (colRef + maxCol) + 1; //ColRef + maxCol gives the last current column so this is the next column
					
					document.getElementById('T' + tableNo + "col" + colref1).className="hideIt";
					document.getElementById('T' + tableNo + "col" + colref2).className="showItTab";
					for(i=0;i<(ruleName.length-1);i++){
						if (ieSyntax1) {
							ieFix = 'TD[headers~=T' + tableNo + 'col' + colref1 + ']';
						} else if (ieSyntax2) {
							ieFix = 'td[headers~=T' + tableNo + 'col' + colref1 + ']';
						} else {
							ieFix = 'td[headers~="T' + tableNo + 'col' + colref1 + '"]';
						}
						if(ruleName[i].selectorText == ieFix){
							stylerules[i].style.display = 'none';
						} 
						if (ieSyntax1) {
							ieFix = 'TD[headers~=T' + tableNo + 'col' + colref2 + ']';
						} else if (ieSyntax2) {
							ieFix = 'td[headers~=T' + tableNo + 'col' + colref2 + ']';
						} else {
							ieFix = 'td[headers~="T' + tableNo + 'col' + colref2 + '"]';
						}
						if (ruleName[i].selectorText == ieFix) {
							try {
								stylerules[i].style.display = "table-cell";
							}
							catch (e) {
								stylerules[i].style.display = "block";
							}
						}
					}
					
					//Reset the back/forward columns as appopriate
					if (colref2 == (colNo-1)){ //Minus one on the colNo here as the scripted columns start at zero 
						fieldSelector = 'T' + tableNo + 'colH2';
						document.getElementById(fieldSelector).className="hideIt";
						for(i=0;i<(ruleName.length-1);i++){
							if (ieSyntax1) {
								ieFix = 'TD[headers~=T' + tableNo + 'colH2]';
							} else if (ieSyntax2) {
								ieFix = 'td[headers~=T' + tableNo + 'colH2]';
							} else {
								ieFix = 'td[headers~="T' + tableNo + 'colH2"]';
							}
							if(ruleName[i].selectorText == ieFix){
								stylerules[i].style.display = 'none';
							} 
						}	
					} else {
						fieldSelector = 'T' + tableNo + 'colH2';
						document.getElementById(fieldSelector).className="showItTab";
						for(i=0;i<(ruleName.length-1);i++){
							if (ieSyntax1) {
								ieFix = 'TD[headers~=T' + tableNo + 'colH2]';
							} else if (ieSyntax2) {
								ieFix = 'td[headers~=T' + tableNo + 'colH2]';
							} else {
								ieFix = 'td[headers~="T' + tableNo + 'colH2"]';
							}
							if(ruleName[i].selectorText == ieFix){
								try {
									stylerules[i].style.display = "table-cell";
								}
								catch (e) {
									stylerules[i].style.display = "block";
								}
							} 
						}	
					}
					if (colRef == 0) {
						fieldSelector = 'T' + tableNo + 'colH1';
						document.getElementById(fieldSelector).className="showItTab";
						for(i=0;i<(ruleName.length-1);i++){
							if (ieSyntax1) {
								ieFix = 'TD[headers~=T' + tableNo + 'colH1]';
							} else if (ieSyntax2) {
								ieFix = 'td[headers~=T' + tableNo + 'colH1]';
							} else {
								ieFix = 'td[headers~="T' + tableNo + 'colH1"]';
							}
							if(ruleName[i].selectorText == ieFix){
								try {
									stylerules[i].style.display = "table-cell";
								}
								catch (e) {
									stylerules[i].style.display = "block";
								}
							} 
						}
					}
					colRef = colRef + 1;
				}
				//If else, Do Nothing, we are already at the end
			}
		}
		if(document.getElementById("filterCk").value != "") {
			searchRecStyle(table);
		}
	}
}


function changeSbutt(spanID) {
	document.getElementById(spanID).className="showIt";
}

function show2(switcher,tableRef){
	if (switcher == 'on') {
		document.getElementById('Qin2'+tableRef).className="showIt";
	} else {
		document.getElementById('Qin2'+tableRef).className="hideIt";
	}
}

function fieldTupdateStyle(opt, tableRef) {
	if (opt == "2") {
		document.getElementById('QPage3'+tableRef).className="hideIt";
		document.getElementById('QPage2'+tableRef).className="showIt";
	} else {
		document.getElementById('QPage1'+tableRef).className="hideIt";
		document.getElementById('QPage2'+tableRef).className="showIt";
	}
}

function backS1(tableRef) {
	document.getElementById('QPage2'+tableRef).className="hideIt";
	document.getElementById('QPage1'+tableRef).className="showIt";
}

function multiSearchStyle(tableRef) {
	document.getElementById('QPage2'+tableRef).className="hideIt";
	document.getElementById('QPage3'+tableRef).className="showIt";
 }
	
function searchRecStyle(table) {
	for(i=0;i<tableArray.length;i++){
		if (table == tableArray[i]){
			var tableRef = i;
		}
	}
	if (typeof document.getElementById('RFbutton'+tableRef) == 'object'){
		if (!document.getElementById('RFbutton'+tableRef)){
		} else {
			document.getElementById('RFbutton'+tableRef).className="showIt";
		}
	} 
}

function removeFilterStyle(tableRef) {
	document.getElementById('RFbutton'+tableRef).className="hideIt";
}