import { useColorScheme } from "@/hooks/use-color-scheme";
import { setAuthExpiredHandler } from "@/services/authSession";
import { fetchCurrentUser, hydrateAuth, logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { store } from "@/store/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { Toaster } from "sonner-native";
import "./globals.css";
import useUserStatusSocket from "@/hooks/useUserStatusSocket";
import useNotificationSocket from "@/hooks/socket-events/useNotificationSocket";
import useInventoryEvents from "@/hooks/socket-events/useInventoryEvents";
import useSalesOrderEvents from "@/hooks/socket-events/useSalesOrderEvents";
import { connectSocket, disconnectSocket } from "@/utils/socketManager";
import useSubscribeRooms from "@/hooks/useSubscribeRooms";
import useProductEvents from "@/hooks/socket-events/useProductEvents";
import usePreparationEvents from "@/hooks/socket-events/usePreparationEvents";
import useFinanceAREvents from "@/hooks/socket-events/useFinanceAREvents";

export const unstable_settings = {};

// Keep splash screen visible while hydrating
SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasFetchedProfile, hasHydrated, user, token } =
    useAppSelector((s) => s.auth);
    
  // Realtime hooks
  useUserStatusSocket();
  useNotificationSocket();
  useInventoryEvents();
  useSalesOrderEvents();
  useProductEvents();
  usePreparationEvents();
  useFinanceAREvents();
  
  // Subscribe to basic rooms
  useSubscribeRooms([
    'room:sales_orders', 
    'room:inventory', 
    'room:preparation', 
    'room:finance_ar'
  ]);

  // Connect/Disconnect socket based on auth state
  useEffect(() => {
    if (isAuthenticated && token) {
      connectSocket(token);
    } else {
      if (hasHydrated) {
        disconnectSocket();
      }
    }
  }, [isAuthenticated, token, hasHydrated]);
  useEffect(() => {
    if (!hasHydrated) {
      void dispatch(hydrateAuth());
    } else {
      void SplashScreen.hideAsync();
    }
  }, [dispatch, hasHydrated]);

  // Auto-login after hydration for remembered users
  useEffect(() => {
    if (hasHydrated && isAuthenticated && !hasFetchedProfile) {
      void dispatch(fetchCurrentUser());
    }
  }, [hasHydrated, isAuthenticated, hasFetchedProfile, dispatch]);

  useEffect(() => {
    setAuthExpiredHandler(() => {
      dispatch(logout());
      router.replace("/login");
    });
    return () => setAuthExpiredHandler(null);
  }, [dispatch, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(seller)" options={{ headerShown: false }} />
        <Stack.Screen name="(manager)" options={{ headerShown: false }} />
        <Stack.Screen name="(accountant)" options={{ headerShown: false }} />
        <Stack.Screen name="(picker)" options={{ headerShown: false }} />
        <Stack.Screen name="(sup_picker)" options={{ headerShown: false }} />
        <Stack.Screen name="(shipper)" options={{ headerShown: false }} />
        <Stack.Screen name="(sup_shipper)" options={{ headerShown: false }} />
        <Stack.Screen name="(shared)" options={{ headerShown: false }} />
        <Stack.Screen
          name="change-password"
          options={{
            title: "Đổi mật khẩu",
            headerTitleAlign: "center",
          }}
        />
      </Stack>
      <Toaster
        position="top-center" // Vị trí: 'top-center', 'bottom-center', ...
        richColors={true} // Khuyên dùng: Tự động tô màu Xanh (Success) / Đỏ (Error)
        closeButton={true} // Tùy chọn: Hiện nút X để tắt nhanh
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
