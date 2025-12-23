import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { useAppSelector } from '@/store/hooks';

export default function AuthLayout() {
  const { isAuthenticated, hasHydrated } = useAppSelector((s) => s.auth);

  if (!hasHydrated) return null;

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forget-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
