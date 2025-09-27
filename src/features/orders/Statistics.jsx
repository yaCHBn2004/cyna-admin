import { useEffect, useState } from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
import RevenueLineChart from "../../components/statisitics/RevenueLineChart.jsx";
import TopProductsBarChart from "../../components/statisitics/TopProductsBarChart.jsx";
import { fetchYearlyOverview } from "../../services/orders.js";

export default function Statistics() {
  const [timeRange, setTimeRange] = useState("year");
  const [metricType, setMetricType] = useState("revenue");

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("all");

  const serviceType = window.location.pathname.includes("/dashboard/large-format")
    ? "large"
    : window.location.pathname.includes("/dashboard/small-format")
    ? "small"
    : null;

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchYearlyOverview({ serviceType, year: 2024 });
        const { total_summary } = response.data;
        setStats([
          { label: "Orders", value: total_summary.orders },
          { label: "Revenue", value: `${total_summary.revenue}` },
          { label: "Clients", value: total_summary.clients },
        ]);
      } catch (err) {
        console.error("Error loading stats:", err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [serviceType]);

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId ?? "all");
  };

  return (
    <div className="space-y-6">
      {/* --- Summary Cards --- */}
      <div className="flex flex-col md:flex-row gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl md:flex-1 bg-[var(--skeleton)] animate-pulse h-20"
            ></div>
          ))
        ) : error ? (
          <p className="text-[var(--error-text)]">{error}</p>
        ) : (
          stats.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl md:flex-1 bg-[var(--lightBlue)] hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <h4 className="text-[var(--text-secondary)] text-xs">{item.label}</h4>
              <p className="text-xl font-semibold text-[var(--text-primary)]">{item.value}</p>
            </div>
          ))
        )}
      </div>

      {/* --- Filters --- */}
      <div className="flex justify-between items-end ">
        <div>
          {loading ? (
            <div className="w-1/3 h-6 bg-[var(--skeleton)] rounded animate-pulse"></div>
          ) : (
            <h1 className="text-[22px] col-span-full text-[var(--primary)]">
              Statistics
            </h1>
          )}
        </div>
        <div className="flex gap-4">
          {loading ? (
            <>
              <div className="w-20 h-6 bg-[var(--skeleton)] rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-[var(--skeleton)] rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <FormControl variant="standard" size="small">
                <Select
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value)}
                  disableUnderline
                >
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="order_count">Orders</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard" size="small">
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  disableUnderline
                >
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </div>
      </div>

      {/* --- Charts --- */}
      <div className="flex flex-col md:flex-row gap-4">
        {loading ? (
          <>
            <div className="flex-1/2 h-[350px] bg-[var(--skeleton)] animate-pulse rounded-xl"></div>
            <div className="flex-1/2 h-[350px] bg-[var(--skeleton)] animate-pulse rounded-xl"></div>
          </>
        ) : (
          <>
            <div className="flex-1/2">
              <RevenueLineChart
                timeRange={timeRange}
                metricType={metricType}
                serviceType={serviceType}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                productOptions={productOptions}
              />
            </div>
            <div className="flex-1/2">
              <TopProductsBarChart
                timeRange={timeRange}
                metricType={metricType}
                serviceType={serviceType}
                onProductSelect={handleProductSelect}
                setProductOptions={setProductOptions}
                selectedProduct={selectedProduct}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
