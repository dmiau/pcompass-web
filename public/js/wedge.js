var Wedge = function() {};

Wedge.prototype.drawWedge = function(name, distance, angle, POILat, POILng, color) {
    centerX = window.innerWidth / 2;
    centerY = window.innerHeight / 2;
    var point = fromLatLngToPoint(POILat, POILng, map);
    var ne = map.getBounds().getNorthEast();
    var sw = map.getBounds().getSouthWest();
    var nePoint = fromLatLngToPoint(ne.lat(), ne.lng(), map);
    var newNePoint = toCenter(nePoint.x, nePoint.y)
    var swPoint = fromLatLngToPoint(sw.lat(), sw.lng(), map);
    var newSwPoint = toCenter(swPoint.x, swPoint.y)

    var newCenter = toCenter(centerX, centerY);
    var newPoint = toCenter(point.x, point.y)

    var mapSlope = newNePoint.y / newNePoint.x;

    var screenEdgePointX;
    var screenEdgePointY;

    var slope = (newPoint.y - newCenter.y) / (newPoint.x - newCenter.x)
    var abs_slope = Math.abs(slope);

    if (abs_slope > mapSlope && newPoint.y > newCenter.y) {
        // console.log('point is in quadrant 2')
        screenEdgePointY = newNePoint.y;
        screenEdgePointX = newNePoint.y / slope;

    }

    //point is below map
    else if (abs_slope > mapSlope && newPoint.y < newCenter.y) {
        // console.log('point is in quadrant 4')
        screenEdgePointY = newSwPoint.y;
        screenEdgePointX = newSwPoint.y / slope;
    }

    //point is right of map
    else if (abs_slope < mapSlope && newPoint.x > newCenter.x) {
        // console.log('point is in quadrant 1')
        screenEdgePointY = newNePoint.x * slope;
        screenEdgePointX = newNePoint.x;
    }

    //point is left of map
    else if (abs_slope < mapSlope && newPoint.x < newCenter.x) {
        // console.log('point is in quadrant 3')
        screenEdgePointY = newSwPoint.x * slope;
        screenEdgePointX = newSwPoint.x;
    }


    var dist = Math.sqrt(Math.pow(newPoint.x - screenEdgePointX, 2) + Math.pow(newPoint.y - screenEdgePointY, 2));
    var leg = 1.3 * dist + Math.log((dist + 20) / 12) * 10;
    var aperture = (5 + dist * 0.3) / leg;
    var theta = aperture / 2;

    var phiLeft = angle * Math.PI / 180 - theta;
    var phiRight = Math.PI / 2 - angle * Math.PI / 180 - theta;
    var newLeftX = newPoint.x - Math.cos(phiLeft) * leg;
    var newLeftY = newPoint.y - Math.sin(phiLeft) * leg;

    var newRightX = newPoint.x - Math.sin(phiRight) * leg;
    var newRightY = newPoint.y - Math.cos(phiRight) * leg;

    var leftPoint = toCorner(newLeftX, newLeftY);
    var rightPoint = toCorner(newRightX, newRightY);
    var leftX = leftPoint.x;
    var leftY = leftPoint.y;
    var rightX = rightPoint.x;
    var rightY = rightPoint.y;

    ctxWedge.beginPath();
    ctxWedge.moveTo(leftX, leftY); //Move cursor to center of screen
    ctxWedge.lineTo(point.x, point.y);
    ctxWedge.moveTo(rightX, rightY); //Move cursor to center of screen
    ctxWedge.lineTo(point.x, point.y);
    ctxWedge.moveTo(rightX, rightY); //Move cursor to center of screen
    ctxWedge.lineTo(leftX, leftY);
    ctxWedge.lineWidth = 3;
    ctxWedge.strokeStyle = color;
    ctxWedge.stroke();
    ctxWedge.font = "15px Arial";
    ctxWedge.fillText(name, (leftX + rightX) / 2, (leftY + rightY) / 2);



};

Wedge.prototype.drawWedges = function() {
    for (var i in points) {
        var normalized_rating = ((points[i].rating - 3.0) / 2.0);
        var red = 255;
        var green = parseInt(255 * (1 - normalized_rating));
        var blue = 0;
        var rating_color = "rgb(" + red + ", " + green + ", " + blue + ")";
        if (points[i].rating < 3.0) {
            rating_color = 'rgb(200, 200, 0)';
        }
        wedge.drawWedge(points[i].name, points[i].distance, points[i].angle,
            points[i].latlng.lat(), points[i].latlng.lng(), rating_color);
    }
};

var toCenter = function(cornerX, cornerY) {
    var point_temp = new google.maps.Point(cornerX - centerX, -cornerY + centerY);
    return point_temp;
}

var toCorner = function(middleX, middleY) {
    var point_center = new google.maps.Point(middleX + centerX, -middleY + centerY);
    return point_center;
}