import { useState } from 'react';
import { router } from 'expo-router';
import { AuthScreen, AuthField } from '@/components/AuthScreen';
import { register, login, saveUser } from '@/api';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (remember: boolean) => {
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        login: username.trim(),
        email: email.trim(),
        password,
      });
      // /register only returns a userId, so log in right after to get the full user
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
      heroTitle="Create an account"
      heroText="Sign up to start logging runs and tracking your car’s performance with Accelly."
      cardTitle="Sign up"
      cardText="Create your account details below."
      submitLabel="Create account"
      footerLink="Log in"
      onFooterLink={() => router.replace('/login')}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    >
      <AuthField label="First name" placeholder="First name" value={firstName} onChangeText={setFirstName} autoComplete="given-name" />
      <AuthField label="Last name" placeholder="Last name" value={lastName} onChangeText={setLastName} autoComplete="family-name" />
      <AuthField label="Username" placeholder="Choose a username" value={username} onChangeText={setUsername} autoCapitalize="none" autoComplete="username-new" />
      <AuthField label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <AuthField label="Create password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password-new" />
    </AuthScreen>
  );
}
