//Standort- und Zielkoordinaten
var longLocation = document.getElementById("longLocation");
var latLocation = document.getElementById("latLocation");
var longDestination = document.getElementById("long");
var latDestination = document.getElementById("lat");

//Standort- und Routeknopf
let locationButton = document.getElementById("location");
locationButton.addEventListener("click", getLocation);
let routeButton = document.getElementById("route");
routeButton.addEventListener("click", routeBerechnen);


//Leaflet
var map = L.map("map").setView([51, 38], 4);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


//Fügt ein Gebirge zur karte hinzu
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

geojson.forEach((element) => {
  var marker = L.marker([
    element.geometry.coordinates[1],
    element.geometry.coordinates[0],
  ])
  marker.addTo(map)
  marker.on("click", onClick);
});


//Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoiam8wMiIsImEiOiJjbDNraTUycWkwMjh6M2N1dHQzd2RmcmU1In0.wxxWsaWXH2CReACTCrVuZg';
var mapbox = new mapboxgl.Map({
  container: 'mapRoute',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [9.905964, 49.845363],
  zoom: 3
});


/**
 * Berechnet die Route vom Standort zum ausgewählten Gebirge
 */
function routeBerechnen() {
  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  });
  mapbox.addControl(directions, 'top-left');

  directions.setOrigin([longLocation.value, latLocation.value]);
  directions.setDestination([longDestination.value, latDestination.value]);
};


/**
 * Event Listener um einen Marker auszuwählen
 * @param {*} e 
 */
 function onClick(e) {
  let mountain = geojson.find((element) => 
      element.geometry.coordinates[0] == e.target._latlng.lng || 
      element.geometry.coordinates[1] == e.target._latlng.lat);

  document.getElementById("mountain").value = mountain.properties.name;
  longDestination.value = mountain.geometry.coordinates[0];
  latDestination.value = mountain.geometry.coordinates[1];
}


/**
 * Standortabfrage
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      longLocation.value = position.coords.longitude;
      latLocation.value = position.coords.latitude;
    })
  }
};


/**
 * for schleife um die Marker mit eigenem Bild auf die Karte zu bekommen
 * source: https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
 */
 for (const marker of geojson) {
  // Create a DOM element for each marker.
  let el = document.createElement("div");
  el.className = "marker";
  el.style.backgroundImage = "url(images/mapmarker.png)";
  el.style.width = "50px";
  el.style.height = "50px";
  el.style.backgroundSize = "100%";

  el.addEventListener("click", () => {
    setTimeout(function () {
      directions.setDestination(marker.geometry.coordinates);
    }, 500);
  });

  // Hinzufügen von Wegpunkten
  new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
}