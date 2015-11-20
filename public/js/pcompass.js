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

          // Put in labels
          // ctxCompass.beginPath();
          // ctxCompass.strokeStyle = '#000000';
          // ctxCompass.lineWidth = 0.5;
          // ctxCompass.fillStyle = 'black';
          // ctxCompass.font = "30px Arial";
          // ctxCompass.fillText("S",90,2 * this.r);
          // ctxCompass.fillText("N",90, 30);
          // ctxCompass.stroke();
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
        ctxCompass.lineWidth = 5;
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
        ctxCompass.beginPath();
        ctxCompass.arc(this.r, this.r + 30, 5, 0, 2 * Math.PI , false);
        ctxCompass.fillStyle = '#05EDFF';
        ctxCompass.fill();
        ctxCompass.lineWidth = 5;
        ctxCompass.strokeStyle = '#05EDFF';
        ctxCompass.stroke();
    };
    //Takes distance of closest point, outside of FOV
    PCompass.prototype.drawFOV = function(dist)
    {
          //change to innerWidth, innerHeight
          k = 0.02;
          dist = dist/10;
          ctxCompass.beginPath();
          ctxCompass.lineWidth="2";
          ctxCompass.strokeStyle="black";
          ctxCompass.rect(this.r - innerWidth* k / dist , 
          this.r - innerHeight * k / dist + 30,
          2 * innerWidth * k / dist ,
          2 * innerHeight * k / dist);
          ctxCompass.stroke(); 
    }

   