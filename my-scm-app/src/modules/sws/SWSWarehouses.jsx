// src/modules/sws/SWSWarehouses.jsx
import { useEffect, useState } from "react";
import {
  getWarehouses,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "./swsService";

export default function SWSWarehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [notice, setNotice] = useState(null); // ✅ banner notice
  const [deletingId, setDeletingId] = useState(null); // ✅ track delete confirm

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    const data = await getWarehouses();
    setWarehouses(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingWarehouse) {
      const updated = await updateWarehouse(editingWarehouse.id, formData);
      if (updated) {
        setNotice({ type: "success", text: "✅ Warehouse updated successfully!" });
        setEditingWarehouse(null);
        setFormData({ name: "", location: "" });
        fetchWarehouses();
      }
    } else {
      const created = await addWarehouse(formData);
      if (created) {
        setNotice({ type: "success", text: "✅ Warehouse added successfully!" });
        setFormData({ name: "", location: "" });
        fetchWarehouses();
      }
    }
    // auto-hide notice
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = await deleteWarehouse(id);
    if (ok) {
      setNotice({ type: "success", text: "🗑️ Warehouse deleted successfully!" });
      fetchWarehouses();
    } else {
      setNotice({ type: "error", text: "❌ Failed to delete warehouse." });
    }
    setDeletingId(null);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏭 Warehouses</h1>

      {/* ✅ Banner Notice */}
      {notice && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            notice.type === "success"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-gray-50 p-4 rounded-lg shadow"
      >
        <h2 className="text-lg font-semibold mb-2">
          {editingWarehouse ? "Edit Warehouse" : "Add Warehouse"}
        </h2>
        <input
          type="text"
          placeholder="Warehouse Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full border p-2 mb-2 rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {editingWarehouse ? "✅ Update" : "➕ Add"}
        </button>
        {editingWarehouse && (
          <button
            type="button"
            onClick={() => {
              setEditingWarehouse(null);
              setFormData({ name: "", location: "" });
            }}
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
          >
            ❌ Cancel
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Warehouse List</h2>
        {warehouses.length === 0 ? (
          <p className="text-gray-500">No warehouses found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((wh) => (
                <tr key={wh.id}>
                  <td className="p-2 border">{wh.name}</td>
                  <td className="p-2 border">{wh.location}</td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => {
                        setEditingWarehouse(wh);
                        setFormData({ name: wh.name, location: wh.location });
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      ✏️ Edit
                    </button>

                    {deletingId === wh.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(wh.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(wh.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        🗑 Delete
                      </button>
                    )}
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
