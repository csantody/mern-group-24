import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { AppScreen } from '../../../components/ui/AppScreen';
import { VehicleRow } from '../../../components/ui/VehicleRow';
import { Button } from '../../../components/ui/Button';
import { mockUser, mockVehicles } from '../../../data/mock';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

// Figma: "Accelly home · Dark mobile"
export default function HomeScreen() {
  const vehicles = mockVehicles; // TODO: VehicleService.getVehicles()

  return (
    <AppScreen gap={24} edges={['top']}>
      <View style={{ gap: 8 }}>
        <Text style={styles.heading}>Welcome back, {mockUser.name}</Text>
        <Text style={styles.description}>Open a vehicle to view its weights and start a session.</Text>
      </View>

      <View style={styles.garageHeading}>
        <Text style={styles.sectionTitle}>Your garage</Text>
        <Text style={styles.description}>
          {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {vehicles.map((v) => (
          <VehicleRow key={v.id} name={v.name} onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: v.id } })} />
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
});
