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
					
            		
            		if (calling_page == 0) {
            			var id;
						var dataString = document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + document.getElementById('dob').value + ":::" + getSex() + ":::" + document.getElementById('phone').value + ":::" + document.getElementById('email').value + ":::" + document.getElementById('disorder').value + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value;
            			id = writePatientToDb(dataString);
            			dataString = id + ":::" + dataString;
            			window.name = dataString;
            		}
            		else {
            			var data_array = window.name.split(":::");
            			var id = data_array[0];
            			var dataString = id + ":::" + document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + document.getElementById('dob').value + ":::" + getSex() + ":::" + document.getElementById('phone').value + ":::" + document.getElementById('email').value + ":::" + document.getElementById('disorder').value + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value;
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
	     
	     //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
	     $('.ui-widget-header').hide(); //completely hides title bar
         $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div class ui-dialog
         $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?
         
         if (calling_page == 1) {
         	repopulatePatientInfoDialog(window.name);
         	//alert(window.name);
         	//alert (data_array);
         }
         //getPatientName();
}

function popUpPatientListDialog() {
    	
	$("#patient_list_dialog").dialog({
     	modal: true,
     	height: 650,
     	width: 700,
     	resizable: false,
		buttons: [{
    		text: "OK", 
    		id: "btnOk",
    		click: function () {
        		//$(this).dialog('close');
				//var dataString = document.getElementById('firstname').value + ":::" + document.getElementById('lastname').value + ":::" + document.getElementById('dob').value + ":::" + getSex() + ":::" + document.getElementById('phone').value + ":::" + document.getElementById('email').value + ":::" + document.getElementById('disorder').value + ":::" + document.getElementById('chiefcomplaint').value + ":::" + document.getElementById('notes').value;
        		//window.name = dataString;
        		//writePatientToDb(dataString);
        		window.location="sheet.html";
        		//getPatientNameActual();
    		}, }, {
    		text: "Cancel",
    		click: function () {
        		$(this).dialog('close');
    		},
		}]
     });
     
     $('.ui-dialog').css("top","50px"); //keeps dialog at top of screen to avoid keyboard
     
     //$('.ui-dialog-title').hide(); //hides title but keeps thin bar with 'X' close button
     $('.ui-widget-header').hide(); //completely hides title bar
     $('.ui-dialog :button').blur(); // Remove focus on all buttons within the div class ui-dialog
     $('.ui-dialog :input').blur(); // Remove initial focus on input elements within the div class ui-dialog KEEP THIS LINE OR NO?

	//alert(patientDataArray[0]);
	//patientDataArray = [["Lou", "Alicegary", "10/09/1979", "M"]];
	patient_db = openDatabase(shortName, version, displayName, maxSize);
	//alert("db select ");
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
	        ]
	    } ); 			
	}
    //getPatientName();
}