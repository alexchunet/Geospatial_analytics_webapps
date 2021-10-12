// OBJECTIVE: Calculate variation of NDVI on a specific period

///////////////// CODE FOR CALCULATING NDVI ///////////////////////
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
      {height: '235px', width: '600px', position: 'bottom-right', shown: false}
});

Map.add(chartPanel);

var l8raw = ee.ImageCollection('LANDSAT/LC08/C01/T1')

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
  
  // Variables before charting
  var collectionL8 = l8raw.filterBounds(aoi).filterMetadata('CLOUD_COVER','less_than', 20)
  // Define a function
  var calcSLT = collectionL8.map(function(image){
    //calculate NDVI
    var ndvi = image.normalizedDifference(['B5','B4'])
    // calculate the minimum NDVI value within the scene
    var minNdvi = ee.Number(ndvi.reduceRegion({
      reducer: ee.Reducer.min(),
      geometry: aoi,
      scale: 30,
      maxPixels: 1e9}).get('nd'))
    // calculate the maximum NDVI value within the scene
    var maxNdvi = ee.Number(ndvi.reduceRegion({
      reducer: ee.Reducer.max(),
      geometry: aoi,
      scale: 30,
      maxPixels: 1e9}).get('nd'))
    // calculate the proportion of vegetation in the scene
    // pixels with "a lot" of vegetation will be signfied with a high number (close to 1)  
    var PV = image.expression(
        'sqrt((NDVI - NDVImin) / (NDVImax - NDVImin))', {
          'NDVI': ndvi,
          'NDVImin': minNdvi,
          'NDVImax':maxNdvi
    });
    /// extract relevant parameters from the metadata of each scene in the collection:
    ///////// B10//////////////////  
    var MLB10 = ee.Number(image.get('RADIANCE_MULT_BAND_10')) ///Radiance multiplicative Band 10
    var ALB10 = ee.Number(image.get('RADIANCE_ADD_BAND_10')) //// Radiance Add Band 10
    var K2B10 = ee.Number(image.get('K2_CONSTANT_BAND_10')) ///K2 Constant Band 10
    var K1B10 = ee.Number(image.get('K1_CONSTANT_BAND_10')) ///K1 Constant Band 10
    ///////// B11//////////////////  
    var MLB11 = ee.Number(image.get('RADIANCE_MULT_BAND_11')) ///Radiance multiplicative Band 11
    var ALB11 = ee.Number(image.get('RADIANCE_ADD_BAND_11')) //// Radiance Add Band 11
    var K2B11 = ee.Number(image.get('K2_CONSTANT_BAND_11')) ///K2 Constant Band 11
    var K1B11 = ee.Number(image.get('K1_CONSTANT_BAND_11')) ///K1 Constant Band 11
    ///////// calculate SLT with B10//////////////////  
    // calculate TOA (Top of Atmospheric) spectral radiance
    var TOA10 = image.expression(
      '(ML * DN) + AL',{
        'ML': MLB10,
        'AL': ALB10,
        'DN': image.select('B10')
      }
        )
    // calculate Brightness Temperature
    var BT10 = image.expression(
        '(K2 / (log((K1 / L) + 1)))- 273.15', {
          'K2': K2B10,
          'L': TOA10,
          'K1':K1B10
    });
    // Calculate Emissivity ε
    var eB10 = PV.expression(
      '0.004 * Pv + 0.986',{
        'Pv': PV
      }
      )
    // Calculate the Land Surface Temperature
    var LSTB10 = BT10.expression(
      'BT / (1 + ((10.60 * BT / 14380) * log10(e)))',{
        'BT': BT10,
        'e': eB10
      }
      ).rename('LSTB10')
     ///////// calculate SLT with B11//////////////////
    var TOA11 = image.expression(
      '(ML * DN) + AL',{
        'ML': MLB11,
        'AL': ALB11,
        'DN': image.select('B11')
      }
        )
    // calculate Brightness Temperature
    var BT11 = image.expression(
        '(K2 / (log((K1 / L) + 1)))- 273.15', {
          'K2': K2B11,
          'L': TOA11,
          'K1':K1B11
    });
    // Calculate Emissivity ε
    var eB11 = PV.expression(
      '0.004 * Pv + 0.986',{
        'Pv': PV
      }
      )
    // Calculate the Land Surface Temperature
    var LSTB11 = BT11.expression(
      'BT / (1 + ((11.5 * BT / 14380) * log10(e)))',{
        'BT': BT11,
        'e': eB11
      }
      ).rename('LSTB11')
      
    /// create an image that has the LST of Band 10 and Band 11. Calculate the average between these value
        var LSTB10B11= ee.Image((LSTB10.add(LSTB11)).divide(2)).clip(aoi).rename('averageTLS').copyProperties(image, ['system:time_start'])
      return LSTB10B11
    })
  var image_viz = calcSLT.filterDate('2021-05-01', '2021-06-23').select('averageTLS').mean()
  Map.addLayer(image_viz,{palette: [
    '1a3678', '2955bc', '5699ff', '8dbae9', 'acd1ff', 'caebff', 'e5f9ff',
    'fdffb4', 'ffe6a2', 'ffc969', 'ffa12d', 'ff7c1f', 'ca531a', 'ff0000',
    'ab0000'
  ], min:10, max: 40},'SLT')
  // Chart NDVI time series for the selected area of interest.
  var chart = ui.Chart.image
                  .seriesByRegion({
                    imageCollection: calcSLT,
                    regions: aoi,
                    reducer: ee.Reducer.mean(),
                    band: 'averageTLS',
                    scale: scale,
                    xProperty: 'system:time_start'
                  })
                  .setOptions({
                    titlePostion: 'none',
                    legend: {position: 'none'},
                    hAxis: {title: 'Date'},
                    vAxis: {title: 'Mean temperature'},
                    series: {0: {color: '23cba7'}}
                  });

  // Replace the existing chart in the chart panel with the new chart.
  chartPanel.widgets().reset([chart]);
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

Map.add(controlPanel);
Map.add(ui.Label('Urban heat islands - Surface temperature', {fontWeight: 'bold', fontSize: '24px'}))


///////////////////////////////////////////////////////////////////

