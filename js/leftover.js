

/***
**** UPDATE TABLE ** 
***/
function updateSetting(){
	DEMODB.transaction(
	    function (transaction) {
	    	if($('#fname').val() != '') {
	    		var fname = $('#fname').val();
	    	} else {
	    		var fname = 'none';
	    	}
			
			var bg    = $('#bg_color').val();
			var font  = $('#font_selection').val();
			var car   = $('#fav_car').val();
			
	    	
	    	transaction.executeSql("UPDATE page_settings SET fname=?, bgcolor=?, font=?, favcar=? WHERE id = 1", [fname, bg, font, car]);
	    }
	);	
		selectAll();
}



/***
**** Save 'default' data into DB table **
***/

function saveAll(){
		prePopulate(1);
}




/***
**** DELETE DB TABLE ** 
***/
function dropTables(){
	DEMODB.transaction(
	    function (transaction) {
	    	transaction.executeSql("DROP TABLE page_settings;", [], nullDataHandler, errorHandler);
	    }
	);
	console.log("Table 'page_settings' has been dropped.");
	location.reload();
}


