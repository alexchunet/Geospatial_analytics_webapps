var dataset = ee.Image('USGS/SRTMGL1_003');
var elevation = dataset.select('elevation');
var slope = ee.Terrain.slope(elevation);
var slopeVis = {
    min: 0.0,
    max: 20.0,
    opacity: 0.5,
    palette: ['24126c', 'd4ff50','ff0000'],
    }; //, '1fff4f'
Map.setCenter(32.58, 0.31, 3);
Map.addLayer(slope, slopeVis, 'slope');

Map.add(ui.Label('Topography', {fontWeight: 'bold', fontSize: '24px'}))

//var vis = {min: 0, max: 30, palette: ['24126c', '1fff4f', 'd4ff50']};


// Creates a color bar thumbnail image for use in legend from the given color
// palette.
function makeColorBarParams(palette) {
  return {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette,
  };
}

// Create the color bar for the legend.
var colorBar = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: makeColorBarParams(slopeVis.palette),
  style: {stretch: 'horizontal', margin: '0px 8px', maxHeight: '24px'},
});

// Create a panel with three numbers for the legend.
var legendLabels = ui.Panel({
  widgets: [
    ui.Label(slopeVis.min, {margin: '4px 8px'}),
    ui.Label(
        (slopeVis.max / 2),
        {margin: '4px 8px', textAlign: 'center', stretch: 'horizontal'}),
    ui.Label(slopeVis.max+5, {margin: '4px 8px'})
  ],
  layout: ui.Panel.Layout.flow('horizontal')
});

var legendTitle = ui.Label({
  value: 'Topographic data (slope %)',
  style: {fontWeight: 'bold'}
});

// Add the legendPanel to the map.
var legendPanel = ui.Panel([legendTitle, colorBar, legendLabels]);
legendPanel.style().set('position', 'bottom-center')
Map.add(legendPanel);
