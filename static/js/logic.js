/*Setting the map to center around the middle of the United States and attaching a zoom level of 4 so that the continental United States is showing */
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 4,
});

/* Using Leaflet's street map to as the background for our analysis */
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    id: "mapbox/world",
    accessToken: API_KEY
}).addTo(myMap);

var baseMaps = {
        "Street Map": streetmap,
        "World Map": Esri_WorldImagery
      };


//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("mapid", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [streetmap, earthquakes]
//   });

/* This allows us to call in the URL for earthquakes in the past seven days and set it to the global variable URL.  If we want to change the dimensions of the data
that we are pulling in, this would be the place to change that */

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

/* Bringing in the dataset and then placing markers with appropriate size and color related to the magnitude of the quake */
d3.json(queryUrl).then(function(data) {
    var earthquakes = data.features;
       console.log(earthquakes);
    /*Sets up our color scheme for earthquakes */
    var color = {
        level1: "#3c0",
        level2: "#9f6",
        level3: "#fc3",
        level4: "#f93",
        level5: "#c60",
        level6: "#c00"
    }

    /* For each of the earthquakes, we are now identifying the lat/long and assessing a severity color to the earthquake */

    for (var i = 0; i < earthquakes.length; i++) {
        var latitude = earthquakes[i].geometry.coordinates[1];
        var longitude = earthquakes[i].geometry.coordinates[0];
        var depth = earthquakes[i].geometry.coordinates[2];
        var magnitude = earthquakes[i].properties.mag;
        
        var fillColor;
        if (depth > 90) {
            fillColor = color.level6;
        } else if (depth > 70) {
            fillColor = color.level5;
        } else if (depth > 50) {
            fillColor = color.level4;
        } else if (depth > 30) {
            fillColor = color.level3;
        } else if (depth > 10) {
            fillColor = color.level2;
        } else {
            fillColor = color.level1;
        }

        /* The radius of each circle will be determined on an exponential scale based on the size of the magnitude.
         I chose to use exponential so that larger earthquakes will have a much higher radius than smaller earthquakes */
        var epicenter = L.circleMarker([latitude, longitude], {
            radius: magnitude ** 2,
            color: "black",
            fillColor: fillColor,
            fillOpacity: 1,
            weight: 1
        });
        epicenter.addTo(myMap);


        /* Set up labels as a pop-up when we use the mouse to point to one of the circles */

        epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude + "<br>Depth: " + depth +
            "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");

    }

    /* Setting the legend to appear in the bottom right of our chart */
    var legend = L.control({
        position: 'bottomright'
    });

    /* Adding on the legend based off the color scheme we have */
    legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['>10', '10-30', '30-50', '50-70', '70-90', '90+'];
        var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00'];
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }
    legend.addTo(myMap);
})







/////********************************************** */
// // Store our API endpoint inside queryUrl

// // var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// // var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-04-01&endtime=" +
// //   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// // Perform a GET request to the query URL
// d3.json(queryUrl).then(function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   createFeatures(data.features);
// });




// function createFeatures(earthquakeData) {

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
// //   function onEachFeature(feature, layer) {
// //     layer.bindPopup("<h3>" + feature.properties.place +
// //       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
// //   }

//     function onEachFeature(feature, layer) {
//       layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });

//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }

// function createMap(earthquakes) {

//   // Define streetmap and darkmap layers
//   var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//   });

//   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
//   });

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Street Map": streetmap,
//     "Dark Map": darkmap
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("mapid", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [streetmap, earthquakes]
//   });

  

//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// }
