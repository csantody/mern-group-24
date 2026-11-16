import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, ImagePlus } from 'lucide-react-native';
import { AppScreen, TextField, Button } from '@/components/ui';
import { getVehicle } from '@/mockData';
import { colors, fonts } from '@/theme';

// Figma: "Accelly add vehicle · Dark mobile"
// Also used for editing: /vehicle/new?id=v1 pre-fills the form.
export default function AddVehicleScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = getVehicle(id);

  const [name, setName] = useState(existing?.name ?? '');
  const [weightWithout, setWeightWithout] = useState(existing ? String(existing.weightWithoutDriver) : '');
  const [weightWith, setWeightWith] = useState(existing ? String(existing.weightWithDriver) : '');

  return (
    <AppScreen gap={16}>
      <Pressable onPress={() => router.back()} hitSlop={8} style={{ alignSelf: 'flex-start' }}>
        <Text style={styles.crumb}>← Home / Garage</Text>
      </Pressable>

      <Text style={styles.heading}>{existing ? 'Edit vehicle' : 'Add vehicle'}</Text>

      <View style={styles.formCard}>
        <TextField label="Vehicle name *" placeholder="e.g. Daily GTI" value={name} onChangeText={setName} />

        {/* TODO: expo-image-picker */}
        <Pressable style={styles.photo}>
          <View style={styles.photoIcon}>
            <ImagePlus size={22} color={colors.accent} strokeWidth={1.7} />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={styles.photoTitle}>Add a photo · Optional</Text>
            <Text style={styles.photoText}>JPG or PNG, up to 10 MB</Text>
          </View>
        </Pressable>

        <TextField
          label="Vehicle weight without driver *"
          unit="kg"
          placeholder="1375"
          keyboardType="numeric"
          value={weightWithout}
          onChangeText={setWeightWithout}
        />
        <TextField
          label="Vehicle weight with driver *"
          unit="kg"
          placeholder="1450"
          keyboardType="numeric"
          value={weightWith}
          onChangeText={setWeightWith}
        />
      </View>

      <View style={{ gap: 12 }}>
        {/* TODO: VehicleService.createVehicle() / updateVehicle() */}
        <Button label="Save vehicle" icon={<Check size={18} color={colors.white} strokeWidth={1.7} />} onPress={() => router.back()} />
        <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
        <Text style={styles.note}>Save to your garage. You can edit specs later.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  crumb: { fontFamily: fonts.medium, fontSize: 13, color: colors.accent },
  heading: { fontFamily: fonts.semibold, fontSize: 30, lineHeight: 36, color: colors.white },
  formCard: {
    gap: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.app.border,
    backgroundColor: colors.app.surface,
  },
  photo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.app.border,
  },
  photoIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.app.avatar, alignItems: 'center', justifyContent: 'center' },
  photoTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
  photoText: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 16, color: colors.app.textMuted },
  note: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.app.textMuted },
});
