import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CarFront } from 'lucide-react-native';
import { AppScreen } from '../../../components/ui/AppScreen';
import { BackLink } from '../../../components/ui/BackLink';
import { Button } from '../../../components/ui/Button';
import { MetricCard, MetricRow } from '../../../components/ui/MetricCard';
import { SessionRow } from '../../../components/ui/SessionRow';
import { getVehicle, getSessionsForVehicle, formatKg } from '../../../data/mock';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

// Figma: "Accelly vehicle detail · Dark mobile"
export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = getVehicle(id); // TODO: VehicleService
  const sessions = getSessionsForVehicle(id); // TODO: SessionService.getSessions()

  if (!vehicle) {
    return (
      <AppScreen>
        <BackLink label="Back to garage" onPress={() => router.back()} />
        <Text style={styles.empty}>Vehicle not found.</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <BackLink label="Back to garage" onPress={() => router.back()} />

      <View style={styles.identity}>
        <View style={styles.thumb}>
          <CarFront size={32} color={colors.accent} strokeWidth={1.7} />
        </View>
        <View style={{ flex: 1, gap: 7 }}>
          <Text style={styles.name} numberOfLines={1}>{vehicle.name}</Text>
          <Pressable onPress={() => router.push({ pathname: '/vehicle/new', params: { id: vehicle.id } })} hitSlop={8}>
            <Text style={styles.edit}>Edit vehicle</Text>
          </Pressable>
        </View>
      </View>

      <MetricRow>
        <MetricCard label="Without driver" value={formatKg(vehicle.weightWithoutDriver)} />
        <MetricCard label="With driver" value={formatKg(vehicle.weightWithDriver)} />
      </MetricRow>

      <Button label="Start session" size="lg" onPress={() => router.push({ pathname: '/session/live', params: { vehicleId: vehicle.id } })} />

      <View style={styles.recent}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Recent sessions</Text>
          <Text style={styles.sample}>Sample data</Text>
        </View>
        <View style={{ gap: 10 }}>
          {sessions.map((s) => (
            <SessionRow key={s.id} session={s} onPress={() => router.push({ pathname: '/session/[id]', params: { id: s.id } })} />
          ))}
          {sessions.length === 0 && <Text style={styles.empty}>No sessions yet.</Text>}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  thumb: { width: 64, height: 64, borderRadius: 16, backgroundColor: colors.app.avatar, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, color: colors.white },
  edit: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.accent },
  recent: { gap: 12, paddingTop: 8 },
  sectionHeading: { height: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 24, color: colors.white },
  sample: { fontFamily: fonts.regular, fontSize: 11, color: colors.app.textMuted },
  empty: { fontFamily: fonts.regular, fontSize: 13, color: colors.app.textMuted },
});
