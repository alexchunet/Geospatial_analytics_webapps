// OBJECTIVE: Calculate change and projection of evolution for a custom area

///////////////// CODE FOR CALCULATING POP ///////////////////////
// Need to make a dropdown menu
var country = null
Map.setCenter(13.58, 20.31, 3);

var places = {
  Afghanistan:['AFG'],Albania:['ALB'],Algeria:['DZA'],American_Samoa:['ASM'],Andorra:['AND'],Angola:['AGO'],Anguilla:['AIA'],Antarctica:['ATA'],Antigua_and_Barbuda:['ATG'],Argentina:['ARG'],Armenia:['ARM'],Aruba:['ABW'],Australia:['AUS'],Austria:['AUT'],Azerbaijan:['AZE'],Bahamas:['BHS'],Bahrain:['BHR'],Bangladesh:['BGD'],Barbados:['BRB'],Belarus:['BLR'],Belgium:['BEL'],Belize:['BLZ'],Benin:['BEN'],Bermuda:['BMU'],Bhutan:['BTN'],Bolivia:['BOL'],Bonaire_Sint_Eustatius_and_Saba:['BES'],Bosnia_and_Herzegovina:['BIH'],Botswana:['BWA'],Bouvet_Island:['BVT'],Brazil:['BRA'],British_Indian_Ocean_Territory:['IOT'],Brunei_Darussalam:['BRN'],Bulgaria:['BGR'],Burkina_Faso:['BFA'],Burundi:['BDI'],Cabo_Verde:['CPV'],Cambodia:['KHM'],Cameroon:['CMR'],Canada:['CAN'],Cayman_Islands:['CYM'],Central_African_Republic:['CAF'],Chad:['TCD'],Chile:['CHL'],China:['CHN'],Christmas_Island:['CXR'],Cocos_Islands:['CCK'],Colombia:['COL'],Comoros:['COM'],Congo_DRC:['COD'],Congo:['COG'],Cook_Islands:['COK'],Costa_Rica:['CRI'],Croatia:['HRV'],Cuba:['CUB'],Curaçao:['CUW'],Cyprus:['CYP'],Czechia:['CZE'],Côte_d_Ivoire:['CIV'],Denmark:['DNK'],Djibouti:['DJI'],Dominica:['DMA'],Dominican_Republic:['DOM'],Ecuador:['ECU'],Egypt:['EGY'],El_Salvador:['SLV'],Equatorial_Guinea:['GNQ'],Eritrea:['ERI'],Estonia:['EST'],Eswatini:['SWZ'],Ethiopia:['ETH'],Falkland_Islands:['FLK'],Faroe_Islands:['FRO'],Fiji:['FJI'],Finland:['FIN'],France:['FRA'],French_Guiana:['GUF'],French_Polynesia:['PYF'],French_Southern_Territories:['ATF'],Gabon:['GAB'],Gambia:['GMB'],Georgia:['GEO'],Germany:['DEU'],Ghana:['GHA'],Gibraltar:['GIB'],Greece:['GRC'],Greenland:['GRL'],Grenada:['GRD'],Guadeloupe:['GLP'],Guam:['GUM'],Guatemala:['GTM'],Guernsey:['GGY'],Guinea:['GIN'],Guinea_Bissau:['GNB'],Guyana:['GUY'],Haiti:['HTI'],Heard_Island_and_McDonald_Islands:['HMD'],Holy_See:['VAT'],Honduras:['HND'],Hong_Kong:['HKG'],Hungary:['HUN'],Iceland:['ISL'],India:['IND'],Indonesia:['IDN'],Iran:['IRN'],Iraq:['IRQ'],Ireland:['IRL'],Isle_of_Man:['IMN'],Israel:['ISR'],Italy:['ITA'],Jamaica:['JAM'],Japan:['JPN'],Jersey:['JEY'],Jordan:['JOR'],Kazakhstan:['KAZ'],Kenya:['KEN'],Kiribati:['KIR'],Korea_DPRK:['PRK'],Korea:['KOR'],Kuwait:['KWT'],Kyrgyzstan:['KGZ'],Lao_People_Democratic_Republic:['LAO'],Latvia:['LVA'],Lebanon:['LBN'],Lesotho:['LSO'],Liberia:['LBR'],Libya:['LBY'],Liechtenstein:['LIE'],Lithuania:['LTU'],Luxembourg:['LUX'],Macao:['MAC'],Madagascar:['MDG'],Malawi:['MWI'],Malaysia:['MYS'],Maldives:['MDV'],Mali:['MLI'],Malta:['MLT'],Marshall_Islands:['MHL'],Martinique:['MTQ'],Mauritania:['MRT'],Mauritius:['MUS'],Mayotte:['MYT'],Mexico:['MEX'],Micronesia:['FSM'],Moldova:['MDA'],Monaco:['MCO'],Mongolia:['MNG'],Montenegro:['MNE'],Montserrat:['MSR'],Morocco:['MAR'],Mozambique:['MOZ'],Myanmar:['MMR'],Namibia:['NAM'],
  Nauru:['NRU'],Nepal:['NPL'],Netherlands:['NLD'],New_Caledonia:['NCL'],New_Zealand:['NZL'],Nicaragua:['NIC'],Niger:['NER'],Nigeria:['NGA'],Niue:['NIU'],Norfolk_Island:['NFK'],Northern_Mariana_Islands:['MNP'],Norway:['NOR'],Oman:['OMN'],Pakistan:['PAK'],Palau:['PLW'],Palestine:['PSE'],Panama:['PAN'],Papua_New_Guinea:['PNG'],Paraguay:['PRY'],Peru:['PER'],Philippines:['PHL'],Pitcairn:['PCN'],Poland:['POL'],Portugal:['PRT'],Puerto_Rico:['PRI'],Qatar:['QAT'],Republic_of_North_Macedonia:['MKD'],Romania:['ROU'],Russian_Federation:['RUS'],Rwanda:['RWA'],Réunion:['REU'],Saint_Barthélemy:['BLM'],Saint_Helena:['SHN'],Saint_Kitts_and_Nevis:['KNA'],Saint_Lucia:['LCA'],Saint_Martin:['MAF'],Saint_Pierre_and_Miquelon:['SPM'],Saint_Vincent_and_the_Grenadines:['VCT'],Samoa:['WSM'],San_Marino:['SMR'],Sao_Tome_and_Principe:['STP'],Saudi_Arabia:['SAU'],Senegal:['SEN'],Serbia:['SRB'],Seychelles:['SYC'],Sierra_Leone:['SLE'],Singapore:['SGP'],Sint_Maarten:['SXM'],Slovakia:['SVK'],Slovenia:['SVN'],Solomon_Islands:['SLB'],Somalia:['SOM'],South_Africa:['ZAF'],South_Georgia_and_the_South_Sandwich_Islands:['SGS'],South_Sudan:['SSD'],Spain:['ESP'],Sri_Lanka:['LKA'],Sudan:['SDN'],Suriname:['SUR'],Svalbard_and_Jan_Mayen:['SJM'],Sweden:['SWE'],Switzerland:['CHE'],Syrian_Arab_Republic:['SYR'],Taiwan:['TWN'],Tajikistan:['TJK'],Tanzania:['TZA'],Thailand:['THA'],Timor_Leste:['TLS'],Togo:['TGO'],Tokelau:['TKL'],Tonga:['TON'],Trinidad_and_Tobago:['TTO'],Tunisia:['TUN'],Turkey:['TUR'],Turkmenistan:['TKM'],Turks_and_Caicos_Islands:['TCA'],Tuvalu:['TUV'],Uganda:['UGA'],Ukraine:['UKR'],United_Arab_Emirates:['ARE'],United_Kingdom_of_Great_Britain_and_Northern_Ireland:['GBR'],United_States_Minor_Outlying_Islands:['UMI'],United_States_of_America:['USA'],Uruguay:['URY'],Uzbekistan:['UZB'],Vanuatu:['VUT'],Venezuela:['VEN'],Viet_Nam:['VNM'],Virgin_Islands_UK:['VGB'],Virgin_Islands_US:['VIR'],Wallis_and_Futuna:['WLF'],Western_Sahara:['ESH'],Yemen:['YEM'],Zambia:['ZMB'],Zimbabwe:['ZWE'],Åland_Islands:['ALA']
};

var select = ui.Select({
  items: Object.keys(places),
  onChange: function(key) {
    country = places[key];
  }
});

// Set a place holder.
select.setPlaceholder('Choose a location...');

///////////////// CODE FOR CALCULATING Pop ///////////////////////
var drawingTools = Map.drawingTools();
drawingTools.setShown(false);

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

// function to add time as a banad
var addTime = function(image) {
  // Scale milliseconds by a large constant to avoid very small slopes
  // in the linear regression output.
  return image.addBands(image.metadata('system:time_start').divide(1e18));
};

  // Chart NDVI time series for the selected area of interest.
  var chart = ui.Chart.image
                  .seriesByRegion({
                    imageCollection: ee.ImageCollection("WorldPop/GP/100m/pop").filter(ee.Filter.inList('country', country))
                    .map(addTime)
                    .select(['system:time_start', 'population']),
                    regions: aoi,
                    reducer: ee.Reducer.sum(),
                    band: 'population',
                    scale: 100,
                    xProperty: 'system:time_start'
                  })
                  .setOptions({
                    titlePostion: 'none',
                    legend: {position: 'none'},
                    hAxis: {title: 'Date'},
                    vAxis: {title: 'Population'},
                    series: {0: {color: '23cba7'}}
                  });

  // Replace the existing chart in the chart panel with the new chart.
  chartPanel.widgets().reset([chart]);
}

drawingTools.onDraw(ui.util.debounce(chartNdviTimeSeries, 500));
drawingTools.onEdit(ui.util.debounce(chartNdviTimeSeries, 500));

var symbol = {
  rectangle: '⬛',
  polygon: '🛑',
};

var controlPanel = ui.Panel({
  widgets: [ui.Label('1. Select a country.'), select,
    ui.Label('2. Select a drawing mode.'),
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
    ui.Label('3. Draw a geometry.'),
    ui.Label('4. Wait for chart to render.'),
    ui.Label(
        '5. Export data by clicking on \ntop-right button of the chart',
        {whiteSpace: 'pre'}),
  ],
  style: {position: 'bottom-left'},
  layout: null,
});

// add 2020 year to the map
var img2010 = ee.ImageCollection("WorldPop/GP/100m/pop") .filterDate('2020');
var populationVis = {
    min: 0.0,
    max: 50.0,
    opacity: 0.4,
    palette: ['24126c', '1fff4f', '8B0000'],
    };

Map.add(controlPanel);
Map.addLayer(img2010, populationVis, 'Population')
Map.add(ui.Label('Automated population estimations (Worldpop)', {fontWeight: 'bold', fontSize: '24px'}))


////////////////////////////////////////////////////////////
