colRef = -1; //Zero is the default but -1 indicates the page is just loading

var stylesheet = document.styleSheets[3]; //This should be the istyles.css
var stylesheetTool = {			
	addRule: function(selector, rule, rules, target) {
	 return isIE
		? target.addRule(selector, rule, rules.length)
		: target.insertRule(selector + "{" + rule + "}", rules.length);
	}
};

var disableHandler = [];
var dH1 = [];
var dH2 = [];
function SetUpToggleCols(dir, colNo, maxCol, tableNo) {
	for (i=0;i<tableArray.length;i++){
		window["backButtonArray" + i] = document.getElementsByName('backBut' + i);
		window["forButtonArray" + i] = document.getElementsByName('forBut' + i);
	}
	
	//OK, we are now using pure css and removing the need for a button. We need to know if this is the first run for a particular table?
	var fr = -1;
	for (i=0;i<disableHandler.length;i++){
		if(tableNo===disableHandler[i]){
			fr = i;
		}
	}
	
	//If this is a first run then we use the default position
	if (fr===-1){
		//Add the default to the array
		disableHandler.push(tableNo);
		dH1.push(0);
		dH2.push(1);
		fr = 0; //This variable now holds the index reference to be used later
	} 
	
	//Finally we now test to see if the command requested is permitted
	var runScript = 0;
	if(dir==='back'){
		if (dH1[fr]===1){
			runScript = 1; //Permit the script to run
		}
	} else {
		//Check for a forward permission
		if (dH2[fr]===1){
			runScript = 1; //Permit the script to run
		}
	}
	
	if (runScript === 1){
		var tableOb, colWarray, tableWidth2;
		colWarray = [];
		tableWidth2 = tableWidth - 220;
				
		var colref1, colref2, head1, overMax, overMax2, indexRef, i, ArrRef, EndRef, stylerules, fieldSelector1, fieldSelector2, ieFix;
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
		
		//We need to know the widths of each column to know how to generate the table correctly
		//so we use JQuery to determine the with for each column
		if (colNo != 'NaN'){
			//All the other browser
			stylerules = isIE ? stylesheet.rules : stylesheet.cssRules;
			
			//Lets create a map of the CSS file
			for (i=0;i<=stylerules.length; i++){ 
				ruleName.push(stylerules[i]);
			}
			
			for (i=0;i<colNo;i++){
				//Need to unhidden everything first to ensure the widths are available
				document.getElementById('T' + tableNo + 'col' + i).className = "showItTab";
				if (isIE) {
					document.getElementById('T' + tableNo + 'col' + i).style.width = 0;
				} else {
					document.getElementById('T' + tableNo + 'col' + i).width = 0;
				}
				for(i2=0;i2<(ruleName.length-1);i2++){
					if (ieSyntax1) {
						ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
					} else if (ieSyntax2) {
						ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
					} else {
						ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
					}
					if(ruleName[i2].selectorText == ieFix){
						try {
							stylerules[i2].style.display = "table-cell";
						}
						catch (e) {
							stylerules[i2].style.display = "block";
						}
					}
				}
				//Once unhidden we can get the width and store it for later
				var tableOb = $('#T' + tableNo + 'col' + i);
				colWarray.push(tableOb.outerWidth());
			}
			
			if (colRef === -1) {
				//First time set up
				objVal = document.getElementById('T' + tableNo + 'colH1');
				objVal.className="showItTab";
				indexRef = stylerules.length;
				stylesheetTool.addRule('td[headers~=T' + tableNo + 'colH1]', 'display:table_cell;',stylerules , stylesheet);
				ruleArr.push(indexRef);
				
				//We no longer show and remove the buttons but now simply enable and disable
				for (i=0;i<window["backButtonArray" + tableNo].length;i++){
					window["backButtonArray" + tableNo][i].disabled = true;
				}

				//We are no longer using a maximum columns but instead we simply show as many as fit within the tableWidth2
				overMax = 0; //This is now a width
				for (i=0;i<(colNo);i++){
					head1 = 'td[headers~=T' + tableNo + 'col' + i + ']';
					if (overMax>=tableWidth2){
						//This is a hidden column
						objVal = document.getElementById('T' + tableNo + 'col' + i);
						objVal.className="hideIt";
						indexRef = stylerules.length;
						stylesheetTool.addRule(head1, 'display:none;',stylerules , stylesheet);
						ruleArr.push(indexRef);
					} else if ((overMax + colWarray[i] + colWarray[i+1])>tableWidth2){
						//This is the last visible column and we will resize it to fit
						objVal = document.getElementById('T' + tableNo + 'col' + i);
						objVal.className="showItTab";
						if (isIE) {
							objVal.style.width = (tableWidth - overMax); //This will resize the column to fit
						} else {
							objVal.width = (tableWidth - overMax); //This will resize the column to fit
						}
						indexRef = stylerules.length;
						stylesheetTool.addRule(head1, 'display:table-cell;' ,stylerules , stylesheet);
						ruleArr.push(indexRef);
						overMax = overMax + (tableWidth - overMax);
					} else {
						//This is a visible column
						objVal = document.getElementById('T' + tableNo + 'col' + i);
						objVal.className="showItTab";
						indexRef = stylerules.length;
						stylesheetTool.addRule(head1, 'display:table-cell;',stylerules , stylesheet);
						ruleArr.push(indexRef);
						overMax = overMax + (colWarray[i] + 10); //Where 10 is padding
					}
				}
				
				objVal = document.getElementById('T' + tableNo + 'colH2');
				objVal.className="showItTab";
				indexRef = stylerules.length;
				stylesheetTool.addRule('td[headers~=T' + tableNo + 'colH2]', 'display:table-cell;',stylerules , stylesheet);
				ruleArr.push(indexRef);
				
				//Set up the table colRef values
				for (i=0;i<tableArray.length;i++){
					window["colRef" + i] = 0;
				}
			} else {
				EndRef = (2 * colNo); //This is the number of array units to add to reach the first of the H2 CSS elements
				if (dir == 'back') {
					if (window["colRef" + tableNo] != 0) {
						//Move back by one column
						colref1 = window["colRef" + tableNo] - 2; //This is the new first column
						colref2 = document.getElementById('T' + tableNo + "col" + (colNo-1)); //This is the reference for the last column
						
						overMax = 0;
						for (i=0;i<colNo;i++){
							if (i <= colref1){
								//These columns are hidden by the user
								document.getElementById('T' + tableNo + "col" + i).className="hideIt";
								for(i2=0;i2<(ruleName.length-1);i2++){
									if (ieSyntax1) {
										ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
									} else if (ieSyntax2) {
										ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
									} else {
										ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
									}
									if(ruleName[i2].selectorText == ieFix){
										stylerules[i2].style.display = 'none';
									} 
								}
							} else if (i > colref1) {
								//OK we are now in the active columns
								if (overMax>=tableWidth2){
									//This is a hidden column
									document.getElementById('T' + tableNo + "col" + i).className="hideIt";
									for(i2=0;i2<(ruleName.length-1);i2++){
										if (ieSyntax1) {
											ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
										} else if (ieSyntax2) {
											ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
										} else {
											ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
										}
										if(ruleName[i2].selectorText == ieFix){
											stylerules[i2].style.display = 'none';
										} 
									}
								} else if ((overMax + colWarray[i] + colWarray[i+1])>tableWidth2){
									//This is the last visible column and we will resize it to fit
									document.getElementById('T' + tableNo + "col" + i).className="showItTab";
									if (isIE) {
										document.getElementById('T' + tableNo + "col" + i).style.width = (tableWidth - overMax); //This will resize the column to fit
									} else {
										document.getElementById('T' + tableNo + "col" + i).width = (tableWidth - overMax); //This will resize the column to fit
									}
									for(i2=0;i2<(ruleName.length-1);i2++){
										if (ieSyntax1) {
											ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
										} else if (ieSyntax2) {
											ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
										} else {
											ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
										}
										if (ruleName[i2].selectorText == ieFix) {
											try {
												stylerules[i2].style.display = "table-cell";
											}
											catch (e) {
												stylerules[i2].style.display = "block";
											}
										} 
									}
									overMax = overMax + (tableWidth2 - overMax);
								} else {
									//This is a visible column
									document.getElementById('T' + tableNo + "col" + i).className="showItTab";
									for(i2=0;i2<(ruleName.length-1);i2++){
										if (ieSyntax1) {
											ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
										} else if (ieSyntax2) {
											ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
										} else {
											ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
										}
										if (ruleName[i2].selectorText == ieFix) {
											try {
												stylerules[i2].style.display = "table-cell";
											}
											catch (e) {
												stylerules[i2].style.display = "block";
											}
										}
									}
									overMax = overMax + (colWarray[i] + 10); //Where 10 is padding
								}
							}
						}
						
						//Reset the back/forward columns as appopriate
						if (window["colRef" + tableNo] == 1) { //Then we will be at zero next which is time to hide the back button
							//Disable back buttons
							$( ".T" + tableNo + "back" ).switchClass( "T" + tableNo + "back", "T" + tableNo + "back-dis", 1000 );
							dH1[fr] = 0;
						} else {
							//Enable back buttons
							$( ".T" + tableNo + "back-dis" ).switchClass( "T" + tableNo + "back-dis", "T" + tableNo + "back", 1000 );
							dH1[fr] = 1;
						}
						
						if (colref2.className=="hideIt"){
							//Enable forward buttons
							$( ".T" + tableNo + "forward-dis" ).switchClass( "T" + tableNo + "forward-dis", "T" + tableNo + "forward", 1000 );
							dH2[fr] = 1;
						}
								
						window["colRef" + tableNo] = window["colRef" + tableNo] - 1;
					}
					//If else, Do Nothing, we are already at the start
				} else {
					//This was looking for the last record in an if statement but is no longer relevant as the script is not based on window size
					//if ((window["colRef" + tableNo] + maxCol) != colNo) {
						//Move forward by one column
						colref1 = window["colRef" + tableNo]; //This is the new first column
						colref2 = document.getElementById('T' + tableNo + "col" + (colNo-1)); //This is the reference for the last column
						
						overMax = 0;
						for (i=0;i<colNo;i++){
							if (i <= colref1){
								//These columns are hidden by the user
								document.getElementById('T' + tableNo + "col" + i).className="hideIt";
								for(i2=0;i2<(ruleName.length-1);i2++){
									if (ieSyntax1) {
										ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
									} else if (ieSyntax2) {
										ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
									} else {
										ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
									}
									if(ruleName[i2].selectorText == ieFix){
										stylerules[i2].style.display = 'none';
									} 
								}
							} else if (i > colref1) {
								//OK we are now in the active columns
								if (overMax>=tableWidth2){
									//This is a hidden column
									document.getElementById('T' + tableNo + "col" + i).className="hideIt";
									for(i2=0;i2<(ruleName.length-1);i2++){
										if (ieSyntax1) {
											ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
										} else if (ieSyntax2) {
											ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
										} else {
											ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
										}
										if(ruleName[i2].selectorText == ieFix){
											stylerules[i2].style.display = 'none';
										} 
									}
								} else if ((overMax2 + colWarray[i+1])>=tableWidth2){
									//This is the last visible column and we will resize it to fit
									document.getElementById('T' + tableNo + "col" + i).className="showItTab";
									if (isIE) {
										document.getElementById('T' + tableNo + "col" + i).style.width = (tableWidth - overMax); //This will resize the column to fit
									} else {
										document.getElementById('T' + tableNo + "col" + i).width = (tableWidth - overMax); //This will resize the column to fit
									}
									for(i2=0;i2<(ruleName.length-1);i2++){
										if (ieSyntax1) {
											ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
										} else if (ieSyntax2) {
											ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
										} else {
											ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
										}
										if (ruleName[i2].selectorText == ieFix) {
											try {
												stylerules[i2].style.display = "table-cell";
											}
											catch (e) {
												stylerules[i2].style.display = "block";
											}
										} 
									}
									overMax = overMax + (tableWidth - overMax);
									overMax2 = overMax + (colWarray[i+1] + 10);
								} else {
									//This is a visible column
									document.getElementById('T' + tableNo + "col" + i).className="showItTab";
									for(i2=0;i2<(ruleName.length-1);i2++){
										if (ieSyntax1) {
											ieFix = 'TD[headers~=T' + tableNo + 'col' + i + ']';
										} else if (ieSyntax2) {
											ieFix = 'td[headers~=T' + tableNo + 'col' + i + ']';
										} else {
											ieFix = 'td[headers~="T' + tableNo + 'col' + i + '"]';
										}
										if (ruleName[i2].selectorText == ieFix) {
											try {
												stylerules[i2].style.display = "table-cell";
											}
											catch (e) {
												stylerules[i2].style.display = "block";
											}
										}
									}
									overMax = overMax + (colWarray[i]+10); //Where 10 is padding
									overMax2 = overMax + (colWarray[i+1]+10); //Where 10 is padding
								}
							}
						}
						
						//Reset the back/forward columns as appopriate
						if (colref2.className!="hideIt"){
							//Disable forward buttons
							$( ".T" + tableNo + "forward" ).switchClass( "T" + tableNo + "forward", "T" + tableNo + "forward-dis", 1000 );
							dH2[fr] = 0;
						} else {
							//Enable forward buttons
							$( ".T" + tableNo + "forward-dis" ).switchClass( "T" + tableNo + "forward-dis", "T" + tableNo + "forward", 1000 );
							dH2[fr] = 1;					
						}

						if (window["colRef" + tableNo] == 0) {
							//Enable back buttons
							$( ".T" + tableNo + "back-dis" ).switchClass( "T" + tableNo + "back-dis", "T" + tableNo + "back", 1000 );
							dH1[fr] = 1;
								//Roll back script left incase you want to go back to buttons
								/*for (i=0;i<window["backButtonArray" + tableNo].length;i++){
									window["backButtonArray" + tableNo][i].disabled = null;
								}*/
						}
						window["colRef" + tableNo] = window["colRef" + tableNo] + 1;
					//}
					//If else, Do Nothing, we are already at the end
				}
			}
			if(document.getElementById("filterCk").value != "") {
				searchRecStyle(table);
			}
		}
	}
}


function changeSbutt(spanID) {
	document.getElementById(spanID).className="showIt";
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