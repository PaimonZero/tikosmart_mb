import { Redirect, Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import CustomHomeHeader from "@/components/homepage/CustomHomeHeader";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppSelector } from "@/store/hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ShipperTabLayout() {
    const { isAuthenticated, hasHydrated } = useAppSelector((s) => s.auth);

    if (!hasHydrated) return null;

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#007AFF",
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Trang chủ",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                    header: () => <CustomHomeHeader />,
                }}
            />
            <Tabs.Screen
                name="deliveryRuns"
                options={{
                    title: "Giao hàng",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="truck-delivery" size={24} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Tài khoản",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="person.fill" color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
