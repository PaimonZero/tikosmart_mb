import { useColorScheme } from '@/hooks/use-color-scheme';
import { setAuthExpiredHandler } from '@/services/authSession';
import { fetchCurrentUser, hydrateAuth, logout } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { store } from '@/store/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import './globals.css';
import { PaperProvider } from 'react-native-paper';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
};

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasFetchedProfile, hasHydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!hasHydrated) {
      void dispatch(hydrateAuth());
    }
  }, [dispatch, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && isAuthenticated && !hasFetchedProfile) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, hasHydrated, isAuthenticated, hasFetchedProfile]);

  useEffect(() => {
    setAuthExpiredHandler(() => {
      dispatch(logout());
      router.replace('/login');
    });
    return () => setAuthExpiredHandler(null);
  }, [dispatch, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{
          title: 'Đổi mật khẩu',
          headerTitleAlign: 'center',
        }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <Toaster
        position="top-center"  // Vị trí: 'top-center', 'bottom-center', ...
        richColors={true}      // Khuyên dùng: Tự động tô màu Xanh (Success) / Đỏ (Error)
        closeButton={true}     // Tùy chọn: Hiện nút X để tắt nhanh
      />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <RootLayoutInner />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
