import { buildApiUrl, getAuthHeaders } from "./config";

export async function updateTimeline(orderId) {
  const url = new URL(buildApiUrl("orders/${orderId}/timeline"));
  try {
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Auth si besoin : "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du statut.");
    }

    const data = await response.json();
    console.log("Timeline mise à jour :", data);

    // 🔄 Tu peux ici re-fetch ou mettre à jour manuellement l’état
    window.location.reload(); // rapide pour recharger les nouvelles infos
  } catch (error) {
    console.error("Erreur :", error.message);
    alert("Impossible de mettre à jour la commande.");
  }
}
