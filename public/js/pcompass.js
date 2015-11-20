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
          ctx.canvas.width  = window.innerWidth;
          ctx.canvas.height = window.innerHeight;

         //draw circles
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.arc(this.r,this.r, this.r,0,2*Math.PI);
          //color in circle
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = 'silver';
          ctx.fill();
          ctx.stroke();
          ctx.globalAlpha = 1.0;

          ctx.beginPath();
          ctx.arc(100, 100, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#ADD8E6';
          ctx.fill();
          ctx.lineWidth = 5;
          ctx.strokeStyle = '#ADD8E6';
          ctx.stroke();
          // Put in labels
          ctx.beginPath();
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 0.5;
          ctx.fillStyle = 'black';
          ctx.font = "30px Arial";
          ctx.fillText("S",90,200);
          ctx.fillText("N",90,30);
          ctx.stroke();
    };

    PCompass.prototype.drawNeedle = function(name, distance, angle)
    {
        //draw lines
        distance = 100 * distance;
        if(distance > 100)
        {
            distance = 100;
        }
        angle = angle * Math.PI/180;
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100 + distance * Math.cos(angle), 100 - distance * Math.sin(angle));
        ctx.strokeStyle = '#000000';
        ctx.font = "15px Arial";
        ctx.fillText(name, 100 + distance * Math.cos(angle), 100 - distance * Math.sin(angle))
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();

    };

    PCompass.prototype.drawNeedles = function()
    {
        for(var i in points)
        {
          pcompass.drawNeedle(points[i].name, points[i].distance, points[i].angle)
        }
    };
    //Takes distance of closest point, outside of FOV
    PCompass.prototype.drawFOV = function(dist)
    {
          //change to innerWidth, innerHeight
          k = 0.02;
          dist = dist/10;
          ctx.beginPath();
          ctx.lineWidth="2";
          ctx.strokeStyle="black";
          ctx.rect(100 - innerWidth* k / dist , 
          100 - innerHeight * k / dist,
          2 * innerWidth * k / dist ,
          2 * innerHeight * k / dist);
          ctx.stroke(); 
    }
   