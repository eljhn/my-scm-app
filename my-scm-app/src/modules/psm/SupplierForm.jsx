import { useState } from "react";
import { addSupplier } from "./psmService";

export default function SupplierForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [notice, setNotice] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addSupplier(formData);

    if (success) {
      setNotice({ message: "✅ Supplier added successfully!", type: "success" });
      setFormData({ name: "", email: "", phone: "" });
      if (onSuccess) onSuccess();
    } else {
      setNotice({ message: "❌ Failed to add supplier.", type: "error" });
    }

    setTimeout(() => setNotice({ message: "", type: "" }), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-xl font-semibold text-red-700 mb-4">
        Add Supplier
      </h2>

      {/* 🔔 Notice Banner */}
      {notice.message && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg text-white shadow-md ${
            notice.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Supplier Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          required
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-5 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow"
        >
          Save
        </button>
      </div>
    </form>
  );
}
