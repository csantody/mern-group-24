import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { SessionSummary } from '../../data/mock';

// Figma: "Recent session" (Vehicle detail)
export function SessionRow({ session, title, onPress }: { session: SessionSummary; title?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      <View style={styles.summary}>
        <Text style={styles.date} numberOfLines={1}>{title ?? session.dateLabel}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {session.powerHp} hp · {session.torqueLbFt} lb-ft
        </Text>
      </View>
      <View style={styles.result}>
        <Text style={styles.time}>{session.zeroToHundredS.toFixed(1)} s</Text>
        <Text style={styles.range}>0–100 km/h</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.app.border,
    backgroundColor: colors.app.surface,
  },
  summary: { flex: 1, gap: 7 },
  date: { fontFamily: fonts.semibold, fontSize: 13, color: colors.white },
  sub: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.app.textMuted },
  result: { alignItems: 'flex-end', gap: 3 },
  time: { fontFamily: fonts.semibold, fontSize: 21, lineHeight: 25, color: colors.white },
  range: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 14, color: colors.app.textMuted },
});
