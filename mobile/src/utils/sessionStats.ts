import { SensorReading } from '../types/sensor';

type AxisStats = { peak: number; average: number };
export type SessionStats = { x: AxisStats; y: AxisStats; z: AxisStats; durationS: number; rateHz: number };

function axisStats(values: number[]): AxisStats {
  let peak = 0;
  let sum = 0;
  for (const v of values) {
    if (Math.abs(v) > Math.abs(peak)) peak = v; // keeps the sign, so you can tell braking from accelerating
    sum += v;
  }
  return { peak, average: sum / values.length };
}

export function computeStats(samples: SensorReading[]): SessionStats {
  const durationS = (samples[samples.length - 1].timestamp - samples[0].timestamp) / 1000;
  return {
    x: axisStats(samples.map((s) => s.x)),
    y: axisStats(samples.map((s) => s.y)),
    z: axisStats(samples.map((s) => s.z)),
    durationS,
    rateHz: samples.length / durationS,
  };
}