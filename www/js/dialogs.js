var patient_data_array;


function popUpMainDialog() {
    //console.log("popUpMainDialog() start");
    //$(".patient_frontpage_subheader").hide();
    $(".patient_frontpage_middle_button").hide();
    $(".patient_frontpage_middle_dialog").hide();
    
    setTimeout(function(){
        $("#subheader1").css("background-color", "#9f9a79");
        $("#subheader1").css("color", "#ffffff");
        $("#subheader1").show();
        $("#new_patient_button").show();
        $("#existing_patient_button").show();
        $("#options_button").show();
        $(".patient_frontpage_middle").show();    
    }, 200);
    
}

function popUpNewPatientDialog(calling_page) { // 0 = index.html ; 1 = sheet.html <----obsolete now w/ diff bet divs and dialogs
    
    $('.patient_frontpage_middle_button').hide();


    $('.patient_frontpage_middle_dialog').show();//$('.patient_frontpage_middle_dialog').hide();
    //$('.patient_frontpage_subheader').hide(); //css("background-color", "#9F9A79");
    $('#pvl_container2').load('./html/first_time_patient.html', function() {
    
    
        $('.dialog_header').html("Enter the new patient's information:");
        $('#first_time_patient input').css('background-color', '#504D3B');
        $('#first_time_patient input').css('color', '#EEEEEE');
        $('#first_time_patient textarea').css('background-color', '#504D3B');
        $('#first_time_patient textarea').css('color', '#EEEEEE');
        $('#labelset').css('background-color', '#504D3B');
        $('#first_time_patient .radio_label').css('color', '#EEEEEE');
        $('#first_time_patient img').css('background-color', '#9F9A79');
        
        $('.patient_frontpage_subheader').css("background-color", "#504d3b");
        $('#subheader2_1').show();
        $('#subheader2_2').hide();
        $('#subheader2_3').hide();
        //$('.patient_frontpage_middle_dialog').show();
        
        $('.image_fieldset').live("touchend", function(event) {

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
                //console.log("gets here");
                var cameraImage = document.getElementById('image_fieldset');
                cameraImage.innerHTML = "<img id=\"patient_image\" src=\"" + imageData + "\">";
                //cameraImage.src = imageData;
                //console.log("getPhoto() - cameraImage.src: " + imageData);
            }
            /* navigator.camera.getPicture fail function */
            function onFail(message)
            {
                //console.log("camera fail");
                alert('Failed because: ' + message);
            }
                
        });
        
        $("#new_patient_continue_button").live("touchend", function(event) {
            //console.log("here?");
            var calling_page = 0;
            //DATE PARSER
            var raw_date = document.getElementById('dob').value;
            //console.log("raw_date: " + raw_date);
            fixed_date = dateParser(raw_date);
            if (calling_page == 0) { //blank values inserted by me to fill roles of phone and disorder, which were deleted
                //console.log("gets here 1 eventhandler");
                var dataString = document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + fixed_date + ":::" + getSex('') + ":::" + "0" + ":::" + document.getElementById('email').value + ":::" + "" + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value + ":::" + document.getElementById('patient_image').src;
                //console.log("gets here 2 eventhandler");
                var id = writePatientToDb(dataString);
                //console.log("dataString pre: " + dataString);
                dataString = "0000000000000" + ":::" + id + ":::" + dataString;
                window.name = dataString;
            }
            else {
                //console.log("HOW DID THIS GET CALLED!?!?!?");
                /*
                var data_array = window.name.split(":::");
                var visit_id = data_array[0];
                var patient_id = data_array[1];
                //console.log(data_array);
                
                var dataString = visit_id + ":::" + patient_id + ":::" + document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + fixed_date + ":::" + getSex('') + ":::" + "0" + ":::" + document.getElementById('email').value + ":::" + "" + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value + ":::" + document.getElementById('patient_image').src;
                data_array = dataString.split(":::");
                window.name = dataString;
                updateRecordInPatientDB(data_array);
                */
            }

            setTimeout(function(){window.location="./html/sheet.html";}, 250);
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
    
    });
    
}



function popUpExistingPatientDialog() {
    	
    //console.log("popUpExistingPatientDialog() start");

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
    
    //setTimeout(function() { patient_db.close(function(){//console.log('Close PatientListDialog db success.');}, function(e){//console.log("Close PatientListDialog db error: " + e);}); //console.log("closed db");  }, 1000);
    
    function errorHandler3(transaction, error) {
        //console.log('popUpExistingPatientDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
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
                    //patient_id_int = parseInt(patient_id);
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
    //console.log("popUpOptionsDialog() start");
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
        //console.log('popUpPriorVisitPatientDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
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
                    //patient_id_int = parseInt(patient_id);
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
        //console.log('popUpPriorVisitDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
    }
    
    function patientDataSelectHandler9(transaction, results) {
        //console.log("FINAL dataselecthandler: " + results.rows.length + " rows");
        patientVisitDataArray2 = new Array(results.rows.length);
        var i;
        for (i=0; i < results.rows.length; i++) {
            row = results.rows.item(i);
            patientVisitDataArray2[i] = new Array(3);
            //console.log("here for");
            patientVisitDataArray2[i][0] = row['id'];
            //console.log("here for: " + row['date']);
            patientVisitDataArray2[i][1] = getMDYDate(row['date']);
            //console.log("here for");
            patientVisitDataArray2[i][2] = getTimeFromDate(row['date'])+row['id'];
            //console.log("for loop: " + patientVisitDataArray2[i]);
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
                    //patient_id_int = parseInt(patient_id);
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
    //console.log("popUpDBDialog() start");
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
	    	//console.log("popUpDeletePatientDialog() - SELECT * FROM patients (dialogs.js)");
			tx.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler38, errorHandler38);
			//setTimeout(function() { return patientDataArray[0];  }, 1000);	
		}
	);	


    function errorHandler38(transaction, error) {
        //console.log('popUpPDeletePatientDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
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
                    //patient_id_int = parseInt(patient_id);
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
    //console.log("close patient_db");
    //setTimeout(function(){patient_db.close();}, 250);
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
        //console.log('popUpDeleteVisitPatientDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
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
                    //patient_id_int = parseInt(patient_id);
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
        //console.log('popUpPriorVisitDialog() Error Handler.  Error was ' + error.message + ' (Code ' + error.code + ')');
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
                    //patient_id_int = parseInt(patient_id);
                    //sReturn = "<div id='" + visit_id + "'>" + time + "</div>";
					sReturn = "<div id='" + patient_id + "'>" + sReturn + "</div>";
                    return sReturn; }
				},
                { "sTitle": "Time", "sClass": "center", "sWidth": "50%", "fnRender": function(obj) {
					var sReturn = obj.aData[ obj.iDataColumn ];
                    var visit_id = sReturn.substr(5, 13);
                    var time = sReturn.substr(0,5);
                    //patient_id_int = parseInt(patient_id);
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
        buttons: [
        {
            text: "Prev", 
            id: "btnPrev",
            click: function () {
                //okCallback();
                var movement_number = $(this).html();
                movement_number = movement_number.substr(movement_number.indexOf("_big.png")-2, 2);
                movement_number_int = parseInt(movement_number);
                var the_id = "q" + movement_number;
                
                prev_movement_number_int = parseInt(movement_number) - 1;
                
                if (movement_number_int == 1) {
                    prev_movement_number_int = 30;
                }
                else if (movement_number_int == 0) {
                    prev_movement_number_int = 0;
                }
                
                prev_movement_number = padZeros(prev_movement_number_int, 2);
                prev_the_id = "q" + prev_movement_number;
                //console.log("mn / vi / ti / pmn = " + movement_number + " " + visit_id + " " + the_id + " " + prev_movement_number);
                saveMovementDialogInfo(movement_number, visit_id, the_id);
                setTimeout(function(){populateMovementDialog(prev_movement_number, visit_id, prev_the_id);},250);                
            }
        },
        {
            text: "Next", 
            id: "btnNext",
            click: function () {
                //okCallback();
                var movement_number = $(this).html();
                movement_number = movement_number.substr(movement_number.indexOf("_big.png")-2, 2);
                movement_number_int = parseInt(movement_number);
                var the_id = "q" + movement_number;
                
                next_movement_number_int = parseInt(movement_number) + 1;
                
                if (movement_number_int == 30) {
                    next_movement_number_int = 1;
                }
                else if (movement_number_int == 0) {
                    next_movement_number_int = 0;
                }
                
                next_movement_number = padZeros(next_movement_number_int, 2);
                next_the_id = "q" + next_movement_number;
                //console.log("mn / vi / ti / nmn = " + movement_number + " " + visit_id + " " + the_id + " " + next_movement_number);
                saveMovementDialogInfo(movement_number, visit_id, the_id);
                setTimeout(function(){populateMovementDialog(next_movement_number, visit_id, next_the_id);},250);
            }
        },
        {
            text: "Return to Sheet", 
            id: "btnOk",
            click: function () {
                //okCallback();
                var movement_number = $(this).html();
                movement_number = movement_number.substr(movement_number.indexOf("_big.png")-2, 2);
                var the_id = "q" + movement_number;
       		
                saveMovementDialogInfo(movement_number, visit_id, the_id);
                
                $(this).dialog('destroy');
            }
        }]
     });
     
    $("#new_movement_dialog").dialog('open');
     
    $('.ui-dialog').css("top","130px"); //keeps dialog at top of screen to avoid keyboard
    $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
    $('.ui-widget-header').hide(); //completely hides title bar
    $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div with class ui-dialog
    $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?
    //$('.ui-dialog :button').css("background-color", "#ADD8E6");
    $('.ui-dialog').css("background-color", "#EEEEEE");
    $('.ui-dialog :button').css("color", "#FFFFFF");


    //the_id contains a string like "q04" which would refer to movement 4
    var movement_number = the_id.substr(1);
    movement_number_int = parseInt(movement_number);
    //console.log("Clicked on movement number: " + movement_number);
    
    populateMovementDialog(movement_number, visit_id, the_id);

     
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
    document.getElementById('point_dialog_image').innerHTML = "<img src=\"../images/" + the_id + ".png\">";

    
    $("#new_point_dialog").click(function(event) {
         $("#new_point_dialog").dialog('close');
    });
    
}


function popUpMovementDialogFromNotes(the_class, the_id, visit_id) { //This can be combined with the other Movement dialog at some point with some small changes
    
    $("#new_notes_movement_dialog").dialog({
        modal: true,
        height: 550,
        width: 634,
        autoOpen: false,
        resizable: false,
        buttons: [
        {
            text: "Prev", 
            id: "btnPrev",
            click: function () {
                //okCallback();
                var movement_number = $(this).html();
                movement_number = movement_number.substr(movement_number.indexOf("_big.png")-2, 2);
                movement_number_int = parseInt(movement_number);
                var the_id = "q" + movement_number;
                
                prev_movement_number_int = parseInt(movement_number) - 1;
                
                if (movement_number_int == 1) {
                    prev_movement_number_int = 30;
                }
                else if (movement_number_int == 0) {
                    prev_movement_number_int = 0;
                }
                
                prev_movement_number = padZeros(prev_movement_number_int, 2);
                prev_the_id = "q" + prev_movement_number;
                //console.log("mn / vi / ti / pmn = " + movement_number + " " + visit_id + " " + the_id + " " + prev_movement_number);
                saveNotesMovementDialogInfo(movement_number, visit_id, the_id);
                setTimeout(function(){populateNotesMovementDialog(prev_movement_number, visit_id, prev_the_id);},250);                
            }
        },
        {
            text: "Next", 
            id: "btnNext",
            click: function () {
                //okCallback();
                var movement_number = $(this).html();
                movement_number = movement_number.substr(movement_number.indexOf("_big.png")-2, 2);
                movement_number_int = parseInt(movement_number);
                var the_id = "q" + movement_number;
                
                next_movement_number_int = parseInt(movement_number) + 1;
                
                if (movement_number_int == 30) {
                    next_movement_number_int = 1;
                }
                else if (movement_number_int == 0) {
                    next_movement_number_int = 0;
                }
                
                next_movement_number = padZeros(next_movement_number_int, 2);
                next_the_id = "q" + next_movement_number;
                //console.log("mn / vi / ti / nmn = " + movement_number + " " + visit_id + " " + the_id + " " + next_movement_number);
                saveNotesMovementDialogInfo(movement_number, visit_id, the_id);
                setTimeout(function(){populateNotesMovementDialog(next_movement_number, visit_id, next_the_id);},250);
            }
        },
        {
            text: "Return to Notes", 
            id: "btnOk",
            click: function () {
                //okCallback();
                var movement_number = $(this).html();
                movement_number = movement_number.substr(movement_number.indexOf("_big.png")-2, 2);
                var the_id = "q" + movement_number;
       		
                saveNotesMovementDialogInfo(movement_number, visit_id, the_id);
                
                $(this).dialog('destroy');
            }
        }]
     });
     
    $("#new_notes_movement_dialog").dialog('open');
     
    $('.ui-dialog').css("top","130px"); //keeps dialog at top of screen to avoid keyboard
    $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
    $('.ui-widget-header').hide(); //completely hides title bar
    $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div with class ui-dialog
    $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?
    //$('.ui-dialog :button').css("background-color", "#ADD8E6");
    $('.ui-dialog').css("background-color", "#EEEEEE");
    $('.ui-dialog :button').css("color", "#FFFFFF");

    //the_id contains a string like "q04" which would refer to movement 4
    //console.log("the id = " + the_id);
    var movement_number = the_id.substr(1);
    movement_number_int = parseInt(movement_number);
    //var the_id = "q" + movement_number;
    //console.log("Clicked on movement number: " + movement_number);
    
    populateNotesMovementDialog(movement_number, visit_id, the_id);

     
}