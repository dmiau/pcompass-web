var PCompass= function (lat, lng, x , y, r , points) {
//var PCompass= function (lat, lng, x , y, r ) {
    this.lat = lat;
    this.lng = lng;
    this.x = x;
    this.y = y;
    this.r = r;
    //this.points = points;
    console.log('compass instantiated');
};

    PCompass.prototype.setXY = function(x, y) {
    this.x = x;
    this.y = y;
    console.log("x, y = " + this.x + " " + this.y);
    };

    PCompass.prototype.setLatLng = function(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    console.log("lat, long = " + this.lat + " " + this.lng);
    };

    PCompass.prototype.setR = function(r) {
    this.r = r;
    console.log("r" + this.r);
    };

    PCompass.prototype.drawCompass = function()
    {
         //draw circles
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 0.3;


          ctx.beginPath();
          ctx.arc(this.r,this.r, this.r,0,2*Math.PI);

          //color in circle
          ctx.fillStyle = 'silver';
          ctx.fill();
          ctx.stroke()

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

    PCompass.prototype.drawNeedle = function(distance, angle)
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
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();

    };

    PCompass.prototype.drawNeedles = function()
    {
        for(var i in points)
        {
          pcompass.drawNeedle(points[i].distance, points[i].angle)

        }

    };
    
   


   