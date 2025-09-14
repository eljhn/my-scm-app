import { supabase } from "../../services/supabaseClient.js";

// Fetch all shipments
export async function getShipments() {
  const { data, error } = await supabase.from("Shipments").select("*");
  if (error) {
    console.error("Error fetching shipments:", error.message);
    return [];
  }
  return data;
}

// Add new shipment
export async function addShipment(shipment) {
  const { data, error } = await supabase
    .from("Shipments")
    .insert([shipment])
    .select(); // ✅ return inserted row

  if (error) throw error;
  return data;
}

// Update shipment status
export async function updateShipmentStatus(id, status) {
  const { data, error } = await supabase
    .from("Shipments")
    .update({ status })
    .eq("id", id)
    .select(); // ✅ return updated row

  if (error) throw error;
  return data;
}

// Update shipment location
export async function updateShipmentLocation(id, lat, lng) {
  const { data, error } = await supabase
    .from("Shipments")
    .update({ latitude: lat, longitude: lng })
    .eq("id", id)
    .select(); // ✅ return updated row

  if (error) throw error;
  return data;
}

// Delete shipment
export async function deleteShipment(id) {
  const { data, error } = await supabase
    .from("Shipments")
    .delete()
    .eq("id", id)
    .select(); // ✅ return deleted row (so UI can remove it)

  if (error) throw error;
  return data;
}
