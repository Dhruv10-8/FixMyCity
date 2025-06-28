"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customMarker = new L.Icon({
  iconUrl: "/marker_red.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

type Props = {
  lat: number | null;
  lon: number | null;
  setLat: (lat: number) => void;
  setLon: (lon: number) => void;
};

export default function IssueMap({ lat, lon, setLat, setLon }: Props) {
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
      },
    });

    return lat && lon ? (
      <Marker
        position={[lat, lon]}
        icon={customMarker}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setLat(position.lat);
            setLon(position.lng);
          },
        }}
      />
    ) : null;
  };

  return (
    <MapContainer
      center={[lat ?? 20.5937, lon ?? 78.9629]}
      zoom={5}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationPicker />
    </MapContainer>
  );
}
