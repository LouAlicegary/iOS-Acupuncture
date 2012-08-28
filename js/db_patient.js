var patient_db;
var patientDataArray = [];

var shortName = 'MTESTDB';
var version = '1.0';
var displayName = 'MTest DB';
var maxSize = 100000; // in bytes

function initPatientDatabase() {
	
	//alert("init db");
	
	try {
	    if (!window.sqlitePlugin.openDatabase) {
	        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
	    } 
	    else {
	    	//console.log("open patient db");
	        patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
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
	 
		patient_db.transaction(
			function (tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS patients (id INTEGER NOT NULL PRIMARY KEY, firstname TEXT NOT NULL, lastname TEXT NOT NULL, dob TEXT, sex TEXT, phone TEXT, email TEXT, disorder TEXT, chiefcomplaint TEXT, notes TEXT, imageurl TEXT);', [], patientNullDataHandler, patientErrorHandler);
	        	//alert("db create 3");
	        }
	    );
	
	//alert("db create 4");
	//prePopulatePatientDB();
}

function patientNullDataHandler(){
	//alert("null data handler");
    //console.log("Create patient table (if necessary)");
}

function patientErrorHandler(transaction, error) {	
 	console.log("error handler");
 	if (error.code==1){
 		// DB Table already exists
        console.log("DB Table already exists");
 	}
 	else{
	    console.log('patientErrorHandler.  Error was ' + error.message + ' (Code ' + error.code + ')');
   	}
    return false;
}

function writePatientToDb(inString) {
        console.log("write patient to db");
        var id = Math.round(new Date().getTime()/1000.0);
		inString = id + ":::" + inString;
		var data = inString.split(":::");
		addRecordToPatientDB(data);
		//alert ();
		return id;
}

function addRecordToPatientDB(data){

	//console.log("add record to patient db: " + data);
	patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	//alert ("OK");
	
	patient_db.transaction(
    	function (tx) {
			tx.executeSql("INSERT INTO patients(id, firstname, lastname, dob, sex, phone, email, disorder, chiefcomplaint, notes, imageurl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )", [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10]]);
    		//alert ("OK2");
    	}
	);	

}

function updateRecordInPatientDB(data){

	console.log("update record in patient db: " + data);
	patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
    	function (tx) {
			tx.executeSql("UPDATE patients SET firstname=?, lastname=?, dob=?, sex=?, phone=?, email=?, disorder=?, chiefcomplaint=?, notes=?, imageurl=? WHERE id = ?", [data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11], data[1]],
                function(res) {
                    //console.log("insertId: " + res.insertId + " -- probably 1");
                    console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                },
                function(e) {
                    return console.log("ERROR: " + e.message);
                });
    	}
	);	

}


function deleteRecordInPatientDB(patient_id){

	console.log("delete record in patient db: " + patient_id);
	patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
    	function (tx) {
			tx.executeSql("DELETE FROM patients WHERE id = ?", [patient_id],
                function(res) {
                    //console.log("insertId: " + res.insertId + " -- probably 1");
                    console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                },
                function(e) {
                    return console.log("ERROR: " + e.message);
                });
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
	patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
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