var contents;
var logging = [];
var markers = [];
var numQuestion = 0;
var totalDist = 0;
var previousDist = 0;

var totalTime = 0;
var map;
var pointsDB = new Array(); //Database of all points
var points = new Array(); //Points that are shown

var canvasFOV = document.getElementById("canvasFOV");
canvasFOV.setAttribute('width', window.innerWidth);
canvasFOV.setAttribute('height', window.innerHeight);
var ctxFOV = canvasFOV.getContext("2d");

var canvasCompass = document.getElementById("canvasCompass");
var ctxCompass = canvasCompass.getContext("2d");

var canvasWedge = document.getElementById("canvasWedge");
canvasWedge.setAttribute('width', window.innerWidth);
canvasWedge.setAttribute('height', window.innerHeight);

var canvasLabels = document.getElementById("canvasLabels");
canvasLabels.setAttribute('width', window.innerWidth);
canvasLabels.setAttribute('height', window.innerHeight);
var ctxLabels = canvasLabels.getContext("2d");

var ctxWedge = canvasWedge.getContext("2d");

var pcompass = new PCompass(0, 0, 0, 0, innerWidth / 16);
var wedge = new Wedge();
document.getElementById('questionMap').style.pointerEvents = 'none';
document.getElementById('compass').style.pointerEvents = 'none';

function initMap() {
  map = new google.maps.Map(document.getElementById('questionMap'), {
    center: {
      lat: 40.7127,
      lng: -74.0079
    }, // New York
    zoom: 17,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    streetViewControl: false,
    disableDefaultUI: true,


  });

  answerMap = new google.maps.Map(document.getElementById('answerMap'), {
    center: {
      lat: 40.7127,
      lng: -74.0079
    }, // New York
    zoom: 2
  });


  answerMap.setOptions({
    draggableCursor: "url(http://rogcommunity.com/forums/images/awards/waldo.png) 10 50, auto"
  })

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('overlay'));

  var POI = map.getCenter();
  var numClicks;

  google.maps.event.addListener(answerMap, 'click', function(event) {
    previousDist = totalDist;
    placeMarker(event.latLng);
    dist = getDistance(map.getCenter(), event.latLng)
    userAnswer = event.latLng;
    errorDetail = [map.getCenter(), event.latLng]
    totalDist += dist;
    document.getElementById("modal-text").innerHTML =
     'You were only off by: ' + dist.toFixed(3) + ' km';
    $('#myDialog').modal('show')
    // document.getElementById("myDialog").showModal();
    document.getElementById('answerMap').style.pointerEvents = 'none';

  });

  function placeMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: answerMap,
      icon: 'http://rogcommunity.com/forums/images/awards/waldo.png'
    });
    markers.push(marker)
  }


  // Compute Latitude and Longitude of center, dynamically computes distance and angle from marker
  google.maps.event.addListener(map, 'center_changed', function() {
    reDraw();
  });

  google.maps.event.addListener(map, 'zoom_changed', function() {
    reDraw();
  });

}
var reDraw = function() {
  var center = map.getCenter();
  var distanceToCompass;
  clearAllCtx();
  ctxCompass.clearRect(0, 0, canvasCompass.width, canvasCompass.height);
  ctxWedge.clearRect(0, 0, canvasWedge.width, canvasWedge.height);
  bounds = map.getBounds();
  minDistance = Infinity;
  pcompass.drawCompass();
  for (var i in pointsDB) {
    pointsDB[i].distance = getDistance(center, pointsDB[i].latlng);
    pointsDB[i].angle = getAngle(center, pointsDB[i].latlng);
  }

  for (var i in points) {
    if (points[i].distance < minDistance && !bounds.contains(points[i].latlng))
      minDistance = points[i].distance;

    point = fromLatLngToPoint(points[i].latlng.lat(), points[i].latlng.lng(), map);
    centerpt = fromLatLngToPoint(center.lat(), center.lng(), map)
    distanceToCompass = Math.sqrt((Math.pow(parseInt(pcompass.x) - point.x, 2)) + (Math.pow(parseInt(pcompass.y) - point.y, 2)))
  }
  pcompass.drawFOV(distanceToCompass, innerHeight / 2);
  if (arguments[0] === 'PCompass') pcompass.drawNeedles();
  else if (arguments[0] === 'Wedge') wedge.drawWedges();
}

//Haversine formula to calculate distance
var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
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
var getAngle = function(p1, p2) {
  brng = Math.atan2(p2.lat() - p1.lat(), p2.lng() - p1.lng());
  brng = brng * (180 / Math.PI);
  brng = (brng + 360) % 360;
  return brng
}


var selectPOI = function(allPoints, k) {
  //Select the closest POI
  points = [];
  var center = map.getCenter();
  minDist = Infinity;
  minIndex = Infinity;
  for (var i in allPoints) {
    allPoints[i].distance = getDistance(center, allPoints[i].latlng);
    allPoints[i].angle = getAngle(center, allPoints[i].latlng);

    if (allPoints[i].distance < minDist && (!map.getBounds().contains(allPoints[i].latlng))) {
      minIndex = i;
      minDist = allPoints[i].distance;
    }
  }
  points.push(allPoints[minIndex]);
  var angleInterval = 360 / k;
  var margin = 30;
  var currentAngle = angleInterval;
  var pointsAdded = 1;

  while (currentAngle < 360) {
    for (var i in allPoints) {
      if (Math.abs(allPoints[i].angle - currentAngle) < margin) {
        points.push(allPoints[i]);
        pointsAdded++;
        if (pointsAdded >= k) {
          return;
        }
      }
    }
    currentAngle += angleInterval;
  }
}

var createMarker = function(POI, name) {
  var marker = new google.maps.Marker({
    position: POI,
    map: map
  });

  infowindow = new google.maps.InfoWindow({
    content: name,
    disableAutoPan: true
  });
  infowindow.open(map, marker);
  var center = map.getCenter();
  distance = getDistance(center, POI);
  angle = getAngle(center, POI);
  var latlng = new google.maps.LatLng(POI.lat(), POI.lng())
  pointsDB.push({
    'name': name,
    'distance': distance,
    'angle': angle,
    'latlng': latlng
  });
  //Add probability that user knows this location
  selectPOI(pointsDB, 3);
  clearAllCtx();
  pcompass.drawCompass();
  pcompass.drawNeedles();
  return POI;
}

var populateDB = function() {
  var newYork = new google.maps.LatLng(40.7127, -74.0079);
  var request = {
    location: newYork,
    radius: '50000',
    types: ['store', 'airport', 'university'],
    rankBy: google.maps.places.RankBy.PROMINENCE
  }; // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length / 2; i++) {
        var place = results[i];
        var name = place.name;
        //createMarker(place.geometry.location, name);
      }
    }
  });
}

var selected = null, // Object of the element to be moved
  x_pos = 0,
  y_pos = 0, // Stores x & y coordinates of the mouse pointer
  x_elem = 0,
  y_elem = 0; // Stores top, left values (edge) of the element

// Will be called when user starts dragging an element
function _drag_init(elem) {
  // Store the object of the element which needs to be moved
  selected = elem;
  x_elem = x_pos - selected.offsetLeft;
  y_elem = y_pos - selected.offsetTop;
}

// Will be called when user dragging an element
function _move_elem(e) {
  x_pos = document.all ? window.event.clientX : e.pageX;
  y_pos = document.all ? window.event.clientY : e.pageY;
  if (selected !== null) {
    selected.style.left = (x_pos - x_elem) + 'px';
    selected.style.top = (y_pos - y_elem) + 'px';
    pcompass.x = selected.style.left;
    pcompass.y = selected.style.top;
  }
}

// Destroy the object when we are done
function _destroy() {
  selected = null;
}

// Bind the functions...
document.getElementById('compass').onmousedown = function() {
  ctxLabels.clearRect(0, 0, window.innerWidth, window.innerHeight);
  _drag_init(this);
  return false;
};

document.getElementById('compass').onmouseup = function() {
  reDraw();
  return false;
};

document.onmousemove = _move_elem;
document.onmouseup = _destroy;
pcompass.drawCompass();

//*FUNCTIONS FOR THE GAME*//
var start;
var end;
document.getElementById('answerMap').style.pointerEvents = 'none';

function startGame() {
  var socket = io.connect();
  socket.on('getGame', function(data) {
    contents = data;
    (function() {
      start = new Date().getTime();

      if (numQuestion == 0)
        nextQuestion();
    })();
  });
};


function nextQuestion() {
  if (previousDist == totalDist && numQuestion > 0) {
    alert("You didn't place Waldo!");
    return;
  }

  points = [];
  document.getElementById('answerMap').style.pointerEvents = 'auto';

  if (numQuestion > 0) {
    end = new Date().getTime();
    timeElapsed = (end - start) / 1000;
    totalTime = totalTime + timeElapsed;
    start = end
    logging.push(timeElapsed);
    logging.push(contents[numQuestion - 1][0][2]);
    logging.push(map.getCenter().lat());
    logging.push(map.getCenter().lng());
    logging.push(userAnswer.lat());
    logging.push(userAnswer.lng());
    answerPoint = fromLatLngToPoint(map.getCenter().lat(), map.getCenter().lng(), answerMap)
    userPoint = fromLatLngToPoint(userAnswer.lat(), userAnswer.lng(), answerMap)
    logging.push(answerPoint.x)
    logging.push(answerPoint.y)
    logging.push(userPoint.x)
    logging.push(userPoint.y)
    logging.push(map.getZoom())
  }


  if (numQuestion == contents.length) {

    alert("You were off by a total of " + totalDist.toFixed(3) + " km! \n" +
      "You took " + totalTime + " seconds!");
    document.getElementById('answerMap').style.pointerEvents = 'none';
    var socket = io.connect();
    socket.emit('gameResults', logging);
    return;
  }


  newLocation = new google.maps.LatLng(contents[numQuestion][0][0].lat,
    contents[numQuestion][0][0].lng);

  map.setZoom(contents[numQuestion][0][1])
  map.panTo(newLocation);

  createPOIs();
  reDraw(contents[numQuestion][0][2]);
  numQuestion++;
  previousDist = totalDist;
}

function getDestination(center, brng, dist) {
  dist = dist / 6371;
  brng = rad(brng);
  var lat1 = rad(center.lat()),
    lon1 = rad(center.lng());
  var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
    Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
  var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
    Math.cos(lat1),
    Math.cos(dist) - Math.sin(lat1) *
    Math.sin(lat2));
  if (isNaN(lat2) || isNaN(lon2)) return null;
  return new google.maps.LatLng(deg(lat2), deg(lon2));
}

function createPOIs() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  for (var i = 1; i < contents[numQuestion].length; i++) {
    var angle = contents[numQuestion][i][1];
    var distance = contents[numQuestion][i][0];
    var center = map.getCenter();
    var markerLocation = getDestination(center, angle, distance);
    var marker = new google.maps.Marker({
      position: markerLocation,
      map: answerMap,
    });
    markers.push(marker);
    distance = getDistance(center, markerLocation);
    angle = getAngle(center, markerLocation);
    points.push({
      'name': '',
      'distance': distance,
      'angle': angle,
      'latlng': markerLocation,
      'rating': 5.0
    });
  }
}

function fromLatLngToPoint(lat, lng, map) {
  latLng = new google.maps.LatLng(lat, lng);
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
  pointTemp = new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
  return pointTemp;
}

function clearAllCtx() {
  ctxFOV.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxCompass.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxWedge.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxLabels.clearRect(0, 0, window.innerWidth, window.innerHeight);
}