
var EARTH_RADIUS = 3958.756;

/**
 * Generate eight test points around a center point N,NE,E,SE,S,SW,E,NW a specified distance from the center point
 *
 * @param {number} point in Radians           Description.
 * @param {type}   [var]         Description of optional variable.
 * @param {type}   [var=default] Description of optional variable with default variable.
 * @param {Object} objectVar     Description.
 * @param {type}   objectVar.key Description of a key in the objectVar parameter.
 * 
 * @return {type} Description.
 */
function gen8TestPoints(lat, lng, dist)
{
  φ1 = toRadians(lat);
  λ1 = toRadians(lng);
  
  var result = [];
  var brng = Math.PI;
  for( var i =0; i<8; i++)
  {
    var brng = 2*Math.PI/8 * i;
    var φ2 = Math.asin( Math.sin( φ1 )*Math.cos(dist) +
                    Math.cos(φ1)*Math.sin(dist)*Math.cos(brng) );
    var λ2 = λ1 + Math.atan2(Math.sin(brng)*Math.sin(dist)*Math.cos(φ1),
                         Math.cos(dist)-Math.sin(φ1)*Math.sin(φ2));
    ary = [toDegrees(φ2), toDegrees(λ2)];
    result[i] = ary;
  }
  return result;
}

function test()
{
  var rangeName = 'Sheet1!B2:C32';
  var range = SpreadsheetApp.getActiveSpreadsheet().getRange(rangeName);
  var values = range.getValues();

  Logger.log("in test()");
  centerMinimumDistance(values);
}

function centerMinDistance(values)
{
  var midPoint = geoMidpoint(values);
  var curPoint = midPoint;
  totalDistance = sumDistance(midPoint[0], midPoint[1], values);

  // check to see if one of the existing points it closer 
  for each (var r in values)
  {
    var ptDistance = sumDistance(r[0], r[1], values);
    if( ptDistance < totalDistance)
    {
      curPoint = r;
      totalDistance = ptDistance;
      Logger.log("test() -- NEW CLOSEST POINT " + r);
    }
  }
  
  var testDistance = Math.PI/2000;
  
  while( testDistance > 0.00000002 )
  {
    var newPoint = 0;
    var testPoints = gen8TestPoints(curPoint[0], curPoint[1], testDistance );
    for each (var t in testPoints )
    {
      var ptDistance = sumDistance(t[0], t[1], values);
      //Logger.log("ptDistance = " + ptDistance );
      if( ptDistance < totalDistance )
      {
        totalDistance = ptDistance;
        curPoint = t;
        newPoint = 1;
        Logger.log("new point = " + curPoint);
      }
    }
    if( newPoint == 0 )
    {
      testDistance = testDistance / 2;
      Logger.log("new test distance = " + testDistance);
    }
  }
  
  Logger.log("final point = " + curPoint);
  return curPoint;
  

    
}

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

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}


function sphereDistanceR(lat1, lon1, lat2, lon2)
{
  var v =  Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2 - lon1));
  //Logger.log("sphereDistance() = " + v);
  return v;
}

function sphereDistanceD(lat1, lon1, lat2, lon2)
{
  return sphereDistanceR( toRadians(lat1), toRadians(lon1), toRadians(lat2), toRadians(lon2));
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
      t_lat = t_lat + r[0];
      t_lng = t_lng + r[1];
      x = Math.cos(lat) * Math.cos(lng);
      y = Math.cos(lat) * Math.sin(lng);
      z = Math.sin(lat);
    
      t_x = t_x + x;
      t_y = t_y + y;
      t_z = t_z + z;
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

function distanceBetweenPoints(p1x, p1y, p2x, p2y)
{
   
  var val = Math.sqrt( (p1x - p2x)*(p1x - p2x) + (p1y - p2y)*(p1y - p2y));
  return val;
}

function sumDistance(px, py, input)
{
  var totalDistance = 0;
  for each (var r in input)
  {
    totalDistance = totalDistance + sphereDistanceD(px, py, r[0], r[1]);
  }
  //Logger.log( "sumDistance() = " + totalDistance );
  return totalDistance;
}

function geoMinDistance(input)
{
  var start = geoMidpoint(input);
  var s_lat = start[0];
  var s_lng = start[1];
  
  return sumDistance(s_lat, s_lng, input);
  
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
