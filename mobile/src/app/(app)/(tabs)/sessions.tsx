import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen } from '../../../components/ui/AppScreen';
import { SessionRow } from '../../../components/ui/SessionRow';
import { mockSessions, getVehicle } from '../../../data/mock';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

// Not in Figma: all sessions, using the "Recent session" row from Vehicle detail
export default function SessionsScreen() {
  return (
    <AppScreen gap={24} edges={['top']}>
      <Text style={styles.heading}>Sessions</Text>
      <View style={{ gap: 10 }}>
        {mockSessions.map((s) => (
          <SessionRow
            key={s.id}
            session={s}
            title={`${getVehicle(s.vehicleId)?.name ?? 'Vehicle'} · ${s.dateLabel}`}
            onPress={() => router.push({ pathname: '/session/[id]', params: { id: s.id } })}
          />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, color: colors.white },
});
