import { useParams, Link } from "react-router-dom";
import { Mail, Phone, User, Building, Download, CheckCircle, Clock } from "lucide-react";
import { useOrders } from "../context/OrdersContext";
import { useEffect } from "react";
import clsx from "clsx";
import OrderTimeline from "../components/OrderTimeline";
 

const STATUS_STEPS = ["Order Placed", "In Production", "Completed", "Picked up"];

export default function OrderDetails() {
  const { id } = useParams();
  const { orders, loading, error } = useOrders();
  const order = orders.find((o) => String(o.id) === id);

  if (loading) return <div className="p-4">Chargement…</div>;
  if (error) return <div className="p-4 text-red-500">{error.message}</div>;
  if (!order) return <div className="p-4">Commande non trouvée.</div>;

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);


  // Inside the OrderDetails component
  useEffect(() => {
    if (order) {
      console.log("ORDER DATA:", order);
    }
  }, [order]);

  return (
    <div className="p-4 h-full w-full flex flex-col gap-10 mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-textMain">
        <Link to="/admin/dashboard" className="hover:underline text-primary">Commandes</Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-textMain">Commande #{order.id}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex w-20 md:w-auto md:items-end flex-col md:flex-row gap-3">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">Commande #{order.id}</h1>
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs capitalize">
            {order.status || "Statut inconnu"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">Passée le {order.date || "Date inconnue"}</span>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold mb-3">Informations client</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 text-sm">
          <InfoLine icon={<User size={16} />} label={order.user?.name || "Non disponible"} />
          <InfoLine icon={<Mail size={16} />} label={order.user?.email || "Non disponible"} />
          <InfoLine icon={<Phone size={16} />} label={order.phone || "Non disponible"} />
          <InfoLine icon={<Building size={16} />} label={order.company || "Non disponible"} />
        </div>
        <button className="mt-4 px-3 py-1 text-sm text-white rounded-full bg-special transition-colors">
          Contacter le client
        </button>
      </div>

      {/* Spécifications de la commande */}
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold">Spécifications de la commande</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 text-sm">
          <SpecLine label="Produit" value={order.service?.name || order.product_name} />
          <SpecLine label="Taille" value={order.size || order.parameters?.format} />
          <SpecLine label="Matériaux" value={order.material || order.parameters?.type_de_papier} />
          <SpecLine label="Quantité" value={order.quantity} />
          <SpecLine label="Finition" value={order.finish || order.parameters?.finition} />
        </div>
      </div>

      {/* Fichier à télécharger */}
      {order.file_url && (
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-lg font-semibold">Fichier design</h2>
          <a
            href={order.file_url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            <Download size={16} />
            Télécharger le fichier
          </a>
        </div>
      )}
      <div>{order.status}</div>
      {/* Suivi de la commande */}
      <OrderTimeline
        statusHistory={order.timeline}
        onNext={() => console.log("Next Step")}
        onCancel={() => console.log("Cancel Order")}
      />



      {/* Back link */}
      <div>
        <Link to="/admin/dashboard" className="text-primary hover:underline text-sm">
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
