import { useState } from "react";
import step1 from "../assets/icons/timeline/1.png";
import step2 from "../assets/icons/timeline/2.png";
import step3 from "../assets/icons/timeline/3.png";
import step4 from "../assets/icons/timeline/4.png";
import { XCircle } from "lucide-react";
import { NEXT_STATUS_MAPPING, updateTimelineStatus } from "../services/updateTimeline";

const MAIN_STEPS = [
  { match: ["order_placed"], label: "Commande passée", icon: step1 },
  { match: ["design_approved", "in_progress"], label: "En production", icon: step2 },
  { match: ["completed"], label: "Terminée", icon: step3 },
  { match: ["picked_up"], label: "Récupérée", icon: step4 },
];

// Status display mapping
const STATUS_LABELS = {
  order_placed: "Commande passée",
  design_approved: "Design approuvé",
  in_progress: "En cours",
  completed: "Terminée",
  picked_up: "Récupérée",
  cancelled: "Annulée"
};

// Format date utility
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTimeline({ order, onUpdate }) {
  const [timeline, setTimeline] = useState(order.timeline || []);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const statusList = timeline.map((entry) => entry.status);
  const cancelledIndex = statusList.findIndex((s) => s === "cancelled");
  const isCancelled = cancelledIndex !== -1;

  const visibleSteps = MAIN_STEPS.filter((step) =>
    step.match.some((status) =>
      isCancelled
        ? statusList.slice(0, cancelledIndex + 1).includes(status)
        : statusList.includes(status)
    )
  );

  const currentStatus = statusList[statusList.length - 1];
  const nextStatus = NEXT_STATUS_MAPPING[currentStatus];

  const handleNext = async () => {
    if (!nextStatus || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const description = `Statut mis à jour vers ${STATUS_LABELS[nextStatus] || nextStatus}`;
      const response = await updateTimelineStatus(order.id, nextStatus, description);
      
      // Create new timeline entry based on API response
      const newEntry = {
        status: nextStatus,
        description: description,
        created_at: new Date().toISOString()
      };
      
      const updatedTimeline = [...timeline, newEntry];
      setTimeline(updatedTimeline);
      
      // Call parent callback with updated order data
      if (onUpdate) {
        onUpdate({
          ...order,
          status: nextStatus,
          timeline: updatedTimeline
        });
      }
      
      console.log('Timeline updated successfully:', response);
    } catch (err) {
      console.error("Failed to update timeline:", err);
      alert(err.message || "Erreur lors de la mise à jour du statut");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (isCancelled || isUpdating) return;
    
    // Confirm cancellation
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      return;
    }
    
    setIsUpdating(true);
    try {
      const description = "Commande annulée par l'administrateur";
      const response = await updateTimelineStatus(order.id, "cancelled", description);
      
      const newEntry = {
        status: "cancelled",
        description: description,
        created_at: new Date().toISOString()
      };
      
      const updatedTimeline = [...timeline, newEntry];
      setTimeline(updatedTimeline);
      
      if (onUpdate) {
        onUpdate({
          ...order,
          status: "cancelled",
          timeline: updatedTimeline
        });
      }
      
      console.log('Order cancelled successfully:', response);
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err.message || "Erreur lors de l'annulation");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Suivi de la commande</h2>
      <div className="flex flex-col gap-3">
        {visibleSteps.map((step, index) => {
          const matchedEntry = timeline.find((entry) => step.match.includes(entry.status));
          const isCancelledHere =
            isCancelled &&
            step.match.some((status) => statusList.slice(0, cancelledIndex + 1).includes(status)) &&
            index === visibleSteps.length - 1;

          return (
            <div key={step.label} className="flex items-start gap-2">
              <div className="w-10 flex items-center justify-center mt-1">
                {isCancelledHere ? (
                  <XCircle size={20} className="text-red-600" />
                ) : (
                  <img 
                    src={step.icon} 
                    alt={`Étape ${index + 1}`} 
                    className="w-full" 
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {isCancelledHere ? "Annulée" : step.label}
                </div>
                {matchedEntry?.created_at && (
                  <div className="text-xs text-gray-500">
                    {formatDate(matchedEntry.created_at)}
                  </div>
                )}
                {matchedEntry?.description && (
                  <div className="text-xs text-gray-600 mt-1">
                    {matchedEntry.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show current status if no timeline entries match main steps */}
      {visibleSteps.length === 0 && currentStatus && (
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded">
          <div className="text-sm">
            <span className="font-medium">Statut actuel: </span>
            <span className="capitalize">
              {STATUS_LABELS[currentStatus] || currentStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Buttons */}
      {!isCancelled && (
        <div className="flex gap-2 mt-4 justify-end">
          {nextStatus && (
            <button 
              onClick={handleNext} 
              disabled={isUpdating}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {`Passer à : ${STATUS_LABELS[nextStatus] || nextStatus.replace("_", " ")}`}
            </button>
          )}
          <button 
            onClick={handleCancel} 
            disabled={isUpdating}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Show completion message */}
      {currentStatus === 'picked_up' && !isCancelled && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
          ✅ Commande terminée et récupérée
        </div>
      )}
    </div>
  );
}