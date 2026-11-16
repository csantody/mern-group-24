import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { AppScreen } from '../../../components/ui/AppScreen';
import { VehicleRow } from '../../../components/ui/VehicleRow';
import { Button } from '../../../components/ui/Button';
import { mockVehicles } from '../../../data/mock';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

// Not in Figma: reuses the Home garage list styling
export default function GarageScreen() {
  return (
    <AppScreen gap={24} edges={['top']}>
      <Text style={styles.heading}>Garage</Text>
      <View style={{ gap: 12 }}>
        {mockVehicles.map((v) => (
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
});
