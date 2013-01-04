//var patient_db;
var patientDataArray = [];

var shortName = 'MTESTDB';
var version = '1.0';
var displayName = 'MTest DB';
var maxSize = 100000; // in bytes

function initPatientDatabase() {
	
	//alert("init db");
	var patient_db;
	try {
	    	//console.log("initPatientDatabase()");
	        patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
			createPatientTable();
	} catch(e) {
	        alert("Unknown error "+ e +".");
            return;
	}
    
    function createPatientTable(){
        //console.log("createPatientTable()");
		patient_db.transaction(
			function (tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS patients (id INTEGER NOT NULL PRIMARY KEY, firstname TEXT NOT NULL, lastname TEXT NOT NULL, dob TEXT, sex TEXT, phone TEXT, email TEXT, disorder TEXT, chiefcomplaint TEXT, notes TEXT, imageurl TEXT);', [], patientNullDataHandler, patientErrorHandler);
	        }
	    );
        
        function patientNullDataHandler(){
            //alert("null data handler");
            //console.log("Create patient table (if necessary)");
        }

        function patientErrorHandler(transaction, error) {
            //console.log('pCreatePatientTable() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
            return false;
        }
    }
}



function writePatientToDb(inString) {
    //console.log("write patient to db");
    var id = Math.round(new Date().getTime()/1000.0);
    inString = id + ":::" + inString;
    var data = inString.split(":::");
    addRecordToPatientDB(data);
    //alert ();
    return id;
}

function addRecordToPatientDB(data){
	//console.log("add record to patient db: " + data[0]);
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	patient_db.transaction(
    	function (tx) {
			tx.executeSql("INSERT INTO patients(id, firstname, lastname, dob, sex, phone, email, disorder, chiefcomplaint, notes, imageurl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )", [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10]]);
    		//alert ("OK2");
    	}
	);
}

function updateRecordInPatientDB(data){

	//console.log("update record in patient db: " + data);
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
    	function (tx) {
			tx.executeSql("UPDATE patients SET firstname=?, lastname=?, dob=?, sex=?, phone=?, email=?, disorder=?, chiefcomplaint=?, notes=?, imageurl=? WHERE id = ?", [data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11], data[1]],
                function(res) {
                    //console.log("insertId: " + res.insertId + " -- probably 1");
                    //console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                    //console.log("updateRecordInPatientDB() Success");
                },
                function(e) {
                    return console.log("UPDATERECORDINPATIENTDB ERROR: " + e.message);
                });
    	}
	);	

}


function deleteRecordInPatientDB(patient_id){

	console.log("delete record in patient db: " + patient_id);
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
    	function (tx) {
			tx.executeSql("DELETE FROM patients WHERE id = ?", [patient_id],
                function(res) {
                    //console.log("insertId: " + res.insertId + " -- probably 1");
                    //console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                    //console.log("deleteRecordInPatientDB() Success");
                },
                function(e) {
                    return console.log("deleteRecordInPatientDB() [in db_patient.js] ERROR: " + e); //e.message
                });
    	}
	);
    setTimeout(function(){patient_db.close();}, 250);

}
	