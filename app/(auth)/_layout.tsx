import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forget-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
