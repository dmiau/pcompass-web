Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

var Wedge = function () {  
};

Wedge.prototype.drawWedge = function(name, distance, angle, POILat, POILng)
{
        centerX = window.innerWidth/2;
        centerY = window.innerHeight/2;
        point = fromLatLngToPoint(POILat, POILng, map);
        ne = map.getBounds().getNorthEast();
        sw = map.getBounds().getSouthWest();
        nePoint = fromLatLngToPoint(ne.lat(), ne.lng(), map);
        newNePoint = toCenter(nePoint.x, nePoint.y)
        swPoint = fromLatLngToPoint(sw.lat(), sw.lng(), map);
        newSwPoint = toCenter(swPoint.x, swPoint.y)

        newCenter = toCenter(centerX, centerY);
        newPoint = toCenter(point.x, point.y)

        mapSlope = newNePoint.y  / newNePoint.x;
        
        var screenEdgePointX;
        var screenEdgePointY;

        slope = (newPoint.y - newCenter.y) / (newPoint.x - newCenter.x)
        abs_slope = Math.abs(slope);

        if(abs_slope > mapSlope && newPoint.y > newCenter.y)
        {
            // console.log('point is in quadrant 2')
            screenEdgePointY = newNePoint.y;
            screenEdgePointX = newNePoint.y / slope;

        }

        //point is below map
        else if(abs_slope > mapSlope && newPoint.y < newCenter.y)
        {
            // console.log('point is in quadrant 4')
            screenEdgePointY = newSwPoint.y;
            screenEdgePointX = newSwPoint.y / slope;
        }

        //point is right of map
        else if(abs_slope < mapSlope && newPoint.x > newCenter.x)
        {
            // console.log('point is in quadrant 1')
            screenEdgePointY = newNePoint.x * slope;
            screenEdgePointX = newNePoint.x;
        }

        //point is left of map
        else if(abs_slope < mapSlope && newPoint.x < newCenter.x)
        {
            // console.log('point is in quadrant 3')
            screenEdgePointY = newSwPoint.x * slope;
            screenEdgePointX = newSwPoint.x;
        }


        dist = Math.sqrt(Math.pow(newPoint.x - screenEdgePointX, 2) + Math.pow(newPoint.y - screenEdgePointY, 2));
        leg = 1.3 * dist + Math.log((dist + 20)/12) * 10;
        aperture = (5 + dist* 0.3)/ leg;
        theta = aperture / 2;

        phiLeft = angle * Math.PI/180 - theta;
        phiRight = Math.PI/2 - angle * Math.PI/180 - theta;
        newLeftX = newPoint.x - Math.cos(phiLeft) * leg;
        newLeftY = newPoint.y - Math.sin(phiLeft) * leg;

        newRightX = newPoint.x - Math.sin(phiRight) * leg;
        newRightY = newPoint.y - Math.cos(phiRight) * leg;

        // console.log('right ' + rightX, rightY);
        // console.log('left ' + leftX, leftY);
        // console.log('angle' + angle)
        var leftPoint = toCorner(newLeftX, newLeftY);
        var rightPoint = toCorner(newRightX, newRightY);
        leftX = leftPoint.x;
        leftY = leftPoint.y;
        rightX = rightPoint.x;
        rightY = rightPoint.y;

        // console.log('right ' + rightX, rightY);
        // console.log('left ' + leftX, leftY);
        ctxWedge.beginPath();
        ctxWedge.moveTo(leftX, leftY); //Move cursor to center of screen
        ctxWedge.lineTo(point.x, point.y);
        ctxWedge.moveTo(rightX, rightY); //Move cursor to center of screen
        ctxWedge.lineTo(point.x, point.y);
        ctxWedge.moveTo(rightX, rightY); //Move cursor to center of screen
        ctxWedge.lineTo(leftX, leftY);
        ctxWedge.lineWidth = 3;
        ctxWedge.strokeStyle = '#ff0000';
        ctxWedge.stroke();
        
};

Wedge.prototype.drawWedges = function() {
    for(var i in points)
        {
          wedge.drawWedge(points[i].name, points[i].distance, points[i].angle, 
            points[i].latlng.lat(), points[i].latlng.lng());
        }
};

// function fromLatLngToPoint(lat, lng, map) {
//                 latLng = new google.maps.LatLng(lat, lng);
//                 var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
//                 var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
//                 var scale = Math.pow(2, map.getZoom());
//                 var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
//                 pointTemp = new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
//                 return pointTemp;
//         }

var toCenter =  function(cornerX, cornerY) {
    point_temp = new google.maps.Point(cornerX - centerX, -cornerY + centerY);
    return point_temp;
} 

var toCorner =  function(middleX, middleY) {
    point_center = new google.maps.Point(middleX + centerX, -middleY + centerY);
    return point_center;
} 