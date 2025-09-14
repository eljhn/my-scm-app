// src/modules/logistics/LogisticsPage.jsx
import { useEffect, useState } from "react";
import {
  getShipments,
  addShipment,
  updateShipmentStatus,
  deleteShipment,
} from "./logisticsService";
import ShipmentMap from "./ShipmentMap";

export default function LogisticsPage() {
  const [shipments, setShipments] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    vehicle: "",
    latitude: "",
    longitude: "",
    status: "Pending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const fetchShipments = async () => {
    try {
      const data = await getShipments();
      if (data) setShipments(data);
    } catch (err) {
      showNotice("error", "Error fetching shipments: " + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const inserted = await addShipment(formData);
      if (inserted?.length) {
        setShipments((prev) => [...prev, ...inserted]);
        showNotice("success", "Shipment added successfully!");
      }
      setFormData({
        description: "",
        vehicle: "",
        latitude: "",
        longitude: "",
        status: "Pending",
      });
    } catch (err) {
      showNotice("error", "Error adding shipment: " + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateShipmentStatus(id, newStatus);
      if (updated?.length) {
        setShipments((prev) =>
          prev.map((s) => (s.id === id ? updated[0] : s))
        );
        showNotice("success", `Shipment marked as ${newStatus}`);
      }
    } catch (err) {
      showNotice("error", "Error updating status: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleted = await deleteShipment(id);
      if (deleted?.length) {
        setShipments((prev) => prev.filter((s) => s.id !== id));
        showNotice("success", "Shipment deleted successfully.");
      }
    } catch (err) {
      showNotice("error", "Error deleting shipment: " + err.message);
    }
  };

  // 🔎 Filter shipments
  const filteredShipments = shipments.filter((s) =>
    [s.description, s.vehicle, s.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto">

      {/* ✅ Notice Banner */}
      {notice && (
        <div
          className={`mb-4 p-3 rounded-lg text-white shadow-md ${
            notice.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Map Section */}
      <div className="mb-6 relative">
        <ShipmentMap shipments={shipments} />
      </div>

      {/* New Shipment Form */}
      <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="text-lg font-semibold text-red-700 mb-4">
            Add Shipment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="description"
              placeholder="Shipment Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
            <input
              type="text"
              name="vehicle"
              placeholder="Assigned Vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
            <input
              type="number"
              step="any"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
            <input
              type="number"
              step="any"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Save Shipment
            </button>
          </div>
        </form>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold text-red-700">
            All Shipments
          </h2>
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-lg w-full sm:max-w-xs"
          />
        </div>

        {filteredShipments.length === 0 ? (
          <p className="text-gray-500">No shipments found.</p>
        ) : (
          <table className="w-full border-collapse text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border w-1/4">Description</th>
                <th className="p-2 border w-1/6">Vehicle</th>
                <th className="p-2 border w-1/6">Coordinates</th>
                <th className="p-2 border w-1/8">Status</th>
                <th className="p-2 border w-1/3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((s, i) => (
                <tr
                  key={s.id}
                  className={`${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } ${s.status === "Pending" ? "bg-yellow-50" : ""}`}
                >
                  <td className="p-2 border">{s.description}</td>
                  <td className="p-2 border">{s.vehicle}</td>
                  <td className="p-2 border text-xs sm:text-sm">
                    {s.latitude}, {s.longitude}
                  </td>
                  <td className="p-2 border">{s.status}</td>
                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-2">
                      {["Pending", "In Transit", "Delivered"].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(s.id, st)}
                          className={`px-3 py-1 rounded text-xs sm:text-sm ${
                            st === s.status
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
