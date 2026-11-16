import { Text, ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, CarFront, ChartNoAxesCombined, Settings2 } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

type Icon = typeof House;

// Figma: "Bottom navigation". Built-in tab bar styled to match the design.
export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const tab = (label: string, Icon: Icon) => ({
    tabBarIcon: ({ color }: { color: ColorValue }) => <Icon size={20} color={color as string} strokeWidth={1.7} />,
    tabBarLabel: ({ focused, color }: { focused: boolean; color: ColorValue }) => (
      <Text style={{ fontSize: 11, color, fontFamily: focused ? fonts.semibold : fonts.regular, marginTop: 6 }}>{label}</Text>
    ),
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.app.bg },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.app.textMuted,
        tabBarStyle: {
          backgroundColor: colors.app.bg,
          borderTopColor: colors.app.border,
          borderTopWidth: 1,
          height: 69 + insets.bottom,
          paddingTop: 15,
          paddingBottom: 15 + insets.bottom,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen name="home" options={tab('Home', House)} />
      <Tabs.Screen name="garage" options={tab('Garage', CarFront)} />
      <Tabs.Screen name="sessions" options={tab('Sessions', ChartNoAxesCombined)} />
      <Tabs.Screen name="settings" options={tab('Settings', Settings2)} />
    </Tabs>
  );
}
