import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { getFilteredData } from "../../services/orders";

export default function TopProductsBarChart({
  timeRange,
  metricType,
  serviceType,
  onProductSelect,
  setProductOptions,
 
}) {
  const [chartDataFull, setChartDataFull] = useState([]);
  const [loading, setLoading] = useState(true);

  const TOP_N = 5;

  const resolveTimeParams = (filterValue) => {
    const now = new Date();
    switch (filterValue) {
      case "year":
        return { time_period: "month", time_value: now.getFullYear().toString() };
      case "month":
        return {
          time_period: "days",
          time_value: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
        };
      case "week":
        return { last_days: 7 };
      default:
        return {
          time_period: "days",
          time_value: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
        };
    }
  };

  useEffect(() => {
    setLoading(true);
    const params = resolveTimeParams(timeRange);
    const fetchData = async () => {
      try {
        const data = await getFilteredData({ metricType, serviceType, ...params });
        const parsedFull = Array.isArray(data.details)
          ? data.details.map((item, index) => {
              let label = "";
              try {
                const nameObj = JSON.parse(item.name);
                label = nameObj?.fr || nameObj?.en || nameObj?.ar || "Produit";
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
        setChartDataFull(parsedFull);

        const unique = [];
        const ids = new Set();
        parsedFull.forEach((p) => {
          if (!ids.has(p.id)) {
            ids.add(p.id);
            unique.push({ id: p.id, name: p.label });
          }
        });
        if (typeof setProductOptions === "function") setProductOptions(unique);
      } catch (err) {
        console.error("Failed to load TopProductsBarChart data:", err);
        setChartDataFull([]);
        if (typeof setProductOptions === "function") setProductOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange, metricType, serviceType, setProductOptions]);

  const sorted = [...chartDataFull].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const topFive = sorted.slice(0, TOP_N);

  const labels = topFive.map((d) => d.label);
  const values = topFive.map((d) => (metricType === "revenue" ? d.value : d.order_count));

  // Enhanced bar click handler with better error handling
  const handleBarClick = (event, params) => {
    console.log("Bar clicked:", { event, params }); // Debug log
    
    // Try multiple ways to get the index
    let idx = null;
    if (params?.dataIndex !== undefined) idx = params.dataIndex;
    else if (params?.index !== undefined) idx = params.index;
    else if (event?.dataIndex !== undefined) idx = event.dataIndex;
    else if (event?.index !== undefined) idx = event.index;
    
    console.log("Resolved index:", idx); // Debug log
    
    if (typeof idx === "number" && idx >= 0 && idx < topFive.length) {
      const selectedProductId = topFive[idx].id;
      console.log("Selecting product:", selectedProductId, topFive[idx].label); // Debug log
      if (typeof onProductSelect === "function") {
        onProductSelect(selectedProductId);
      }
    } else {
      console.warn("Invalid bar click index:", idx);
    }
  };



  return (
    <div className="border-[var(--primary)] border-2 rounded-xl p-4 w-full h-full">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-[var(--skeleton)] rounded"></div>
          <div className="w-full h-[300px] bg-[var(--skeleton)] rounded-xl mt-2"></div>
        </div>
      ) : topFive.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[var(--primary)]">Top Products</h3>
            
          </div>
          <BarChart
            xAxis={[{ scaleType: "band", data: labels, label: "Product" }]}
            yAxis={[
              { label: metricType === "revenue" ? "Revenue (DZD)" : "Orders" },
            ]}
            series={[
              {
                data: values,
                label: metricType === "revenue" ? "Revenue" : "Orders",
                color: "var(--accent)",
                highlightScope: { faded: "global", highlighted: "item" },
              },
            ]}
            height={300}
            onAxisClick={handleBarClick}
            onItemClick={handleBarClick}
            sx={{
              cursor: "pointer",
              "& .MuiBarElement-root": { 
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                }
              },
            }}
          />
          <p className="text-xs text-[var(--text-secondary)] mt-2 text-center">
            Click on a bar to filter the line chart
          </p>
        </>
      ) : (
        <p className="text-center text-sm text-[var(--text-secondary)]">
          No data available
        </p>
      )}
    </div>
  );
}