function popUpPatientDialog(calling_page) { // 0 = index.html ; 1 = sheet.html 
    	
    	$("#new_patient_dialog").dialog({
	     	modal: true,
	     	height: 650,
	     	width: 700,
	     	resizable: false,
    		buttons: [{
        		text: "OK", 
        		id: "btnOk",
        		click: function () {
            		//$(this).dialog('close');
					
                      //console.log("IMG TAG " + document.getElementById('patient_image').src);
            		
            		if (calling_page == 0) {
            			var id;
						var dataString = document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + document.getElementById('dob').value + ":::" + getSex() + ":::" + document.getElementById('phone').value + ":::" + document.getElementById('email').value + ":::" + document.getElementById('disorder').value + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value + ":::" + document.getElementById('patient_image').src;
            			id = writePatientToDb(dataString);
            			dataString = "0000000000000" + ":::" + id + ":::" + dataString;
            			window.name = dataString;
            		}
            		else {
            			var data_array = window.name.split(":::");
                        console.log(data_array);
                        var visit_id = data_array[0];
            			var patient_id = data_array[1];
            			var dataString = visit_id + ":::" + patient_id + ":::" + document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + document.getElementById('dob').value + ":::" + getSex() + ":::" + document.getElementById('phone').value + ":::" + document.getElementById('email').value + ":::" + document.getElementById('disorder').value + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value + ":::" + document.getElementById('patient_image').src;
            			data_array = dataString.split(":::");
            			window.name = dataString;
            			//alert(data_array);
            			updateRecordInPatientDB(data_array);
            		}
            		
            		
            		/*
            		var inputs = document.getElementsByTagName('input');
            		alert(inputs.length);
					for(var i=0; i<inputs.length; i++){
						inputs[i].value="";
					}
            		*/
            		
            		setTimeout(function(){window.location="sheet.html";}, 250);
            		//fillInPatientInfo(); //this won't work here for some reason -- only in sheet.html
        		}, }, {
        		text: "Cancel",
        		click: function () {
            		$(this).dialog('close');
        		},
    		}]
	     });
	     
	     $('.ui-dialog').css("top","50px"); //keeps dialog at top of screen to avoid keyboard
	     $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
         
	     //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
	     $('.ui-widget-header').hide(); //completely hides title bar
         $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div class ui-dialog
         $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?
         
         if (calling_page == 1) {
         	repopulatePatientInfoDialog(window.name);
         }
         //getPatientName();
    
    
    
    $(".image_fieldset").click(function(event) {

        // navigator.camera.getPicture( cameraSuccess, cameraError, [ cameraOptions ] );
        navigator.camera.getPicture(getPhoto, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI, // // Return image file URI
            sourceType:Camera.PictureSourceType.CAMERA,
            targetWidth:160,  // Width in pixels to scale image. Aspect ratio is maintained. Required targetHeight.
            targetHeight:200  // Height in pixels to scale image. Aspect ratio is maintained. Required targetWidth.
        });
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
    
}

function popUpPatientListDialog() {
    	
	$("#patient_list_dialog").dialog({
     	modal: true,
     	height: 650,
     	width: 700,
     	resizable: false,
		buttons: [{
    		text: "Cancel",
    		click: function () {
        		$(this).dialog('close');
    		},
		}]
     });
     
     $('.ui-dialog').css("top","50px"); //keeps dialog at top of screen to avoid keyboard
     $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
     
     //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
     $('.ui-widget-header').hide(); //completely hides title bar
     $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div class ui-dialog
     $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?

    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	    	//alert("db select 2");
			tx.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler3, patientErrorHandler);
			//setTimeout(function() { return patientDataArray[0];  }, 1000);	
		}
	);	


	function patientDataSelectHandler3(transaction, results) {
		//alert ("dataselecthandler: " + results.rows.length + " rows");  
		var i;  
		for (i=0; i < results.rows.length; i++) {
			row = results.rows.item(i);
			patientDataArray[i] = Array();
			patientDataArray[i][0] = row['id'];
			patientDataArray[i][1] = row['firstname'];
			patientDataArray[i][2] = row['lastname'];
			patientDataArray[i][3] = row['dob'];
			patientDataArray[i][4] = row['sex'];
		} 
					    
		$('#demo').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
	    $('#example').dataTable( {
	        "aaData": patientDataArray,
	        "aoColumns": [
	        	{ "sTitle": "ID" },
	            { "sTitle": "First" },
	            { "sTitle": "Last" },
	            { "sTitle": "DOB" },
	            { "sTitle": "Sex", "sClass": "center" }
	        ],
            "bLengthChange": false                   
        } );
	}
    //getPatientName();
}

function popUpPatientVisitListDialog() {
    	
	$("#patient_visit_list_dialog").dialog({
     	modal: true,
     	height: 650,
     	width: 700,
     	resizable: false,
		buttons: [{
    		text: "Cancel",
    		click: function () {
        		$(this).dialog('close');
    		},
		}]
     });
     
     $('.ui-dialog').css("top","50px"); //keeps dialog at top of screen to avoid keyboard
     $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
     
     //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
     $('.ui-widget-header').hide(); //completely hides title bar
     $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div class ui-dialog
     $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?

    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	patient_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	patient_db.transaction(
	    function (tx) {
	    	//alert("db select 2");
			tx.executeSql("SELECT * FROM patients;", [], patientDataSelectHandler7, patientErrorHandler);
			//setTimeout(function() { return patientDataArray[0];  }, 1000);	
		}
	);	


	function patientDataSelectHandler7(transaction, results) {
		//alert ("dataselecthandler: " + results.rows.length + " rows");  
		var i;  
		for (i=0; i < results.rows.length; i++) {
			row = results.rows.item(i);
			patientDataArray[i] = Array();
			patientDataArray[i][0] = row['id'];
			patientDataArray[i][1] = row['firstname'];
			patientDataArray[i][2] = row['lastname'];
			patientDataArray[i][3] = row['dob'];
			patientDataArray[i][4] = row['sex'];
		} 
					    
		$('#pvl_container').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="patient_visit_list"></table>' );
	    $('#patient_visit_list').dataTable( {
	        "aaData": patientDataArray,
	        "aoColumns": [
	        	{ "sTitle": "ID" },
	            { "sTitle": "First" },
	            { "sTitle": "Last" },
	            { "sTitle": "DOB" },
	            { "sTitle": "Sex", "sClass": "center" }
	        ],
            "bLengthChange": false                   
        } );
	}
    //getPatientName();
}



function popUpPatientVisitListDialog2(patient_id, patient_name) {
    	
	$("#patient_visit_list_dialog2").dialog({
     	modal: true,
     	height: 650,
     	width: 700,
     	resizable: false,
		buttons: [{
    		text: "Cancel",
    		click: function () {
        		$(this).dialog('close');
    		},
		}]
     });
     
     $('.ui-dialog').css("top","50px"); //keeps dialog at top of screen to avoid keyboard
     $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
     
     //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
     $('.ui-widget-header').hide(); //completely hides title bar
     $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div class ui-dialog
     $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?

    $('#patient_info_header_visits').html("Record of Visits for " + patient_name);


    var shortName = 'MTESTDB';
	var version = '1.0';
	var displayName = 'MTest DB';
	var maxSize = 100000; // in bytes
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	visit_db.transaction(
	    function (tx) {
			tx.executeSql("SELECT * FROM visits WHERE patient_id=?;", [patient_id], patientDataSelectHandler9, patientErrorHandler);	
		}
	);	


    function patientDataSelectHandler9(transaction, results) {
        //console.log("FINAL dataselecthandler: " + results.rows.length + " rows");
        patientVisitDataArray2 = new Array(results.rows.length);
        var i;
        for (i=0; i < results.rows.length; i++) {
            row = results.rows.item(i);
            patientVisitDataArray2[i] = new Array(3);
            patientVisitDataArray2[i][0] = row['id'];
            patientVisitDataArray2[i][1] = getMDYDate(row['date']);
            patientVisitDataArray2[i][2] = getTimeFromDate(row['date']);
            //console.log(patientVisitDataArray2[i]);
        } 
					    
        $('#pvl_container2').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="patient_visit_list2"></table>' );
        $('#patient_visit_list2').dataTable( {
            "aaData": patientVisitDataArray2,
            "aoColumns": [
                { "sTitle": "Visit ID" },
                { "sTitle": "Date", "sClass": "center"  },
                { "sTitle": "Time", "sClass": "center"  }
            ],
            "bLengthChange": false
        } );
	}
    //getPatientName();
    
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
     
     $('.ui-dialog').css("top","50px"); //keeps dialog at top of screen to avoid keyboard
     $('.ui-dialog').css("-webkit-tap-highlight-color","rgba(0,0,0,0)"); //stop entire dialog box from highlighting on click
     
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
    $('.ui-dialog').css("top","50px"); //keeps dialog at top of screen to avoid keyboard
      
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