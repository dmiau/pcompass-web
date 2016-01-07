function initMap() {
      var newYork = new google.maps.LatLng(40.7127, -74.0079);  
      map = new google.maps.Map(document.getElementById('map'), {
        center: newYork, // New York
        zoom: 15
      });
}

question = []

question.push([40,70]);
question.push([500,30]);
question.push([30,70]);
question.push([600,30]);



var socket = io.connect('http://localhost:3000');


$('#createQuestion').click(function() {
	console.log(question);
        socket.emit('Question', question);
 })



