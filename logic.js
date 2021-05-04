// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);

  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup("Location: " + feature.properties.place +
        "<br/>Magnitude: " + feature.properties.mag +
        "<br/>Depth: " + feature.geometry.coordinates[2]);
    }

    function getRadius(mag) {
      return mag * 4;
    }

    colors = ["33FFB2", "33FFEC", "33AFFF", "3333FF", "CE33FF", "FF3396"]

    function circleColor(depth) {
      switch (true) {
        case depth > 10:
          return colors[0];
        case depth > 30:
          return colors[1];
        case depth > 50: 
          return colors[2];
        case depth > 70: 
          return colors[3];
        case depth > 90: 
          return colors[4];
        default:  
          return colors[5]
      }
    };

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng)
      },

      style: (feature) => {
        return {
          opacity: .2,
          fillOpacity: 1,
          fillColor: circleColor(feature.geometry.coordinates[2]),
          // color: "red",
          radius: getRadius(feature.properties.mag),
          weight: .5,
        }
      },
      onEachFeature: onEachFeature
      // expand this with other things we can Day 2, activity 1 from the week
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, topo]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  }
});