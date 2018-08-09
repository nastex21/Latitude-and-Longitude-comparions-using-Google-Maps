var link = "https://res.cloudinary.com/nasax2000/raw/upload/v1533707950/city-data_o7peii.json";
var request = new XMLHttpRequest();
var database;
request.open('GET', link);
request.responseType = 'json';
request.send();
request.onload = function () {
    database = request.response;
}

var x = document.getElementById("clientLat");
var y = document.getElementById("clientLong");
var latCoords = 25.761;
var lngCoords = -80.191;
var pos, addMarker, arr, map;
var markers = [];
var latAdjust = document.getElementById("adjustLat").innerHTML;
var lngAdjust = document.getElementById("adjustLng").innerHTML;

function getLoc() {
    deleteMarkers();
    document.getElementById("adjustLat").innerHTML = 0;
    document.getElementById("adjustLng").innerHTML = 0;
    latAdjust = 0;
    lngAdjust = 0;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser."
    }
}

function adjustLatLng(value) {
    latAdjust = Number(latAdjust);
    lngAdjust = Number(lngAdjust);
    if (value == "posLat") {
        if (latAdjust >= -10 && latAdjust < 10) {
            latAdjust++;
            document.getElementById("adjustLat").innerHTML = latAdjust;
        }
    }
    if (value == "negLat") {
        if (latAdjust > -10 && latAdjust <= 10) {
            latAdjust--;
            document.getElementById("adjustLat").innerHTML = latAdjust;
        }
    }
    if (value == "posLng") {
        if (lngAdjust >= -10 && lngAdjust < 10) {
            lngAdjust++;
            document.getElementById("adjustLng").innerHTML = lngAdjust;
        }
    }
    if (value == "negLng") {
        if (lngAdjust > -10 && lngAdjust <= 10) {
            lngAdjust--;
            document.getElementById("adjustLng").innerHTML = lngAdjust;
        }
    }

}

function getLats() {
    deleteMarkers();
    latAdjust = Number(latAdjust);
    var latitude = latAdjust + latCoords;
    latitude = latitude.toFixed(3)

    for (var i = 0; i < database.length; i++) {
        if (latitude >= Math.floor(database[i].lat) && latitude <= Math.ceil(database[i].lat)) {
            var pos = {
                coords: {
                    lat: JSON.parse(database[i].lat),
                    lng: JSON.parse(database[i].lng)
                },
                content: database[i].city + ", " + database[i].country
            };
            addMarker(pos);
        }
    }
}

function getLngs() {
    deleteMarkers();
    lngAdjust = Number(lngAdjust);
    var longitude = lngAdjust + lngCoords;
    longitude = longitude.toFixed(3)

    for (var i = 0; i < database.length; i++) {
        num = JSON.parse(database[i].lng);
        num = Number(num);
        if (longitude <= Math.ceil(num) && longitude >= Math.floor(num)) {
            var pos = {
                coords: {
                    lat: JSON.parse(database[i].lat),
                    lng: JSON.parse(database[i].lng)
                },
                content: database[i].city + ", " + database[i].country
            };
            addMarker(pos);
        }
    }

}

function showPosition(position) {
    coordsLat = position.coords.latitude;
    latCoords = Number(coordsLat.toFixed(3));
    coordsLng = position.coords.longitude;
    lngCoords = Number(coordsLng.toFixed(3));
    pos = {
        coords: {
            lat: latCoords,
            lng: lngCoords
        }
    };
    setPosition(pos);
    addMarker(pos);
}

function initMap() {
    //map options
    var options = {
        zoom: 2,
        center: {
            lat: 25.761,
            lng: -80.191
        }
    }

    //New map
    var map = new google.maps.Map(document.getElementById('map'), options);

    var infoWindow = new google.maps.InfoWindow;

    setPosition = function (props) {
        map.setCenter(props.pos);
        x.innerHTML = props.coords.lat;
        y.innerHTML = props.coords.lng;
    }

    //Add Marker Function
    addMarker = function (props) {
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map
        });
        markers.push(marker);

        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            })
        }
    }

    // Sets the map on all markers in the array.
    setMapOnAll = function (map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    deleteMarkers = function () {
        setMapOnAll(null);
        markers = [];
    }

}