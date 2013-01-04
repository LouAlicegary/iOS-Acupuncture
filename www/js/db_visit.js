//var visit_db;
//var visitDataArray = [];

var shortName = 'MTESTDB';
var version = '1.0';
var displayName = 'MTest DB';
var maxSize = 1000000; // in bytes

function initVisitDatabase() {
	try {
        //console.log("open visit db");
        visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
        createVisitTable();
	} catch(e) {
        alert("Unknown error "+ e +".");
	    return;
	} 
}


function createVisitTable() {
    //console.log("create visit table");
    visit_db.transaction(
        function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS visits (id INTEGER NOT NULL PRIMARY KEY, patient_id INTEGER NOT NULL, date INTEGER, overall_pre INTEGER, overall_post INTEGER, overall_notes TEXT, m01_pre INTEGER, m01_post INTEGER, m01a_pre INTEGER, m01a_post INTEGER, m01b_pre INTEGER, m01b_post INTEGER, m01_notes TEXT, m02_pre INTEGER, m02_post INTEGER, m02_notes TEXT, m03l_pre INTEGER, m03l_post INTEGER, m03r_pre INTEGER, m03r_post INTEGER, m03_notes TEXT, m04l_pre INTEGER, m04l_post INTEGER, m04r_pre INTEGER, m04r_post INTEGER, m04_notes TEXT, m05l_pre INTEGER, m05l_post INTEGER, m05r_pre INTEGER, m05r_post INTEGER, m05_notes TEXT, m06l_pre INTEGER, m06l_post INTEGER, m06r_pre INTEGER, m06r_post INTEGER, m06_notes TEXT, m07l_pre INTEGER, m07l_post INTEGER, m07r_pre INTEGER, m07r_post INTEGER, m07_notes TEXT, m08l_pre INTEGER, m08l_post INTEGER, m08r_pre INTEGER, m08r_post INTEGER, m08_notes TEXT, m09l_pre INTEGER, m09l_post INTEGER, m09r_pre INTEGER, m09r_post INTEGER, m09_notes TEXT, m10l_pre INTEGER, m10l_post INTEGER, m10r_pre INTEGER, m10r_post INTEGER, m10_notes TEXT, m11l_pre INTEGER, m11l_post INTEGER, m11r_pre INTEGER, m11r_post INTEGER, m11_notes TEXT, m12l_pre INTEGER, m12l_post INTEGER, m12r_pre INTEGER, m12r_post INTEGER, m12_notes TEXT, m13l_pre INTEGER, m13l_post INTEGER, m13r_pre INTEGER, m13r_post INTEGER, m13_notes TEXT, m14l_pre INTEGER, m14l_post INTEGER, m14r_pre INTEGER, m14r_post INTEGER, m14_notes TEXT, m15l_pre INTEGER, m15l_post INTEGER, m15r_pre INTEGER, m15r_post INTEGER, m15_notes TEXT, m16l_pre INTEGER, m16l_post INTEGER, m16r_pre INTEGER, m16r_post INTEGER, m16_notes TEXT, m17l_pre INTEGER, m17l_post INTEGER, m17r_pre INTEGER, m17r_post INTEGER, m17_notes TEXT, m18l_pre INTEGER, m18l_post INTEGER, m18r_pre INTEGER, m18r_post INTEGER, m18_notes TEXT, m19l_pre INTEGER, m19l_post INTEGER, m19r_pre INTEGER, m19r_post INTEGER, m19_notes TEXT, m20l_pre INTEGER, m20l_post INTEGER, m20r_pre INTEGER, m20r_post INTEGER, m20_notes TEXT, m21l_pre INTEGER, m21l_post INTEGER, m21r_pre INTEGER, m21r_post INTEGER, m21_notes TEXT, m22l_pre INTEGER, m22l_post INTEGER, m22r_pre INTEGER, m22r_post INTEGER, m22_notes TEXT, m23l_pre INTEGER, m23l_post INTEGER, m23r_pre INTEGER, m23r_post INTEGER, m23_notes TEXT, m24l_pre INTEGER, m24l_post INTEGER, m24r_pre INTEGER, m24r_post INTEGER, m24_notes TEXT, m25l_pre INTEGER, m25l_post INTEGER, m25r_pre INTEGER, m25r_post INTEGER, m25_notes TEXT, m26l_pre INTEGER, m26l_post INTEGER, m26r_pre INTEGER, m26r_post INTEGER, m26_notes TEXT, m27_pre INTEGER, m27_post INTEGER, m27_notes TEXT, m28_pre INTEGER, m28_post INTEGER, m28_notes TEXT, m29l_pre INTEGER, m29l_post INTEGER, m29r_pre INTEGER, m29r_post INTEGER, m29_notes TEXT, m30l_pre INTEGER, m30l_post INTEGER, m30r_pre INTEGER, m30r_post INTEGER, m30_notes TEXT);', [], visitNullDataHandler, visitErrorHandler);
        }
    );
        
    function visitNullDataHandler() {
        //console.log("visitNullDataHandler");
    }

    function visitErrorHandler(transaction, error) {
        //console.log('visitErrorHandler.  Error was ' + error.message + ' (Code ' + error.code + ')');
        return false;
    }
    
}


function writeVisitToDb(patient_id) {
    //console.log("writeVisitToDb");
    var id = Math.round(new Date().getTime());

    var data = new Array(152);
    data[0] = id;
    data[1] = patient_id;
    data[2] = id;
    for (i=3; i <= 151; i++) {
        data[i] = "";
    }
    addRecordToVisitDB(data);
    return id;
}

function addRecordToVisitDB(data){

	//console.log("add record to visit db: " + data);
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	visit_db.transaction(
    	function (tx) {
			tx.executeSql("INSERT INTO visits(id, patient_id, date, overall_pre, overall_post, overall_notes, m01_pre, m01_post, m01a_pre, m01a_post, m01b_pre, m01b_post, m01_notes, m02_pre, m02_post, m02_notes, m03l_pre, m03l_post, m03r_pre, m03r_post, m03_notes, m04l_pre, m04l_post, m04r_pre, m04r_post, m04_notes, m05l_pre, m05l_post, m05r_pre, m05r_post, m05_notes, m06l_pre, m06l_post, m06r_pre, m06r_post, m06_notes, m07l_pre, m07l_post, m07r_pre, m07r_post, m07_notes, m08l_pre, m08l_post, m08r_pre, m08r_post, m08_notes, m09l_pre, m09l_post, m09r_pre, m09r_post, m09_notes, m10l_pre, m10l_post, m10r_pre, m10r_post, m10_notes, m11l_pre, m11l_post, m11r_pre, m11r_post, m11_notes, m12l_pre, m12l_post, m12r_pre, m12r_post, m12_notes, m13l_pre, m13l_post, m13r_pre, m13r_post, m13_notes, m14l_pre, m14l_post, m14r_pre, m14r_post, m14_notes, m15l_pre, m15l_post, m15r_pre, m15r_post, m15_notes, m16l_pre, m16l_post, m16r_pre, m16r_post, m16_notes, m17l_pre, m17l_post, m17r_pre, m17r_post, m17_notes, m18l_pre, m18l_post, m18r_pre, m18r_post, m18_notes, m19l_pre, m19l_post, m19r_pre, m19r_post, m19_notes, m20l_pre, m20l_post, m20r_pre, m20r_post, m20_notes, m21l_pre, m21l_post, m21r_pre, m21r_post, m21_notes, m22l_pre, m22l_post, m22r_pre, m22r_post, m22_notes, m23l_pre, m23l_post, m23r_pre, m23r_post, m23_notes, m24l_pre, m24l_post, m24r_pre, m24r_post, m24_notes, m25l_pre, m25l_post, m25r_pre, m25r_post, m25_notes, m26l_pre, m26l_post, m26r_pre, m26r_post, m26_notes, m27_pre, m27_post, m27_notes, m28_pre, m28_post, m28_notes, m29l_pre, m29l_post, m29r_pre, m29r_post, m29_notes, m30l_pre, m30l_post, m30r_pre, m30r_post, m30_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )", data);
    		//alert ("OK2");
    	}
	);	

}


 
function updateSingleRecordInVisitDB(column, data){
    
	//console.log("update single record in visit db: " + column + ": " + data[1]);
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	
	visit_db.transaction(
        function (tx) {
            tx.executeSql("UPDATE visits SET " + column + "=? WHERE id =?", [data[1], data[0]],
                function(tx, res) {
                    //console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                },
                function(e) {
                    return console.log("ERROR: " + e.message);
                });
        }
    );	
    
}


function getSingleNotes(visit_id, movement_number){
    
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	visit_db.transaction(
        function (tx) {
            tx.executeSql("SELECT * FROM visits WHERE id=?;", [visit_id], notesDataSelectHandler, visitErrorHandler);
        }
    );
    
    function notesDataSelectHandler(transaction, results) {
        //console.log("notes dataselecthandler: " + results.rows.length + " rows");
        var i;
        for (i=0; i < results.rows.length; i++) {
            row = results.rows.item(i);
            if (movement_number == 0) {
                notes = row["overall_notes"];
            }
            else {
                notes = row["m"+movement_number+"_notes"];
            }
            document.getElementById("movement_notes").value = notes;
        } 
        //console.log("word: " + notes);
	
    }
    
    function visitErrorHandler(transaction, error) {
        //console.log('visitErrorHandler.  Error was ' + error.message + ' (Code ' + error.code + ')');
        return false;
    }
    
}


function getSingleScore(visit_id, value_name, destination) {
    
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	visit_db.transaction(
        function (tx) {
            tx.executeSql("SELECT * FROM visits WHERE id=?;", [visit_id], scoreDataSelectHandler, visitErrorHandler);
        }
    );
    
    function scoreDataSelectHandler(transaction, results) {
        //console.log("getSingleScore dataselecthandler: " + results.rows.length + " rows");
        //var i;
        row = results.rows.item(0);

        notes = row[value_name];

        //console.log(value_name + ": " + notes);
        //return notes;
        document.getElementById(destination).innerText = notes;
	
    }
    
    function visitErrorHandler(transaction, error) {
        //console.log('visitErrorHandler.  Error was ' + error.message + ' (Code ' + error.code + ')');
        return false;
    }    
    
}


function outputOverallPostPreToScreen(visit_id) {
    //console.log("got here");
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
    //console.log("got here 2");
	visit_db.transaction(
        function (tx) {
            tx.executeSql("SELECT * FROM visits WHERE id=?;", [visit_id], DataSelectHandler21, visitErrorHandler);
            //console.log("got here 3");
        }
    );
    //console.log("got here 4");
    
    function DataSelectHandler21(transaction, results) {
        
        //console.log("outputVisitFromDbToScreen datahandler(): " + results.rows.length + " rows");
        row = results.rows.item(0);
        
        document.getElementById("q00_pre_m").innerText = row['overall_pre'];
        document.getElementById("q00_post_m").innerText = row['overall_post'];
    }

    function visitErrorHandler(transaction, error) {
        //console.log('visitErrorHandler.  Error was ' + error.message + ' (Code ' + error.code + ')');
        return false;
    }
    
}



function outputVisitFromDbToScreen(visit_id) {
    //console.log("got here");
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
    //console.log("got here 2");
	visit_db.transaction(
        function (tx) {
            tx.executeSql("SELECT * FROM visits WHERE id=?;", [visit_id], DataSelectHandler23, visitErrorHandler);
            //console.log("got here 3");
        }
    );
    //console.log("got here 4");
    
    function DataSelectHandler23(transaction, results) {
        
        //console.log("outputVisitFromDbToScreen datahandler(): " + results.rows.length + " rows");
        row = results.rows.item(0);
        
        for (i=3; i < 152; i++) {
            if (i < 6) { //OVERALL PRE POST
                if (i == 3) {
                    //PRE
                    document.getElementById("q00_pre_m").innerText = row['overall_pre'];
                }
                else if (i == 4) {
                    //POST
                    document.getElementById("q00_post_m").innerText = row['overall_post'];
                }
            }
            else if (i < 13) { //MOVEMENT 1
                if (i == 6) {
                    //1 PRE
                    document.getElementById("q01_pre_l").innerText = row['m01_pre'];
                }
                else if (i == 7) {
                    //1 POST
                    document.getElementById("q01_post_l").innerText = row['m01_post'];
                }
                else if (i == 8) {
                    //1 A PRE
                    document.getElementById("q01_pre_m").innerText = row['m01a_pre'];
                }
                else if (i == 9) {
                    //1 A POST
                    document.getElementById("q01_post_m").innerText = row['m01a_post'];
                }
                else if (i == 10) {
                    //1 B PRE
                    document.getElementById("q01_pre_r").innerText = row['m01b_pre'];
                }
                else if (i == 11) {
                    //1 B POST
                    document.getElementById("q01_post_r").innerText = row['m01b_post'];
                }                
            }
            else if (i < 16) { // MOVEMENT 2
                if (i == 13) {
                    //PRE
                    document.getElementById("q02_pre_m").innerText = row['m02_pre'];
                }
                else if (i == 14) {
                    //POST
                    document.getElementById("q02_post_m").innerText = row['m02_post'];
                }                        
            }
            else if (i < 136) { //MOVEMENTS 3-26
                movement_number = (i-1)/5;
                movement_number = Math.floor(movement_number);
                movement_number = padZeros(movement_number, 2);
                if ((i % 5) == 1) {
                    // L PRE
                    document.getElementById("q" + movement_number + "_pre_l").innerText = row['m' + movement_number + 'l_pre'];
                }
                else if ((i % 5) == 2) {
                    // L POST
                    document.getElementById("q" + movement_number + "_post_l").innerText = row['m' + movement_number + 'l_post'];
                }
                else if ((i % 5) == 3) {
                    // R PRE
                    document.getElementById("q" + movement_number + "_pre_r").innerText = row['m' + movement_number + 'r_pre'];
                }
                else if ((i % 5) == 4) {
                    // R POST
                    document.getElementById("q" + movement_number + "_post_r").innerText = row['m' + movement_number + 'r_post'];
                } 
            }
            else if (i < 142) { //MOVEMENTS 27-28
                if (i == 136) {
                    //27 PRE
                    document.getElementById("q27_pre_m").innerText = row['m27_pre'];
                }
                else if (i == 137) {
                    //27 POST
                    document.getElementById("q27_post_m").innerText = row['m27_post'];
                }
                else if (i == 139) {
                    //28 PRE
                    document.getElementById("q28_pre_m").innerText = row['m28_pre'];
                }
                else if (i == 140) {
                    //28 POST
                    document.getElementById("q28_post_m").innerText = row['m28_post'];
                }                
            }
            else { //MOVEMENTS 29-30 (142-151)
                movement_number = (i+3)/5;
                movement_number = Math.floor(movement_number);
                if ((i % 5) == 2) {
                    // L PRE
                    document.getElementById("q" + movement_number + "_pre_l").innerText = row['m' + movement_number + 'l_pre'];
                }
                else if ((i % 5) == 3) {
                    // L POST
                    document.getElementById("q" + movement_number + "_post_l").innerText = row['m' + movement_number + 'l_post'];
                }
                else if ((i % 5) == 4) {
                    // R PRE
                    document.getElementById("q" + movement_number + "_pre_r").innerText = row['m' + movement_number + 'r_pre'];
                }
                else if ((i % 5) == 0) {
                    // R POST
                    document.getElementById("q" + movement_number + "_post_r").innerText = row['m' + movement_number + 'r_post'];
                }                 
            }
        }
    }
    
      function visitErrorHandler(transaction, error) {
        //console.log('visitErrorHandler.  Error was ' + error.message + ' (Code ' + error.code + ')');
        return false;
    }  
}


function outputNotes(visit_id) {
    //console.log("got here");
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
    //console.log("got here 2");
	visit_db.transaction(
        function (tx) {
            tx.executeSql("SELECT * FROM visits WHERE id=?;", [visit_id], DataSelectHandler45, visitErrorHandler);
            //console.log("got here 3");
        }
    );
    //console.log("got here 4");
    
    function DataSelectHandler45(transaction, results) {
        
        //console.log("outputNotes datahandler(): " + results.rows.length + " rows");
        row = results.rows.item(0);
        
        // get overall notes
        // get 1-30 notes
        for (i=0; i <= 30; i++) {
            if (i == 0) {
                these_notes = row['overall_notes'];
                document.getElementById("notes_index_00").innerText = "Overall Visit Notes: " + these_notes; 
            }
            else {
                movement_number = padZeros(i, 2);
                these_notes = row['m' + movement_number + '_notes'];
                //console.log("Note: " + these_notes);
                document.getElementById("notes_index_" + movement_number).innerText = "Notes for Movement " + movement_number + ": " + these_notes;            
            }
        }
    }
    
    function visitErrorHandler(transaction, error) {
        //console.log('visitErrorHandler.  Error was ' + error.message + ' (Code ' + error.code + ')');
        return false;
    }
    
}



function deleteRecordInVisitDB(visit_id) {

	//console.log("delete record in visit db: " + visit_id);
    
	visit_db = sqlitePlugin.openDatabase(shortName, version, displayName, maxSize);
	visit_db.transaction(
    	function (tx) {
			tx.executeSql("DELETE FROM visits WHERE id = ?", [visit_id],
                function(res) {
                    //console.log("record id: " + visit_id + "successfully deleted.");
                },
                function(e) {
                    return console.log("ERROR: " + e.message);
                });
    	}
	);	
}
