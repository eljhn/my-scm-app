// src/modules/sws/swsService.js
import { supabase } from "../../services/supabaseClient.js";

//
// -------------------- WAREHOUSES --------------------
//

// Fetch all warehouses
export async function getWarehouses() {
  const { data, error } = await supabase
    .from("warehouses")
    .select("id, name, location")
    .order("name", { ascending: true });

  if (error) {
    console.error("❌ Error fetching warehouses:", error.message);
    return [];
  }
  return data;
}

// Add new warehouse
export async function addWarehouse(warehouse) {
  const { data, error } = await supabase
    .from("warehouses")
    .insert([warehouse]) // expects { name, location }
    .select("id, name, location");

  if (error) {
    console.error("❌ Error adding warehouse:", error.message);
    return null;
  }
  return data?.[0] || null;
}

// Update warehouse
export async function updateWarehouse(id, updates) {
  const { data, error } = await supabase
    .from("warehouses")
    .update(updates)
    .eq("id", id)
    .select("id, name, location");

  if (error) {
    console.error("❌ Error updating warehouse:", error.message);
    return null;
  }
  return data?.[0] || null;
}

// Delete warehouse
export async function deleteWarehouse(id) {
  const { error } = await supabase.from("warehouses").delete().eq("id", id);
  if (error) {
    console.error("❌ Error deleting warehouse:", error.message);
    return false;
  }
  return true;
}

//
// -------------------- PRODUCTS --------------------
//

// Fetch all products WITH warehouse info
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      stock,
      warehouse_id,
      created_at,
      warehouses:warehouse_id (
        id,
        name,
        location
      )
    `)
    .order("created_at", { ascending: false }); // newest first

  if (error) {
    console.error("❌ Error fetching products:", error.message);
    return [];
  }
  return data;
}

// Add new product
export async function addProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert([product]) // expects { name, stock, warehouse_id }
    .select(`
      id,
      name,
      stock,
      warehouse_id,
      created_at,
      warehouses:warehouse_id (
        id,
        name,
        location
      )
    `);

  if (error) {
    console.error("❌ Error adding product:", error.message);
    return null;
  }
  return data?.[0] || null;
}

// Update product
export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select(`
      id,
      name,
      stock,
      warehouse_id,
      created_at,
      warehouses:warehouse_id (
        id,
        name,
        location
      )
    `);

  if (error) {
    console.error("❌ Error updating product:", error.message);
    return null;
  }
  return data?.[0] || null;
}

// Delete product
export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("❌ Error deleting product:", error.message);
    return false;
  }
  return true;
}
