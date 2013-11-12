<?php
// attempt a connection
include 'housekeeping.php';

//This file can handle the following functions
//INSERT
//UPDATE (assumption!! gid is the WHERE claus)
//DROP (i.e. delete where gid is equal from a table)

//pg_escape_literal() is preferable to to pg_escape_string() acording to the online php manual
//This will remove ' characters to avoid syntax errors from user inputs and SQL injections.

//pg_escape_identifier() must be used to escape table / column names which might have user input 

//We need to query the table to get the field list and field types then check for posted values
//and build the relevant query string. 
$dbconn = pg_connect($conn_string) or die('connection failed' . pg_last_error());
$table = $_POST['table'];
$table = str_replace("'","",$table);
$gidVal = $_POST['gid'];
$gidVal = str_replace("'","",$gidVal);
//Lets work out what values we are collecting
$query = "SELECT * FROM " . $table;
$res = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
		
$colNo = pg_num_fields($res);
for ($j=0;$j<$colNo;$j++){
	$fnval = pg_field_name($res, $j);
	$ftval = pg_field_type($res, $j);
	if ($j == 0) {
		$fnarray = array($j=> $fnval);
		$ftarray = array($j=> $ftval);
		$ft = array($j=>"");
	} else {
		$fnarray[$j] = $fnval;
		$ftarray[$j] = $ftval;
	}
	
	/*pg_field_type returns
	bigint => int8
	bigserial => int8
	bit => bit
	bit varying => varbit
	boolean => bool
	box => box
	bytea => bytea
	character varying => varchar
	character => bpchar
	cidr => cidr
	circle => circle
	date => date
	double precision => float8
	inet => inet
	integer => int4
	interval => interval
	line => line
	lseg => lseg
	macaddr => macaddr
	money => money
	numeric => numeric
	path => path
	point => point
	polygon => polygon
	real => float4
	smallint => int2
	serial => int4
	text => text
	time => time
	time with time zone => timetz
	timestamp => timestamp
	timestamp with time zone => timestamptz
	
	Which summarises to:
	bool = B
	date = DT
	time = DT
	timestamp = DT
	timestamptz = DT
	timetz = DT
	box = G
	circle = G
	line = G
	lseg = G
	path = G
	point = G
	polygon = G
	bit = N
	bytea = N
	float4 = N
	float8 = N
	int2 = N
	int4 = N
	int8 = N
	interval = N
	money = N
	numeric = N
	varbit = N
	cidr = O
	inet = O
	macaddr = O
	bpchar = S
	text = S
	varchar = S
	
	-->
	B = Bool
	DT = Date/Time
	G = Geometry
	N = Numeric
	S = String
	O = Other*/
	
	if($ftval == 'bool'){
		$ft[$j] = "B";
	} elseif ($ftval == 'date' || $ftval == 'time' || $ftval == 'timestamp' || $ftval == 'timestamptz' || $ftval == 'timetz') {
		$ft[$j] = "DT";
	} elseif ($ftval == 'box' || $ftval == 'circle' || $ftval == 'line' || $ftval == 'lseg' || $ftval == 'path' || $ftval == 'point' || $ftval == 'polygon') {
		$ft[$j] = "G";
	} elseif ($ftval == 'bit' || $ftval == 'bytea' || $ftval == 'float4' || $ftval == 'float8' || $ftval == 'int2' || $ftval == 'int4' || $ftval == 'int8' || $ftval == 'interval' || $ftval == 'money' || $ftval == 'numeric' || $ftval == 'varbit') {
		$ft[$j] = "N";
	} elseif ($ftval == 'bpchar' || $ftval == 'text' || $ftval == 'varchar') {
		$ft[$j] = "S";
	} elseif ($ftval == 'cidr' || $ftval == 'inet' || $ftval == 'macaddr') {
		$ft[$j] = "O";
	}
	
}

//Now we have the fieldtypes we pick up the values
//We already have the table name
$qtype = $_POST['qstr']; //We need this so we know which query type to construct

if ($qtype == "INSERT") {
	//This is an insert
	//INSERT INTO table (cols) VALUES (vals);
	$dynqstr = $qtype . " INTO " . pg_escape_identifier($table) . " (";
	$s1 = "";
	$s2 = "";
	$i2 = -1;
	$i3 = 0;
	for ($i=0;$i<$colNo;$i++){
		if ($fnarray[$i] != 'gid') {
			//Stay away from primary keys should be an autonumber
			unset($val);
			$val = $_POST[$fnarray[$i]];
			$val = str_replace("'","",$val);
			$val = str_replace("chr(38)","&",$val);
			if (isset($val)) {
				if ($val == '' || $val == '\n' || $val == 'null') {
					$i2 = $i2 + 1;
					$i3 = 0;
				} else {
					//There is a value to save
					$i2 = $i2 + 1;
					$i3 = 1;
				}
				if ($i2 == 0) {
					//The first value
					$s1 = pg_escape_identifier($fnarray[$i]);
					if ($i3 == 0) {
						//lets handle the null values
						$s2 = " NULL ";
					} else {
						//Set the correct escape
						if($ft[$i]=='B') {
							if ($val == "on") {
								$s2 = "true";
							} else {
								$s2 = "false";
							}
						} elseif ($ft[$i] == 'DT') {
							$s2 = pg_escape_literal($val);
						} elseif ($ft[$i] == 'G') {
							$s2 = pg_escape_literal($val);
						} elseif ($ft[$i] == 'N') {
							if (is_numeric($val)){
								$s2 = $val;
							}
						} elseif ($ft[$i] == 'S') {
							$s2 = pg_escape_literal($val);
						} elseif ($ft[$i] == 'O') {
							$s2 = pg_escape_literal($val);
						} else {
							$s2 = pg_escape_literal($val);
						}
					}
				} elseif ($i2 > 0) {
					//Other values
					$s1 .= ", " . pg_escape_identifier($fnarray[$i]);
					$s2 .= ", ";
					if ($i3 == 0) {
						//lets handle the null values
						$s2 .= " NULL ";
					} else {
						//Set the correct escape
						if($ft[$i]=='B') {
							if ($val == "on") {
								$s2 .= "true";
							} else {
								$s2 .= "false";
							}
						} elseif ($ft[$i] == 'DT') {
							$s2 .= pg_escape_literal($val);
						} elseif ($ft[$i] == 'G') {
							$s2 .= pg_escape_literal($val);
						} elseif ($ft[$i] == 'N') {
							if (is_numeric($val)){
								$s2 .= $val;
							}
						} elseif ($ft[$i] == 'S') {
							$s2 .= pg_escape_literal($val);
						} elseif ($ft[$i] == 'O') {
							$s2 .= pg_escape_literal($val);
						} else {
							$s2 .= pg_escape_literal($val);
						}
					}
				}
			}
		}
	}

	if ($i2 != -1) {
		$dynqstr .= $s1 . ") VALUES (" . $s2 . ");";
	} else {
		//At this stage this represents an error
		$eerr = 1;
	}
	
} elseif ($qtype == "UPDATE" || $qtype == "SUPDATE") {
	//This is an update
	//UPDATE table_name SET column_name1 = new_value1, etc..;
	if ($qtype == "SUPDATE") {
		$supdate = true;
		$qtype = "UPDATE";
	} else {
		$supdate = false;
	}
	$dynqstr = $qtype . pg_escape_identifier($table) . " SET ";
	$s1 = "";
	$s2 = "";
	$s3 = "";
	$i2 = -1;
	$i3 = 0;
	for ($i=0;$i<$colNo;$i++){
		if ($fnarray[$i] == 'gid') {
			if (is_numeric($gidVal)){
				$gidVal = $gidVal;
			} else {
				//An invalid gid is an error
				$eerr = 1;
			}
		} else {
			//Stay away from primary keys should be an autonumber
			unset($val);
			$val = $_POST[$fnarray[$i]];
			if (isset($val)) {
				$val = str_replace("'","",$val);
				$val = str_replace("chr(38)","&",$val); 
				if ($val == '' || $val == '\n' || $val == 'null') {
					$i2 = $i2 + 1;
					$i3 = 0;
				} else {
					//There is a value to save
					$i2 = $i2 + 1;
					$i3 = 1;
				}
				//Generate the string
				$s1 = pg_escape_identifier($fnarray[$i]);
				if ($i3 == 0) {
					//lets handle the null values
					$s2 = " NULL ";
				} else {
					//Set the correct escape
					if($ft[$i]=='B') {
						if ($val == "on") {
							$s2 = "true";
						} else {
							$s2 = "false";
						}
					} elseif ($ft[$i] == 'DT') {
						$s2 = pg_escape_literal($val);
					} elseif ($ft[$i] == 'G') {
						$s2 = pg_escape_literal($val);
					} elseif ($ft[$i] == 'N') {
						if (is_numeric($val)){
							$s2 = $val;
						}
					} elseif ($ft[$i] == 'S') {
						$s2 = pg_escape_literal($val);
					} elseif ($ft[$i] == 'O') {
						$s2 = pg_escape_literal($val);
					} else {
						$s2 = pg_escape_literal($val);
					}
				}
				if ($i2 == 0) {
					$s3 .= $s1 . " = " . $s2;
				} else {
					$s3 .= ", " . $s1 . " = " . $s2;
				}
			}
		}
	}
	
	if ($i2 != -1) {
		$dynqstr .= $s3 . " WHERE gid = " . $gidVal . ";";
		
		//At this point we need to save a copy to the backup table
		//Download the existing record
		$query = 'SELECT * FROM ' . pg_escape_identifier($table) . ' WHERE gid = ' . $gidVal . ';';
		$bk = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());

		//Save it to the backup table
		//Generate the refStr from the previous query
		$bkcolNo = pg_num_fields($bk);
		$j = 0;
		while ($b < $bkcolNo) {
			$type = pg_field_type($bk, $b);
			$valStr = pg_fetch_result($bk, 0, $b);
			if ($valStr=='') {
				$valStr = "NULL";
			}
			
			if ($b==0) {
				$refStr2 = pg_field_name($bk, $b);
				if ($type == 'bool') {
					if ($valStr == 'NULL') {
						$refStr3 = "" . $valStr . "";
					} else {
						$refStr3 = "'" . $valStr . "'";
					}
				} elseif ($type=='geometry') {
					$refStr3 = "'" . $valStr . "'";
				} elseif (is_numeric(strpos($type, "int"))) {
					$refStr3 = $valStr;
				} elseif (is_numeric(strpos($type, "float"))) {
					$refStr3 = $valStr;
				} elseif (is_numeric(strpos($type, "double"))) {
					$refStr3 = $valStr;
				} elseif (is_numeric(strpos($type, "serial"))) {
					$refStr3 = $valStr;
				} else {
					if ($valStr == 'NULL') {
						$refStr3 = "" . $valStr . "";
					} else {
						$refStr3 = "'" . $valStr . "'";
					}
				}
			} else {
				$refStr2 .= "," . pg_field_name($bk, $b);
				if ($type == 'bool') {
					if ($valStr == 'NULL') {
						$refStr3 .= "," . $valStr . "";
					} else {
						$refStr3 .= ",'" . $valStr . "'";
					}
				} elseif ($type=='geometry') {
					$refStr3 .= ",'" . $valStr . "'";
				} elseif (is_numeric(strpos($type, "int"))) {
					$refStr3 .= "," . $valStr;
				} elseif (is_numeric(strpos($type, "float"))) {
					$refStr3 .= "," . $valStr;
				} elseif (is_numeric(strpos($type, "double"))) {
					$refStr3 .= "," . $valStr;
				} elseif (is_numeric(strpos($type, "serial"))) {
					$refStr3 .= "," . $valStr;
				} else {
					if ($valStr == 'NULL') {
						$refStr3 .= "," . $valStr . "";
					} else {
						$refStr3 .= ",'" . $valStr . "'";
					}
				}
			}
			$b = $b + 1;
		}

		if (strpos($table, ";") === false && strpos($table, "'") === false && strpos($table, "\"") === false) {
			$dynqstr2 = "INSERT INTO bk_" . $table . " (" . $refStr2 . ") VALUES (" . $refStr3 . ");";
		} else {
			$dynqstr2 = "Delibrate fail, you may not have a ; or \" or ' in a table name";
		}
		//Run the query
		$bk2 = pg_query($dbconn, $dynqstr2) or die('Query failed: ' . pg_last_error());
		pg_free_result($bk);
		pg_free_result($bk2);
	} else {
		//At this stage this represents an error
		$eerr = 1;
	}
} elseif ($qtype == "DROP") {
	//We can delete a record from a table !!!Want to look at this script again from a security point of view!!!
	for ($i=0;$i<$colNo;$i++){
		if ($fnarray[$i] == 'gid') {
			$val = $_POST[$fnarray[$i]];
			if (is_numeric($val)) {
				$val = $val;
			} else {
				//This is an error
				$val = "";
				$eerr = 1;
			}
		}
	}
	//At this point we need to save a copy to the backup table unless this is a ue (user edit) table
	if (substr($table, 0,2) != 'ue') {
		//Download the existing record
		$query = 'SELECT * FROM ' . pg_escape_identifier($table) . ' WHERE gid = ' . $gidVal . ';';
		$bk = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());

		//Save it to the backup table
		//Generate the refStr from the previous query
		$bkcolNo = pg_num_fields($bk);
		$j = 0;
		while ($b < $bkcolNo) {
			$type = pg_field_type($bk, $b);
			$valStr = pg_fetch_result($bk, 0, $b);
			if ($valStr=='') {
				$valStr = "NULL";
			}
			
			if ($b==0) {
				$refStr2 = pg_field_name($bk, $b);
				if ($type == 'bool') {
					if ($valStr == 'NULL') {
						$refStr3 = "" . $valStr . "";
					} else {
						$refStr3 = "'" . $valStr . "'";
					}
				} elseif ($type=='geometry') {
					$refStr3 = "'" . $valStr . "'";
				} elseif (is_numeric(strpos($type, "int"))) {
					$refStr3 = $valStr;
				} elseif (is_numeric(strpos($type, "float"))) {
					$refStr3 = $valStr;
				} elseif (is_numeric(strpos($type, "double"))) {
					$refStr3 = $valStr;
				} elseif (is_numeric(strpos($type, "serial"))) {
					$refStr3 = $valStr;
				} else {
					if ($valStr == 'NULL') {
						$refStr3 = "" . $valStr . "";
					} else {
						$refStr3 = "'" . $valStr . "'";
					}
				}
			} else {
				$refStr2 .= "," . pg_field_name($bk, $b);
				if ($type == 'bool') {
					if ($valStr == 'NULL') {
						$refStr3 .= "," . $valStr . "";
					} else {
						$refStr3 .= ",'" . $valStr . "'";
					}
				} elseif ($type=='geometry') {
					$refStr3 .= ",'" . $valStr . "'";
				} elseif (is_numeric(strpos($type, "int"))) {
					$refStr3 .= "," . $valStr;
				} elseif (is_numeric(strpos($type, "float"))) {
					$refStr3 .= "," . $valStr;
				} elseif (is_numeric(strpos($type, "double"))) {
					$refStr3 .= "," . $valStr;
				} elseif (is_numeric(strpos($type, "serial"))) {
					$refStr3 .= "," . $valStr;
				} else {
					if ($valStr == 'NULL') {
						$refStr3 .= "," . $valStr . "";
					} else {
						$refStr3 .= ",'" . $valStr . "'";
					}
				}
			}
			$b = $b + 1;
		}
		if (strpos($table, ";") === false && strpos($table, "'") === false && strpos($table, "\"") === false) {
			$dynqstr2 = "INSERT INTO bk_" . $table . " (" . $refStr2 . ") VALUES (" . $refStr3 . ");";
		} else {
			$dynqstr2 = "Delibrate fail, you may not have a ; or \" or ' in a table name";
		}
		//Run the query
		$bk2 = pg_query($dbconn, $dynqstr2) or die('Query failed: ' . pg_last_error());
		pg_free_result($bk);
		pg_free_result($bk2);
	}
	
	//Now we can remove the record
	$dynqstr = "DELETE FROM " . pg_escape_identifier($table) . " WHERE gid = " . $gidVal . ";";
}

//Run the query
$result = "";
if ($eerr != 1){
	$res2 = pg_query($dbconn, $dynqstr) or $result = pg_last_error();
} else {
	$result = "ERROR: There was an error with your query";
}
if (strpos($result, "ERROR") === false) {
	$result = "OK";
} 
// Free resultset
pg_free_result($res);
pg_free_result($res2);
// Closing connection
pg_close($dbconn);
print $result;
?>