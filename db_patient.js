var patient_db;

function initPatientDatabase() {
	
	//alert("init db");
	
	try {
	    if (!window.openDatabase) {
	        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
	    } 
	    else {
	    	//alert("db open");
	        var shortName = 'PATIENTDB';
	        var version = '1.0';
	        var displayName = 'Patient DB';
	        var maxSize = 100000; // in bytes
	        patient_db = openDatabase(shortName, version, displayName, maxSize);
	        //alert("db open 2");
			createPatientTable();
			//alert("db open 3");
			selectAllPatients();
			//alert("db open 4");
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
				tx.executeSql('CREATE TABLE IF NOT EXISTS patients (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, firstname TEXT NOT NULL, lastname TEXT NOT NULL, dob TEXT, sex TEXT);', [], patientNullDataHandler, patientErrorHandler);
	        	//alert("db create 3");
	        }
	    );
	
	//alert("db create 4");
	prePopulatePatientDB();
}


function prePopulatePatientDB(){

		//alert("db prepopulate");
		patient_db.transaction(
	    	function (tx) {
	    		var data = ['1','Sly','Stallone','8/03/1951','F'];
				tx.executeSql("INSERT INTO patients(firstname, lastname, dob, sex) VALUES (?, ?, ?, ?)", [data[1], data[2], data[3], data[4]]);
	    		//alert("db prepopulate 4");
	    	}
		);	
		//alert("db prepopulate");
}


function selectAllPatients(){ 

	//alert("db select ");

	patient_db.transaction(
	    function (transaction) {
			transaction.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler, patientErrorHandler);
			//alert("db select 2");
		}
	);	
}

function patientDataSelectHandler(transaction, results) {
	//alert ("dataselecthandler: " + results.rows.length + " rows");          
}

function patientNullDataHandler(){
	//alert("null data handler");
}

function patientErrorHandler(transaction, error) {
 	
 	alert("error handler");
 	
 	if (error.code==1){
 		// DB Table already exists
 	} 
 	else {
    	// Error is a human-readable string.
	    alert('Oops.  Error was ' + error.message + ' (Code ' + error.code + ')');
 	}
    return false;

}




function getPatientNameActual() {
	
	//alert ("getPatientNameActual");
	
	var shortName = 'PATIENTDB';
	var version = '1.0';
	var displayName = 'Patient DB';
	var maxSize = 100000; // in bytes
	
	//alert ("getPatientNameActual 2");
	
	patient_db = openDatabase(shortName, version, displayName, maxSize);
	
	//alert ("getPatientNameActual 3");
	
	patient_db.transaction(
	    function (tx) {
	        tx.executeSql("SELECT * FROM patients;", [], patientNameDataHandler, patientErrorHandler);
	        // Old query SELECT * FROM page_settings WHERE id = 1;
	    }
	);		

	function patientNameDataHandler(transaction, results){
		
		//alert ("Patient Name myDataSelectHandler: rowcount = " + results.rows.length);
        var row = results.rows.item(0);
        var newFeature = new Object();
    	newFeature.last_name = row['lastname'];
    	newFeature.first_name = row['firstname'];
    	newFeature.dob = row['dob'];
    	newFeature.sex = row['sex'];
    	//alert (newFeature.last_name);
        $('#patient_name').html(newFeature.last_name + ", " + newFeature.first_name);
        $('#patient_age').html(getPatientAge(newFeature.dob));
		$('#patient_sex').html(newFeature.sex);
	}
}

function getPatientAge(dob_string){
	var dob = dob_string.split("/");
	dob_year = dob[2];
	dob_month = dob[0];
	dob_day = dob[1];
	var age = currentTime.getFullYear() - dob_year;
	
	if (dob_month >= currentTime.getMonth()+1 ) { 
		if (dob_month == currentTime.getMonth()+1 && dob_day <= currentTime.getDate() ) {
			//Birthday has happened this month
		}
		else { //Birthday hasn't happened this year
			age = age-1;
		}
	}
	
	return age;
}
