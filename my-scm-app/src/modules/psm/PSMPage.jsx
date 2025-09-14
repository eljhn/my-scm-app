// src/modules/psm/PSMPage.jsx
import { useEffect, useState } from "react";
import { getSuppliers, deleteSupplier, updateSupplier } from "./psmService";
import SupplierForm from "./SupplierForm";

export default function PSMPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState(null);

  // Modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const data = await getSuppliers();
    if (data) setSuppliers(data);
    setLoading(false);
  };

  const showNotice = (msg, type = "success") => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    await deleteSupplier(confirmDeleteId);
    setConfirmDeleteId(null);
    fetchSuppliers();
    showNotice("Supplier deleted successfully!", "success");
  };

  const handleEdit = (supplier) => setEditingSupplier(supplier);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateSupplier(editingSupplier.id, {
      name: editingSupplier.name,
      email: editingSupplier.email,
      phone: editingSupplier.phone,
    });
    setEditingSupplier(null);
    fetchSuppliers();
    showNotice("Supplier updated successfully!", "success");
  };

  // Filter suppliers by search term
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-16">
      {/* 🔔 Notice Banner */}
      {notice && (
        <div
          className={`p-3 mb-4 rounded-lg text-white shadow-md ${
            notice.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notice.msg}
        </div>
      )}

      {/* Controls Row (Button left, Search right) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        {/* Add Supplier button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition w-full sm:w-auto"
        >
          {showForm ? "Close Form" : "Add Supplier"}
        </button>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full sm:w-64"
        />
      </div>

      {showForm && (
        <SupplierForm
          onSuccess={() => {
            fetchSuppliers();
            showNotice("Supplier added successfully!", "success");
            setShowForm(false);
          }}
        />
      )}

      {/* Supplier Table */}
      <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold text-red-600 mb-3">Suppliers</h2>
        {filteredSuppliers.length === 0 ? (
          <p className="text-gray-500">No suppliers found.</p>
        ) : (
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border w-32"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s, i) => (
                <tr
                  key={s.id}
                  className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-2 border">{s.name}</td>
                  <td className="p-2 border">{s.email}</td>
                  <td className="p-2 border">{s.phone}</td>
                  <td className="p-2 border text-red-700 space-x-4">
                    <span
                      onClick={() => handleEdit(s)}
                      className="cursor-pointer hover:underline"
                    >
                      Edit
                    </span>
                    <span
                      onClick={() => setConfirmDeleteId(s.id)}
                      className="cursor-pointer hover:underline"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Edit Supplier Form */}
        {editingSupplier && (
          <form
            onSubmit={handleUpdate}
            className="mt-4 bg-gray-50 p-4 rounded-2xl shadow"
          >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Edit Supplier
            </h2>

            <input
              type="text"
              value={editingSupplier.name}
              onChange={(e) =>
                setEditingSupplier({ ...editingSupplier, name: e.target.value })
              }
              className="w-full border p-2 mb-2 rounded-lg"
              required
            />

            <input
              type="email"
              value={editingSupplier.email}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  email: e.target.value,
                })
              }
              className="w-full border p-2 mb-2 rounded-lg"
              required
            />

            <input
              type="text"
              value={editingSupplier.phone}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  phone: e.target.value,
                })
              }
              className="w-full border p-2 mb-3 rounded-lg"
              required
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingSupplier(null)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this supplier?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
