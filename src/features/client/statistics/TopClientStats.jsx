import { ClientReturnChart } from "../../../components/statisitics/ClientReturnChart.jsx";
import { ProfessionalChart } from "../../../components/statisitics/ProfessionalChart.jsx";

export default function TopClientStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Client Return Chart */}
      <div className="border-2 border-[var(--primary)] rounded-xl p-4">
        <ClientReturnChart
          title="Do clients come back?"
        />
      </div>

      {/* Professional vs Sous Traitant Chart */}
      <div className="border-2 border-[var(--primary)] rounded-xl p-4">
        <ProfessionalChart
          title="Professional vs Sous Traitant"
        />
      </div>
    </div>
  );
}
