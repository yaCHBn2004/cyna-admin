import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getFilteredData } from "../../services/orders";
import NoData from "../NoData";

export default function TopProductsBarChart({
  timeRange,
  metricType,
  serviceType,
  onProductSelect,
  setProductOptions,
}) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const TOP_N = 5;

  const resolveTimeParams = (filterValue) => {
    const now = new Date();
    switch (filterValue) {
      case "year":
        return { time_period: "month", time_value: (now.getFullYear() - 1).toString() };
      case "month": {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const year = lastMonthDate.getFullYear();
        const month = String(lastMonthDate.getMonth() + 1).padStart(2, "0");
        return { time_period: "days", time_value: `${year}-${month}` };
      }
      case "week":
        return { last_days: 7 };
      default:
        return { last_days: 30 };
    }
  };

  const getNoDataMessage = () => {
    switch (timeRange) {
      case "week":
        return "There are no sales this week";
      case "month":
        return "There are no sales this month";
      case "year":
      default:
        return "No available data";
    }
  };

  const getNoDataColor = () =>
    timeRange === "year" ? "text-gray-100" : "text-[var(--secondary)]";

  useEffect(() => {
    setLoading(true);
    const params = resolveTimeParams(timeRange);

    const fetchData = async () => {
      try {
        const data = await getFilteredData({ metricType, serviceType, ...params });
        let parsedFull = Array.isArray(data.details)
          ? data.details.map((item, index) => {
              let label = "";
              try {
                const nameObj = JSON.parse(item.name);
                label = nameObj?.fr || nameObj?.en || nameObj?.ar || `Produit ${index + 1}`;
              } catch {
                label = item.name || `Produit ${index + 1}`;
              }
              const id = item.service_id ?? item.id ?? item.product_id ?? index;
              return {
                id: String(id),
                label,
                value: parseFloat(item.value) || 0,
                order_count: parseFloat(item.order_count || item.value) || 0,
              };
            })
          : [];

        const sorted = [...parsedFull].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
        const topFive = sorted.slice(0, TOP_N);

        setChartData(
          topFive.map((d) => ({
            label: d.label,
            value: metricType === "revenue" ? d.value : d.order_count,
            id: d.id,
          }))
        );

        if (typeof setProductOptions === "function") {
          const unique = topFive.map((d) => ({ id: d.id, name: d.label }));
          setProductOptions(unique);
        }
      } catch (err) {
        console.error("Failed to load TopProductsBarChart data:", err);
        setChartData([]);
        if (typeof setProductOptions === "function") setProductOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, metricType, serviceType, setProductOptions]);

  const handleBarClick = (data) => {
    if (data && typeof onProductSelect === "function") onProductSelect(data.id);
  };

  return (
    <div className="border-[var(--primary)] border-2 rounded-xl p-4 w-full h-full">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-[var(--skeleton)] rounded"></div>
          <div className="w-full h-[300px] bg-[var(--skeleton-strong)] rounded-xl mt-2"></div>
        </div>
      ) : chartData.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[var(--primary)]">Top Products</h3>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid stroke="var(--textMain)" strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="label"
                  stroke="var(--textMain)"
                  tick={{ fill: "var(--textMain)", fontSize: 12 }}
                />
                <YAxis
                  stroke="var(--textMain)"
                  tick={{ fill: "var(--textMain)", fontSize: 12 }}
                  label={{
                    value: metricType === "revenue" ? "Revenue (DZD)" : "Orders",
                    angle: -90,
                    position: "insideLeft",
                    fill: "var(--textMain)",
                    style: { textAnchor: "middle", fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--primBg)",
                    border: "1px solid var(--primary)",
                    borderRadius: "8px",
                    color: "var(--textMain)",
                    fontSize: 12,
                  }}
                  formatter={(value) =>
                    metricType === "revenue"
                      ? `${value.toLocaleString()} DZD`
                      : value
                  }
                  labelFormatter={(label) => `Product: ${label}`}
                />
                <Bar
                  dataKey="value"
                  fill="var(--accent)"
                  onClick={(e) => handleBarClick(e)}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2 text-center">
            Click on a bar to filter the line chart
          </p>
        </>
      ) : (
        <NoData message={getNoDataMessage()} color={getNoDataColor()} />
      )}
    </div>
  );
}
