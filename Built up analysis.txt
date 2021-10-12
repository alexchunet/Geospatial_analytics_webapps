// OBJECTIVE: Calculate expansion of built up on a specific period

///////////////// CODE FOR CALCULATING BUILT UP CLASS ///////////////////////
var drawingTools = Map.drawingTools();
drawingTools.setShown(false);
Map.setCenter(13.58, 20.31, 3);

// Setup a while loop to clear all existing geometries that have been added as imports from drawing tools (from previously running the script). The design of the app is to handle charting a time series for a single geometry, so remove any that exist.
while (drawingTools.layers().length() > 0) {
  var layer = drawingTools.layers().get(0);
  drawingTools.layers().remove(layer);
}

var dummyGeometry =
    ui.Map.GeometryLayer({geometries: null, name: 'geometry', color: '23cba7'});

drawingTools.layers().add(dummyGeometry);

function clearGeometry() {
  var layers = drawingTools.layers();
  layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
}

function drawRectangle() {
  clearGeometry();
  drawingTools.setShape('rectangle');
  drawingTools.draw();
}

function drawPolygon() {
  clearGeometry();
  drawingTools.setShape('polygon');
  drawingTools.draw();
}

var chartPanel = ui.Panel({
  style:
      {height: '250px', width: '600px', position: 'bottom-right', shown: false}
});

Map.add(chartPanel);

// Universal input
var GHSL= ee.Image('JRC/GHSL/P2016/BUILT_LDSMT_GLOBE_V1')

// Main function
function chartNdviTimeSeries() {
  // Make the chart panel visible the first time a geometry is drawn.
  if (!chartPanel.style().get('shown')) {
    chartPanel.style().set('shown', true);
  }

  // Get the drawn geometry; it will define the reduction region.
  var aoi = drawingTools.layers().get(0).getEeObject();

  // Set the drawing mode back to null; turns drawing off.
  drawingTools.setShape(null);

  // Reduction scale is based on map scale to avoid memory/timeout errors.
  var mapScale = Map.getScale();
  var scale = mapScale > 5000 ? mapScale * 2 : 5000;

  // Chart NDVI time series for the selected area of interest.
  
  var builtUpMultitemporal0 = GHSL.select('built').clip(aoi)
  var builtUpMultitemporal = builtUpMultitemporal0.updateMask(builtUpMultitemporal0.gte(3)); // Masking to have only built up
  var b1975 = builtUpMultitemporal.remap(ee.List([6]),ee.List([1]))
  var b1990 = builtUpMultitemporal.remap(ee.List([5]),ee.List([1]))
  var b2000 = builtUpMultitemporal.remap(ee.List([4]),ee.List([1]))
  var b2015 = builtUpMultitemporal.remap(ee.List([3]),ee.List([1]))
  var area = ee.Image.pixelArea();
  var area_1975 = b1975.multiply(area).rename('area');
  var area_1990 = b1990.multiply(area).rename('area');
  var area_2000 = b2000.multiply(area).rename('area');
  var area_2015 = b2015.multiply(area).rename('area');
  var stats1 = area_1975.reduceRegion({
    reducer: ee.Reducer.sum(), 
    geometry: aoi, 
    scale: 30,
  });
  var stats2 = area_1990.reduceRegion({
    reducer: ee.Reducer.sum(), 
    geometry: aoi, 
    scale: 30,
  });
  var stats3 = area_2000.reduceRegion({
    reducer: ee.Reducer.sum(), 
    geometry: aoi, 
    scale: 30,
  });
  var stats4 = area_2015.reduceRegion({
    reducer: ee.Reducer.sum(), 
    geometry: aoi, 
    scale: 30,
  });
  var discounting_f = ee.Number(1).divide(ee.Number(15))
  var CAGR_1990 = ee.Number(stats2.get('area')).add(stats1.get('area')).divide(ee.Number(stats1.get('area'))).pow(ee.Number(1).divide(ee.Number(15))).subtract(1).multiply(100)
  var CAGR_2000 = ee.Number(stats3.get('area')).add(stats2.get('area')).add(stats1.get('area')).divide(ee.Number(stats2.get('area')).add(stats1.get('area'))).pow(ee.Number(1).divide(ee.Number(10))).subtract(1).multiply(100)
  var CAGR_2015 = ee.Number(stats4.get('area')).add(stats3.get('area')).add(stats2.get('area')).add(stats1.get('area')).divide(ee.Number(stats3.get('area')).add(stats2.get('area')).add(stats1.get('area'))).pow(ee.Number(1).divide(ee.Number(15))).subtract(1).multiply(100)
  var total_area_0 = ee.Number(stats4.get('area')).add(stats3.get('area')).add(stats2.get('area')).add(stats1.get('area')).divide(1000000)
  var total_area = total_area_0.int()
  print(total_area)
  var data = ee.List([CAGR_1990, CAGR_2000, CAGR_2015]);
  var xlab = ee.List(['1975-1990', '1990-2000', '2000-2015'])
  var chart = ui.Chart.array.values(data, 0, xlab)
    .setChartType('ColumnChart').setOptions({
            title: 'Average annual urban built up growth rate',
            hAxis:
                {title: 'Periods', titleTextStyle: {italic: false, bold: true}},
            vAxis: {
              title: 'Growth rate (%)',
              titleTextStyle: {italic: false, bold: true}
            }, colors: ['red', 'yellow', 'red']
    })

  // Replace the existing chart in the chart panel with the new chart.
  chartPanel.widgets().reset()
  chartPanel.widgets().add(ui.Label({
  value: 'Total built up area: '+JSON.stringify(total_area.getInfo() +' km2'),
  style: {width: '500px', height: '20px', fontSize: '18px', color: '484848'}
})).add(chart);
}

drawingTools.onDraw(ui.util.debounce(chartNdviTimeSeries, 500));
drawingTools.onEdit(ui.util.debounce(chartNdviTimeSeries, 500));

var symbol = {
  rectangle: '⬛',
  polygon: '🔺',
};

var controlPanel = ui.Panel({
  widgets: [
    ui.Label('1. Select a drawing mode.'),
    ui.Button({
      label: symbol.rectangle + ' Rectangle',
      onClick: drawRectangle,
      style: {stretch: 'horizontal'}
    }),
    ui.Button({
      label: symbol.polygon + ' Polygon',
      onClick: drawPolygon,
      style: {stretch: 'horizontal'}
    }),
    ui.Label('2. Draw a geometry.'),
    ui.Label('3. Wait for chart to render.'),
    ui.Label(
        '4. Repeat 1-3 or edit/move\ngeometry for a new chart.',
        {whiteSpace: 'pre'})
  ],
  style: {position: 'bottom-left'},
  layout: null,
});


// Visualization of layer
var builtUpMultitemporal_draw = GHSL.select('built')
var builtUpMultitemporal_draw2 = builtUpMultitemporal_draw.updateMask(builtUpMultitemporal_draw.gte(3)); // Masking to have only built up
var visParams = {
  min: 3.0,
  max: 6.0,
  palette: ['FFD700', 'FF7F50', 'FF0000', '8B0000'],
};

Map.addLayer(builtUpMultitemporal_draw2, visParams, 'GHSL')

Map.add(controlPanel);
Map.add(ui.Label('Urban built up expansion', {fontWeight: 'bold', fontSize: '24px'}))
