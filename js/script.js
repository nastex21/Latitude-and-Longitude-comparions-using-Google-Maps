var markers = []; //array to keep track of markers and delete
var map, infoWindow;
var latAdjust = document.getElementById("adjustLat").innerHTML; // get the latitude adjust value
var lngAdjust = document.getElementById("adjustLng").innerHTML; //get the longitude adjust value
var lngCoords = document.getElementById("lngInput").value;
var latCounter = 0; //counter used to keep track if lat function was used
var checkLat = []; //an array to check the latitude adjust values
var checkLng = []; //an array to check the longitude adjust values
var link = "https://res.cloudinary.com/nasax2000/raw/upload/v1533707950/city-data_o7peii.json"; //json database of metro cities with more than 1,000,000 inhabitants
var request = new XMLHttpRequest();
var database;
var arr = [];
request.open('GET', link);
request.responseType = 'json';
request.send();
request.onload = function () {
    database = request.response;
}

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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
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
    var latAdjust = document.getElementById("adjustLat").innerHTML; // get the latitude adjust value
    var latAdjust = Number(latAdjust);
    var passTest = checkLat.indexOf(latAdjust); //check checkLat array for latitude adjuster
    if (passTest !== -1) {
        window.alert(latAdjust + " latitude adjust values are already in table");
        return;
    }
    checkLat.push(latAdjust); //push the latitude adjust value to the array
    var latCoords = document.getElementById("latInput").value; //get values from input box
    var latCounter = 1; //latitude function was used if = 1. 
    var latitude = latAdjust + Number(latCoords); //add the latAdjust value plus the latitude value
    console.log(latitude);
    deleteMarkers();

    for (var i = 0; i < database.length; i++) {
        if (latitude >= Math.floor(database[i].lat) && latitude <= Math.ceil(database[i].lat)) {
            var pos = {
                lat: JSON.parse(Number(database[i].lat).toFixed(3)),
                lng: JSON.parse(Number(database[i].lng).toFixed(3)),
                content: database[i].city + ", " + database[i].country
            };
            addMarker(pos);
        }
    }
    if (document.getElementById("clearBtn") !== null) {
        removeButton();
    }
    //createTable();
}

function getLngs() {
    var lngAdjust = document.getElementById("adjustLng").innerHTML; // get the longitude adjust value
    var lngAdjust = Number(lngAdjust);
    var passTest = checkLng.indexOf(lngAdjust); //check checkLng array for longitude adjuster
    if (passTest !== -1) {
        window.alert(lngAdjust + " longitude adjust values are already in table");
        return;
    }
    checkLng.push(lngAdjust); //push the longitude adjust value to the array
    var lngCoords = document.getElementById("lngInput").value; //get values from input box
    var lngCounter = 1; //longitude function was used if = 1. 
    var longitude = lngAdjust + Number(lngCoords); //add the lngAdjust value plus the longitude value
    console.log(longitude);
    deleteMarkers();

    for (var i = 0; i < database.length; i++) {
        if (longitude >= Math.floor(database[i].lng) && longitude <= Math.ceil(database[i].lng)) {
            var pos = {
                lat: JSON.parse(Number(database[i].lat).toFixed(3)),
                lng: JSON.parse(Number(database[i].lng).toFixed(3)),
                content: database[i].city + ", " + database[i].country
            };
            addMarker(pos);
        }
    }
    if (document.getElementById("clearBtn") !== null) {
        removeButton();
    }
    //createTable();
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