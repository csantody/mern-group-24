import { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg'; // md = 48px / 14pt, lg = 56px / 16pt
  radius?: number;
  icon?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', size = 'md', radius, icon, disabled, style }: Props) {
  const lg = size === 'lg';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        { height: lg ? 56 : 48, borderRadius: radius ?? (lg ? 16 : 12), opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {icon}
      <Text style={[styles.label, { fontSize: lg ? 16 : 14 }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 18 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.app.surfaceRaised, borderWidth: 1, borderColor: colors.app.border },
  label: { fontFamily: fonts.semibold, color: colors.white },
});
