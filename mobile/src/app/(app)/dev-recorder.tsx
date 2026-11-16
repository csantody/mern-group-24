import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { SensorReading } from '../../types/sensor';
import { computeStats } from '../../utils/sessionStats';
import AccelGraph, { AXIS_COLORS } from '../../components/AccelGraph';

// Accelerometer prototype (moved here from the old src/app/index.tsx).
// Reached from Settings -> "Sensor test (dev)". Its logic gets moved into session/live.tsx next.
export default function DevRecorderScreen() {
  const { width } = useWindowDimensions();
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [recording, setRecording] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);
  const [lastSession, setLastSession] = useState<SensorReading[] | null>(null);

  // Refs: the listener always sees current values, and pushing samples doesn't re-render
  const samplesRef = useRef<SensorReading[]>([]);
  const recordingRef = useRef(false);

  useEffect(() => {
    Accelerometer.setUpdateInterval(20); // 20 ms = 50 Hz
    const sub = Accelerometer.addListener((r) => {
      setData(r);
      if (recordingRef.current) {
        samplesRef.current.push({ timestamp: Date.now(), x: r.x, y: r.y, z: r.z });
        setSampleCount(samplesRef.current.length);
      }
    });
    return () => sub.remove();
  }, []);

  const startRecording = () => {
    samplesRef.current = [];
    setSampleCount(0);
    setLastSession(null);
    recordingRef.current = true;
    setRecording(true);
  };

  const stopRecording = () => {
    recordingRef.current = false;
    setRecording(false);
    setLastSession([...samplesRef.current]);
  };

  const stats = lastSession && lastSession.length > 1 ? computeStats(lastSession) : null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Accelerometer (g)</Text>
      <Text style={[styles.value, { color: AXIS_COLORS.x }]}>X: {data.x.toFixed(3)}</Text>
      <Text style={[styles.value, { color: AXIS_COLORS.y }]}>Y: {data.y.toFixed(3)}</Text>
      <Text style={[styles.value, { color: AXIS_COLORS.z }]}>Z: {data.z.toFixed(3)}</Text>

      <Pressable
        style={[styles.button, recording && styles.buttonStop]}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>{recording ? 'Stop' : 'Start Recording'}</Text>
      </Pressable>

      {recording && <Text style={styles.small}>Recording… {sampleCount} samples</Text>}

      {lastSession && stats && (
        <View style={styles.summary}>
          <Text style={styles.label}>Last session</Text>
          <AccelGraph samples={lastSession} width={width - 32} height={200} />
          <Text style={styles.small}>
            {lastSession.length} samples · {stats.durationS.toFixed(2)} s · {stats.rateHz.toFixed(1)} Hz
          </Text>
          {(['x', 'y', 'z'] as const).map((axis) => (
            <Text key={axis} style={[styles.small, { color: AXIS_COLORS[axis] }]}>
              {axis.toUpperCase()}: peak {stats[axis].peak.toFixed(3)} g · avg {stats[axis].average.toFixed(3)} g
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#0b1426' },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16, paddingTop: 64 },
  title: { color: '#fff', fontSize: 22, marginBottom: 16 },
  value: { fontSize: 28, fontFamily: 'monospace' },
  button: { marginTop: 32, backgroundColor: '#1f6feb', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10 },
  buttonStop: { backgroundColor: '#d1342f' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  summary: { marginTop: 24, alignItems: 'center' },
  label: { color: '#fff', fontSize: 18, marginBottom: 10 },
  small: { color: '#9fb3c8', fontSize: 15, marginTop: 6 },
});
