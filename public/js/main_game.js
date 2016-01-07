function initMap() {

      var newYork = new google.maps.LatLng(40.7127, -74.0079);  
      map = new google.maps.Map(document.getElementById('map'), {
        center: newYork, // New York
        zoom: 15
      });
}