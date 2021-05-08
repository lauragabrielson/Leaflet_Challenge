/*Setting the map to center around the middle of the United States and attaching a zoom level of 4 so that the continental United States is showing */
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 4
});


var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    id: "mapbox/world",
    accessToken: API_KEY

}).addTo(myMap);


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

/* Bringing in the dataset and then placing markers with appropriate size and color related to the magnitude of the quake */
d3.json(queryUrl).then(function(data) {
    var earthquakes = data.features;
       console.log(earthquakes);
    /*Sets up our color scheme for earthquakes */
    var color = {
        level1: "#98FB98",
        level2: "#136F63",
        level3: "#FFFF99",
        level4: "#DAA520",
        level5: "#CD5C5C",
        level6: "#8B0000"
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
        var colors = ['#98FB98', '#136F63', '#FFFF99', '#DAA520', '#CD5C5C', '#8B0000'];
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }
    legend.addTo(myMap);
})


// // Perform a GET request to the query URL
d3.json("../boundaries.json").then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});




