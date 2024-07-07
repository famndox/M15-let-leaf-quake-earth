//
//
//
//
// Modularity is King //

function createMap(earthquakeLayer) {
    let myTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let leaf = L.map("map", {
        center: [39.74170615162854, -105.07071036441819],
        zoom: 4.5,
        layers: [myTile, earthquakeLayer]
    });

    // Layer Control //
    L.control.layers({
//        "The Earth": myTile,
        "Quakes": earthquakeLayer
    }, {}, {
        collapsed: false
    }).addTo(leaf);

    // Legend Control //
    let legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<h4>Magnitude</h4>';
        div.innerHTML += '<ul style="background: #008000"></i><span>0-1</span><br>';
        div.innerHTML += '<ul style="background: #0000FF"></i><span>1-2</span><br>';
        div.innerHTML += '<ul style="background: #36013F"></i><span>2-3</span><br>';
        div.innerHTML += '<ul style="background: #FFA500"></i><span>3-4</span><br>';
        div.innerHTML += '<ul style="background: #FF0000"></i><span>4+</span><br>';
        return div;
    };
    legend.addTo(leaf);
}

function createMarkers(response) {
    let j_features = response.features;

    // Initialize an array to hold earthquake markers.
    let earthquakeMarkers = [];

    // Loop through the features array.
    for (let index = 0; index < j_features.length; index++) {
        let quake = j_features[index];

        // Determine the marker radius based on the magnitude
        let radius = quake.properties.mag * 4.5;

        // For each earthquake, create a marker, and bind a popup with the earthquake's location.
        let quakeMarker = L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
            radius: radius,
            color: getMagnitudeColor(quake.properties.mag),
            opacity: 0.5,
            weight: 1
        })
          .bindPopup("<h3>" + quake.properties.place + "</h3><br>" + "Magnitude:" + quake.properties.mag );

        // Add the marker to the earthquakeMarkers array.
        earthquakeMarkers.push(quakeMarker);
    }

    // Create a layer group that's made from the earthquakeMarkers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));
}

// Function to determine the marker color based on the magnitude
function getMagnitudeColor(magnitude) {
    if (magnitude < 1) {
        return '#008000';
    } else if (magnitude < 2) {
        return '#0000FF';
    } else if (magnitude < 3) {
        return '#36013F';
    } else if (magnitude < 4) {
        return '#FFA500';
    } else {
        return '#FF0000';
    }
}

// Perform an API call to the USGS API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);