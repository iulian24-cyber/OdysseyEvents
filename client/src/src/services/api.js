const API_URL = import.meta.env.VITE_API_URL;

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  // 🔑 Detect FormData
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` })
  };

  // ❗ Only set JSON header if NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw data || { message: "Request failed" };
  }

  return data;
};
