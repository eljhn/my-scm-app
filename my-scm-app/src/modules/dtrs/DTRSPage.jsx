import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient.js";
import { getDocuments, deleteDocument } from "./dtrsService";
import DocumentUploader from "./DocumentUploader";

export default function DTRSPage() {
  const [documents, setDocuments] = useState([]);
  const [role, setRole] = useState("staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchDocuments();
    fetchUserRole();
  }, []);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const fetchDocuments = async () => {
    const data = await getDocuments();
    setDocuments(data);
  };

  const fetchUserRole = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile) setRole(profile.role);
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteDocument(id);
    if (success) {
      fetchDocuments();
      showNotice("success", "Document deleted successfully.");
    } else {
      showNotice("error", "Failed to delete document.");
    }
    setConfirmDeleteId(null);
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-700">
      Document Tracking & Records
      </h1>

      {/* ✅ Notice Banner */}
      {notice && (
        <div
          className={`mb-4 p-3 rounded-lg text-white shadow-md ${
            notice.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Upload Form */}
      <DocumentUploader onUpload={fetchDocuments} showNotice={showNotice} />

      {/* Search Bar */}
      <div className="my-6">
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        />
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold text-red-700 mb-4">Documents</h2>
        {filteredDocuments.length === 0 ? (
          <p className="text-gray-500">No documents found.</p>
        ) : (
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border w-[35%]">Title</th>
                <th className="p-2 border w-[20%]">Owner</th>
                <th className="p-2 border w-[20%]">Date</th>
                <th className="p-2 border w-[15%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc, i) => (
                <tr
                  key={doc.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="p-2 border">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {doc.title}
                    </a>
                  </td>
                  <td className="p-2 border">{doc.owner}</td>
                  <td className="p-2 border">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center text-sm text-red-600 font-medium">
                    {role === "admin" ? (
                      confirmDeleteId === doc.id ? (
                        <div className="flex flex-col gap-1 items-center">
                          <span
                            className="cursor-pointer hover:underline text-green-600"
                            onClick={() => handleDelete(doc.id)}
                          >
                            Confirm
                          </span>
                          <span
                            className="cursor-pointer hover:underline text-gray-600"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </span>
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => setConfirmDeleteId(doc.id)}
                        >
                          Delete
                        </span>
                      )
                    ) : (
                      <span className="text-gray-400">View Only</span>
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
