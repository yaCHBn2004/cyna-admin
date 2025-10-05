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

const STATUS_LABELS = {
  order_placed: "Commande passée",
  design_approved: "Design approuvé",
  in_progress: "En cours",
  completed: "Terminée",
  picked_up: "Récupérée",
  cancelled: "Annulée",
};

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
  const currentStatus = statusList[statusList.length - 1];
  const nextStatus = NEXT_STATUS_MAPPING[currentStatus];
  const cancelledIndex = statusList.findIndex((s) => s === "cancelled");
  const isCancelled = cancelledIndex !== -1;

  const visibleSteps = MAIN_STEPS.filter((step) =>
    step.match.some((status) =>
      isCancelled
        ? statusList.slice(0, cancelledIndex + 1).includes(status)
        : statusList.includes(status)
    )
  );

  const handleNext = async () => {
    if (!nextStatus || isUpdating) return;
    setIsUpdating(true);
    try {
      const description = `Statut mis à jour vers ${STATUS_LABELS[nextStatus]}`;
      const response = await updateTimelineStatus(order.id, nextStatus, description);

      const newEntry = {
        status: nextStatus,
        description,
        created_at: new Date().toISOString(),
      };

      const updatedTimeline = [...timeline, newEntry];
      setTimeline(updatedTimeline);

      onUpdate?.({ ...order, status: nextStatus, timeline: updatedTimeline });
      console.log("Timeline updated successfully:", response);
    } catch (err) {
      console.error("Failed to update timeline:", err);
      alert(err.message || "Erreur lors de la mise à jour du statut");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (isCancelled || isUpdating) return;
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) return;

    setIsUpdating(true);
    try {
      const description = "Commande annulée par l'administrateur";
      const response = await updateTimelineStatus(order.id, "cancelled", description);

      const newEntry = {
        status: "cancelled",
        description,
        created_at: new Date().toISOString(),
      };

      const updatedTimeline = [...timeline, newEntry];
      setTimeline(updatedTimeline);

      onUpdate?.({ ...order, status: "cancelled", timeline: updatedTimeline });
      console.log("Order cancelled successfully:", response);
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err.message || "Erreur lors de l'annulation");
    } finally {
      setIsUpdating(false);
    }
  };

  // Interdire l’annulation après l’état “En production”
  const canCancel =
    !isCancelled && !["design_approved", "in_progress", "completed", "picked_up"].includes(currentStatus);

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
                  <img src={step.icon} alt={`Étape ${index + 1}`} className="w-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {isCancelledHere ? "Annulée" : step.label}
                </div>
                {matchedEntry?.created_at && (
                  <div className="text-xs text-primary font-medium">
                    {formatDate(matchedEntry.created_at)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isCancelled && (
        <div className="flex gap-2 mt-4  ">
  {nextStatus && (
    <button
      onClick={handleNext}
      disabled={isUpdating}
      className="px-4 py-2 bg-primary text-white font-semibold rounded hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
    >
      {isUpdating && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {`Passer à : ${STATUS_LABELS[nextStatus]}`}
    </button>
  )}
  {canCancel && (
    <button
      onClick={handleCancel}
      disabled={isUpdating}
      className="px-4 py-2 text-red-600 border border-red-600 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50"
    >
      Annuler
    </button>
  )}
</div>

      )}

    
 
    </div>
  );
}
