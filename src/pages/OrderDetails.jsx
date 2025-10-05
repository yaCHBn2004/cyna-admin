import { useParams, Link } from "react-router-dom";
import { Mail, Phone, User, Building, Download } from "lucide-react";
import { useOrders } from "../context/OrdersContext";
import OrderTimeline from "../components/OrderTimeline";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
  const { orders, loading, error, updateOrder } = useOrders(); // Assuming updateOrder exists in context
  const order = orders.find((o) => String(o.id) === id);

  if (loading) return <div className="p-4">Chargement…</div>;
  if (error) return <div className="p-4 text-red-500">{error.message}</div>;
  if (!order) return <div className="p-4">Commande non trouvée.</div>;

  const statusLabel = STATUS_MAPPING[order.status] || "Statut inconnu";

  // Download full order JSON
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(order, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commande_${order.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download all files as ZIP
  const handleDownloadAllFiles = async () => {
    if (!order.files || order.files.length === 0) return;

    try {
      const zip = new JSZip();
      await Promise.all(
        order.files.map(async (file) => {
          try {
            const response = await fetch(file.url);
            if (!response.ok) throw new Error(`Failed to fetch ${file.name}`);
            const blob = await response.blob();
            zip.file(file.name, blob);
          } catch (err) {
            console.error(`Error downloading file ${file.name}:`, err);
            // Add error file instead
            zip.file(`ERROR_${file.name}.txt`, `Failed to download: ${err.message}`);
          }
        })
      );
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `commande_${order.id}_files.zip`);
    } catch (err) {
      console.error("Error creating ZIP:", err);
      alert("Erreur lors de la création du fichier ZIP");
    }
  };

  // Handle timeline updates
  const handleTimelineUpdate = (updatedOrder) => {
    // Update the order in context if updateOrder function exists
    if (updateOrder) {
      updateOrder(updatedOrder);
    }
    console.log('Order updated:', updatedOrder);
  };

  return (
    <div className="p-4 h-full w-full flex flex-col gap-10 mx-auto">
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
          <span className={`px-3 py-1 rounded-full text-xs capitalize font-medium ${
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            order.status === 'completed' || order.status === 'picked_up' ? 'bg-green-100 text-green-800' :
            order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {statusLabel}
          </span>
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
        {order.user?.email && (
          <a 
            href={`mailto:${order.user.email}?subject=Commande #${order.id}&body=Bonjour ${order.user.name || 'Monsieur/Madame'},`}
            className="mt-4 px-3 py-1 text-sm text-white rounded-full bg-special hover:bg-special/90 transition-colors"
          >
            Contacter le client
          </a>
        )}
      </div>

      {/* Spécifications de la commande */}
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold">Spécifications de la commande</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 text-sm">
          {/* Main fields */}
          <SpecLine
            label="Produit"
            value={order.service?.name || order.product_name}
          />
          <SpecLine label="Quantité" value={order.quantity || "Non disponible"} />
          <SpecLine label="Total" value={order.total ? `${order.total.toFixed(2)} €` : "Non disponible"} />

          {/* Dynamically display all non-null parameters */}
          {order.parameters &&
            Object.entries(order.parameters)
              .filter(
                ([_, value]) =>
                  value !== null && value !== undefined && value !== ""
              )
              .map(([key, value]) => (
                <SpecLine
                  key={key}
                  label={order.parameter_mapping?.[key] || key.replace(/_/g, " ")}
                  value={String(value)}
                />
              ))}
        </div>
      </div>

      {/* Files Section */}
      {order.files && order.files.length > 0 && (
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-lg font-semibold">Fichiers design</h2>
          <div className="flex flex-wrap gap-2">
            {order.files.map((file) => (
              <a
                key={file.id}
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                {file.name}
              </a>
            ))}
          </div>

          {order.files.length > 1 && (
            <button
              onClick={handleDownloadAllFiles}
              className="mt-2 px-4 py-2 rounded-md bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Télécharger tous les fichiers (ZIP)
            </button>
          )}
        </div>
      )}

  
      {/* Order Timeline */}
      <OrderTimeline
        order={order}
        onUpdate={handleTimelineUpdate}
      />

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