import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen, Button } from '@/components/ui';
import { colors, fonts } from '@/theme';
import { clearUser } from '@/api';

// Not in Figma: placeholder
export default function SettingsScreen() {
  return (
    <AppScreen gap={24} edges={['top']}>
      <Text style={styles.heading}>Settings</Text>
      <View style={{ gap: 12 }}>
        <Button
          label="Sign out"
          variant="secondary"
          onPress={async () => {
            await clearUser();
            router.replace('/login');
          }}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, color: colors.white },
});
