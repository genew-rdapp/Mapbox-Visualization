var mapApp = new Vue({
    created: function () {
        console.log("map app created");
        var mapbox = this.$data.mapbox;
        mapbox.addControl(new mapboxgl.NavigationControl(), 'top-left');

        //添加太仓区划图层（含区划线、区划面、区划名称三个图层）
        mapbox.on('load', function () {
            console.log("map loaded");
            addPolygon(mapbox);

            var rivers = mapApp.$data.rivers;

            rivers.forEach(function (river) {
                addLineLayer(mapbox, river.name, '../res/data/rivers.json', 'yellow', ['==', ['get', 'DISPCLASS'], river.value]);
            });
        })
    },
    data: {
        mapbox: new mapboxgl.Map(getMapStyle()),
        rivers: [
            {
                'name': '区域级河流',
                'show': false,
                'value': '1'
            }, {
                'name': '市级河流',
                'show': false,
                'value': '2'
            }, {
                'name': '县级河流',
                'show': false,
                'value': '3'
            }, {
                'name': '镇级河流',
                'show': false,
                'value': '4'
            }, {
                'name': '生产级河流',
                'show': false,
                'value': '8'
            },
        ]
    },
})