import { ReactNode } from 'react';
import { ScrollView, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { AppHeader } from './AppHeader';
import { colors } from '../../theme/colors';
import { mockUser } from '../../data/mock';

type Props = {
  children: ReactNode;
  showHeader?: boolean;
  gap?: number;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Edge[]; // tab screens leave 'bottom' to the tab bar
};

// Standard signed-in screen: safe area + optional app header + scrolling content
export function AppScreen({ children, showHeader = true, gap = 20, contentStyle, edges = ['top', 'bottom'] }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {showHeader && <AppHeader initials={mockUser.initials} />}
      <ScrollView contentContainerStyle={[styles.content, { gap }, contentStyle]} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.app.bg },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 28 },
});
