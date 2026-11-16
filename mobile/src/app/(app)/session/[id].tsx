import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppScreen } from '../../../components/ui/AppScreen';
import { BackLink } from '../../../components/ui/BackLink';
import { SpeedChart } from '../../../components/ui/SpeedChart';
import { getSession, getVehicle, formatKg } from '../../../data/mock';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

// Figma: "Accelly previous session · Dark mobile"
export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = getSession(id); // TODO: SessionService.getSession()
  const vehicle = getVehicle(s?.vehicleId);

  if (!s) {
    return (
      <AppScreen>
        <BackLink label="Back to vehicle" height={44} onPress={() => router.back()} />
        <Text style={styles.note}>Session not found.</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={{ gap: 14 }}>
        <BackLink label="Back to vehicle" height={44} onPress={() => router.back()} />
        <View style={{ gap: 6 }}>
          <Text style={styles.title}>Session overview</Text>
          <View style={styles.meta}>
            <Text style={styles.metaVehicle}>{vehicle?.name ?? 'Vehicle'}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaDate}>{s.dateLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={{ gap: 5 }}>
            <Text style={styles.chartTitle}>Acceleration</Text>
            <Text style={styles.chartSub}>Speed over time</Text>
          </View>
          <View style={{ gap: 2, alignItems: 'flex-end' }}>
            <Text style={styles.best}>{s.zeroToHundredS.toFixed(1)} s</Text>
            <Text style={styles.bestSub}>Best run · 0–100 km/h</Text>
          </View>
        </View>

        <SpeedChart points={s.speedTrace} />

        <View style={styles.accelStats}>
          <AccelStat label="0–100 km/h" value={`${s.zeroToHundredS.toFixed(1)} s`} />
          <AccelStat label="Peak g" value={`${s.peakG.toFixed(2)} g`} />
          <AccelStat label="Rolling avg" value={`${s.avgG.toFixed(2)} g`} />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Run statistics</Text>
        <View style={styles.row}>
          <StatCard label="Estimated wheel power" value={`${s.powerHp} hp`} />
          <StatCard label="Estimated torque" value={`${s.torqueLbFt} lb-ft`} />
        </View>
        <View style={styles.row}>
          <StatCard label="Top speed" value={`${s.topSpeedKmh} km/h`} />
          <StatCard label="Distance" value={`${s.distanceM} m`} />
        </View>
      </View>

      {vehicle && (
        <View style={{ gap: 12 }}>
          <View style={styles.setupHeader}>
            <Text style={styles.setupTitle}>Vehicle setup</Text>
            <Text style={styles.setupVehicle}>{vehicle.name}</Text>
          </View>
          <View style={[styles.row, { gap: 24 }]}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.weightLabel}>With driver</Text>
              <Text style={styles.weightValue}>{formatKg(vehicle.weightWithDriver)}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.weightLabel}>Without driver</Text>
              <Text style={styles.weightValue}>{formatKg(vehicle.weightWithoutDriver)}</Text>
            </View>
          </View>
          <Text style={styles.note}>Illustrative session · Sample results, not dyno measurements.</Text>
        </View>
      )}
    </AppScreen>
  );
}

function AccelStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.accelStat}>
      <Text style={styles.accelLabel}>{label}</Text>
      <Text style={styles.accelValue}>{value}</Text>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 36, color: colors.white },
  meta: { flexDirection: 'row', gap: 8 },
  metaVehicle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.accent },
  metaDot: { fontFamily: fonts.regular, fontSize: 13, color: colors.accent },
  metaDate: { fontFamily: fonts.regular, fontSize: 13, color: colors.app.textMuted },

  chartCard: { gap: 18, paddingHorizontal: 18, paddingVertical: 20, borderRadius: 20, backgroundColor: colors.app.chartBg },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chartTitle: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 22, color: colors.white },
  chartSub: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 14, color: colors.accent },
  best: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 35, color: colors.white },
  bestSub: { fontFamily: fonts.regular, fontSize: 10, lineHeight: 13, color: colors.accent },
  accelStats: { flexDirection: 'row', gap: 10 },
  accelStat: { flex: 1, gap: 5, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(166,224,250,0.2)' },
  accelLabel: { fontFamily: fonts.regular, fontSize: 10, lineHeight: 13, color: colors.accent },
  accelValue: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 25, color: colors.white },

  sectionTitle: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 23, color: colors.white },
  row: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.app.statBorder,
    backgroundColor: colors.app.statCard,
  },
  statLabel: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 14, color: colors.app.textMuted },
  statValue: { fontFamily: fonts.semibold, fontSize: 22, lineHeight: 29, color: colors.white },

  setupHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  setupTitle: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 21, color: colors.white },
  setupVehicle: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 17, color: colors.accent },
  weightLabel: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.app.textMuted },
  weightValue: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 21, color: colors.white },
  note: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 14, color: colors.app.textMuted },
});
