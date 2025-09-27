import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { FormControl, Select, MenuItem } from "@mui/material";
import { getRevenueLineData } from "../../services/orders";

export default function RevenueLineChart({
  timeRange = "month",
  metricType = "revenue",
  serviceType,
  selectedProduct,
  setSelectedProduct,
  productOptions = [],
}) {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTimeValue = (timeRange) => {
    const now = new Date();
    switch (timeRange) {
      case "year":
        return { timePeriod: "month", timeValue: (now.getFullYear() - 1).toString() };
      case "month":
        return {
          timePeriod: "days",
          timeValue: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
        };
      case "week":
        return { timePeriod: null, timeValue: null, lastDays: 7 };
      default:
        return { timePeriod: null, timeValue: null, lastDays: null };
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { timePeriod, timeValue, lastDays } = getTimeValue(timeRange);
        const data = await getRevenueLineData({
          serviceId: selectedProduct,
          timePeriod,
          timeValue,
          metricType,
          serviceType,
          last_days: lastDays,
        });
        const labels = Array.isArray(data.labels) ? data.labels : [];
        const values = Array.isArray(data.data) ? data.data.map((v) => parseFloat(v) || 0) : [];
        setChartLabels(labels);
        setChartData(values);
      } catch (err) {
        console.error("Error loading RevenueLineChart data:", err);
        setChartLabels([]);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProduct, timeRange, metricType, serviceType]);

  return (
    <div className="border-[var(--primary)] border-2 rounded-xl p-4 w-full h-full">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-[var(--skeleton)] rounded"></div>
          <div className="flex gap-2 items-center">
            <div className="h-4 w-12 bg-[var(--skeleton)] rounded"></div>
            <div className="h-6 w-24 bg-[var(--skeleton)] rounded"></div>
          </div>
          <div className="w-full h-[300px] bg-[var(--skeleton-strong)] rounded-xl mt-2"></div>
        </div>
      ) : chartLabels.length && chartData.length ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[var(--primary)]">
              Most Revenue by Product
            </h3>
            <div className="flex gap-2 items-center ">
              <span className="text-sm text-[var(--text-secondary)] mr-2">Product:</span>
              <FormControl variant="standard" size="small" >
                <Select
                  value={selectedProduct ?? "all"}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  disableUnderline
                >
                  <MenuItem value="all">All Products</MenuItem>
                  {productOptions.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <LineChart
            colors={["var(--accent)"]}
            xAxis={[
              {
                data: chartLabels.map((_, i) => i),
                valueFormatter: (i) => chartLabels[i],
              },
            ]}
            series={[
              { data: chartData, showMark: ({ index }) => index % 5 === 0 },
            ]}
            height={300}
          />
        </>
      ) : (
        <p className="text-center text-sm text-[var(--text-secondary)]">
          No data available
        </p>
      )}
    </div>
  );
}
