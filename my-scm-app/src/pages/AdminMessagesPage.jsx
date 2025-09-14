import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Banner/Toast state
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error.message || error);
      setMessages([]);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      console.error("Error deleting message:", error.message || error);
      showToast("Failed to delete message", "error");
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      showToast("Message deleted", "success");
    }
  };

  return (
    <div className="p-6 pt-20 relative">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Inbox</h1>

      {loading ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <>
          {/* ✅ Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Message</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border text-center"></th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => {
                  const name = m.name || m.full_name || "—";
                  const content = m.content || m.message || "—";
                  return (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{name}</td>
                      <td className="p-3 border">{m.email || "—"}</td>
                      <td className="p-3 border max-w-[320px]">
                        <div className="truncate" style={{ maxWidth: "320px" }}>
                          {content}
                        </div>
                      </td>
                      <td className="p-3 border">
                        {m.created_at
                          ? new Date(m.created_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="p-3 border text-center flex gap-3 justify-center">
                        <button
                          onClick={() =>
                            setSelectedMessage({ ...m, name, content })
                          }
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {messages.map((m) => {
              const name = m.name || m.full_name || "—";
              const content = m.content || m.message || "—";
              return (
                <div
                  key={m.id}
                  className="bg-white p-4 rounded-xl shadow-md border"
                >
                  <h3 className="text-red-700 font-semibold">{name}</h3>
                  <p className="text-gray-600 text-sm">{m.email || "—"}</p>
                  <p className="mt-2 text-gray-800 line-clamp-3">{content}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {m.created_at
                      ? new Date(m.created_at).toLocaleString()
                      : "—"}
                  </p>

                  <div className="flex justify-end gap-4 mt-3">
                    <button
                      onClick={() =>
                        setSelectedMessage({ ...m, name, content })
                      }
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal for viewing message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-3">
              Message from {selectedMessage.name}
            </h2>
            <p className="text-gray-600 mb-1">
              <strong>Email:</strong> {selectedMessage.email}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Date:</strong>{" "}
              {selectedMessage.created_at
                ? new Date(selectedMessage.created_at).toLocaleString()
                : "—"}
            </p>

            <div className="whitespace-pre-wrap border rounded-lg p-4 mb-5 bg-gray-50">
              {selectedMessage.content}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
          className={`fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white transition ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
