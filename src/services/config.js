export const API_BASE_URL = "https://server.cyna.dz/api";
export const API_VERSION = "v1";

export const buildApiUrl = (path) => `${API_BASE_URL}/${API_VERSION}/${path}`;

export function getToken() {
  return localStorage.getItem("authToken"); // ❗ tu avais oublié "localStorage"
}

export function getAuthHeaders({
  contentType = "application/json",
  useLang = true,
} = {}) {
  const token = getToken();

  const headers = {
    Accept: "application/json",
    ...(contentType && { "Content-Type": contentType }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(useLang && { lang_code: "fr" }),
    "ngrok-skip-browser-warning": "true",
  };

  return headers;
}
