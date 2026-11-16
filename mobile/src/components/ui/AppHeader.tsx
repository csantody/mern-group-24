import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AppMark } from '../brand/AppMark';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

// Figma: "App navigation" (brand on the left, profile initials on the right)
export function AppHeader({ initials, onProfilePress }: { initials: string; onProfilePress?: () => void }) {
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <AppMark />
        <Text style={styles.brandName}>Accelly</Text>
      </View>
      <Pressable style={styles.profile} onPress={onProfilePress} hitSlop={6}>
        <Text style={styles.initials}>{initials}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 72,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.app.border,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { fontFamily: fonts.semibold, fontSize: 20, color: colors.white },
  profile: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.app.avatar,
    borderWidth: 1,
    borderColor: colors.app.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: fonts.semibold, fontSize: 13, color: colors.white },
});
