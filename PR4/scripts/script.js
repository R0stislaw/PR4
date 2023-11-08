
let marker;
let infowindow;

document.addEventListener("DOMContentLoaded", getMyLocation);
initMap();

let watchId = null;

function clearWatch() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  marker = null;
  infowindow = null;
}
function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocation, displayError);
    var clearWatchButton = document.getElementById("clearWatch");
    clearWatchButton.onclick = clearWatch;
    clearWatchButton.addEventListener("click", clearWatch);
  } else {
    alert("Oops, no geolocation support");
  }

}
const ourCoords = {
  latitude: 48.94314364908576,
  longitude: 24.73367598672833,
};
function displayLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let div = document.getElementById("location");
  div.innerHTML = `You are at Latitude: ${latitude}, Longtude: ${longitude}`; 
  div.innerHTML += ` (with ${position.coords.accuracy} meters accuracy)`; 
  let km = computeDistance(position.coords, ourCoords);
  let distance = document.getElementById("distance");
  distance.innerHTML = `You are ${km} km from the College`;
  var watchButton = document.getElementById("watch");
  watchButton.addEventListener("click",function(){
  watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
  
  setMarker(latitude,longitude);  
  })
  
}

function setMarker(latitude, longitude) {
  const myLatLng = { lat: latitude, lng: longitude };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: myLatLng,
  });
  
  const marker = new google.maps.Marker({
    position: myLatLng,
    map,
  });

  const infowindow = new google.maps.InfoWindow({
    content: `Ваше місцезнаходження та координати ${latitude}, ${longitude}`
  });

  marker.addListener("mouseover", function() {
    infowindow.open(map, marker);
  });
  marker.addListener("mouseout", function() {
    infowindow.close();
  });



  map.addListener("center_changed", function() {
  window.setTimeout(function() {
    map.panTo(marker.getPosition());
  }, 3000);
});

  marker.addListener("click", function() {
    map.setZoom(16);
    map.setCenter(marker.getPosition());
  });
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
let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 48.94314364908576, lng: 24.73367598672833 },
    zoom: 8,
  });
}