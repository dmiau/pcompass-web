function rad(x) {
  return x * Math.PI / 180;
};

function deg(x) {
  return x * 180 / Math.PI;
};

function clearAllCtx() {
  ctxCompass.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxWedge.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxFOV.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxLabels.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

//Distance between to latlng objects
getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d / 1000; // returns the distance in KILOmeter
};

//Calculate angle
getAngle = function(p1, p2) {
  var heading = google.maps.geometry.spherical.computeHeading(p2, p1);
  heading = (heading + 360 + 90) % 360;
  heading = 360 - heading;
  return heading;
};