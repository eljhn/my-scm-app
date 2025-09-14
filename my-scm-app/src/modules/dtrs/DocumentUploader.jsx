import { useState } from "react";
import { uploadDocument } from "./dtrsService";

export default function DocumentUploader({ onUpload, showNotice }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showNotice("error", "Please select a file");
      return;
    }

    setLoading(true);
    const success = await uploadDocument(file, { title, owner });
    setLoading(false);

    if (success) {
      showNotice("success", "Document uploaded successfully!");
      setFile(null);
      setTitle("");
      setOwner("");
      if (onUpload) onUpload();
    } else {
      showNotice("error", "Upload failed.");
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="bg-white p-6 rounded-2xl shadow-md mb-6"
    >
      <h2 className="text-lg font-semibold text-red-700 mb-4">
        Upload Document
      </h2>

      {/* Inputs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          required
        />

        {/* Owner */}
        <input
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          required
        />

        {/* File Upload - styled for mobile */}
        <div>
          <label
            htmlFor="file-upload"
            className="block w-full cursor-pointer border p-2 rounded-lg bg-gray-50 text-gray-700 text-center hover:bg-gray-100 transition"
          >
            {file ? file.name : "Choose File"}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-1 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
}
