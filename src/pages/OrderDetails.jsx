import { useParams, Link } from "react-router-dom";
import {
  Mail,
  Phone,
  User,
  Building,
  Download,
  X,
  FileText,
} from "lucide-react";
import { useOrders } from "../context/OrdersContext";
import OrderTimeline from "../components/OrderTimeline";
import JSZip from "jszip";

import { useState } from "react";
import OrderStatusBadge from "../components/OrderStatusBadge";

const STATUS_MAPPING = {
  order_placed: "En attente",
  design_approved: "Validé",
  in_progress: "En cours",
  completed: "Terminée",
  picked_up: "Récupérée",
  cancelled: "Annulée",
};

export default function OrderDetails() {
  const { id } = useParams();
  const { orders, loading, error, updateOrder } = useOrders();
  const order = orders.find((o) => String(o.id) === id);

  if (loading) return <div className="p-4">Chargement…</div>;
  if (error) return <div className="p-4 text-red-500">{error.message}</div>;
  if (!order) return <div className="p-4">Commande non trouvée.</div>;

  const statusLabel = STATUS_MAPPING[order.status] || "Statut inconnu";

  const handleTimelineUpdate = (updatedOrder) => {
    if (updateOrder) updateOrder(updatedOrder);
    console.log("Order updated:", updatedOrder);
  };

  const handleDownloadFile = async (file) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
      alert("Erreur lors du téléchargement du fichier");
    }
  };

  return (
    <div className="p-4 w-full h-fit flex flex-col gap-10  mb-10 mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-textMain">
        <Link to="/admin/dashboard" className="hover:underline text-primary">
          Commandes
        </Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-textMain">
          Commande #{order.id}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex w-20 md:w-auto md:items-end flex-col md:flex-row gap-3">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">
            Commande #{order.id}
          </h1>
          <OrderStatusBadge status={order.status} lang="en" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">
            Passée le{" "}
            {order.date ||
              new Date(order.created_at).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold mb-3">Informations client</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 text-sm">
          <InfoLine
            icon={<User size={16} />}
            label={order.user?.name || "Non disponible"}
          />
          <InfoLine
            icon={<Mail size={16} />}
            label={order.user?.email || "Non disponible"}
          />
          <InfoLine
            icon={<Phone size={16} />}
            label={order.phone || "Non disponible"}
          />
          <InfoLine
            icon={<Building size={16} />}
            label={order.company || "Non disponible"}
          />
        </div>
        {/* {order.user?.email && (
          <a
            href={`mailto:${order.user?.email}?subject=Commande #${order.id}`}
            className="mt-4 px-3 py-1 text-sm text-white rounded-full bg-special hover:bg-special/90 transition-colors"
          >
            Contacter le client
          </a>
        )} */}
      </div>

      {/* Spécifications de la commande */}
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold">Spécifications de la commande</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 text-sm">
          <SpecLine
            label="Produit"
            value={order.service?.name || order.product_name}
          />
          <SpecLine
            label="Quantité"
            value={order.quantity || "Non disponible"}
          />
          <SpecLine
            label="Total"
            value={
              order.total ? `${order.total.toFixed(2)} €` : "Non disponible"
            }
          />
          {order.parameters &&
            Object.entries(order.parameters)
              .filter(
                ([_, value]) =>
                  value !== null && value !== undefined && value !== ""
              )
              .map(([key, value]) => (
                <SpecLine
                  key={key}
                  label={
                    order.parameter_mapping?.[key] || key.replace(/_/g, " ")
                  }
                  value={String(value)}
                />
              ))}
        </div>
      </div>

      {/* Files Section */}
      <div>
        {order.files && order.files.length > 0 && (
          <div className="flex flex-col items-start gap-4 p-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-semibold">
                Fichiers design
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({order.files.length} fichier
                  {order.files.length > 1 ? "s" : ""})
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-4">
              {order.files.map((file) => (
                <FilePreviewCard
                  key={file.id}
                  file={file}
                  onDownload={() => handleDownloadFile(file)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Timeline */}
      <OrderTimeline order={order} onUpdate={handleTimelineUpdate} />

      {/* Informations de paiement */}
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold">Informations de paiement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 text-sm">
          <SpecLine
            label="Méthode de paiement"
            value={order.payment_method || "Non disponible"}
          />
          <SpecLine
            label="Statut du paiement"
            value={
              order.payment_status
                ? order.payment_status === "paid"
                  ? "Payé"
                  : order.payment_status === "pending"
                  ? "En attente"
                  : order.payment_status === "failed"
                  ? "Échoué"
                  : order.payment_status
                : "Non disponible"
            }
          />
          <SpecLine
            label="Montant payé"
            value={
              order.payment_amount
                ? `${order.payment_amount.toFixed(2)} €`
                : order.total
                ? `${order.total.toFixed(2)} €`
                : "Non disponible"
            }
          />
          <SpecLine
            label="Date du paiement"
            value={
              order.created_at
                ? new Date(order.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Non disponible"
            }
          />
        </div>
      </div>

      {/* Back link */}
      <div>
        <Link
          to="/admin/dashboard"
          className="text-primary hover:underline text-sm"
        >
          ← Retour aux commandes
        </Link>
      </div>
    </div>
  );
}

// Helper components
function InfoLine({ icon, label }) {
  return (
    <div className="flex items-center gap-2 border-t border-gray-100 py-4">
      <span className="text-gray-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SpecLine({ label, value }) {
  return (
    <div className="border-t border-gray-100 py-4">
      <strong>{label} :</strong> {value || "Non disponible"}
    </div>
  );
}

// File Preview Card
function FilePreviewCard({ file, onDownload }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getFileType = (name) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    return "other";
  };

  const fileType = getFileType(file.name);

  return (
    <>
      {/* Card */}
      <div
        className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all bg-white"
        onClick={() => setPreviewOpen(true)}
      >
        <div className="w-80 h-60 flex items-center justify-center bg-gray-50">
          {fileType === "image" && !imageError ? (
            <img
              src={file.url}
              alt={file.name}
              className="min-w-full min-h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <FileText size={48} />
              <span className="text-xs font-medium">
                {fileType.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="absolute top-2 right-2 p-2 bg-primary text-white rounded-2xl opacity-30 group-hover:opacity-100 transition-all transform hover:scale-125"
        >
          <Download size={16} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-xs font-medium truncate">{file.name}</p>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewOpen && fileType === "image" && !imageError && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewOpen(false)}
        >
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}
