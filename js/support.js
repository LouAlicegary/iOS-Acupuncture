function getPatientAge(dob_string){
	var dob = dob_string.split("/");
	dob_year = dob[2];
	dob_month = dob[0];
	dob_day = dob[1];
    var currentTime = new Date();
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

function getMDYDate(date_string){
    date = new Date(date_string);

    var month = padZeros(date.getMonth() + 1, 2);

    var day = padZeros(date.getDate(), 2);

    var year = date.getFullYear();

    date_format = month + "/" + day + "/" + year;
    return date_format;
}

function getTimeFromDate(date_string){
    date = new Date(date_string);
    var hours = padZeros(date.getHours(), 2);
    var minutes = padZeros(date.getMinutes(), 2);
    date_format = hours + ":" + minutes;
    return date_format;
}


function padZeros(theNumber, max) {
    var numStr = String(theNumber);
    
    while ( numStr.length < max) {
        numStr = '0' + numStr;
    }
    
    return numStr;
}


function getSex(){
        var sex;
		if(document.getElementById('male').checked)
			sex = 'M'; //Male radio button is checked 
		else if(document.getElementById('female').checked)
			sex = 'F'; //Female is checked
		else 
			sex = 'X'; //Neither is checked
		return sex;
}

function setSex(sex){
		if(sex == 'M')
			document.getElementById('male').checked = true;
		else if(sex == 'F')
			document.getElementById('female').checked = true;
}

function fillInPatientInfo(patient_id) {
	
	//console.log("fillInPatientInfo: id = " + patient_id);
	
	var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	        tx.executeSql("SELECT * FROM patients WHERE id=?;", [patient_id], patientNameDataHandler, patientErrorHandler99);
	    }
	);		

	function patientNameDataHandler(transaction, results){
		//alert("here");
		//console.log("fillInPatientInfo() DataHandler: rowcount = " + results.rows.length);
        var row = results.rows.item(0);
        var thisPatient = new Object();
    	thisPatient.last_name = row['lastname'];
    	thisPatient.first_name = row['firstname'];
    	thisPatient.dob = row['dob'];
    	thisPatient.sex = row['sex'];
    	thisPatient.disorder = row['disorder'];
    	thisPatient.chiefcomplaint = row['chiefcomplaint'];
    	
    	//console.log("fillInPatientInfo() data = " + thisPatient.sex);
        $('#patient_name').html(thisPatient.last_name + ", " + thisPatient.first_name);
        $('#patient_age').html(getPatientAge(thisPatient.dob));
		$('#patient_sex').html(thisPatient.sex);
		$('#patient_disorder').html(thisPatient.disorder);
		$('#patient_chiefcomplaint').html(thisPatient.chiefcomplaint);
	}
	
	function patientErrorHandler99(){
		// DO NOTHING
		console.log("PROBLEM WITH fillInPatientInfo");
	}
}


function fillInVisitDate(visit_id) {
	
	//console.log("fillInVisitDate: id = " + visit_id);
	
	var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	visit_db.transaction(
	    function (tx) {
	        tx.executeSql("SELECT * FROM visits WHERE id=?;", [visit_id], visitDateDataHandler, patientErrorHandler49);
	    }
	);		

	function visitDateDataHandler(transaction, results){
		//console.log("fillInVisitDate() DataHandler: rowcount = " + results.rows.length);
        var row = results.rows.item(0);
        var visitDate = row['date'];
        $('#heading-date_content').html(getMDYDate(visitDate));
        //console.log("date funct: " + getMDYDate(visitDate))
        //console.log("date: " + visitDate);
    	
	}
	
	function patientErrorHandler49(){
		// DO NOTHING
		console.log("PROBLEM WITH fillInPatientInfo");
	}
}



function repopulatePatientInfoDialog(dataString) {
    	var data = dataString.split(":::");
    	//MAY NEED TO ADD ID
    	document.getElementById('firstname').value = data[2];
    	document.getElementById('lastname').value = data[3];
    	document.getElementById('dob').value = data[4];
    	setSex(data[5]);
    	document.getElementById('phone').value = data[6];
    	document.getElementById('email').value = data[7];
    	document.getElementById('disorder').value = data[8];
    	document.getElementById('chiefcomplaint').value = data[9];
    	document.getElementById('notes').value = data[10];
        document.getElementById('patient_image').src = data[11];
}

function getWindowNameByID(patient_id, visit_id) {
	
	//alert ("fillInPatientInfo");
	//alert(id);
	
	var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	        tx.executeSql("SELECT * FROM patients WHERE id=?;", [patient_id], patientNameDataHandler22, patientErrorHandler22);
	    }
	);		

	function patientNameDataHandler22(transaction, results){
		//alert ("Patient Name myDataSelectHandler: rowcount = " + results.rows.length);
		console.log("getWindowNameByID() visit_id = " + visit_id);
        var row = results.rows.item(0);
    	window.name = visit_id + ":::" + row['id'] + ":::" + row['firstname'] + ":::" + row['lastname'] + ":::" + row['dob'] + ":::" + row['sex'] + ":::" + row['phone'] + ":::" + row['email'] + ":::" + row['disorder'] + ":::" + row['chiefcomplaint'] + ":::" + row['notes'] + ":::" + row['imageurl'];
    }
    function patientErrorHandler22(){
		// DO NOTHING
		alert("PROBLEM WITH getWindowNameByID");
	}
}