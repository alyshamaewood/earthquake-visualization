var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  


  d3.json(url, function(response) {
  
    console.log(response);
    createFeatures(response.features)

  });
  
  function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      style: earthquakeStyle,
      pointToLayer: function(feature, latlng){
          return L.circleMarker(latlng)
      }
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Define lightmap layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

    var overlayMaps = {
        Earthquakes: earthquakes
      };
    

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Light Map": lightmap
    };
  
  
    // Create our map, giving it the lightmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [
        40.09, -94.71
      ],
      zoom: 4,
      layers: [lightmap, earthquakes]
    });

    lightmap.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
  }
  
  function earthquakeStyle(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        weight: 1.5,
        radius: changeSize(feature.properties.mag)
      };

  }

  function chooseColor(depth) {
        switch (true) {
        case depth > 90:
          return "yellow";
        case depth >70:
          return "red";
        case depth > 50:
          return "orange";
        case depth > 30:
          return "green";
        case depth > 10:
          return "purple";
        default:
          return "blue";
        }
      
  }

  function changeSize(magnitude) {
      return magnitude * 5;
  }

    // // Set up the legend
    // var legend = L.control({ position: "bottomright" });
    // legend.onAdd = function() {
    //   var div = L.DomUtil.create("div", "info legend");
    //   var limits = geojson.options.limits;
    //   var colors = geojson.options.colors;
    //   var labels = [];
  
    //   // Add min & max
    // //   var legendInfo = "<h1>Median Income</h1>" +
    // //     "<div class=\"labels\">" +
    // //       "<div class=\"min\">" + limits[0] + "</div>" +
    // //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    // //     "</div>";
  
    //   div.innerHTML = legendInfo;
  
    //   limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //   });
  
    //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //   return div;
    // };
  
    // // Adding legend to the map
    // legend.addTo(myMap);
  