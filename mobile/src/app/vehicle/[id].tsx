import { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { CarFront } from 'lucide-react-native';
import { AppScreen, BackLink, Button, MetricCard, MetricRow, SessionRow } from '@/components/ui';
import { getVehicle, VehicleDoc, formatSessionDate } from '@/api';
import { formatKg } from '@/mockData';
import { colors, fonts } from '@/theme';

// Figma: "Accelly vehicle detail · Dark mobile"
export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doc, setDoc] = useState<VehicleDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Reload whenever this screen comes into view (after editing, or after recording a session)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getVehicle(id)
        .then((d) => {
          if (active) setDoc(d);
        })
        .catch((e) => {
          if (active) setError(e instanceof Error ? e.message : 'Could not load vehicle');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [id]),
  );

  if (loading) {
    return (
      <AppScreen>
        <ActivityIndicator color={colors.accent} />
      </AppScreen>
    );
  }

  if (!doc) {
    return (
      <AppScreen>
        <BackLink label="Back to garage" onPress={() => router.back()} />
        <Text style={styles.empty}>{error || 'Vehicle not found.'}</Text>
      </AppScreen>
    );
  }

  const vehicle = doc.vehicle;
  const sessions = [...doc.sessions].reverse(); // newest first

  return (
    <AppScreen>
      <BackLink label="Back to garage" onPress={() => router.back()} />

      <View style={styles.identity}>
        <View style={styles.thumb}>
          <CarFront size={32} color={colors.accent} strokeWidth={1.7} />
        </View>
        <View style={{ flex: 1, gap: 7 }}>
          <Text style={styles.name} numberOfLines={1}>{vehicle.name}</Text>
          <Pressable onPress={() => router.push({ pathname: '/vehicle/new', params: { id: doc._id } })} hitSlop={8}>
            <Text style={styles.edit}>Edit vehicle</Text>
          </Pressable>
        </View>
      </View>

      <MetricRow>
        <MetricCard label="Without driver" value={formatKg(vehicle.weightWithoutDriver)} />
        <MetricCard label="With driver" value={formatKg(vehicle.weightWithDriver)} />
      </MetricRow>

      <Button label="Start session" size="lg" onPress={() => router.push({ pathname: '/session/live', params: { vehicleId: doc._id } })} />

      <View style={styles.recent}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Recent sessions</Text>
        </View>
        <View style={{ gap: 10 }}>
            {sessions.map((s) => (
            <SessionRow
              key={s.id}
              title={formatSessionDate(s.startedAt)}
              subtitle={`Peak ${s.peakG.toFixed(2)} g · Avg ${s.avgG.toFixed(2)} g`}
              value={`${s.durationS.toFixed(1)} s`}
              valueLabel="duration"
              onPress={() => router.push({ pathname: '/session/[id]', params: { id: s.id, vehicleId: doc._id } })}
            />
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
