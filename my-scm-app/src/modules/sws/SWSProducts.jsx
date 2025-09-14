// src/modules/sws/SWSPage.jsx
import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  getWarehouses,
} from "./swsService";
import SWSForm from "./SWSForm";

export default function SWSPage() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchProducts(), fetchWarehouses()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    if (data) setProducts(data);
  };

  const fetchWarehouses = async () => {
    const data = await getWarehouses();
    if (data) setWarehouses(data);
  };

  const showNotice = (msg, type = "success") => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async (id) => {
    const ok = await deleteProduct(id);
    if (ok) {
      fetchProducts();
      showNotice("Product deleted successfully!", "success");
    } else {
      showNotice("Failed to delete product", "error");
    }
  };

  const handleEdit = (product) => setEditingProduct(product);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updated = await updateProduct(editingProduct.id, {
      name: editingProduct.name,
      stock: editingProduct.stock,
      warehouse_id: editingProduct.warehouse_id,
    });
    if (updated) {
      setEditingProduct(null);
      fetchProducts();
      showNotice("Product updated successfully!", "success");
    } else {
      showNotice("Failed to update product", "error");
    }
  };

  const filteredProducts = products.filter((p) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(keyword) ||
      p.warehouses?.name?.toLowerCase().includes(keyword) ||
      p.warehouses?.location?.toLowerCase().includes(keyword);

    const matchesLowStock = !lowStockOnly || p.stock < 10;
    const matchesWarehouse =
      selectedWarehouse === "all" || p.warehouse_id === selectedWarehouse;

    return matchesSearch && matchesLowStock && matchesWarehouse;
  });

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-16"> {/* ✅ Leaves space for navbar */}
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

      {/* Controls */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Search row */}
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search product or warehouse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-full sm:max-w-xs"
          />
        </div>

        {/* Filters row with Add Product aligned left */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          {/* Left side: Add Product button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition w-full sm:w-auto"
          >
            {showForm ? "Close Form" : "Add Product"}
          </button>

          {/* Right side: Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={() => setLowStockOnly(!lowStockOnly)}
                className="w-4 h-4"
              />
              Show low stock
            </label>

            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="border p-2 rounded-lg w-full sm:w-auto"
            >
              <option value="all">All Warehouses</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} – {wh.location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <SWSForm onSuccess={fetchProducts} warehouses={warehouses} />
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold text-red-700 mb-3">Inventory</h2>
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Warehouse</th>
                <th className="p-2 border w-32"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, i) => (
                <tr
                  key={p.id}
                  className={`${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } ${p.stock < 10 ? "bg-red-50" : ""}`}
                >
                  <td className="p-2 border">{p.name}</td>
                  <td
                    className={`p-2 border ${
                      p.stock < 10 ? "text-red-600 font-bold" : ""
                    }`}
                  >
                    {p.stock}
                  </td>
                  <td className="p-2 border">
                    {p.warehouses?.name
                      ? `${p.warehouses.name} – ${p.warehouses.location}`
                      : "❌ No warehouse"}
                  </td>
                  <td className="p-2 border text-red-700 space-x-4">
                    <span
                      onClick={() => handleEdit(p)}
                      className="cursor-pointer hover:underline"
                    >
                      Edit
                    </span>
                    <span
                      onClick={() => handleDelete(p.id)}
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

        {/* Edit Form */}
        {editingProduct && (
          <form
            onSubmit={handleUpdate}
            className="mt-4 bg-gray-50 p-4 rounded-2xl shadow"
          >
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Edit Product
            </h2>

            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              className="w-full border p-2 mb-2 rounded-lg"
              required
            />

            <input
              type="number"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: parseInt(e.target.value) || 0,
                })
              }
              className="w-full border p-2 mb-2 rounded-lg"
              required
            />

            <select
              value={editingProduct.warehouse_id || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  warehouse_id: e.target.value,
                })
              }
              className="w-full border p-2 mb-3 rounded-lg"
              required
            >
              <option value="" disabled>
                Select Warehouse
              </option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} – {wh.location}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
