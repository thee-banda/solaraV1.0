"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import debounce from "lodash.debounce";

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  lat: number;
  lon: number;
  onPositionChange: (lat: number, lon: number, address: string) => void;
}

function LocationMarker({ lat, lon, onPositionChange }: MapComponentProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);

  const fetchAddress = debounce(async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=th`);
      const data = await res.json();
      const addr = data.display_name;
      onPositionChange(lat, lon, addr);
    } catch (e) {
      onPositionChange(lat, lon, `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    }
  }, 1000);

  useMapEvents({
    click(e) {
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker 
      position={[lat, lon]} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          marker.getLatLng();
          fetchAddress(marker.getLatLng().lat, marker.getLatLng().lng);
        }
      }}
    />
  );
}

export default function SolaraMap({ lat, lon, onPositionChange }: MapComponentProps) {
  return (
    <div className="rounded-[32px] overflow-hidden border border-white/10 h-[300px] w-full shadow-2xl relative mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <MapContainer 
        center={[lat, lon]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker lat={lat} lon={lon} onPositionChange={onPositionChange} />
      </MapContainer>
    </div>
  );
}
