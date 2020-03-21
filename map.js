'use strict';

let App = window.App || {};

App.map = function () {
    let geocoder = new L.Control.Geocoder.nominatim();

    function init() {
        let mymap = L.map('mapid').setView([39.983334, -82.983330], 11);
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
                addMarker(mymap, location);
            });
        });
    }

    function addMarker(mymap, info) {
        let marker = L.marker(info.position).addTo(mymap);
        marker.bindPopup("<b>" + info.data.name + "</b><br>" + info.data.address);
    }

    function buildQuery(locationData) {
        return locationData.data.address + ", " 
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
                    "address":"47 N Pearl St",
                    "city":"Columbus",
                    "state":"OH",
                    "zip":"43215"
                }
            },
            {
                "position":[39.983334, -82.983330],
                "data": {
                    "name":"Jeni's Splendid Ice Creams - North Market",
                    "address":"59 Spruce St.",
                    "city":"Columbus",
                    "state":"OH",
                    "zip":"43215"
                }
            }
        ];
    }
    init();
}();
