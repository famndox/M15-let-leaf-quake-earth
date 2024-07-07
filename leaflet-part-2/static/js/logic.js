// Create the globe container
let globeContainer = document.getElementById('globe-container');

// Create the globe
let globe = new Cesium.Viewer(globeContainer, {
 // baseLayerPicker: false
});

// Load the earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(response => {
  let j_features = response.features;

  // Create an array to hold earthquake markers
  let earthquakeMarkers = [];

  // Loop through the features array
  for (let index = 0; index < j_features.length; index++) {
    let quake = j_features[index];

    // Determine the marker radius based on the magnitude
    let radius = quake.properties.mag * 4.5;

    // Create a sphere to represent the earthquake
    let entity = globe.entities.add({
        position: Cesium.Cartesian3.fromDegrees(quake.geometry.coordinates[0], quake.geometry.coordinates[1], quake.properties.mag * 1000),
        point: {
          pixelSize: radius * 2, // Convert radius to pixel size
          color: getMagnitudeColor(quake.properties.mag),
          outlineColor: new Cesium.Color(0, 0, 0, 1),
          outlineWidth: 2
        }
      });

    // Add the entity to the earthquakeMarkers array
    earthquakeMarkers.push(entity);
  }
});

// Function to determine the marker color based on the magnitude
function getMagnitudeColor(magnitude) {
  if (magnitude < 1) {
    return new Cesium.Color(0, 0.5, 0, 0.5);
  } else if (magnitude < 2) {
    return new Cesium.Color(0, 0, 1, 0.5);
  } else if (magnitude < 3) {
    return new Cesium.Color(0.2, 0.1, 0.9, 0.5);
  } else if (magnitude < 4) {
    return new Cesium.Color(1, 0.6, 0, 0.5);
  } else {
    return new Cesium.Color(1, 0, 0, 0.5);
  }
}




// Load the tectonic plate boundaries from the JSON URL
d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
  .then(data => {

    // Create an array to hold the tectonic plate boundaries
    let plateBoundaries = data.features;

    // Create an array of colors
    let colors = [
      Cesium.Color.RED,
      Cesium.Color.BLUE,
      Cesium.Color.GREEN,
      Cesium.Color.YELLOW,
      Cesium.Color.CYAN,
      Cesium.Color.MAGENTA,
      Cesium.Color.BLACK
    ];

    // Loop through each feature
    for (let i = 0; i < plateBoundaries.length; i++) {
      let coordinates = plateBoundaries[i].geometry.coordinates;
      let featureCoordinates = [];

      // Loop through each coordinate
      for (let j = 0; j < coordinates.length; j++) {
        let longitude = coordinates[j][0]; // Assuming coordinates is a 2D array
        let latitude = coordinates[j][1]; // Assuming coordinates is a 2D array

        let cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude);
        featureCoordinates.push(cartesian);
      }

      // Create an entity for the feature

      let entity = globe.entities.add({
        name: `Feature ${i}`,
        polyline: {
          positions: featureCoordinates,
          width: 10.0,
          material: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.DEEPSKYBLUE,
            glowPower: 0.25,
          }),
        },
      });


    }

    // Zoom to the entities
    globe.flyTo(globe.entities);
  });
