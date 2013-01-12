
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
        }
    }
    return age;
}

function getMDYDate(date_string) {

    //console.log("getMDYDate() datestring: " + date_string);
    date = new Date(date_string);

    var month = padZeros(date.getMonth() + 1, 2);

    var day = padZeros(date.getDate(), 2);

    var year = date.getFullYear();

    var date_format = month + "/" + day + "/" + year;
    
    //console.log("date format: " + date_format);
    
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
    
    //console.log("datearray = " + datearray);
    
    if (datearray.length != 3) {
        // not enough slashes
        //console.log("not enough slashes");
        fixed_date = "";
    }
    else {
        //console.log("else");
        var month = datearray[0];
        var day = datearray[1];
        var year = datearray[2];
        
        if ( (month === "") || (day === "") || (year === "") ) {
            // right number of slashes but null field
            //console.log("blanks");
            fixed_date = "";
        }
        else if ( (month < 0) || (month > 12) || (day < 0) || (day > 31) || (year < 0) || (year > 2013) || ((year>100) && (year < 1900)) ) {
            // correct format and no nulls but fake numbers
            //console.log("fake nums");
            fixed_date = "";
        }
        else {
            // date passes all checks
            //console.log("passes checks");
            s_month = month;
            s_year = year;
            s_day = day;
            
            if (parseInt(month) < 13) {
                s_month = "0" + parseInt(month);
            }
            if (parseInt(day) < 10) {
                s_day = "0" + parseInt(day);
            }
            if (parseInt(year) < 10) {
                year = "200" + parseInt(year);
                s_year = year;
            }
            else if (parseInt(year) < 100)
                s_year = "19" + parseInt(year);
            else
                s_year = year;
                
            fixed_date = s_month + "/" + s_day + "/" + s_year;
        }        
        
    }

    //console.log("raw date : " + raw_date + " fixed date: " + fixed_date);
    return fixed_date;
}



function getSex(prefix){
    //console.log("getsex");
    var sex;
    if(document.getElementById(prefix + "male").checked) {
        //console.log("getsex-1");
        sex = 'M'; //Male radio button is checked
    }
    else if(document.getElementById(prefix + "female").checked) {
        //console.log("getsex-2");
        sex = 'F'; //Female is checked
    }
    else {
        //console.log("getsex-3");
        sex = 'X'; //Neither is checked
    }
    return sex;
}

function setSex(sex){
    
    if(sex == 'M') {
        document.getElementById('sheet_male').checked = true;
    }

    else if(sex == 'F') {
        document.getElementById('sheet_female').checked = true;
    }

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
		//console.log("PROBLEM WITH fillInPatientInfo");
	}
    
    //setTimeout(function(){patient_db.close();}, 250);
}


function fillInVisitDate(visit_id) {
	
	//console.log("fillInVisitDate: id = " + visit_id);
	
	var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	visit_db.transaction( function (tx) {
        tx.executeSql("SELECT * FROM visits WHERE id=?;", [visit_id],
            function visitDateDataHandler(transaction, results){
                //console.log("fillInVisitDate() DataHandler: rowcount = " + results.rows.length);
                var row = results.rows.item(0);
                var visitDate = row['date'];
                $('#heading-date_content').html(getMDYDate(visitDate));
                //console.log("date funct: " + getMDYDate(visitDate))
                //console.log("date: " + visitDate);
            },
            function(e){}
        );
    });
    
    //setTimeout(function(){patient_db.close();}, 250);

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
        }
    }
}




function showToast(deletion_type, patient_id, visit_id) { // Toast Temporary Popup (like in Android) -> 0 = patient ; 1 = visit

    $('#delete_confirm_dialog').dialog({
        modal: true,
        height: 250,
        width: 400,
        resizable: false,
        buttons: [{
            text: "Yes", 
            id: "ok_delete",
            click: function () {
                
                if (deletion_type == 0) {
                    deleteRecordInPatientDB(patient_id);
                    setTimeout(function(){popUpDeletePatientDialog();}, 200); 
                }
                else {
                    deleteRecordInVisitDB(visit_id);
                    setTimeout(function(){popUpDeleteVisitDialog(patient_id, "the patient");}, 200);                 
                }
            
                $(this).dialog('destroy');
                $('.patient_frontpage_middle').css("opacity",".1");
                $('#toast').css("opacity","1");
                $('#toast').show();
                //console.log("show toast");
                setTimeout(function(){
                    $('.patient_frontpage_middle').css("opacity","1");
                    $('#toast').hide();
                    //console.log("hide toast");
                }, 1200);                
            }, }, {
            text: "No",
            click: function () {
                //$(this).dialog('close');
                $(this).dialog('destroy');
                //$('.patient_frontpage_middle').css("opacity","1");
            },
        }]
     });
}

function populateMovementDialog(movement_number, visit_id, the_id) {
    
    //console.log("populateMovementDialog() the_id = " + the_id);
    var movement_number_int = parseInt(movement_number);
    document.getElementById('movement_dialog_image').innerHTML = "<img src=\"../images/" + movement_number + "_big.png\">";
    document.getElementById('movement_dialog_header').innerText = Movement_Descriptions[movement_number_int];

    //CREATE SCORE BOXES DYNAMICALLY
    if (movement_number_int == 1) {
        document.getElementById('movement_dialog_score_boxes').innerHTML = 
            "<div id=\"left_pre\" class=\"movement-rating_pre_box_three_wide\">" + 
                document.getElementById(the_id+"_pre_l").innerText + "</div>" + 
            "<div id=\"left_post\" class=\"movement-rating_post_box_three_wide\">" + 
                document.getElementById(the_id+"_post_l").innerText + "</div>" + 
            "<div id=\"middle_pre\" class=\"movement-rating_pre_box_three_wide\">" + 
                document.getElementById(the_id+"_pre_m").innerText + "</div>" + 
            "<div id=\"middle_post\" class=\"movement-rating_post_box_three_wide\">" + 
                document.getElementById(the_id+"_post_m").innerText + "</div>" + 
            "<div id=\"right_pre\" class=\"movement-rating_pre_box_three_wide\">" + 
                document.getElementById(the_id+"_pre_r").innerText + "</div>" + 					
            "<div id=\"right_post\" class=\"movement-rating_post_box_three_wide\">" + 
                document.getElementById(the_id+"_post_r").innerText + "</div>";
        
        getSingleNotes(visit_id, movement_number);
    }
    else if (movement_number_int == 2 || movement_number_int == 27 || movement_number_int == 28 || movement_number_int == 0) {
        document.getElementById('movement_dialog_score_boxes').innerHTML = 
            "<div id=\"middle_pre\" class=\"movement-rating_pre_box_single\">" + 
                document.getElementById(the_id+"_pre_m").innerText + "</div>" + 
            "<div id=\"middle_post\" class=\"movement-rating_post_box_single\">" + 
                document.getElementById(the_id+"_post_m").innerText + "</div>";
             
        getSingleNotes(visit_id, movement_number);           
                                
    }
    else {
        //console.log("here: " + getSingleScore(visit_id, "m03l_pre"));
        
        document.getElementById('movement_dialog_score_boxes').innerHTML = 
            "<div id=\"left_pre\" class=\"movement-rating_pre_box_two_wide\">" + 
                document.getElementById(the_id+"_pre_l").innerText + "</div>" + 
            "<div id=\"left_post\" class=\"movement-rating_post_box_two_wide\">" + 
                document.getElementById(the_id+"_post_l").innerText + "</div>" + 
            "<div id=\"right_pre\" class=\"movement-rating_pre_box_two_wide\">" + 
                document.getElementById(the_id+"_pre_r").innerText + "</div>" + 
            "<div id=\"right_post\" class=\"movement-rating_post_box_two_wide\">" + 
                document.getElementById(the_id+"_post_r").innerText + "</div>";
                
        getSingleNotes(visit_id, movement_number);
        
    }
    
    var categories = Movement_Categories[movement_number_int].split(";");
    //console.log(categories);
    if (categories.length == 1) {
        document.getElementById('movement_dialog_image_description_container').innerHTML =
            "<div class=\"movement_dialog_image_description_one\">" + categories[0] + "</div>";
    }
    else if (categories.length == 2) {
        document.getElementById('movement_dialog_image_description_container').innerHTML =
            "<div class=\"movement_dialog_image_description_two\">" + categories[0] + "</div>" +
            "<div class=\"movement_dialog_image_description_two\">" + categories[1] + "</div>";
    }
    else {
        document.getElementById('movement_dialog_image_description_container').innerHTML =
            "<div class=\"movement_dialog_image_description_three\">" + categories[0] + "</div>" +
            "<div class=\"movement_dialog_image_description_three\">" + categories[1] + "</div>" +
            "<div class=\"movement_dialog_image_description_three\">" + categories[2] + "</div>";
    }    
}

function populateNotesMovementDialog(movement_number, visit_id, the_id) {
    
    //console.log("populateNotesMovementDialog() the_id = " + the_id);
    var movement_number_int = parseInt(movement_number);
    document.getElementById('notes_movement_dialog_image').innerHTML = "<img src=\"../images/" + movement_number + "_big.png\">";
    document.getElementById('notes_movement_dialog_header').innerText = Movement_Descriptions[movement_number_int];

    visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
    //console.log("got here 2");
    visit_db.transaction( function (tx) {
        tx.executeSql("SELECT * FROM visits WHERE id=?;", [visit_id],
            function(transaction, results) {
                //console.log("outputNotes datahandler(): " + results.rows.length + " rows");
                row = results.rows.item(0);

                //CREATE SCORE BOXES DYNAMICALLY
                if (movement_number_int == 0) {
                    document.getElementById('notes_movement_dialog_score_boxes').innerHTML =
                        "<div id=\"notes_middle_pre\" class=\"movement-rating_pre_box_single\">" +
                            row['overall_pre'] + "</div>" + 
                        "<div id=\"notes_middle_post\" class=\"movement-rating_post_box_single\">" +
                            row['overall_post'] + "</div>";
                         
                    getSingleNotesNotes(visit_id, movement_number);    
                }
                else if (movement_number_int == 1) {
                    //console.log("here");

                    document.getElementById('notes_movement_dialog_score_boxes').innerHTML =
                        "<div id='notes_left_pre' class='movement-rating_pre_box_three_wide'>" +
                            row['m' + movement_number + '_pre'] + "</div>" +
                        "<div id='notes_left_post' class='movement-rating_post_box_three_wide'>" +
                            row['m' + movement_number + '_post'] + "</div>" +
                        "<div id='notes_middle_pre' class='movement-rating_pre_box_three_wide'>" +
                            row['m' + movement_number + 'a_pre'] + "</div>" +
                        "<div id='notes_middle_post' class='movement-rating_post_box_three_wide'>" +
                           row['m' + movement_number + 'a_post'] + "</div>" +
                        "<div id='notes_right_pre' class='movement-rating_pre_box_three_wide'>" +
                            row['m' + movement_number + 'b_pre'] + "</div>" +					
                        "<div id='notes_right_post' class='movement-rating_post_box_three_wide'>" +
                            row['m' + movement_number + 'b_post'] + "</div>";
                      
                    //console.log("gets here");
                    getSingleNotesNotes(visit_id, movement_number);
                    //console.log("gets here 2");                    
                }
                else if (movement_number_int == 2 || movement_number_int == 27 || movement_number_int == 28 ) {
                    
                    document.getElementById('notes_movement_dialog_score_boxes').innerHTML =
                        "<div id=\"notes_middle_pre\" class=\"movement-rating_pre_box_single\">" +
                            row['m' + movement_number + '_pre'] + "</div>" + 
                        "<div id=\"notes_middle_post\" class=\"movement-rating_post_box_single\">" +
                            row['m' + movement_number + '_post'] + "</div>";
                         
                    getSingleNotesNotes(visit_id, movement_number);
                                            
                }
                else {
                    //console.log("here: " + getSingleScore(visit_id, "m03l_pre"));
                    
                    document.getElementById('notes_movement_dialog_score_boxes').innerHTML =
                        "<div id='notes_left_pre' class='movement-rating_pre_box_two_wide'>" +
                            row['m' + movement_number + 'l_pre'] + "</div>" +
                        "<div id='notes_left_post' class='movement-rating_post_box_two_wide'>" +
                            row['m' + movement_number + 'l_post'] + "</div>" +
                        "<div id='notes_right_pre' class='movement-rating_pre_box_two_wide'>" +
                            row['m' + movement_number + 'r_pre'] + "</div>" +
                        "<div id='notes_right_post' class='movement-rating_post_box_two_wide'>" +
                            row['m' + movement_number + 'r_post'] + "</div>";
                    
                    getSingleNotesNotes(visit_id, movement_number);
                    
                }
            },
            function(e){}
        );
    });
    
    //setTimeout(function(){patient_db.close();}, 250);

    var categories = Movement_Categories[movement_number_int].split(";");
    //console.log(categories);
    if (categories.length == 1) {
        document.getElementById('notes_movement_dialog_image_description_container').innerHTML =
            "<div class=\"movement_dialog_image_description_one\">" + categories[0] + "</div>";
    }
    else if (categories.length == 2) {
        document.getElementById('notes_movement_dialog_image_description_container').innerHTML =
            "<div class=\"movement_dialog_image_description_two\">" + categories[0] + "</div>" +
            "<div class=\"movement_dialog_image_description_two\">" + categories[1] + "</div>";
    }
    else {
        document.getElementById('notes_movement_dialog_image_description_container').innerHTML =
            "<div class=\"movement_dialog_image_description_three\">" + categories[0] + "</div>" +
            "<div class=\"movement_dialog_image_description_three\">" + categories[1] + "</div>" +
            "<div class=\"movement_dialog_image_description_three\">" + categories[2] + "</div>";
    }
}

function saveMovementDialogInfo(movement_number, visit_id, the_id) {
    if (movement_number == 0) {
        //console.log("save 0");
        document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
        document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;

        updateSingleRecordInVisitDB("overall_pre", [visit_id, document.getElementById('middle_pre').innerText]);
        updateSingleRecordInVisitDB("overall_post", [visit_id, document.getElementById('middle_post').innerText]);
        updateSingleRecordInVisitDB("overall_notes", [visit_id, document.getElementById('movement_notes').value]);
    }
    else if (movement_number == 1) {
        //console.log("save 1");
        document.getElementById(the_id+"_pre_l").innerText = document.getElementById('left_pre').innerText;
        document.getElementById(the_id+"_post_l").innerText = document.getElementById('left_post').innerText;
        document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
        document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;
        document.getElementById(the_id+"_pre_r").innerText = document.getElementById('right_pre').innerText;
        document.getElementById(the_id+"_post_r").innerText = document.getElementById('right_post').innerText;

        updateSingleRecordInVisitDB("m01_pre", [visit_id, document.getElementById('left_pre').innerText]);
        updateSingleRecordInVisitDB("m01_post", [visit_id, document.getElementById('left_post').innerText]);
        updateSingleRecordInVisitDB("m01a_pre", [visit_id, document.getElementById('middle_pre').innerText]);
        updateSingleRecordInVisitDB("m01a_post", [visit_id, document.getElementById('middle_post').innerText]);
        updateSingleRecordInVisitDB("m01b_pre", [visit_id, document.getElementById('right_pre').innerText]);
        updateSingleRecordInVisitDB("m01b_post", [visit_id, document.getElementById('right_post').innerText]);
        updateSingleRecordInVisitDB("m01_notes", [visit_id, document.getElementById('movement_notes').value]);
    }
    else if (movement_number == 2 || movement_number == 27 || movement_number == 28) {
        //console.log("save 2/27/28");
        document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
        document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;
      
        updateSingleRecordInVisitDB("m" + movement_number + "_pre", [visit_id, document.getElementById('middle_pre').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "_post", [visit_id, document.getElementById('middle_post').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "_notes", [visit_id, document.getElementById('movement_notes').value]);
    }
    else {
        //console.log("save 3-26/29-30");
        document.getElementById(the_id+"_pre_l").innerText = document.getElementById('left_pre').innerText;
        document.getElementById(the_id+"_post_l").innerText = document.getElementById('left_post').innerText;
        document.getElementById(the_id+"_pre_r").innerText = document.getElementById('right_pre').innerText;
        document.getElementById(the_id+"_post_r").innerText = document.getElementById('right_post').innerText;
      
        updateSingleRecordInVisitDB("m" + movement_number + "l_pre", [visit_id, document.getElementById('left_pre').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "l_post", [visit_id, document.getElementById('left_post').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "r_pre", [visit_id, document.getElementById('right_pre').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "r_post", [visit_id, document.getElementById('right_post').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "_notes", [visit_id, document.getElementById('movement_notes').value]);
    }
}


function saveNotesMovementDialogInfo(movement_number, visit_id, the_id) {
    //console.log("save notes begin: mn / vi / ti = " + movement_number + " " + visit_id + " " + the_id);
    if (movement_number == 0) {
        a_pre = document.getElementById('notes_middle_pre').innerText;
        a_post = document.getElementById('notes_middle_post').innerText;
        notes = document.getElementById('notes_movement_notes').value;
        document.getElementById(the_id+"_pre_m").innerText = a_pre;
        document.getElementById(the_id+"_post_m").innerText = a_post;
        document.getElementById("notes_index_00").innerText = a_pre + "/" + a_post;
        document.getElementById("notes_holder_00").innerText = notes;
        updateSingleRecordInVisitDB("overall_pre", [visit_id, a_pre]);
        updateSingleRecordInVisitDB("overall_post", [visit_id, a_post]);
        updateSingleRecordInVisitDB("overall_notes", [visit_id, notes]);

    }
    else if (movement_number == 1) {
        a_pre = document.getElementById('notes_left_pre').innerText;
        a_post = document.getElementById('notes_left_post').innerText;
        b_pre = document.getElementById('notes_middle_pre').innerText;
        b_post = document.getElementById('notes_middle_post').innerText;
        c_pre = document.getElementById('notes_right_pre').innerText;
        c_post = document.getElementById('notes_right_post').innerText;
        notes = document.getElementById('notes_movement_notes').value;
        document.getElementById("notes_index_" + movement_number).innerText = a_pre + "/" + a_post + " " + b_pre + "/" + b_post + " " + c_pre + "/" + c_post;
        document.getElementById("notes_holder_" + movement_number).innerText = notes;
        //var data = new Array(visit_id, document.getElementById('notes_left_pre').innerText);
        updateSingleRecordInVisitDB("m01_pre", [visit_id, document.getElementById('notes_left_pre').innerText]);
        updateSingleRecordInVisitDB("m01_post", [visit_id, document.getElementById('notes_left_post').innerText]);
        updateSingleRecordInVisitDB("m01a_pre", [visit_id, document.getElementById('notes_middle_pre').innerText]);
        updateSingleRecordInVisitDB("m01a_post", [visit_id, document.getElementById('notes_middle_post').innerText]);
        updateSingleRecordInVisitDB("m01b_pre", [visit_id, document.getElementById('notes_right_pre').innerText]);
        updateSingleRecordInVisitDB("m01b_post", [visit_id, document.getElementById('notes_right_post').innerText]);
        updateSingleRecordInVisitDB("m01_notes", [visit_id, document.getElementById('notes_movement_notes').value]);
    }
    else if (movement_number == 2 || movement_number == 27 || movement_number == 28) {
        a_pre = document.getElementById('notes_middle_pre').innerText;
        a_post = document.getElementById('notes_middle_post').innerText;
        notes = document.getElementById('notes_movement_notes').value;
        document.getElementById("notes_index_" + movement_number).innerText = a_pre + "/" + a_post;
        document.getElementById("notes_holder_" + movement_number).innerText = notes;
        updateSingleRecordInVisitDB("m" + movement_number + "_pre", [visit_id, document.getElementById('notes_middle_pre').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "_post", [visit_id, document.getElementById('notes_middle_post').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "_notes", [visit_id, document.getElementById('notes_movement_notes').value]);
      
    }
    else {
        a_pre = document.getElementById('notes_left_pre').innerText;
        a_post = document.getElementById('notes_left_post').innerText;
        b_pre = document.getElementById('notes_right_pre').innerText;
        b_post = document.getElementById('notes_right_post').innerText;
        notes = document.getElementById('notes_movement_notes').value;
        document.getElementById("notes_index_" + movement_number).innerText = a_pre + "/" + a_post + " " + b_pre + "/" + b_post;
        document.getElementById("notes_holder_" + movement_number).innerText = notes;
      
        updateSingleRecordInVisitDB("m" + movement_number + "l_pre", [visit_id, document.getElementById('notes_left_pre').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "l_post", [visit_id, document.getElementById('notes_left_post').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "r_pre", [visit_id, document.getElementById('notes_right_pre').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "r_post", [visit_id, document.getElementById('notes_right_post').innerText]);
        updateSingleRecordInVisitDB("m" + movement_number + "_notes", [visit_id, document.getElementById('notes_movement_notes').value]);
    }
    //console.log("end of save notes");
}