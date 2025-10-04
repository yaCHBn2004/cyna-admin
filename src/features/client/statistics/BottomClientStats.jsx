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
          <h1 className="text-[22px] text-[var(--primary)]">Client Trends</h1>
        </div>
        <div className="flex gap-4">
          <FormControl variant="standard" size="small">
            <Select
              value={metricType}
              onChange={(e) => setMetricType(e.target.value)}
              disableUnderline
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "var(--primBg)",
                    "& .MuiMenuItem-root:hover": {
                      backgroundColor: "var(--lightBlue)",
                    },
                  },
                },
              }}
              sx={{
                color: "var(--textMain)", // external text color
                
                "& .MuiSelect-icon": { color: "var(--textMain)" },
                backgroundColor: "var(--primBg)",
              }}
            >
              <MenuItem
                value="revenue"
                sx={{
                  color: "var(--primary)",
                  "&.Mui-selected": {
                    backgroundColor: "var(--lightBlue)",
                    color: "var(--primary)",
                  },
                }}
              >
                Revenue
              </MenuItem>
              <MenuItem
                value="order_count"
                sx={{
                  color: "var(--primary)",
                  "&.Mui-selected": {
                    backgroundColor: "var(--lightBlue)",
                    color: "var(--primary)",
                  },
                }}
              >
                Orders
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="standard" size="small">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              disableUnderline
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "var(--primBg)",
                    "& .MuiMenuItem-root:hover": {
                      backgroundColor: "var(--lightBlue)",
                    },
                  },
                },
              }}
              sx={{
                color: "var(--textMain)", // external text color
                "& .MuiSelect-icon": { color: "var(--textMain)" },
                backgroundColor: "var(--primBg)",
              }}
            >
              <MenuItem
                value="week"
                sx={{
                  color: "var(--primary)",
                  "&.Mui-selected": {
                    backgroundColor: "var(--lightBlue)",
                  },
                }}
              >
                Last Week
              </MenuItem>
              <MenuItem
                value="month"
                sx={{
                  color: "var(--primary)",
                  "&.Mui-selected": {
                    backgroundColor: "var(--lightBlue)",
                  },
                }}
              >
                Last Month
              </MenuItem>
              <MenuItem
                value="year"
                sx={{
                  color: "var(--primary)",
                  "&.Mui-selected": {
                    backgroundColor: "var(--lightBlue)",
                  },
                }}
              >
                Last Year
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center  border-[var(--primary)] border-2 rounded-xl p-4 w-full h-full md:flex-row-reverse gap-4">
        <div className="flex-1/2">
          <ClientTable onRowClick={handleClientClick} timeRange={timeRange} />
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
