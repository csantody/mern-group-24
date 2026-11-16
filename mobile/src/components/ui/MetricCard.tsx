import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

// Figma: "Vehicle weight" / "Performance metric" (88px label + value card)
export function MetricCard({ label, value, labelColor = colors.app.textMuted }: { label: string; value: string; labelColor?: string }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

// Two cards side by side
export function MetricRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, width: '100%' },
  card: {
    flex: 1,
    height: 88,
    justifyContent: 'center',
    gap: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.app.border,
    backgroundColor: colors.app.surface,
  },
  label: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 16 },
  value: { fontFamily: fonts.semibold, fontSize: 21, lineHeight: 25, color: colors.white },
});
