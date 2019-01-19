var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log (API_quakes)

function markerSize(mag) {
    return mag * 3;
};


var earthquakes = new L.LayerGroup();

d3.json(API_quakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 1.0,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

function Color(mag) {
    if (mag > 5) {
        return '#f06b6b'
    } else if (mag > 4) {
        return '#f0a76b'
    } else if (mag > 3) {
        return '#f3db4d'
    } else if (mag > 2) {
        return '#f3db4d'
    } else if (mag > 1) {
        return '#e1f34d'
    } else {
        return '#b7f34d'
    }
};

function createMap() {

    

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoic25ndXllbjA4MTUiLCJhIjoiY2pwdWlyaGFyMGg1azQ5bzljY2UxbWg0eSJ9.Dgo_T970XPqN6Qbu8QQ12Q'
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1Ijoic25ndXllbjA4MTUiLCJhIjoiY2pwdWlyaGFyMGg1azQ5bzljY2UxbWg0eSJ9.Dgo_T970XPqN6Qbu8QQ12Q'
    });

    var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 20,
        id: "mapbox.pirates",
        accessToken: 'pk.eyJ1Ijoic25ndXllbjA4MTUiLCJhIjoiY2pwdWlyaGFyMGg1azQ5bzljY2UxbWg0eSJ9.Dgo_T970XPqN6Qbu8QQ12Q'
    });




    var baseLayers = {

        "Street": streetMap,
        "Satellite": satellite,
        "Pirates": pirates
        
    };

    var overlays = {
        "Earthquakes": earthquakes,
    };

    var mymap = L.map('mymap', {
        center: [40, -99],
        zoom: 4.4,
        
        layers: [pirates, earthquakes,]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);
   

    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Legend</h4>"

        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);
}