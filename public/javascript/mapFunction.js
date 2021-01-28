let markers = []
function initMap() {
  let infoWindow = new google.maps.InfoWindow()
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.047817, lng: 121.516959 },
    zoom: 8
  })

  addMarkers(map)

  // click listener configures by PlaceId.
  map.addListener('click', (mapsMouseEvent) => {
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng
    })
    if (mapsMouseEvent.placeId) {
      let request = { placeId: mapsMouseEvent.placeId, fields: ['name', 'geometry'] }
      let service = new google.maps.places.PlacesService(map)
      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          infoWindow.close()
          infoWindow.setContent(
            `<div></div><span id="place-name" class="title" style="text-align: center; display:block;">${place.name}</span><br/>
           <a class="btn btn-primary" href="/blogs/createBlog/${place.geometry.location}/${place.name}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${place.geometry.location}/${place.name}">Create Tracker</a></div>`
          )
          infoWindow.open(map)
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
  const infowindowContent = document.getElementById('infowindow-content')
  infoWindow.setContent(infowindowContent)
  autocomplete.addListener('place_changed', () => {
    infoWindow.close()
    const place = autocomplete.getPlace()
    if (!place.geometry) {
      return
    }
    const placeMarker = new google.maps.Marker({ map: map })
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport)
    } else {
      map.setCenter(place.geometry.location)
      map.setZoom(17)
    }
    // Set the position of the marker using the place ID and location.
    placeMarker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    })

    placeMarker.addListener('click', (mapsMouseEvent) => {
      infoWindow.close(map)
      infoWindow = new google.maps.InfoWindow({
        position: place.geometry.location
      })
      infoWindow.setContent(
        `<span id="place-name" class="title">${place.name}</span><br/><br/>
        <a class="btn btn-primary" href="/blogs/createBlog/${mapsMouseEvent.latLng}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${mapsMouseEvent.latLng}">Create Tracker</a>`
      )
      infoWindow.open(map)
    })
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
          infoWindow.setPosition(pos)
          infoWindow.setContent(
            `<a class="btn btn-primary" href="/blogs/createBlog/(${pos.lat}, ${pos.lng})">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/(${pos.lat}, ${pos.lng})">Create Tracker</a>`
          )
          infoWindow.open(map)
          map.setCenter(pos)
          map.setZoom(17)
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

function addMarkers(map) {
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
          // Close the other InfoWindow.
          infoWindow.close()
          // Create a new InfoWindow.
          infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng
          })
          infoWindow.setContent(
            `<span id="place-name" class="title" style="text-align: center; display:block;">${l.Blogs[0].location}</span><br/>
          <a class="btn btn-primary" href="/blogs/createBlog/${mapsMouseEvent.latLng}/${l.Blogs[0].location}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${mapsMouseEvent.latLng}/${l.Blogs[0].location}">Create Tracker</a>`
          )
          infoWindow.open(map)
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
