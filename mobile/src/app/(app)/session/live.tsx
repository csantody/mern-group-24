import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppMark } from '../../../components/brand/AppMark';
import { BackLink } from '../../../components/ui/BackLink';
import { Button } from '../../../components/ui/Button';
import { MetricCard, MetricRow } from '../../../components/ui/MetricCard';
import { mockSessions } from '../../../data/mock';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

// Figma: "Accelly session · Dark mobile"
// LAYOUT ONLY: shows sample values. Recording gets wired in next (logic is in dev-recorder.tsx).
export default function LiveSessionScreen() {
  const s = mockSessions[0];
  const soft = colors.app.textSoft;

  return (
    <AppScreen showHeader={false} gap={10} contentStyle={{ paddingTop: 12, paddingBottom: 8 }}>
      <BackLink label="Back to vehicle" variant="plain" height={32} onPress={() => router.back()} />

      <View style={styles.header}>
        <View style={styles.identity}>
          <AppMark />
          <Text style={styles.title}>Session</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Preview</Text>
        </View>
      </View>

      <View style={styles.overview}>
        <View style={styles.runCard}>
          <View style={styles.runRange}>
            <Text style={styles.runLabel}>Current run</Text>
            <Text style={styles.runRangeValue}>0–100 km/h</Text>
          </View>
          <Text style={styles.runTime}>{s.zeroToHundredS.toFixed(1)} s</Text>
          <View style={styles.runMetrics}>
            <View style={styles.runMetric}>
              <Text style={styles.runMetricLabel}>Peak g</Text>
              <Text style={styles.runMetricValue}>{s.peakG.toFixed(2)} g</Text>
            </View>
            <View style={styles.runMetric}>
              <Text style={styles.runMetricLabel}>Avg g</Text>
              <Text style={styles.runMetricValue}>{s.avgG.toFixed(2)} g</Text>
            </View>
          </View>
        </View>

        <MetricRow>
          <MetricCard label="Rolling average" value={`${s.avgG.toFixed(2)} g`} labelColor={soft} />
          <MetricCard label="Best run" value={`${s.zeroToHundredS.toFixed(1)} s`} labelColor={soft} />
        </MetricRow>
        <MetricRow>
          <MetricCard label="Estimated HP" value={`${s.powerHp} hp`} labelColor={soft} />
          <MetricCard label="Estimated Torque" value={`${s.torqueLbFt} lb-ft`} labelColor={soft} />
        </MetricRow>
        <MetricRow>
          <MetricCard label="Top speed" value={`${s.topSpeedKmh} km/h`} labelColor={soft} />
          <MetricCard label="Distance" value={`${s.distanceM} m`} labelColor={soft} />
        </MetricRow>
      </View>

      <View style={styles.action}>
        <Button label="Start session" size="lg" />
        <Text style={styles.disclosure}>Illustrative preview · Sample data</Text>
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
