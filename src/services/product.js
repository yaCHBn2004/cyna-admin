// src/services/product.js
import { buildApiUrl, getAuthHeaders } from "./config";

export async function fetchProductDetails(id) {
  const url = buildApiUrl(`admin/services/${id}/pricing`);
  const headers = getAuthHeaders();

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    return null;
  }
}

export async function updateProductPricing(serviceId, pricing) {
  const url = buildApiUrl(`admin/services/${serviceId}/pricing`);
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
    "lang_code": "en", // adjust if dynamic
  };

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({ pricing }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to update pricing:", error);
    throw error;
  }
}


