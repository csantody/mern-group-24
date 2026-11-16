import { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { AppScreen, VehicleRow, Button } from '@/components/ui';
//import { mockVehicles } from '@/mockData';

import { getUser, getVehicles, VehicleDoc } from '@/api';
import { colors, fonts } from '@/theme';

// Figma: "Accelly home · Dark mobile"
export default function HomeScreen() {
  const user = getUser();
  const [vehicles, setVehicles] = useState<VehicleDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Runs every time Home comes into view, so a car you just added shows up when you come back
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      let active = true; // becomes false if you leave the screen before the request finishes
      setError('');
      getVehicles(user.id)
        .then((docs) => {
          if (active) setVehicles(docs);
        })
        .catch((e) => {
          if (active) setError(e instanceof Error ? e.message : 'Could not load vehicles');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [user?.id]),
  );
  

  return (
    <AppScreen gap={24} edges={['top']}>
      <View style={{ gap: 8 }}>
        <Text style={styles.heading}>Welcome back{user ? `, ${user.firstName}` : ''}</Text>
        <Text style={styles.description}>Open a vehicle to view its weights and start a session.</Text>
      </View>

      <View style={styles.garageHeading}>
        <Text style={styles.sectionTitle}>Your garage</Text>
        {!loading &&(
          <Text style={styles.description}>
            {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
          </Text>
        )}
        
      </View>

      <View style={{ gap: 12 }}>
        {loading && <ActivityIndicator color={colors.accent} />}
        {!!error && <Text style={styles.error}>{error}</Text>}
        {!loading && !error && vehicles.length === 0 && (
          <Text style={styles.description}>No vehicles yet. Add your first one below.</Text>
        )}

        {vehicles.map((doc) => (
          <VehicleRow
            key={doc._id}
            name={doc.vehicle.name}
            onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: doc._id } })}
          />
        ))}
        <Button
          label="Add vehicle"
          variant="secondary"
          icon={<Plus size={18} color={colors.white} strokeWidth={1.7} />}
          onPress={() => router.push('/vehicle/new')}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, color: colors.white },
  description: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.app.textMuted },
  garageHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { flex: 1, fontFamily: fonts.semibold, fontSize: 22, lineHeight: 26, color: colors.white },
  error: { fontFamily: fonts.medium, fontSize: 14, color: '#FF8A80' },
});
