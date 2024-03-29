'use strict';
var Y_OFFSET = 0;
var LABEL_MARGIN = 5;
var PCompass = function(lat, lng, x, y, r) {
  this.lat = lat;
  this.lng = lng;
  this.x = x;
  this.y = y;
  this.r = r;
};

PCompass.prototype.setXY = function(x, y) {
  this.x = x;
  this.y = y;
};

PCompass.prototype.setLatLng = function(lat, lng) {
  this.lat = lat;
  this.lng = lng;
};

PCompass.prototype.setR = function(r) {
  this.r = r;
};

PCompass.prototype.drawCompass = function() {
  ctxCompass.strokeStyle = '#000000';
  ctxCompass.lineWidth = 0.3;
  ctxCompass.beginPath();
  ctxCompass.arc(this.r, this.r + Y_OFFSET, this.r, 0, 2 * Math.PI);
  //color in circle
  ctxCompass.globalAlpha = 0.6;
  ctxCompass.fillStyle = 'silver';
  ctxCompass.fill();
  ctxCompass.stroke();
  ctxCompass.globalAlpha = 1.0;

};

PCompass.prototype.drawNorthNeedle = function() {

  var r = parseInt(this.r)
  var x_pc = r + parseInt(this.x)
  var y_pc = r + parseInt(this.y)

  var angle = 90 * Math.PI / 180;
  ctxFOV.beginPath();
  ctxFOV.moveTo(x_pc, y_pc + Y_OFFSET);
  ctxFOV.lineTo(x_pc + 90 * Math.cos(angle), y_pc - 110 * Math.sin(angle) + Y_OFFSET);
  ctxFOV.strokeStyle = '#A8A8A8'; //'#000000';
  ctxFOV.fillStyle = '#A8A8A8'; //'#000000';
  ctxFOV.lineWidth = 3;
  ctxFOV.stroke();
};

PCompass.prototype.drawStreetViewNorthNeedle = function(shearVal, angle) {
  var r = parseInt(this.r)
  var x_pc = r + parseInt(this.x)
  var y_pc = r * shearVal + parseInt(this.y)
  console.log(x_pc, y_pc)

  var angle = angle * Math.PI / 180;
  ctxFOV.beginPath();
  ctxFOV.moveTo(x_pc, y_pc + Y_OFFSET);
  ctxFOV.lineTo(x_pc + 90 * Math.cos(angle), y_pc - 110 * Math.sin(angle) + Y_OFFSET);
  ctxFOV.strokeStyle = '#A8A8A8'; //'#000000';
  ctxFOV.fillStyle = '#A8A8A8'; //'#000000';
  ctxFOV.lineWidth = 3;
  ctxFOV.stroke();
};

PCompass.prototype.drawNeedle = function(name, distance, angle, color) {
  //draw lines
  distance = this.r * distance;
  if (distance > this.r) {
    distance = this.r;
  }

  angle = angle * Math.PI / 180;
  ctxCompass.beginPath();
  ctxCompass.moveTo(this.r, this.r + Y_OFFSET);
  console.log(angle)
  console.log(this.r)
  ctxCompass.lineTo(this.r + distance * Math.cos(angle), this.r - distance * Math.sin(angle) + Y_OFFSET);
  ctxCompass.strokeStyle = color; //'#000000';
  ctxCompass.fillStyle = color; //'#000000';
  ctxCompass.font = color; //"15px Arial";

  //Draw the labels
  ctxLabels.font = "15px Arial";
  ctxLabels.fillStyle = '#FFFFFF'
  ctxLabels.shadowColor = "black"
  if (angle < Math.PI / 2 || angle > 3 * Math.PI / 2) {
    var x = this.r + distance * Math.cos(angle) + parseInt(this.x)
    var y = this.r - distance * Math.sin(angle) + Y_OFFSET + parseInt(this.y)

  } else {
    var x = this.r + distance * Math.cos(angle) - name.length * 6.75 + parseInt(this.x)
    var y = this.r - distance * Math.sin(angle) + Y_OFFSET + parseInt(this.y)
    

  }

  ctxLabels.fillStyle = '#d3d3d3';
    ctxLabels.fillRect(x - LABEL_MARGIN, y + LABEL_MARGIN,ctxLabels.measureText(name).width + 2 * LABEL_MARGIN, -4 *  LABEL_MARGIN);
    ctxLabels.fillStyle = '#000000'; 
    ctxLabels.fillText(name, x, y)
  
  ctxCompass.lineWidth = 3;
  ctxCompass.strokeStyle = color;
  ctxCompass.stroke();

};

/* Add a needle for each POI */
PCompass.prototype.drawNeedles = function() {
  var maxDistance = 0
  for (var i in points) {
    if (points[i].distance > maxDistance){
      maxDistance = points[i].distance
    }
  }
  for (var i in points) {
    var normalized_rating = ((points[i].rating - 3.0) / 2.0);
    var red = 255;
    var green = parseInt(255 * (1 - normalized_rating));
    var blue = 0;
    var rating_color = "rgb(" + red + ", " + green + ", " + blue + ")";
    if (points[i].rating < 3.0) {
      rating_color = 'rgb(200, 200, 0)';
    }
    pcompass.drawNeedle(points[i].name, points[i].distance/maxDistance, points[i].angle, '#FF0000'
);
  }
  /* Draw center dot */
  var x = parseInt(this.x);
  var r = parseInt(this.r);
  var y = parseInt(this.y);
  ctxCompass.beginPath();
  ctxCompass.arc(this.r, this.r + Y_OFFSET, this.r / 40, 0, 2 * Math.PI, false);
  ctxCompass.fillStyle = '#05EDFF';
  ctxCompass.fill();
  ctxCompass.lineWidth = 5;
  ctxCompass.strokeStyle = '#05EDFF';
  ctxCompass.stroke();
};

/* Takes distance of closest point, outside of FOV */
PCompass.prototype.drawFOV = function(dist, innerHeight) {
  
  var r = parseInt(this.r)

  var x_pc = r + parseInt(this.x)
  var y_pc = r + parseInt(this.y)
  var x_map = innerWidth / 2;
  var y_map = innerHeight / 2;


  var compassX = x_pc - x_map;
  var compassY = y_pc - y_map;

  var offset_ratio_x = compassX / innerWidth;
  var offset_ratio_y = compassY / innerHeight;

  var w_fov = innerWidth * r / dist;
  var h_fov = innerHeight * r / dist;

  var offsetX = w_fov * offset_ratio_x;
  var offsetY = h_fov * offset_ratio_y;


  ctxFOV.beginPath();
  ctxFOV.lineWidth = "2";
  ctxFOV.strokeStyle = "black";

  ctxFOV.rect(x_pc - w_fov / 2 - offsetX, y_pc - h_fov / 2 - offsetY, w_fov, h_fov);

  ctxFOV.stroke();
};

PCompass.prototype.drawFOVCentered = function(dist) {
  //Compass x and y
  var r = parseInt(this.r)
  var x_pc = r + parseInt(this.x)
  var y_pc = r + parseInt(this.y)
  var w_fov = innerWidth * r / dist;
  var h_fov = innerHeight * r / dist;

  ctxFOV.beginPath();
  ctxFOV.lineWidth = "2";
  ctxFOV.strokeStyle = "black";

  ctxFOV.rect(x_pc - w_fov / 2, y_pc - h_fov / 2, w_fov, h_fov);
  ctxFOV.stroke();


}