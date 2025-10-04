
import { buildApiUrl, getAuthHeaders } from "./config";







export async function fetchOrders({
  page = 1,
  paid = true,
  per_page = 10,
  search = "",
  status = null,

} = {}) {
  // ✅ use buildApiUrl
  const url = new URL(buildApiUrl("admin/orders"));
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("per_page", per_page);
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (paid !== null) params.append("paid", paid);


  url.search = params.toString();

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Erreur lors de la récupération des commandes.");
  }

  // API format has `orders` and `pagination`
  return json.orders || [];
}
// services/statistics.js


/**
 * Fetch statistics using time_period and time_value
 * 
 * @param {Object} options
 * @param {"revenue" | "order_count"} options.metricType
 * @param {"month" | "year"  | "days" } options.timePeriod
 * @param {string} options.timeValue - e.g. "2024-07" or "2024"
 * @param {number} options.limit
 * @param {"small" | "large" | null} options.serviceType
 * @param {"fr" | "en" | "ar"} options.langCode
 */
export async function getFilteredData({
  metricType = "revenue",
  time_period,
  time_value,
  last_days,
  limit = 5,
  serviceType = null,
  langCode = "fr",
} = {}) {
  const queryParams = new URLSearchParams({
    metric_type: metricType,
    limit: limit.toString(),
  });

  if (time_period && time_value) {
    queryParams.append("time_period", time_period);
    queryParams.append("time_value", time_value);
  } else if (last_days) {
    queryParams.append("last_days", last_days);
  }

  if (serviceType) queryParams.append("service_type", serviceType);


  const url = `${buildApiUrl("statistics/services/top")}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders({ useLang: true }),
        lang_code: langCode,
      },
    });

    if (!response.ok) {
      console.error("API response error:", response.status);
      throw new Error("Failed to fetch statistics");
    }

    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    return [];
  }
}

export async function getRevenueLineData({
  serviceId = null,
  timePeriod = 'month',
  timeValue = '2025-07',
  metricType = 'revenue',
  serviceType = null,
  last_days = null,
}) {
  // base URL, on injecte le serviceId si ce n'est pas "all"
  let url = "";
  if (serviceId && serviceId !== "all") {
    url = buildApiUrl(`statistics/services/${serviceId}/time-series`);
  } else {
    url = buildApiUrl("statistics/services/time-series");
  }

  const queryParams = new URLSearchParams({
    metric_type: metricType,
  });

  if (serviceType) {
    queryParams.append("service_type", serviceType);
  }

  if (last_days !== null && last_days !== undefined) {
    queryParams.append("last_days", last_days);
  } else {
    queryParams.append("time_period", timePeriod);
    queryParams.append("time_value", timeValue);
  }

  const fullUrl = `${url}?${queryParams.toString()}`;

  try {
    const response = await fetch(fullUrl, {
      headers: {
        ...getAuthHeaders({ useLang: true }),
        lang_code: "fr",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch chart data");

    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error("API error:", err);
    return {
      labels: [],
      data: [],
      service_name: "",
      total: 0,
    };
  }
}




export async function fetchYearlyOverview({ serviceType = null, year = 2024 }) {
  const params = new URLSearchParams();
  if (serviceType) params.append("service_type", serviceType);
  if (year) {
    params.append("start_year", year);
    params.append("end_year", year+1);
  }

  const url = `${buildApiUrl("statistics/orders/yearly-overview")}?${params.toString()}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch yearly overview data");
  }

  return res.json();
}
