// SAMPLE DATA ONLY. These values come from the Figma mockups.
// Replace with API calls (VehicleService / SessionService) once Jasmine's endpoints are defined.

export type Vehicle = {
  id: string;
  name: string;
  weightWithoutDriver: number; // kg
  weightWithDriver: number; // kg
  photoUrl?: string;
};

export type SpeedPoint = { t: number; v: number }; // seconds, km/h

export type SessionSummary = {
  id: string;
  vehicleId: string;
  dateLabel: string;
  zeroToHundredS: number;
  peakG: number;
  avgG: number;
  powerHp: number;
  torqueLbFt: number;
  topSpeedKmh: number;
  distanceM: number;
  speedTrace: SpeedPoint[];
};

export const mockUser = { name: 'Jamie', initials: 'JL' };

export const mockVehicles: Vehicle[] = [
  { id: 'v1', name: 'Daily GTI', weightWithoutDriver: 1375, weightWithDriver: 1450 },
  { id: 'v2', name: 'Weekend MX-5', weightWithoutDriver: 1060, weightWithDriver: 1140 },
];

// Smooth 0 -> 100 km/h curve that reaches 100 at `endS` seconds
function sampleTrace(endS: number): SpeedPoint[] {
  const k = 0.3;
  const norm = 1 - Math.exp(-k * endS);
  const points: SpeedPoint[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (endS * i) / 40;
    points.push({ t, v: (100 * (1 - Math.exp(-k * t))) / norm });
  }
  return points;
}

export const mockSessions: SessionSummary[] = [
  { id: 's1', vehicleId: 'v1', dateLabel: 'Today · 10:42', zeroToHundredS: 7.4, peakG: 0.82, avgG: 0.74, powerHp: 420, torqueLbFt: 480, topSpeedKmh: 182, distanceM: 420, speedTrace: sampleTrace(7.4) },
  { id: 's2', vehicleId: 'v1', dateLabel: 'Yesterday · 16:18', zeroToHundredS: 7.6, peakG: 0.8, avgG: 0.72, powerHp: 412, torqueLbFt: 471, topSpeedKmh: 178, distanceM: 410, speedTrace: sampleTrace(7.6) },
  { id: 's3', vehicleId: 'v1', dateLabel: '24 Oct · 09:35', zeroToHundredS: 7.8, peakG: 0.78, avgG: 0.71, powerHp: 405, torqueLbFt: 464, topSpeedKmh: 175, distanceM: 405, speedTrace: sampleTrace(7.8) },
];

export const getVehicle = (id?: string) => mockVehicles.find((v) => v.id === id);
export const getSession = (id?: string) => mockSessions.find((s) => s.id === id);
export const getSessionsForVehicle = (vehicleId?: string) => mockSessions.filter((s) => s.vehicleId === vehicleId);

// 1375 -> "1,375 kg"
export const formatKg = (kg: number) => `${String(Math.round(kg)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} kg`;
