// direction api , places api
import React, { useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';


export default function GoogleMaps() {
  const [latitude, setLatitude] = useState(15.368714176544463)
  const [longitude, setLongitude] = useState(120.48947826077699)
  const [map, setMap] = React.useState(null)

  const containerStyle = {
    width: '100vw',
    height: '100vh', 
  };

  const center = {
    lat:  latitude,
    lng: longitude
  };

  const OPTIONS = {
    minZoom: 4,
    maxZoom: 20,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAPr7kjzq4UnACyCmvgQ-0m4QVYCs7OIMo",
  })

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const onClick = (ev) => {
    // ev.preventDefault()
    setLatitude(ev.latLng.lat())
    setLongitude(ev.latLng.lng())
    // console.log("longitude = ", ev.latLng.lng());
    // console.log("latitide = ", ev.latLng.lat());
    localStorage.setItem('latitude', ev.latLng.lat())
    localStorage.setItem('longitude', ev.latLng.lng())
  }


  return isLoaded ? (
  
     <GoogleMap
      onClick={onClick}
      mapContainerStyle={containerStyle}
      center={center}
      options = {OPTIONS}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      
      <Marker position={center}/>
      { /* Child components, such as markers, info windows, etc. */ }
   
      <>
      
      {/* <button type="button" className="btn btn-primary btn-lg float-end gmbutton">
    Large button
    </button> */}
      </>
    </GoogleMap>
  
) : <></>
} 