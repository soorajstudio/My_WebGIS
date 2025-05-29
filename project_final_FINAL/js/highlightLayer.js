var highlightLayer;

function highlightFeature(e) {
   highlightLayer = e.target;

   if (e.target.feature.geometry.type === 'LineString' || e.target.feature.geometry.type === 'MultiLineString') {
      highlightLayer.setStyle({
         color: '#ffff00',
      });
   } else {
      highlightLayer.setStyle({
         fillColor: '#ffff00',
         fillOpacity: 1
      }); 
   }
   highlightLayer.openPopup();
}
var map = L.map('map', {
   zoomControl: false,
   maxZoom: 28,
   minZoom: 1
}).fitBounds([
   [10.520161256285657, 76.20949638787042],
   [10.529179385538242, 76.22212720143202]
]);
var hash = new L.Hash(map);
var autolinker = new Autolinker({
   truncate: {
      length: 30,
      location: 'smart'
   }
});
// remove popup's row if "visible-with-data"
function removeEmptyRowsFromPopupContent(content, feature) {
   var tempDiv = document.createElement('div');
   tempDiv.innerHTML = content;
   var rows = tempDiv.querySelectorAll('tr');
   for (var i = 0; i < rows.length; i++) {
      var td = rows[i].querySelector('td.visible-with-data');
      var key = td ? td.id : '';
      if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
         rows[i].parentNode.removeChild(rows[i]);
      }
   }
   return tempDiv.innerHTML;
}
// add class to format popup if it contains media
function addClassToPopupIfMedia(content, popup) {
   var tempDiv = document.createElement('div');
   tempDiv.innerHTML = content;
   if (tempDiv.querySelector('td img')) {
      popup._contentNode.classList.add('media');
      // Delay to force the redraw
      setTimeout(function() {
         popup.update();
      }, 10);
   } else {
      popup._contentNode.classList.remove('media');
   }
}
var zoomControl = L.control.zoom({
   position: 'topright'
}).addTo(map);
L.control.locate({
   locateOptions: {
      maxZoom: 19
   }
}).addTo(map);
var bounds_group = new L.featureGroup([]);

function setBounds() {}
map.createPane('pane_GoogleSatellite_0');
map.getPane('pane_GoogleSatellite_0').style.zIndex = 400;
var layer_GoogleSatellite_0 = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
   pane: 'pane_GoogleSatellite_0',
   opacity: 1.0,
   attribution: '<a href="https://stthomas.ac.in/">St. Thomas College (Autonomous) | Thrissur</a>',
   minZoom: 1,
   maxZoom: 28,
   minNativeZoom: 0,
   maxNativeZoom: 20
});
layer_GoogleSatellite_0;
map.addLayer(layer_GoogleSatellite_0);

function pop_TCR_CORP_ROADS_1(feature, layer) {
   layer.on({
      mouseout: function(e) {
         for (var i in e.target._eventParents) {
            if (typeof e.target._eventParents[i].resetStyle === 'function') {
               e.target._eventParents[i].resetStyle(e.target);
            }
         }
         if (typeof layer.closePopup == 'function') {
            layer.closePopup();
         } else {
            layer.eachLayer(function(feature) {
               feature.closePopup()
            });
         }
      },
      mouseover: highlightFeature,
   });
   var popupContent = '<table>\
                    <tr>\
                    </tr>\
                    <tr>\
                        <td class="visible-with-data" id="name" colspan="2"><strong>Name : </strong><br />' + (feature.properties['name'] !== null ? autolinker.link(String(feature.properties['name']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
   var content = removeEmptyRowsFromPopupContent(popupContent, feature);
   layer.on('popupopen', function(e) {
      addClassToPopupIfMedia(content, e.popup);
   });
   layer.bindPopup(content, {
      maxHeight: 400
   });
}

function style_TCR_CORP_ROADS_1_0() {
   return {
      pane: 'pane_TCR_CORP_ROADS_1',
      opacity: 1,
      color: 'rgba(196,60,57,1.0)',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      weight: 1.0,
      fillOpacity: 0,
      interactive: true,
   }
}
map.createPane('pane_TCR_CORP_ROADS_1');
map.getPane('pane_TCR_CORP_ROADS_1').style.zIndex = 401;
map.getPane('pane_TCR_CORP_ROADS_1').style['mix-blend-mode'] = 'normal';
var layer_TCR_CORP_ROADS_1 = new L.geoJson(json_TCR_CORP_ROADS_1, {
   attribution: '',
   interactive: true,
   dataVar: 'json_TCR_CORP_ROADS_1',
   layerName: 'layer_TCR_CORP_ROADS_1',
   pane: 'pane_TCR_CORP_ROADS_1',
   onEachFeature: pop_TCR_CORP_ROADS_1,
   style: style_TCR_CORP_ROADS_1_0,
});
bounds_group.addLayer(layer_TCR_CORP_ROADS_1);
map.addLayer(layer_TCR_CORP_ROADS_1);

function pop_schoolbuffercool_2(feature, layer) {
   layer.on({
      mouseout: function(e) {
         for (var i in e.target._eventParents) {
            if (typeof e.target._eventParents[i].resetStyle === 'function') {
               e.target._eventParents[i].resetStyle(e.target);
            }
         }
         if (typeof layer.closePopup == 'function') {
            layer.closePopup();
         } else {
            layer.eachLayer(function(feature) {
               feature.closePopup()
            });
         }
      },
      mouseover: highlightFeature,
   });
   var popupContent = '<table>\
                    <tr>\
                        <td class="visible-with-data" id="Institutio" colspan="2"><strong>Institution : </strong><br />' + (feature.properties['Institutio'] !== null ? autolinker.link(String(feature.properties['Institutio']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
   var content = removeEmptyRowsFromPopupContent(popupContent, feature);
   layer.on('popupopen', function(e) {
      addClassToPopupIfMedia(content, e.popup);
   });
   layer.bindPopup(content, {
      maxHeight: 400
   });
}

function style_schoolbuffercool_2_0() {
   return {
      pane: 'pane_schoolbuffercool_2',
      opacity: 1,
      color: 'rgba(77,175,74,1.0)',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      weight: 4.0,
      fillOpacity: 0,
      interactive: true,
   }
}
map.createPane('pane_schoolbuffercool_2');
map.getPane('pane_schoolbuffercool_2').style.zIndex = 402;
map.getPane('pane_schoolbuffercool_2').style['mix-blend-mode'] = 'normal';
var layer_schoolbuffercool_2 = new L.geoJson(json_schoolbuffercool_2, {
   attribution: '',
   interactive: true,
   dataVar: 'json_schoolbuffercool_2',
   layerName: 'layer_schoolbuffercool_2',
   pane: 'pane_schoolbuffercool_2',
   onEachFeature: pop_schoolbuffercool_2,
   style: style_schoolbuffercool_2_0,
});
bounds_group.addLayer(layer_schoolbuffercool_2);
map.addLayer(layer_schoolbuffercool_2);

function pop_schoolpointsfinal_3(feature, layer) 
{
   layer.on({
      mouseout: function(e) {
         for (var i in e.target._eventParents) {
            if (typeof e.target._eventParents[i].resetStyle === 'function') {
               e.target._eventParents[i].resetStyle(e.target);
            }
         }
         if (typeof layer.closePopup == 'function') {
            layer.closePopup();
         } else {
            layer.eachLayer(function(feature) {
               feature.closePopup()
            });
         }
      },
      mouseover: highlightFeature,
   });
   var popupContent = '<table>\
                    <tr>\
                        <td class="visible-with-data" id="Institutio" colspan="2">' + (feature.properties['Institutio'] !== null ? autolinker.link(String(feature.properties['Institutio']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
    <td class="visible-with-data" id="image" colspan="10">\
        ' + (feature.properties['image'] !== null ? 
              '<img src="' + String(feature.properties['image']).replace(/'/g, '\'').toLocaleString() + 
              '" alt="Institution Image" style="max-width:175px; height:100px;" />' 
            : '') + '\
    </td>\
</tr>\
                </table>';
   var content = removeEmptyRowsFromPopupContent(popupContent, feature);
   layer.on('popupopen', function(e) {
      addClassToPopupIfMedia(content, e.popup);
   });
   layer.bindPopup(content, {
      maxHeight: 400
   });
}

function style_schoolpointsfinal_3_0() {
   return {
      pane: 'pane_schoolpointsfinal_3',
      radius: .0,
      opacity: 1,
      color: 'rgba(35,35,35,1.0)',
      dashArray: '',
      lineCap: 'butt',
      lineJoin: 'miter',
      weight: 1,
      fill: true,
      fillOpacity: 1,
      fillColor: 'rgba(125,183,131,1.0)',
      interactive: true,
   }
}
map.createPane('pane_schoolpointsfinal_3');
map.getPane('pane_schoolpointsfinal_3').style.zIndex = 403;
map.getPane('pane_schoolpointsfinal_3').style['mix-blend-mode'] = 'normal';
var layer_schoolpointsfinal_3 = new L.geoJson(json_schoolpointsfinal_3, {
   attribution: '',
   interactive: true,
   dataVar: 'json_schoolpointsfinal_3',
   layerName: 'layer_schoolpointsfinal_3',
   pane: 'pane_schoolpointsfinal_3',
   onEachFeature: pop_schoolpointsfinal_3,
   pointToLayer: function(feature, latlng) {
      var context = {
         feature: feature,
         variables: {}
      };
      return L.circleMarker(latlng, style_schoolpointsfinal_3_0(feature));
   },
});
bounds_group.addLayer(layer_schoolpointsfinal_3);
map.addLayer(layer_schoolpointsfinal_3);
var overlaysTree = [{
      label: '<img src="legend/schoolpointsfinal_3.png" />  Schools',
      layer: layer_schoolpointsfinal_3
   },
   {
      label: '<img src="legend/schoolbuffercool_2.png" />  Buffered Area',
      layer: layer_schoolbuffercool_2
   },
   {
      label: '<img src="legend/TCR_CORP_ROADS_1.png" />  Roads',
      layer: layer_TCR_CORP_ROADS_1
   },
   
   //importantano
   /*{
      label: "Google Satellite",
      layer: layer_GoogleSatellite_0,
      radioGroup: 'bm'
   },*/
]


var lay = L.control.layers.tree(null, overlaysTree, {
   //namedToggle: true,
   //selectorBack: false,
   //closedSymbol: '&#8862; &#x1f5c0;',
   //openedSymbol: '&#8863; &#x1f5c1;',
   //collapseAll: 'Collapse all',
   //expandAll: 'Expand all',
   collapsed: true,
});
lay.addTo(map);
setBounds();
map.addControl(new L.Control.Search({
   layer: layer_schoolpointsfinal_3,
   initial: false,
   hideMarkerOnCollapse: true,
   propertyName: 'Institutio'
}));
document.getElementsByClassName('search-button')[0].className +=
   ' fa fa-binoculars';