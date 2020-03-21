'use strict';

let App = window.App || {};

App.map = function () {
    let geocoder = new L.Control.Geocoder.nominatim();
    let radiussize = 8;
    let colorMap = {};
    let pal = ["yellow", "green", "red"];
    let statusTypes = ["Limited Hours", "Regular Hours", "Temporarily Closed"].forEach((element, i) => {
        colorMap[element] = pal[i];
    });
    console.log(colorMap);

    function init() {
        let mymap = L.map('mapid').setView([39.983334, -82.983330], 10);
        console.log(mymap);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(mymap);
        //Get data from AirTable
        let locationData = getLocationData();
        console.log(locationData);
        //Loop this to add markers
        locationData.forEach(location => {
            console.log(location);
            let query = buildQuery(location);
            geocoder.geocode(query, (results) => {
                let r = results[0];
                console.log(r);
                location.position = r.center;
                addCircle(mymap, location);
            });
        });
    }

    function addCircle(mymap, info) {
        let circle = L.circleMarker(info.position, {
            fill: true,
            color: colorMap[info.data.status],
            fillColor: colorMap[info.data.status],
            fillOpacity: 0.66,
            stroke: true,
            weight: 1
        }).addTo(mymap);
        circle.bindPopup("Name:" + info.data.name + "<br>"+
        "Address:" + info.data.street + "<br>" +
        "Status:" + info.data.status + "<br>" +
        "Phone #:<a href=\"tel:" + "(614) 555-5555" + "\">" + "(614) 555-5555" + "</a>" + "<br>");
    }

    function addMarker(mymap, info) {
        let marker = L.marker(info.position).addTo(mymap);
        marker.bindPopup("<b>" + info.data.name + "</b><br>" + info.data.street);
    }

    function buildQuery(locationData) {
        return locationData.data.street + ", " 
            + locationData.data.city + ", " 
            + locationData.data.state + " "
            + locationData.data.zip;
    }
    function getLocationData() {
        return [
            {
                "position":[39.983334, -82.983330],
                "data": {
                    "name":"Barroluco Argentine Comfort Food",
                    "street":"47 N Pearl St",
                    "city":"Columbus",
                    "state":"OH",
                    "zip":"43215",
                    "status":"Regular Hours"
                }
            },
            {
                "position":[39.983334, -82.983330],
                "data": {
                    "name":"Jeni's Splendid Ice Creams - North Market",
                    "street":"59 Spruce St.",
                    "city":"Columbus",
                    "state":"OH",
                    "zip":"43215",
                    "status":"Limited Hours"
                }
            },
            {
                "position":[39.983334, -82.983330],
                "data": {
                    "name":"Harvest Pizza - Dublin",
                    "street":"45 N. High St.",
                    "city":"Dublin",
                    "state":"OH",
                    "zip":"43017",
                    "status":"Temporarily Closed"
                }
            }

        ];
    }
    init();
}();
