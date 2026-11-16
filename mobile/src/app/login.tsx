import { useState } from 'react';
import { router } from 'expo-router';
import { AuthScreen, AuthField } from '@/components/AuthScreen';
import { login, saveUser } from '@/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (remember: boolean) => {
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await login(username.trim(), password);
      await saveUser(user, remember);
      router.replace('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      heroTitle="Welcome back"
      heroText="Log in to view your garage and pick up where your last run left off."
      cardTitle="Sign in"
      cardText="Enter your details below."
      submitLabel="Sign in"
      footerLink="Sign up"
      onFooterLink={() => router.replace('/register')}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    >
      <AuthField label="Username" placeholder="Enter your username" value={username} onChangeText={setUsername} autoCapitalize="none" autoComplete="username" />
      <AuthField label="Password" link="Forgot password?" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" />
    </AuthScreen>
  );
}
