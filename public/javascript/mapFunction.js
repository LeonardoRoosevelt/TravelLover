let markers = []
function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.047817, lng: 121.516959 },
    zoom: 13
  })
  let infoWindow = new google.maps.InfoWindow()
  setMarkers(map)

  // click listener configures by PlaceId.
  map.addListener('click', (mapsMouseEvent) => {
    // Create a new InfoWindow.
    if (mapsMouseEvent.placeId) {
      mapsMouseEvent.stop()
      let request = { placeId: mapsMouseEvent.placeId, fields: ['name', 'geometry'] }
      let service = new google.maps.places.PlacesService(map)
      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let infoContent = `<div></div><span id="place-name" class="title" style="text-align: center; display:block;">${place.name}</span><br/>
           <a class="btn btn-primary" href="/blogs/createBlog/${place.geometry.location}/${place.name}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${place.geometry.location}/${place.name}">Create Tracker</a></div>`
          DeleteMarker(1)
          marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            id: 1,
            icon: { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }
          })
          markers.push(marker)
          infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng
          })
          infoWindow.close()
          infoWindow.setContent(infoContent)
          infoWindow.open(map, marker)
          marker.addListener('click', () => {
            infoWindow.close()
            infoWindow.setContent(infoContent)
            infoWindow.open(map, marker)
          })
          map.setCenter(place.geometry.location)
        }
      })
    }
  })

  // PlaceId Finder
  const input = document.getElementById('pac-input')
  const autocomplete = new google.maps.places.Autocomplete(input)
  autocomplete.bindTo('bounds', map)
  // Specify just the place data fields that you need.
  autocomplete.setFields(['place_id', 'geometry', 'name'])
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    let infoContent = `<span id="place-name" class="title" style="text-align: center; display:block;">${place.name}</span><br/>
        <a class="btn btn-primary" href="/blogs/createBlog/${place.geometry.location}/${place.name}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${place.geometry.location}/${place.name}">Create Tracker</a>`
    if (!place.geometry) {
      return
    }
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport)
    } else {
      map.setCenter(place.geometry.location)
      map.setZoom(13)
    }
    DeleteMarker(1)
    marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      id: 1,
      icon: { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }
    })
    markers.push(marker)
    infoWindow = new google.maps.InfoWindow({
      position: place.geometry.location
    })
    infoWindow.close()
    infoWindow.setContent(infoContent)
    infoWindow.open(map, marker)
    marker.addListener('click', () => {
      infoWindow.close()
      infoWindow.setContent(infoContent)
      infoWindow.open(map, marker)
    })
    map.setCenter(place.geometry.location)
  })

  // geolocation
  const locationButton = document.getElementById('geoBtn')
  locationButton.textContent = 'Get Current Location'
  locationButton.classList.add('custom-map-control-button')
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton)
  locationButton.addEventListener('click', () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          DeleteMarker(1)
          let infoContent = `<span id="place-name" class="title" style="text-align: center; display:block;">本地定位</span><br/>
            <a class="btn btn-primary" href="/blogs/createBlog/(${pos.lat}, ${pos.lng})">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/(${pos.lat}, ${pos.lng})">Create Tracker</a>`
          marker = new google.maps.Marker({
            position: pos,
            map: map,
            id: 1,
            icon: { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }
          })
          markers.push(marker)
          infoWindow = new google.maps.InfoWindow({
            position: pos
          })
          infoWindow.close()
          infoWindow.setContent(infoContent)
          infoWindow.open(map, marker)
          marker.addListener('click', () => {
            infoWindow.close()
            infoWindow.setContent(infoContent)
            infoWindow.open(map, marker)
          })
          map.setCenter(pos)
          map.setZoom(13)
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter())
        }
      )
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter())
    }
  })
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos)
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  )
  infoWindow.open(map)
}

function setMarkers(map) {
  let infoWindow = new google.maps.InfoWindow()
  axios
    .get('/map/json')
    .then((response) => {
      const locations = response.data
      locations.forEach((l) => {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(l.lat, l.lng),
          map: map
        })
        marker.addListener('click', (mapsMouseEvent) => {
          infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng
          })
          infoWindow.close()
          infoWindow.setContent(
            `<span id="place-name" class="title" style="text-align: center; display:block;">${l.Blogs[0].location}</span><br/>
          <a class="btn btn-primary" href="/blogs/createBlog/${mapsMouseEvent.latLng}/${l.Blogs[0].location}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${mapsMouseEvent.latLng}/${l.Blogs[0].location}">Create Tracker</a>`
          )
          infoWindow.open(map)
          map.setCenter(mapsMouseEvent.latLng)
          map.setZoom(13)
        })
        markers.push(marker)
      })
    })
    .then(() => {
      // Add a marker clusterer to manage the markers.
      new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      })
    })
    .catch(function (error) {
      console.log(error)
    })
}

function DeleteMarker(id) {
  //Find and remove the marker from the Array
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].id == id) {
      //Remove the marker from Map
      markers[i].setMap(null)
      //Remove the marker from array.
      markers.splice(i, 1)
      return
    }
  }
}

function fixInfoWindow() {
  //Here we redefine set() method.
  //If it is called for map option, we hide InfoWindow, if "noSupress" option isnt true.
  //As Google doesn't know about this option, its InfoWindows will not be opened.
  var set = google.maps.InfoWindow.prototype.set
  google.maps.InfoWindow.prototype.set = function (key, val) {
    if (key === 'map') {
      if (!this.get('noSupress')) {
        console.log('This InfoWindow is supressed. To enable it, set "noSupress" option to true')
        return
      }
    }
    set.apply(this, arguments)
  }
}
