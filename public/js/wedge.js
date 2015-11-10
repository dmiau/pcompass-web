Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

var Wedge = function () {
    
};

Wedge.prototype.drawWedge = function(name, distance, angle, POILat, POILng, centerLat, centerLng, center)
{
        centerX = window.innerWidth/2;
        centerY = window.innerHeight/2;

        point = fromLatLngToPoint(POILat, POILng, map);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY); //Move cursor to center of screen
        ctx.lineTo(point.x, point.y);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();

        function fromLatLngToPoint(lat, lng, map) {
                latLng = new google.maps.LatLng(lat, lng);
                var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
                var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
                var scale = Math.pow(2, map.getZoom());
                var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
                point = new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
                console.log("PointX" + point.x + "PointY" + point.y);
                return point;
        }
            //implementation w projections
            /*
            var bounds = new google.maps.LatLngBounds();
            var sw = new google.maps.Point(((wc.x * scale) - 50)/ scale, ((wc.y * scale) - 50)/ scale);
            bounds.extend(proj.fromPointToLatLng(sw));
            var ne = new google.maps.Point(((wc.x * scale) + 50)/ scale, ((wc.y * scale) + 50)/ scale);
            bounds.extend(proj.fromPointToLatLng(ne));
            var opts = {
                bounds: bounds,
                map: map,
                editable:true
            }
    var rect = new google.maps.Rectangle(opts);
        distance = 100* distance;
        angle = Math.radians(angle);
        point_x = 100 + distance * Math.cos(angle);
        point_y = 100 - distance * Math.sin(angle);
        A = 100 - point_x;
        O = 100 - point_y;
        bearing = Math.atan(O/A);
        bearing = -Math.degrees(bearing);
        console.log(bearing);

        leg = distance + Math.log((distance + 20)/12) * 10;
        aperture = (5 + distance* 0.3)/ leg;
        aperature = toDegrees(aperture);
        offset = aperature/2;

        ctx.beginPath();
        ctx.moveTo(point_x, point_y); //Move cursor to center of compass
        ctx.lineTo(point_x + distance * Math.cos(bearing + offset), point_y - distance * Math.sin(bearing + offset));

        ctx.moveTo(point_x, point_y); //Move cursor to center of compass
        ctx.lineTo(point_x + distance * Math.cos(bearing - offset), point_y - distance * Math.sin(bearing - offset));

        ctx.moveTo(point_x + distance * Math.cos(bearing + offset), point_y - distance * Math.sin(bearing + offset)); //Move cursor to center of compass
        ctx.lineTo(point_x + distance * Math.cos(bearing - offset), point_y - distance * Math.sin(bearing - offset));

        ctx.strokeStyle = '#000000';
        ctx.stroke();*/
        
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
 return d; // returns the distance in meter
}; 