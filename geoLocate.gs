function geoLocate(input) {
  var response = Maps.newGeocoder().setBounds(40.66661, -74.16792, 40.78526, -73.78202).geocode( input );
  Logger.log(response);  
  return response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng;
}
