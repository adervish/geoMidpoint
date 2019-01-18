
/*function geoLocate() {
  //var spreadsheetId = '1743HV5Mt01NaB5r_QjgsVjjsFEcXQIYFTeqUVzuGFBE';
  var rangeName = 'Form Responses 1!A2:J30';
  var range = SpreadsheetApp.getActiveSpreadsheet().getRange(rangeName);
  var values = range.getValues();

  //var values = Sheets.Spreadsheets.Values.get(spreadsheetId, rangeName).values;
  if (!values) {
    Logger.log('No data found.');
  } else {
    Logger.log('Name, Major:');
    for (var row = 0; row < values.length; row++) {
      // Print columns A and E, which correspond to indices 0 and 4.
      Logger.log(' - %s, %s', values[row][2], values[row][3]);
      
      var response = Maps.newGeocoder()
    // The latitudes and longitudes of southwest and northeast corners of Colorado, respectively.
    .setBounds(40.66661, -74.16792, 40.78526, -73.78202)
    .geocode(values[row][2] + ' and ' + values[row][3] + ' ' + values[row][3] + ' ' + values[row][4] );
      
      
      values[row][8] = response.results[0].geometry.location.lat;
      values[row][9] = response.results[0].geometry.location.lng;
      range.setValues(values);

     Logger.log(response.results[0].geometry.location );

    }
  }
}*/

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

function distance(lat1, lon1, lat2, lon2)
{
  return Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2 - lon1));
}

function geoMidpoint(input) 
{
  var t_lat = 0;
  var t_lng = 0;
  
  var t_x = 0;
  var t_y = 0;
  var t_z = 0;
  
  var len = 0;
  
  for each (var r in input)
  {
    var lat = r[0] * Math.PI/180;
    var lng = r[1] * Math.PI/180;
    if ( ! isNaN(lat) && ! isNaN(lng) )
    {
      t_lat += r[0];
      t_lng += r[1];
      x = Math.cos(lat) * Math.cos(lng);
      y = Math.cos(lat) * Math.sin(lng);
      z = Math.sin(lat);
    
      t_x += x;
      t_y += y;
      t_z += z;
      len++;
    }
  } 
  
  t_x = t_x / len;
  t_y = t_y / len;
  t_z = t_z / len;
  
  var lat_r;
  var lng_r;
  lng_r = Math.atan2(t_y, t_x);
  var hyp = Math.sqrt(t_x * t_x + t_y * t_y);
  lat_r = Math.atan2(t_z, hyp);
  
  lat_r = lat_r * (180/Math.PI);
  lng_r = lng_r * (180/Math.PI);
  
  var ret = [];
  ret['lat'] = lat_r;
  ret['lng'] = lng_r;
  //return ret;
  return [lat_r, lng_r];
}

function geoMinDistance(input)
{
  var start = geoMidpoint(input);
  var s_lat = start[0];
  var s_lng = start[1];
  
  var testDistance = Math.PI / 2;
  while (testDistance > 0.00000002 )
  {
    testDistance = testDistance / 2;
  }
  
}


function geoLocate(input) {
  var response = Maps.newGeocoder().setBounds(40.66661, -74.16792, 40.78526, -73.78202).geocode( input );
  Logger.log(response);  
  return response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng;
}
