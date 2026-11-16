import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { APP_MARK_XML, RIM_ICON_XML } from '../../assets/brand/svgs';
import { colors } from '../../theme/colors';

// Round 40px mark used in the app header
export function AppMark({ size = 40 }: { size?: number }) {
  return <SvgXml xml={APP_MARK_XML} width={size} height={size} />;
}

// Square 48px logo used on the login/register screens
export function AuthLogo() {
  return (
    <View style={styles.authLogo}>
      <SvgXml xml={RIM_ICON_XML} width={24} height={24} />
    </View>
  );
}

const styles = StyleSheet.create({
  authLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
