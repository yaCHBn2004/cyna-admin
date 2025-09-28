import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Circle, Triangle } from "lucide-react";
import { useOrders } from "../../context/OrdersContext";

const statusMapping = {
  order_placed: "En attente",
  design_approved: "Validé",
  in_progress: "En cours",
  completed: "Terminée",
  picked_up: "Récupérée",
  cancelled: "Annulée",
  delivered: "Livrée",
  no_status: "Sans statut",
};

export default function Orders() {
  const { orders: apiOrders, loading, error } = useOrders();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    if (!apiOrders || apiOrders.length === 0) return;
    const mapped = apiOrders.map((o) => ({
      id: o.id,
      date: o.created_at ? new Date(o.created_at).toLocaleDateString("fr-FR") : "-",
      client: o.user?.name || "Client inconnu",
      total: parseFloat(o.total) || 0,
      status: statusMapping[o.status] || o.status || "Inconnu",
    }));
    setOrders(mapped);
  }, [apiOrders]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...orders].sort((a, b) => {
      if (key === "total") return direction === "asc" ? a.total - b.total : b.total - a.total;
      if (key === "date")
        return direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      return 0;
    });
    setOrders(sorted);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <Circle size={12} className="inline ml-1 text-gray-400" />;
    if (sortConfig.direction === "asc")
      return <Triangle size={12} className="inline ml-1 rotate-180 text-primary" />;
    return <Triangle size={12} className="inline ml-1 text-primary" />;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "Tous" || order.status === filter;
    const matchesSearch =
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.id).includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  if (error) return <p className="text-red-500">{error.message}</p>;

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="h-10 w-64 bg-gray-200 rounded-xl animate-pulse mt-2 md:mt-0"></div>
        </div>
        <div className="overflow-x-auto p-3 w-full bg-darkerBg rounded-xl border-2 border-[var(--secondary)]">
          <table className="w-full text-sm rounded-xl">
            <thead>
              <tr className="border-b border-gray-100">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  {Array.from({ length: 6 }).map((__, i) => (
                    <td key={i} className="py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-4 text-primary">Commandes</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex gap-2 flex-wrap">
          {["Tous", "En attente", "En cours", "Terminée"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl text-sm ${
                filter === f
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Rechercher commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-2 rounded-xl bg-lightBlue text-sm w-full border-t-gray-300 md:w-64"
          />
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto p-3 w-full bg-darkerBg rounded-xl border-2 border-[var(--secondary)]">
        <table className="w-full text-sm rounded-xl">
          <thead>
            <tr className="text-left border-b text-primary p-3 border-gray-100">
              <th className="py-3">ID Commande</th>
              <th className="py-3 cursor-pointer" onClick={() => handleSort("date")}>
                Date {renderSortIcon("date")}
              </th>
              <th className="py-3">Client</th>
              <th className="py-3 cursor-pointer" onClick={() => handleSort("total")}>
                Total {renderSortIcon("total")}
              </th>
              <th className="py-3">Statut</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b text-secondary border-gray-100">
                  <td className="py-4">{order.id}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">{order.client}</td>
                  <td className="py-4">{order.total.toFixed(2)} €</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === "En attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "En cours"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline text-xs"
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  Aucune commande trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
