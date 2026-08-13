// API wrapper. Attaches the JWT (if present) and exposes typed helpers.

const BASE = '/api';
const TOKEN_KEY = 'tt_token';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ---- Auth ----
export const registerUser = (body) => request('/auth/register', { method: 'POST', body });
export const loginUser = (body) => request('/auth/login', { method: 'POST', body });
export const fetchMe = () => request('/auth/me', { auth: true });

// ---- Results ----
export const saveResult = (body) => request('/results', { method: 'POST', body, auth: true });
export const getLeaderboard = (limit = 10) => request(`/results/leaderboard?limit=${limit}`);
export const getMyStats = () => request('/results/me', { auth: true });

// ---- Certificates ----
export const issueCertificate = (body) => request('/certificates', { method: 'POST', body, auth: true });

// ---- Admin ----
export const getAdminToday = () => request('/admin/today', { auth: true });
