//Eingaben
var long = document.getElementById("long");
var lat = document.getElementById("lat");
var upload = document.getElementById("upload")
var textinput = document.getElementById('textinput');

upload.addEventListener('change', function(){

  // prüft, ob eine Datei ausgewählt ist
  if (upload.files.length > 0) 
  {
  var reader = new FileReader() // File reader zum lesen der file 

  reader.readAsText(upload.files[0]); // Zum lesen der uploaded file
  
  // event listener, ob die Datei richtig gelesen wurde
  reader.addEventListener('load', function() {
      
      var result = JSON.parse(reader.result)
      var str = JSON.stringify(result, undefined, 4);
    textinput.value = str;
  })
}
})

// erstellen einer leaflet Karte
var map = L.map("map").setView([51, 38], 4);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Leafletdraw wird hinzugefügt
// siehe: https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// draw Mark
var drawMark = new L.Control.Draw({
  edit: {
    edit: false,
    remove: true,
    featureGroup: drawnItems,
  },
  draw: {
    polyline: true,
    rectangle: false,
    circle: false,
    circlemarker: false,
    polygon: false,
    marker: true,
  },
});
map.addControl(drawMark);

// Änderung der Karte durch Events
map.on(L.Draw.Event.CREATED, function (e) {
  var marker = e.layer;
  drawnItems.addLayer(marker);
  var draws = drawnItems.toGeoJSON();
  var coordinates = e.layer.getLatLng();
  long.value = coordinates.lng;
  lat.value = coordinates.lat;
});

map.on("draw:deleted", function (e) {
  map.removeControl(drawMark);
  map.addControl(drawMark);
});