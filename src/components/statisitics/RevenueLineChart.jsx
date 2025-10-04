import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FormControl, Select, MenuItem } from "@mui/material";
import { getRevenueLineData } from "../../services/orders";
import NoData from "../NoData";

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

  const getTimeValue = (range) => {
    const now = new Date();
    switch (range) {
      case "year":
        return {
          timePeriod: "month",
          timeValue: (now.getFullYear() - 1).toString(),
        };
      case "month":
        return {
          timePeriod: "days",
          timeValue: `${now.getFullYear()}-${String(now.getMonth()).padStart(
            2,
            "0"
          )}`,
        };
      case "week":
        return { timePeriod: null, timeValue: null, lastDays: 7 };
      default:
        return { timePeriod: null, timeValue: null, lastDays: null };
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

        let labels = Array.isArray(data.labels) ? data.labels : [];
        let values = Array.isArray(data.data)
          ? data.data.map((v) => parseFloat(v) || 0)
          : [];

        if (labels.length === 0 || values.length === 0) {
          if (timeRange === "month") {
            const now = new Date();
            const lastMonthDate = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              1
            );
            const daysInMonth = new Date(
              lastMonthDate.getFullYear(),
              lastMonthDate.getMonth() + 1,
              0
            ).getDate();
            labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            values = Array(daysInMonth).fill(0);
          } else if (timeRange === "week") {
            labels = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
            values = Array(7).fill(0);
          }
        }

        setChartLabels(labels.length === 0 ? [] : labels);
        setChartData(values.length === 0 ? [] : values);
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

  const shouldShowNoData = chartLabels.length === 0 || chartData.length === 0;

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
      ) : !shouldShowNoData ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[var(--primary)]">
              Most Revenue by Product
            </h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-[var(--text-secondary)] mr-2">
                Product:
              </span>
              <FormControl variant="standard" size="small">
                <Select
                  value={selectedProduct ?? "all"}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  disableUnderline
                  sx={{
                    color: "var(--textMain)",
                    "& .MuiSelect-icon": { color: "var(--textMain)" },
                    backgroundColor: "var(--primBg)",
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "var(--primBg)",
                        "& .MuiMenuItem-root:hover": {
                          backgroundColor: "var(--lightBlue)",
                        },
                        "& .Mui-selected": {
                          backgroundColor: "var(--lightBlue)",
                        },
                      },
                    },
                  }}
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartLabels.map((label, i) => ({
                label,
                value: chartData[i],
              }))}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--textMain)"
                opacity={0.2}
              />
              <XAxis
                dataKey="label"
                stroke="var(--textMain)"
                tick={{ fill: "var(--textMain)", fontSize: 12 }}
              />
              <YAxis
                stroke="var(--textMain)"
                tick={{ fill: "var(--textMain)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--primBg)",
                  border: "1px solid var(--primary)",
                  borderRadius: "8px",
                  color: "var(--textMain)",
                  fontSize: 12,
                }}
                formatter={(value) => `${value.toLocaleString()} DZD`}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--accent)" }}
                activeDot={{ r: 6, fill: "var(--accent)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold text-[var(--primary)]">
            Most Revenue by Product
          </h3>
          <NoData message={getNoDataMessage()} color={getNoDataColor()} />
        </>
      )}
    </div>
  );
}
