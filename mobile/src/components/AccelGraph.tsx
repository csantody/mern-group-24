import Svg, { Polyline, Line } from 'react-native-svg';
import { SensorReading } from '../types/sensor';

type Props = { samples: SensorReading[]; width: number; height: number };

export const AXIS_COLORS = { x: '#ff6b6b', y: '#51cf66', z: '#4da3ff' };

export default function AccelGraph({ samples, width, height }: Props) {
  if (samples.length < 2) return null;

  const t0 = samples[0].timestamp;
  const tSpan = samples[samples.length - 1].timestamp - t0;

  // Fit the vertical scale to the data, with a little padding
  let min = Infinity;
  let max = -Infinity;
  for (const s of samples) {
    min = Math.min(min, s.x, s.y, s.z);
    max = Math.max(max, s.x, s.y, s.z);
  }
  const pad = Math.max((max - min) * 0.1, 0.05);
  min -= pad;
  max += pad;

  const toX = (t: number) => ((t - t0) / tSpan) * width;
  const toY = (v: number) => height - ((v - min) / (max - min)) * height;

  const points = (axis: 'x' | 'y' | 'z') =>
    samples.map((s) => `${toX(s.timestamp).toFixed(1)},${toY(s[axis]).toFixed(1)}`).join(' ');

  return (
    <Svg width={width} height={height} style={{ backgroundColor: '#111d33', borderRadius: 8 }}>
      {min < 0 && max > 0 && (
        <Line x1={0} y1={toY(0)} x2={width} y2={toY(0)} stroke="#3a4a66" strokeDasharray="4 4" />
      )}
      {(['x', 'y', 'z'] as const).map((axis) => (
        <Polyline key={axis} points={points(axis)} fill="none" stroke={AXIS_COLORS[axis]} strokeWidth={1.5} />
      ))}
    </Svg>
  );
}