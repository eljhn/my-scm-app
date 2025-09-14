import { useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function GetInTouchPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("messages").insert([
      { name: fullName, email, content: message }, // ✅ match table columns
    ]);

    if (error) {
      console.error("❌ Error sending message:", error);
      showToast("❌ Something went wrong. Please try again.", "error");
    } else {
      showToast("✅ Message sent! We’ll get back to you soon.", "success");
      setFullName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
        <h1 className="text-red-600 text-2xl font-bold mb-4 text-center">Get in Touch</h1>
        <p className="mb-6 text-gray-600 text-center">
          Don’t have an account? Send us a message and our admin team will reach out.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="4"
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* ✅ Toast Notification */}
      {toast.message && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg text-white transition ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
