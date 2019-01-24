
function test()
{
  var rangeName = 'Sheet1!E2:F32';
  var range = SpreadsheetApp.getActiveSpreadsheet().getRange(rangeName);
  var values = range.getValues();
  centerMinDistance(values);
}

var EARTH_RADIUS = 3958.756;

function genTestPoints(point, dist)
{
  var result = [];
  var brng = Math.PI;
  for( var i =0; i<8; i++)
  {
    var brng = 2*Math.PI/8 * i;
    var φ2 = Math.asin( Math.sin( point[0] )*Math.cos(dist) +
                    Math.cos(point[0])*Math.sin(dist)*Math.cos(brng) );
    var λ2 = point[1] + Math.atan2(Math.sin(brng)*Math.sin(dist)*Math.cos(point[0]),
                         Math.cos(dist)-Math.sin(point[0])*Math.sin(φ2));
    ary = [φ2, λ2];
    result[i] = ary;
  }
  return result;
}

function centerMinDistance(values)
{
  var midPoint = geoMidpoint(values);
  Logger.log( midPoint[1] );
  Logger.log("midPoint = " + toDegrees(midPoint[0]) + ", " + toDegrees(midPoint[1]) );
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
    var testPoints = genTestPoints(curPoint, testDistance );
    for each (var t in testPoints )
    {
      var ptDistance = sumDistance(t[0], t[1], values);
      if( ptDistance < totalDistance )
      {
        totalDistance = ptDistance;
        curPoint = t;
        newPoint = 1;
        Logger.log("new center =" + curPoint );
      }
    }
    if( newPoint == 0 )
    {
      testDistance = testDistance / 2;
    }
  }  
  return curPoint;
}

function sphereDistance(lat1, lon1, lat2, lon2)
{
  var v =  Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2 - lon1));
  return v;
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
    var lat = r[0];
    var lng = r[1];
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
  return [lat_r, lng_r];
}

function sumDistance(px, py, input)
{
  var totalDistance = 0;
  for each (var r in input)
  {
    totalDistance = totalDistance + sphereDistance(px, py, r[0], r[1]);
  }
  return totalDistance;
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}


function arrayToDegrees(input)
{
  var result = [];
  for each (var r in input)
  {
    var row = [];
    for each (var c in r)
    {
      row.push( toDegrees(c) );
    }
    result.push(row);
  }
  return result;
}

function arrayToRadians(input)
{
  var result = [];
  for each (var r in input)
  {
    var row = [];
    for each (var c in r)
    {
      row.push( toRadians(c) );
    }
    result.push(row);
  }
  return result;
}



