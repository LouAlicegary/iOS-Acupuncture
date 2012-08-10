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

function fillInPatientInfo(id) {
	
	//alert ("fillInPatientInfo");
	
	var shortName = 'PATIENTDB';
	var version = '1.0';
	var displayName = 'Patient DB';
	var maxSize = 100000; // in bytes
	patient_db = openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	        tx.executeSql("SELECT * FROM patients WHERE id=?;", [id], patientNameDataHandler, patientErrorHandler99);
	    }
	);		

	function patientNameDataHandler(transaction, results){
		//alert("here");
		//alert ("Patient Name myDataSelectHandler: rowcount = " + results.rows.length);
        var row = results.rows.item(0);
        var thisPatient = new Object();
    	thisPatient.last_name = row['lastname'];
    	thisPatient.first_name = row['firstname'];
    	thisPatient.dob = row['dob'];
    	thisPatient.sex = row['sex'];
    	thisPatient.disorder = row['disorder'];
    	thisPatient.chiefcomplaint = row['chiefcomplaint'];
    	
    	//alert (thisPatient.last_name);
        $('#patient_name').html(thisPatient.last_name + ", " + thisPatient.first_name);
        $('#patient_age').html(getPatientAge(thisPatient.dob));
		$('#patient_sex').html(thisPatient.sex);
		$('#patient_disorder').html(thisPatient.disorder);
		$('#patient_chiefcomplaint').html(thisPatient.chiefcomplaint);
	}
	
	function patientErrorHandler99(){
		// DO NOTHING
		alert("PROBLEM WITH fillInPatientInfo");
	}
}

function repopulatePatientInfoDialog(dataString) {
    	var data = dataString.split(":::");
    	//MAY NEED TO ADD ID
    	document.getElementById('firstname').value = data[1];
    	document.getElementById('lastname').value = data[2];
    	document.getElementById('dob').value = data[3];
    	setSex(data[4]);
    	document.getElementById('phone').value = data[5];
    	document.getElementById('email').value = data[6];
    	document.getElementById('disorder').value = data[7];
    	document.getElementById('chiefcomplaint').value = data[8];
    	document.getElementById('notes').value = data[9];
}

function getWindowNameByID(id) {
	
	//alert ("fillInPatientInfo");
	//alert(id);
	
	var shortName = 'PATIENTDB';
	var version = '1.0';
	var displayName = 'Patient DB';
	var maxSize = 100000; // in bytes
	patient_db = openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	        tx.executeSql("SELECT * FROM patients WHERE id=?;", [id], patientNameDataHandler22, patientErrorHandler22);
	    }
	);		

	function patientNameDataHandler22(transaction, results){
		//alert ("Patient Name myDataSelectHandler: rowcount = " + results.rows.length);
		//alert(results.rows.length);
        var row = results.rows.item(0);
        //alert(row);
    	window.name = row['id'] + ":::" + row['lastname'] + ":::" + row['firstname'] + ":::" + row['dob'] + ":::" + row['sex'] + ":::" + row['phone'] + ":::" + row['email'] + ":::" + row['disorder'] + ":::" + row['chiefcomplaint'] + ":::" + row['notes'];
    }
    function patientErrorHandler22(){
		// DO NOTHING
		alert("PROBLEM WITH getWindowNameByID");
	}
}