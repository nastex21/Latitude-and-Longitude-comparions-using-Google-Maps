var link = "https://res.cloudinary.com/nasax2000/raw/upload/v1533707950/city-data_o7peii.json";
var request = new XMLHttpRequest();
request.open('GET', link);
request.responseType = 'json';
request.send();
request.onload = function () {
    var superHeroes = request.response;
    console.log(superHeroes);
}

var mykey = config.MY_KEY;
console.log(mykey);
var x = document.getElementById("clientLoc");
var latCoords, lngCoords, pos, addMarker, arr;

function getLoc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser."
    }
}

function getLats() {

}

function getLngs() {

}

function showPosition(position) {
    latCoords = position.coords.latitude;
    lngCoords = position.coords.longitude;
    pos = {
        lat: latCoords,
        lng: lngCoords
    };
    setPosition();
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

    setPosition = function () {
        map.setCenter(pos);
        x.innerHTML = "Latitude: " + latCoords +
            "<br>Longitude: " + lngCoords;
    }

    //Add Marker Function
    addMarker = function (pos) {
        console.log(pos)
        var marker = new google.maps.Marker({
            position: pos,
            map: map
        });


        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        })
    }
}