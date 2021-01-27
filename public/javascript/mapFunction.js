function initMap() {
  let markers = []
  infoWindow = new google.maps.InfoWindow()
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.047817, lng: 121.516959 },
    zoom: 8,
  })

  locations.map((location) => {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat, location.lng),
      map: map,
    })
    marker.addListener('click', (mapsMouseEvent) => {
      // Close the other InfoWindow.
      infoWindow.close()
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      })
      infoWindow.setContent(
        `<a class="btn btn-primary" href="/blogs/createBlog/${mapsMouseEvent.latLng}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${mapsMouseEvent.latLng}">Create Tracker</a>`
      )
      infoWindow.open(map)
    })
    markers.push(marker)
  })
  // Configure the click listener.
  map.addListener('click', (mapsMouseEvent) => {
    // Close the other InfoWindow.
    infoWindow.close()
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    })
    infoWindow.setContent(
      `<a class="btn btn-primary" href="/blogs/createBlog/${mapsMouseEvent.latLng}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${mapsMouseEvent.latLng}">Create Tracker</a>`
    )
    infoWindow.open(map)
  })

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer(map, markers, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
  })

  //PlaceId Finder
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
      location: place.geometry.location,
    })

    placeMarker.addListener('click', (mapsMouseEvent) => {
      infoWindow.close(map)
      infoWindow = new google.maps.InfoWindow({
        position: place.geometry.location,
      })
      infoWindow.setContent(
        `<span id="place-name" class="title">${place.name}</span><br/><br/>
        <a class="btn btn-primary" href="/blogs/createBlog/${mapsMouseEvent.latLng}">Create Blog</a><a class="btn btn-success ml-3" href="/trackers/createRecord/${mapsMouseEvent.latLng}">Create Tracker</a>`
      )
      infoWindow.open(map)
    })
  })
}

const locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 },
]
