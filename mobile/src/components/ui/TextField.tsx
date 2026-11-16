import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

// Figma: "Form field" (Add vehicle screen)
export function TextField({ label, unit, ...inputProps }: { label: string; unit?: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <TextInput style={styles.text} placeholderTextColor={colors.app.textMuted} {...inputProps} />
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8, width: '100%' },
  label: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 17, color: colors.white },
  input: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.app.border,
    backgroundColor: colors.app.surfaceRaised,
  },
  text: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.white, paddingVertical: 12 },
  unit: { fontFamily: fonts.regular, fontSize: 12, color: colors.app.textMuted },
});
