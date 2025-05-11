"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const iconMap = {
  High: new L.Icon({
    iconUrl: "/marker_red.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  Medium: new L.Icon({
    iconUrl: "/marker_yellow.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  Low: new L.Icon({
    iconUrl: "/marker_green.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  Unknown: new L.Icon({
    iconUrl: "/marker_grey.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
};

type Issue = {
  _id: string;
  title: string;
  description: string;
  location: {
    coordinates: [number, number];
  };
  dangerLevel?: "High" | "Medium" | "Low" | "Unknown"; // <- Add this
};

type Props = {
  issues: Issue[];
};

export default function IssueMap({ issues }: Props) {
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India

  return (
    <MapContainer
      center={defaultCenter}
      zoom={5}
      scrollWheelZoom={true}
      className="h-[600px] w-full rounded-lg shadow-md"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {issues.map((issue) => {
        const [lon, lat] = issue.location.coordinates;
        const danger = issue.dangerLevel || "Unknown";

        return (
          <Marker
            key={issue._id}
            position={[lat, lon]}
            icon={iconMap[danger]}
          >
            <Popup>
              <h3 className="font-semibold">{issue.title}</h3>
              <p>{issue.description}</p>
              <p className="text-sm mt-1">
                <strong>Danger:</strong> {danger}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                📍 {lat.toFixed(4)}, {lon.toFixed(4)}
              </p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

