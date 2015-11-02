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


            var pcompass= new PCompass(0, 0, 0, 0, 1000);
            pcompass.setXY(5, 6)
            
           var canvas = document.getElementById("myCanvas");
           var ctx = canvas.getContext("2d");
           
           //draw circles
           ctx.beginPath();
           ctx.arc(100,100,100,0,2*Math.PI);
           
           //color in circle
           ctx.fillStyle = 'silver';
           ctx.fill();
           ctx.stroke()

            //draw lines
           ctx.beginPath();
           ctx.moveTo(100, 100);
           ctx.lineTo(100, 180);
           ctx.lineWidth = 5;
           ctx.strokeStyle = '#ff0000';
           ctx.stroke();

           ctx.beginPath();
           ctx.moveTo(100, 100);
           ctx.lineTo(160, 100);
           ctx.lineWidth = 5;
           ctx.strokeStyle = '#ff0000';
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