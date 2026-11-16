import { Stack } from 'expo-router';
import { colors } from '../../theme/colors';

// Signed-in area: the tab screens plus pushed screens (vehicle, session)
export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.app.bg } }} />;
}
