var markers = [];
var map, infoWindow;
var latCoords = document.getElementById("latInput").value; //get values from input box
var lngCoords = document.getElementById("lngInput").value;

function getLoc() {
    if (markers.length > 0) {
        deleteMarkers();
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            addMarker(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function submitData() {
    latCoords = Number(latCoords).toFixed(3)
    lngCoords = Number(lngCoords).toFixed(3);

    if (markers.length > 0) {
        deleteMarkers();
    }

    if (Math.abs(latCoords) > 90) {
        window.alert("Latitude needs to be between 90 and -90");
        return;
    }
    if (Math.abs(lngCoords) > 180) {
        window.alert("Longitude needs to be between 180 and -180");
        return;
    }
    pos = {
        lat: Number(latCoords),
        lng: Number(lngCoords)
    }

    map.setCenter(pos);
    addMarker(pos);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 2
    });
    infoWindow = new google.maps.InfoWindow;
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}