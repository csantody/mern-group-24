import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { loadUser, User } from '@/api';

// App entry: go to Home if a user was remembered, otherwise Login
export default function Index() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    loadUser().then(setUser);
  }, []);

  if (user === undefined) return null; // still checking storage
  return <Redirect href={user ? '/home' : '/login'} />;
}
