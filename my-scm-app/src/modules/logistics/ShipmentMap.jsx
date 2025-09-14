// src/modules/logistics/ShipmentMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Marker colors
const statusColors = {
  Pending: "gray",
  "In Transit": "blue",
  Delivered: "green",
};

// Generate marker icons based on status
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=truck|${color}`,
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [0, -50],
  });

export default function ShipmentMap({ shipments }) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow relative z-0">
      <MapContainer
        center={[14.5995, 120.9842]} // Default: Manila
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {shipments
          .filter((s) => s.latitude && s.longitude)
          .map((s) => (
            <Marker
              key={s.id}
              position={[s.latitude, s.longitude]}
              icon={createIcon(statusColors[s.status] || "gray")}
            >
              <Popup>
                <strong>{s.description}</strong> <br />
                Vehicle: {s.vehicle} <br />
                Status: {s.status}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
