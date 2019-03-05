var dataURL = "../res/data/hotels.json";
let mapbox = mapApp.$data.mapbox;
addSymbolLayer(mapbox, 'polygon-symbol', '../res/data/taicang-polygonName.json', '../res/img/polygonInfo.png');
addCircleLayer(mapbox, 'project-circle', dataURL, 'rgb(255,60,60)');

var roam = document.getElementById('btnRoam');
roam.addEventListener('click', function () {
    roamSymbols(mapbox, 'project-circle');
});