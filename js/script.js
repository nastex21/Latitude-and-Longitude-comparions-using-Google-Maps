//Fix the input box functionality *FIXED*
//added a check. Latitude needs to be between 90 and -90 while longitude needs to be between -180 and 180. FIXED
//fixed the submit button FIXED
//need to add a content box; do a reverse lookup FIXED
//weird error when you click "Get my coordinates and then submit button"
//clear leftover markers after clicking "submit"
//Also make sure to clear arrays, etc
//address bug... especially when in the middle of nowhere. "formatted address"

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
var pos, addMarker, map;
var latAdjust = document.getElementById("adjustLat").innerHTML;
var lngAdjust = document.getElementById("adjustLng").innerHTML;
var arr = [];
var counter = 0;
var checkLat = [];
var checkLng = [];
var latCounter = 0;
var lngCounter = 0;
var markers = [];

function clearData(){
    arr = [];
    counter = 0;
    checkLat = [];
    checkLng = [];
    latCounter = 0;
    lngCounter = 0;
    markers = [];
}

function submitData() {
    clearData();
    deleteMarkers();
    var x = document.getElementById("latInput").value;
    x = Number(x).toFixed(3);
    var y = document.getElementById("lngInput").value;
    y = Number(y).toFixed(3);
    //addMarker to add marker
    console.log(x);
    if (Math.abs(x) > 90) {
        window.alert("Latitude needs to be between 90 and -90");
        return;
    }
    if (Math.abs(y) > 180) {
        window.alert("Longitude needs to be between 180 and -180");
        return;
    }
    pos = {
        coords: {
            lat: Number(x),
            lng: Number(y)
        },
        inputFlag: {
            flag: true
        }
    };
    console.log(pos);

    addMarker(pos);
}

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
        counter = 0;
        if (latAdjust >= -10 && latAdjust < 10) {
            latAdjust++;
            document.getElementById("adjustLat").innerHTML = latAdjust;
        }
    }
    if (value == "negLat") {
        counter = 0;
        if (latAdjust > -10 && latAdjust <= 10) {
            latAdjust--;
            document.getElementById("adjustLat").innerHTML = latAdjust;
        }
    }
    if (value == "posLng") {
        counter = 0;
        if (lngAdjust >= -10 && lngAdjust < 10) {
            lngAdjust++;
            document.getElementById("adjustLng").innerHTML = lngAdjust;
        }
    }
    if (value == "negLng") {
        counter = 0;
        if (lngAdjust > -10 && lngAdjust <= 10) {
            lngAdjust--;
            document.getElementById("adjustLng").innerHTML = lngAdjust;
        }
    }
}

function removeButton() {
    let button = document.getElementById("clearBtn");
    button.remove();
}

function createTable() {
    if (document.getElementById("dynamicTable") !== null) {
        var tr = document.createElement('tr');
        var th1 = document.createElement('th');
        var th2 = document.createElement('th');
        var th3 = document.createElement('th');
        var thtext1 = document.createTextNode('City');
        var thtext2 = document.createTextNode('Latitude');
        var thtext3 = document.createTextNode('Longitude');

        th1.appendChild(thtext1);
        th2.appendChild(thtext2);
        th3.appendChild(thtext3);

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);

        let table = document.getElementById("dynamicTable");

        table.appendChild(tr);
    } else {
        var container = document.getElementById("bodyContainer");
        var newDiv = document.createElement("div");
        newDiv.setAttribute("id", "table");


        var table = document.createElement('table');
        table.setAttribute("id", "dynamicTable");
        var tr = document.createElement('tr');

        var th1 = document.createElement('th');
        var th2 = document.createElement('th');
        var th3 = document.createElement('th');
        var thtext1 = document.createTextNode('City');
        var thtext2 = document.createTextNode('Latitude');
        var thtext3 = document.createTextNode('Longitude');

        th1.appendChild(thtext1);
        th2.appendChild(thtext2);
        th3.appendChild(thtext3);

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);

        table.appendChild(tr);
        newDiv.appendChild(table);

        container.appendChild(newDiv);
    }

    for (var i = 0; i < arr.length; i++) {
        let table = document.getElementById("dynamicTable");

        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');

        var text1 = document.createTextNode(arr[i].content);
        var text2 = document.createTextNode(arr[i].coords.lat);
        var text3 = document.createTextNode(arr[i].coords.lng);

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        table.appendChild(tr);
    }

    var btn = document.createElement("BUTTON");
    btn.setAttribute("id", "clearBtn");
    btn.setAttribute("onclick", "clearTable()");
    var t = document.createTextNode("Clear");
    btn.appendChild(t);
    document.getElementById("table").appendChild(btn);
}

function clearTable() {
    let table = document.getElementById("table");
    table.remove();
    checkLat = [];
    checkLng = [];
    deleteMarkers();
    counter = 0;
}

function getLats() {
    latCounter = 1;
    latAdjust = Number(latAdjust);
    var passTest = checkLat.indexOf(latAdjust); //-1 
    checkLat.push(latAdjust);
    var latitude = latAdjust + latCoords;
    latitude = latitude.toFixed(3);
    arr = [];

    if (passTest == -1) {
        if (counter == 0 || lngCounter == 1) {
            deleteMarkers();
            for (var i = 0; i < database.length; i++) {
                if (latitude >= Math.floor(database[i].lat) && latitude <= Math.ceil(database[i].lat)) {
                    counter = 1;
                    var pos = {
                        coords: {
                            lat: JSON.parse(Number(database[i].lat).toFixed(3)),
                            lng: JSON.parse(Number(database[i].lng).toFixed(3))
                        },
                        content: database[i].city + ", " + database[i].country
                    };
                    addMarker(pos);
                    arr.push(pos);
                }
            }
            if (document.getElementById("clearBtn") !== null) {
                removeButton();
            }
            createTable();
        }
    } else {
        window.alert(latAdjust + " latitude adjust values are already in table");
    }
}

function getLngs() {
    lngCounter = 1;
    lngAdjust = Number(lngAdjust);
    var passTest = checkLng.indexOf(lngAdjust); //-1 
    checkLng.push(lngAdjust);
    var longitude = lngAdjust + lngCoords;
    longitude = longitude.toFixed(3);
    arr = [];

    if (passTest == -1) {
        if (counter == 0 || latCounter == 1) {
            deleteMarkers();
            for (var i = 0; i < database.length; i++) {
                if (longitude >= Math.floor(database[i].lng) && longitude <= Math.ceil(database[i].lng)) {
                    counter = 1;
                    var pos = {
                        coords: {
                            lat: JSON.parse(Number(database[i].lat).toFixed(3)),
                            lng: JSON.parse(Number(database[i].lng).toFixed(3))
                        },
                        content: database[i].city + ", " + database[i].country
                    };
                    addMarker(pos);
                    arr.push(pos);
                }
            }
            if (document.getElementById("clearBtn") !== null) {
                removeButton();
            }
            createTable();
        }
    } else {
        window.alert(lngAdjust + " longitude adjust values are already in table");
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
        zoom: 1,
        center: {
            lat: 25.761,
            lng: -80.191
        }
    }

    //New map
    var map = new google.maps.Map(document.getElementById('map'), options);
    var geocoder = new google.maps.Geocoder;
    var infoWindow = new google.maps.InfoWindow;

    setPosition = function (props) {
        console.log(props);
        map.setCenter(props.coords);
        /* x.innerHTML = props.coords.lat;
        y.innerHTML = props.coords.lng; */
    }

    //Add Marker Function
    addMarker = function (props) {
        console.log(props)
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
        if (props.inputFlag) {
            geocodeLatLng(geocoder, map, infoWindow)
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

    geocodeLatLng = function (geocoder, map, infowindow) {
        /*  var input = document.getElementById('latlng').value;
         var latlngStr = input.split(',', 2);
         var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])}; */
        var infoWindow = new google.maps.InfoWindow;
        var x = document.getElementById("latInput").value;
        x = Number(x).toFixed(3);
        var y = document.getElementById("lngInput").value;
        y = Number(y).toFixed(3);

        var latlng = {
            lat: Number(x),
            lng: Number(y)
        }

        geocoder.geocode({
            'location': latlng
        }, function (results, status) {
            console.log(results);
            console.log(results[5].formatted_address);
            if (status === 'OK') {
                if (results[5]) {
                    map.setZoom(1);
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map
                    });
                    var pos = {
                        coords: {
                            lat: Number(x),
                            lng: Number(y)
                        },
                        content: results[5].formatted_address
                    }
                    addMarker(pos);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
}