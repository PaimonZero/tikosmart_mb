import { useColorScheme } from "@/hooks/use-color-scheme";
import { setAuthExpiredHandler } from "@/services/authSession";
import { fetchCurrentUser, hydrateAuth, logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { store } from "@/store/store";
import { fetchNotifications } from "@/store/notificationSlice";
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
import CustomSplash from "@/components/CustomSplash";
import useUserStatusSocket from "@/hooks/useUserStatusSocket";
import useNotificationSocket from "@/hooks/socket-events/useNotificationSocket";
import useInventoryEvents from "@/hooks/socket-events/useInventoryEvents";
import useSalesOrderEvents from "@/hooks/socket-events/useSalesOrderEvents";
import { connectSocket, disconnectSocket } from "@/utils/socketManager";
import useSubscribeRooms from "@/hooks/useSubscribeRooms";
import useProductEvents from "@/hooks/socket-events/useProductEvents";
import usePreparationEvents from "@/hooks/socket-events/usePreparationEvents";
import useFinanceAREvents from "@/hooks/socket-events/useFinanceAREvents";
import useDeliveryEvents from "@/hooks/socket-events/useDeliveryEvents";
import useGlobalTracking from "@/hooks/useGlobalTracking";
import "@/utils/locationTask";
import VoiceAssistantFloatingButton from "@/components/voiceAssistant/VoiceAssistantFloatingButton";

export const unstable_settings = {};

// Keep splash screen visible while hydrating
SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasFetchedProfile, hasHydrated, user, token } =
    useAppSelector((s) => s.auth);
  const [isSplashAnimationDone, setSplashAnimationDone] = React.useState(false);
    
  // Realtime hooks
  useUserStatusSocket();
  useNotificationSocket();
  useInventoryEvents();
  useSalesOrderEvents();
  useProductEvents();
  usePreparationEvents();
  useFinanceAREvents();
  useDeliveryEvents();
  
  // Global GPS tracking (auto-starts when shipper has active run)
  useGlobalTracking();
  
  // Subscribe to basic rooms
  useSubscribeRooms([
    'room:sales_orders', 
    'room:inventory', 
    'room:preparation', 
    'room:finance_ar',
    'room:deliveries'
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
    
    // Fetch initial notifications for the badge count
    if (hasHydrated && isAuthenticated && hasFetchedProfile) {
      dispatch(fetchNotifications({ limit: 15, offset: 0 }));
    }
  }, [hasHydrated, isAuthenticated, hasFetchedProfile, dispatch]);

  useEffect(() => {
    setAuthExpiredHandler(() => {
      dispatch(logout());
      router.replace("/login");
    });
    return () => setAuthExpiredHandler(null);
  }, [dispatch, router]);

  const isAppReady = hasHydrated && (!isAuthenticated || hasFetchedProfile);

  return (
    <ThemeProvider value={DefaultTheme}>
      {!isSplashAnimationDone && (
        <CustomSplash 
          isAppReady={isAppReady} 
          onAnimationFinish={() => setSplashAnimationDone(true)} 
        />
      )}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
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
      <VoiceAssistantFloatingButton />
      <StatusBar style="dark" />
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
