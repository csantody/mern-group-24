import * as SecureStore from 'expo-secure-store';

// ============================================================
// APIClient: every request to Jasmine's Express API goes through here.
// ============================================================
export const API_BASE_URL = 'https://accelly.helpoasis.org/api';

export type ApiResult<T> = {
  ok: boolean;
  status: number;
  data: T & { error?: string };
};

async function request<T>(method: string, path: string, body?: object): Promise<ApiResult<T>> {
  const res = await fetch(API_BASE_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  // Some error responses (like 404) are HTML, not JSON, so don't crash on them
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: object) => request<T>('POST', path, body),
  put: <T>(path: string, body: object) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

// ============================================================
// Auth: POST /api/login and POST /api/register
// ============================================================
// Matches the "user" object returned by POST /api/login
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  role: string;
};

// Matches the body POST /api/register expects
export type NewUser = {
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  password: string;
};

export async function login(username: string, password: string): Promise<User> {
  const res = await api.post<{ message: string; user: User }>('/login', { login: username, password });
  if (!res.ok) throw new Error(res.data.error ?? 'Login failed');
  return res.data.user;
}

export async function register(newUser: NewUser): Promise<string> {
  const res = await api.post<{ message: string; userId: string }>('/register', newUser);
  if (!res.ok) throw new Error(res.data.error ?? 'Registration failed');
  return res.data.userId;
}

// ============================================================
// Signed-in user (saved on the phone; no token from the API yet)
// ============================================================
const KEY = 'accelly.user';
let current: User | null = null;

// persist = "Remember me". If off, the user only lasts until the app closes.
export async function saveUser(user: User, persist: boolean) {
  current = user;
  if (persist) await SecureStore.setItemAsync(KEY, JSON.stringify(user));
  else await SecureStore.deleteItemAsync(KEY);
}

export async function loadUser(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  current = raw ? JSON.parse(raw) : null;
  return current;
}

export function getUser() {
  return current;
}

export async function clearUser() {
  current = null;
  await SecureStore.deleteItemAsync(KEY);
}

// ============================================================
// Sensor data
// ============================================================
export type SensorReading = { timestamp: number; x: number; y: number; z: number };
