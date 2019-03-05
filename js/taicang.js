function addPolygon(mapbox) {
    var polygonDataURL = "../res/data/taicang-polygon.json";
    var polygonNameURL = "../res/data/taicang-polygonName.json";
    var polygonName;

    $.getJSON(polygonNameURL, function (nameData) {
        polygonName = nameData;
        console.log(polygonName);
    });

    $.getJSON(polygonDataURL, function (polygon) {
        console.log("add polygon layer");
        console.log(polygon);

        mapbox.addSource('polygon', {
            "type": "geojson",
            "data": polygon,
        });
        mapbox.addSource('polygonName', {
            "type": "geojson",
            "data": polygonName,
        });

        mapbox.addLayer({
            "id": "tc-polygon",
            "type": "fill",
            "source": "polygon",
            "minzoom": 0,
            "maxzoom": 11.4,
            "paint": {
                "fill-outline-color": '#303030',
                "fill-color": ["get", "fill-color"],
                "fill-opacity": 0.8

            }
        });
        mapbox.addLayer({
            "id": "polygon-line",
            "type": "line",
            "source": "polygon",
            "minzoom": 0,
            "maxzoom": 11.4,
            "paint": {
                "line-color": "#00B7FF",
                "line-width": 3
            }
        });
        mapbox.addLayer({
            "id": "polygon-name",
            "type": "symbol",
            "source": "polygonName",
            "minzoom": 10,
            "maxzoom": 11.4,
            "layout": {
                "text-field": ['get', 'Name'],
                "text-size": 18
            },
            "paint": {
                "text-color": "white",
                'text-halo-color': "black",
                'text-halo-width': 1,
            }
        });

        mapbox.on('click', 'polygon-name', function (e) {

            console.log(e.features[0].geometry.coordinates);
            mapbox.flyTo({
                center: [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]],
                zoom: 15,
                speed: 0.4,
                curve: 1,
                easing(t) {
                    return t;
                }
            });
        });
        mapbox.on("click", function (e) {
            console.log(e.lngLat + '\tpitch:' + mapbox.getPitch() + '\tzoom:' + mapbox.getZoom());
        });
    });
}

function addSmallPolygon(mapbox, relativeMapbox) {
    var polygonDataURL = "../res/data/taicang-polygon.json";
    var polygonNameURL = "../res/data/taicang-polygonName.json";
    var polygonName;

    $.getJSON(polygonNameURL, function (nameData) {
        polygonName = nameData;
        console.log(polygonName);
    });

    $.getJSON(polygonDataURL, function (polygon) {
        console.log("add polygon layer");
        console.log(polygon);

        mapbox.addSource('polygon', {
            "type": "geojson",
            "data": polygon,
        });
        mapbox.addSource('polygonName', {
            "type": "geojson",
            "data": polygonName,
        });

        mapbox.addLayer({
            "id": "tc-polygon",
            "type": "fill",
            "source": "polygon",
            "minzoom": 0,
            "maxzoom": 11.4,
            "paint": {
                "fill-outline-color": '#303030',
                "fill-color": ["get", "fill-color"],
                // "fill-opacity": 0.8,
                "fill-opacity": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    1,
                    0.5
                ]
            }
        });
        mapbox.addLayer({
            "id": "polygon-line",
            "type": "line",
            "source": "polygon",
            "minzoom": 0,
            "maxzoom": 11.4,
            "paint": {
                "line-color": "#00B7FF",
                "line-width": 2
            }
        });
        mapbox.addLayer({
            "id": "polygon-name",
            "type": "symbol",
            "source": "polygonName",
            "minzoom": 8.4,
            "maxzoom": 11.4,
            "layout": {
                "text-field": ['get', 'Name'],
                "text-size": 13
            },
            "paint": {
                "text-color": "white",
                'text-halo-color': "black",
                'text-halo-width': 1,
            }
        });

        mapbox.on('click', 'polygon-name', function (e) {

            console.log(e.features[0].geometry.coordinates);
            relativeMapbox.flyTo({
                center: [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]],
                zoom: 15,
                speed: 0.6,
                curve: 1,
                easing(t) {
                    return t;
                }
            });
        });
        mapbox.on("click", function (e) {
            console.log(e.lngLat + '\tpitch:' + mapbox.getPitch() + '\tzoom:' + mapbox.getZoom());
        });

        var hoveredStateId = null;
        // When the user moves their mouse over the state-fill layer, we'll update the
        // feature state for the feature under the mouse.
        mapbox.on("mousemove", "tc-polygon", function (e) {
            if (e.features.length > 0) {
                if (hoveredStateId) {
                    mapbox.setFeatureState({ source: 'polygon', id: hoveredStateId }, { hover: false });
                }
                hoveredStateId = e.features[0].id;
                mapbox.setFeatureState({ source: 'polygon', id: hoveredStateId }, { hover: true });
            }
        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        mapbox.on("mouseleave", "tc-polygon", function () {
            if (hoveredStateId) {
                mapbox.setFeatureState({ source: 'polygon', id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = null;
        });

        relativeMapbox.on('mousemove', function (e) {
            console.log(relativeMapbox.project(relativeMapbox.getCenter()));
            //console.log('map move end,center:' + relativeMapbox.getCenter() + '\t' + relativeMapbox.project(relativeMapbox.getCenter()));
            console.log('map mouse move:' + e.point);
            var centerPolygon = relativeMapbox.querySourceFeatures(
                e.point,
                {
                    layers: ['tc-polygon']
                });
            console.log(centerPolygon);
        });
    });
}

function getMapStyle(mapContainer) {
    if (mapContainer == undefined) {
        mapContainer = 'map';
    }
    mapboxgl.accessToken = 'pk.eyJ1IjoieWFteSIsImEiOiJjanI2MDlxMDkwazl4NDNwaG5iMjJ3czBxIn0.AobOEFxFlQpsx1GCoHb-Aw';
    return {
        container: mapContainer,
        center: [121.14753291842118, 31.540494022433435],
        zoom: 11.36132586570676,
        pitch: 60,
        bearing: -10,
        style: "mapbox://styles/yamy/cjsebldkr212e1fpo9jr55no6",
        boxHeight: 12,
        postEffect: {
            enable: true,
            SSAO: {
                enable: true,
                radius: 2,
                intensity: 1.5
            }
        },
        light: {
            main: {
                intensity: 2,
                shadow: true,
                shadowQuality: 'high'
            },
            ambient: {
                intensity: 0.
            },
            ambientCubemap: {
                texture: '../res/hdr/ShanghaiBuildingPrice.hdr',
                exposure: 1,
                diffuseIntensity: 0.5
            }
        },
    }
}

function addLayerPopup(mapbox, layerName, getHTMLCallback) {

    // Create a popup, but don't add it to the mapbox yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    mapbox.on('mouseenter', layerName, function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the mapbox is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // console.log(coordinates[0][0]);
        popup.setLngLat(coordinates)
            .setDOMContent(getHTMLCallback(e))
            .addTo(mapbox);
    });

    mapbox.on('mouseleave', layerName, function () {
        popup.remove();
    });
}

function addCircleLayer(mapbox, layerName, dataURL, circleColor, beforeLayer) {

    $.getJSON(dataURL, function (geoJsonData) {
        console.log("add circle layer:" + layerName);
        mapbox.addSource(layerName, {
            "type": "geojson",
            "data": geoJsonData,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        //聚合图层圆圈
        mapbox.addLayer({
            id: layerName + "-cluster",
            type: "circle",
            source: layerName,
            "minzoom": 11.4,
            "maxzoom": 20,
            filter: ["has", "point_count"],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    "#04424B",
                    10,
                    "#04424B",
                    30,
                    "#04424B"
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    20,
                    10,
                    30,
                    30,
                    40
                ],
                "circle-opacity": 0.8
            }
        }, beforeLayer);
        //聚合图层数字
        mapbox.addLayer({
            id: layerName + "-cluster-count",
            type: "symbol",
            source: layerName,
            "minzoom": 11.4,
            "maxzoom": 20,
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 25,
            },
            paint: {
                "text-color": "white",
            }
        }, beforeLayer);

        //普通点图层
        /* mapbox.addLayer({
            "id": layerName,
            "type": "circle",
            "source": layerName,
            "minzoom": 11.4,
            "maxzoom": 20,
            "filter": ["!", ["has", "point_count"]],
            "paint": {
                "circle-radius": 3,
                "circle-color": circleColor,
                "circle-opacity": 0.8,
                "circle-stroke-color": circleColor,
                "circle-stroke-width": 3,
                "circle-stroke-opacity": 0.3,
            }
        }, beforeLayer);
         */
        mapbox.loadImage('../res/img/zhazhan1.png', function (error, image) {
            if (error) throw error;
            mapbox.addImage('zhazhan1', image);
            mapbox.loadImage('../res/img/zhazhan2.png', function (error, image) {
                if (error) throw error;
                mapbox.addImage('zhazhan2', image);
                mapbox.loadImage('../res/img/zhazhan3.png', function (error, image) {
                    if (error) throw error;
                    mapbox.addImage('zhazhan3', image);
                    mapbox.addLayer({
                        "id": layerName,
                        "type": "symbol",
                        "source": layerName,
                        "minzoom": 11.4,
                        "maxzoom": 20,
                        "filter": ["!", ["has", "point_count"]],
                        "layout": {
                            "icon-image": [
                                'match',
                                ['get', 'KIND'],
                                '5380', 'zhazhan1',
                                '5082', 'zhazhan2',
                                '5083', 'zhazhan2',
                                '5084', 'zhazhan2',
                                '5085', 'zhazhan2',
                                '5501', 'zhazhan3',
                                '5502', 'zhazhan3',
                                    /* other */ '#zhazhan1'
                            ],
                            //"text-field": ["get", "NAME"],
                            "icon-ignore-placement": true,
                            "icon-anchor": 'top',
                            "text-anchor": 'bottom',
                            "icon-size": 0.2
                        },
                        "paint": {
                            "text-color": 'white',
                        }
                    });
                });
            });
        });

        addLayerPopup(mapbox, layerName, getWaterInfoElement);

        // inspect a cluster on click
        mapbox.on('click', layerName + '-cluster', function (e) {
            var features = mapbox.queryRenderedFeatures(e.point, { layers: [layerName + '-cluster'] });
            var clusterId = features[0].properties.cluster_id;
            mapbox.getSource(layerName).getClusterExpansionZoom(clusterId, function (err, zoom) {
                if (err)
                    return;

                mapbox.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            });
        });

        mapbox.on('mouseenter', layerName + '-cluster', function () {
            mapbox.getCanvas().style.cursor = 'pointer';
        });
        mapbox.on('mouseleave', layerName + '-cluster', function () {
            mapbox.getCanvas().style.cursor = '';
        });
    });
}

function addSymbolLayer(mapbox, layerName, dataURL, iconURL) {
    $.getJSON(dataURL, function (geoJsonData) {
        mapbox.loadImage(iconURL, function (error, image) {
            if (error) throw error;

            mapbox.addImage(layerName, image);
            console.log("add symbol layer:" + layerName);

            mapbox.addSource(layerName, {
                "type": "geojson",
                "data": geoJsonData,
            });
            mapbox.addLayer({
                "id": layerName,
                "type": "symbol",
                "source": layerName,
                "minzoom": 10.4,
                "maxzoom": 11.4,
                "layout": {
                    "icon-image": layerName,
                    "text-field": ["get", "NAME"],
                    "icon-ignore-placement": true,
                    "icon-anchor": 'top',
                    "text-anchor": 'bottom',
                    "icon-size": 0.5,
                    "icon-offset": [300, -300]
                },
                "paint": {
                    "text-color": 'white',
                }
            });
        });

        addLayerPopup(mapbox, layerName, function (e) {
            var h4 = document.createElement('h4');
            h4.innerText = e.features[0].properties.NAME;
            return h4;
        });
    });
}

function addExtrusionLayer(mapbox, layerName, dataURL, color) {

    $.getJSON(dataURL, function (geoJsonData) {
        console.log("add extrusion layer:" + layerName);
        mapbox.addSource(layerName, {
            "type": "geojson",
            "data": geoJsonData,
        });
        mapbox.addLayer({
            "id": layerName,
            "type": "fill-extrusion",
            "source": layerName,
            "minzoom": 0,
            "maxzoom": 20,
            "paint": {
                "fill-extrusion-height": 100,
                "fill-extrusion-color": color
            }
        });

        addLayerPopup(mapbox, layerName, function (e) {
            var h4 = document.createElement('h4');
            h4.innerText = e.features[0].properties.NAME;
            return h4;
        })
    });
}

function addMarkers(mapbox, dataURL, getHTMLCallback) {
    $.get(dataURL, function (geoJsonData) {
        geoJsonData.features.forEach(function (marker) {
            /* // create a DOM element for the marker
            var el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = '';
            el.style.width = marker.properties.iconSize[0] + 'px';
            el.style.height = marker.properties.iconSize[1] + 'px';
              */
            // el.addEventListener('click', function() {
            // window.alert(marker.properties.message);
            // });

            // add marker to mapbox
            new mapboxgl.Marker(getHTMLCallback(marker))
                .setLngLat(marker.geometry.coordinates)
                .addTo(mapbox);
        });
    });
}

function addLineLayer(mapbox, layerName, dataURL, color, filter, beforLayer) {
    $.getJSON(dataURL, function (geoJsonData) {
        mapbox.addSource(layerName, {
            "type": "geojson",
            "data": geoJsonData,
        });
        mapbox.addLayer({
            "id": layerName,
            "type": "line",
            "source": layerName,
            "filter": filter,
            "minzoom": 11.4,
            "maxzoom": 20,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": color,
                "line-width": 2,
                "line-blur": 0.8,
            }
        }, beforLayer);
    });
}

function addFillExtrusionLayer(mapbox, layerName, dataURL, beforLayer) {

    $.getJSON(dataURL, function (polygon) {
        console.log("add polygon layer");
        console.log(polygon);

        mapbox.addSource(layerName, {
            "type": "geojson",
            "data": polygon,
        });

        mapbox.addLayer({
            "id": layerName,
            "type": "fill-extrusion",
            "source": layerName,
            "minzoom": 0,
            "maxzoom": 20,
            "paint": {
                "fill-extrusion-color": ["get", "fill-color"],
                "fill-extrusion-opacity": 0.8,
                'fill-extrusion-height': 50 * 10,
            }
        }, beforLayer);
    });
}

function roamSymbols(mapbox, layerName, filter) {
    var features = mapbox.querySourceFeatures(layerName, {
        filter:
            ['in',
                'KIND',
                '5082', '5083', '5084', '5085']
    });

    console.log('roam symbols,find result:' + features.length);
    if (features.length == 0) {
        return;
    }

    roam(mapbox, {
        center: features[0].geometry.coordinates,
        zoom: 15,
        speed: 1.2,
        curve: 1,
        easing(t) {
            return t;
        }
    }, features);
}

function roam(mapbox, option, features) {
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    var index = 0;
    flyTo(mapbox, option);
    index++;

    var isEnd = false;

    var callback = function () {
        console.log("roaming...move end");
        if (isEnd) {
            console.log('end roam');
            mapbox.off('moveend', callback);
            return;
        }

        setTimeout(() => {
            popup.remove();

            option.center = features[index % features.length].geometry.coordinates;
            flyTo(mapbox, option);
            index++;
        }, 2000);
    };

    mapbox.on('moveend', callback);
    mapbox.once('mousedown', function () { isEnd = true });

    function flyTo(mapbox, option) {
        console.log('roam to:' + option.center);
        mapbox.flyTo(option);

        popup.setLngLat(option.center)
            .setDOMContent(getWaterInfoElement())
            .addTo(mapbox);
    }
}

function getWaterInfoElement() {

    var div = document.createElement('div');
    var waterValue = document.createElement('h1');

    div.appendChild(waterValue);
    div.id = 'popup-content';
    div.className = 'popup-content';
    waterValue.className = 'popup-water-value';
    waterValue.id = 'popup-water-value';

    var value = 250;
    waterValue.innerText = value + 'mm';

    setInterval(() => {
        waterValue.innerHTML = (value++) + 'mm';
    }, 200);

    div.addEventListener('unload', function () {
        console.log('water info div unloaded');
    });

    $("popup-water-value").bind('DOMNodeRemoved', function (e) {
        console.log('water info div unloaded');
    });
    return div;
}