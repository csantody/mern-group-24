import { Pressable, Text, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

// accent: light-blue 13px link (vehicle/previous session). plain: white 14px (live session screen).
export function BackLink({ label, onPress, variant = 'accent', height = 20 }: { label: string; onPress: () => void; variant?: 'accent' | 'plain'; height?: number }) {
  const plain = variant === 'plain';
  return (
    <Pressable onPress={onPress} hitSlop={10} style={[styles.row, { height }]}>
      <ArrowLeft size={plain ? 16 : 18} color={plain ? colors.white : colors.accent} strokeWidth={plain ? 2 : 1.7} />
      <Text style={plain ? styles.plain : styles.accent}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
  accent: { fontFamily: fonts.medium, fontSize: 13, color: colors.accent },
  plain: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
});
