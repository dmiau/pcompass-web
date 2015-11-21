var PCompass= function (lat, lng, x , y, r) {
    this.lat = lat;
    this.lng = lng;
    this.x = x;
    this.y = y;
    this.r = r;
    console.log('compass instantiated');
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

    PCompass.prototype.drawCompass = function()
    {
          // ctxCompass.canvas.width  = window.innerWidth;
          // ctxCompass.canvas.height = window.innerHeight;
         //draw circles

          ctxCompass.strokeStyle = '#000000';
          ctxCompass.lineWidth = 0.3;
          ctxCompass.beginPath();
          ctxCompass.arc(this.r,this.r + 30, this.r,0,2*Math.PI);
          //color in circle
          ctxCompass.globalAlpha = 0.2;
          ctxCompass.fillStyle = 'silver';
          ctxCompass.fill();
          ctxCompass.stroke();
          ctxCompass.globalAlpha = 1.0;
          pcompass.drawNeedle("", Infinity, 90, '#A8A8A8');
    };

    PCompass.prototype.drawNeedle = function(name, distance, angle, color)
    {
        //draw lines
        distance = this.r * distance;
        if(distance > this.r)
        {
            distance = this.r;
        }
        angle = angle * Math.PI/180;
        ctxCompass.beginPath();
        ctxCompass.moveTo(this.r, this.r + 30);
        ctxCompass.lineTo(this.r + distance * Math.cos(angle), this.r - distance * Math.sin(angle) + 30);
        ctxCompass.strokeStyle = '#000000';
        ctxCompass.fillStyle = '#000000';
        ctxCompass.font = "15px Arial";
        ctxCompass.fillText(name, this.r + distance * Math.cos(angle), this.r - distance * Math.sin(angle) + 30)
        ctxCompass.lineWidth = 3;
        ctxCompass.strokeStyle = color;
        ctxCompass.stroke();

    };

    PCompass.prototype.drawNeedles = function()
    {
        for(var i in points)
        {
          pcompass.drawNeedle(points[i].name, points[i].distance, points[i].angle, '#ff0000')
        }
        //draw center dot
        x = parseInt(this.x);
        r = parseInt(this.r);
        y = parseInt(this.y);
        ctxCompass.beginPath();
        ctxCompass.arc(this.r, this.r +30, 5, 0, 2 * Math.PI , false);
        ctxCompass.fillStyle = '#05EDFF';
        ctxCompass.fill();
        ctxCompass.lineWidth = 5;
        ctxCompass.strokeStyle = '#05EDFF';
        ctxCompass.stroke();
    };
    //Takes distance of closest point, outside of FOV
    PCompass.prototype.drawFOV = function(dist)
    {
          //Compass x and y
          var compassX = parseInt(this.x) - innerWidth/2;
          var compassY = parseInt(this.y) - innerHeight/2;
          r = parseInt(this.r)

          var k = compassX / innerWidth;
          var l = compassY / innerHeight;


          rectX = 2 * innerWidth * k /dist*map.zoom /30
          rectY = 2 * innerHeight * k / dist*map.zoom /30

          var dx = k * rectX;
          var dy = l * rectY;

          ctxCompass.beginPath();
          ctxCompass.lineWidth="2";
          ctxCompass.strokeStyle="black";
          
          ctxCompass.rect(r + dx, r + dy, rectX, rectY);

          ctxCompass.stroke();


          //change to innerWidth, innerHeight
          /*x = parseInt(this.x);
          y = parseInt(this.y);
          r = parseInt(this.r);

          console.log(x, y, r)
          k = 0.02;
          m = 0.1;
          n = 0.1;
          dist = dist/10;
          ctxCompass.beginPath();
          ctxCompass.lineWidth="2";
          ctxCompass.strokeStyle="black";
          console.log(map.zoom)
          rectX = (r - innerWidth* k / dist *map.zoom/50) - (x - innerWidth/2)*m
          rectY = (r - innerHeight * k / dist * map.zoom/50 + 30) - (y - innerWidth/2)*n
          rectLength = 2 * innerWidth * k /dist*map.zoom /30
          rectWidth = 2 * innerHeight * k / dist*map.zoom /30
          ctxCompass.rect(rectX, rectY, rectLength, rectWidth);
          // ctxCompass.translate((x - innerWidth/2)*m, (y - innerWidth/2)*m);
          ctxCompass.stroke(); */
          // ctxCompass.translate(-(x - innerWidth/2)*m, -(y - innerWidth/2)*m);
    }

   