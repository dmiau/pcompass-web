game = []

// var socket = io.connect('http://localhost:3000');
var socket = io.connect();

// $('#authorGame').click(function() {
//   socket.emit('authorGame', game);
// })

var placeNames = [];
var placeLatLngs = [];

var numFields;
var questionCount = 0;
$(document).ready(function() {
  var max_fields = 10; //maximum input boxes allowed
  var wrapper = $(".input_fields_wrap"); //Fields wrapper
  var add_button = $(".add_field_button"); //Add button ID

  //initlal text box count
  $(add_button).click(function(e) { //on add input button click
    e.preventDefault();
    if (numFields < max_fields) { //max input box allowed
      numFields++; //text box increment
      var inputWrapper= document.createElement('div');
      inputWrapper.innerHTML= '<div class = "row"><input class="form-control" id="place_' + numFields + 
      '" placeholder="Ex: New York, Columbia University"><a href="#" class="remove_field">Remove</a></div>';
      var newBox= inputWrapper.firstChild;
      console.log(newBox);
      $(wrapper).append(newBox); //add input box

      console.log('numFields' + numFields)

      var searchBox_new = new google.maps.places.SearchBox(newBox.firstChild);

      map.addListener('bounds_changed', function() {
        searchBox_new.setBounds(map.getBounds());
      });

      searchBox_new.addListener('places_changed', function() {
        var places = searchBox_new.getPlaces();
        if (places.length == 0) {
          return;
        }
        // For each place, get the icon, name and location
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          console.log(place);
          placeNames.push(place.name);
          placeLatLngs.push(place.geometry.location);
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        // map.fitBounds(bounds);
      });
}
    
  });
  $(wrapper).on("click", ".remove_field", function(e) { //user click on remove text
    e.preventDefault();
    $(this).parent('div').remove();
    numFields--;
  })
});

function toRad(deg) {
  return deg * Math.PI / 180;
}

function toDeg(rad) {
  return rad * 180 / Math.PI;
}

function getDestination(center, brng, dist) {
  dist = dist / 6371;
  brng = toRad(brng);
  var lat1 = toRad(center.lat()),
    lon1 = toRad(center.lng());
  var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
    Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
  var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
    Math.cos(lat1),
    Math.cos(dist) - Math.sin(lat1) *
    Math.sin(lat2));
  if (isNaN(lat2) || isNaN(lon2)) return null;
  return new google.maps.LatLng(toDeg(lat2), toDeg(lon2));
}


function submit() {
  var modes = ['PCompass','Wedge'];
  var mode = modes[Math.floor(Math.random() * 2)]
  console.log(mode);
  points = []
  clearAllCtx();
  pcompass.drawCompass();
  question = []
  var elem = document.getElementById('center');
  question.push([map.getCenter(), map.getZoom(), mode])
  for (var i = 0; i < placeNames.length; i++) {
    var point = []
    //var id = "place_" + i;
    // var elem = document.getElementById(id);
    point.push(placeNames[i])
    // var id = "angle_" + i;
    // elem = document.getElementById(id);
    point.push(placeLatLngs[i])
    question.push(point);
  }
  game.push(question)
  questionCount = questionCount + 1;
  $("#success").html("Question number " + questionCount + " added!");
}

// function exportSuccess() {


// }


function preview() {
  points = [];
  console.log(placeLatLngs)
  for (var i = 0; i < placeNames.length; i++) {

    var center = map.getCenter();
    console.log(placeLatLngs[i])
    distance = getDistance(center, placeLatLngs[i]);
    angle = getAngle(center, placeLatLngs[i]);
    points.push({
      'name': '',
      'distance': distance,
      'angle': angle,
      'latlng': placeLatLngs[i],
      'rating': 5.0
    });
  }
  console.log(points)

  // pcompass.drawNeedles();
  // wedge.drawWedges();
  reDraw();
}
var markers = [];
var panorama; //Streetview
var map;
var pointsDB = new Array(); //Database of all points
var points = new Array(); //Points that are shown
var canvasCompass = document.getElementById("canvasCompass");
var ctxCompass = canvasCompass.getContext("2d");

var canvasFOV = document.getElementById("canvasFOV");
canvasFOV.setAttribute('width', window.innerWidth);
canvasFOV.setAttribute('height', window.innerHeight);
var ctxFOV = canvasFOV.getContext("2d");

var canvasWedge = document.getElementById("canvasWedge");
canvasWedge.setAttribute('width', window.innerWidth);
canvasWedge.setAttribute('height', window.innerHeight);
var ctxWedge = canvasWedge.getContext("2d");

var canvasLabels = document.getElementById("canvasLabels");
canvasLabels.setAttribute('width', window.innerWidth);
canvasLabels.setAttribute('height', window.innerHeight);
var ctxLabels = canvasLabels.getContext("2d");

var pcompass = new PCompass(0, 0, 0, 0, innerWidth / 16);
var wedge = new Wedge();
var canvasCompass = document.getElementById('canvasCompass');
canvasCompass.width = 2 * pcompass.r;
canvasCompass.height = 2 * pcompass.r;

function initMap() {
  numFields = 0;
  var newYork = new google.maps.LatLng(40.7127, -74.0079);
  map = new google.maps.Map(document.getElementById('map'), {
    center: newYork, // New York
    zoom: 15
  });
  k = 3;
  //selectPOI(pointsDB); 

  panorama = map.getStreetView();
  //console.log(map.getCenter());
  panorama.setPov( /** @type {google.maps.StreetViewPov} */ ({
    heading: 0,
    pitch: 0
  }));


  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input2');
  var searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });


  var input_0 = document.getElementById('place_0');
  var searchBox_0 = new google.maps.places.SearchBox(input_0);
  // console.log(input_0)
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox_0.setBounds(map.getBounds());
  });

  searchBox_0.addListener('places_changed', function() {
    var places = searchBox_0.getPlaces();
    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      console.log(place);
      placeNames.push(place.name);
      placeLatLngs.push(place.geometry.location);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    // map.fitBounds(bounds);
  });





  // check();

  google.maps.event.addListener(panorama, "position_changed", function() {
    map.setCenter(panorama.getPosition());
    streetViewReDraw();
  });

  google.maps.event.addListener(panorama, "pov_changed", function() {
    streetViewReDraw()
  });

  var streetViewReDraw = function() {
      clearAllCtx();
      for (var i in points) {
        points[i].angle = points[i].angle + panorama.getPov().heading;
      }
      pcompass.drawCompass();
      pcompass.drawNeedles()
      for (var i in points) {
        points[i].angle = points[i].angle - panorama.getPov().heading;
      }
      //Draw the north arrow
      pcompass.drawNeedle("", Infinity, 90 + panorama.getPov().heading, '#A8A8A8');
    }
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
  google.maps.event.addDomListener(input, 'keydown', function(e) {
    if (e.keyCode == 13) {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }
  });

  searchBox.addListener('places_changed', function() {
    placeNames = []
    placeLatLngs = []
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  var POI = map.getCenter();

  //Create marker, get Latitude and Longitude on click
  google.maps.event.addListener(map, 'click', function(event) {
    POI = event.latLng;
    var name = 'Marker'
    marker = new google.maps.Marker({
      position: event.latLng,
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
      'latlng': latlng,
      'show': true
    });

    x_coord = parseInt(pcompass.x) + pcompass.r;
    y_coord = parseInt(pcompass.y) + pcompass.r;
    compass_center = fromPointToLatLng(x_coord, y_coord, map);

    reDraw();

    selectPOI(pointsDB, compass_center);

    pcompass.drawNeedles();
    return POI;
  });

  google.maps.event.addListener(map, 'center_changed', function() {
    reDraw();
  });

  google.maps.event.addListener(map, 'zoom_changed', function() {
    reDraw();
  });
};

var check = function() {
  checkboxes = document.getElementsByTagName("input");

  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    checkbox.onclick = function() {
      var currentRow = this.parentNode.parentNode;
      var secondColumn = currentRow.getElementsByTagName("td")[0];
      if (secondColumn == undefined)
        return


      reDraw();
    };
  }
}
var reDraw = function() {
  var center = map.getCenter();
  clearAllCtx();
  bounds = map.getBounds();
  minDistance = Infinity;
  x_coord = parseInt(pcompass.x) + pcompass.r;
  y_coord = parseInt(pcompass.y) + pcompass.r;
  compass_center = fromPointToLatLng(x_coord, y_coord, map);
  distanceToCompass = 0;
  if (points[0] !== undefined) {
    for (var i in points) {
      if (points[i].distance < minDistance && !bounds.contains(points[i].latlng))
        minDistance = points[i].distance;
      point = fromLatLngToPoint(points[i].latlng.lat(), points[i].latlng.lng(), map);
      centerpt = fromLatLngToPoint(center.lat(), center.lng(), map)
      distanceToCompass = Math.sqrt((Math.pow(parseInt(pcompass.x) - point.x, 2)) + (Math.pow(parseInt(pcompass.y) - point.y, 2)))
      distanceToCenter = Math.sqrt((Math.pow(centerpt.x - point.x, 2)) + (Math.pow(centerpt.y - point.y, 2)))
    }
  }

  pcompass.drawCompass();
  pcompass.drawFOV(distanceToCompass, innerHeight);
  console.log(distanceToCompass);
  wedge.drawWedges();
  pcompass.drawNeedles();


};

//Haversine formula to calculate distance
var rad = function(x) {
  return x * Math.PI / 180;
};

//Distance between to latlng objects
function getDistance(p1, p2) {
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
  var heading = google.maps.geometry.spherical.computeHeading(p2, p1);
  heading = (heading + 360 + 90) % 360;
  heading = 360 - heading;
  return heading;
};


var selectPOI = function(allPoints, center) {

  points = [];

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
  var margin = 15;
  var spacing = 30
  var currentAngle = angleInterval;
  var pointsAdded = 1;
  var pointInInterval;

  if (allPoints = [])
    return

  while (currentAngle < 360) {

    pointInInterval = false;
    for (var i in allPoints) {
      if (Math.abs(allPoints[minIndex].angle - allPoints[i].angle) >= spacing) {
        if (Math.abs(allPoints[i].angle - currentAngle) < margin && pointInInterval == false) {
          // console.log(map.getBounds(), allPoints[i])
          if (map.getBounds().contains(allPoints[i].latlng)) {
            continue;
          } else {
            points.push(allPoints[i]);
            pointsAdded++;
            pointInInterval = true;
            if (pointsAdded >= k) {
              return;
            }
          }
        }
      }
    }

    currentAngle += angleInterval;
  }


};

var socket = io.connect();
socket.on('news', function(data) {
  console.log(data);
})

$('#exportGame').click(function() {
var filename = prompt("Please enter file name", "data.json");
  
  $("#success").html("Exported!");
  socket.emit('authorGame', {'game': game, 'filename': filename});
})



var contains = function(point) {

  for (var i in pointsDB) {
    if (point.name == pointsDB[i].name)
      return true;
  }
  return false;
}

function createMarker(place) {
  var name = place.name;
  var rating = place.rating;
  var POI = place.geometry.location;
  var contentString;

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

  service.getDetails({
    placeId: place.place_id
  }, function(place, status) {


    if (status === 'OVER_QUERY_LIMIT') {
      contentString = '<div>' +
        '<h4 id="firstHeading" class="firstHeading">' + name + '</h4>' +
        '</div>';


      var marker = new google.maps.Marker({
        position: POI,
        map: map,
        title: name,
        snippet: contentString

      });

      var infowindow = new google.maps.InfoWindow({
        content: name,
        disableAutoPan: true
      });
      infowindow.open(map, marker);
      infowindowDetail = new google.maps.InfoWindow({
        content: marker.snippet,
        maxWidth: 350,
        disableAutoPan: true,
      });
      marker.addListener('click', function() {
        infowindowDetail.setContent(this.snippet)
        infowindowDetail.setZIndex(10);
        infowindowDetail.open(map, this);
      });
      var center = map.getCenter();
      distance = getDistance(center, POI);
      angle = getAngle(center, POI);
      var latlng = new google.maps.LatLng(POI.lat(), POI.lng())
      pointsDB.push({
        'name': name,
        'distance': distance,
        'angle': angle,
        'latlng': latlng,
        'show': true,
        'rating': rating
      });


      //Add probability that user knows this location
      x_coord = parseInt(pcompass.x) + pcompass.r;
      y_coord = parseInt(pcompass.y) + pcompass.r;
      compass_center = fromPointToLatLng(x_coord, y_coord, map);

      selectPOI(pointsDB, compass_center);

      markers.push(marker);
      return marker;
    }

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // console.log(name);
      contentString = '<div>' +
        '<h4 id="firstHeading" class="firstHeading">' + name + '</h4>' +
        '<p>' + place.formatted_address + '</p>' +
        '<p>' + place.formatted_phone_number + '</p>' +
        '<a href=' + place.website + '>+' + place.website + '</a>' +
        '<div>' + '<img src="' + place.photos[0].getUrl({
          'maxWidth': 150,
          'maxHeight': 150
        }) + ' alt="some_text" >' +

        '<img src="' + place.photos[1].getUrl({
          'maxWidth': 150,
          'maxHeight': 150
        }) + ' alt="some_text" >' +
        '</div>' +
        '</div>';

      var marker = new google.maps.Marker({
        position: POI,
        map: map,
        title: name,
        snippet: contentString

      });

      var infowindow = new google.maps.InfoWindow({
        content: place.name,
        disableAutoPan: true
      });
      infowindow.open(map, marker);
      infowindowDetail = new google.maps.InfoWindow({
        content: marker.snippet,
        maxWidth: 350,
        disableAutoPan: true,
      });
      marker.addListener('click', function() {
        infowindowDetail.setContent(this.snippet)
        infowindowDetail.setZIndex(10);
        infowindowDetail.open(map, this);
      });
      var center = map.getCenter();
      distance = getDistance(center, POI);
      angle = getAngle(center, POI);
      var latlng = new google.maps.LatLng(POI.lat(), POI.lng())
      pointsDB.push({
        'name': name,
        'distance': distance,
        'angle': angle,
        'latlng': latlng,
        'show': true,
        'rating': rating
      });


      //Add probability that user knows this location
      x_coord = parseInt(pcompass.x) + pcompass.r;
      y_coord = parseInt(pcompass.y) + pcompass.r;
      compass_center = fromPointToLatLng(x_coord, y_coord, map);

      selectPOI(pointsDB, compass_center);

      markers.push(marker);
      return marker;
    }
  });
};



function fromLatLngToPoint(lat, lng, map) {
  latLng = new google.maps.LatLng(lat, lng);
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
  pointTemp = new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
  return pointTemp;
}

function fromPointToLatLng(x, y, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
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
  // console.log('moving');
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
  _drag_init(this);
  ctxWedge.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxFOV.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxLabels.clearRect(0, 0, window.innerWidth, window.innerHeight);

  //clearAllCtx();
  return false;
};
document.getElementById('compass').onmouseup = function() {
  reDraw();
  return false;
};
document.onmousemove = _move_elem;
document.onmouseup = _destroy;
pcompass.drawCompass();

document.getElementById('compass').addEventListener('touchstart', function() {
  _drag_init(this);
  // console.log('touch start');
  ctxWedge.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxFOV.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxLabels.clearRect(0, 0, window.innerWidth, window.innerHeight);
  //clearAllCtx();
  return false;
});
document.getElementById('compass').addEventListener('touchend', function() {
  reDraw();
  // console.log('touch end')
  return false;
});

// document.addEventListener('touchmove',_move_elem);
document.getElementById('compass').addEventListener('touchend', _destroy);

document.getElementById('compass').addEventListener('touchmove', function(event) {
  // If there's exactly one finger inside this element
  if (event.targetTouches.length == 1) {
    var touch = event.targetTouches[0];
    // Place element where the finger is
    selected.style.left = (touch.pageX - 25) + 'px';
    selected.style.top = (touch.pageY - 80) + 'px';
  }
}, false);

function clearAllCtx() {
  ctxCompass.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxWedge.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxFOV.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxLabels.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function toggleStreetView() {
  panorama.setPosition(map.getCenter());
  var toggle = panorama.getVisible();
  if (toggle == false) {
    panorama.setVisible(true);
  } else {
    panorama.setVisible(false);
  }
}