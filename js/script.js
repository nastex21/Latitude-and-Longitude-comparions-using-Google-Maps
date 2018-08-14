var map, infoWindow;
var latAdjust = document.getElementById("adjustLat").innerHTML; // get the latitude adjust value
var lngAdjust = document.getElementById("adjustLng").innerHTML; //get the longitude adjust value
var lngCoords = document.getElementById("lngInput").value;
var arr = []; //array to keep track of arr and delete
var arrTable = []; //used for table
var checkLat = []; //an array to check the latitude adjust values
var checkLng = []; //an array to check the longitude adjust values
var link = "https://res.cloudinary.com/nasax2000/raw/upload/v1533707950/city-data_o7peii.json"; //json database of metro cities with more than 1,000,000 inhabitants
var request = new XMLHttpRequest();
var database;
request.open('GET', link);
request.responseType = 'json';
request.send();
request.onload = function () {
    database = request.response;
}

function getLoc() {
    if (arr.length > 0) {
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

    if (arr.length > 0) {
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
    var latitude = latAdjust + Number(latCoords); //add the latAdjust value plus the latitude value
    console.log(latitude);
    arrTable = [];// gotta clear arrTable otherwise the table repopulates previous uncleared values
    deleteMarkers();

    for (var i = 0; i < database.length; i++) {
        if (latitude >= Math.floor(database[i].lat) && latitude <= Math.ceil(database[i].lat)) {
            var pos = {
                lat: JSON.parse(Number(database[i].lat).toFixed(3)),
                lng: JSON.parse(Number(database[i].lng).toFixed(3)),
                content: database[i].city + ", " + database[i].country
            };
            addMarker(pos);
            arrTable.push(pos);
        }
    }
    if (document.getElementById("clearBtn") !== null) {
        removeButton();
    }
    createTable();
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
    arrTable = [];// gotta clear arrTable otherwise the table repopulates previous uncleared values
    deleteMarkers();

    for (var i = 0; i < database.length; i++) {
        if (longitude >= Math.floor(database[i].lng) && longitude <= Math.ceil(database[i].lng)) {
            var pos = {
                lat: JSON.parse(Number(database[i].lat).toFixed(3)),
                lng: JSON.parse(Number(database[i].lng).toFixed(3)),
                content: database[i].city + ", " + database[i].country
            };
            addMarker(pos);
            arrTable.push(pos);
        }
    }
    if (document.getElementById("clearBtn") !== null) {
        removeButton();
    }
    createTable();
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

    for (var i = 0; i < arrTable.length; i++) {
        console.log(arrTable);
        let table = document.getElementById("dynamicTable");

        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');

        var text1 = document.createTextNode(arrTable[i].content);
        var text2 = document.createTextNode(arrTable[i].lat);
        var text3 = document.createTextNode(arrTable[i].lng);

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
    arrTable = []; //used for table
    checkLat = []; //an array to check the latitude adjust values
    checkLng = []; //an array to check the longitude adjust values
    deleteMarkers();
}

function removeButton() {
    let button = document.getElementById("clearBtn");
    button.remove();
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
    arr.push(marker);
}

// Sets the map on all arr in the array.
function setMapOnAll(map) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].setMap(map);
    }
}

// Removes the arr from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any arr currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all arr in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    arr = [];
}