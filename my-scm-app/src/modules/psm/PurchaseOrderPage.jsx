import { useEffect, useState } from "react";
import {
  getPurchaseOrders,
  deletePurchaseOrder,
  updatePurchaseOrderStatus,
} from "./psmService";
import PurchaseOrderForm from "./PurchaseOrderForm";

export default function PurchaseOrderPage() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getPurchaseOrders();
    if (data) setOrders(data);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    await deletePurchaseOrder(confirmDeleteId);
    setConfirmDeleteId(null);
    fetchOrders();
    showToast("Purchase order deleted", "success");
  };

  const handleApprove = async (id) => {
    await updatePurchaseOrderStatus(id, "Approved");
    fetchOrders();
    showToast("Purchase order approved", "success");
  };

  const handleReject = async (id) => {
    await updatePurchaseOrderStatus(id, "Rejected");
    fetchOrders();
    showToast("Purchase order rejected", "error");
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.suppliers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.quantity).includes(searchTerm) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-700">📦 Purchase Orders</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-5 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        {showForm ? "Close Form" : "Create Purchase Order"}
      </button>

      {showForm && (
        <PurchaseOrderForm
          onSuccess={() => {
            fetchOrders();
            showToast("Purchase order created", "success");
          }}
        />
      )}

      <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search purchase orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No purchase orders found.</p>
        ) : (
          <table className="w-full border-collapse text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border w-[20%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, i) => (
                <tr
                  key={o.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="p-2 border">{o.id.slice(0, 6)}</td>
                  <td className="p-2 border">{o.suppliers?.name || "N/A"}</td>
                  <td className="p-2 border">{o.item}</td>
                  <td className="p-2 border">{o.quantity}</td>
                  <td className="p-2 border">{o.status}</td>
                  <td className="p-2 border text-sm space-x-2">
                    {o.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(o.id)}
                          className="px-3 py-1 bg-green-800 text-white rounded text-xs sm:text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(o.id)}
                          className="px-3 py-1 bg-red-800 text-white rounded text-xs sm:text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setConfirmDeleteId(o.id)}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-red-700">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this purchase order?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white transition ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
