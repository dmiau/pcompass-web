//'use strict';
var markers = []; /* List of markers on the map */
var locked = false
var panorama; /* Streetview */
var map;
var pointsDB = new Array(); /* Database of all points */
var points = new Array(); /* Points that are shown */
var tablePoints = []; /* Points displayed on the table */
var canvasCompass = document.getElementById("canvasCompass");
var ctxCompass = canvasCompass.getContext("2d");

var navHeight = $('.navbar').height(); 
var mapHeight = window.innerHeight - navHeight;
$('#maps').css('height', mapHeight);

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

document.getElementById("wrapper3").style.display = "none";
document.getElementById("wrapper").style.width = "100%";

function toggleTable() {
  if (document.getElementById("wrapper3").style.display == "initial") {
    document.getElementById("wrapper3").style.display = "none";
    document.getElementById("wrapper").style.width = "100%";
  } else {
    document.getElementById("wrapper3").style.display = "initial";
    document.getElementById("wrapper").style.width = "80%";
  }
}

function initMap() {
  var newYork = new google.maps.LatLng(40.7127, -74.0079);
  map = new google.maps.Map(document.getElementById('map'), {
    center: newYork, // New York
    zoom: 15
  });
  populateDB();
  k = 3;
  panorama = map.getStreetView();
  panorama.setPov( /** @type {google.maps.StreetViewPov} */ ({
    heading: 0,
    pitch: 0
  }));

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
    var navHeight = $('.navbar').height(); 
var mapHeight = window.innerHeight - navHeight;
$('#maps').css('height', mapHeight);

  });

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
  searchBox.addListener('places_changed', function() {
    tablePoints = [];
    pointsDB = [];
    points = [];
    markers = [];
    var places = searchBox.getPlaces();
    var Table = document.getElementById("tbodyid");
    Table.innerHTML = "";
    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      name = place.name
      rating = place.rating;
      POI = place.geometry.location;

      createMarker(place);
      distance = getDistance(map.getCenter(), POI);
      angle = getAngle(map.getCenter(), POI);
    });
    // map.fitBounds(bounds);
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
    distance = getDistance(map.getCenter(), POI);
    angle = getAngle(map.getCenter(), POI);
    var latlng = new google.maps.LatLng(POI.lat(), POI.lng())
    pointsDB.push({
      'name': name,
      'distance': distance,
      'angle': angle,
      'latlng': latlng,
      'show': true
    });
    tablePoints.push({
      'name': name,
      'distance': distance,
      'angle': angle,
      'latlng': latlng,
      'show': true
    });
    //Add probability that user knows this location
    x_coord = parseInt(pcompass.x) + pcompass.r;
    y_coord = parseInt(pcompass.y) + pcompass.r;
    compass_center = fromPointToLatLng(x_coord, y_coord, map);
    var isCentroidChecked = document.getElementById('centroidCheck').checked;
    if (isCentroidChecked) {
      reDraw();
      selectPOI(pointsDB, center);
    } else {
      selectPOI(pointsDB, compass_center);
    }
    pcompass.drawNeedles();
    return POI;
  });

  // Compute Latitude and Longitude of center, dynamically computes distance and angle from marker
  google.maps.event.addListener(map, 'center_changed', function() {
    reDraw();
  });

  google.maps.event.addListener(map, 'zoom_changed', function() {
    reDraw();
  });
};

// var tablePoints = pointsDB;
var check = function() {
  checkboxes = document.getElementsByTagName("input");
  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    checkbox.onclick = function() {
      if (locked == false) {
        points = []
      }
      var currentRow = this.parentNode.parentNode;
      var secondColumn = currentRow.getElementsByTagName("td")[0];
      // if (checkbox.checked) 
      if (secondColumn == undefined)
        return
      if (document.getElementById(secondColumn.textContent).checked) {
        locked = true
        // for (var j in tablePoints) {
        //   if (secondColumn.textContent == tablePoints[j].name) {
        //     console.log(tablePoints)
        //     tablePoints.splice(j, 1);
        //   }
        // }
        for (var k in pointsDB) {
          if (secondColumn.textContent == pointsDB[k].name) {
              points.push(pointsDB[k]);
          }
        }
      }
      else{
        for (var k in points) {
          if (secondColumn.textContent == points[k].name) {
              points.splice(k, 1);
          }
        }
        if (points.length == 0) {
          locked = false
        }
      }
      

      // else {
      //   for (var k in pointsDB) {
      //     if (secondColumn.textContent == pointsDB[k].name) {
      //       tablePoints.push(pointsDB[k]);
      //     }
      //   }
      // }
      reDraw();
    };
  }
}
var reDraw = function() {
  center = map.getCenter();
  clearAllCtx();
  bounds = map.getBounds();
  minDistance = Infinity;
  x_coord = parseInt(pcompass.x) + pcompass.r;
  y_coord = parseInt(pcompass.y) + pcompass.r;
  compass_center = fromPointToLatLng(x_coord, y_coord, map);
  var isCentroidChecked = document.getElementById('centroidCheck').checked;
  for (var i in pointsDB) {
    if (isCentroidChecked) {
      pointsDB[i].distance = getDistance(center, pointsDB[i].latlng);
      pointsDB[i].angle = getAngle(center, pointsDB[i].latlng);
    } else {
      pointsDB[i].distance = getDistance(compass_center, pointsDB[i].latlng);
      pointsDB[i].angle = getAngle(compass_center, pointsDB[i].latlng);
    }

  }
  if (locked == false) {
    if (isCentroidChecked) {
      selectPOI(pointsDB, center);
    } else {
      selectPOI(pointsDB, compass_center);
    }
  }
  if (pointsDB.length == 0)
    return;
  for (var i in points) {
    if (points[i].distance < minDistance && !bounds.contains(points[i].latlng))
      minDistance = points[i].distance;
    // console.log(points[i])
    point = fromLatLngToPoint(points[i].latlng.lat(), points[i].latlng.lng(), map);
    centerpt = fromLatLngToPoint(center.lat(), center.lng(), map)
    distanceToCompass = Math.sqrt((Math.pow(parseInt(pcompass.x) - point.x, 2)) + (Math.pow(parseInt(pcompass.y) - point.y, 2)))
    distanceToCenter = Math.sqrt((Math.pow(centerpt.x - point.x, 2)) + (Math.pow(centerpt.y - point.y, 2)))
  }

  var isCompassChecked = document.getElementById('compassCheck').checked;
  var isWedgeChecked = document.getElementById('wedgeCheck').checked;
  if (isCompassChecked) {
    pcompass.drawCompass();

    if (isCentroidChecked) {
      pcompass.drawFOVCentered(distanceToCenter);
    } else {
      if (!panorama.getVisible()) {
        pcompass.drawFOV(distanceToCompass, innerHeight);
      }

    }
  }
  if (isWedgeChecked) {
    if (!panorama.getVisible()) {
      wedge.drawWedges();
    }
  }
  if (!panorama.getVisible()) {
    //pcompass.drawNeedle("", Infinity, 90, '#A8A8A8');
    pcompass.drawNorthNeedle();
  }
  pcompass.drawNeedles();

};

var selectPOI = function(allPoints, center) {
  if (allPoints == [] || allPoints[0] == undefined) return;
  $('.dropdown-inverse li > a').click(function(e) {
    $('.status').text(this.innerHTML);
    k = this.innerHTML;
  });
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
  if (minIndex === Infinity) return;
  points.push(allPoints[minIndex]);
  var angleInterval = 360 / k;
  var margin = 15;
  var spacing = 30
  var currentAngle = angleInterval;
  var pointsAdded = 1;
  var pointInInterval;
  while (currentAngle < 360) {
    pointInInterval = false;
    for (var i in allPoints) {
      if (Math.abs(allPoints[minIndex].angle - allPoints[i].angle) >= spacing) {
        if (Math.abs(allPoints[i].angle - currentAngle) < margin && pointInInterval == false) {
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
  var table = document.getElementById("POItable");
  for (var i = 1, row; row = table.rows[i]; i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
    row.className = 'normal';
    for (var j in points) {
      if (points[j] != undefined) {
        if (points[j].name == row.cells[0].innerHTML) {
          row.className = 'highlight';
        }
      }

    }
  }
};

var socket = io.connect();
socket.on('news', function(data) {
  console.log(data);
})

$('#exportButton').click(function() {
  var filename = prompt("Please enter file name", "data.json");
  socket.emit('POIs', {'points': pointsDB, 'filename': filename});
})

$('#clearButton').click(function() {
  pointsDB = [];
  reDraw();
  console.log(markers.length)
  console.log(markers)

  for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
      markers.splice(i, 1);
    }
  console.log(markers)
})

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    points = [];
    contents = JSON.parse(contents);
    console.log(contents);
    for (i in contents) {
      if (contains(contents[i]) == false) {
        contents[i].latlng = new google.maps.LatLng(contents[i].latlng.lat, contents[i].latlng.lng);
        tablePoints.push(contents[i]);
        pointsDB.push(contents[i]);
        var table = document.getElementById("POItable").getElementsByTagName('tbody')[0];
        var row = table.insertRow(table.rows.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = contents[i].name;
        cell2.innerHTML = '<input type="checkbox" id="' + contents[i].name + '">'
        cell3.innerHTML = '<button type="button" id ="' + contents[i].name + 'Btn' + '"   >Delete</button> '
        check();

        document.getElementById(contents[i].name + 'Btn').onclick = function() {
          deletePOI(this)
        };
      }
    }
    reDraw();
  };
  reader.readAsText(file);
}

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);



var contains = function(point) {
  for (var i in tablePoints) {
    if (point.name == tablePoints[i].name)
      return true;
  }
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

  // console.log(name);
  service.getDetails({
    placeId: place.place_id
  }, function(place, status) {
    // console.log(status);

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

      // tablePoints.push({'name': name, 'distance': distance, 'angle': angle,
      //   'latlng': latlng, 'show': true, 'rating': rating})
      var table = document.getElementById("POItable").getElementsByTagName('tbody')[0];
      var row = table.insertRow(table.rows.length);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = name;
      cell2.innerHTML = '<input type="checkbox" id="' + name + '">'
      cell3.innerHTML = '<button type="button" id ="' + name + 'Btn' + '"   >Delete</button> '
      check();
      document.getElementById(name + 'Btn').onclick = function() {
        deletePOI(this)
      };

      //Add probability that user knows this location
      x_coord = parseInt(pcompass.x) + pcompass.r;
      y_coord = parseInt(pcompass.y) + pcompass.r;
      compass_center = fromPointToLatLng(x_coord, y_coord, map);
      var isCentroidChecked = document.getElementById('centroidCheck').checked;
      if (locked == false){
        if (isCentroidChecked) {

          selectPOI(pointsDB, center);
        } else {
          // console.log(pointsDB);
          selectPOI(pointsDB, compass_center);
        }
      }
      markers.push(marker);
      return marker;
    }

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      contentString = '<div>' +
        '<h4 id="firstHeading" class="firstHeading">' + name + '</h4>' +
        '<p>' + place.formatted_address + '</p>' +
        '<p>' + place.formatted_phone_number + '</p>' +
        '<a href=' + place.website + '>+' + place.website + '</a>'

      if(place.photos !== undefined)
      {
        if (place.photos[0] !== undefined) {
        contentString += '<div>' + '<img src="' + place.photos[0].getUrl({
          'maxWidth': 150,
          'maxHeight': 150
        }) + ' alt="some_text" >'
      }
      if (place.photos[1] !== undefined) {

        contentString += '<img src="' + place.photos[1].getUrl({
          'maxWidth': 150,
          'maxHeight': 150
        }) + ' alt="some_text" >'
      }
    }


      contentString += '</div>' +
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
      var table = document.getElementById("POItable").getElementsByTagName('tbody')[0];
      var row = table.insertRow(table.rows.length);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = name;
      cell2.innerHTML = '<input type="checkbox" id="' + name + '">'
      cell3.innerHTML = '<button type="button" id ="' + name + 'Btn' + '"   >Delete</button> '
      check();
      document.getElementById(name + 'Btn').onclick = function() {
        deletePOI(this)
      };

      //Add probability that user knows this location
      x_coord = parseInt(pcompass.x) + pcompass.r;
      y_coord = parseInt(pcompass.y) + pcompass.r;
      compass_center = fromPointToLatLng(x_coord, y_coord, map);
      var isCentroidChecked = document.getElementById('centroidCheck').checked;
      if (locked == false){
        if (isCentroidChecked) {
          selectPOI(pointsDB, center);
        } else {
          selectPOI(pointsDB, compass_center);
        }
      }
      markers.push(marker);
      return marker;
    }
  });
};

function populateDB() {
  var newYork = new google.maps.LatLng(40.7127, -74.0079);
  var defaultTypes = ['university', 'airport', 'stores']
  generatePOI(newYork, defaultTypes);

};

function generatePOI(searchCenter, searchTypes) {
  var request = {
    location: searchCenter,
    radius: '5000',
    types: searchTypes,
    rankBy: google.maps.places.RankBy.PROMINENCE
  }; // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var service = new google.maps.places.PlacesService(map);

  var table = document.getElementById("POItable").getElementsByTagName('tbody')[0];
  tablePoints = [];
  service.nearbySearch(request, function(results, status) {
    // if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        var name = place.name;
        var rating = place.rating;
        createMarker(place);

      }
      // console.log(markers)
      pcompass.drawNeedles();
    // }
  });
}

function deletePOI(t) {
  var currentRow = t.parentNode.parentNode;
  var secondColumn = currentRow.getElementsByTagName("td")[0];

  for (var j in pointsDB) {
    if (secondColumn.textContent == pointsDB[j].name) {
      pointsDB.splice(j, 1);
    }
  }

  for (var k in tablePoints) {
    if (secondColumn.textContent == tablePoints[k].name) {
      tablePoints.splice(k, 1);

    }
  }

  for (var l in markers) {
    if (secondColumn.textContent == markers[l].title) {
      markers[l].setMap(null);
      markers.splice(l, 1);
    }
  }
  var row = t.parentNode.parentNode;
  document.getElementById("POItable").deleteRow(row.rowIndex);
  reDraw();
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
  ctxWedge.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxFOV.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxLabels.clearRect(0, 0, window.innerWidth, window.innerHeight);
  return false;
});
document.getElementById('compass').addEventListener('touchend', function() {
  reDraw();
  return false;
});

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


function toggleStreetView() {
  panorama.setPosition(map.getCenter());
  var toggle = panorama.getVisible();
  if (toggle == false) {
    panorama.setVisible(true);
  } else {
    panorama.setVisible(false);
  }
}