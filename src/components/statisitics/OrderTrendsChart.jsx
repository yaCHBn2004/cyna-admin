import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fetchClientTimeSeries } from "../../services/client";

export function OrderTrendsChart({ clientId, metric, timeRange }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTimeValue = (range) => {
    const now = new Date();

    switch (range) {
      case "year":
        return {
          time_period: "month",
          time_value: (now.getFullYear()).toString(), // e.g., "2025"
        };

      case "month": {
        return {
          time_period: "days",
          time_value: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`, // e.g., "2025-08"
        };
      }

      case "week":
        return {
          time_period: "days",
          last_days: 7,
        };

      default:
        return {};
    }
  };

  const timeOptions = getTimeValue(timeRange);

  useEffect(() => {
    if (!clientId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchClientTimeSeries(clientId, {
          metric,
          ...timeOptions,
        });

        const transformed = response.labels.map((label, i) => ({
          date: label,
          [metric]: Number(response.data[i]),
        }));

        setChartData(transformed);
      } catch (err) {
        console.error("Error loading chart data", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId, timeRange, metric]);

  const getChartTitle = () => {
    if (!clientId) return "Select a Client";
    const metricLabel = metric === "revenue" ? "Revenue" : "Orders";
    return `Client ${metricLabel} Trends`;
  };

  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-[var(--skeleton)] rounded"></div>
          <div className="w-full h-[300px] bg-[var(--skeleton-strong)] rounded-xl mt-2"></div>
        </div>
      ) : chartData.length ? (
        <>
          <div className="flex justify-between  items-center mb-4">
            <h3 className="text-lg font-bold text-[var(--primary)]">
              {getChartTitle()}
            </h3>
          </div>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--text-secondary)" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--text-secondary)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--text-secondary)"
                  fontSize={12}
                  label={{ 
                    value: metric === "revenue" ? "Revenue (DZD)" : "Orders", 
                    angle: -90, 
                    position: "insideLeft" 
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--primary)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value, name) => [
                    metric === "revenue" ? `${value.toLocaleString()} DZD` : value,
                    metric === "revenue" ? "Revenue" : "Orders"
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey={metric} 
                  stroke="var(--accent)" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--accent)" }}
                  activeDot={{ r: 6, fill: "var(--accent)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <h3 className="text-lg font-bold text-[var(--primary)] mb-4">
            {getChartTitle()}
          </h3>
          <p className="text-center text-sm text-[var(--text-secondary)]">
            {!clientId ? "Please select a client to view trends" : "No data available"}
          </p>
        </div>
      )}
    </div>
  );
}