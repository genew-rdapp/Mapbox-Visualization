var app = new Vue({
    el: '#app',
    methods: {
        selectRiver: function (river) {
            console.log(`river ${river.name} has been click(${river.show}).`);

            var layerName = river.name;
            if (mapApp.$data.mapbox.getPaintProperty(layerName, 'line-color') == 'red') {
                mapApp.$data.mapbox.setPaintProperty(layerName, 'line-color', 'yellow');
                return;
            }
            mapApp.$data.mapbox.setPaintProperty(layerName, 'line-color', 'red');
        }
    },
    data: {
        rivers: mapApp.$data.rivers,
    }
})