const BASE = `${import.meta.env.BASE_URL}api/admin`;

const STORAGE_KEY = "swr_admin_auth";

export function setAdminAuth(username: string, password: string) {
  const token = btoa(`${username}:${password}`);
  sessionStorage.setItem(STORAGE_KEY, token);
}

export function clearAdminAuth() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getAdminAuth(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

export async function adminFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAdminAuth();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Basic ${token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearAdminAuth();
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
