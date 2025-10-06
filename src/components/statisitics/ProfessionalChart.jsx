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

import { fetchRevenueData } from "../../services/client";

export function ProfessionalChart({ title = "Who Buys the Most from Us ?" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const res = await fetchRevenueData();

        const chartData = [
          {
            name: "Professional",
            value: parseFloat(res.professional_revenue) || 0,
          },
          {
            name: "Sous Traitant",
            value: parseFloat(res.sous_traitant_revenue) || 0,
          },
        ];

        setData(chartData);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadRevenue();
  }, []);

  return (
    <div className="space-y-4">
      <div className="h-80" id="professional-chart">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            {/* Skeleton placeholder for chart */}
            <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex flex-col justify-end p-6 space-y-2">
              <div className="h-1/4 bg-gray-300 rounded-md"></div>
              <div className="h-2/4 bg-gray-300 rounded-md"></div>
              <div className="h-3/4 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        ) : (
          <>
          <h2 className="text-lg font-bold text-primary mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height="90%">
            
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("fr-DZ", {
                    style: "currency",
                    currency: "DZD",
                    minimumFractionDigits: 0,
                  }).format(value)
                }
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid var(--primary)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" fill="var(--chart-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </>
        
        )}
      </div>
    </div>
  );
}
