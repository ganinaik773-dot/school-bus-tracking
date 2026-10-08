import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon issue in Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const customIcon = new L.Icon({ iconUrl, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

// Map auto-center component
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 15); }, [lat, lng, map]);
  return null;
};

export default function BusMap({ lat, lng, busNumber }) {
  if (!lat || !lng) return <div>Loading Map...</div>;

  return (
    <div className="card map-container" style={{ padding: 0 }}>
      <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>🚌 {busNumber}</Popup>
        </Marker>
        <RecenterMap lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}