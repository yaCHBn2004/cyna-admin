// import { useEffect, useState } from "react";
// import { fetchMetricData } from "../services/orders";


// export default function MetricTestComponent() {
//   const [data, setData] = useState(null);
//   const [status, setStatus] = useState("idle"); // idle | loading | success | error
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function loadData() {
//       setStatus("loading");
//       try {
//         const result = await fetchMetricData({
//           metricType: "revenue",     // "revenue" or "order_count"
//           timePeriod: "month",       // "year", "month", "days"
//           limit: 30,                 // between 1 and 100
//           serviceType: null,         // "small", "large", or null
//           langCode: "fr",            // "fr", "en", or "ar"
//         });

//         setData(result);
//         setStatus("success");
//       } catch (err) {
//         setError(err.message || "Unknown error");
//         setStatus("error");
//       }
//     }

//     loadData();
//   }, []);

//   return (
//     <div className="p-4 border rounded-md shadow">
//       <h2 className="text-xl font-semibold mb-2">Metric API Test</h2>

//       {status === "loading" && <p>⏳ Loading...</p>}
//       {status === "error" && <p className="text-red-500">❌ Error: {error}</p>}
//       {status === "success" && (
//         <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto max-h-96">
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// }
