import { router } from 'expo-router';
import { AuthScreen } from '../../components/AuthScreen';

export default function RegisterScreen() {
  return (
    <AuthScreen
      heroTitle="Create an account"
      heroText="Sign up to start building, collaborating, and growing with Accelly."
      cardTitle="Sign up"
      cardText="Create your account details below."
      passwordLabel="Create password"
      passwordLink="Password requirements"
      submitLabel="Create account"
      footerLink="Log in"
      onFooterLink={() => router.replace('/login')}
      // TODO: call AuthService.register() once the API endpoint is confirmed
      onSubmit={() => router.replace('/home')}
    />
  );
}
