import { supabase } from "../../services/supabaseClient.js";

const BUCKET = "documents"; // make sure you create this bucket in Supabase

// Upload document
export async function uploadDocument(file, metadata) {
  try {
    const filePath = `${Date.now()}_${file.name}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

    // Save metadata in "documents" table
    const { error: dbError } = await supabase.from("documents").insert([
      {
        title: metadata.title,
        owner: metadata.owner,
        url: data.publicUrl,
        created_at: new Date(),
      },
    ]);

    if (dbError) throw dbError;

    return true;
  } catch (err) {
    console.error("Error uploading document:", err.message);
    return false;
  }
}

// Get all documents
export async function getDocuments() {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error.message);
    return [];
  }
  return data;
}

// Delete document
export async function deleteDocument(id) {
  try {
    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    const filePath = doc.url.split("/").pop();
    await supabase.storage.from(BUCKET).remove([filePath]);

    // Delete from DB
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;
    return true;
  } catch (err) {
    console.error("Error deleting document:", err.message);
    return false;
  }
}
