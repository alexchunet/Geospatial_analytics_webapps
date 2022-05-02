// Display a grid of linked maps, each with a different visualization.
// Check this for interpretation of bands
// https://gisgeography.com/sentinel-2-bands-combinations/

/*
 * Image setup
 */

// Create an initial mosiac, which we'll visualize in a few different ways.
var image = ee.ImageCollection('COPERNICUS/S2')
    .filterDate('2021-01-01', '2021-01-30')
    // Scale the images to a smaller range, just for simpler visualization.
    .map(function f(e) { return e.divide(10000); })
    .median();

// Each map has a name and some visualization parameters.
var MAP_PARAMS = {
  'Natural Color (B4/B3/B2)': ['B4', 'B3', 'B2'],
  'Land/Water (B8/B11/B4)': ['B8', 'B11', 'B4'],
  'Color Infrared (B8/B4/B3)': ['B8', 'B4', 'B3'],
  'Vegetation (B12/B11/B4)': ['B12', 'B8A', 'B4']
};

// Shared visualization parameters for the images.
function getVisualization(bands) {
  return {gamma: 1.3, min: 0, max: 0.3, bands: bands};
}


/*
 * Configure maps, link them in a grid
 */

// Create a map for each visualization option.
var maps = [];
Object.keys(MAP_PARAMS).forEach(function(name) {
  var map = ui.Map();
  map.add(ui.Label(name));
  map.addLayer(image, getVisualization(MAP_PARAMS[name]), name);
  map.setControlVisibility(false);
  maps.push(map);
});

var linker = ui.Map.Linker(maps);

// Enable zooming on the top-left map.
maps[0].setControlVisibility({zoomControl: true});

// Show the scale (e.g. '500m') on the bottom-right map.
maps[3].setControlVisibility({scaleControl: true});

// Create a grid of maps.
var mapGrid = ui.Panel(
    [
      ui.Panel([maps[0], maps[1]], null, {stretch: 'both'}),
      ui.Panel([maps[2], maps[3]], null, {stretch: 'both'})
    ],
    ui.Panel.Layout.Flow('horizontal'), {stretch: 'both'});

// Center the map at an interesting spot in Greece. All
// other maps will align themselves to this parent map.
maps[0].setCenter(-17.349982, 14.760296, 12);


/*
 * Add a title and initialize
 */

// Create a title.
var title = ui.Label('Janvier 2021 Sentinel-2 Visualizations', {
  stretch: 'horizontal',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '24px'
});

// Add the maps and title to the ui.root.
ui.root.widgets().reset([title, mapGrid]);
ui.root.setLayout(ui.Panel.Layout.Flow('vertical'));
