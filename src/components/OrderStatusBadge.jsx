import React from "react";

// 1️⃣ Define translations (add more languages easily)
const STATUS_TRANSLATIONS = {
  en: {
    pending: "Pending",
    validated: "Validated",
    in_progress: "In Progress",
    completed: "Completed",
    picked_up: "Picked Up",
    delivered: "Delivered",
    cancelled: "Cancelled",
    no_status: "No Status",
    unknown: "Unknown",
  },
  fr: {
    pending: "En attente",
    validated: "Validé",
    in_progress: "En cours",
    completed: "Terminée",
    picked_up: "Récupérée",
    delivered: "Livrée",
    cancelled: "Annulée",
    no_status: "Sans statut",
    unknown: "Inconnu",
  },
};

// 2️⃣ Define color codes (same for all languages)
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  validated: "bg-blue-100 text-blue-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  picked_up: "bg-green-100 text-green-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_status: "bg-gray-100 text-gray-800",
  unknown: "bg-gray-100 text-gray-800",
};

// 3️⃣ Map French/English labels to internal keys (for flexibility)
const STATUS_MAP = {
  "en attente": "pending",
  "validé": "validated",
  "en cours": "in_progress",
  "terminée": "completed",
  "récupérée": "picked_up",
  "livrée": "delivered",
  "annulée": "cancelled",
  "sans statut": "no_status",
  "inconnu": "unknown",

  pending: "pending",
  validated: "validated",
  in_progress: "in_progress",
  completed: "completed",
  picked_up: "picked_up",
  delivered: "delivered",
  cancelled: "cancelled",
  no_status: "no_status",
  unknown: "unknown",
};

export default function OrderStatusBadge({ status, lang = "fr" }) {
  // Normalize input
  const normalized = STATUS_MAP[status?.toLowerCase()] || "unknown";

  // Get translated label
  const label = STATUS_TRANSLATIONS[lang]?.[normalized] || STATUS_TRANSLATIONS["en"].unknown;

  // Get color
  const color = STATUS_COLORS[normalized];

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
