// import { buildApiUrl, getAuthHeaders } from "./config";

// export async function updateTimeline(orderId) {
//   const url = new URL(buildApiUrl("orders/${orderId}/timeline"));
//   try {
//     const response = await fetch(
//       url,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Auth si besoin : "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({}),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Erreur lors de la mise à jour du statut.");
//     }

//     const data = await response.json();
//     console.log("Timeline mise à jour :", data);

//     // 🔄 Tu peux ici re-fetch ou mettre à jour manuellement l’état
//     window.location.reload(); // rapide pour recharger les nouvelles infos
//   } catch (error) {
//     console.error("Erreur :", error.message);
//     alert("Impossible de mettre à jour la commande.");
//   }
// }

// updateTimeline.js
import { buildApiUrl, getAuthHeaders } from "./config";

/**
 * Get next allowed status based on current order status.
 */
export const NEXT_STATUS_MAPPING = {
  order_placed: "design_approved",
  design_approved: "in_progress",
  in_progress: "completed",
  completed: "picked_up",
  picked_up: null,
  cancelled: null,
};

/**
 * Update order timeline status via API
 * @param {number} orderId
 * @param {string} status - Must be one of: order_placed, design_approved, in_progress, completed, picked_up, cancelled
 * @param {string|null} description - Optional description (max 500 characters)
 * @returns {Promise<object>}
 */
export async function updateTimelineStatus(orderId, status, description = null) {
  const url = buildApiUrl(`admin/orders/${orderId}/timeline`);

  const body = {
    status,
    description: description && description.length > 500 
      ? description.substring(0, 500) 
      : description
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: `HTTP ${res.status}: ${res.statusText}` };
      }
      throw new Error(errorData.message || "Failed to update timeline");
    }

    const responseData = await res.json();
    
    // Validate response structure
    if (!responseData.success) {
      throw new Error(responseData.message || "API returned success: false");
    }

    return responseData;
  } catch (error) {
    console.error('Timeline update error:', error);
    throw error;
  }
}