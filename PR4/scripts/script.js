const findButton = document.querySelector('input[value="Find"]');
let map;
let marker;
let infowindow;
let markers = [];
let time = new Date();
let hours = timeFormat(time.getHours());
let minutes = timeFormat(time.getMinutes());
let seconds = timeFormat(time.getSeconds());
var clearWatchButton = document.getElementById("clearWatch");
let watchId = null;
const ourCoords = {
  latitude: 48.94314364908576,
  longitude: 24.73367598672833,
};
document.addEventListener("DOMContentLoaded", getMyLocation);
window.onload = function () {
  initMap();
};

clearWatchButton.addEventListener("click", clearWatch);

function clearWatch() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  marker = null;
  infowindow = null;
  deleteMarkers();
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function deleteMarkers() {
  setMapOnAll(null);
}

function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocation, displayError);
  } else {
    alert("Oops, no geolocation support");
  }
  clearWatchButton.addEventListener("click", clearWatch);
}

function displayLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let div = document.getElementById("location");
  div.innerHTML = `You are at Latitude: ${latitude}, Longitude: ${longitude}`;
  div.innerHTML += ` (with ${position.coords.accuracy} meters accuracy)`;
  let km = computeDistance(position.coords, ourCoords);
  let distance = document.getElementById("distance");
  distance.innerHTML = `You are ${km} km from the College`;
  var watchButton = document.getElementById("watch");
  watchButton.addEventListener("click", function () {
    watchId = navigator.geolocation.watchPosition(
      displayLocation,
      displayError
    );
    setMarker(latitude, longitude);
    zoomToMarker(latitude, longitude);
  });
  findButton.addEventListener("click", function () {
    let findByLat = document.getElementById("findByLat");
    let findByLong = document.getElementById("findByLong");
    if (findByLat.value && findByLong.value) {
      const lat = parseFloat(findByLat.value);
      const lng = parseFloat(findByLong.value);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarker(lat, lng);
        zoomToMarker(lat, lng);
      }
    }
  });
}

function setMarker(latitude, longitude) {
  const myLatLng = { lat: latitude, lng: longitude };

  const marker = new google.maps.Marker({
    position: myLatLng,
    map,
  });

  const infowindow = new google.maps.InfoWindow({
    content: `Your location and coordinates: ${latitude}, ${longitude}, ${hours}:${minutes}:${seconds}`,
  });

  marker.addListener("mouseover", function () {
    infowindow.open(map, marker);
  });

  marker.addListener("mouseout", function () {
    infowindow.close();
  });

  markers.push(marker);

  marker.addListener("click", function () {
    map.setZoom(16);
    map.setCenter(marker.getPosition());
    map.panTo(marker.position);
  });
}

function zoomToMarker(latitude, longitude) {
  const myLatLng = new google.maps.LatLng(latitude, longitude);
  const currentZoom = map.getZoom();
  const targetZoom = 16;
  const zoomIncrement = (targetZoom - currentZoom) / 60;
  let step = 0;

  const animateZoom = () => {
    if (step < 60) {
      const newZoom = currentZoom + step * zoomIncrement;
      map.setZoom(newZoom);
      map.panTo(myLatLng);
      step++;
      setTimeout(animateZoom, 25);
    }
  };

  animateZoom();
}

function displayError(error) {
  const errorTypes = {
    0: "Unknown error",
    1: "Permission denied by user",
    2: "Position is not available",
    3: "Request timed out",
  };
  const errorMessage = errorTypes[error.code];
  if (error.code == 0 || error.code == 2) {
    errorMessage = errorMessage + " " + error.message;
  }
  let div = document.getElementById("location");
  div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoords) {
  let startLatRads = degreesToRadians(startCoords.latitude);
  let startLongRads = degreesToRadians(startCoords.longitude);
  let destLatRads = degreesToRadians(destCoords.latitude);
  let destLongRads = degreesToRadians(destCoords.longitude);
  let Radius = 6371;

  let distance =
    Math.acos(
      Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) *
          Math.cos(destLatRads) *
          Math.cos(startLongRads - destLongRads)
    ) * Radius;
  return distance;
}

function degreesToRadians(degrees) {
  let radians = (degrees * Math.PI) / 180;
  return radians;
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 48.94314364908576, lng: 24.73367598672833 },
    zoom: 8,
  });
}

function timeFormat(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return number;
  }
}
