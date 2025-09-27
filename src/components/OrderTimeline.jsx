import step1 from "../assets/icons/timeline/1.png";
import step2 from "../assets/icons/timeline/2.png";
import step3 from "../assets/icons/timeline/3.png";
import step4 from "../assets/icons/timeline/4.png";
import { XCircle } from "lucide-react";

const MAIN_STEPS = [
  {
    match: ["order_placed"],
    label: "Commande passée",
    icon: step1,
  },
  {
    match: ["design_approved", "in_progress"],
    label: "En production",
    icon: step2,
  },
  {
    match: ["completed"],
    label: "Terminée",
    icon: step3,
  },
  {
    match: ["picked_up"],
    label: "Récupérée",
    icon: step4,
  },
];

// Utility: format date
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

export default function OrderTimeline({ statusHistory='no data', onNext, onCancel }) {
  const statusList = statusHistory.map((entry) => entry.status);
  const cancelledIndex = statusList.findIndex((s) => s === "cancelled");
  const isCancelled = cancelledIndex !== -1;

  const visibleSteps = MAIN_STEPS.filter((step) =>
    step.match.some((status) =>
      isCancelled
        ? statusList.slice(0, cancelledIndex + 1).includes(status)
        : statusList.includes(status)
    )
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Suivi de la commande</h2>

      <div className="flex flex-col gap-3">
        {visibleSteps.map((step, index) => {
          const matchedEntry = statusHistory.find((entry) =>
            step.match.includes(entry.status)
          );

          const isCancelledHere =
            isCancelled &&
            step.match.some((status) =>
              statusList.slice(0, cancelledIndex + 1).includes(status)
            ) &&
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
              <div>
                <div className="text-sm font-medium">{step.label}</div>
                {matchedEntry?.created_at && (
                  <div className="text-xs text-gray-500">
                    {formatDate(matchedEntry.created_at)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Buttons */}
      {!isCancelled && !statusList.includes("picked_up") && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={onNext}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Étape suivante
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}
