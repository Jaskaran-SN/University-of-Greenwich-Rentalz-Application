
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('DOMContentLoaded', this.onDeviceReady);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    onBodyLoad();
  },
};

// global variables
var db;
var shortName = 'UOGRentalzDB1';
var version = '1.0';
var displayName = 'UOGRentalzDB';
var maxSize = 3*1000*1000;

// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
  alert('Error: ' + error.message + ' code: ' + error.code);
}

// this is called when a successful transaction happens
//WILL (//) THIS FUNCTION SOON
function successCallBack() {
  alert("Application Loaded: success");
}

function nullHandler() {}

// called when the application loads
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function reloadPage() {
    window.onload = function() {
    if(!window.location.hash) {
        window.location = window.location + '#';
        window.location.reload();
    }
}
return;
}

function onBodyLoad() {
  if (!window.openDatabase) {
    alert('Database not loaded please use a compatible browser.');
    return;
  }
  // This alert is used to make sure the application is loaded correctly
  // you can comment this out once you have the application working
  db = openDatabase(shortName, version, displayName,maxSize);

  db.transaction(function(tx){
  //Opens  the database RentalzProperties
  tx.executeSql('CREATE TABLE IF NOT EXISTS `RentalzProperties`(`ppty_ID` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `ppty_type` TEXT NOT NULL, `ppty_rooms` INTEGER NOT NULL, `ppty_date` INTEGER NOT NULL, `ppty_monthly_price` INTEGER NOT NULL, `ppty_furniture_type` TEXT, `ppty_notes`	TEXT, `ppty_reporter`	TEXT NOT NULL, TEXT, `ppty_VR`)',
    [], nullHandler, errorHandler);
    }, errorHandler, successCallBack);

}

function listProperties() {
if (!window.openDatabase) {
//Opens the database RentalzProperties table properties
alert('Database not loaded please use a compatible browser.');
return;
}
reloadPage();
$('#lbListProp #manageTable').append('');
    
db.transaction(function(transaction) {
transaction.executeSql('SELECT * FROM `RentalzProperties`;', [],
function(transaction, result) {
  if (result !== null && result.rows !== null) {
   
    for (var i = 0; i < result.rows.length; i++) {
      var row = result.rows.item(i);
      $('#lbListProp #manageTable').append('<tr><tbody><td>' + '<h3> Property Type </h3>'+ row.ppty_type + 
	  '</td>' + '<td>' + '<h3> Number of Bedrooms </h3>'+ row.ppty_rooms + 
	  '</td> ' + '<td>' + '<h3> Furnishing Type </h3>'+ row.ppty_furniture_type +
	  '</td> ' + '<td>' + '<h3> Monthly Rent Price </h3>'+ '£' + row.ppty_monthly_price +
	  '</td>' + '<td>' + '<h3> Date </h3>'+ row.ppty_date +
	  '</td>' + '<td>' + '<h3> Notes </h3>'+ row.ppty_notes +
	  '</td>' + '<td>' + '<h3> Reporter </h3>' + row.ppty_reporter +
	  '</td>' + '<td>' + '<h3> VR </h3>' + '<a href="https://players.cupix.com/p/' + row.ppty_VR + '">VR </a>' +
	  '</td>'+ '<td>' + '<h3> Option </h3>'+ '<a href="#" onclick="deleteProperty(' + row.ppty_ID + ')">Delete</a></td></tbody></tr></table>');
    }
      
  }
}, errorHandler);
}, errorHandler, nullHandler);
return;
}

function addProperty() {
  if (!window.openDatabase) {
    alert('Database not loaded please use a compatible browser.');
    return;
  }
    
  if (!ValidateInput()) {
      return false;
  } 

  db.transaction(function(transaction) {
    transaction.executeSql('INSERT INTO `RentalzProperties`(`ppty_type`, `ppty_rooms`, `ppty_furniture_type`, `ppty_monthly_price`, `ppty_date`, `ppty_notes`, `ppty_reporter`, `ppty_VR`) VALUES (?,?,?,?,?,?,?,?)',[$('#selType').val(), $('#selRoom').val(), $('#selFurnish').val(), $('#intPrice').val(), $('#date').val(), $('#txtNotes').val(), $('#txtName').val(), $('#txtVR').val()],
    nullHandler, errorHandler);
  });
  alert("Your property has been successfully added. To view check the manage button below!");
  
  return true;
}

function ShowResults() {
    if (!window.openDatabase) {
        alert('Database not loaded please use a compatible browser.');
        return;
    }
    
    $('#searchResults searchTable').remove('');
    
    var pType = $('#selType').val();
    var nRoom = $('#selRoom').val();
    var fType = $('#selFurnish').val();
    var rPrice = $('#selPrice').val();
    
    db.transaction(function(transaction) {
        transaction.executeSql("SELECT * FROM `RentalzProperties` WHERE `ppty_type`=? AND `ppty_rooms`=? AND `ppty_furniture_type`=? AND `ppty_monthly_price`<=?;", [pType, nRoom, fType, rPrice],
        function(transaction, result){;
          if (result !== null && result.rows !== null) {

            for (var i = 0; i < result.rows.length; i++) {
              var row = result.rows.item(i);
              $('#searchResults #searchTable').append(
			  '<tr><tbody><td>' + '<h3> Property Type </h3>'+ row.ppty_type + 
			  '</td>' + '<td>' + '<h3> Number of Bedrooms </h3>' + row.ppty_rooms + 
			  '</td> ' + '<td>' + '<h3> Furnishing type </h3>'+ row.ppty_furniture_type + 
			  '</td> ' + '<td>' + '<h3> Monthly Rent Price </h3>'+ '£' +row.ppty_monthly_price + 
			  '</td>' + '<td>' + '<h3> Date </h3>'+ row.ppty_date + 
			  '</td>' + '<td>' + '<h3> Notes </h3>'+ row.ppty_notes + 
			  '</td>' + '<td>' + '<h3> Reporter </h3>' + row.ppty_reporter + 
			  '</td>' + '<td>' + '<h3> VR </h3>' + '<a href="https://players.cupix.com/p/' + row.ppty_VR + '">VR </a>' +
			  '</td>'+ '<td>' + '<h3> Edit Notes </h3>'+ '<a href="View.html?ppty_ID=' + row.ppty_ID + '">View</a></td></tbody></tr></table>');
            }
          }
}, errorHandler);
}, errorHandler, nullHandler);
return;
}

function refreshPage() {
    jQuery.mobile.changePage(window.location.href, {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}


function deleteProperty(id) {
    var c = window.confirm("Doing this will permanently remove this property, are you sure?");
    if (c == true) {
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM `RentalzProperties` WHERE `ppty_ID`=?;', [id], nullHandler, errorHandler);
        });
        
        window.location.reload();
    } else {
        return false;
    }
     
return;
}

function ValidateInput() {
    var strName = $('#txtName').val();
    var intRentPM = $('#intPrice').val();
    var dateValue = $('#date').val();
    
    if (!dateValue) {
        alert('Missing: Please include a date*');
        return false;
    }
    
    if (strName == "") {
        alert ('Missing: Please include your name*');
        return false;
    }
    
    if (intRentPM == ""){
        alert ('Missing: Please include your monthly rent price*');
        return false;
    }
    
    var rent = parseInt($('#intPrice').val(), 10);
    
    return true;
}



function getPropertyDetails() {    
    if (!window.openDatabase) {
        alert('Database not loaded please use a compatible browser.');
        return;
    }
    var x = getUrlVars()["ppty_ID"];

    db.transaction(function(transaction) {
        transaction.executeSql("SELECT * FROM `RentalzProperties` WHERE `ppty_ID`=?;", [x],
        function(transaction, result){;
            if (result !== null && result.rows !== null) {
            for (var i = 0; i < result.rows.length; i++) {
              var row = result.rows.item(i);
                $('#pDetails').append(
				'<br />' + '<h3> Property Type </h3>'+ row.ppty_type +
				'<br />' + '<h3> Number of Bedrooms </h3>'+ row.ppty_rooms +
				'<br />' + '<h3> Furnishing Type </h3>'+ row.ppty_furniture_type + 
				'<br />' + '<h3> Monthly Rent Price </h3>'+ '£' + row.ppty_monthly_price  + 
				'<br />' + '<h3> Date </h3>'+ row.ppty_date + 
				'<br />' + '<h3> Notes </h3>'+ row.ppty_notes + 
				'<br />' + '<h3> VR </h3>'+ row.ppty_VR +
				'<br />' + '<h3> Reporter Name </h3>'+ row.ppty_reporter);
                }
            }
        }, errorHandler);
}, errorHandler, nullHandler);
return;
}

function savePropertyNote() {
    var ppty_ID = getUrlVars()["ppty_ID"];
    var ppty_Note = $('#ppty_Note').val();
    db.transaction(function(transaction) {
    transaction.executeSql('UPDATE `RentalzProperties` SET `ppty_notes`= ? WHERE `ppty_ID` = ?',[ppty_Note, ppty_ID],
    nullHandler, errorHandler);
  });
    $(location).attr('href', 'View.html?ppty_ID=' + ppty_ID);
    return;

//Jaskaran Singh Natt
}