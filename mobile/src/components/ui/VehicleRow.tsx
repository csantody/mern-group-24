import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CarFront, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

// Figma: "Vehicle row" (Home)
export function VehicleRow({ name, onPress }: { name: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      <View style={styles.symbol}>
        <CarFront size={22} color={colors.accent} strokeWidth={1.7} />
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <View style={styles.open}>
        <ChevronRight size={16} color={colors.white} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.app.border,
    backgroundColor: colors.app.surface,
  },
  symbol: { width: 38, height: 38, borderRadius: 10, backgroundColor: colors.app.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  open: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.app.border,
    backgroundColor: colors.app.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
