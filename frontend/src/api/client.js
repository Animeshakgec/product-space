const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (!token) localStorage.removeItem("token");
  else localStorage.setItem("token", token);
}

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  const auth = token ?? getToken();
  if (auth) headers.Authorization = `Bearer ${auth}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/auth/me", { method: "GET" }),

  listTasks: () => request("/tasks", { method: "GET" }),
  createTask: (payload) => request("/tasks", { method: "POST", body: payload }),
  updateTaskStatus: (id, status) => request(`/tasks/${id}/status`, { method: "PATCH", body: { status } }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" })
};

