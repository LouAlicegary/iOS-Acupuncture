
function getPatientAge(dob_string){
    //console.log("getPatientAge()");
    var age;
	var dob = dob_string.split("/");
    dob_year = dob[2];
	dob_month = dob[0];
	dob_day = dob[1];
    
    if (dob_year == null){
        //console.log("bubkiss");
        age = "";
    }
    else {
        //console.log("else");
        if (dob_year < 10)
            dob_year = parseInt(dob_year) + 2000;
        else if (dob_year < 100)
            dob_year = parseInt(dob_year) + 1900;
    
        var currentTime = new Date();
        age = currentTime.getFullYear() - dob_year;
	
        if (dob_month >= currentTime.getMonth()+1 ) {
            if (!(dob_month == currentTime.getMonth()+1 && dob_day <= currentTime.getDate())) {
                //Birthday hasn't happened this year
                age = age-1;
            }
            else {
                //Birthday has happened this month DELETE THIS PART
            }
        }
    }
    return age;
}

function getMDYDate(date_string) {
    //console.log("here");
    date = new Date(date_string);

    var month = padZeros(date.getMonth() + 1, 2);

    var day = padZeros(date.getDate(), 2);

    var year = date.getFullYear();

    date_format = month + "/" + day + "/" + year;
    
    //console.log(date_format);
    
    return date_format;
}

function getTimeFromDate(date_string) {
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


function dateParser(raw_date) {
    
    var s_month = "";
    var s_day = "";
    var s_year = "";
    var fixed_date = "";
    
    var datearray = raw_date.split("/");
    
    if (datearray.length != 3) {
        // not enough slashes
        fixed_date = "";
    }
    else if ( datearray[0] == "" || datearray[1] == "" || datearray[2] == "") {
        // right number of slashes but null field
        fixed_date = "";
    }
    else if ( !( (0 < datearray[0] < 13) && (0 < datearray[1] < 32) && ((0 < datearray[2] < 100)&&(1910 < datearray[2] < 2010)) ) ) {
        // correct format and no nulls but fake numbers
        fixed_date = "";
    }
    else {
        // date passes all checks
        var month = datearray[0];
        var day = datearray[1];
        var year = datearray[2];
        
        //console.log("else datearray = " + datearray);
        
        if (month < 10)
            s_month = "0" + parseInt(month);

        if (parseInt(day) < 10)
            s_day = "0" + parseInt(day);

        if (parseInt(year) < 10) {
            s_year = year = "200" + parseInt(year);
        }
        
        if (parseInt(year) < 100)
            s_year = "19" + parseInt(year);

        fixed_date = s_month + "/" + s_day + "/" + s_year;
    }
    
    //console.log("raw date : " + raw_date + " fixed date: " + fixed_date);
    return fixed_date;
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
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
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




function getWindowNameByID(patient_id, visit_id) {
	
	//alert ("fillInPatientInfo");
	//alert(id);
	
	var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	        tx.executeSql("SELECT * FROM patients WHERE id=?;", [patient_id], patientNameDataHandler22, patientErrorHandler22);
	    }
	);		

	function patientNameDataHandler22(transaction, results){
		//console.log("getWindowNameByID() visit_id = " + visit_id);
        var row = results.rows.item(0);
    	window.name = visit_id + ":::" + row['id'] + ":::" + row['firstname'] + ":::" + row['lastname'] + ":::" + row['dob'] + ":::" + row['sex'] + ":::" + row['phone'] + ":::" + row['email'] + ":::" + row['disorder'] + ":::" + row['chiefcomplaint'] + ":::" + row['notes'] + ":::" + row['imageurl'];
    }
    function patientErrorHandler22(){
		// DO NOTHING
		alert("PROBLEM WITH getWindowNameByID");
	}
}



function fakeClick(event, anchorObj) {
    if (anchorObj.click) {
        anchorObj.click();
        $(anchorObj).trigger("myCustomEvent");
    }
    else if (document.createEvent) {
        if (event.target !== anchorObj) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            var allowDefault = anchorObj.dispatchEvent(evt);
            //console.log("event: " + event);
            // you can check allowDefault for false to see if
            // any handler called evt.preventDefault().
            // Firefox will *not* redirect to anchorObj.href
            // for you. However every other browser will.
        }
    }
}



// Toast Temporary Popup (like in Android)
function showToast() {
    //var toast_dialog = document.getElementById("toast");
    $('.patient_sheet').css("opacity",".1");
    $('#toast').css("opacity","1");
    $('#toast').show();
    
    console.log("show toast");
    
    setTimeout(function(){
        $('.patient_sheet').css("opacity","1");
        $('#toast').hide();
        console.log("hide toast");
    }, 3000);
}