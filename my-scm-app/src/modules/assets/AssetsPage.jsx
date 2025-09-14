// src/modules/assets/AssetsPage.jsx
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  getAssets,
  addAsset,
  updateAssetStatus,
  deleteAsset,
} from "./assetsService";

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Active",
    next_maintenance: "",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const data = await getAssets();
    if (data) setAssets(data);
  };

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await addAsset(formData);
    if (ok) {
      showNotice("success", "Asset added successfully!");
      setFormData({
        name: "",
        type: "",
        status: "Active",
        next_maintenance: "",
      });
      fetchAssets();
    } else {
      showNotice("error", "Failed to add asset.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const ok = await updateAssetStatus(id, newStatus);
    if (ok) {
      showNotice("success", "Status updated!");
      fetchAssets();
    } else {
      showNotice("error", "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    const ok = await deleteAsset(id);
    if (ok) {
      showNotice("success", "Asset deleted.");
      fetchAssets();
    } else {
      showNotice("error", "Failed to delete asset.");
    }
  };

  // 🔴 Highlight maintenance dates
  const tileContent = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const assetDue = assets.filter(
      (a) => a.next_maintenance === formattedDate
    );
    return assetDue.length > 0 ? (
      <div className="text-xs text-red-600 font-bold">{assetDue.length} due</div>
    ) : null;
  };

  // ⛔ Disable past days
  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

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

      {/* Calendar Section (centered) */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 flex justify-center">
        <div>
          <h2 className="text-lg font-semibold text-red-700 mb-4 text-center">
            Maintenance Calendar
          </h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            tileDisabled={tileDisabled}
          />
        </div>
      </div>

      {/* Add Asset Form */}
      <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="text-lg font-semibold text-red-700 mb-4">
            Register Asset
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Asset Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
            <input
              type="text"
              name="type"
              placeholder="Asset Type (e.g., Truck, Machine)"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
            <input
              type="date"
              name="next_maintenance"
              value={formData.next_maintenance}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Save Asset
            </button>
          </div>
        </form>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold text-red-700 mb-4">
          Assets List
        </h2>
        {assets.length === 0 ? (
          <p className="text-gray-500">No assets registered.</p>
        ) : (
          <table className="w-full border-collapse text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border w-[22%]">Name</th>
                <th className="p-2 border w-[15%]">Type</th>
                <th className="p-2 border w-[13%]">Status</th>
                <th className="p-2 border w-[15%]">Next Maintenance</th>
                <th className="p-2 border w-[35%]"></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a, i) => (
                <tr
                  key={a.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="p-2 border">{a.name}</td>
                  <td className="p-2 border">{a.type}</td>
                  <td className="p-2 border">{a.status}</td>
                  <td className="p-2 border">
                    {a.next_maintenance || "Not scheduled"}
                  </td>
                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-2">
                      {["Active", "Under Maintenance", "Retired"].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(a.id, st)}
                          className={`px-3 py-1 rounded text-xs sm:text-sm ${
                            st === a.status
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                      <button
                        onClick={() => handleDelete(a.id)}
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
