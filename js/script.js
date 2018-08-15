//fix address location errors FIXED
//fix what happens if you live in the middle of nowhere and the address doesn't show properly or gives an error FIXED?
//need to fix what happens if no comparable latitude or longitude comparable coordinates are found FIXED

var map, infoWindow, geocoder;
var latAdjust = document.getElementById("adjustLat").innerHTML; // get the latitude adjust value
var lngAdjust = document.getElementById("adjustLng").innerHTML; //get the longitude adjust value
var latCoords; //values of the box input lat values 
var lngCoords; //values of the box input lng values
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
        submitGetLocClearData();
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(pos);
            latCoords = pos.lat;
            lngCoords = pos.lng;
            geocodeLatLng(geocoder, map, infoWindow);
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
    if (arr.length > 0) {
        submitGetLocClearData();
    }
    latCoords = document.getElementById("latInput").value; //values of the box input lat values
    lngCoords = document.getElementById("lngInput").value; //values of the box input lng values
    latCoords = Number(latCoords).toFixed(3);
    lngCoords = Number(lngCoords).toFixed(3);

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
    geocodeLatLng(geocoder, map, infoWindow);
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
    var latitude = latAdjust + Number(latCoords); //add the latAdjust value plus the latitude value
    arrTable = [];// gotta clear arrTable otherwise the table repopulates previous uncleared values
    deleteMarkers();
    var counter = 0; //keep track of how many times conditions were met. If 0, return error

    for (var i = 0; i < database.length; i++) {
        if (latitude >= Math.floor(database[i].lat) && latitude <= Math.ceil(database[i].lat)) {
            var pos = {
                lat: JSON.parse(Number(database[i].lat).toFixed(3)),
                lng: JSON.parse(Number(database[i].lng).toFixed(3)),
                content: database[i].city + ", " + database[i].country
            };
            counter++;
            addMarker(pos);
            arrTable.push(pos);
        }
    }

    if (counter == 0) { // if you no comparable values were found in the databases
        window.alert("Sorry, no comparable latitude values were found in the database.")
    } else {
        if (document.getElementById("clearBtn") !== null) {
            removeButton();
        }
        createTable();
    }

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
    var longitude = lngAdjust + Number(lngCoords); //add the lngAdjust value plus the longitude value
    arrTable = [];// gotta clear arrTable otherwise the table repopulates previous uncleared values
    deleteMarkers();
    var counter = 0; //keep track of how many times conditions were met. If 0, return error

    for (var i = 0; i < database.length; i++) {
        if (longitude >= Math.floor(database[i].lng) && longitude <= Math.ceil(database[i].lng)) {
            var pos = {
                lat: JSON.parse(Number(database[i].lat).toFixed(3)),
                lng: JSON.parse(Number(database[i].lng).toFixed(3)),
                content: database[i].city + ", " + database[i].country
            };
            counter++;
            addMarker(pos);
            arrTable.push(pos);
        }
    }
    if (counter == 0) { // if you no comparable values were found in the databases
        window.alert("Sorry, no comparable longitude values were found in the database.")
    } else {
        if (document.getElementById("clearBtn") !== null) {
            removeButton();
        }
        createTable();
    }
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
    geocoder = new google.maps.Geocoder;

}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    arr.push(marker);

    if (location.content) {
        var infoWindow = new google.maps.InfoWindow({
            content: location.content
        });

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        })
    }
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
    arr = []; //array to keep track of arr and delete
    arrTable = []; //used for table
    checkLat = []; //an array to check the latitude adjust values
    checkLng = []; //an array to check the longitude adjust values
}

function submitGetLocClearData() { //only used to clear innerHTML when submit and get Location functions are used
    clearMarkers();
    arr = []; //array to keep track of arr and delete
    arrTable = []; //used for table
    checkLat = []; //an array to check the latitude adjust values
    checkLng = []; //an array to check the longitude adjust values
    document.getElementById("adjustLat").innerHTML = 0;
    document.getElementById("adjustLng").innerHTML = 0;
}

function geocodeLatLng(geocoder, map, infowindow) { //reverse lookup
    var latlng = {
        lat: Number(latCoords),
        lng: Number(lngCoords)
    }
    var text = "";
    geocoder.geocode({
        'location': latlng
    }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                map.setZoom(1);
                if (results[0].address_components) {
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        for (var j = 0; j < results[0].address_components[i].types.length; j++) {
                            if (results[0].address_components[i].types[j] == "locality") {
                                text += results[0].address_components[i].long_name + ", ";
                            }

                            if (!results[0].address_components[i].types[j] == "locality" && results[0].address_components[i].types[j] == "administrative_area_level_2") {
                                text += results[0].address_components[i].long_name + ", ";
                            }

                            if (results[0].address_components[i].types[j] == "administrative_area_level_1") {
                                text += results[0].address_components[i].long_name + " ";
                            }

                            if (results[0].address_components[i].types[j] == "country") {
                                text += results[0].address_components[i].long_name;
                            }

                            var pos = {
                                lat: Number(latCoords),
                                lng: Number(lngCoords),
                                content: text
                            };
                            addMarker(pos);
                            arrTable.push(pos);
                        }
                    }
                }
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    })
}