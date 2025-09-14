import { supabase } from "../../services/supabaseClient";

// -------------------- SUPPLIERS --------------------
export async function getSuppliers() {
  const { data, error } = await supabase.from("suppliers").select("*");
  if (error) {
    console.error("❌ Error fetching suppliers:", error);
    throw error;
  }
  return data;
}

export async function addSupplier(supplier) {
  const { data, error } = await supabase
    .from("suppliers")
    .insert([supplier])
    .select();

  if (error) {
    console.error("❌ Error adding supplier:", error);
    throw error;
  }
  return data[0];
}

export async function updateSupplier(id, updates) {
  const { data, error } = await supabase
    .from("suppliers")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("❌ Error updating supplier:", error);
    throw error;
  }
  return data[0];
}

export async function deleteSupplier(id) {
  const { error } = await supabase.from("suppliers").delete().eq("id", id);
  if (error) {
    console.error("❌ Error deleting supplier:", error);
    throw error;
  }
  return true;
}

// -------------------- PURCHASE ORDERS --------------------
export async function addPurchaseOrder(order) {
  const { data, error } = await supabase
    .from("purchase_orders")
    .insert([order])
    .select();

  if (error) {
    console.error("❌ Error adding purchase order:", error);
    throw error;
  }
  return data[0];
}

export async function getPurchaseOrders() {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select(`
      id,
      item,
      quantity,
      status,
      supplier_id,
      suppliers (id, name)
    `);

  if (error) {
    console.error("❌ Error fetching purchase orders:", error);
    throw error;
  }
  return data;
}

export async function deletePurchaseOrder(id) {
  const { error } = await supabase.from("purchase_orders").delete().eq("id", id);
  if (error) {
    console.error("❌ Error deleting purchase order:", error);
    throw error;
  }
  return true;
}

export async function updatePurchaseOrderStatus(id, status) {
  const { data, error } = await supabase
    .from("purchase_orders")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    console.error("❌ Error updating purchase order status:", error);
    throw error;
  }
  return data[0];
}
