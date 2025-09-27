import { buildApiUrl, getAuthHeaders } from "./config";

export async function signIn({
  email,
  password,
  device_id = "web_device",
  device_type = "web",
  fcm_token = "web_fcm_token",
  remember = true,
}) {
  const url = buildApiUrl("auth/login");

  const payload = { email, password, device_id, device_type, fcm_token, remember };

  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Erreur de connexion.");
  return json;
}
