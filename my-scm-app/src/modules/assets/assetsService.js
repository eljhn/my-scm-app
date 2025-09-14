// src/modules/assets/assetsService.js
import { supabase } from "../../services/supabaseClient.js";

// ✅ Fetch all assets
export async function getAssets() {
  const { data, error } = await supabase.from("Assets").select("*").order("id");
  if (error) {
    console.error("❌ Error fetching assets:", error.message);
    return [];
  }
  return data || [];
}

// ✅ Add new asset
export async function addAsset(asset) {
  const { error } = await supabase.from("Assets").insert([asset]);
  if (error) {
    console.error("❌ Error adding asset:", error.message);
    return false;
  }
  return true;
}

// ✅ Update asset status
export async function updateAssetStatus(id, status) {
  const { error } = await supabase
    .from("Assets")
    .update({ status })
    .eq("id", id);
  if (error) {
    console.error("❌ Error updating asset:", error.message);
    return false;
  }
  return true;
}

// ✅ Delete asset
export async function deleteAsset(id) {
  const { error } = await supabase.from("Assets").delete().eq("id", id);
  if (error) {
    console.error("❌ Error deleting asset:", error.message);
    return false;
  }
  return true;
}
