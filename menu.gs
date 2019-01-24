// When user installs spreadsheet, add Spreadsheet Mapper menu. 
function onInstall() { 
  addSpreadsheetGeoMenu();  
}

// When user opens spreadsheet, add SpreadsheetMapper menu.
function onOpen() {
  addSpreadsheetGeoMenu(); 
}

function addSpreadsheetGeoMenu() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "add more rows", functionName: "add_More_Rows"},
                     {name: "remove some rows", functionName: "remove_Some_Rows"},
                     {name: "test", functionName: "test"}];
  ss.addMenu("Geo", menuEntries);
}

