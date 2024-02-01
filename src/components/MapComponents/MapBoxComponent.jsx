import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
// import { environment } from '../../../Environments/EnvDev';
// import '../../../App.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZG8xYS04MTEiLCJhIjoiY2xyYXp5NXd1MGdxMjJpbXdnZmtvcWVzbSJ9.BgX2_RdiJZ5SESKin6RSvw';
mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true
);
const MapBoxComponent = () => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);

  const [lng] = useState(-97.7431);
  const [lat] = useState(30.2672);
  const [zoom] = useState(2);

  // Initialize map when component mounts
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom,
    });

    // Add our navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Initialize the geolocate control.
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    // Add the control to the map.
    map.current.addControl(geolocate);
    // Map onload event
    map.current.on('load', () => {
      // Nifty code to force map to fit inside container when it loads
      map.current.resize();
      geolocate.trigger();
    });
    const popup = new mapboxgl.Popup().setText('Pharmacy').addTo(map.current);
    const marker1 = new mapboxgl.Marker()
      .setLngLat([35.88532536800162, 32.01232757863414])
      .addTo(map.current)
      .setPopup(popup);
    // Clean up on unmount
    return () => map.current.remove();
  }, [lat, lng, zoom]);

  return (
    <div
      className="map-container"
      ref={mapContainerRef}
      style={{
        height: '100vh',
      }}
    />
  );
};

export default MapBoxComponent;
