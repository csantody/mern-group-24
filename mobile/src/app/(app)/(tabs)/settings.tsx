import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen } from '../../../components/ui/AppScreen';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

// Not in Figma: placeholder
export default function SettingsScreen() {
  return (
    <AppScreen gap={24} edges={['top']}>
      <Text style={styles.heading}>Settings</Text>
      <View style={{ gap: 12 }}>
        <Button label="Sensor test (dev)" variant="secondary" onPress={() => router.push('/dev-recorder')} />
        {/* TODO: AuthService.logout() + clear SecureStore token */}
        <Button label="Sign out" variant="secondary" onPress={() => router.replace('/login')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, color: colors.white },
});
