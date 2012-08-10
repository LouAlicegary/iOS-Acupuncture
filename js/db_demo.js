
function initDatabase() {
	
	//alert("init db");
	
	try {
	    if (!window.openDatabase) {
	        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
	    } 
	    else {
	        var shortName = 'DEMODB';
	        var version = '1.0';
	        var displayName = 'DEMODB Test';
	        var maxSize = 100000; // in bytes
	        DEMODB = openDatabase(shortName, version, displayName, maxSize);
			alert("db open");
			createTables();
			selectAll();
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

/***
**** CREATE TABLE ** 
***/
function createTables(){
	try {
		DEMODB.transaction(
	        function (transaction) {
	        	alert("db create");
	        	transaction.executeSql('CREATE TABLE IF NOT EXISTS page_settings(id INTEGER PRIMARY KEY AUTOINCREMENT, fname TEXT NOT NULL,bgcolor TEXT NOT NULL, font TEXT, favcar TEXT);', [], nullDataHandler, errorHandler);
	        }
	    );
    }
	catch(e) {
		alert("error: " + e)
	}
	
	prePopulate();
}


/***
**** INSERT INTO TABLE ** 
***/
function prePopulate(){
	
	try {
		DEMODB.transaction(
	    	function (transaction) {
		
				alert("db prepopulate");
				var data = ['1','none','#B3B4EF','Helvetica','Porsche 911 GT3'];  
				transaction.executeSql("INSERT INTO page_settings(fname, bgcolor, font, favcar) VALUES (?, ?, ?, ?)", [data[1], data[2], data[3], data[4]]);
	    	}
		);	
	}
	catch(e) {
		alert("error: " + e)
	}
}

/***
**** SELECT DATA **
***/
function selectAll(){ 
	try {
		DEMODB.transaction(
		    function (transaction) {
				transaction.executeSql("SELECT * FROM page_settings;", [], dataSelectHandler, errorHandler);
				alert("db select");
			}
		);	
	}
	catch(e) {
		alert("error: " + e)
	}
}

function dataSelectHandler(transaction, results) {

	alert ("dataselecthandler: " + results.rows.length + " rows");
	
	/*	
    for (var i=0; i<results.rows.length; i++) {
    	var row = results.rows.item(i);
        var newFeature = new Object();
    	newFeature.fname   = row['fname'];
        newFeature.bgcolor = row['bgcolor'];
        newFeature.font    = row['font'];
        newFeature.favcar  = row['favcar'];
        $(#dialog).html(my_error_text);
        $('#q01').html('<h4 id="your_car">Your Favorite Car is a '+ newFeature.favcar +'</h4>'); 
	}
	*/          
}

function nullDataHandler(){
	alert("null data handler");
}

function errorHandler(transaction, error) {
 	
 	alert("error handler");
 	
 	if (error.code==1){
 		// DB Table already exists
 	} 
 	else {
    	// Error is a human-readable string.
	    alert('Oops.  Error was '+error.message+' (Code '+error.code+')');
 	}
    return false;
}

function getPatientName() {
	
	alert ("getPatientName");
	
	var shortName = 'DEMODB';
	var version = '1.0';
	var displayName = 'DEMODB Test';
	var maxSize = 100000; // in bytes
	
	DEMODB = openDatabase(shortName, version, displayName, maxSize);
	DEMODB.transaction(
	    function (transaction) {
	        transaction.executeSql("SELECT * FROM page_settings;", [], myDataSelectHandler, errorHandler);
	        // Old query SELECT * FROM page_settings WHERE id = 1;
	    }
	);		

	function myDataSelectHandler(transaction, results){
		
		alert ("myDataSelectHandler");
        
        $('#dialog').html("There are " + results.rows.length + "records");

	}
}