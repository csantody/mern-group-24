import * as SecureStore from 'expo-secure-store';

// APIClient: every request to Jasmine's Express API goes through here.
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

// Auth: POST /api/login and POST /api/register
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

// Signed-in user (saved on the phone; no token from the API yet)
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

// Sensor data
export type SensorReading = { timestamp: number; x: number; y: number; z: number };

// Vehicles: /api/vehicles (Jasmine's backend/routes/vehicles.js)

// The car's details. This is the body for create and update.
export type VehicleInfo = {
  userId: string;
  name: string;
  weightWithoutDriver: number; // kg
  weightWithDriver: number; // kg
  photoUrl: string | null;
};

// One sample as the API stores it. t = seconds since the run started.
export type ApiSample = { t: number; x: number; y: number; z: number };

export type Session = {
  id: string; // created by the server
  startedAt: string; // ISO timestamp, e.g. "2026-11-16T21:05:00.000Z"
  durationS: number;
  peakG: number;
  avgG: number;
  samples: ApiSample[];
};

// One document in the "vehicles" collection
export type VehicleDoc = {
  _id: string;
  vehicle: VehicleInfo;
  sessions: Session[];
};

// Throws the server's error message if the request failed, otherwise returns the data
function unwrap<T>(res: ApiResult<T>, fallback: string): T {
  if (!res.ok) throw new Error(res.data.error ?? fallback);
  return res.data;
}

export async function getVehicles(userId: string) {
  return unwrap(await api.get<VehicleDoc[]>(`/vehicles?userId=${encodeURIComponent(userId)}`), 'Could not load vehicles');
}

export async function getVehicle(id: string) {
  return unwrap(await api.get<VehicleDoc>(`/vehicles/${id}`), 'Could not load vehicle');
}

export async function createVehicle(info: VehicleInfo) {
  return unwrap(await api.post<VehicleDoc>('/vehicles', { vehicle: info }), 'Could not save vehicle');
}

export async function updateVehicle(id: string, info: VehicleInfo) {
  return unwrap(await api.put<VehicleDoc>(`/vehicles/${id}`, { vehicle: info }), 'Could not save vehicle');
}

export async function deleteVehicle(id: string) {
  unwrap(await api.delete<{ message: string }>(`/vehicles/${id}`), 'Could not delete vehicle');
}

// The API rejects sessions with more than 1000 samples
export const MAX_SAMPLES = 1000;

// Convert recorded readings to the API format: absolute ms → seconds since start.
// If there are too many, keep every Nth one so the whole run still fits.
export function toApiSamples(readings: SensorReading[]): ApiSample[] {
  if (readings.length === 0) return [];
  const t0 = readings[0].timestamp;
  const step = Math.max(1, readings.length / MAX_SAMPLES);
  const out: ApiSample[] = [];
  for (let i = 0; i < readings.length && out.length < MAX_SAMPLES; i += step) {
    const r = readings[Math.floor(i)];
    out.push({ t: (r.timestamp - t0) / 1000, x: r.x, y: r.y, z: r.z });
  }
  return out;
}

export async function saveSession(vehicleId: string, session: Omit<Session, 'id'>) {
  const res = await api.post<{ message: string; session: Session }>(`/vehicles/${vehicleId}/sessions`, session);
  return unwrap(res, 'Could not save session').session;
}

export function formatSessionDate(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}
