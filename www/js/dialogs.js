var patient_data_array;


function popUpMainDialog() {
    console.log("popUpMainDialog() start");
    $(".patient_frontpage_subheader").hide();
    $("#subheader1").show();
    $("#subheader1").css("background-color", "#9f9a79");
    $("#subheader1").css("color", "#ffffff");
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").hide();
    $("#new_patient_button").show();
    $("#existing_patient_button").show();
    $("#options_button").show();
}

function popUpNewPatientDialog(calling_page) { // 0 = index.html ; 1 = sheet.html <----obsolete now w/ diff bet divs and dialogs
    
    $('.patient_frontpage_middle_button').hide();
    $('.patient_frontpage_middle_dialog').show();
    $('#pvl_container2').load('new_patient.html', function() {});
    $('.dialog_header').html("Enter the new patient's information.");
    
    $(".patient_frontpage_subheader").css("background-color", "#504d3b");
    //$(".patient_frontpage_subheader").html("<a href='javascript: popUpMainDialog();' style='text-decoration:none; color: #9f9a79'>Main > </a>First-Time Patient");

    $("#subheader2_1").show();
    $("#subheader2_2").hide();
    $("#subheader2_3").hide();
    
    $(".image_fieldset").live("touchend", function(event) {

        // navigator.camera.getPicture( cameraSuccess, cameraError, [ cameraOptions ] );
        navigator.camera.getPicture(getPhoto, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI, // // Return image file URI
            sourceType:Camera.PictureSourceType.CAMERA,
            targetWidth:160,  // Width in pixels to scale image. Aspect ratio is maintained. Required targetHeight.
            targetHeight:200  // Height in pixels to scale image. Aspect ratio is maintained. Required targetWidth.
        });
        
        /* navigator.camera.getPicture success function */
        function getPhoto(imageData)
        {
            var cameraImage = document.getElementById('image_fieldset');
            cameraImage.innerHTML = "<img id=\"patient_image\" src=\"" + imageData + "\">";
            //cameraImage.src = imageData;
            console.log("getPhoto() - cameraImage.src: " + imageData);
        }
        /* navigator.camera.getPicture fail function */
        function onFail(message)
        {
            alert('Failed because: ' + message);
        }
            
    });
    
    $("#new_patient_continue_button").live("touchend", function(event) {
        
        //DATE PARSER
        var raw_date = document.getElementById('dob').value;
        fixed_date = dateParser(raw_date);
        
        if (calling_page == 0) {
            var id;
            //blank values inserted by me to fill roles of phone and disorder, which were deleted
            var dataString = document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + fixed_date + ":::" + getSex() + ":::" + "0" + ":::" + document.getElementById('email').value + ":::" + "" + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value + ":::" + document.getElementById('patient_image').src;
            id = writePatientToDb(dataString);
            dataString = "0000000000000" + ":::" + id + ":::" + dataString;
            window.name = dataString;
        }
        else {
            var data_array = window.name.split(":::");
            var visit_id = data_array[0];
            var patient_id = data_array[1];
            console.log(data_array);
            
            var dataString = visit_id + ":::" + patient_id + ":::" + document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + fixed_date + ":::" + getSex() + ":::" + "0" + ":::" + document.getElementById('email').value + ":::" + "" + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value + ":::" + document.getElementById('patient_image').src;
            data_array = dataString.split(":::");
            window.name = dataString;
            updateRecordInPatientDB(data_array);
        }

        setTimeout(function(){window.location="sheet.html";}, 250);
    });
    
    $("#new_patient_back_button").live("touchend", function(event) {
        //does nothing right now but return to main menu
        //setTimeout(function(){popUpMainDialog();}, 500);
        setTimeout(function(){window.location = 'index.html';}, 500);
    });
    
    //Prevents scrolling on click of input box
    $(document).scroll(function(){
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
    });
    
}



function popUpExistingPatientDialog() {
    	
    console.log("popUpExistingPatientDialog() start");

    $(".patient_frontpage_subheader").css("background-color", "#504d3b");
    $(".patient_frontpage_subheader").css("color", "#ffffff");
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").show();
    $("#subheader2_1").hide();
    $("#subheader2_2").show();
    $("#subheader2_3").hide();
    
    $('.dialog_header').html("Select the patient who is visiting you today.");

    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	    	//alert("db select 2");
			tx.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler3, errorHandler3 );
			//setTimeout(function() { return patientDataArray[0];  }, 1000);	
		}
	);
    
    //setTimeout(function() { patient_db.close(function(){console.log('Close PatientListDialog db success.');}, function(e){console.log("Close PatientListDialog db error: " + e);}); console.log("closed db");  }, 1000);
    
    function errorHandler3(transaction, error) {
        console.log('popUpExistingPatientDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
    }
    

	function patientDataSelectHandler3(transaction, results) {
		//console.log("popUpExistingPatientDialog(): " + results.rows.length + " rows");
		var i;  
		for (i=0; i < results.rows.length; i++) {
			row = results.rows.item(i);
			patientDataArray[i] = Array();
			//patientDataArray[i][0] = row['id'];
			patientDataArray[i][0] = row['lastname'];
			patientDataArray[i][1] = row['firstname'];
			patientDataArray[i][2] = row['dob'];
			patientDataArray[i][3] = row['sex'] + row['id'];
		} 
        
        if (results.rows.length != patientDataArray.length) {
            patientDataArray.pop();
        }
					   
		$('#pvl_container2').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="existing_patient_table"></table>' );
	    $('#existing_patient_table').dataTable( {
	        "aaData": patientDataArray,
	        "aoColumns": [
	            { "sTitle": "Last", "sClass": "center", "bSortable": false },
	            { "sTitle": "First", "sClass": "center","bSortable": false },
	            { "sTitle": "DOB", "sClass": "center", "bSortable": false },
	            { "sTitle": "Sex", "sClass": "center", "bSortable": false, "fnRender": function(obj) {
					var sReturn = obj.aData[ obj.iDataColumn ];
                    var patient_id = sReturn.substr(1, 10);
                    var sex = sReturn.substr(0,1);
                    //patient_id_int = parseInt(patient_id, 10);
                    sReturn = "<div id='" + patient_id + "'>" + sex + "</div>";
					return sReturn;
                    }
                }
	        ],
            "bLengthChange": false
        });
	}
}



function popUpOptionsDialog() {
    console.log("popUpOptionsDialog() start");
    $('.patient_frontpage_subheader').css("background-color", "#504d3b");
    //$(".patient_frontpage_subheader").empty().append("<a href='#1' class='link' id='2-1' style='text-decoration:none; color: #9f9a79'>Main > </a>Options");
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").hide();
    $("#subheader2_1").hide();
    $("#subheader2_2").hide();
    $("#subheader2_3").show();
    
    $("#options_priorvisit_button").show();
    $("#options_db_button").show();
    $("#options_language_button").show();
}



function popUpPriorVisitPatientDialog() {
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").show();
    //$(".patient_frontpage_subheader").html("<a href='javascript: popUpMainDialog();' style='text-decoration:none; color: #9f9a79'>Main > </a><a href='javascript: popUpOptionsDialog();' style='text-decoration:none; color: #9f9a79'>Options > </a>Prior Visit");
    $("#subheader3_1").show();
    $("#subheader3_2").hide();
    $("#subheader3_3").hide();
    $("#subheader3_4").hide();
    
    $('.dialog_header').html("Select the patient whose visit you wish to view.");

    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
    
	patient_db.transaction(
	    function (tx) {
			tx.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler7, errorHandler7);	
		}
	);
 
    function errorHandler7(transaction, error) {
        console.log('popUpPriorVisitPatientDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
    }
    
	function patientDataSelectHandler7(transaction, results) {
		//alert ("dataselecthandler: " + results.rows.length + " rows");  
		var i;  
		for (i=0; i < results.rows.length; i++) {
			row = results.rows.item(i);
			patientDataArray[i] = Array();
			//patientDataArray[i][0] = row['id'];
			patientDataArray[i][0] = row['lastname'];
			patientDataArray[i][1] = row['firstname'];
			patientDataArray[i][2] = row['dob'];
			patientDataArray[i][3] = row['sex'] + row['id'];
		}
        
		$('#pvl_container3').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="prior_visit_patient_table"></table>' );
	    $('#prior_visit_patient_table').dataTable( {
	        "aaData": patientDataArray,
	        "aoColumns": [
	        	//{ "sTitle": "ID"},
	            { "sTitle": "Last", "sClass": "center" },
	            { "sTitle": "First", "sClass": "center" },
	            { "sTitle": "DOB", "sClass": "center" },
	            { "sTitle": "Sex", "sClass": "center", "fnRender": function(obj) {
					var sReturn = obj.aData[ obj.iDataColumn ];
                    var patient_id = sReturn.substr(1, 10);
                    var sex = sReturn.substr(0,1);
                    //patient_id_int = parseInt(patient_id, 10);
                    sReturn = "<div id='" + patient_id + "'>" + sex + "</div>";
					return sReturn;
				} }
	        ],
            "bLengthChange": false,
            "bAutoWidth": false,
            "aoColumnDefs": [
                { 'bSortable': false, 'aTargets': ['_all'] }
            ]
        });
	}
}


// THIS IS THE LIST OF VISITS SHOWN WHEN "VIEW PRIOR VISIT' (ABOVE FUNCTION) IS CLICKED AND THE PATIENT HAS BEEN SELECTED
function popUpPriorVisitDialog(patient_id, patient_name) {

    //console.log("patient_id: " + patient_id + " patient_name: " + patient_name);

    $('.dialog_header').html("Choose a visit to view for " + patient_name + ".");
    $("#subheader3_1").hide();
    $("#subheader3_2").hide();
    $("#subheader3_3").hide();
    $("#subheader3_4").show();


    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	visit_db.transaction(
	    function (tx) {
			tx.executeSql("SELECT * FROM visits WHERE patient_id=?;", [patient_id], patientDataSelectHandler9, errorHandler9);
		}
	);

    function errorHandler9(transaction, error) {
        console.log('popUpPriorVisitDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
    }
    
    function patientDataSelectHandler9(transaction, results) {
        //console.log("FINAL dataselecthandler: " + results.rows.length + " rows");
        patientVisitDataArray2 = new Array(results.rows.length);
        var i;
        for (i=0; i < results.rows.length; i++) {
            row = results.rows.item(i);
            patientVisitDataArray2[i] = new Array(3);
            patientVisitDataArray2[i][0] = row['id'];
            patientVisitDataArray2[i][1] = getMDYDate(row['date']);
            patientVisitDataArray2[i][2] = getTimeFromDate(row['date'])+row['id'];
            //console.log(patientVisitDataArray2[i]);
        }

        //console.log("results.rows.length = " + results.rows.length + " patientVisitDataArray/length = " + patientVisitDataArray2.length);
        if (results.rows.length != patientVisitDataArray2.length) {
            patientVisitDataArray2.pop();
        }
        
        $('#pvl_container3').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="prior_visit_table"></table>' );
        $('#prior_visit_table').dataTable( {
            "aaData": patientVisitDataArray2,
            "aoColumns": [
                { "sTitle": "Visit ID", "bSearchable": false, "bVisible": false },
                { "sTitle": "Date", "sClass": "center", "sWidth": "50%"  },
                { "sTitle": "Time", "sClass": "center", "sWidth": "50%", "fnRender": function(obj) {
					var sReturn = obj.aData[ obj.iDataColumn ];
                    var visit_id = sReturn.substr(5, 13);
                    var time = sReturn.substr(0,5);
                    //patient_id_int = parseInt(patient_id, 10);
                    sReturn = "<div id='" + visit_id + "'>" + time + "</div>";
					return sReturn; }
				}
            ],
            "bLengthChange": false,
            "bAutoWidth": false,
            "aoColumnDefs": [
                { 'bSortable': false, 'aTargets': ['_all'] }
            ],
            "oLanguage": {
                "sInfo": "Displaying Visits _START_ of _END_ (_TOTAL_ Total)"
            }
        });
	}
    //getPatientName();
    
}



function popUpDBDialog() {
    console.log("popUpDBDialog() start");
    $(".patient_frontpage_subheader").css("background-color", "#504d3b");
    //$(".patient_frontpage_subheader").css("color", "#9f9a79");
    //$(".patient_frontpage_subheader").css("font-size", "56px");
    //$(".patient_frontpage_subheader").html("<a href='#1' class='link' id='3-1' style='text-decoration:none; color: #9f9a79'>Main > </a><a href='#2' class='link' id='3-2' style='text-decoration:none; color: #9f9a79'>Options > </a>DB");
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").hide();
    $("#options_db_deletepatient_button").show();
    $("#options_db_deletevisit_button").show();
    $("#subheader3_1").hide();
    $("#subheader3_2").show();
    $("#subheader3_3").hide();
    $("#subheader3_4").hide();
}


function popUpDeletePatientDialog() {

    $(".patient_frontpage_subheader").css("background-color", "#504d3b");
    //$(".patient_frontpage_subheader").css("color", "#9f9a79");
    //$(".patient_frontpage_subheader").css("font-size", "56px");
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").show();
    //$(".patient_frontpage_subheader").html("<a href='javascript: popUpMainDialog();' style='text-decoration:none; color: #9f9a79'>Main > </a><a href='javascript: popUpOptionsDialog();' style='text-decoration:none; color: #9f9a79'>Options > </a><a href='javascript: popUpDBDialog();' style='text-decoration:none; color: #9f9a79'>DB > </a>Delete");
    $('.dialog_header').html("Select the patient you wish to delete.");
    $("#subheader4_1").show();
    $("#subheader4_2").hide();
    $("#subheader4_3").hide();

    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	    	console.log("popUpDeletePatientDialog() - SELECT * FROM patients (dialogs.js)");
			tx.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler38, errorHandler38);
			//setTimeout(function() { return patientDataArray[0];  }, 1000);	
		}
	);	


    function errorHandler38(transaction, error) {
        console.log('popUpPDeletePatientDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
    }

	function patientDataSelectHandler38(transaction, results) {
		//alert ("dataselecthandler: " + results.rows.length + " rows");
        
		var i;  
		for (i=0; i < results.rows.length; i++) {
            row = results.rows.item(i);
            patientDataArray[i] = new Array();
            //patientDataArray[i][0] = row['id'];
            patientDataArray[i][0] = row['lastname'];
            patientDataArray[i][1] = row['firstname'];
            patientDataArray[i][2] = row['dob'];
            patientDataArray[i][3] = row['sex'] + row['id'];
		}
        
        if (results.rows.length != patientDataArray.length) {
            patientDataArray.pop();
        }

        //console.log("results length = " + results.rows.length + " patientDataArray length = " + patientDataArray.length);


					   
		$('#pvl_container4').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="delete_patient_table"></table>' );
	    $('#delete_patient_table').dataTable( {
	        "aaData": patientDataArray,
	        "aoColumns": [
	        	//{ "sTitle": "ID" },
	            { "sTitle": "Last", "sClass": "center" },
	            { "sTitle": "First", "sClass": "center" },
	            { "sTitle": "DOB", "sClass": "center" },
	            { "sTitle": "Sex", "sClass": "center", "fnRender": function(obj) {
					var sReturn = obj.aData[ obj.iDataColumn ];
                    var patient_id = sReturn.substr(1, 10);
                    var sex = sReturn.substr(0,1);
                    //patient_id_int = parseInt(patient_id, 10);
                    sReturn = "<div id='" + patient_id + "'>" + sex + "</div>";
					return sReturn;
				} }
	        ],
            "bLengthChange": false,
            "aoColumnDefs": [
                { 'bSortable': false, 'aTargets': ['_all'] }
            ]
        });
        
        $('#delete_patient_table').dataTable().fnClearTable();
        $('#delete_patient_table').dataTable().fnAddData(patientDataArray);
        
	}
    console.log("close patient_db");
    patient_db.close();
}




function popUpDeleteVisitPatientDialog() {
    
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").show();
    //$(".patient_frontpage_subheader").html("<a href='javascript: popUpMainDialog();' style='text-decoration:none; color: #9f9a79'>Main > </a><a href='javascript: popUpOptionsDialog();' style='text-decoration:none; color: #9f9a79'>Options > </a><a href='javascript: popUpDBDialog();' style='text-decoration:none; color: #9f9a79'>DB > </a>Delete");
    $("#subheader4_1").hide();
    $("#subheader4_2").show();
    $("#subheader4_3").hide();
    
    $('.dialog_header').html("Select the patient whose visit you wish to delete.");

    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	var patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
			tx.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler75, errorHandler75);
		}
	);	

    function errorHandler75(transaction, error) {
        console.log('popUpDeleteVisitPatientDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
    }
    
	function patientDataSelectHandler75(transaction, results) {
		//alert ("dataselecthandler: " + results.rows.length + " rows");  
		var i;  
		for (i=0; i < results.rows.length; i++) {
			row = results.rows.item(i);
			patientDataArray[i] = Array();
			//patientDataArray[i][0] = row['id'];
			patientDataArray[i][0] = row['lastname'];
			patientDataArray[i][1] = row['firstname'];
			patientDataArray[i][2] = row['dob'];
			patientDataArray[i][3] = row['sex'] + row['id'];
		} 
					    
		$('#pvl_container4').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="delete_visit_patient_table"></table>' );
	    $('#delete_visit_patient_table').dataTable( {
	        "aaData": patientDataArray,
	        "aoColumns": [
	        	//{ "sTitle": "ID"},
	            { "sTitle": "Last", "sClass": "center" },
	            { "sTitle": "First", "sClass": "center" },
	            { "sTitle": "DOB", "sClass": "center" },
	            { "sTitle": "Sex", "sClass": "center", "fnRender": function(obj) {
					var sReturn = obj.aData[ obj.iDataColumn ];
                    var patient_id = sReturn.substr(1, 10);
                    var sex = sReturn.substr(0,1);
                    //patient_id_int = parseInt(patient_id, 10);
                    sReturn = "<div id='" + patient_id + "'>" + sex + "</div>";
					return sReturn;
				} }
	        ],
            "bLengthChange": false
        });
	}
}



function popUpDeleteVisitDialog(patient_id, patient_name) {

    //console.log("popUpDeleteVisitDialog patient_id: " + patient_id + " patient_name: " + patient_name);

    $('.dialog_header').html("Choose a visit to delete for " + patient_name + ".");
    $("#subheader4_1").hide();
    $("#subheader4_2").hide();
    $("#subheader4_3").show();

    var patientVisitDataArray2 = Array();
    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	visit_db.transaction(
	    function (tx) {
			tx.executeSql("SELECT * FROM visits WHERE patient_id=?;", [patient_id], patientDataSelectHandler93, errorHandler93);
		}
	);	


    function errorHandler93(transaction, error) {
        console.log('popUpPriorVisitDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
    }
    
    function patientDataSelectHandler93(transaction, results) {
        //console.log(patientVisitDataArray2.length);
        //patientVisitDataArray2 = new Array();
        var i;
        for (i=0; i < results.rows.length; i++) {
            row = results.rows.item(i);
            patientVisitDataArray2[i] = new Array(3);
            patientVisitDataArray2[i][0] = row['id'];
            //console.log(row['date']);
            var the_date = row['date'];
            
            patientVisitDataArray2[i][1] = getMDYDate(the_date);
            //console.log(getMDYDate(row['date']);
            patientVisitDataArray2[i][2] = getTimeFromDate(row['date'])+row['id'];
            //patientVisitDataArray2[i][2] = patient_id;
            
        }

        //console.log("results.rows.length = " + results.rows.length + " patientVisitDataArray2.length = " + patientVisitDataArray2.length);
        if (results.rows.length != patientVisitDataArray2.length) {
            patientVisitDataArray2.pop();
        }

					   
        $('#pvl_container4').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="delete_visit_table"></table>' );
        $('#delete_visit_table').dataTable( {
            "aaData": patientVisitDataArray2,
            "aoColumns": [
                { "sTitle": "Visit ID", "bSearchable": false, "bVisible": false, "sWidth":"0%" },
                { "sTitle": "Date", "sClass": "center", "sWidth": "50%", "fnRender": function(obj) {
					var sReturn = obj.aData[ obj.iDataColumn ];
                    //var visit_id = sReturn.substr(5, 13);
                    //var time = sReturn.substr(0,5);
                    //patient_id_int = parseInt(patient_id, 10);
                    //sReturn = "<div id='" + visit_id + "'>" + time + "</div>";
					sReturn = "<div id='" + patient_id + "'>" + sReturn + "</div>";
                    return sReturn; }
				},
                { "sTitle": "Time", "sClass": "center", "sWidth": "50%", "fnRender": function(obj) {
					var sReturn = obj.aData[ obj.iDataColumn ];
                    var visit_id = sReturn.substr(5, 13);
                    var time = sReturn.substr(0,5);
                    //patient_id_int = parseInt(patient_id, 10);
                    sReturn = "<div id='" + visit_id + "'>" + time + "</div>";
					return sReturn; }
				}
            ],
            "bLengthChange": false,
            "bAutoWidth": false,
            "oLanguage": {
                "sInfo": "Displaying Visits _START_ of _END_ (_TOTAL_ Total)"
            },
            "aoColumnDefs": [
                { 'bSortable': false, 'aTargets': ['_all'] }
            ]
        });
	}
    //getPatientName();
    
}




function popUpLanguageDialog() {
    $(".patient_frontpage_subheader").css("background-color", "#504d3b");
    //$(".patient_frontpage_subheader").css("color", "#9f9a79");
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").hide();
    $("#options_language_english_button").show();
    $("#subheader3_1").hide();
    $("#subheader3_2").hide();
    $("#subheader3_3").show();
    $("#subheader3_4").hide();
}



function popUpMovementDialog(the_class, the_id, visit_id) {
    
    $("#new_movement_dialog").dialog({
        modal: true,
        height: 550,
        width: 634,
        autoOpen: false,
        resizable: false,
        buttons: [{
            text: "OK", 
            id: "btnOk",
            click: function () {
                //okCallback();
                var movement_number = the_id.substr(1);    		
                
                if (movement_number == 0) {
                    document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
                    document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;

                    updateSingleRecordInVisitDB("overall_pre", [visit_id, document.getElementById('middle_pre').innerText]);
                    updateSingleRecordInVisitDB("overall_post", [visit_id, document.getElementById('middle_post').innerText]);
                    updateSingleRecordInVisitDB("overall_notes", [visit_id, document.getElementById('movement_notes').value]);

                }
                else if (movement_number == 1) {
                    document.getElementById(the_id+"_pre_l").innerText = document.getElementById('left_pre').innerText;
                    document.getElementById(the_id+"_post_l").innerText = document.getElementById('left_post').innerText;
                    document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
                    document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;
                    document.getElementById(the_id+"_pre_r").innerText = document.getElementById('right_pre').innerText;
                    document.getElementById(the_id+"_post_r").innerText = document.getElementById('right_post').innerText;
                  
                    //var data = new Array(visit_id, document.getElementById('left_pre').innerText);
                    updateSingleRecordInVisitDB("m01_pre", [visit_id, document.getElementById('left_pre').innerText]);
                    updateSingleRecordInVisitDB("m01_post", [visit_id, document.getElementById('left_post').innerText]);
                    updateSingleRecordInVisitDB("m01a_pre", [visit_id, document.getElementById('middle_pre').innerText]);
                    updateSingleRecordInVisitDB("m01a_post", [visit_id, document.getElementById('middle_post').innerText]);
                    updateSingleRecordInVisitDB("m01b_pre", [visit_id, document.getElementById('right_pre').innerText]);
                    updateSingleRecordInVisitDB("m01b_post", [visit_id, document.getElementById('right_post').innerText]);
                    updateSingleRecordInVisitDB("m01_notes", [visit_id, document.getElementById('movement_notes').value]);
                }
                else if (movement_number == 2 || movement_number == 27 || movement_number == 28) {
                    document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
                    document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;
                  
                    updateSingleRecordInVisitDB("m" + movement_number + "_pre", [visit_id, document.getElementById('middle_pre').innerText]);
                    updateSingleRecordInVisitDB("m" + movement_number + "_post", [visit_id, document.getElementById('middle_post').innerText]);
                    updateSingleRecordInVisitDB("m" + movement_number + "_notes", [visit_id, document.getElementById('movement_notes').value]);
                  
                }
                else {
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
                
                $(this).dialog('destroy');
            }, }, {
            text: "Cancel",
            click: function () {
                //cancelCallback();
                //document.getElementById('textinput').value="";
                $(this).dialog('close');
            },
        }]
     });
     
     $("#new_movement_dialog").dialog('open');
     
     $('.ui-dialog').css("top","130px"); //keeps dialog at top of screen to avoid keyboard
     $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
     
     //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
     $('.ui-widget-header').hide(); //completely hides title bar
     $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div with class ui-dialog
     $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?

    $('.ui-dialog :button').css("background-color", "#504d3b");
    $('.ui-dialog :button').css("color", "#9f9a79");


    //the_id contains a string like "q04" which would refer to movement 4
    var movement_number = the_id.substr(1);
    movement_number_int = parseInt(movement_number, 10);
    console.log("Clicked on movement number: " + movement_number);
    
    document.getElementById('movement_dialog_image').innerHTML = "<img src=\"images/" + movement_number + "_big.png\">";
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

    var mousedowntime;
    var presstime;
    $(".movement-rating_pre_box_two_wide, .movement-rating_pre_box_three_wide, .movement-rating_pre_box_single, .movement-rating_post_box_two_wide, .movement-rating_post_box_three_wide, .movement-rating_post_box_single").bind("touchstart", function() {
        var d = new Date();
        mousedowntime = d.getTime();
    });
    
    $(".movement-rating_pre_box_two_wide, .movement-rating_pre_box_three_wide, .movement-rating_pre_box_single, .movement-rating_post_box_two_wide, .movement-rating_post_box_three_wide, .movement-rating_post_box_single").bind("touchend", function() {
        var d = new Date();
        presstime = d.getTime() - mousedowntime;
        if (presstime < 350) {
            var old = this.innerText;
            var mod;
            
            if (old == "" || old == " ") {
                mod = 0;
            }
            else if (old == 10) {
                mod = " ";
            }
            else {
                old++; 
                mod = old % 11;
            }
                
            this.innerText = mod;
        }
        else {
            var old = this.innerText; 
            var mod;
            if (old == "" || old == " " || old == null) {
                mod = "10";
            } 
            else if (old == 0) {
                mod = " ";
            }
            else {
                old--;
                mod = old % 11;
            }
            
            this.innerText = mod;
        }
    });
     
}
    
    
function popUpPointDialog(the_class, the_id) {
      
    $("#new_point_dialog").dialog({
        modal: true,
        height: 600,
        width: 634,
        autoOpen: false,
        resizable: false
    });
      
    $("#new_point_dialog").dialog('open');
    
    $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
    $('.ui-dialog').css("top","150px"); //keeps dialog at top of screen to avoid keyboard
      
    //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
    $('.ui-widget-header').hide(); //completely hides title bar
    $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div with class ui-dialog
    $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?
    
    
    document.getElementById('point_dialog_header').innerHTML = "Location of " + the_id.substr(0,2) + " and " + the_id.substr(3,2) + " points";
    document.getElementById('point_dialog_image').innerHTML = "<img src=\"images/" + the_id + ".png\">";

    
    $("#new_point_dialog").click(function(event) {
         $("#new_point_dialog").dialog('close');
    });
    
}


function popUpMovementDialogFromNotes(the_class, the_id, visit_id) { //This can be combined with the other Movement dialog at some point with some small changes
    
    $("#new_movement_dialog").dialog({
        modal: true,
        height: 550,
        width: 634,
        autoOpen: false,
        resizable: false,
        buttons: [{
            text: "OK", 
            id: "btnOk",
            click: function () {
                //okCallback();
                var movement_number = the_id.substr(1);    		
                
                if (movement_number == 0) {
                    /*document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
                    document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;*/

                    updateSingleRecordInVisitDB("overall_pre", [visit_id, document.getElementById('middle_pre').innerText]);
                    updateSingleRecordInVisitDB("overall_post", [visit_id, document.getElementById('middle_post').innerText]);
                    updateSingleRecordInVisitDB("overall_notes", [visit_id, document.getElementById('movement_notes').value]);

                }
                else if (movement_number == 1) {
                    /*document.getElementById(the_id+"_pre_l").innerText = document.getElementById('left_pre').innerText;
                    document.getElementById(the_id+"_post_l").innerText = document.getElementById('left_post').innerText;
                    document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
                    document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;
                    document.getElementById(the_id+"_pre_r").innerText = document.getElementById('right_pre').innerText;
                    document.getElementById(the_id+"_post_r").innerText = document.getElementById('right_post').innerText;*/
                  
                    //var data = new Array(visit_id, document.getElementById('left_pre').innerText);
                    updateSingleRecordInVisitDB("m01_pre", [visit_id, document.getElementById('left_pre').innerText]);
                    updateSingleRecordInVisitDB("m01_post", [visit_id, document.getElementById('left_post').innerText]);
                    updateSingleRecordInVisitDB("m01a_pre", [visit_id, document.getElementById('middle_pre').innerText]);
                    updateSingleRecordInVisitDB("m01a_post", [visit_id, document.getElementById('middle_post').innerText]);
                    updateSingleRecordInVisitDB("m01b_pre", [visit_id, document.getElementById('right_pre').innerText]);
                    updateSingleRecordInVisitDB("m01b_post", [visit_id, document.getElementById('right_post').innerText]);
                    updateSingleRecordInVisitDB("m01_notes", [visit_id, document.getElementById('movement_notes').value]);
                }
                else if (movement_number == 2 || movement_number == 27 || movement_number == 28) {
                    /*document.getElementById(the_id+"_pre_m").innerText = document.getElementById('middle_pre').innerText;
                    document.getElementById(the_id+"_post_m").innerText = document.getElementById('middle_post').innerText;*/
                  
                    updateSingleRecordInVisitDB("m" + movement_number + "_pre", [visit_id, document.getElementById('middle_pre').innerText]);
                    updateSingleRecordInVisitDB("m" + movement_number + "_post", [visit_id, document.getElementById('middle_post').innerText]);
                    updateSingleRecordInVisitDB("m" + movement_number + "_notes", [visit_id, document.getElementById('movement_notes').value]);
                  
                }
                else {
                    /*document.getElementById(the_id+"_pre_l").innerText = document.getElementById('left_pre').innerText;
                    document.getElementById(the_id+"_post_l").innerText = document.getElementById('left_post').innerText;
                    document.getElementById(the_id+"_pre_r").innerText = document.getElementById('right_pre').innerText;
                    document.getElementById(the_id+"_post_r").innerText = document.getElementById('right_post').innerText;*/
                  
                    updateSingleRecordInVisitDB("m" + movement_number + "l_pre", [visit_id, document.getElementById('left_pre').innerText]);
                    updateSingleRecordInVisitDB("m" + movement_number + "l_post", [visit_id, document.getElementById('left_post').innerText]);
                    updateSingleRecordInVisitDB("m" + movement_number + "r_pre", [visit_id, document.getElementById('right_pre').innerText]);
                    updateSingleRecordInVisitDB("m" + movement_number + "r_post", [visit_id, document.getElementById('right_post').innerText]);
                    updateSingleRecordInVisitDB("m" + movement_number + "_notes", [visit_id, document.getElementById('movement_notes').value]);
                  
                  
                }
                
                outputNotes(visit_id);
                outputOverallPostPreToScreen(visit_id)                     		
                
                $(this).dialog('destroy');
            }, }, {
            text: "Cancel",
            click: function () {
                //cancelCallback();
                //document.getElementById('textinput').value="";
                $(this).dialog('close');
            },
        }]
     });
     
     $("#new_movement_dialog").dialog('open');
     
     $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
     $('.ui-dialog').css("top","50px"); //keeps dialog at top of screen to avoid keyboard
     
     //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
     $('.ui-widget-header').hide(); //completely hides title bar
     $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div with class ui-dialog
     $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?

    //the_id contains a string like "q04" which would refer to movement 4
    var movement_number = the_id.substr(1);
    movement_number_int = parseInt(movement_number, 10);
    console.log("Clicked on movement number: " + movement_number);
    
    document.getElementById('movement_dialog_image').innerHTML = "<img src=\"images/" + movement_number + "_big.png\">";
    document.getElementById('movement_dialog_header').innerText = Movement_Descriptions[movement_number_int];

    //CREATE SCORE BOXES DYNAMICALLY
    if (movement_number_int == 0) {
        document.getElementById('movement_dialog_score_boxes').innerHTML = 
            "<div id=\"middle_pre\" class=\"movement-rating_pre_box_single\"></div>" + 
            "<div id=\"middle_post\" class=\"movement-rating_post_box_single\"></div>";
        
        num = padZeros(movement_number_int, 2);
        
        getSingleScore(visit_id, "overall_pre", "middle_pre");
        getSingleScore(visit_id, "overall_post", "middle_post");
                     
        getSingleNotes(visit_id, movement_number);           
                                
    }
    else if (movement_number_int == 1) {
        document.getElementById('movement_dialog_score_boxes').innerHTML = 
            "<div id=\"left_pre\" class=\"movement-rating_pre_box_three_wide\"></div>" + 
            "<div id=\"left_post\" class=\"movement-rating_post_box_three_wide\"></div>" + 
            "<div id=\"middle_pre\" class=\"movement-rating_pre_box_three_wide\"></div>" + 
            "<div id=\"middle_post\" class=\"movement-rating_post_box_three_wide\"></div>" + 
            "<div id=\"right_pre\" class=\"movement-rating_pre_box_three_wide\"></div>" + 					
            "<div id=\"right_post\" class=\"movement-rating_post_box_three_wide\"></div>";
        
        num = padZeros(movement_number_int, 2);
        //document.getElementById(the_id+"_pre_l").innerText
        getSingleScore(visit_id, "m" + num + "_pre", "left_pre");
        getSingleScore(visit_id, "m" + num + "_post", "left_post");
        getSingleScore(visit_id, "m" + num + "a_pre", "middle_pre");
        getSingleScore(visit_id, "m" + num + "a_post", "middle_post");
        getSingleScore(visit_id, "m" + num + "b_pre", "right_pre");
        getSingleScore(visit_id, "m" + num + "b_post", "right_post");
        
        getSingleNotes(visit_id, movement_number);
        
    }
    else if (movement_number_int == 2 || movement_number_int == 27 || movement_number_int == 28) {
        document.getElementById('movement_dialog_score_boxes').innerHTML = 
            "<div id=\"middle_pre\" class=\"movement-rating_pre_box_single\"></div>" + 
            "<div id=\"middle_post\" class=\"movement-rating_post_box_single\"></div>";
        
        num = padZeros(movement_number_int, 2);
        
        getSingleScore(visit_id, "m" + num + "_pre", "middle_pre");
        getSingleScore(visit_id, "m" + num + "_post", "middle_post");
                     
        getSingleNotes(visit_id, movement_number);           
                                
    }
    else {
        //console.log("here: " + getSingleScore(visit_id, "m03l_pre"));
        
        document.getElementById('movement_dialog_score_boxes').innerHTML = 
            "<div id=\"left_pre\" class=\"movement-rating_pre_box_two_wide\"></div>" + 
            "<div id=\"left_post\" class=\"movement-rating_post_box_two_wide\"></div>" + 
            "<div id=\"right_pre\" class=\"movement-rating_pre_box_two_wide\"></div>" + 
            "<div id=\"right_post\" class=\"movement-rating_post_box_two_wide\"></div>";

        num = padZeros(movement_number_int, 2);
        //document.getElementById(the_id+"_pre_l").innerText
        getSingleScore(visit_id, "m" + num + "l_pre", "left_pre");
        getSingleScore(visit_id, "m" + num + "l_post", "left_post");
        getSingleScore(visit_id, "m" + num + "r_pre", "right_pre");
        getSingleScore(visit_id, "m" + num + "r_post", "right_post");
                        
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

    var mousedowntime;
    var presstime;
    $(".movement-rating_pre_box_two_wide, .movement-rating_pre_box_three_wide, .movement-rating_pre_box_single, .movement-rating_post_box_two_wide, .movement-rating_post_box_three_wide, .movement-rating_post_box_single").bind("touchstart", function() {
        var d = new Date();
        mousedowntime = d.getTime();
    });
    
    $(".movement-rating_pre_box_two_wide, .movement-rating_pre_box_three_wide, .movement-rating_pre_box_single, .movement-rating_post_box_two_wide, .movement-rating_post_box_three_wide, .movement-rating_post_box_single").bind("touchend", function() {
        var d = new Date();
        presstime = d.getTime() - mousedowntime;
        if (presstime < 350) {
            var old = this.innerText;
            var mod;
            
            if (old == "" || old == " ") {
                mod = 0;
            }
            else if (old == 10) {
                mod = " ";
            }
            else {
                old++; 
                mod = old % 11;
            }
                
            this.innerText = mod;
        }
        else {
            var old = this.innerText; 
            var mod;
            if (old == "" || old == " " || old == null) {
                mod = "10";
            } 
            else if (old == 0) {
                mod = " ";
            }
            else {
                old--;
                mod = old % 11;
            }
            
            this.innerText = mod;
        }
    });
     
}