import { Redirect } from 'expo-router';

// App entry. No auth yet, so always start at login.
// TODO: once auth exists, redirect to /home when a stored token is found.
export default function Index() {
  return <Redirect href="/login" />;
}
