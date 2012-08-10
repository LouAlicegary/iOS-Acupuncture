var patient_db;
var patientDataArray = [];

var shortName = 'PATIENTDB';
var version = '1.0';
var displayName = 'Patient DB';
var maxSize = 100000; // in bytes

function initPatientDatabase() {
	
	//alert("init db");
	
	try {
	    if (!window.openDatabase) {
	        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
	    } 
	    else {
	    	//alert("db open");
	        patient_db = openDatabase(shortName, version, displayName, maxSize);
	        //alert("db open 2");
			createPatientTable();
			//prePopulatePatientDB();
			//selectAllPatients();
			//alert("db open 3");
	    }
	} catch(e) {
	    if (e == 2) {
	        // Version mismatch.
	        alert("Invalid database version.");
	    } 
	    else {
	        alert("Unknown error "+ e +".");
	    }
	    return;
	} 
}

function createPatientTable(){
	 
		//alert("db create");
		patient_db.transaction(
			function (tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS patients (id INTEGER NOT NULL PRIMARY KEY, firstname TEXT NOT NULL, lastname TEXT NOT NULL, dob TEXT, sex TEXT, phone TEXT, email TEXT, disorder TEXT, chiefcomplaint TEXT, notes TEXT);', [], patientNullDataHandler, patientErrorHandler);
	        	//alert("db create 3");
	        }
	    );
	
	//alert("db create 4");
	//prePopulatePatientDB();
}

function patientNullDataHandler(){
	//alert("null data handler");
}

function patientErrorHandler(transaction, error) {	
 	alert("error handler");
 	if (error.code==1){
 		// DB Table already exists
 	}
 	else{
	    alert('Oops.  Error was ' + error.message + ' (Code ' + error.code + ')'); 	
   	}
    return false;
}

function writePatientToDb(inString) {
		var id = Math.round(new Date().getTime()/1000.0);
		inString = id + ":::" + inString;
		var data = inString.split(":::");
		addRecordToPatientDB(data);
		//alert ();
		return id;
}

function addRecordToPatientDB(data){

	//alert("add record to patient db: " + data);
	patient_db = openDatabase(shortName, version, displayName, maxSize);
	
	//alert ("OK");
	
	patient_db.transaction(
    	function (tx) {
			tx.executeSql("INSERT INTO patients(id, firstname, lastname, dob, sex, phone, email, disorder, chiefcomplaint, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )", [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9]]);
    		//alert ("OK2");
    	}
	);	

}

function updateRecordInPatientDB(data){

	//alert("add record to patient db: " + data);
	patient_db = openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
    	function (tx) {
			tx.executeSql("UPDATE patients SET firstname=?, lastname=?, dob=?, sex=?, phone=?, email=?, disorder=?, chiefcomplaint=?, notes=? WHERE id = ?", [data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[0]], patientNullDataHandler, patientErrorHandler);
    		//alert("booyah");
    	}
	);	

}



	
	
/*
function prePopulatePatientDB(){

		//alert("db prepopulate");
		patient_db.transaction(
	    	function (tx) {
	    		var data = ['1','Sly','Stallone','8/03/1951','F', '(503) 310-7822', 'docomo@gmail.com', 'Schizophrenia', 'My soul hurts', 'Notes go here'];
				tx.executeSql("INSERT INTO patients(firstname, lastname, dob, sex, phone, email, disorder, chiefcomplaint, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )", [data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9]]);
	    		//alert("db prepopulate 4");
	    	}
		);	
		//alert("db prepopulate");
}

function selectAllPatients(){ 

	//alert("db select ");
	patient_db = openDatabase(shortName, version, displayName, maxSize);
	//alert("db select ");
	patient_db.transaction(
	    function (tx) {
	    	//alert("db select 2");
			tx.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler, patientErrorHandler);
			//setTimeout(function() { return patientDataArray[0];  }, 1000);	
		}
	);	
}


function patientDataSelectHandler(transaction, results) {
	//alert ("dataselecthandler: " + results.rows.length + " rows");  
	var i;  
	for (i=0; i < results.rows.length; i++) {
		row = results.rows.item(i);
		patientDataArray[i] = Array();
		patientDataArray[i][0] = row['firstname'];
		patientDataArray[i][1] = row['lastname'];
		patientDataArray[i][2] = row['dob'];
		patientDataArray[i][3] = row['sex'];
	} 
	alert("word: " + patientDataArray[0]);    
	
}

*/