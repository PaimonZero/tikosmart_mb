import { Redirect, Stack } from "expo-router";
import React from "react";

import { useAppSelector } from "@/store/hooks";

export default function AuthLayout() {
  const { isAuthenticated, hasHydrated, user } = useAppSelector((s) => s.auth);

  // Wait for hydration to complete
  if (!hasHydrated) return null;

  // Redirect authenticated users to dashboard immediately
  // Background refresh will happen in root layout
  if (isAuthenticated && user) {
    const roleRoutes: Record<string, string> = {
      admin: "/(admin)/dashboard",
      manager: "/(manager)/dashboard",
      accountant: "/(accountant)/dashboard",
      picker: "/(picker)/dashboard",
      sup_picker: "/(sup_picker)/dashboard",
      shipper: "/(shipper)/dashboard",
      sup_shipper: "/(sup_shipper)/dashboard",
      seller: "/(seller)/dashboard",
    };
    const dashboardRoute = roleRoutes[user.role] || "/(seller)/dashboard";
    return <Redirect href={dashboardRoute as any} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forget-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
