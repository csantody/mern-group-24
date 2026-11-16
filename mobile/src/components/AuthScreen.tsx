import { ReactNode, useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { AuthLogo } from '@/components/ui';
import { colors, fonts } from '@/theme';

type Props = {
  heroTitle: string;
  heroText: string;
  cardTitle: string;
  cardText: string;
  submitLabel: string;
  footerLink: string;
  onFooterLink: () => void;
  children: ReactNode; // the form fields
  error?: string;
  loading?: boolean;
  onSubmit: (remember: boolean) => void;
};

// Shared layout for Login and Register
export function AuthScreen(p: Props) {
  const [remember, setRemember] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <AuthLogo />
            <Text style={styles.brand}>Accelly</Text>
          </View>

          <View style={styles.hero}>
            <View style={{ gap: 12 }}>
              <Text style={styles.heroTitle}>{p.heroTitle}</Text>
              <Text style={styles.heroText}>{p.heroText}</Text>
            </View>
            <View style={styles.heroVisual}>
              <Image source={require('@/assets/images/hero.jpg')} style={StyleSheet.absoluteFill} resizeMode="cover" />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                locations={[0.25, 0.75]}
                start={{ x: 0.25, y: 0 }}
                end={{ x: 0.75, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={{ gap: 8 }}>
              <Text style={styles.cardTitle}>{p.cardTitle}</Text>
              <Text style={styles.cardText}>{p.cardText}</Text>
            </View>

            {!!p.error && <Text style={styles.error}>{p.error}</Text>}

            <View style={{ gap: 20 }}>{p.children}</View>

            <Pressable
              style={({ pressed }) => [styles.submit, (pressed || p.loading) && { opacity: 0.85 }]}
              disabled={p.loading}
              onPress={() => p.onSubmit(remember)}
            >
              {p.loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitLabel}>{p.submitLabel}</Text>}
            </Pressable>

            <View style={styles.rowBetween}>
              <Pressable style={styles.remember} onPress={() => setRemember(!remember)} hitSlop={8}>
                <View style={styles.checkbox}>{remember && <Check size={12} color={colors.primary} strokeWidth={2} />}</View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>
              <Pressable onPress={p.onFooterLink} hitSlop={8}>
                <Text style={styles.link}>{p.footerLink}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// One labelled input, styled like the Figma auth fields
export function AuthField({ label, link, ...inputProps }: { label: string; link?: string } & TextInputProps) {
  return (
    <View style={styles.group}>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>{label}</Text>
        {!!link && <Text style={styles.link}>{link}</Text>}
      </View>
      <TextInput style={styles.input} placeholderTextColor={colors.auth.muted} {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.auth.bg },
  content: { gap: 24, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brand: { fontFamily: fonts.bold, fontSize: 24, color: colors.white },
  hero: { gap: 16 },
  heroTitle: { fontFamily: fonts.extrabold, fontSize: 40, lineHeight: 46, color: colors.white },
  heroText: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.auth.muted },
  heroVisual: { height: 220, borderRadius: 24, overflow: 'hidden' },
  card: {
    gap: 24,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.auth.border,
    backgroundColor: colors.auth.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  cardTitle: { fontFamily: fonts.bold, fontSize: 32, color: colors.white },
  cardText: { fontFamily: fonts.regular, fontSize: 16, color: colors.auth.muted },
  error: { fontFamily: fonts.medium, fontSize: 14, color: '#FF8A80' },
  group: { gap: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
  link: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  input: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.auth.border,
    backgroundColor: colors.auth.bg,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  submit: { height: 56, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  submitLabel: { fontFamily: fonts.semibold, fontSize: 16, color: colors.white },
  remember: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.auth.border,
    backgroundColor: colors.auth.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberText: { fontFamily: fonts.regular, fontSize: 14, color: colors.auth.muted },
});
