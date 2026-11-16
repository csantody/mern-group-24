// Shared UI pieces used across screens (styled from the Accelly Figma file).
import { ReactNode } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable, ScrollView, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { ArrowLeft, CarFront, ChevronRight } from 'lucide-react-native';
import { APP_MARK_XML, RIM_ICON_XML } from '@/logo';
import { colors, fonts } from '@/theme';
import { getUser } from '@/api';
//import { SessionSummary } from '@/mockData';

// ------------------------------------------------------------
// AppMark
// ------------------------------------------------------------
// Round 40px mark used in the app header
export function AppMark({ size = 40 }: { size?: number }) {
  return <SvgXml xml={APP_MARK_XML} width={size} height={size} />;
}

// Square 48px logo used on the login/register screens
export function AuthLogo() {
  return (
    <View style={appMarkStyles.authLogo}>
      <SvgXml xml={RIM_ICON_XML} width={24} height={24} />
    </View>
  );
}

const appMarkStyles = StyleSheet.create({
  authLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ------------------------------------------------------------
// AppHeader
// ------------------------------------------------------------
// Figma: "App navigation" (brand on the left, profile initials on the right)
export function AppHeader({ initials, onProfilePress }: { initials: string; onProfilePress?: () => void }) {
  return (
    <View style={appHeaderStyles.bar}>
      <View style={appHeaderStyles.brand}>
        <AppMark />
        <Text style={appHeaderStyles.brandName}>Accelly</Text>
      </View>
      <Pressable style={appHeaderStyles.profile} onPress={onProfilePress} hitSlop={6}>
        <Text style={appHeaderStyles.initials}>{initials}</Text>
      </Pressable>
    </View>
  );
}

const appHeaderStyles = StyleSheet.create({
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

// ------------------------------------------------------------
// AppScreen
// ------------------------------------------------------------
type AppScreenProps = {
  children: ReactNode;
  showHeader?: boolean;
  gap?: number;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Edge[]; // tab screens leave 'bottom' to the tab bar
};

// Standard signed-in screen: safe area + optional app header + scrolling content
export function AppScreen({ children, showHeader = true, gap = 20, contentStyle, edges = ['top', 'bottom'] }: AppScreenProps) {
  const user = getUser();
  const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase() : '';
  return (
    <SafeAreaView style={appScreenStyles.safe} edges={edges}>
      {showHeader && <AppHeader initials={initials} />}
      <ScrollView contentContainerStyle={[appScreenStyles.content, { gap }, contentStyle]} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const appScreenStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.app.bg },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 28 },
});

// ------------------------------------------------------------
// BackLink
// ------------------------------------------------------------
// accent: light-blue 13px link (vehicle/previous session). plain: white 14px (live session screen).
export function BackLink({ label, onPress, variant = 'accent', height = 20 }: { label: string; onPress: () => void; variant?: 'accent' | 'plain'; height?: number }) {
  const plain = variant === 'plain';
  return (
    <Pressable onPress={onPress} hitSlop={10} style={[backLinkStyles.row, { height }]}>
      <ArrowLeft size={plain ? 16 : 18} color={plain ? colors.white : colors.accent} strokeWidth={plain ? 2 : 1.7} />
      <Text style={plain ? backLinkStyles.plain : backLinkStyles.accent}>{label}</Text>
    </Pressable>
  );
}

const backLinkStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
  accent: { fontFamily: fonts.medium, fontSize: 13, color: colors.accent },
  plain: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
});

// ------------------------------------------------------------
// Button
// ------------------------------------------------------------
type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg'; // md = 48px / 14pt, lg = 56px / 16pt
  radius?: number;
  icon?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', size = 'md', radius, icon, disabled, style }: ButtonProps) {
  const lg = size === 'lg';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        buttonStyles.base,
        variant === 'primary' ? buttonStyles.primary : buttonStyles.secondary,
        { height: lg ? 56 : 48, borderRadius: radius ?? (lg ? 16 : 12), opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {icon}
      <Text style={[buttonStyles.label, { fontSize: lg ? 16 : 14 }]}>{label}</Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  base: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 18 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.app.surfaceRaised, borderWidth: 1, borderColor: colors.app.border },
  label: { fontFamily: fonts.semibold, color: colors.white },
});

// ------------------------------------------------------------
// TextField
// ------------------------------------------------------------
// Figma: "Form field" (Add vehicle screen)
export function TextField({ label, unit, ...inputProps }: { label: string; unit?: string } & TextInputProps) {
  return (
    <View style={textFieldStyles.field}>
      <Text style={textFieldStyles.label}>{label}</Text>
      <View style={textFieldStyles.input}>
        <TextInput style={textFieldStyles.text} placeholderTextColor={colors.app.textMuted} {...inputProps} />
        {unit && <Text style={textFieldStyles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

const textFieldStyles = StyleSheet.create({
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

// ------------------------------------------------------------
// MetricCard
// ------------------------------------------------------------
// Figma: "Vehicle weight" / "Performance metric" (88px label + value card)
export function MetricCard({ label, value, labelColor = colors.app.textMuted }: { label: string; value: string; labelColor?: string }) {
  return (
    <View style={metricCardStyles.card}>
      <Text style={[metricCardStyles.label, { color: labelColor }]}>{label}</Text>
      <Text style={metricCardStyles.value}>{value}</Text>
    </View>
  );
}

// Two cards side by side
export function MetricRow({ children }: { children: ReactNode }) {
  return <View style={metricCardStyles.row}>{children}</View>;
}

const metricCardStyles = StyleSheet.create({
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

// ------------------------------------------------------------
// VehicleRow
// ------------------------------------------------------------
// Figma: "Vehicle row" (Home)
export function VehicleRow({ name, onPress }: { name: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [vehicleRowStyles.row, pressed && { opacity: 0.85 }]}>
      <View style={vehicleRowStyles.symbol}>
        <CarFront size={22} color={colors.accent} strokeWidth={1.7} />
      </View>
      <Text style={vehicleRowStyles.name} numberOfLines={1}>{name}</Text>
      <View style={vehicleRowStyles.open}>
        <ChevronRight size={16} color={colors.white} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const vehicleRowStyles = StyleSheet.create({
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

// ------------------------------------------------------------
// SessionRow
// ------------------------------------------------------------
// Figma: "Recent session" (Vehicle detail)
type SessionRowProps = { title: string; subtitle: string; value: string; valueLabel: string; onPress: () => void };

export function SessionRow({ title, subtitle, value, valueLabel, onPress }: SessionRowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [sessionRowStyles.row, pressed && { opacity: 0.85 }]}>
      <View style={sessionRowStyles.summary}>
        <Text style={sessionRowStyles.date} numberOfLines={1}>{title}</Text>
        <Text style={sessionRowStyles.sub} numberOfLines={1}>{subtitle}</Text>
      </View>
      <View style={sessionRowStyles.result}>
        <Text style={sessionRowStyles.time}>{value}</Text>
        <Text style={sessionRowStyles.range}>{valueLabel}</Text>
      </View>
    </Pressable>
  );
}

const sessionRowStyles = StyleSheet.create({
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
