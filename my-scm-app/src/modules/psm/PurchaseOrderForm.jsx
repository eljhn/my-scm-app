import { useEffect, useState } from "react";
import { getSuppliers, addPurchaseOrder } from "./psmService";

export default function PurchaseOrderForm({ onSuccess }) {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    supplier_id: "",
    item: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      if (data) setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier_id || !formData.item || !formData.quantity) return;

    setLoading(true);

    try {
      const payload = {
        supplier_id: formData.supplier_id,
        item: formData.item,
        quantity: parseInt(formData.quantity, 10),
      };

      const inserted = await addPurchaseOrder(payload);

      if (inserted && onSuccess) {
        onSuccess(); // parent page handles toast
      }

      setFormData({ supplier_id: "", item: "", quantity: "" });
    } catch (err) {
      console.error("Add purchase order error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-lg font-semibold text-red-700 mb-4">
        Create Purchase Order
      </h2>

      <select
        name="supplier_id"
        value={formData.supplier_id}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        required
      >
        <option value="">Select Supplier</option>
        {suppliers.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="item"
        placeholder="Item"
        value={formData.item}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        required
      />

      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        required
        min="1"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-5 py-1 rounded-lg text-white font-medium transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading ? "Saving..." : "Save Order"}
      </button>
    </form>
  );
}
