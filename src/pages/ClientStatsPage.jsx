import BottomClientStats from "../features/client/statistics/BottomClientStats.jsx";
import TopClientStats from "../features/client/statistics/TopClientStats.jsx";


export default function ClientStatsPage() {
  return (
    <div className="min-h-screen p-6 space-y-10">
      <h1 className="text-2xl font-bold mb-4">Client Statistics</h1>
      <TopClientStats />
      <BottomClientStats />
    </div>
  );
}
