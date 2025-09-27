import { useState } from "react";
import ClientTable from "../../../components/statisitics/ClientTable.jsx";
import { OrderTrendsChart } from "../../../components/statisitics/OrderTrendsChart.jsx";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function BottomClientStats() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [metricType, setMetricType] = useState("revenue");

  const handleClientClick = (userId) => {
    console.log("Clicked client ID:", userId);
    setSelectedClient(userId);
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[22px] text-[var(--primary)]">
            Client Revenue Trends
          </h1>
        </div>
        <div className="flex gap-4">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center  border-[var(--primary)] border-2 rounded-xl p-4 w-full h-full md:flex-row-reverse gap-4">

        <div className="flex-1/2">
          <ClientTable
            onRowClick={handleClientClick}
            timeRange={timeRange}
          />
        </div>

        <div className="flex-1/2 ">
          <OrderTrendsChart
            clientId={selectedClient}
            timeRange={timeRange}
            metric={metricType}
          />
        </div>
      </div>
    </div>
  );
}