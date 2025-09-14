// src/modules/sws/SWSForm.jsx
import { useState } from "react";
import { addProduct } from "./swsService";

export default function SWSForm({ onSuccess, warehouses }) {
  const [formData, setFormData] = useState({
    name: "",
    stock: 0,
    warehouse_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showNotice = (msg, type = "success") => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    try {
      const newProduct = await addProduct(formData);
      if (newProduct) {
        showNotice("Product added successfully!", "success");
        setFormData({ name: "", stock: 0, warehouse_id: "" });
        if (onSuccess) onSuccess();
      } else {
        showNotice("Failed to add product. Please try again.", "error");
      }
    } catch (err) {
      showNotice("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <h2 className="text-lg font-semibold text-red-700 mb-4">
          Add Product
        </h2>

        {/* 🔔 Notice Banner */}
        {notice && (
          <div
            className={`p-3 mb-4 rounded-lg text-white shadow-md text-sm sm:text-base ${
              notice.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {notice.msg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none text-sm sm:text-base"
              required
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              placeholder="Enter stock quantity"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none text-sm sm:text-base"
              required
            />
          </div>

          {/* Warehouse Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Warehouse
            </label>
            <select
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none text-sm sm:text-base"
              required
            >
              <option value="" disabled>
                Choose a warehouse
              </option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} – {wh.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-1 rounded-lg text-white font-medium transition text-sm sm:text-base ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
