import { router } from 'expo-router';
import { AuthScreen } from '../../components/AuthScreen';

export default function LoginScreen() {
  return (
    <AuthScreen
      heroTitle="Welcome back"
      heroText="Log in to your account to continue exploring the infinite possibilities of your workspace."
      cardTitle="Sign in"
      cardText="Enter your details below."
      passwordLabel="Password"
      passwordLink="Forgot password?"
      submitLabel="Sign in"
      footerLink="Sign up"
      onFooterLink={() => router.replace('/register')}
      // TODO: call AuthService.login() once the API endpoint is confirmed
      onSubmit={() => router.replace('/home')}
    />
  );
}
