import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppScreen, SessionRow } from '@/components/ui';
import { mockSessions, getVehicle } from '@/mockData';
import { colors, fonts } from '@/theme';

// Not in Figma: all sessions, using the "Recent session" row from Vehicle detail
export default function SessionsScreen() {
  return (
    <AppScreen gap={24} edges={['top']}>
      <Text style={styles.heading}>Sessions</Text>
      <View style={{ gap: 10 }}>
        {mockSessions.map((s) => (
                    <SessionRow
            key={s.id}
            title={`${getVehicle(s.vehicleId)?.name ?? 'Vehicle'} · ${s.dateLabel}`}
            subtitle={`${s.powerHp} hp · ${s.torqueLbFt} lb-ft`}
            value={`${s.zeroToHundredS.toFixed(1)} s`}
            valueLabel="0–100 km/h"
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
