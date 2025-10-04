import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { fetchClientRetention } from "../../services/client";

export function ClientReturnChart({ title = "Do clients come back?" }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchClientRetention();
        const { labels, data } = response.data;

        const formattedData = labels.map((label, index) => ({
          name: label,
          value: data[index],
          color: index === 1 ? "var(--chart-primary)" : "var(--accent)", // 0 = Did not return, 1 = Returned
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to load client retention data", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-4 h-80 flex flex-col">
      {loading ? (
        <div className="animate-pulse flex flex-col items-center justify-center h-full gap-6 w-full">
          {/* Skeleton title */}
          <div className="h-5 w-1/2 var(--skeleton) rounded mb-4"></div>
          {/* Circle skeleton */}
          <div className="w-40 h-40 rounded-full var(--skeleton)"></div>
          {/* Legend skeleton */}
          <div className="flex gap-4">
            <div className="h-4 w-24 var(--skeleton) rounded"></div>
            <div className="h-4 w-24 var(--skeleton) rounded"></div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold text-primary mb-4">{title}</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={40}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
