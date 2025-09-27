
import { buildApiUrl, getAuthHeaders } from "./config";

export async function fetchClientRetention() {
    const url = buildApiUrl("statistics/users/retention");

    const res = await fetch(url, {
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch client retention data");
    }

    return res.json();
}


export async function fetchTopClients({ time_value = null, last_days = null, limit = 10 } = {}) {
    const url = new URL(buildApiUrl("statistics/users/top"));

    if (time_value) url.searchParams.append("time_value", time_value);
    if (last_days) url.searchParams.append("last_days", last_days);
    if (limit) url.searchParams.append("limit", limit);

    const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch top clients data");
    }

    const data = await res.json();
    return data.data; // only return the data object
}


export async function fetchClientTimeSeries(
  userId,
  { time_value, metric, time_period, last_days }
) {
  const url = new URL(buildApiUrl(`statistics/users/${userId}/time-series`));

  const params = new URLSearchParams();
  if (time_value) params.append("time_value", time_value);
  if (time_period) params.append("time_period", time_period);
  if (last_days) params.append("last_days", last_days);
  if (metric) params.append("metric", metric);

  try {
    const res = await fetch(`${url}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch time series: ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("fetchClientTimeSeries error:", err);
    throw err;
  }
}


export async function fetchRevenueData() {
  const url = buildApiUrl("statistics/users/type-distribution");

  try {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json = await res.json();
    return json.data; // Return only the 'data' object
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    throw error;
  }
}





// soustraitant validation 


export const fetchPendingSousTraitants = async (page = 1, perPage = 10) => {
  try {
    const url = new URL(buildApiUrl("admin/user-management/pending-approvals"));
    url.searchParams.append("page", page);
    url.searchParams.append("per_page", perPage);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pending sous-traitants:", error);
    return { users: [], pagination: { current_page: 1, last_page: 1 } };
  }
};




export async function fetchCommercialRegisterFileInfo(id) {
  const url = buildApiUrl(`admin/user-management/${id}/file-url`);
  
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch file info: ${res.status}`);
  }

  return res.json(); // Expected: { file_url, filename, expires_at }
}




// patch the appvorvemnt 

export async function approveUser(userId, approved) {
  const url = buildApiUrl(`admin/user-management/${userId}/approve`);

  const res = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ approved }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update user approval status.");
  }

  const data = await res.json();
  return data; // contains message, user, status
}
