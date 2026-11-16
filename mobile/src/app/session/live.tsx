import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import { AppScreen, AppMark, BackLink, Button, MetricCard, MetricRow } from '@/components/ui';
import { colors, fonts } from '@/theme';
import { SensorReading } from '@/api';

// Figma: "Accelly session · Dark mobile"
export default function LiveSessionScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();

  const [recording, setRecording] = useState(false);
  const [elapsedS, setElapsedS] = useState(0);
  const [peakG, setPeakG] = useState(0);
  const [avgG, setAvgG] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);

  const samplesRef = useRef<SensorReading[]>([]);
  const recordingRef = useRef(false);
  const startTimeRef = useRef(0);
  const peakRef = useRef(0);
  const sumRef = useRef(0);
  const soft = colors.app.textSoft;

  useEffect(() => {
    Accelerometer.setUpdateInterval(20); // 50 Hz
    const sub = Accelerometer.addListener((r) => {
      if (!recordingRef.current) return;

      const now = Date.now();
      samplesRef.current.push({ timestamp: now, x: r.x, y: r.y, z: r.z });

      // Horizontal acceleration, assuming the phone is lying flat (Z = gravity).
      // Proper orientation calibration comes later.
      const g = Math.sqrt(r.x * r.x + r.y * r.y);
      if (g > peakRef.current) peakRef.current = g;
      sumRef.current += g;

      const n = samplesRef.current.length;
      setPeakG(peakRef.current);
      setAvgG(sumRef.current / n);
      setSampleCount(n);
      setElapsedS((now - startTimeRef.current) / 1000);
    });
    return () => sub.remove();
  }, []);

  const startRecording = () => {
    samplesRef.current = [];
    peakRef.current = 0;
    sumRef.current = 0;
    setPeakG(0);
    setAvgG(0);
    setSampleCount(0);
    setElapsedS(0);
    startTimeRef.current = Date.now();
    recordingRef.current = true;
    setRecording(true);
  };

  const stopRecording = () => {
    recordingRef.current = false;
    setRecording(false);
    // TODO: SessionService.saveSession(vehicleId, samplesRef.current)
    console.log(`Recorded ${samplesRef.current.length} samples for vehicle ${vehicleId}`);
  };

  return (
    <AppScreen showHeader={false} gap={10} contentStyle={{ paddingTop: 12, paddingBottom: 8 }}>
      <BackLink label="Back to vehicle" variant="plain" height={32} onPress={() => router.back()} />

      <View style={styles.header}>
        <View style={styles.identity}>
          <AppMark />
          <Text style={styles.title}>Session</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{recording ? 'Recording' : 'Ready'}</Text>
        </View>
      </View>

      <View style={styles.overview}>
        <View style={styles.runCard}>
          <View style={styles.runRange}>
            <Text style={styles.runLabel}>Current run</Text>
            <Text style={styles.runRangeValue}>{sampleCount} samples</Text>
          </View>
          <Text style={styles.runTime}>{elapsedS.toFixed(1)} s</Text>
          <View style={styles.runMetrics}>
            <View style={styles.runMetric}>
              <Text style={styles.runMetricLabel}>Peak g</Text>
              <Text style={styles.runMetricValue}>{peakG.toFixed(2)} g</Text>
            </View>
            <View style={styles.runMetric}>
              <Text style={styles.runMetricLabel}>Avg g</Text>
              <Text style={styles.runMetricValue}>{avgG.toFixed(2)} g</Text>
            </View>
          </View>
        </View>

        <MetricRow>
          <MetricCard label="Rolling average" value={`${avgG.toFixed(2)} g`} labelColor={soft} />
          <MetricCard label="Best run" value="—" labelColor={soft} />
        </MetricRow>
        <MetricRow>
          <MetricCard label="Estimated HP" value="—" labelColor={soft} />
          <MetricCard label="Estimated Torque" value="—" labelColor={soft} />
        </MetricRow>
        <MetricRow>
          <MetricCard label="Top speed" value="—" labelColor={soft} />
          <MetricCard label="Distance" value="—" labelColor={soft} />
        </MetricRow>
      </View>

      <View style={styles.action}>
        <Button
          label={recording ? 'Stop session' : 'Start session'}
          size="lg"
          onPress={recording ? stopRecording : startRecording}
          style={recording ? { backgroundColor: '#D1342F' } : undefined}
        />
        <Text style={styles.disclosure}>Phone flat · Horizontal acceleration only</Text>
      </View>
    </AppScreen>
  );
}

const white80 = 'rgba(255,255,255,0.8)';

const styles = StyleSheet.create({
  header: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontFamily: fonts.semibold, fontSize: 20, color: colors.white },
  badge: { backgroundColor: colors.app.badge, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  badgeText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.accent },
  overview: { gap: 12, paddingTop: 20 },
  runCard: { height: 228, gap: 16, paddingHorizontal: 22, paddingVertical: 16, borderRadius: 26, backgroundColor: colors.primary },
  runRange: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  runLabel: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 18, color: white80 },
  runRangeValue: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.white },
  runTime: { fontFamily: fonts.semibold, fontSize: 64, lineHeight: 72, color: colors.white },
  runMetrics: { flexDirection: 'row', gap: 12 },
  runMetric: { flex: 1, height: 74, gap: 5, padding: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)' },
  runMetricLabel: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 16, color: white80 },
  runMetricValue: { fontFamily: fonts.semibold, fontSize: 22, lineHeight: 27, color: colors.white },
  action: { gap: 12, paddingTop: 16 },
  disclosure: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.app.textSoft, textAlign: 'center' },
});
